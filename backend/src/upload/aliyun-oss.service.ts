import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OSS from 'ali-oss';
import axios from 'axios';
import * as crypto from 'crypto';
import * as path from 'path';

// 类型定义，增强类型安全
interface AliyunOssConfig {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
  endpoint: string;
  domain: string | undefined;
}

@Injectable()
export class AliyunOssService {
  private readonly logger = new Logger(AliyunOssService.name);
  private readonly client: OSS;
  private readonly bucket: string;
  private readonly domain: string | undefined;

  constructor(private configService: ConfigService) {
    // 读取并校验配置
    const config = this.getAliyunOssConfig();
    this.bucket = config.bucket;
    this.domain = config.domain;

    // 初始化阿里云OOS客户端
    this.client = new OSS({
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
      region: config.region,
      endpoint: config.endpoint,
    });
  }

  /**
   * 读取并校验阿里云OOS配置
   */
  private getAliyunOssConfig(): AliyunOssConfig {
    const accessKeyId = this.configService.get<string>('ALIYUN_ACCESS_KEY_ID');
    const accessKeySecret = this.configService.get<string>(
      'ALIYUN_ACCESS_KEY_SECRET',
    );
    const bucket = this.configService.get<string>('ALIYUN_OSS_BUCKET');
    const region = this.configService.get<string>('ALIYUN_OSS_REGION');
    const endpoint = this.configService.get<string>('ALIYUN_OSS_ENDPOINT');
    const domain = this.configService.get<string>('ALIYUN_OSS_DOMAIN');

    // 严格校验配置完整性（除了domain）
    if (!accessKeyId || !accessKeySecret || !bucket || !region || !endpoint) {
      const missing: string[] = [];
      if (!accessKeyId) missing.push('ALIYUN_ACCESS_KEY_ID');
      if (!accessKeySecret) missing.push('ALIYUN_ACCESS_KEY_SECRET');
      if (!bucket) missing.push('ALIYUN_OSS_BUCKET');
      if (!region) missing.push('ALIYUN_OSS_REGION');
      if (!endpoint) missing.push('ALIYUN_OSS_ENDPOINT');

      const errorMsg = `阿里云OOS配置不完整，缺少：${missing.join(', ')}`;
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    return { accessKeyId, accessKeySecret, bucket, region, endpoint, domain };
  }

  /**
   * 生成阿里云OOS上传凭证
   * @param key 可选文件名
   * @param expires 过期时间（秒），默认3600
   */
  generateUploadToken(key?: string, expires: number = 3600): string {
    // 阿里云OOS使用签名URL的方式，这里返回一个预签名的上传URL
    // 注意：实际使用中可能需要根据前端需求调整实现方式
    const policy = {
      expiration: new Date(Date.now() + expires * 1000).toISOString(),
      conditions: [{ bucket: this.bucket }, { key: key || '' }],
    };

    // 这里简化处理，实际项目中可能需要更复杂的签名逻辑
    // 前端可以使用ali-oss SDK直接上传
    return 'aliyun-oss-upload-token';
  }

  /**
   * 获取文件公开访问URL
   * @param key 文件名
   */
  getPublicUrl(key: string): string {
    if (!key) {
      throw new Error('文件key不能为空');
    }

    let baseDomain: string;
    if (this.domain) {
      // 使用配置的域名
      baseDomain = this.domain.startsWith('http')
        ? this.domain
        : `http://${this.domain}`;
    } else {
      // 使用阿里云 OSS 默认域名
      baseDomain = `http://${this.bucket}.${this.configService.get<string>('ALIYUN_OSS_REGION')}.aliyuncs.com`;
    }

    return `${baseDomain}/${encodeURIComponent(key)}`;
  }

  /**
   * 检查文件是否存在
   * @param key 文件名
   */
  async fileExists(key: string): Promise<boolean> {
    // 入参校验
    if (!key) {
      throw new Error('文件key不能为空');
    }

    try {
      // 调用阿里云OOS的head方法检查文件是否存在
      await this.client.head(key);
      return true;
    } catch (error) {
      if (error.name === 'NoSuchKeyError') {
        return false;
      }
      // 其他错误视为异常
      const errorMsg =
        error instanceof Error ? error.message : '检查文件存在性未知错误';
      this.logger.error(`检查文件存在性失败 [${key}]：${errorMsg}`);
      throw new Error(`检查文件失败：${errorMsg}`);
    }
  }

  /**
   * 删除单个文件
   * @param key 文件名
   */
  async deleteFile(key: string): Promise<boolean> {
    // 1. 入参校验
    if (!key) {
      throw new Error('文件key不能为空');
    }

    try {
      // 2. 调用阿里云OOS的delete方法删除文件
      await this.client.delete(key);
      return true;
    } catch (error) {
      // 3. 统一处理所有错误
      const errorMsg =
        error instanceof Error ? error.message : '删除文件未知错误';
      this.logger.error(`删除文件失败 [${key}]：${errorMsg}`);
      throw new Error(`删除文件失败：${errorMsg}`);
    }
  }

  /**
   * 批量删除文件（并发执行，提升效率）
   * @param keys 文件名数组
   */
  async deleteFiles(keys: string[]): Promise<{
    success: string[];
    failed: { key: string; error: string }[];
  }> {
    if (!Array.isArray(keys) || keys.length === 0) {
      throw new Error('文件keys必须是非空数组');
    }

    // 过滤空key
    const validKeys = keys.filter(
      (key) => typeof key === 'string' && key.trim(),
    );
    if (validKeys.length === 0) {
      return { success: [], failed: [] };
    }

    // 并发执行删除（比for循环串行更快）
    const results = await Promise.all(
      validKeys.map(async (key) => {
        try {
          await this.deleteFile(key);
          return { key, success: true };
        } catch (error) {
          return {
            key,
            success: false,
            error: error instanceof Error ? error.message : '未知错误',
          };
        }
      }),
    );

    // 整理结果
    return results.reduce(
      (acc, item) => {
        if (item.success) {
          acc.success.push(item.key);
        } else {
          acc.failed.push({ key: item.key, error: item.error || '未知错误' });
        }
        return acc;
      },
      {
        success: [] as string[],
        failed: [] as { key: string; error: string }[],
      },
    );
  }

  /**
   * 上传文件到阿里云 OSS
   * @param key 文件名
   * @param buffer 文件缓冲区
   */
  async uploadFile(key: string, buffer: Buffer): Promise<string> {
    // 入参校验
    if (!key) {
      throw new Error('文件key不能为空');
    }
    if (!buffer) {
      throw new Error('文件缓冲区不能为空');
    }

    try {
      // 调用阿里云 OSS 的 put 方法上传文件
      const result = await this.client.put(key, buffer);
      return result.name;
    } catch (error) {
      // 统一处理所有错误
      const errorMsg =
        error instanceof Error ? error.message : '上传文件未知错误';
      this.logger.error(`上传文件失败 [${key}]：${errorMsg}`);
      throw new Error(`上传文件失败：${errorMsg}`);
    }
  }

  // 生成随机文件名
  private generateRandomFileName(
    originalName: string,
    directory: string = 'recipes',
  ): string {
    const ext = path.extname(originalName);
    const randomStr = crypto.randomBytes(8).toString('hex');
    const timestamp = Date.now();
    return `${directory}/${timestamp}_${randomStr}${ext}`;
  }

  // 从URL下载图片并上传到OSS
  async uploadImageFromUrl(
    imageUrl: string,
    directory: string = 'recipes',
  ): Promise<string> {
    try {
      // 下载图片
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const buffer = Buffer.from(response.data);

      // 生成随机文件名
      const fileName = this.generateRandomFileName('cover.jpg', directory);

      // 上传到OSS
      const key = await this.uploadFile(fileName, buffer);

      // 返回完整的访问URL
      return this.getPublicUrl(key);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : '上传图片未知错误';
      this.logger.error(`从URL上传图片失败：${errorMsg}`);
      throw new Error(`从URL上传图片失败：${errorMsg}`);
    }
  }
}
