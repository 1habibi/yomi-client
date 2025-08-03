import { RootLayout } from "@/layouts";
import {
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/auth/LoginPage";
import { RegisterPage } from "../pages/auth/RegisterPage";
import { PATH } from "./paths";

// Корневой маршрут
const rootRoute = createRootRoute({
  component: RootLayout,
});

// Главная страница
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: PATH.HOME,
  component: HomePage,
});

// Маршруты аутентификации
const authLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: PATH.LOGIN,
  component: LoginPage,
});

const authRegisterRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: PATH.REGISTER,
  component: RegisterPage,
});

// Создание дерева маршрутов
const routeTree = rootRoute.addChildren([
  indexRoute,
  authLoginRoute,
  authRegisterRoute,
]);

// Создание и экспорт роутера
export const router = createRouter({ routeTree });

// Регистрация типов для TypeScript
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
