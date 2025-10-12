"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 表单验证
  const validateForm = () => {
    const newErrors = {};

    // 邮箱验证
    if (!email.trim()) {
      newErrors.email = "请输入邮箱地址";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "请输入有效的邮箱地址";
    }

    // 密码验证
    if (!password) {
      newErrors.password = "请输入密码";
    } else if (password.length < 6) {
      newErrors.password = "密码长度至少为6位";
    }

    // 确认密码验证（仅注册表单）
    if (!isLogin) {
      if (!confirmPassword) {
        newErrors.confirmPassword = "请确认密码";
      } else if (confirmPassword !== password) {
        newErrors.confirmPassword = "两次输入的密码不一致";
      }

      // 用户名验证
      if (!name.trim()) {
        newErrors.name = "请输入用户名";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 表单提交处理
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // 模拟API请求延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 这里是模拟的登录/注册逻辑
      console.log(`${isLogin ? "登录" : "注册"}请求:`, {
        name: isLogin ? undefined : name,
        email,
        password,
      });

      // 登录/注册成功后重定向到首页
      router.push("/");
    } catch (error) {
      console.error(`${isLogin ? "登录" : "注册"}失败:`, error);
      setErrors({ submit: `${isLogin ? "登录" : "注册"}失败，请稍后重试` });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-4">
      <div className="w-full max-w-md px-6 py-5 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
        {/* Logo和标题 */}
        <div className="text-center mb-4">
          <div className="flex justify-center mb-4">
            <Link href="/" className="flex items-center focus:outline-none" aria-label="Home">
              <img src="/logo.svg" alt="ShopHub Logo" className="w-20 h-20" />
              <span className="text-2xl font-bold text-gray-800 font-mono">Whateat</span>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLogin ? "欢迎回来" : "创建账号"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {isLogin ? "登录您的账号，继续探索美食世界" : "加入我们，发现更多美食灵感"}
          </p>
        </div>

        {/* 错误提示 */}
        {errors.submit && (
          <div className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {errors.submit}
          </div>
        )}

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 用户名输入（仅注册表单） */}
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                用户名
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
                  errors.name
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/30 dark:border-red-700"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/30 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }`}
                placeholder="请输入您的用户名"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
              )}
            </div>
          )}

          {/* 邮箱输入 */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              邮箱地址
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
                errors.email
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/30 dark:border-red-700"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/30 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              }`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
            )}
          </div>

          {/* 密码输入 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                密码
              </label>
              {isLogin && (
                <a
                  href="#"
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  忘记密码?
                </a>
              )}
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
                errors.password
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500/30 dark:border-red-700"
                  : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/30 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              }`}
              placeholder="请输入您的密码"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
            )}
          </div>

          {/* 确认密码输入（仅注册表单） */}
          {!isLogin && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                确认密码
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-colors ${
                  errors.confirmPassword
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500/30 dark:border-red-700"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-500/30 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                }`}
                placeholder="请再次输入密码"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          )}

          {/* 提交按钮 */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg hover:from-blue-700 hover:to-violet-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                {isLogin ? "登录中..." : "注册中..."}
              </div>
            ) : isLogin ? (
              "登录"
            ) : (
              "注册"
            )}
          </button>

          {/* 分隔线 */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative px-4 bg-white dark:bg-gray-800">
              <span className="text-sm text-gray-500 dark:text-gray-400">或通过以下方式登录</span>
            </div>
          </div>

          {/* 第三方登录选项 */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              className="flex items-center justify-center p-2 rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 transition-colors"
              aria-label="使用Google登录"
            >
              <svg
                className="h-6 w-6 text-gray-700 dark:text-gray-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12.48 20.99h7.92v-8h-3.61v3.27h-2.02l-.37-3.27H8.41v-2.11h2.67V7.22c0-2.67 1.47-4.16 4.03-4.16h2.5v2.13h-1.54c-1.44 0-2.09.97-2.09 2.06v1.89h3.68l-.43 3.28h-3.25v8z" />
              </svg>
            </button>
            <button
              type="button"
              className="flex items-center justify-center p-2 rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 transition-colors"
              aria-label="使用Facebook登录"
            >
              <svg
                className="h-6 w-6 text-gray-700 dark:text-gray-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </button>
            <button
              type="button"
              className="flex items-center justify-center p-2 rounded-lg border border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50 transition-colors"
              aria-label="使用Apple登录"
            >
              <svg
                className="h-6 w-6 text-gray-700 dark:text-gray-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.117 5.639C15.242 4.441 12.861 3.804 10.533 3.958c-2.16.141-4.214.757-5.862 1.958C2.786 7.908 1.846 10.199 1.846 12.57c0 2.12.728 4.147 2.006 5.782.974 1.162 2.273 2.05 3.883 2.521-.043-.17-.062-.346-.062-.527 0-1.497.59-2.832 1.567-3.822-.542-.015-1.038-.172-1.456-.437v-.035c.762.437 1.638.692 2.549.692.717 0 1.402-.096 2.032-.273-.763-.47-1.275-1.266-1.275-2.247 0-.526.138-1.01.393-1.436.255-.426.607-.79 1.044-1.074-.736-.096-1.368-.251-1.887-.455v.021c0 1.03.324 1.992.919 2.836.61 0 1.177-.162 1.68-.454.503-.292.903-.655 1.192-1.076a3.956 3.956 0 01.451-4.079zM21.99 12c0-.996-.07-1.974-.216-2.933-.151-1.004-.389-1.974-.71-2.9-.321-.935-.748-1.813-1.262-2.625-.513-.813-1.098-1.54-1.754-2.177a10.06 10.06 0 00-2.48-.986c-.936-.274-1.915-.409-2.936-.409s-2.001.135-2.936.409a10.06 10.06 0 00-2.48.986c-.656.637-1.241 1.364-1.754 2.177-.514.812-.941 1.69-1.262 2.625-.321.926-.559 1.896-.71 2.9-.146.959-.216 1.937-.216 2.933 0 .996.07 1.974.216 2.933.151 1.004.389 1.974.71 2.9.321.935.748 1.813 1.262 2.625.513.813 1.098 1.54 1.754 2.177a10.06 10.06 0 002.48.986c.936.274 1.915.409 2.936.409s2.001-.135 2.936-.409a10.06 10.06 0 002.48-.986c.656-.637 1.241-1.364 1.754-2.177.514-.812.941-1.69 1.262-2.625.321-.926.559-1.896.71-2.9.146-.959.216-1.937.216-2.933z" />
              </svg>
            </button>
          </div>
        </form>

        {/* 切换登录/注册 */}
        <div className="text-center mt-8">
          <p className="text-gray-600 dark:text-gray-400">
            {isLogin ? (
              <>
                还没有账号?{" "}
                <button
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  立即注册
                </button>
              </>
            ) : (
              <>
                已有账号?{" "}
                <button
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  立即登录
                </button>
              </>
            )}
          </p>
        </div>

        {/* 隐私政策链接 */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            点击"{isLogin ? "登录" : "注册"}"，即表示您同意我们的
            <a href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
              使用条款
            </a>
            和
            <a href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
              隐私政策
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
