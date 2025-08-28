interface PageConfig {
  title: string;
  description?: string;
  requiredAuth?: boolean;
  allowedRoles?: string[];
  layout?: "root" | "auth";
  showHeader?: boolean;
  showFooter?: boolean;
}

export const pagesConfig: Record<string, PageConfig> = {
  "/": {
    title: "Главная",
    layout: "root",
    showHeader: true,
    showFooter: true,
  },
  "/login": {
    title: "Вход",
    layout: "auth",
    showHeader: false,
    showFooter: false,
  },
  "/register": {
    title: "Регистрация",
    layout: "auth",
    showHeader: false,
    showFooter: false,
  },
};
