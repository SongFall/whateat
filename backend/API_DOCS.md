# 美食网站后端API文档

## 1. 基础信息

- **服务地址**: http://localhost:3001
- **API版本**: 1.0
- **CORS配置**: 允许前端地址 http://localhost:3000 访问

## 2. 模块分类

### 2.1 应用基础

| 接口路径 | 请求方法 | 功能描述 |
|---------|---------|---------|
| `/` | GET | 获取应用欢迎信息 |
| `/api-docs` | GET | 获取Swagger API文档 |

### 2.2 用户管理

| 接口路径 | 请求方法 | 功能描述 | 请求参数 | 响应格式 |
|---------|---------|---------|---------|---------|
| `/users` | POST | 创建用户 | `{ username, email, password, nickname?, avatar?, bio? }` | `{ id, username, email, nickname, avatar, bio, role, createdAt, updatedAt }` |
| `/users/login` | POST | 用户登录 | `{ email, password }` | `{ user: { id, username, email, nickname, avatar, bio, role, createdAt, updatedAt }, token: string }` |
| `/users` | GET | 获取所有用户 | 无 | `[{ id, username, email, nickname, avatar, bio, role, createdAt, updatedAt }]` |
| `/users/:id` | GET | 获取单个用户 | 无 | `{ id, username, email, nickname, avatar, bio, role, createdAt, updatedAt }` |
| `/users/:id` | PUT | 更新用户信息 | `{ username?, email?, password?, nickname?, avatar?, bio? }` | `{ id, username, email, nickname, avatar, bio, role, createdAt, updatedAt }` |
| `/users/:id` | DELETE | 删除用户 | 无 | `{ id, username, email, nickname, avatar, bio, role, createdAt, updatedAt }` |

### 2.3 菜谱管理

| 接口路径 | 请求方法 | 功能描述 | 请求参数 | 响应格式 |
|---------|---------|---------|---------|---------|
| `/recipes` | POST | 创建菜谱 | `{ title, description, ingredients, steps, coverImage?, cookTime?, difficulty?, servings?, calories?, userId }` | 菜谱详情 |
| `/recipes` | GET | 获取所有菜谱 | `{ page?, limit?, search?, difficulty? }` | `[{ id, title, description, ingredients, steps, coverImage, cookTime, difficulty, servings, calories, userId, createdAt, updatedAt, user }]` |
| `/recipes/:id` | GET | 获取单个菜谱 | 无 | 菜谱详情 |
| `/recipes/:id` | PUT | 更新菜谱 | `{ title?, description?, ingredients?, steps?, coverImage?, cookTime?, difficulty?, servings?, calories? }` | 菜谱详情 |
| `/recipes/:id` | DELETE | 删除菜谱 | 无 | 菜谱详情 |

### 2.4 文章管理

| 接口路径 | 请求方法 | 功能描述 | 请求参数 | 响应格式 |
|---------|---------|---------|---------|---------|
| `/articles` | POST | 创建文章 | `{ title, content, coverImage?, category?, tags?, userId }` | 文章详情 |
| `/articles` | GET | 获取所有文章 | `{ page?, limit?, search?, category?, tag? }` | `[{ id, title, content, coverImage, category, tags, viewCount, userId, createdAt, updatedAt, user, comments, likes, collections }]` |
| `/articles/:id` | GET | 获取单个文章 | 无 | 文章详情 |
| `/articles/:id` | PUT | 更新文章 | `{ title?, content?, coverImage?, category?, tags? }` | 文章详情 |
| `/articles/:id` | DELETE | 删除文章 | 无 | 文章详情 |
| `/articles/:id/like` | POST | 点赞文章 | `{ userId }` | 点赞记录 |
| `/articles/:id/like` | DELETE | 取消点赞 | `{ userId }` | 点赞记录 |
| `/articles/:id/comment` | POST | 评论文章 | `{ userId, content, parentId? }` | 评论记录 |
| `/articles/:id/collect` | POST | 收藏文章 | `{ userId }` | 收藏记录 |
| `/articles/:id/collect` | DELETE | 取消收藏 | `{ userId }` | 收藏记录 |

