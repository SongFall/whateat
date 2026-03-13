'use client'
import { useState, useEffect } from 'react';
import DataTable from '@/components/admin/DataTable';
import Modal, { FormField, Select } from '@/components/admin/Modal';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { getAllUsers, createUser, updateUser, deleteUser } from '@/app/services/users/usersApi';
import { getAllRecipes, createRecipe, updateRecipe, deleteRecipe } from '@/app/services/recipes/recipesApi';
import { getAllArticles, createArticle, updateArticle, deleteArticle } from '@/app/services/articles/articlesApi';
import { generateArticle } from '@/app/services/ai/aiApi';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [articles, setArticles] = useState([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // 模态框状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // 表单数据
  const [formData, setFormData] = useState({
    username: '',
    avatar: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active'
  });

  const tabs = [
    { id: 'users', label: '用户管理' },
    { id: 'recipes', label: '菜谱管理' },
    { id: 'articles', label: '文章管理' },
    { id: 'settings', label: '站点配置' },
  ];

  // 加载用户数据
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载菜谱数据
  const loadRecipes = async () => {
    setLoading(true);
    try {
      const data = await getAllRecipes();
      setRecipes(data);
    } catch (error) {
      console.error('获取菜谱列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 加载文章数据
  const loadArticles = async () => {
    setLoading(true);
    try {
      const { data, count } = await getAllArticles();
      setCount(count);
      setArticles(data);
    } catch (error) {
      console.error('获取文章列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 切换标签时加载对应数据
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'recipes') {
      loadRecipes();
    } else if (activeTab === 'articles') {
      loadArticles();
    }
  }, [activeTab]);

  // 处理表单输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 打开新增模态框
  const handleAdd = () => {
    if (activeTab === 'recipes') {
      // 菜谱管理添加时跳转到uploadpage
      window.location.href = '/uploadpage';
      return;
    }
    
    setCurrentItem(null);
    setIsEditing(false);
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'user',
      style: '',
      theme: '',
      summary: ''
    });
    setIsModalOpen(true);
  };

  // 打开编辑模态框
  const handleEdit = (item) => {
    // 对于文章，跳转到编辑页面
    if (activeTab === 'articles' && item.id) {
      window.location.href = `/article/edit/${item.id}`;
      return;
    }
    
    // 对于其他类型，使用模态框
    setCurrentItem(item);
    setIsEditing(true);
    setFormData({
      username: item.username || '',
      email: item.email || '',
      password: '',
      role: item.role || 'user'
    });
    setIsModalOpen(true);
  };

  // 处理删除
  const handleDelete = (id) => {
    setItemToDelete(id);
    setIsConfirmOpen(true);
  };

  // 确认删除
  const confirmDelete = async () => {
    try {
      if (activeTab === 'users') {
        await deleteUser(itemToDelete);
        loadUsers();
      } else if (activeTab === 'recipes') {
        await deleteRecipe(itemToDelete);
        loadRecipes();
      } else if (activeTab === 'articles') {
        await deleteArticle(itemToDelete);
        loadArticles();
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请重试');
    }
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      if (activeTab === 'articles' && !isEditing) {
        setIsSubmitting(true);
      }
      
      if (isEditing) {
        // 编辑
        if (activeTab === 'users') {
          // 只在密码不为空时包含密码字段
          const userData = { ...formData };
          if (!userData.password) {
            delete userData.password;
          }
          await updateUser(currentItem.id, userData);
          loadUsers();
        } else if (activeTab === 'recipes') {
          await updateRecipe(currentItem.id, formData);
          loadRecipes();
        } else if (activeTab === 'articles') {
          await updateArticle(currentItem.id, formData);
          loadArticles();
        }
      } else {
        // 新增
        if (activeTab === 'users') {
          await createUser(formData);
          loadUsers();
        } else if (activeTab === 'recipes') {
          await createRecipe(formData);
          loadRecipes();
        } else if (activeTab === 'articles') {
          // 调用AI生成文章接口
          const aiResponse = await generateArticle({
            style: formData.style,
            theme: formData.theme,
            summary: formData.summary
          });
          console.log('AI生成文章成功:', aiResponse);
          
          // 后端已经完成了文章的创建，直接刷新文章列表
          loadArticles();
          setSuccessMessage('文章生成成功！');
          setTimeout(() => {
            setSuccessMessage('');
          }, 3000);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('保存失败:', error);
      alert('保存失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 用户管理列定义
  const userColumns = [
    { key: 'id', label: 'ID' },
    { key: 'avatar', label:"头像", render: (user) => {
      return (
        <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
      )
    }},
    { key: 'username', label: '用户名' },
    { key: 'email', label: '邮箱' },
    { key: 'role', label: '角色', render: (user) => user.role === 'admin' ? '管理员' : '普通用户' },
    // { key: 'status', label: '状态', render: (user) => (
    //   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
    //     {user.status === 'active' ? '活跃' : '禁用'}
    //   </span>
    // )}
  ];

  // 菜谱管理列定义
  const recipeColumns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: '标题' },
    { key: 'author', label: '作者' },
    { key: 'views', label: '浏览量' },
    { key: 'status', label: '状态', render: (recipe) => (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${recipe.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
        {recipe.status === 'published' ? '已发布' : '草稿'}
      </span>
    )}
  ];

  // 文章管理列定义
  const articleColumns = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: '标题' },
    { key: 'author', label: '作者' },
    { key: 'viewCount', label: '浏览量' },
    // { key: 'status', label: '状态', render: (article) => (
    //   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
    //     {article.status === 'published' ? '已发布' : '草稿'}
    //   </span>
    // )}
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 成功消息 */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-6">
          {/* 左侧标签栏 */}
          <div className="md:w-1/4 bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors ${activeTab === tab.id ? 'bg-orange-50 text-orange-600 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 右侧内容区域 */}
          <div className="md:w-3/4 bg-white rounded-lg shadow-sm p-6">
            {/* 用户管理 */}
            {activeTab === 'users' && (
              <DataTable
                title="用户管理"
                data={users}
                columns={userColumns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKey="username"
                searchPlaceholder="搜索用户名..."
              />
            )}

            {/* 菜谱管理 */}
            {activeTab === 'recipes' && (
              <DataTable
                title="菜谱管理"
                data={recipes}
                columns={recipeColumns}
                onAdd={handleAdd}
                onDelete={handleDelete}
                searchKey="title"
                searchPlaceholder="搜索菜谱标题..."
              />
            )}

            {/* 文章管理 */}
            {activeTab === 'articles' && (
              <DataTable
                title="文章管理"
                data={articles}
                columns={articleColumns}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
                searchKey="title"
                searchPlaceholder="搜索文章标题..."
              />
            )}

            {/* 站点配置 */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-6">站点配置</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 mb-1">
                        站点名称
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        defaultValue="美食网站"
                      />
                    </div>
                    <div>
                      <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 mb-1">
                        站点描述
                      </label>
                      <input
                        type="text"
                        id="siteDescription"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        defaultValue="分享美食，享受生活"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="siteKeywords" className="block text-sm font-medium text-gray-700 mb-1">
                      站点关键词
                    </label>
                    <input
                      type="text"
                      id="siteKeywords"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                      defaultValue="美食,菜谱,烹饪,家常菜"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="siteLogo" className="block text-sm font-medium text-gray-700 mb-1">
                      站点Logo
                    </label>
                    <input
                      type="file"
                      id="siteLogo"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 mr-3"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    >
                      保存设置
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 模态框 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? `编辑${activeTab === 'users' ? '用户' : activeTab === 'recipes' ? '菜谱' : '文章'}` : `添加${activeTab === 'users' ? '用户' : activeTab === 'recipes' ? '菜谱' : '文章'}`}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      >
        {activeTab === 'users' && (
          <>
            <FormField
              label="用户名"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="请输入用户名"
              required
            />
            <FormField
              label="邮箱"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="请输入邮箱"
              required
            />
            {!isEditing && (
              <FormField
                label="密码"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="请输入密码"
                required
              />
            )}
            <Select
              label="角色"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              options={[
                { value: 'user', label: '普通用户' },
                { value: 'admin', label: '管理员' }
              ]}
              required
            />
          </>
        )}

        {activeTab === 'recipes' && (
          <>
            <FormField
              label="标题"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="请输入菜谱标题"
              required
            />
            <FormField
              label="作者"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              placeholder="请输入作者"
              required
            />
            <Select
              label="状态"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              options={[
                { value: 'draft', label: '草稿' },
                { value: 'published', label: '已发布' }
              ]}
              required
            />
          </>
        )}

        {activeTab === 'articles' && (
          <>
            <FormField
              label="风格"
              name="style"
              value={formData.style}
              onChange={handleInputChange}
              placeholder="请输入文章风格（如：轻松活泼、专业严谨等）"
              required
            />
            <FormField
              label="主题"
              name="theme"
              value={formData.theme}
              onChange={handleInputChange}
              placeholder="请输入文章主题"
              required
            />
            <FormField
              label="摘要"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              placeholder="请输入文章摘要"
              required
            />
          </>
        )}
      </Modal>

      {/* 确认弹窗 */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="确认删除"
        message="确定要删除此记录吗？此操作不可恢复。"
        confirmText="删除"
        cancelText="取消"
      />
    </div>
  );
};

export default AdminPage;