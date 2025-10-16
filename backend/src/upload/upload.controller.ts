import {
  Controller,
  Get,
  Delete,
  Query,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { QiniuService } from './qiniu.service';
import { Logger } from '@nestjs/common';

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

  constructor(private readonly qiniuService: QiniuService) {}

  /**
   * 获取七牛云上传凭证
   * @param request 上传凭证请求参数
   * @returns 上传凭证
   */
  @Get('token')
  getUploadToken(@Query() request: UploadTokenRequest) {
    try {
      const { key, expires = 3600 } = request;
      const token = this.qiniuService.generateUploadToken(key, expires);
      return {
        success: true,
        data: {
          token,
          domain: this.qiniuService['domain'], // 获取domain属性用于前端
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
      const url = this.qiniuService.getPublicUrl(key);
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
      const exists = await this.qiniuService.fileExists(key);
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
      await this.qiniuService.deleteFile(key);
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
      const result = await this.qiniuService.deleteFiles(keys);
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
}