### 2.5 收藏管理

| 接口路径 | 请求方法 | 功能描述 | 请求参数 | 响应格式 |
|---------|---------|---------|---------|---------|
| `/collections` | GET | 获取所有收藏 | `{ page?, limit? }` | 收藏列表 |
| `/collections/user/:userId` | GET | 获取用户收藏 | `{ type? }` (type: recipe/article) | 收藏列表 |
| `/collections/recipe` | POST | 收藏菜谱 | `{ userId, recipeId }` | 收藏记录 |
| `/collections/article` | POST | 收藏文章 | `{ userId, articleId }` | 收藏记录 |
| `/collections/recipe` | DELETE | 取消收藏菜谱 | `{ userId, recipeId }` | 收藏记录 |
| `/collections/article` | DELETE | 取消收藏文章 | `{ userId, articleId }` | 收藏记录 |

### 2.6 关注管理

| 接口路径 | 请求方法 | 功能描述 | 请求参数 | 响应格式 |
|---------|---------|---------|---------|---------|
| `/follows` | POST | 关注用户 | `{ followerId, followingId }` | 关注记录 |
| `/follows` | DELETE | 取消关注 | `{ followerId, followingId }` | 关注记录 |
| `/follows/followings/:userId` | GET | 获取关注列表 | 无 | 关注用户列表 |
| `/follows/followers/:userId` | GET | 获取粉丝列表 | 无 | 粉丝用户列表 |
| `/follows/check` | GET | 检查是否关注 | `{ followerId, followingId }` | `{ isFollowing: boolean }` |

### 2.7 文件上传

| 接口路径 | 请求方法 | 功能描述 | 请求参数 | 响应格式 |
|---------|---------|---------|---------|---------|
| `/upload/token` | GET | 获取七牛云上传凭证 | `{ key?, expires? }` | `{ success: true, data: { token, domain, key }, message: "获取上传凭证成功" }` |
| `/upload/url` | GET | 获取文件URL | `{ key }` | `{ success: true, data: { url }, message: "获取文件URL成功" }` |
| `/upload/exists` | GET | 检查文件是否存在 | `{ key }` | `{ success: true, data: { exists }, message: "检查文件存在性成功" }` |
| `/upload/file` | DELETE | 删除单个文件 | `{ key }` | `{ success: true, message: "删除文件成功" }` |
| `/upload/batch` | DELETE | 批量删除文件 | `{ keys: [string] }` | `{ success: true, data: { success: [string], failed: [{ key: string, error: string }] }, message: "批量删除完成" }` |

## 3. 数据模型

### 3.1 用户模型 (User)

| 字段名 | 类型 | 描述 |
|-------|------|------|
| `id` | Int | 用户ID (主键) |
| `username` | String | 用户名 (唯一) |
| `email` | String | 邮箱 (唯一) |
| `password` | String | 密码 |
| `avatar` | String | 头像URL |
| `nickname` | String | 昵称 |
| `bio` | String | 个人简介 |
| `role` | String | 用户角色 (默认: user) |
| `createdAt` | DateTime | 创建时间 |
| `updatedAt` | DateTime | 更新时间 |

### 3.2 菜谱模型 (Recipe)

| 字段名 | 类型 | 描述 |
|-------|------|------|
| `id` | Int | 菜谱ID (主键) |
| `title` | String | 菜谱标题 |
| `description` | String | 菜谱描述 |
| `ingredients` | String | 食材列表 |
| `steps` | String | 制作步骤 |
| `coverImage` | String | 封面图片URL |
| `cookTime` | Int | 烹饪时间 (分钟) |
| `difficulty` | String | 难度等级 |
| `servings` | Int | 份量 |
| `calories` | Int | 卡路里 |
| `userId` | Int | 创建用户ID |
| `createdAt` | DateTime | 创建时间 |
| `updatedAt` | DateTime | 更新时间 |

### 3.3 文章模型 (Article)

