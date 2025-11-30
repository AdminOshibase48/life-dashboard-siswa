// Main Application Controller - FIXED VERSION
class LifeDashboard {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.isSidebarOpen = false;
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.setupPWA();
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', this.handleNavigation.bind(this));
        
        // Form submissions
        document.addEventListener('submit', this.handleFormSubmit.bind(this));
        
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', this.toggleSidebar.bind(this));
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && this.isSidebarOpen) {
                const sidebar = document.getElementById('sidebar');
                const menuToggle = document.getElementById('menu-toggle');
                
                if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                    this.closeSidebar();
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));

        // Password toggle
        const passwordToggle = document.querySelector('.password-toggle');
        const passwordInput = document.getElementById('password');
        if (passwordToggle && passwordInput) {
            passwordToggle.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                passwordToggle.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
            });
        }
    }

    handleNavigation(e) {
        const target = e.target.closest('[data-page]');
        if (target) {
            e.preventDefault();
            const page = target.dataset.page;
            this.navigateTo(page);
        }

        // Handle bottom nav
        const bottomNavItem = e.target.closest('.bottom-nav-item');
        if (bottomNavItem) {
            e.preventDefault();
            document.querySelectorAll('.bottom-nav-item').forEach(item => {
                item.classList.remove('active');
            });
            bottomNavItem.classList.add('active');
        }
    }

    handleFormSubmit(e) {
        const form = e.target;
        
        if (form.id === 'login-form') {
            e.preventDefault();
            this.handleLogin(form);
        }
    }

    async navigateTo(page) {
        this.currentPage = page;
        
        // Update active states
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelectorAll(`[data-page="${page}"]`).forEach(link => {
            link.closest('.nav-item')?.classList.add('active');
        });

        // Load page content
        await this.loadPage(page);
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }
    }

    async loadPage(page) {
        const mainContent = document.getElementById('main-content');
        if (!mainContent) return;
        
        try {
            // Show loading state
            mainContent.innerHTML = this.getLoadingTemplate();
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Load page template
            const template = this.getPageTemplate(page);
            mainContent.innerHTML = template;
            
            // Initialize page-specific functionality
            this.initializePageComponents(page);
            
        } catch (error) {
            console.error('Error loading page:', error);
            mainContent.innerHTML = this.getErrorTemplate();
        }
    }

    getPageTemplate(page) {
        const templates = {
            dashboard: this.getDashboardTemplate(),
            games: this.getGamesTemplate(),
            finance: this.getFinanceTemplate(),
            mood: this.getMoodTemplate(),
            chatbot: this.getChatbotTemplate(),
            analytics: this.getAnalyticsTemplate(),
            settings: this.getSettingsTemplate(),
            help: this.getHelpTemplate()
        };
        
        return templates[page] || this.getNotFoundTemplate();
    }

    getDashboardTemplate() {
        return `
            <div class="fade-in">
                <div class="dashboard-header">
                    <h1>Selamat Datang, <span id="greeting-name">Siswa</span>! 👋</h1>
                    <p class="subtitle">Ini ringkasan aktivitas Anda hari ini</p>
                </div>
                
                <div class="grid grid-4">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">💰 Keuangan</h3>
                        </div>
                        <div class="card-content">
                            <div class="stat">
                                <div class="stat-value">Rp 250.000</div>
                                <div class="stat-label">Saldo Tersisa</div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 65%"></div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">😊 Mood Hari Ini</h3>
                        </div>
                        <div class="card-content">
                            <div class="mood-display">
                                <span class="mood-emoji">😊</span>
                                <span class="mood-text">Senang</span>
                            </div>
                            <button class="btn btn-outline btn-sm" data-page="mood">Update Mood</button>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">🎯 Target Belajar</h3>
                        </div>
                        <div class="card-content">
                            <div class="stat">
                                <div class="stat-value">3/5</div>
                                <div class="stat-label">Target Tercapai</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">📅 Jadwal</h3>
                        </div>
                        <div class="card-content">
                            <div class="schedule-item">
                                <div class="schedule-time">10:00</div>
                                <div class="schedule-title">Matematika</div>
                            </div>
                            <div class="schedule-item">
                                <div class="schedule-time">14:00</div>
                                <div class="schedule-title">Fisika</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getGamesTemplate() {
        return `
            <div class="fade-in">
                <div class="page-header">
                    <h1>🎮 Games & Hiburan</h1>
                    <p>Istirahat sejenak dengan game-game seru</p>
                </div>
                
                <div class="grid grid-3">
                    <div class="card game-card">
                        <div class="game-icon">🧩</div>
                        <h3 class="game-title">Puzzle Challenge</h3>
                        <p class="game-desc">Asah otak dengan puzzle menyenangkan</p>
                        <button class="btn btn-primary" onclick="if(window.gamesManager) window.gamesManager.startGame('puzzle')">Main Sekarang</button>
                    </div>
                    
                    <div class="card game-card">
                        <div class="game-icon">🎯</div>
                        <h3 class="game-title">Memory Match</h3>
                        <p class="game-desc">Uji daya ingat Anda</p>
                        <button class="btn btn-primary" onclick="if(window.gamesManager) window.gamesManager.startGame('memory')">Main Sekarang</button>
                    </div>
                    
                    <div class="card game-card">
                        <div class="game-icon">❓</div>
                        <h3 class="game-title">Quick Quiz</h3>
                        <p class="game-desc">Jawab pertanyaan secepatnya</p>
                        <button class="btn btn-primary" onclick="if(window.gamesManager) window.gamesManager.startGame('quiz')">Main Sekarang</button>
                    </div>
                </div>
            </div>
        `;
    }

    getFinanceTemplate() {
        return `
            <div class="fade-in">
                <div class="page-header">
                    <h1>💰 Laporan Keuangan</h1>
                    <p>Kelola dan pantau keuangan pribadi Anda</p>
                </div>
                
                <div class="finance-overview">
                    <div class="overview-card income">
                        <div class="overview-icon">💰</div>
                        <div class="overview-value">Rp 1.250.000</div>
                        <div class="overview-label">Pemasukan</div>
                    </div>
                    <div class="overview-card expense">
                        <div class="overview-icon">💸</div>
                        <div class="overview-value">Rp 850.000</div>
                        <div class="overview-label">Pengeluaran</div>
                    </div>
                    <div class="overview-card balance">
                        <div class="overview-icon">🏦</div>
                        <div class="overview-value">Rp 400.000</div>
                        <div class="overview-label">Saldo</div>
                    </div>
                    <div class="overview-card budget">
                        <div class="overview-icon">📊</div>
                        <div class="overview-value">68%</div>
                        <div class="overview-label">Budget Terpakai</div>
                    </div>
                </div>
                
                <div class="grid grid-2">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Tambah Transaksi</h3>
                        </div>
                        <div class="card-content">
                            <form id="finance-form" class="finance-form">
                                <div class="form-group">
                                    <label>Jenis Transaksi</label>
                                    <select name="type" class="form-select" required>
                                        <option value="income">Uang Masuk</option>
                                        <option value="expense">Uang Keluar</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label>Jumlah</label>
                                    <input type="number" name="amount" placeholder="Rp 0" class="form-input" required>
                                </div>
                                
                                <div class="form-group">
                                    <label>Kategori</label>
                                    <select name="category" class="form-select" required>
                                        <option value="food">Makanan</option>
                                        <option value="transport">Transportasi</option>
                                        <option value="entertainment">Hiburan</option>
                                        <option value="education">Pendidikan</option>
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label>Keterangan</label>
                                    <input type="text" name="description" placeholder="Deskripsi transaksi" class="form-input" required>
                                </div>
                                
                                <button type="submit" class="btn btn-primary">Simpan Transaksi</button>
                            </form>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Transaksi Terbaru</h3>
                        </div>
                        <div class="card-content">
                            <div class="transaction-list" id="transaction-list">
                                <div class="empty-state">
                                    <div class="empty-icon">💸</div>
                                    <div class="empty-title">Belum ada transaksi</div>
                                    <div class="empty-desc">Tambahkan transaksi pertama Anda</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getMoodTemplate() {
        return `
            <div class="fade-in">
                <div class="mood-tracker">
                    <div class="page-header">
                        <h1>😊 Mood Tracker</h1>
                        <p>Bagaimana perasaan Anda hari ini?</p>
                    </div>
                    
                    <div class="current-mood">
                        <div class="current-mood-emoji">😊</div>
                        <div class="current-mood-text">Senang</div>
                        <div class="current-mood-desc">Hari yang menyenangkan!</div>
                    </div>
                    
                    <div class="card">
                        <div class="card-content">
                            <div class="mood-selector">
                                <div class="mood-options">
                                    <div class="mood-option" data-mood="happy">
                                        <span class="mood-emoji">😊</span>
                                        <span class="mood-label">Senang</span>
                                    </div>
                                    <div class="mood-option" data-mood="sad">
                                        <span class="mood-emoji">😢</span>
                                        <span class="mood-label">Sedih</span>
                                    </div>
                                    <div class="mood-option" data-mood="tired">
                                        <span class="mood-emoji">😴</span>
                                        <span class="mood-label">Lelah</span>
                                    </div>
                                    <div class="mood-option" data-mood="bored">
                                        <span class="mood-emoji">😐</span>
                                        <span class="mood-label">Bosan</span>
                                    </div>
                                    <div class="mood-option" data-mood="excited">
                                        <span class="mood-emoji">🎉</span>
                                        <span class="mood-label">Semangat</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mood-intensity hidden">
                                <label class="intensity-label">Seberapa kuat perasaan ini?</label>
                                <input type="range" class="intensity-slider" min="1" max="5" value="3">
                                <div class="intensity-labels">
                                    <span>Sedikit</span>
                                    <span>Lumayan</span>
                                    <span>Normal</span>
                                    <span>Cukup</span>
                                    <span>Sangat</span>
                                </div>
                            </div>
                            
                            <div class="mood-notes">
                                <label class="notes-label">Catatan (opsional)</label>
                                <textarea class="notes-textarea" placeholder="Apa yang membuat Anda merasa seperti ini?"></textarea>
                            </div>
                            
                            <button class="btn btn-primary" id="save-mood">Simpan Mood</button>
                            
                            <div class="mood-recommendations hidden">
                                <h3>Rekomendasi untuk Anda</h3>
                                <div class="recommendation-list"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getChatbotTemplate() {
        return `
            <div class="fade-in">
                <div class="page-header">
                    <h1>🤖 AI Assistant</h1>
                    <p>Tanya apa saja tentang sekolah, tugas, atau mood Anda</p>
                </div>
                
                <div class="card chat-container">
                    <div class="chat-messages" id="chat-messages">
                        <div class="message bot-message">
                            <div class="message-avatar">🤖</div>
                            <div class="message-content">
                                <div class="message-text">Hai! Saya asisten AI Anda. Ada yang bisa saya bantu?</div>
                                <div class="message-time">Baru saja</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="quick-replies">
                        <button class="quick-reply" data-message="Tips belajar efektif">💡 Tips Belajar</button>
                        <button class="quick-reply" data-message="Rekomendasi musik">🎵 Rekomendasi Musik</button>
                        <button class="quick-reply" data-message="Bantuan tugas">📚 Bantuan Tugas</button>
                    </div>
                    
                    <div class="chat-input-container">
                        <div class="chat-input-group">
                            <input type="text" id="chat-input" placeholder="Ketik pesan Anda..." class="chat-input">
                            <button id="send-message" class="btn btn-primary btn-send">
                                <span>Kirim</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getAnalyticsTemplate() {
        return `
            <div class="fade-in">
                <div class="analytics-dashboard">
                    <div class="analytics-header">
                        <div>
                            <h1>📊 Analytics Dashboard</h1>
                            <p class="subtitle">Data penggunaan dan performa aplikasi</p>
                        </div>
                        <div class="analytics-controls">
                            <div class="date-filter">
                                <label>Periode:</label>
                                <select class="filter-select" id="period-select">
                                    <option value="today">Hari Ini</option>
                                    <option value="yesterday">Kemarin</option>
                                    <option value="week">7 Hari Terakhir</option>
                                    <option value="month">30 Hari Terakhir</option>
                                    <option value="all">Semua Waktu</option>
                                </select>
                            </div>
                            <button class="btn btn-outline" onclick="if(window.analyticsManager) window.analyticsManager.exportAnalyticsData()">
                                📥 Export Data
                            </button>
                        </div>
                    </div>

                    <div class="stats-grid">
                        <div class="stat-card sessions">
                            <div class="stat-icon">👥</div>
                            <div class="stat-number" id="sessions-count">0</div>
                            <div class="stat-label">Total Sessions</div>
                            <div class="stat-change positive" id="sessions-change">+0%</div>
                        </div>
                        <div class="stat-card pageviews">
                            <div class="stat-icon">📄</div>
                            <div class="stat-number" id="pageviews-count">0</div>
                            <div class="stat-label">Page Views</div>
                            <div class="stat-change positive" id="pageviews-change">+0%</div>
                        </div>
                        <div class="stat-card events">
                            <div class="stat-icon">🎯</div>
                            <div class="stat-number" id="events-count">0</div>
                            <div class="stat-label">Events</div>
                            <div class="stat-change positive" id="events-change">+0%</div>
                        </div>
                        <div class="stat-card features">
                            <div class="stat-icon">⚡</div>
                            <div class="stat-number" id="features-count">0</div>
                            <div class="stat-label">Features Used</div>
                            <div class="stat-change positive" id="features-change">+0%</div>
                        </div>
                    </div>

                    <div class="charts-container">
                        <div class="chart-card">
                            <div class="chart-header">
                                <div class="chart-title">Usage Trends</div>
                                <div class="chart-actions">
                                    <button class="btn btn-outline btn-sm">Hari</button>
                                    <button class="btn btn-outline btn-sm">Minggu</button>
                                    <button class="btn btn-primary btn-sm">Bulan</button>
                                </div>
                            </div>
                            <div class="chart-placeholder">
                                <div>
                                    <div style="font-size: 3rem; margin-bottom: 1rem;">📈</div>
                                    <div>Usage Trends Chart</div>
                                    <div style="font-size: 0.8rem; color: var(--text-light); margin-top: 0.5rem;">
                                        Grafik tren penggunaan akan ditampilkan di sini
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="chart-card">
                            <div class="chart-header">
                                <div class="chart-title">Feature Popularity</div>
                            </div>
                            <div class="chart-placeholder">
                                <div>
                                    <div style="font-size: 3rem; margin-bottom: 1rem;">🥇</div>
                                    <div>Feature Popularity</div>
                                    <div style="font-size: 0.8rem; color: var(--text-light); margin-top: 0.5rem;">
                                        Grafik popularitas fitur akan ditampilkan di sini
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="features-list">
                        <h3 style="margin-bottom: 1.5rem;">🔥 Fitur Paling Populer</h3>
                        <div id="popular-features-list">
                            <div class="no-data">
                                <div class="no-data-icon">📊</div>
                                <div class="no-data-title">Belum ada data</div>
                                <div class="no-data-desc">Gunakan aplikasi untuk melihat analytics</div>
                            </div>
                        </div>
                    </div>

                    <div class="journey-container">
                        <h3 style="margin-bottom: 1.5rem;">🧭 User Journey Terbaru</h3>
                        <div class="journey-steps" id="recent-journey">
                            <div class="no-data">
                                <div class="no-data-icon">🧭</div>
                                <div class="no-data-title">Belum ada journey</div>
                                <div class="no-data-desc">Navigasi aplikasi untuk melihat user journey</div>
                            </div>
                        </div>
                    </div>

                    <div class="errors-container">
                        <h3 style="margin-bottom: 1.5rem;">🚨 Error Terbaru</h3>
                        <div id="recent-errors">
                            <div class="no-data">
                                <div class="no-data-icon">✅</div>
                                <div class="no-data-title">Tidak ada error</div>
                                <div class="no-data-desc">Aplikasi berjalan dengan baik!</div>
                            </div>
                        </div>
                    </div>

                    <div class="privacy-controls">
                        <div class="privacy-warning">
                            <div class="privacy-warning-icon">🔒</div>
                            <h4>Privasi Data</h4>
                            <p>Data analytics disimpan secara lokal di perangkat Anda dan tidak dikirim ke server mana pun. Data digunakan hanya untuk meningkatkan pengalaman penggunaan aplikasi.</p>
                        </div>
                        <div class="privacy-actions">
                            <button class="btn btn-outline" onclick="if(window.analyticsManager) window.analyticsManager.exportAnalyticsData()">
                                📥 Export Data Analytics
                            </button>
                            <button class="btn btn-error" onclick="if(window.analyticsManager) window.analyticsManager.clearAnalyticsData()">
                                🗑️ Hapus Semua Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getSettingsTemplate() {
        return `
            <div class="fade-in">
                <div class="settings-container">
                    <div class="page-header">
                        <h1>⚙️ Pengaturan</h1>
                        <p>Kelola preferensi dan konfigurasi aplikasi</p>
                    </div>

                    <form id="settings-form">
                        <div class="settings-sections">
                            <div class="settings-section">
                                <h3>🎨 Tampilan</h3>
                                <div class="setting-group">
                                    <label class="setting-label">Tema</label>
                                    <select name="setting_theme" class="setting-input">
                                        <option value="light">Terang</option>
                                        <option value="dark">Gelap</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="settings-actions">
                            <button type="submit" class="btn btn-primary">Simpan Pengaturan</button>
                            <button type="button" class="btn btn-outline" id="reset-settings">Reset ke Default</button>
                        </div>
                    </form>

                    <div class="backup-section">
                        <div class="backup-header">
                            <div>
                                <h3>💾 Backup & Restore</h3>
                                <p style="color: var(--text-secondary); margin-top: 0.25rem;">
                                    Kelola data dan cadangan aplikasi
                                </p>
                            </div>
                        </div>

                        <div class="backup-actions">
                            <button type="button" class="btn btn-outline" id="backup-now">
                                📥 Buat Backup
                            </button>
                            <button type="button" class="btn btn-outline" id="restore-backup">
                                📤 Restore Backup
                            </button>
                        </div>
                    </div>

                    <div class="settings-section" style="border-color: var(--error);">
                        <h3 style="color: var(--error);">🚨 Zona Berbahaya</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">
                            Tindakan ini tidak dapat dibatalkan. Hapus semua data aplikasi.
                        </p>
                        <button type="button" class="btn btn-error" id="clear-all-data">
                            🗑️ Hapus Semua Data
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    getHelpTemplate() {
        return `
            <div class="fade-in">
                <div class="page-header">
                    <h1>❓ Bantuan & Panduan</h1>
                    <p>Temukan jawaban untuk pertanyaan umum</p>
                </div>
                
                <div class="card">
                    <div class="faq-list">
                        <div class="faq-item">
                            <div class="faq-question">Bagaimana cara menambah transaksi keuangan?</div>
                            <div class="faq-answer">Pergi ke halaman Keuangan, klik tombol "Tambah Transaksi", isi form, dan simpan.</div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question">Apakah data saya aman?</div>
                            <div class="faq-answer">Ya, semua data disimpan secara lokal di perangkat Anda dan dienkripsi.</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getLoadingTemplate() {
        return `
            <div class="loading-page">
                <div class="loading-spinner"></div>
                <p>Memuat halaman...</p>
            </div>
        `;
    }

    getErrorTemplate() {
        return `
            <div class="error-page">
                <div class="error-icon">😕</div>
                <h2>Terjadi Kesalahan</h2>
                <p>Gagal memuat halaman. Silakan coba lagi.</p>
                <button class="btn btn-primary" onclick="window.location.reload()">Muat Ulang</button>
            </div>
        `;
    }

    getNotFoundTemplate() {
        return `
            <div class="not-found-page">
                <div class="not-found-icon">🔍</div>
                <h2>Halaman Tidak Ditemukan</h2>
                <p>Halaman yang Anda cari tidak ada.</p>
                <button class="btn btn-primary" data-page="dashboard">Kembali ke Dashboard</button>
            </div>
        `;
    }

    initializePageComponents(page) {
        switch(page) {
            case 'dashboard':
                this.updateUserInfo();
                break;
            case 'finance':
                this.initializeFinanceTracker();
                break;
            case 'mood':
                this.initializeMoodTracker();
                break;
            case 'chatbot':
                this.initializeChatbot();
                break;
            case 'analytics':
                this.initializeAnalyticsPage();
                break;
            case 'settings':
                this.initializeSettingsPage();
                break;
        }
    }

    initializeMoodTracker() {
        const moodOptions = document.querySelectorAll('.mood-option');
        moodOptions.forEach(option => {
            option.addEventListener('click', () => {
                moodOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                const mood = option.dataset.mood;
                this.showMoodRecommendations(mood);
            });
        });

        // Save mood button
        const saveBtn = document.getElementById('save-mood');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const selected = document.querySelector('.mood-option.selected');
                if (selected) {
                    alert(`Mood "${selected.querySelector('.mood-label').textContent}" disimpan!`);
                } else {
                    alert('Pilih mood terlebih dahulu!');
                }
            });
        }
    }

    initializeChatbot() {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');
        const quickReplies = document.querySelectorAll('.quick-reply');

        const sendMessage = () => {
            const message = chatInput?.value.trim();
            if (message && document.getElementById('chat-messages')) {
                this.addChatMessage(message, 'user');
                if (chatInput) chatInput.value = '';
                this.simulateBotResponse(message);
            }
        };

        if (sendButton) sendButton.addEventListener('click', sendMessage);
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        }

        quickReplies.forEach(reply => {
            reply.addEventListener('click', () => {
                const message = reply.dataset.message;
                if (document.getElementById('chat-messages')) {
                    this.addChatMessage(message, 'user');
                    this.simulateBotResponse(message);
                }
            });
        });
    }

    addChatMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const timestamp = new Date().toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageDiv.innerHTML = `
            <div class="message-avatar">${sender === 'user' ? '👤' : '🤖'}</div>
            <div class="message-content">
                <div class="message-text">${text}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    simulateBotResponse(userMessage) {
        setTimeout(() => {
            let response = "Maaf, saya belum memahami pertanyaan itu. Bisakah Anda menjelaskannya lebih detail?";
            
            if (userMessage.toLowerCase().includes('belajar')) {
                response = "Berikut tips belajar efektif:\n1. Gunakan teknik Pomodoro (25 menit belajar, 5 menit istirahat)\n2. Buat ringkasan dengan mind mapping\n3. Ajarkan materi kepada orang lain\n4. Istirahat yang cukup";
            } else if (userMessage.toLowerCase().includes('musik')) {
                response = "Rekomendasi musik untuk belajar:\n• Lofi hip hop\n• Musik klasik (Mozart, Beethoven)\n• Soundtrack film instrumental\n• Ambient sounds";
            }
            
            this.addChatMessage(response, 'bot');
        }, 1000);
    }

    showMoodRecommendations(mood) {
        const recommendations = {
            happy: [
                { icon: '🎵', title: 'Musik Upbeat', desc: 'Dengarkan playlist musik yang menyenangkan' },
                { icon: '📝', title: 'Journaling', desc: 'Tuliskan momen bahagia hari ini' }
            ],
            sad: [
                { icon: '🎵', title: 'Musik Relaks', desc: 'Dengarkan musik yang menenangkan' },
                { icon: '📞', title: 'Hubungi Teman', desc: 'Berbicara dengan seseorang yang dipercaya' }
            ]
        };

        const container = document.querySelector('.mood-recommendations');
        const list = document.querySelector('.recommendation-list');
        if (!container || !list) return;
        
        const moodRecs = recommendations[mood] || [];
        list.innerHTML = moodRecs.map(rec => `
            <div class="recommendation-item">
                <div class="recommendation-icon">${rec.icon}</div>
                <div class="recommendation-content">
                    <div class="recommendation-title">${rec.title}</div>
                    <div class="recommendation-desc">${rec.desc}</div>
                </div>
            </div>
        `).join('');

        container.classList.remove('hidden');
    }

    initializeFinanceTracker() {
        const financeForm = document.getElementById('finance-form');
        if (financeForm) {
            financeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Transaksi berhasil disimpan!');
                financeForm.reset();
            });
        }
    }

    initializeAnalyticsPage() {
        // Basic analytics initialization
        console.log('Analytics page loaded');
    }

    initializeSettingsPage() {
        const settingsForm = document.getElementById('settings-form');
        if (settingsForm) {
            settingsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Pengaturan disimpan!');
            });
        }

        const clearBtn = document.getElementById('clear-all-data');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Yakin hapus semua data?')) {
                    localStorage.clear();
                    alert('Data dihapus!');
                }
            });
        }
    }

    handleLogin(form) {
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;
        const rememberMe = form.querySelector('#remember-me').checked;

        const loginBtn = form.querySelector('.btn-login');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');

        // Show loading state
        btnText.classList.add('hidden');
        btnLoader.classList.remove('hidden');
        loginBtn.disabled = true;

        // Simulate login process
        setTimeout(() => {
            this.currentUser = {
                name: 'Siswa',
                email: email,
                avatar: '👤'
            };

            // Store user data
            localStorage.setItem('user_data', JSON.stringify(this.currentUser));
            if (rememberMe) {
                localStorage.setItem('auth_token', 'demo_token');
            }

            // Hide login, show app
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');

            // Update user info
            this.updateUserInfo();

            // Navigate to dashboard
            this.navigateTo('dashboard');

        }, 2000);
    }

    updateUserInfo() {
        if (this.currentUser) {
            const userName = document.getElementById('user-name');
            const userAvatar = document.getElementById('user-avatar');
            const greetingName = document.getElementById('greeting-name');

            if (userName) userName.textContent = this.currentUser.name;
            if (userAvatar) userAvatar.textContent = this.currentUser.avatar;
            if (greetingName) greetingName.textContent = this.currentUser.name;
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menu-toggle');

        if (this.isSidebarOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }

    openSidebar() {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menu-toggle');

        sidebar.classList.add('active');
        menuToggle.classList.add('active');
        this.isSidebarOpen = true;
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menu-toggle');

        sidebar.classList.remove('active');
        menuToggle.classList.remove('active');
        this.isSidebarOpen = false;
    }

    handleResize() {
        if (window.innerWidth > 768 && this.isSidebarOpen) {
            this.closeSidebar();
        }
    }

    checkAuthStatus() {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user_data');

        if (token && userData) {
            this.currentUser = JSON.parse(userData);
            document.getElementById('splash-screen').classList.add('hidden');
            document.getElementById('app').classList.remove('hidden');
            this.updateUserInfo();
            this.navigateTo('dashboard');
        } else {
            // Show splash then login
            setTimeout(() => {
                document.getElementById('splash-screen').classList.add('hidden');
                document.getElementById('login-screen').classList.remove('hidden');
            }, 3000);
        }
    }

    setupPWA() {
        // PWA setup would go here
        console.log('PWA setup completed');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LifeDashboard();
    window.app.init();
});
