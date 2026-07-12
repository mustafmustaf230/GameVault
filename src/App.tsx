import { Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthProvider } from "./context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import ArticlePage from "./pages/ArticlePage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import PremiumPage from "./pages/PremiumPage";
import PublishPage from "./pages/PublishPage";

export default function App() {
  const { i18n } = useTranslation();
  const rtl = i18n.language === "ku" || i18n.language === "ar" || i18n.language === "fa";

  return (
    <AuthProvider>
      <div dir={rtl ? "rtl" : "ltr"} className="flex min-h-screen flex-col bg-neutral-50 dark:bg-neutral-950">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/article/:id" element={<ArticlePage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/premium" element={<PremiumPage />} />
            <Route path="/publish" element={<PublishPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
