# 修复 article.service.ts 中的错误处理问题

## 问题分析

1. **findOne 方法**：使用 update 方法增加浏览量，但当文章不存在时会抛出 500 错误
2. **like 方法**：创建点赞记录时，当用户已点赞会抛出唯一约束错误
3. **unlike 方法**：删除点赞记录时，当记录不存在会抛出错误
4. **comment 方法**：创建评论时，当文章或用户不存在会抛出错误
5. **collect 和 uncollect 方法**：收藏/取消收藏时，当记录已存在或不存在会抛出错误
6. **update 和 remove 方法**：更新/删除文章时，当文章不存在会抛出错误

## 修复方案

为所有方法添加错误处理，使用 try-catch 块捕获 Prisma 错误，并返回适当的 HTTP 状态码和错误信息。

### 修复步骤

1. **导入必要的依赖**：
   - 导入 `HttpException` 和 `HttpStatus` 从 `@nestjs/common`

2. **修改 findOne 方法**：
   - 添加 try-catch 块
   - 捕获 P2025 错误，返回 404 状态码

3. **修改 update 方法**：
   - 添加 try-catch 块
   - 捕获 P2025 错误，返回 404 状态码

4. **修改 remove 方法**：
   - 添加 try-catch 块
   - 捕获 P2025 错误，返回 404 状态码

5. **修改 like 方法**：
   - 添加 try-catch 块
   - 捕获 P2025 错误，返回 404 状态码
   - 捕获唯一约束错误，返回 400 状态码

6. **修改 unlike 方法**：
   - 添加 try-catch 块
   - 捕获 P2025 错误，返回 404 状态码

7. **修改 comment 方法**：
   - 添加 try-catch 块
   - 捕获 P2025 错误，返回 404 状态码

8. **修改 collect 方法**：
   - 添加 try-catch 块
   - 捕获 P2025 错误，返回 404 状态码
   - 捕获唯一约束错误，返回 400 状态码

9. **修改 uncollect 方法**：
   - 添加 try-catch 块
   - 捕获 P2025 错误，返回 404 状态码

## 预期结果

- 所有方法在遇到错误时都会返回适当的 HTTP 状态码和错误信息
- 当资源不存在时返回 404 状态码
- 当请求无效时返回 400 状态码
- 其他错误返回 500 状态码
- 提高 API 的健壮性和用户体验

## 代码示例

```typescript
async findOne(id: number) {
  try {
    return await this.prisma.article.update({
      where: { id },
      data: {
        viewCount: { increment: 1 },
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
            nickname: true,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                nickname: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        likes: true,
        collections: true,
      },
    });
  } catch (error) {
    if (error.code === 'P2025') {
      throw new HttpException('Article not found', HttpStatus.NOT_FOUND);
    }
    throw error;
  }
}
```