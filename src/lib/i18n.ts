export type LanguageCode =
  | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'zh' | 'ja' | 'ko'
  | 'ar' | 'fa' | 'ku' | 'nl' | 'sv' | 'pl' | 'uk' | 'hi' | 'bn' | 'ta'
  | 'te' | 'ur' | 'id' | 'ms' | 'th' | 'vi' | 'tr_exclude' // placeholder, never used
  | 'el' | 'cs' | 'ro' | 'hu' | 'da' | 'fi' | 'no' | 'he' | 'sw' | 'fil'
  | 'ca';

export type Language = {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  rtl?: boolean;
};

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', rtl: true },
  { code: 'ku', name: 'Kurdish', nativeName: 'کوردی', flag: '🏳️', rtl: true },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'uk', name: 'Ukrainian', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Malay', nativeName: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'cs', name: 'Czech', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'da', name: 'Danish', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Finnish', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'no', name: 'Norwegian', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', flag: '🇮🇱', rtl: true },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', flag: '🇰🇪' },
  { code: 'fil', name: 'Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
  { code: 'ca', name: 'Catalan', nativeName: 'Català', flag: '🇪🇸' },
];

export type TranslationKey =
  | 'tagline' | 'signIn' | 'signUp' | 'signOut' | 'email' | 'password' | 'username'
  | 'alreadyHaveAccount' | 'dontHaveAccount' | 'home' | 'publish' | 'profile' | 'upgrade'
  | 'premium' | 'free' | 'allPlatforms' | 'search' | 'searchArticles' | 'featured'
  | 'latestNews' | 'noArticles' | 'readMore' | 'views' | 'comments' | 'writeComment'
  | 'postComment' | 'noComments' | 'commentsLocked' | 'publishingLocked' | 'upgradeToComment'
  | 'upgradeToPublish' | 'premiumBadge' | 'title' | 'summary' | 'body' | 'coverImage'
  | 'platform' | 'category' | 'tags' | 'publishArticle' | 'cancel' | 'submit' | 'back'
  | 'commentDeleted' | 'articlePublished' | 'publishError' | 'commentPosted' | 'commentError'
  | 'loginError' | 'signUpError' | 'usernameRequired' | 'editProfile' | 'save' | 'bio'
  | 'avatarUrl' | 'profileUpdated' | 'profileError' | 'memberSince' | 'myArticles'
  | 'noOwnArticles' | 'premiumMember' | 'freeMember' | 'upgradeNow' | 'premiumBenefits'
  | 'benefit1' | 'benefit2' | 'benefit3' | 'perMonth' | 'subscribe' | 'comingSoon'
  | 'processing' | 'subscribeError' | 'manageSubscription' | 'cancelPremium' | 'cancelConfirm'
  | 'loadMore' | 'filterByPlatform' | 'filterByCategory' | 'by' | 'minutesAgo' | 'hoursAgo'
  | 'daysAgo' | 'justNow' | 'delete' | 'edit' | 'required' | 'minChars' | 'optional'
  | 'yourFeed' | 'trending' | 'allNews' | 'getPremium' | 'premiumTitle' | 'premiumDesc'
  | 'closeArticle' | 'relatedNews' | 'loadMoreComments' | 'showAll' | 'showLess'
  | 'allCategories' | 'sortBy' | 'newest' | 'oldest' | 'mostViewed' | 'mostCommented';

type TranslationDict = Record<TranslationKey, string>;

