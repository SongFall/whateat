"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, MessageSquare, Share2, Copy, Twitter, Facebook, BookmarkPlus, Clock, Calendar, ArrowLeft } from "lucide-react";

// 美食博客文章详情组件
const FoodBlogArticle = () => {
  // 状态管理
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(342);
  const [isSaved, setIsSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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
                  src="https://picsum.photos/seed/chef/200/200" 
                  alt="作者头像"
                  fill
                  sizes="48x48"
                  className="object-cover"
                />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">李厨师</h3>
                  <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 rounded-full">美食专栏作家</span>
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>2023年10月15日</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>12分钟阅读</span>
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
              秋日限定：南瓜肉桂卷的完美配方
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              这款南瓜肉桂卷融合了秋季的温暖香气，松软的面包体搭配香甜的南瓜馅，每一口都是季节的馈赠。
            </p>
          </div>

          {/* 文章主图 */}
          <figure className="mb-10 rounded-xl overflow-hidden shadow-lg">
            <div className="relative aspect-[16/9] w-full">
              <Image 
                src="https://picsum.photos/seed/pumpkinroll/1200/675" 
                alt="金黄诱人的南瓜肉桂卷，撒有糖粉和肉桂粉"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
              刚出炉的南瓜肉桂卷，搭配一杯热咖啡是秋日绝佳享受
            </figcaption>
          </figure>

          {/* 文章内容 */}
          <div className="space-y-6 text-gray-800 dark:text-gray-200">
            <p className="text-lg leading-relaxed">
              秋天是南瓜的季节，当市场上开始出现各种南瓜品种时，就知道是时候制作这款南瓜肉桂卷了。不同于传统肉桂卷，这款配方加入了新鲜南瓜泥，不仅增加了营养，还带来了美丽的金黄色泽和温润的口感。
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">为什么这款配方特别？</h2>
            
            <p className="text-lg leading-relaxed">
              大多数肉桂卷的面团比较厚重，而这款配方使用了部分南瓜泥替代黄油，让面包体更加松软轻盈，同时南瓜的天然甜味可以减少糖分的使用。肉桂和南瓜的搭配是经典的秋季组合，温暖的香料气息能瞬间提升心情。
            </p>

            <figure className="my-8 rounded-xl overflow-hidden">
              <div className="relative aspect-square w-full max-w-md mx-auto">
                <Image 
                  src="https://picsum.photos/seed/pumpkinpuree/600/600" 
                  alt="制作南瓜泥的过程，新鲜南瓜蒸熟后打成泥"
                  fill
                  sizes="(max-width: 768px) 80vw, 400px"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
                自制南瓜泥是关键 - 选择甜度高的小南瓜效果最佳
              </figcaption>
            </figure>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">食材准备（8个份）</h2>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl">
              <h3 className="font-semibold text-lg mb-4 text-orange-800 dark:text-orange-300">面团：</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400">•</span>
                  <span>中筋面粉 350克</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400">•</span>
                  <span>细砂糖 50克</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400">•</span>
                  <span>活性干酵母 7克</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400">•</span>
                  <span>盐 1/4茶匙</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400">•</span>
                  <span>南瓜泥 120克（蒸熟后压泥）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400">•</span>
                  <span>牛奶 80毫升（温的，约37°C）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400">•</span>
                  <span>无盐黄油 30克（融化放凉）</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400">•</span>
                  <span>鸡蛋 1个（室温）</span>
                </li>
              </ul>

              <h3 className="font-semibold text-lg mt-6 mb-4 text-orange-800 dark:text-orange-300">内馅：</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400">•</span>
                  <span>软化黄油 50克</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400">•</span>
                  <span>红糖 80克</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400">•</span>
                  <span>肉桂粉 2茶匙</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 dark:text-orange-400">•</span>
                  <span>肉豆蔻粉 1/4茶匙（可选）</span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold mt-10 mb-4 text-gray-900 dark:text-white">制作步骤</h2>
            
            <ol className="space-y-6 pl-5">
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 flex items-center justify-center font-medium text-sm">1</span>
                <div>
                  <p className="font-medium">准备面团</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">在大碗中混合面粉、糖、酵母和盐。在另一个碗中，混合南瓜泥、温牛奶、融化的黄油和鸡蛋。将湿料倒入干料中，搅拌至形成粗糙面团。</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 flex items-center justify-center font-medium text-sm">2</span>
                <div>
                  <p className="font-medium">揉制面团</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">在撒粉的台面上揉面团约8-10分钟，直到面团光滑有弹性。放入涂油的碗中，盖上保鲜膜，在温暖处发酵至两倍大（约1-1.5小时）。</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 flex items-center justify-center font-medium text-sm">3</span>
                <div>
                  <p className="font-medium">制作内馅</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">将软化的黄油、红糖、肉桂粉和肉豆蔻粉混合均匀，备用。</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 flex items-center justify-center font-medium text-sm">4</span>
                <div>
                  <p className="font-medium">擀制与填充</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">将发酵好的面团擀成约30x40厘米的长方形。均匀涂抹内馅，从长边卷起成圆柱形，切成8等份。</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 flex items-center justify-center font-medium text-sm">5</span>
                <div>
                  <p className="font-medium">二次发酵与烘烤</p>
                  <p className="mt-1 text-gray-700 dark:text-gray-300">将面卷放入涂油的烤盘中，盖上保鲜膜，二次发酵30分钟。预热烤箱至190°C，烤25-30分钟至金黄色。</p>
                </div>
              </li>
            </ol>

            <figure className="my-8 rounded-xl overflow-hidden">
              <div className="relative aspect-[16/9] w-full">
                <Image 
                  src="https://picsum.photos/seed/cinnamonrolls/1200/675" 
                  alt="成品南瓜肉桂卷，表面淋有糖霜"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm text-center text-gray-500 dark:text-gray-400">
                出炉后可趁热淋上奶油糖霜，风味更佳
              </figcaption>
            </figure>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white">烹饪小贴士</h2>
            
            <div className="border border-orange-200 dark:border-orange-800 rounded-xl p-5 bg-orange-50/50 dark:bg-orange-900/10">
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">南瓜泥要彻底放凉后再使用，否则高温会杀死酵母。</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">如果喜欢更浓郁的肉桂味，可以增加肉桂粉的用量。</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">剩余的肉桂卷可以冷藏保存，食用前微波炉加热10-15秒即可恢复松软。</span>
                </li>
              </ul>
            </div>

            <p className="text-lg leading-relaxed mt-8">
              这款南瓜肉桂卷非常适合周末早餐或下午茶点，搭配一杯热咖啡或红茶，让整个秋日都变得温暖起来。如果你尝试了这个配方，欢迎在评论区分享你的成果！
            </p>

            {/* 文章标签 */}
            <div className="mt-10 flex flex-wrap gap-2">
              <Link 
                href="/blog/category/pumpkin" 
                className="inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
              >
                南瓜食谱
              </Link>
              <Link 
                href="/blog/category/baking" 
                className="inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
              >
                烘焙
              </Link>
              <Link 
                href="/blog/category/autumn" 
                className="inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
              >
                秋季美食
              </Link>
              <Link 
                href="/blog/category/breakfast" 
                className="inline-flex items-center gap-1.5 py-2 px-3 rounded-full text-sm bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
              >
                早餐
              </Link>
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
              <h4 className="font-medium text-gray-900 dark:text-gray-100">精选评论 (3)</h4>
              
              {/* 评论1 */}
              <div className="flex gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative shrink-0 w-10 h-10 rounded-full overflow-hidden">
                  <Image 
                    src="https://picsum.photos/seed/user1/100/100" 
                    alt="用户头像"
                    fill
                    sizes="40x40"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">王小明</h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400">3天前</span>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    太好吃了！我按照配方做了一次，全家人都很喜欢。我在糖霜里加了点橙汁，味道更清新了，推荐大家试试！
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>42</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>回复</span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 评论2 */}
              <div className="flex gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="relative shrink-0 w-10 h-10 rounded-full overflow-hidden">
                  <Image 
                    src="https://picsum.photos/seed/user2/100/100" 
                    alt="用户头像"
                    fill
                    sizes="40x40"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h5 className="font-medium text-gray-900 dark:text-gray-100">李小厨</h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400">1周前</span>
                  </div>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    面团发酵的时间很关键，我第一次做的时候发酵不够，口感偏硬。第二次延长了发酵时间，松软多了。南瓜选甜一点的品种真的很重要！
                  </p>
                  <div className="mt-3 flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-orange-600 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span>28</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>回复</span>
                    </button>
                  </div>
                </div>
              </div>
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