| 字段名 | 类型 | 描述 |
|-------|------|------|
| `id` | Int | 文章ID (主键) |
| `title` | String | 文章标题 |
| `content` | String | 文章内容 |
| `coverImage` | String | 封面图片URL |
| `category` | String | 文章分类 |
| `tags` | String | 文章标签 |
| `viewCount` | Int | 浏览次数 |
| `userId` | Int | 创建用户ID |
| `createdAt` | DateTime | 创建时间 |
| `updatedAt` | DateTime | 更新时间 |

### 3.4 评论模型 (Comment)

| 字段名 | 类型 | 描述 |
|-------|------|------|
| `id` | Int | 评论ID (主键) |
| `content` | String | 评论内容 |
| `userId` | Int | 评论用户ID |
| `articleId` | Int | 文章ID |
| `parentId` | Int | 父评论ID (可选) |
| `createdAt` | DateTime | 创建时间 |
| `updatedAt` | DateTime | 更新时间 |

### 3.5 点赞模型 (Like)

| 字段名 | 类型 | 描述 |
|-------|------|------|
| `id` | Int | 点赞ID (主键) |
| `userId` | Int | 点赞用户ID |
| `articleId` | Int | 文章ID |
| `createdAt` | DateTime | 创建时间 |

### 3.6 收藏模型 (Collection)

| 字段名 | 类型 | 描述 |
|-------|------|------|
| `id` | Int | 收藏ID (主键) |
| `userId` | Int | 收藏用户ID |
| `recipeId` | Int | 菜谱ID (可选) |
| `articleId` | Int | 文章ID (可选) |
| `createdAt` | DateTime | 创建时间 |

### 3.7 关注模型 (Follow)

| 字段名 | 类型 | 描述 |
|-------|------|------|
| `id` | Int | 关注ID (主键) |
| `followerId` | Int | 关注者ID |
| `followingId` | Int | 被关注者ID |
| `createdAt` | DateTime | 创建时间 |

## 4. 状态码说明

| 状态码 | 描述 |
|-------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 5. 错误处理

所有API接口在发生错误时，都会返回统一的错误格式：

```json
{
  "statusCode": 错误状态码,
  "message": "错误描述",
  "error": "错误类型"
}
```

## 6. 使用说明

1. **获取Swagger文档**: 访问 `http://localhost:3001/api-docs` 查看完整的API文档
2. **测试API**: 可以使用Postman、Insomnia等工具测试API接口
3. **前端集成**: 前端可以通过Axios等HTTP客户端访问API接口
4. **文件上传**: 使用七牛云上传，需要先获取上传凭证
5. **认证机制**: 实现了JWT认证，登录后获取token，后续请求需要在Authorization头中携带token
   - 登录接口: POST /users/login
   - Token格式: Bearer {token}
   - Token有效期: 7天
6. **登录测试**: 
   - 管理员账号: email=admin@example.com, password=admin123
   - 普通用户: email=user1@example.com, password=user123

## 7. 开发说明

### 7.1 启动服务

```bash
yarn start          # 启动生产环境服务
yarn start:dev      # 启动开发环境服务（热重载）
yarn start:debug    # 启动调试模式服务
```

### 7.2 生成Prisma客户端

```bash
yarn prisma generate
```

### 7.3 数据库迁移

```bash
yarn prisma migrate dev
```

### 7.4 运行测试

```bash
yarn test           # 运行单元测试
yarn test:watch     # 运行单元测试（监听模式）
yarn test:e2e       # 运行端到端测试
bash api-test.sh    # 运行API测试脚本
```

## 8. 技术栈

- **后端框架**: NestJS 11.0.1
- **ORM工具**: Prisma 5.18.0
- **数据库**: MySQL
- **对象存储**: 七牛云
- **API文档**: Swagger
- **测试框架**: Jest
- **构建工具**: TypeScript 5.7.3

## 9. 后续优化

1. 添加JWT认证机制
2. 实现分页查询
3. 添加搜索功能
4. 优化错误处理
5. 添加日志记录
6. 实现缓存机制
7. 添加权限控制
8. 优化性能

## 10. 联系方式

如有问题或建议，请联系开发团队。