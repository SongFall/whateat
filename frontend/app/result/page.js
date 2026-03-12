"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, ChevronLeft, ChevronRight, Clock, Calendar, BookmarkPlus } from "lucide-react";
import { getAllArticles } from "@/app/services/articles/articlesApi";
import { getAllRecipes } from "@/app/services/recipes/recipesApi";

const SearchResultsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // 获取搜索参数
  const keyword = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all'; // all, article, recipe
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = 10;
  
  // 状态管理
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  // 搜索功能
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const searchQuery = formData.get('search');
    
    if (searchQuery) {
      router.push(`/result?q=${encodeURIComponent(searchQuery)}&category=all&page=1`);
    }
  };
  
  // 筛选功能
  const handleFilterChange = (newCategory) => {
    router.push(`/result?q=${encodeURIComponent(keyword)}&category=${newCategory}&page=1`);
  };
  
  // 分页功能
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/result?q=${encodeURIComponent(keyword)}&category=${category}&page=${newPage}`);
    }
  };
  
  // 获取搜索结果
  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword) {
        setResults([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        let allResults = [];
        let totalCount = 0;
        
        // 根据筛选条件获取结果
        if (category === 'all' || category === 'article') {
          try {
            const articlesResponse = await getAllArticles({ 
              search: keyword, 
              page, 
              limit 
            });
            // 处理文章数据，支持两种返回格式
            const articles = articlesResponse.data || articlesResponse;
            if (articles && articles.length > 0) {
              const articleResults = articles.map(article => ({
                id: article.id,
                title: article.title,
                excerpt: article.excerpt,
                coverImage: article.coverImage,
                author: article.author,
                publishDate: article.publishDate,
                readTime: article.readingTime || article.readTime,
                type: 'article',
                url: `/article/${article.id}`
              }));
              allResults = [...allResults, ...articleResults];
              totalCount += articles.length;
            }
          } catch (articleError) {
            console.error('获取文章搜索结果失败:', articleError);
            // 继续执行，不影响菜谱搜索
          }
        }
        
        if (category === 'all' || category === 'recipe') {
          try {
            const recipesResponse = await getAllRecipes({ 
              search: keyword, 
              page, 
              limit 
            });
            // 处理菜谱数据，支持两种返回格式
            const recipes = recipesResponse.data || recipesResponse;
            if (recipes && recipes.length > 0) {
              const recipeResults = recipes.map(recipe => ({
                id: recipe.id,
                title: recipe.title,
                excerpt: recipe.description,
                coverImage: recipe.coverImage,
                author: recipe.author,
                publishDate: recipe.createdAt,
                readTime: recipe.cookTime,
                type: 'recipe',
                url: `/recipe/${recipe.id}`
              }));
              allResults = [...allResults, ...recipeResults];
              totalCount += recipes.length;
            }
          } catch (recipeError) {
            console.error('获取菜谱搜索结果失败:', recipeError);
            // 继续执行，不影响文章搜索
          }
        }
        
        // 按发布日期排序
        allResults.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
        
        setResults(allResults);
        setTotalResults(totalCount);
        setTotalPages(Math.ceil(totalCount / limit));
        
        // 如果没有结果且没有错误，设置无结果状态
        if (allResults.length === 0) {
          setError('未找到相关结果，尝试使用其他关键词搜索');
        }
      } catch (err) {
        console.error('获取搜索结果失败:', err);
        setError('获取搜索结果失败，请重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [keyword, category, page, limit]);
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 搜索栏 */}
      <div className="border-b border-border py-4">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                name="search"
                placeholder="搜索美食、菜谱、文章..."
                defaultValue={keyword}
                className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </form>
        </div>
      </div>
      
      {/* 筛选和结果区域 */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* 筛选选项 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              搜索结果: {keyword}
              {category !== 'all' && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({category === 'article' ? '文章' : '菜谱'})
                </span>
              )}
            </h1>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">筛选:</span>
              <button
                onClick={() => handleFilterChange('all')}
                className={`px-3 py-1 rounded-full text-sm ${category === 'all' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                全部
              </button>
              <button
                onClick={() => handleFilterChange('article')}
                className={`px-3 py-1 rounded-full text-sm ${category === 'article' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                文章
              </button>
              <button
                onClick={() => handleFilterChange('recipe')}
                className={`px-3 py-1 rounded-full text-sm ${category === 'recipe' 
                  ? 'bg-orange-600 text-white' 
                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                菜谱
              </button>
            </div>
          </div>
          
          {/* 加载状态 */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
              <span className="ml-3 text-gray-600">搜索中...</span>
            </div>
          )}
          
          {/* 错误状态 */}
          {error && (
            <div className="py-12 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
              >
                重试
              </button>
            </div>
          )}
          
          {/* 无结果状态 */}
          {!loading && !error && results.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-600 mb-4">未找到相关结果</p>
              <p className="text-gray-500">尝试使用其他关键词搜索</p>
            </div>
          )}
          
          {/* 搜索结果 */}
          {!loading && !error && results.length > 0 && (
            <>
              <div className="space-y-6">
                {results.map((item) => (
                  <Link 
                    key={`${item.type}-${item.id}`} 
                    href={item.url}
                    className="block group"
                  >
                    <div className="flex flex-col md:flex-row gap-4 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="relative w-full md:w-48 h-32 md:h-40 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.coverImage || "https://picsum.photos/seed/food/400/300"}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 200px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 left-2 px-2 py-1 bg-orange-600 text-white text-xs rounded">
                          {item.type === 'article' ? '文章' : '菜谱'}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {item.excerpt}
                        </p>
                        <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{item.publishDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{item.readTime}</span>
                          </div>
                          <div>
                            <span className="text-gray-400">作者: {item.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* 分页 */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="px-3 py-1 rounded-l-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-4 py-1 border-t border-b ${i === 0 ? 'border-l' : ''} ${i === Math.min(5, totalPages) - 1 ? 'border-r' : ''} border-gray-300 dark:border-gray-700 ${pageNum === page ? 'bg-orange-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="px-3 py-1 rounded-r-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;