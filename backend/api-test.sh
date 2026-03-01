#!/bin/bash

# 接口测试脚本
BASE_URL="http://localhost:3001"

# 测试结果存储
PASS=0
FAIL=0

# 测试函数
test_api() {
  local method=$1
  local url=$2
  local data=$3
  local expected_status=$4
  local description=$5
  
  echo -e "\n=== 测试 $description ==="
  echo "请求: $method $url"
  echo "数据: $data"
  
  if [ "$method" = "GET" ] || [ "$method" = "DELETE" ]; then
    response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$url")
  else
    response=$(curl -s -w "\n%{http_code}" -X $method -H "Content-Type: application/json" -d "$data" "$BASE_URL$url")
  fi
  
  # 分离响应体和状态码
  status_code=$(echo "$response" | tail -n 1)
  response_body=$(echo "$response" | head -n -1)
  
  echo "响应状态码: $status_code"
  echo "响应体: $response_body"
  
  if [ "$status_code" -eq "$expected_status" ]; then
    echo -e "✅ 测试通过"
    PASS=$((PASS+1))
  else
    echo -e "❌ 测试失败，期望状态码: $expected_status"
    FAIL=$((FAIL+1))
  fi
}

# 生成接口文档
echo "# 美食网站API文档"
echo "## 1. 用户管理接口"
echo "- POST /users - 创建用户"
echo "- GET /users - 获取所有用户"
echo "- GET /users/:id - 获取单个用户"
echo "- PUT /users/:id - 更新用户"
echo "- DELETE /users/:id - 删除用户"
echo ""
echo "## 2. 菜谱管理接口"
echo "- POST /recipes - 创建菜谱"
echo "- GET /recipes - 获取所有菜谱"
echo "- GET /recipes/:id - 获取单个菜谱"
echo "- PUT /recipes/:id - 更新菜谱"
echo "- DELETE /recipes/:id - 删除菜谱"
echo ""
echo "## 3. 文章管理接口"
echo "- POST /articles - 创建文章"
echo "- GET /articles - 获取所有文章"
echo "- GET /articles/:id - 获取单个文章"
echo "- PUT /articles/:id - 更新文章"
echo "- DELETE /articles/:id - 删除文章"
echo "- POST /articles/:id/like - 点赞文章"
echo "- DELETE /articles/:id/like - 取消点赞"
echo "- POST /articles/:id/comment - 评论文章"
echo "- POST /articles/:id/collect - 收藏文章"
echo "- DELETE /articles/:id/collect - 取消收藏"
echo ""
echo "## 4. 收藏管理接口"
echo "- GET /collections - 获取所有收藏"
echo "- GET /collections/user/:userId - 获取用户收藏"
echo "- POST /collections/recipe - 收藏菜谱"
echo "- POST /collections/article - 收藏文章"
echo "- DELETE /collections/recipe - 取消收藏菜谱"
echo "- DELETE /collections/article - 取消收藏文章"
echo ""
echo "## 5. 关注管理接口"
echo "- POST /follows - 关注用户"
echo "- DELETE /follows - 取消关注"
echo "- GET /follows/followings/:userId - 获取关注列表"
echo "- GET /follows/followers/:userId - 获取粉丝列表"
echo "- GET /follows/check - 检查是否关注"
echo ""
echo "## 6. 文件上传接口"
echo "- POST /upload - 上传文件"
echo ""

# 开始测试
echo -e "\n\n=== 开始测试API ==="

# 测试用户接口
test_api "GET" "/users" "" 200 "获取所有用户"
test_api "GET" "/users/1" "" 404 "获取不存在的用户"

# 测试菜谱接口
test_api "GET" "/recipes" "" 200 "获取所有菜谱"
test_api "GET" "/recipes/1" "" 404 "获取不存在的菜谱"

# 测试文章接口
test_api "GET" "/articles" "" 200 "获取所有文章"
test_api "GET" "/articles/1" "" 404 "获取不存在的文章"

# 测试收藏接口
test_api "GET" "/collections" "" 200 "获取所有收藏"
test_api "GET" "/collections/user/1" "" 200 "获取用户收藏"

# 测试关注接口
test_api "GET" "/follows/followings/1" "" 200 "获取关注列表"
test_api "GET" "/follows/followers/1" "" 200 "获取粉丝列表"

# 测试Swagger文档
test_api "GET" "/api-docs" "" 200 "获取Swagger文档"
test_api "GET" "/api-docs-json" "" 404 "获取Swagger JSON"

# 输出测试结果
echo -e "\n\n=== 测试结果 ==="
echo "通过: $PASS"
echo "失败: $FAIL"
echo "总测试数: $((PASS+FAIL))"

if [ $FAIL -eq 0 ]; then
  echo -e "\n🎉 所有测试通过！"
else
  echo -e "\n⚠️  有 $FAIL 个测试失败！"
fi
