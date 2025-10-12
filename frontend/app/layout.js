import "./globals.css";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-16 md:pt-20 w-full mx-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