const en: TranslationDict = {
  tagline: 'Gaming news for every platform',
  signIn: 'Sign In',
  signUp: 'Sign Up',
  signOut: 'Sign Out',
  email: 'Email',
  password: 'Password',
  username: 'Username',
  alreadyHaveAccount: 'Already have an account? Sign in',
  dontHaveAccount: "Don't have an account? Sign up",
  home: 'Home',
  publish: 'Publish',
  profile: 'Profile',
  upgrade: 'Upgrade',
  premium: 'Premium',
  free: 'Free',
  allPlatforms: 'All Platforms',
  search: 'Search',
  searchArticles: 'Search articles...',
  featured: 'Featured',
  latestNews: 'Latest News',
  noArticles: 'No articles found',
  readMore: 'Read More',
  views: 'views',
  comments: 'Comments',
  writeComment: 'Write a comment...',
  postComment: 'Post Comment',
  noComments: 'No comments yet. Be the first to share your thoughts!',
  commentsLocked: 'Comments are a Premium feature',
  publishingLocked: 'Publishing is a Premium feature',
  upgradeToComment: 'Upgrade to Premium to join the conversation',
  upgradeToPublish: 'Upgrade to Premium to publish your own news',
  premiumBadge: 'PRO',
  title: 'Title',
  summary: 'Summary',
  body: 'Article Body',
  coverImage: 'Cover Image URL',
  platform: 'Platform',
  category: 'Category',
  tags: 'Tags (comma-separated)',
  publishArticle: 'Publish Article',
  cancel: 'Cancel',
  submit: 'Submit',
  back: 'Back',
  commentDeleted: 'Comment deleted',
  articlePublished: 'Article published successfully!',
  publishError: 'Failed to publish article',
  commentPosted: 'Comment posted!',
  commentError: 'Failed to post comment',
  loginError: 'Failed to sign in',
  signUpError: 'Failed to sign up',
  usernameRequired: 'Username is required',
  editProfile: 'Edit Profile',
  save: 'Save',
  bio: 'Bio',
  avatarUrl: 'Avatar URL',
  profileUpdated: 'Profile updated!',
  profileError: 'Failed to update profile',
  memberSince: 'Member since',
  myArticles: 'My Articles',
  noOwnArticles: 'You have not published any articles yet',
  premiumMember: 'Premium Member',
  freeMember: 'Free Member',
  upgradeNow: 'Upgrade Now',
  premiumBenefits: 'Premium Benefits',
  benefit1: 'Comment on any article and join the discussion',
  benefit2: 'Publish your own gaming news and reviews',
  benefit3: 'Premium PRO badge on your profile and comments',
  perMonth: 'per month',
  subscribe: 'Subscribe Now',
  comingSoon: 'Coming Soon',
  processing: 'Processing...',
  subscribeError: 'Subscription setup failed. Please try again.',
  manageSubscription: 'Manage Subscription',
  cancelPremium: 'Cancel Premium',
  cancelConfirm: 'Are you sure you want to cancel your Premium subscription?',
  loadMore: 'Load More',
  filterByPlatform: 'Filter by Platform',
  filterByCategory: 'Filter by Category',
  by: 'by',
  minutesAgo: 'min ago',
  hoursAgo: 'h ago',
  daysAgo: 'd ago',
  justNow: 'just now',
  delete: 'Delete',
  edit: 'Edit',
  required: 'Required',
  minChars: 'Minimum 10 characters',
  optional: 'Optional',
  yourFeed: 'Your Feed',
  trending: 'Trending',
  allNews: 'All News',
  getPremium: 'Get Premium',
  premiumTitle: 'Unlock Premium',
  premiumDesc: 'Join the community and make your voice heard',
  closeArticle: 'Back to all news',
  relatedNews: 'More News',
  loadMoreComments: 'Load more comments',
  showAll: 'Show all',
  showLess: 'Show less',
  allCategories: 'All Categories',
  sortBy: 'Sort by',
  newest: 'Newest',
  oldest: 'Oldest',
  mostViewed: 'Most Viewed',
  mostCommented: 'Most Commented',
};

