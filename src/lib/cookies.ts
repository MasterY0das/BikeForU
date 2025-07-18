// Cookie management utility for BikeForU

export interface CookieOptions {
  expires?: number; // days
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export class CookieManager {
  static set(name: string, value: string, options: CookieOptions = {}): void {
    const {
      expires = 30, // default 30 days
      path = '/',
      domain,
      secure = true,
      sameSite = 'Lax'
    } = options;

    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (expires) {
      const date = new Date();
      date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
      cookie += `; expires=${date.toUTCString()}`;
    }

    if (path) cookie += `; path=${path}`;
    if (domain) cookie += `; domain=${domain}`;
    if (secure) cookie += '; secure';
    if (sameSite) cookie += `; samesite=${sameSite}`;

    document.cookie = cookie;
  }

  static get(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }
    
    return null;
  }

  static delete(name: string, options: CookieOptions = {}): void {
    this.set(name, '', { ...options, expires: -1 });
  }

  static exists(name: string): boolean {
    return this.get(name) !== null;
  }

  // Specific methods for BikeForU
  static setLoginState(isLoggedIn: boolean, userId?: string): void {
    this.set('bikeforu_logged_in', isLoggedIn.toString(), { expires: 30 });
    if (userId) {
      this.set('bikeforu_user_id', userId, { expires: 30 });
    }
  }

  static getLoginState(): { isLoggedIn: boolean; userId?: string } {
    const isLoggedIn = this.get('bikeforu_logged_in') === 'true';
    const userId = this.get('bikeforu_user_id') || undefined;
    
    return { isLoggedIn, userId };
  }

  static clearLoginState(): void {
    this.delete('bikeforu_logged_in');
    this.delete('bikeforu_user_id');
  }

  static setUserPreferences(preferences: Record<string, any>): void {
    this.set('bikeforu_preferences', JSON.stringify(preferences), { expires: 365 });
  }

  static getUserPreferences(): Record<string, any> {
    const prefs = this.get('bikeforu_preferences');
    if (prefs) {
      try {
        return JSON.parse(prefs);
      } catch {
        return {};
      }
    }
    return {};
  }

  static setTheme(theme: 'light' | 'dark'): void {
    this.set('bikeforu_theme', theme, { expires: 365 });
  }

  static getTheme(): 'light' | 'dark' {
    return (this.get('bikeforu_theme') as 'light' | 'dark') || 'light';
  }
}

export default CookieManager; 