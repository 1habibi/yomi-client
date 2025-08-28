// Утилиты для работы с cookies

export interface CookieOptions {
  expires?: Date;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  httpOnly?: boolean;
}

export class CookieManager {
  // Получить cookie
  static get(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + "=";
    const cookies = document.cookie.split(";");

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }

  // Удалить cookie
  static remove(name: string, path: string = "/", domain?: string): void {
    let cookieString = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`;

    if (domain) {
      cookieString += `; domain=${domain}`;
    }

    document.cookie = cookieString;
  }

  // Проверить существование cookie
  static exists(name: string): boolean {
    return this.get(name) !== null;
  }
}

// Константы для имен cookies
export const COOKIE_NAMES = {
  REFRESH_TOKEN: "refreshToken",
  SESSION_ID: "sessionId",
  ACCESS_TOKEN: "accessToken", // Опционально, если решим хранить в cookie
} as const;
