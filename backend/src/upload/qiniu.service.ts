import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as qiniu from 'qiniu';

// 类型定义，增强类型安全
interface QiniuConfig {
  accessKey: string;
  secretKey: string;
  bucket: string;
  domain: string;
}

interface QiniuRespInfo {
  statusCode: number; // 核心字段，必存在
  [key: string]: any; // 其他可能的字段（如 headers、error 等），用索引签名兼容
}

@Injectable()
export class QiniuService {
  private readonly logger = new Logger(QiniuService.name);
  private readonly mac: qiniu.auth.digest.Mac;
  private readonly config: qiniu.conf.Config;
  private readonly bucketManager: qiniu.rs.BucketManager;
  private readonly bucket: string;
  private readonly domain: string;

  // 关键：显式声明 bucketStat 的类型（解决“属性不存在”报错）
  private readonly bucketStat: (
    bucket: string,
    key: string,
  ) => Promise<[any, QiniuRespInfo]>;

  // 同理声明 bucketDelete 的类型（如果 deleteFile 也报类似错误）
  private readonly bucketDelete: (
    bucket: string,
    key: string,
  ) => Promise<[any, QiniuRespInfo]>;

  constructor(private configService: ConfigService) {
    // 读取并校验配置（非空断言）
    const config = this.getQiniuConfig();
    this.bucket = config.bucket;
    this.domain = config.domain;

    // 初始化七牛云核心实例（确保不为空）
    this.mac = new qiniu.auth.digest.Mac(config.accessKey, config.secretKey);
    this.config = new qiniu.conf.Config();
    this.config.zone = qiniu.zone.Zone_z0; // 华东区域，可根据配置动态调整
    this.bucketManager = new qiniu.rs.BucketManager(this.mac, this.config);
  }

  /**
   * 读取并校验七牛云配置
   */
  private getQiniuConfig(): QiniuConfig {
    const accessKey = this.configService.get<string>('QINIU_ACCESS_KEY');
    const secretKey = this.configService.get<string>('QINIU_SECRET_KEY');
    const bucket = this.configService.get<string>('QINIU_BUCKET');
    const domain = this.configService.get<string>('QINIU_DOMAIN');

    // 严格校验配置完整性
    if (!accessKey || !secretKey || !bucket || !domain) {
      const missing: string[] = [];
      if (!accessKey) missing.push('QINIU_ACCESS_KEY');
      if (!secretKey) missing.push('QINIU_SECRET_KEY');
      if (!bucket) missing.push('QINIU_BUCKET');
      if (!domain) missing.push('QINIU_DOMAIN');

      const errorMsg = `七牛云配置不完整，缺少：${missing.join(', ')}`;
      this.logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    return { accessKey, secretKey, bucket, domain };
  }

  /**
   * 生成七牛云上传凭证
   * @param key 可选文件名（不传则由七牛云自动生成）
   * @param expires 过期时间（秒），默认3600
   */
  generateUploadToken(key?: string, expires: number = 3600): string {
    const options: qiniu.rs.PutPolicyOptions = {
      scope: key ? `${this.bucket}:${key}` : this.bucket,
      expires,
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(this.mac);
  }

  /**
   * 获取文件公开访问URL
   * @param key 文件名
   */
  getPublicUrl(key: string): string {
    if (!key) {
      throw new Error('文件key不能为空');
    }
    // 确保域名格式正确（处理可能的协议前缀）
    const baseDomain = this.domain.startsWith('http')
      ? this.domain
      : `http://${this.domain}`;
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
      // 调用转换后的Promise方法，等待结果
      const result = await this.bucketStat(this.bucket, key);
      const respInfo = result[1];

      // 处理响应状态码
      switch (respInfo?.statusCode) {
        case 200:
          // 200表示文件存在
          return true;
        case 612:
          // 612是七牛云定义的"文件不存在"状态码
          return false;
        default:
          // 其他状态码视为异常（如403权限不足、500服务器错误等）
          {
            const errorMsg = `检查文件存在性异常，状态码：${respInfo.statusCode}`;
            this.logger.error(`检查文件存在性异常 [${key}]：${errorMsg}`);
            throw new Error(errorMsg);
          }
          this.logger.error(
            `检查文件存在性异常 [${key}]：检查文件存在性异常，状态码：${respInfo.statusCode}`,
          );
          throw new Error(`检查文件存在性异常，状态码：${respInfo.statusCode}`);
      }
    } catch (error) {
      // 捕获所有错误（API调用失败、状态码异常等）
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
      // 2. 正确包裹七牛云的回调方法为 Promise（核心修复）
      const result = await new Promise<[any, QiniuRespInfo]>(
        (resolve, reject) => {
          this.bucketManager.delete(
            this.bucket,
            key,
            (err, respBody, respInfo) => {
              if (err) {
                // 回调错误直接 reject
                reject(err);
              } else {
                // 成功时将响应体和响应信息一起 resolve
                resolve([respBody, respInfo as QiniuRespInfo]);
              }
            },
          );
        },
      );

      // 3. 校验响应状态码
      if (result[1].statusCode === 200) {
        return true;
      } else {
        const errorMsg = `删除文件异常，状态码：${result[1].statusCode}`;
        this.logger.error(`删除文件异常 [${key}]：${errorMsg}`);
        throw new Error(errorMsg);
      }
    } catch (error) {
      // 4. 统一处理所有错误
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
}