const translations: Partial<Record<LanguageCode, Partial<TranslationDict>>> = {
  en,
  es: { ...en, tagline: 'Noticias de gaming para cada plataforma', signIn: 'Iniciar Sesión', signUp: 'Registrarse', signOut: 'Cerrar Sesión', email: 'Correo', password: 'Contraseña', username: 'Usuario', home: 'Inicio', publish: 'Publicar', profile: 'Perfil', upgrade: 'Mejorar', premium: 'Premium', free: 'Gratis', search: 'Buscar', featured: 'Destacado', latestNews: 'Últimas Noticias', noArticles: 'No se encontraron artículos', readMore: 'Leer más', views: 'vistas', comments: 'Comentarios', perMonth: 'al mes', subscribe: 'Suscribirse', premiumTitle: 'Desbloquear Premium' },
  fr: { ...en, tagline: 'Actualités gaming pour chaque plateforme', signIn: 'Se connecter', signUp: "S'inscrire", signOut: 'Se déconnecter', email: 'Email', password: 'Mot de passe', username: "Nom d'utilisateur", home: 'Accueil', publish: 'Publier', profile: 'Profil', upgrade: 'Améliorer', premium: 'Premium', free: 'Gratuit', search: 'Rechercher', featured: 'À la une', latestNews: 'Dernières actualités', perMonth: 'par mois', subscribe: "S'abonner" },
  de: { ...en, tagline: 'Gaming-News für jede Plattform', signIn: 'Anmelden', signUp: 'Registrieren', signOut: 'Abmelden', email: 'E-Mail', password: 'Passwort', username: 'Benutzername', home: 'Startseite', publish: 'Veröffentlichen', profile: 'Profil', upgrade: 'Upgrade', premium: 'Premium', free: 'Kostenlos', search: 'Suchen', featured: 'Empfohlen', latestNews: 'Neueste Nachrichten', perMonth: 'pro Monat', subscribe: 'Abonnieren' },
  ar: { ...en, tagline: 'أخبار الألعاب لكل منصة', signIn: 'تسجيل الدخول', signUp: 'إنشاء حساب', signOut: 'تسجيل الخروج', email: 'البريد الإلكتروني', password: 'كلمة المرور', username: 'اسم المستخدم', home: 'الرئيسية', publish: 'نشر', profile: 'الملف الشخصي', upgrade: 'ترقية', premium: 'بريميوم', free: 'مجاني', search: 'بحث', featured: 'مميز', latestNews: 'أحدث الأخبار', perMonth: 'شهرياً', subscribe: 'اشترك' },
  ku: { ...en, tagline: 'هەواڵی یاری بۆ هەموو پلاتفۆرمێک', signIn: 'چوونەژوورەوە', signUp: 'خۆتۆمارکردن', signOut: 'چوونەدەرەوە', email: 'ئیمەیڵ', password: 'وشەی نهێنی', username: 'ناوی بەکارهێنەر', home: 'سەرەتا', publish: 'بڵاوکردنەوە', profile: 'پرۆفایل', upgrade: 'بەرزکردنەوە', premium: 'پریمیەم', free: 'بەخۆڕایی', search: 'گەڕان', featured: 'تایبەت', latestNews: 'نوێترین هەواڵەکان', perMonth: 'بۆ هەر مانگێک', subscribe: 'بەشداربە', premiumTitle: 'پریمیەم بکەرەوە', noArticles: 'هیچ وتارێک نەدۆزرایەوە', readMore: 'بیشترین بخوێنەرەوە', views: 'بینراوەکان', comments: 'لێدوانەکان' },
  zh: { ...en, tagline: '每个平台的游戏新闻', signIn: '登录', signUp: '注册', signOut: '退出', email: '邮箱', password: '密码', username: '用户名', home: '首页', publish: '发布', profile: '个人资料', upgrade: '升级', premium: '高级', free: '免费', search: '搜索', featured: '精选', latestNews: '最新新闻', perMonth: '每月', subscribe: '订阅' },
  ja: { ...en, tagline: 'あらゆるプラットフォームのゲームニュース', signIn: 'ログイン', signUp: '新規登録', signOut: 'ログアウト', email: 'メール', password: 'パスワード', username: 'ユーザー名', home: 'ホーム', publish: '投稿', profile: 'プロフィール', upgrade: 'アップグレード', premium: 'プレミアム', free: '無料', search: '検索', featured: '注目', latestNews: '最新ニュース', perMonth: '月額', subscribe: '登録' },
  ko: { ...en, tagline: '모든 플랫폼의 게임 뉴스', signIn: '로그인', signUp: '가입', signOut: '로그아웃', email: '이메일', password: '비밀번호', username: '사용자명', home: '홈', publish: '게시', profile: '프로필', upgrade: '업그레이드', premium: '프리미엄', free: '무료', search: '검색', featured: '추천', latestNews: '최신 뉴스', perMonth: '월', subscribe: '구독' },
  ru: { ...en, tagline: 'Игровые новости для всех платформ', signIn: 'Войти', signUp: 'Регистрация', signOut: 'Выйти', email: 'Эл. почта', password: 'Пароль', username: 'Имя пользователя', home: 'Главная', publish: 'Опубликовать', profile: 'Профиль', upgrade: 'Улучшить', premium: 'Премиум', free: 'Бесплатно', search: 'Поиск', featured: 'Рекомендуем', latestNews: 'Последние новости', perMonth: 'в месяц', subscribe: 'Подписаться' },
  pt: { ...en, tagline: 'Notícias de jogos para todas as plataformas', signIn: 'Entrar', signUp: 'Cadastrar', signOut: 'Sair', email: 'Email', password: 'Senha', username: 'Usuário', home: 'Início', publish: 'Publicar', profile: 'Perfil', upgrade: 'Melhorar', premium: 'Premium', free: 'Grátis', search: 'Buscar', featured: 'Destaque', latestNews: 'Últimas notícias', perMonth: 'por mês', subscribe: 'Assinar' },
  it: { ...en, tagline: 'Notizie di gioco per ogni piattaforma', signIn: 'Accedi', signUp: 'Registrati', signOut: 'Esci', email: 'Email', password: 'Password', username: 'Nome utente', home: 'Home', publish: 'Pubblica', profile: 'Profilo', upgrade: 'Aggiorna', premium: 'Premium', free: 'Gratis', search: 'Cerca', featured: 'In evidenza', latestNews: 'Ultime notizie', perMonth: 'al mese', subscribe: 'Iscriviti' },
  hi: { ...en, tagline: 'हर प्लेटफ़ॉर्म के लिए गेमिंग समाचार', signIn: 'साइन इन', signUp: 'साइन अप', signOut: 'साइन आउट', email: 'ईमेल', password: 'पासवर्ड', username: 'उपयोगकर्ता नाम', home: 'होम', publish: 'प्रकाशित करें', profile: 'प्रोफ़ाइल', upgrade: 'अपग्रेड', premium: 'प्रीमियम', free: 'मुफ़्त', search: 'खोज', featured: 'विशेष', latestNews: 'ताज़ा समाचार', perMonth: 'प्रति माह', subscribe: 'सदस्यता लें' },
  fa: { ...en, tagline: 'اخبار بازی برای هر پلتفرم', signIn: 'ورود', signUp: 'ثبت نام', signOut: 'خروج', email: 'ایمیل', password: 'رمز عبور', username: 'نام کاربری', home: 'خانه', publish: 'انتشار', profile: 'پروفایل', upgrade: 'ارتقا', premium: 'پریمیوم', free: 'رایگان', search: 'جستجو', featured: 'ویژه', latestNews: 'آخرین اخبار', perMonth: 'در ماه', subscribe: 'مشترک شوید' },
  nl: { ...en, tagline: 'Gaming nieuws voor elk platform', signIn: 'Inloggen', signUp: 'Aanmelden', signOut: 'Uitloggen', email: 'Email', password: 'Wachtwoord', username: 'Gebruikersnaam', home: 'Home', publish: 'Publiceren', profile: 'Profiel', upgrade: 'Upgrade', premium: 'Premium', free: 'Gratis', search: 'Zoeken', featured: 'Uitgelicht', latestNews: 'Laatste nieuws', perMonth: 'per maand', subscribe: 'Abonneer' },
  uk: { ...en, tagline: 'Ігрові новини для всіх платформ', signIn: 'Увійти', signUp: 'Реєстрація', signOut: 'Вийти', email: 'Ел. пошта', password: 'Пароль', username: "Ім'я користувача", home: 'Головна', publish: 'Опублікувати', profile: 'Профіль', upgrade: 'Покращити', premium: 'Преміум', free: 'Безкоштовно', search: 'Пошук', featured: 'Рекомендуємо', latestNews: 'Останні новини', perMonth: 'на місяць', subscribe: 'Підписатися' },
  pl: { ...en, tagline: 'Wiadomości gamingowe dla każdej platformy', signIn: 'Zaloguj', signUp: 'Zarejestruj', signOut: 'Wyloguj', email: 'Email', password: 'Hasło', username: 'Nazwa użytkownika', home: 'Strona główna', publish: 'Opublikuj', profile: 'Profil', upgrade: 'Ulepsz', premium: 'Premium', free: 'Darmowo', search: 'Szukaj', featured: 'Wyróżnione', latestNews: 'Najnowsze wiadomości', perMonth: 'miesięcznie', subscribe: 'Subskrybuj' },
  tr_exclude: en,
};

export function t(lang: LanguageCode, key: TranslationKey): string {
  const dict = translations[lang] || translations.en!;
  return dict[key] || translations.en![key] || String(key);
}

export function isRTL(lang: LanguageCode): boolean {
  const l = LANGUAGES.find((x) => x.code === lang);
  return l?.rtl ?? false;
}
