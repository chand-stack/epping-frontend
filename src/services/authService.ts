interface User {
  id: string;
  username: string;
  role: 'admin' | 'staff';
  lastLogin?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

class AuthService {
  private storageKey = 'epping_admin_auth';
  private callbacks: Array<(state: AuthState) => void> = [];
  private authState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null
  };

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if token is still valid (24 hours)
        if (parsed.token && parsed.expiresAt && Date.now() < parsed.expiresAt) {
          this.authState = {
            isAuthenticated: true,
            user: parsed.user,
            token: parsed.token
          };
        } else {
          this.clearAuth();
        }
      }
    } catch (error) {
      console.error('Failed to load auth from storage:', error);
      this.clearAuth();
    }
  }

  private saveToStorage() {
    try {
      const data = {
        ...this.authState,
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save auth to storage:', error);
    }
  }

  private notifySubscribers() {
    this.callbacks.forEach(callback => callback(this.authState));
  }

  subscribe(callback: (state: AuthState) => void) {
    this.callbacks.push(callback);
    // Immediately call with current state
    callback(this.authState);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  async login(username: string, password: string): Promise<{ success: boolean; message: string }> {
    // Simple hardcoded credentials for demo
    // In production, this would make an API call to your backend
    const validCredentials = [
      { username: 'admin', password: 'admin123', role: 'admin' as const },
      { username: 'staff', password: 'staff123', role: 'staff' as const },
      { username: 'manager', password: 'manager123', role: 'admin' as const }
    ];

    const user = validCredentials.find(
      cred => cred.username === username && cred.password === password
    );

    if (user) {
      const token = this.generateToken();
      this.authState = {
        isAuthenticated: true,
        user: {
          id: user.username,
          username: user.username,
          role: user.role,
          lastLogin: new Date().toISOString()
        },
        token
      };
      
      this.saveToStorage();
      this.notifySubscribers();
      
      return { success: true, message: 'Login successful' };
    }

    return { success: false, message: 'Invalid username or password' };
  }

  logout() {
    this.clearAuth();
    this.notifySubscribers();
  }

  private clearAuth() {
    this.authState = {
      isAuthenticated: false,
      user: null,
      token: null
    };
    localStorage.removeItem(this.storageKey);
  }

  private generateToken(): string {
    return 'token_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  getCurrentUser(): User | null {
    return this.authState.user;
  }

  getToken(): string | null {
    return this.authState.token;
  }

  hasRole(role: 'admin' | 'staff'): boolean {
    return this.authState.user?.role === role;
  }

  isAdmin(): boolean {
    return this.hasRole('admin');
  }

  isStaff(): boolean {
    return this.hasRole('staff');
  }
}

export const authService = new AuthService();

