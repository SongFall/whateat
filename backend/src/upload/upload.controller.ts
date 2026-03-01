import {
  Controller,
  Get,
  Delete,
  Post,
  Query,
  Body,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AliyunOssService } from './aliyun-oss.service';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 上传凭证请求参数
interface UploadTokenRequest {
  key?: string;
  expires?: number;
}

// 文件URL请求参数
interface FileUrlRequest {
  key: string;
}

// 文件存在性检查请求参数
interface FileExistsRequest {
  key: string;
}

// 删除单个文件请求参数
interface DeleteFileRequest {
  key: string;
}

// 批量删除文件请求参数
interface DeleteFilesRequest {
  keys: string[];
}

@Controller('upload')
export class UploadController {
  private readonly logger = new Logger(UploadController.name);

  constructor(
    private readonly aliyunOssService: AliyunOssService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 获取阿里云OOS上传凭证
   * @param request 上传凭证请求参数
   * @returns 上传凭证
   */
  @Get('token')
  getUploadToken(@Query() request: UploadTokenRequest) {
    try {
      const { key, expires = 3600 } = request;
      const token = this.aliyunOssService.generateUploadToken(key, expires);
      // 构建domain，当配置中没有时使用默认格式
      let domain = this.aliyunOssService['domain'];
      if (!domain) {
        // 使用阿里云 OSS 默认域名格式
        const bucket = this.aliyunOssService['bucket'];
        const region = this.configService.get<string>('ALIYUN_OSS_REGION');
        if (bucket && region) {
          domain = `http://${bucket}.${region}.aliyuncs.com`;
        }
      }
      
      return {
        success: true,
        data: {
          token,
          domain: domain || '', // 获取domain属性用于前端
          key: key || '',
        },
        message: '获取上传凭证成功',
      };
    } catch (error) {
      this.logger.error(
        `获取上传凭证失败: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new HttpException(
        {
          success: false,
          message: `获取上传凭证失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 获取文件URL
   * @param request 文件URL请求参数
   * @returns 文件URL
   */
  @Get('url')
  getFileUrl(@Query() request: FileUrlRequest) {
    try {
      const { key } = request;
      if (!key) {
        throw new HttpException(
          {
            success: false,
            message: '文件名不能为空',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const url = this.aliyunOssService.getPublicUrl(key);
      return {
        success: true,
        data: { url },
        message: '获取文件URL成功',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `获取文件URL失败: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new HttpException(
        {
          success: false,
          message: `获取文件URL失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 检查文件是否存在
   * @param request 文件存在性检查请求参数
   * @returns 文件存在状态
   */
  @Get('exists')
  async checkFileExists(@Query() request: FileExistsRequest) {
    try {
      const { key } = request;
      if (!key) {
        throw new HttpException(
          {
            success: false,
            message: '文件名不能为空',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const exists = await this.aliyunOssService.fileExists(key);
      return {
        success: true,
        data: { exists },
        message: '检查文件存在性成功',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `检查文件存在性失败: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new HttpException(
        {
          success: false,
          message: `检查文件存在性失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 删除单个文件
   * @param request 删除单个文件请求参数
   * @returns 删除结果
   */
  @Delete('file')
  async deleteSingleFile(@Body() request: DeleteFileRequest) {
    try {
      const { key } = request;
      if (!key) {
        throw new HttpException(
          {
            success: false,
            message: '文件名不能为空',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.aliyunOssService.deleteFile(key);
      return {
        success: true,
        message: '删除文件成功',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `删除文件失败: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new HttpException(
        {
          success: false,
          message: `删除文件失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 批量删除文件
   * @param request 批量删除文件请求参数
   * @returns 删除结果
   */
  @Delete('batch')
  async deleteMultipleFiles(@Body() request: DeleteFilesRequest) {
    try {
      const { keys } = request;
      if (!keys || !Array.isArray(keys) || keys.length === 0) {
        throw new HttpException(
          {
            success: false,
            message: '文件列表不能为空',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.aliyunOssService.deleteFiles(keys);
      return {
        success: true,
        data: result,
        message: `批量删除完成，成功${result.success.length}个，失败${result.failed.length}个`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `批量删除文件失败: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new HttpException(
        {
          success: false,
          message: `批量删除文件失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 上传文件
   * @param file 要上传的文件
   * @returns 上传结果
   */
  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new HttpException(
          {
            success: false,
            message: '请选择要上传的文件',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // 生成文件路径
      const key = `uploads/${Date.now()}-${file.originalname}`;

      // 上传文件到阿里云 OSS
      await this.aliyunOssService.uploadFile(key, file.buffer);
      const url = this.aliyunOssService.getPublicUrl(key);

      return {
        success: true,
        data: {
          key,
          url,
        },
        message: '文件上传成功',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `文件上传失败: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw new HttpException(
        {
          success: false,
          message: `文件上传失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
