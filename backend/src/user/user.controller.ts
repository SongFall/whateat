import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AliyunOssService } from '../upload/aliyun-oss.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly aliyunOssService: AliyunOssService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * 上传用户头像
   * @param id 用户ID
   * @param file 头像文件
   * @returns 上传结果
   */
  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (!file) {
        throw new HttpException(
          {
            success: false,
            message: '请选择要上传的头像文件',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      // 生成文件路径，上传到users文件夹下
      const key = `users/${id}/avatar-${Date.now()}-${file.originalname}`;

      // 上传文件到阿里云 OSS
      await this.aliyunOssService.uploadFile(key, file.buffer);
      const avatarUrl = this.aliyunOssService.getPublicUrl(key);

      // 更新用户头像URL
      await this.userService.update(+id, { avatar: avatarUrl });

      return {
        success: true,
        data: {
          avatarUrl,
        },
        message: '头像上传成功',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          success: false,
          message: `头像上传失败: ${error instanceof Error ? error.message : String(error)}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
