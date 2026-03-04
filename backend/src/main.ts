import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 配置CORS，允许前端访问
  app.enableCors({
    origin: 'http://localhost:3000', // 允许的前端地址
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // 配置Swagger
  const config = new DocumentBuilder()
    .setTitle('美食网站API')
    .setDescription('美食网站后端API文档')
    .setVersion('1.0')
    .addTag('users', '用户管理')
    .addTag('recipes', '菜谱管理')
    .addTag('articles', '文章管理')
    .addTag('collections', '收藏管理')
    .addTag('follows', '关注管理')
    .addTag('upload', '文件上传')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
