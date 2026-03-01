import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { AliyunOssService } from './aliyun-oss.service';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [AliyunOssService],
  exports: [AliyunOssService],
})
export class UploadModule {}
