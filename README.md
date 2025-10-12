# WhatEat 美食推荐系统

一个集成人工智能技术的美食网站，为用户提供个性化菜谱生成和美食相关内容推荐服务，满足不同用户的饮食需求和烹饪探索需求。

## 项目结构

- `frontend/`: 前端项目，基于 Next.js、Shadcn UI 和 Tailwind CSS（使用 JavaScript）
- `backend/`: 后端项目，基于 NestJS、MySQL 和 Prisma（使用 JavaScript）

## 技术栈

### 前端
- **框架**: Next.js (React 框架) - JavaScript
- **UI 组件**: Shadcn UI
- **样式**: Tailwind CSS
- **状态管理**: 待定
- **API 集成**: 待定

### 后端
- **框架**: NestJS - JavaScript
- **数据库**: MySQL
- **ORM**: Prisma
- **认证**: 待定
- **AI 集成**: 待定

## 功能特性
- 个性化菜谱生成
- 美食内容推荐
- 用户饮食需求分析
- 烹饪探索功能
- 食材管理

## 安装说明

### 前端
1. 进入 frontend 目录
2. 运行 `yarn install` 安装依赖
3. 运行 `yarn dev` 启动开发服务器

### 后端
1. 进入 backend 目录
2. 运行 `yarn install` 安装依赖
3. 配置 MySQL 数据库连接
4. 运行 `yarn prisma migrate dev` 执行数据库迁移
5. 运行 `yarn start:dev` 启动开发服务器

## 贡献指南

如果您想为项目做出贡献，请遵循以下步骤：
1. Fork 项目仓库
2. 创建新的分支
3. 提交您的更改
4. 推送到您的分支
5. 创建 Pull Request