// 种子脚本：插入模拟数据
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('开始插入模拟数据...');

  // 1. 插入用户数据
  console.log('插入用户数据...');
  const users = await prisma.user.createMany({
    data: [
      {
        username: 'admin',
        email: 'admin@example.com',
        password: '$2b$10$eJ7yJ9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k', // 密码：admin123
        nickname: '管理员',
        avatar: 'https://example.com/avatars/admin.jpg',
        bio: '我是网站管理员',
        role: 'admin'
      },
      {
        username: 'user1',
        email: 'user1@example.com',
        password: '$2b$10$eJ7yJ9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k', // 密码：user123
        nickname: '美食爱好者',
        avatar: 'https://example.com/avatars/user1.jpg',
        bio: '热爱美食，喜欢分享',
        role: 'user'
      },
      {
        username: 'user2',
        email: 'user2@example.com',
        password: '$2b$10$eJ7yJ9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k', // 密码：user123
        nickname: '厨师',
        avatar: 'https://example.com/avatars/user2.jpg',
        bio: '专业厨师，分享美食制作技巧',
        role: 'user'
      },
      {
        username: 'user3',
        email: 'user3@example.com',
        password: '$2b$10$eJ7yJ9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k9Z9k', // 密码：user123
        nickname: '健康饮食',
        avatar: 'https://example.com/avatars/user3.jpg',
        bio: '倡导健康饮食，分享营养食谱',
        role: 'user'
      }
    ],
    skipDuplicates: true
  });
  console.log(`插入了 ${users.count} 个用户`);

  // 2. 插入菜谱数据
  console.log('插入菜谱数据...');
  const recipes = await prisma.recipe.createMany({
    data: [
      {
        title: '番茄炒蛋',
        description: '经典的中式家常菜，简单易做，营养丰富',
        ingredients: '番茄2个，鸡蛋3个，盐适量，糖适量，食用油适量',
        steps: '1. 番茄切块备用；2. 鸡蛋打散备用；3. 热锅倒油，倒入鸡蛋炒熟盛出；4. 锅中留底油，放入番茄翻炒；5. 加入适量盐和糖调味；6. 倒入炒好的鸡蛋翻炒均匀即可出锅',
        coverImage: 'https://example.com/recipes/tomato-egg.jpg',
        cookTime: 15,
        difficulty: '简单',
        servings: 2,
        calories: 250,
        userId: 1
      },
      {
        title: '意大利面',
        description: '经典的意大利美食，口感丰富，味道浓郁',
        ingredients: '意大利面200g，番茄酱适量，牛肉末100g，洋葱1个，大蒜2瓣，橄榄油适量，盐适量，黑胡椒适量',
        steps: '1. 煮意大利面至八分熟；2. 热锅倒橄榄油，放入洋葱和大蒜炒香；3. 加入牛肉末炒至变色；4. 加入番茄酱翻炒；5. 加入适量盐和黑胡椒调味；6. 倒入煮好的意大利面翻炒均匀即可',
        coverImage: 'https://example.com/recipes/pasta.jpg',
        cookTime: 25,
        difficulty: '中等',
        servings: 2,
        calories: 400,
        userId: 2
      },
      {
        title: '红烧肉',
        description: '传统的中式红烧肉，肥而不腻，入口即化',
        ingredients: '五花肉500g，生姜3片，大蒜5瓣，八角2个，桂皮1块，生抽2勺，老抽1勺，料酒2勺，冰糖适量，盐适量',
        steps: '1. 五花肉切块焯水备用；2. 热锅倒油，放入冰糖炒出糖色；3. 放入五花肉翻炒至上色；4. 加入生姜、大蒜、八角、桂皮炒香；5. 加入生抽、老抽、料酒翻炒；6. 加入适量清水，大火烧开后转小火炖1小时；7. 最后大火收汁即可',
        coverImage: 'https://example.com/recipes/braised-pork.jpg',
        cookTime: 75,
        difficulty: '中等',
        servings: 3,
        calories: 500,
        userId: 3
      },
      {
        title: '蔬菜沙拉',
        description: '健康营养的蔬菜沙拉，适合减肥人士',
        ingredients: '生菜1颗，黄瓜1根，番茄1个，胡萝卜1根，鸡蛋1个，沙拉酱适量',
        steps: '1. 生菜洗净撕成小块；2. 黄瓜、番茄、胡萝卜洗净切块；3. 鸡蛋煮熟切片；4. 将所有食材放入碗中；5. 加入适量沙拉酱拌匀即可',
        coverImage: 'https://example.com/recipes/salad.jpg',
        cookTime: 10,
        difficulty: '简单',
        servings: 1,
        calories: 150,
        userId: 4
      },
      {
        title: '清蒸鱼',
        description: '保持鱼肉鲜嫩的清蒸做法，营养丰富',
        ingredients: '鱼1条（约500g），生姜3片，葱2根，料酒2勺，盐适量，生抽2勺，食用油适量',
        steps: '1. 鱼处理干净，在鱼身上划几刀；2. 鱼身上抹盐，放入姜片和葱丝；3. 锅中加水烧开，放入鱼蒸10分钟；4. 取出鱼，倒掉盘中的水；5. 撒上葱花，淋上生抽；6. 热锅倒油，将热油浇在鱼身上即可',
        coverImage: 'https://example.com/recipes/steamed-fish.jpg',
        cookTime: 15,
        difficulty: '中等',
        servings: 2,
        calories: 300,
        userId: 1
      }
    ],
    skipDuplicates: true
  });
  console.log(`插入了 ${recipes.count} 个菜谱`);

  // 3. 插入文章数据
  console.log('插入文章数据...');
  const articles = await prisma.article.createMany({
    data: [
      {
        title: '如何选择新鲜食材',
        content: '选择新鲜食材是做好菜的第一步。本文将介绍如何选择各种新鲜食材，包括蔬菜、肉类、海鲜等。',
        coverImage: 'https://example.com/articles/fresh-ingredients.jpg',
        category: '美食技巧',
        tags: '食材选择,烹饪技巧',
        viewCount: 100,
        userId: 2
      },
      {
        title: '夏季清凉食谱推荐',
        content: '夏季天气炎热，适合吃一些清凉的食物。本文推荐几道适合夏季的清凉食谱，包括凉菜、汤品等。',
        coverImage: 'https://example.com/articles/summer-recipes.jpg',
        category: '季节食谱',
        tags: '夏季食谱,清凉食谱',
        viewCount: 80,
        userId: 3
      },
      {
        title: '健康饮食的重要性',
        content: '健康饮食对身体健康至关重要。本文将介绍健康饮食的原则和方法，帮助大家养成健康的饮食习惯。',
        coverImage: 'https://example.com/articles/healthy-diet.jpg',
        category: '健康饮食',
        tags: '健康饮食,营养',
        viewCount: 120,
        userId: 4
      },
      {
        title: '烘焙入门指南',
        content: '烘焙是一门有趣的烹饪技艺。本文将介绍烘焙的基本工具和方法，帮助初学者快速入门。',
        coverImage: 'https://example.com/articles/baking-guide.jpg',
        category: '烘焙技巧',
        tags: '烘焙,入门指南',
        viewCount: 90,
        userId: 1
      },
      {
        title: '世界各地的美食文化',
        content: '不同国家和地区有不同的美食文化。本文将介绍世界各地的美食文化，包括中国、意大利、法国、日本等国家的特色美食。',
        coverImage: 'https://example.com/articles/world-cuisine.jpg',
        category: '美食文化',
        tags: '美食文化,世界各地',
        viewCount: 150,
        userId: 2
      }
    ],
    skipDuplicates: true
  });
  console.log(`插入了 ${articles.count} 篇文章`);

  // 4. 插入评论数据
  console.log('插入评论数据...');
  const comments = await prisma.comment.createMany({
    data: [
      {
        content: '这篇文章写得很好，对我很有帮助！',
        userId: 1,
        articleId: 1
      },
      {
        content: '谢谢分享，学到了很多知识。',
        userId: 2,
        articleId: 1
      },
      {
        content: '期待更多这样的文章。',
        userId: 3,
        articleId: 1
      },
      {
        content: '这个食谱很实用，我会尝试做一下。',
        userId: 4,
        articleId: 2
      },
      {
        content: '写得很详细，步骤清晰。',
        userId: 1,
        articleId: 2
      },
      {
        content: '健康饮食确实很重要，我们应该重视。',
        userId: 2,
        articleId: 3
      },
      {
        content: '烘焙看起来很有趣，我也想试试。',
        userId: 3,
        articleId: 4
      },
      {
        content: '世界各地的美食文化真的很丰富。',
        userId: 4,
        articleId: 5
      }
    ],
    skipDuplicates: true
  });
  console.log(`插入了 ${comments.count} 条评论`);

  // 5. 插入点赞数据
  console.log('插入点赞数据...');
  const likes = await prisma.like.createMany({
    data: [
      {
        userId: 1,
        articleId: 1
      },
      {
        userId: 2,
        articleId: 1
      },
      {
        userId: 3,
        articleId: 1
      },
      {
        userId: 4,
        articleId: 2
      },
      {
        userId: 1,
        articleId: 2
      },
      {
        userId: 2,
        articleId: 3
      },
      {
        userId: 3,
        articleId: 4
      },
      {
        userId: 4,
        articleId: 5
      }
    ],
    skipDuplicates: true
  });
  console.log(`插入了 ${likes.count} 个点赞`);

  // 6. 插入收藏数据
  console.log('插入收藏数据...');
  const collections = await prisma.collection.createMany({
    data: [
      {
        userId: 1,
        recipeId: 1
      },
      {
        userId: 1,
        articleId: 1
      },
      {
        userId: 2,
        recipeId: 2
      },
      {
        userId: 2,
        articleId: 2
      },
      {
        userId: 3,
        recipeId: 3
      },
      {
        userId: 3,
        articleId: 3
      },
      {
        userId: 4,
        recipeId: 4
      },
      {
        userId: 4,
        articleId: 4
      }
    ],
    skipDuplicates: true
  });
  console.log(`插入了 ${collections.count} 个收藏`);

  // 7. 插入关注数据
  console.log('插入关注数据...');
  const follows = await prisma.follow.createMany({
    data: [
      {
        followerId: 1,
        followingId: 2
      },
      {
        followerId: 1,
        followingId: 3
      },
      {
        followerId: 2,
        followingId: 1
      },
      {
        followerId: 2,
        followingId: 4
      },
      {
        followerId: 3,
        followingId: 1
      },
      {
        followerId: 3,
        followingId: 2
      },
      {
        followerId: 4,
        followingId: 1
      },
      {
        followerId: 4,
        followingId: 3
      }
    ],
    skipDuplicates: true
  });
  console.log(`插入了 ${follows.count} 个关注`);

  console.log('模拟数据插入完成！');
}

main()
  .catch((e) => {
    console.error('插入模拟数据失败：', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
