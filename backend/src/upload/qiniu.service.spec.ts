import { Test, TestingModule } from '@nestjs/testing';
import { QiniuService } from './qiniu.service';
import { ConfigService } from '@nestjs/config';
import * as qiniu from 'qiniu';

// 模拟七牛云SDK
const mockStat = jest.fn();
const mockDeleteMethod = jest.fn();

jest.mock('qiniu', () => ({
  auth: {
    digest: {
      Mac: jest.fn().mockImplementation((accessKey, secretKey) => ({
        accessKey: accessKey as string,
        secretKey: secretKey as string,
      })),
    },
  },
  conf: {
    Config: jest.fn().mockImplementation(() => ({
      zone: null,
    })),
  },
  zone: {
    Zone_z0: 'Zone_z0',
  },
  rs: {
    PutPolicy: jest.fn().mockImplementation(() => ({
      uploadToken: jest.fn().mockReturnValue('mock-upload-token'),
    })),
    BucketManager: jest.fn().mockImplementation(() => ({
      stat: mockStat,
      delete: mockDeleteMethod,
    })),
  },
}));

describe('QiniuService', () => {
  let service: QiniuService;

  beforeEach(async () => {
    // 重置所有mock
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QiniuService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const config = {
                QINIU_ACCESS_KEY: 'test-access-key',
                QINIU_SECRET_KEY: 'test-secret-key',
                QINIU_BUCKET: 'test-bucket',
                QINIU_DOMAIN: 'test-domain.com',
              };
              return config[key as keyof typeof config];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<QiniuService>(QiniuService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('generateUploadToken', () => {
    it('should generate upload token without key', () => {
      const token = service.generateUploadToken();
      expect(token).toBe('mock-upload-token');
      expect(qiniu.rs.PutPolicy).toHaveBeenCalledWith({
        scope: 'test-bucket',
        expires: 3600,
      });
    });

    it('should generate upload token with key', () => {
      const token = service.generateUploadToken('test-file.jpg', 7200);
      expect(token).toBe('mock-upload-token');
      expect(qiniu.rs.PutPolicy).toHaveBeenCalledWith({
        scope: 'test-bucket:test-file.jpg',
        expires: 7200,
      });
    });
  });

  describe('getPublicUrl', () => {
    it('should return correct public url', () => {
      const url = service.getPublicUrl('test-file.jpg');
      expect(url).toBe('http://test-domain.com/test-file.jpg');
    });

    it('should encode special characters in key', () => {
      const url = service.getPublicUrl('test file.jpg');
      expect(url).toBe('http://test-domain.com/test%20file.jpg');
    });
  });

  describe('fileExists', () => {
    it('should return true if file exists', async () => {
      // 模拟文件存在的情况
      mockStat.mockImplementation(
        (
          bucket: string,
          key: string,
          callback: (err: Error | null, info: any, res: any) => void,
        ) => {
          callback(null, { hash: 'test-hash' }, { statusCode: 200 });
        },
      );

      const exists = await service.fileExists('test-file.jpg');
      expect(exists).toBe(true);
      expect(mockStat).toHaveBeenCalledWith(
        'test-bucket',
        'test-file.jpg',
        expect.any(Function),
      );
    });

    it('should return false if file does not exist', async () => {
      // 模拟文件不存在的情况
      mockStat.mockImplementation((bucket, key, callback) => {
        callback(null, null, { statusCode: 612 });
      });

      const exists = await service.fileExists('test-file.jpg');
      expect(exists).toBe(false);
    });

    it('should throw error on unexpected status code', async () => {
      // 模拟非预期状态码
      mockStat.mockImplementation((bucket, key, callback) => {
        callback(null, null, { statusCode: 500 });
      });

      await expect(service.fileExists('test-file.jpg')).rejects.toThrow();
    });

    it('should throw error on API error', async () => {
      // 模拟API错误
      mockStat.mockImplementation((bucket, key, callback) => {
        callback(new Error('API Error'), null, null);
      });

      await expect(service.fileExists('test-file.jpg')).rejects.toThrow(
        'API Error',
      );
    });
  });

  describe('deleteFile', () => {
    it('should successfully delete file', async () => {
      // 模拟删除成功
      mockDeleteMethod.mockImplementation((bucket, key, callback) => {
        callback(null, {}, { statusCode: 200 });
      });

      const result = await service.deleteFile('test-file.jpg');
      expect(result).toBe(true);
      expect(mockDeleteMethod).toHaveBeenCalledWith(
        'test-bucket',
        'test-file.jpg',
        expect.any(Function),
      );
    });

    it('should throw error on deletion failure', async () => {
      // 模拟删除失败
      mockDeleteMethod.mockImplementation((bucket, key, callback) => {
        callback(null, null, { statusCode: 500 });
      });

      await expect(service.deleteFile('test-file.jpg')).rejects.toThrow();
    });

    it('should throw error on API error', async () => {
      // 模拟API错误
      mockDeleteMethod.mockImplementation((bucket, key, callback) => {
        callback(new Error('API Error'), null, null);
      });

      await expect(service.deleteFile('test-file.jpg')).rejects.toThrow(
        'API Error',
      );
    });
  });

  describe('deleteFiles', () => {
    it('should delete multiple files successfully', async () => {
      // 模拟删除成功
      // mockDelete.mockImplementation((bucket, key, callback) => {
      //   callback(null, {}, { statusCode: 200 });
      // });

      const result = await service.deleteFiles(['file1.jpg', 'file2.jpg']);
      expect(result.success).toEqual(['file1.jpg', 'file2.jpg']);
      expect(result.failed).toHaveLength(0);
    });

    it('should handle partial deletion failures', async () => {
      // 模拟部分删除失败
      let callCount = 0;
      // mockDelete.mockImplementation((bucket, key, callback) => {
      //   if (callCount === 0) {
      //     callback(null, {}, { statusCode: 200 });
      //   } else {
      //     callback(new Error('Delete Error'), null, null);
      //   }
      //   callCount++;
      // });

      const result = await service.deleteFiles(['file1.jpg', 'file2.jpg']);
      expect(result.success).toEqual(['file1.jpg']);
      expect(result.failed).toHaveLength(1);
      expect(result.failed[0].key).toBe('file2.jpg');
    });
  });
});
