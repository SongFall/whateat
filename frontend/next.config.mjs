/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    // 开发模式下的优化
    removeConsole:
      process.env.NODE_ENV === "development"
        ? false
        : {
            exclude: ["error", "warn"],
          },
  },

  // 服务器配置
  server: {
    port: 3000,
  },
    images: {
    domains: [
      'picsum.photos', // 允许加载 picsum 图片
      'localhost', // 本地开发用（可选）
      // 若后续添加其他图片域名，可在此处继续添加
    ],
    // 可选：配置图片格式优化（提升性能）
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
