"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Heart, MessageSquare, Share2, Copy, Twitter, Facebook, BookmarkPlus, Clock, Calendar, ArrowLeft } from "lucide-react";
import { getArticleById } from "@/app/services/articles/articlesApi";

// 美食博客文章详情组件
const FoodBlogArticle = () => {
  // 状态管理
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(342);
  const [isSaved, setIsSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Mock数据
  const mockArticle = {
    id: 1,
    title: "秋日限定：南瓜肉桂卷的完美配方",
    excerpt: "这款南瓜肉桂卷融合了秋季的温暖香气，松软的面包体搭配香甜的南瓜馅，每一口都是季节的馈赠。",
    content: "秋天是南瓜的季节，当市场上开始出现各种南瓜品种时，就知道是时候制作这款南瓜肉桂卷了。不同于传统肉桂卷，这款配方加入了新鲜南瓜泥，不仅增加了营养，还带来了美丽的金黄色泽和温润的口感。\n\n大多数肉桂卷的面团比较厚重，而这款配方使用了部分南瓜泥替代黄油，让面包体更加松软轻盈，同时南瓜的天然甜味可以减少糖分的使用。肉桂和南瓜的搭配是经典的秋季组合，温暖的香料气息能瞬间提升心情。\n\n### 食材准备（8个份）\n\n#### 面团：\n- 中筋面粉 350克\n- 细砂糖 50克\n- 活性干酵母 7克\n- 盐 1/4茶匙\n- 南瓜泥 120克（蒸熟后压泥）\n- 牛奶 80毫升（温的，约37°C）\n- 无盐黄油 30克（融化放凉）\n- 鸡蛋 1个（室温）\n\n#### 内馅：\n- 软化黄油 50克\n- 红糖 80克\n- 肉桂粉 2茶匙\n- 肉豆蔻粉 1/4茶匙（可选）\n\n### 制作步骤\n1. 准备面团：在大碗中混合面粉、糖、酵母和盐。在另一个碗中，混合南瓜泥、温牛奶、融化的黄油和鸡蛋。将湿料倒入干料中，搅拌至形成粗糙面团。\n2. 揉制面团：在撒粉的台面上揉面团约8-10分钟，直到面团光滑有弹性。放入涂油的碗中，盖上保鲜膜，在温暖处发酵至两倍大（约1-1.5小时）。\n3. 制作内馅：将软化的黄油、红糖、肉桂粉和肉豆蔻粉混合均匀，备用。\n4. 擀制与填充：将发酵好的面团擀成约30x40厘米的长方形。均匀涂抹内馅，从长边卷起成圆柱形，切成8等份。\n5. 二次发酵与烘烤：将面卷放入涂油的烤盘中，盖上保鲜膜，二次发酵30分钟。预热烤箱至190°C，烤25-30分钟至金黄色。\n\n### 烹饪小贴士\n- 南瓜泥要彻底放凉后再使用，否则高温会杀死酵母。\n- 如果喜欢更浓郁的肉桂味，可以增加肉桂粉的用量。\n- 剩余的肉桂卷可以冷藏保存，食用前微波炉加热10-15秒即可恢复松软。\n\n这款南瓜肉桂卷非常适合周末早餐或下午茶点，搭配一杯热咖啡或红茶，让整个秋日都变得温暖起来。如果你尝试了这个配方，欢迎在评论区分享你的成果！",
    coverImage: "https://picsum.photos/seed/pumpkinroll/1200/675",
    author: "美食专栏作家",
    publishDate: "2023-10-15",
    readTime: "12分钟",
    viewCount: 1234,
    likes: 342,
    comments: [
      {
        id: 1,
        userId: 1,
        username: "王小明",
        avatar: "https://picsum.photos/seed/user1/100/100",
        content: "太好吃了！我按照配方做了一次，全家人都很喜欢。我在糖霜里加了点橙汁，味道更清新了，推荐大家试试！",
        createdAt: "2023-10-18",
        likes: 42
      },
      {
        id: 2,
        userId: 2,
        username: "李小厨",
        avatar: "https://picsum.photos/seed/user2/100/100",
        content: "面团发酵的时间很关键，我第一次做的时候发酵不够，口感偏硬。第二次延长了发酵时间，松软多了。南瓜选甜一点的品种真的很重要！",
        createdAt: "2023-10-16",
        likes: 28
      }
    ],
    tags: ["南瓜食谱", "烘焙", "秋季美食", "早餐"]
  };

  // 获取文章数据
  useEffect(() => {
    const loadArticle = async () => {
      try {
        setLoading(true);
        setError(null);
        const articleData = await getArticleById(id);
        setArticle(articleData);
        setLikeCount(articleData.likes?.length || 0);
      } catch (err) {
        console.error("获取文章失败:", err);
        setError("获取文章失败，显示默认内容");
        // 使用mock数据作为兜底
        setArticle(mockArticle);
      } finally {
        setLoading(false);
      }
    };

    loadArticle();
  }, [id]);

  // 处理点赞
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // 处理收藏
  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  // 处理复制链接
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mb-4"></div>
        <p className="text-gray-600">正在加载文章...</p>
      </div>
    );
  }

  // 错误状态
  if (error) {
    console.log("使用mock数据:", error);
  }

  // 如果没有文章数据
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">文章不存在</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen container bg-background text-foreground">

      {/* 文章内容区 */}
      <article className="max-w-4xl px-4 pt-6 lg:pt-10 pb-12 sm:px-6 lg:px-8 mx-auto">
        <div className="max-w-4xl">
          {/* 作者信息 */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-x-4">
              <div className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden ring-2 ring-orange-500/20">
                <Image 
                  src={article.authorAvatar || "https://picsum.photos/seed/chef/200/200"} 
                  alt="作者头像"
                  fill
                  sizes="48x48"
                  className="object-cover"
                />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{article.author}</h3>
                  <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 rounded-full">美食专栏作家</span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{article.publishDate || "2023年10月15日"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readingTime || "12"}分钟</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={handleSave}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <BookmarkPlus className={`w-4 h-4 ${isSaved ? 'fill-orange-500 text-orange-500' : ''}`} />
              <span>{isSaved ? '已收藏' : '收藏食谱'}</span>
            </button>
          </div>

          {/* 文章标题与简介 */}
          <div className="mb-8 space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              {article.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {article.excerpt}
            </p>
          </div>

          {/* 文章主图 */}
          <figure className="mb-10 rounded-xl overflow-hidden shadow-lg">
            <div className="relative aspect-[16/9] w-full">
              <Image 
                src={article.coverImage} 
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
              {article.title} - 美食分享
            </figcaption>
          </figure>

          {/* 文章内容 */}
          <div className="space-y-6 text-gray-800 dark:text-gray-200">
            {/* 这里可以添加内容解析逻辑，例如markdown解析 */}
            <div dangerouslySetInnerHTML={{ __html: article.content ? article.content
              // 先处理标题，再处理换行符
              // 处理三级标题（转换为四级标题）
              .replace(/^###\s+(.+?)$/gm, '<h4 class="text-lg font-medium mt-2 mb-1">$1</h4>')
              // 处理二级标题（转换为三级标题）
              .replace(/^##\s+(.+?)$/gm, '<h3 class="text-xl font-semibold mt-4 mb-2">$1</h3>')
              // 处理一级标题（转换为二级标题）
              .replace(/^#\s+(.+?)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-3">$1</h2>')
              // 处理无序列表
              .replace(/^-\s+(.+?)$/gm, '<li class="list-disc pl-6">$1</li>')
              // 将连续的<li>标签包裹在<ul>中
              .replace(/(<li class="list-disc pl-6">.*?<\/li>)/gs, '<ul class="space-y-2 mb-4">$1</ul>')
              // 处理换行符
              .replace(/\n/g, '<br>')
              // 处理有序列表
              : '' }} />

            {/* 文章标签 */}
            <div className="mt-10 flex flex-wrap gap-2">
              {article.tags.split(',')?.map((tag, index) => (
                <Link 
                  key={index}
                  href={`/blog/category/${tag.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* 互动区域 */}
      <div className="border-t border-border py-8">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="max-w-3xl">
            <h3 className="text-xl font-semibold mb-6">分享你的想法</h3>
            
            {/* 评论输入框 */}
            <div className="mb-8">
              <textarea 
                className="w-full min-h-[120px] px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-colors"
                placeholder="你尝试过这个食谱吗？有什么心得体会？"
              ></textarea>
              <div className="mt-3 flex justify-end">
                <button className="px-5 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors">
                  发表评论
                </button>
              </div>
            </div>

            {/* 精选评论 */}
            <div className="space-y-6">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">精选评论 ({article.comments?.length || 0})</h4>
              
              {article.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative shrink-0 w-10 h-10 rounded-full overflow-hidden">
                    <Image 
                      src={comment.avatar || `https://picsum.photos/seed/user${comment.userId}/100/100`} 
                      alt="用户头像"
                      fill
                      sizes="40x40"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h5 className="font-medium text-gray-900 dark:text-gray-100">{comment.username}</h5>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{comment.createdAt || "3天前"}</span>
                    </div>
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      {comment.content}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 transition-colors">
                        <Heart className="w-4 h-4" />
                        <span>{comment.likes || 0}</span>
                      </button>
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span>回复</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 相关推荐 */}
      <div className="py-12 dark:bg-gray-900/50">
        <div className="max-w-4xl px-4 sm:px-6 lg:px-8 mx-auto">
          <h3 className="text-2xl font-bold mb-8 text-center">你可能也喜欢</h3>
          
          <div className="grid sm:grid-cols-3 gap-6">
            {/* 推荐文章1 */}
            <Link 
              href="/blog/recipe/apple-pie" 
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3]">
                <Image 
                  src="https://picsum.photos/seed/applepie/600/450" 
                  alt="传统苹果派"
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  经典苹果派：秋季的甜蜜滋味
                </h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  这款苹果派外酥内软，苹果的酸甜与肉桂的香气完美融合，是秋季不可错过的甜点。
                </p>
              </div>
            </Link>
            
            {/* 推荐文章2 */}
            <Link 
              href="/blog/recipe/sweet-potato-soup" 
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3]">
                <Image 
                  src="https://picsum.photos/seed/sweetpotatosoup/600/450" 
                  alt="甜薯汤"
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  奶油甜薯汤：温暖你的秋日
                </h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  丝滑浓郁的甜薯汤，带有淡淡的香料味，寒冷的日子里喝上一碗，暖心又暖胃。
                </p>
              </div>
            </Link>
            <Link 
              href="/blog/recipe/sweet-potato-soup" 
              className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-[4/3]">
                <Image 
                  src="https://picsum.photos/seed/sweetpotatosoup/600/450" 
                  alt="甜薯汤"
                  fill
                  sizes="(max-width: 640px) 100vw, 300px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  奶油甜薯汤：温暖你的秋日
                </h4>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  丝滑浓郁的甜薯汤，带有淡淡的香料味，寒冷的日子里喝上一碗，暖心又暖胃。
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default FoodBlogArticle;
