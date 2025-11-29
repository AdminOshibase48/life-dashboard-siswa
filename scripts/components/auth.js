// Authentication component
class AuthManager {
    constructor() {
        this.isAuthenticated = false;
        this.currentUser = null;
    }

    async login(email, password) {
        try {
            // Simulate API call
            const response = await this.mockLoginAPI(email, password);
            
            if (response.success) {
                this.isAuthenticated = true;
                this.currentUser = response.user;
                this.saveAuthData(response.token, response.user);
                return { success: true, user: response.user };
            } else {
                return { success: false, error: response.error };
            }
        } catch (error) {
            return { success: false, error: 'Terjadi kesalahan saat login' };
        }
    }

    async register(userData) {
        try {
            // Simulate API call
            const response = await this.mockRegisterAPI(userData);
            
            if (response.success) {
                return { success: true, message: 'Registrasi berhasil' };
            } else {
                return { success: false, error: response.error };
            }
        } catch (error) {
            return { success: false, error: 'Terjadi kesalahan saat registrasi' };
        }
    }

    logout() {
        this.isAuthenticated = false;
        this.currentUser = null;
        this.clearAuthData();
        window.location.reload();
    }

    saveAuthData(token, user) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
    }

    clearAuthData() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    }

    checkAuthStatus() {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
            this.isAuthenticated = true;
            this.currentUser = JSON.parse(userData);
            return true;
        }
        
        return false;
    }

    // Mock API methods for demo
    async mockLoginAPI(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Demo validation
                if (email && password.length >= 6) {
                    resolve({
                        success: true,
                        user: {
                            id: 1,
                            name: 'Siswa Demo',
                            email: email,
                            avatar: '👤',
                            school: 'SMA Negeri 1 Contoh'
                        },
                        token: 'demo_jwt_token_' + Date.now()
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'Email atau password salah'
                    });
                }
            }, 1500);
        });
    }

    async mockRegisterAPI(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (userData.email && userData.password && userData.name) {
                    resolve({
                        success: true,
                        message: 'Registrasi berhasil! Silakan login.'
                    });
                } else {
                    resolve({
                        success: false,
                        error: 'Data registrasi tidak lengkap'
                    });
                }
            }, 1500);
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
