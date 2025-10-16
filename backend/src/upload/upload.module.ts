import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { QiniuService } from './qiniu.service';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [QiniuService],
  exports: [QiniuService],
})
export class UploadModule {}
