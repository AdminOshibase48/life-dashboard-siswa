// Main Application Controller
class LifeDashboard {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'dashboard';
        this.isSidebarOpen = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
        this.initializeTemplates();
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
        
        // Add other form handlers here
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
        
        try {
            // Show loading state
            mainContent.innerHTML = this.getLoadingTemplate();
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
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
                
                <div class="grid grid-2" style="margin-top: 1.5rem;">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Aktivitas Terbaru</h3>
                        </div>
                        <div class="card-content">
                            <div class="activity-list">
                                <div class="activity-item">
                                    <div class="activity-icon">💰</div>
                                    <div class="activity-content">
                                        <div class="activity-title">Pengeluaran Baru</div>
                                        <div class="activity-desc">Makan siang - Rp 25.000</div>
                                        <div class="activity-time">2 jam yang lalu</div>
                                    </div>
                                </div>
                                <div class="activity-item">
                                    <div class="activity-icon">😊</div>
                                    <div class="activity-content">
                                        <div class="activity-title">Mood Diperbarui</div>
                                        <div class="activity-desc">Dari 😐 menjadi 😊</div>
                                        <div class="activity-time">4 jam yang lalu</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Rekomendasi Hari Ini</h3>
                        </div>
                        <div class="card-content">
                            <div class="recommendation">
                                <div class="recommendation-icon">🎵</div>
                                <div class="recommendation-content">
                                    <div class="recommendation-title">Musik untuk Fokus</div>
                                    <div class="recommendation-desc">Dengarkan playlist lo-fi untuk belajar</div>
                                </div>
                            </div>
                            <div class="recommendation">
                                <div class="recommendation-icon">💡</div>
                                <div class="recommendation-content">
                                    <div class="recommendation-title">Tips Belajar</div>
                                    <div class="recommendation-desc">Gunakan teknik Pomodoro</div>
                                </div>
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
                        <button class="btn btn-primary">Main Sekarang</button>
                    </div>
                    
                    <div class="card game-card">
                        <div class="game-icon">🎯</div>
                        <h3 class="game-title">Memory Match</h3>
                        <p class="game-desc">Uji daya ingat Anda</p>
                        <button class="btn btn-primary">Main Sekarang</button>
                    </div>
                    
                    <div class="card game-card">
                        <div class="game-icon">❓</div>
                        <h3 class="game-title">Quick Quiz</h3>
                        <p class="game-desc">Jawab pertanyaan secepatnya</p>
                        <button class="btn btn-primary">Main Sekarang</button>
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
                
                <div class="grid grid-2">
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Saldo & Budget</h3>
                        </div>
                        <div class="card-content">
                            <div class="balance-display">
                                <div class="balance-amount">Rp 250.000</div>
                                <div class="balance-label">Saldo Tersisa</div>
                            </div>
                            <div class="budget-progress">
                                <div class="progress-item">
                                    <div class="progress-label">Makanan</div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: 75%"></div>
                                    </div>
                                    <div class="progress-value">75%</div>
                                </div>
                                <div class="progress-item">
                                    <div class="progress-label">Transportasi</div>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: 40%"></div>
                                    </div>
                                    <div class="progress-value">40%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-header">
                            <h3 class="card-title">Tambah Transaksi</h3>
                        </div>
                        <div class="card-content">
                            <form id="finance-form" class="finance-form">
                                <div class="input-group">
                                    <label>Jenis Transaksi</label>
                                    <select class="form-select">
                                        <option value="income">Uang Masuk</option>
                                        <option value="expense">Uang Keluar</option>
                                    </select>
                                </div>
                                
                                <div class="input-group">
                                    <label>Jumlah</label>
                                    <input type="number" placeholder="Rp 0" class="form-input">
                                </div>
                                
                                <div class="input-group">
                                    <label>Kategori</label>
                                    <select class="form-select">
                                        <option value="food">Makanan</option>
                                        <option value="transport">Transportasi</option>
                                        <option value="entertainment">Hiburan</option>
                                        <option value="education">Pendidikan</option>
                                    </select>
                                </div>
                                
                                <div class="input-group">
                                    <label>Keterangan</label>
                                    <input type="text" placeholder="Deskripsi transaksi" class="form-input">
                                </div>
                                
                                <button type="submit" class="btn btn-primary">Simpan Transaksi</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getMoodTemplate() {
        return `
            <div class="fade-in">
                <div class="page-header">
                    <h1>😊 Mood Tracker</h1>
                    <p>Bagaimana perasaan Anda hari ini?</p>
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
                        
                        <div class="mood-recommendations hidden">
                            <h3>Rekomendasi untuk Anda</h3>
                            <div class="recommendation-list">
                                <!-- Recommendations will be loaded here -->
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
                    
                    <div class="chat-input-container">
                        <div class="quick-replies">
                            <button class="quick-reply" data-message="Tips belajar efektif">💡 Tips Belajar</button>
                            <button class="quick-reply" data-message="Rekomendasi musik">🎵 Rekomendasi Musik</button>
                            <button class="quick-reply" data-message="Bantuan tugas">📚 Bantuan Tugas</button>
                        </div>
                        
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

    getSettingsTemplate() {
        return `
            <div class="fade-in">
                <div class="page-header">
                    <h1>⚙️ Pengaturan</h1>
                    <p>Kelola preferensi dan akun Anda</p>
                </div>
                
                <div class="grid grid-2">
                    <div class="card">
                        <h3 class="card-title">Profil Pengguna</h3>
                        <form class="settings-form">
                            <div class="input-group">
                                <label>Nama Lengkap</label>
                                <input type="text" value="Siswa" class="form-input">
                            </div>
                            <div class="input-group">
                                <label>Email</label>
                                <input type="email" value="siswa@example.com" class="form-input">
                            </div>
                            <div class="input-group">
                                <label>Sekolah</label>
                                <input type="text" placeholder="Nama sekolah" class="form-input">
                            </div>
                            <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
                        </form>
                    </div>
                    
                    <div class="card">
                        <h3 class="card-title">Preferensi</h3>
                        <div class="preference-item">
                            <label class="checkbox">
                                <input type="checkbox" checked>
                                <span class="checkmark"></span>
                                Notifikasi email
                            </label>
                        </div>
                        <div class="preference-item">
                            <label class="checkbox">
                                <input type="checkbox" checked>
                                <span class="checkmark"></span>
                                Dark mode
                            </label>
                        </div>
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
                        <div class="faq-item">
                            <div class="faq-question">Bagaimana cara menggunakan AI Assistant?</div>
                            <div class="faq-answer">Pergi ke halaman AI Assistant, ketik pertanyaan Anda, atau gunakan quick replies.</div>
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
            case 'mood':
                this.initializeMoodTracker();
                break;
            case 'chatbot':
                this.initializeChatbot();
                break;
            case 'finance':
                this.initializeFinanceTracker();
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
    }

    initializeChatbot() {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');
        const quickReplies = document.querySelectorAll('.quick-reply');

        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (message) {
                this.addChatMessage(message, 'user');
                chatInput.value = '';
                this.simulateBotResponse(message);
            }
        };

        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });

        quickReplies.forEach(reply => {
            reply.addEventListener('click', () => {
                const message = reply.dataset.message;
                this.addChatMessage(message, 'user');
                this.simulateBotResponse(message);
            });
        });
    }

    addChatMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
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
            } else if (userMessage.toLowerCase().includes('tugas')) {
                response = "Untuk bantuan tugas, coba:\n1. Break down tugas menjadi bagian kecil\n2. Buat jadwal pengerjaan\n3. Gunakan sumber seperti Khan Academy atau Ruangguru\n4. Mintalah bantuan guru atau teman";
            } else if (userMessage.toLowerCase().includes('mood') || userMessage.toLowerCase().includes('sedih')) {
                response = "Jika sedang tidak mood, coba:\n• Istirahat sejenak\n• Dengarkan musik favorit\n• Lakukan peregangan\n• Minum air putih\n• Bicara dengan teman atau keluarga";
            }
            
            this.addChatMessage(response, 'bot');
        }, 1000);
    }

    showMoodRecommendations(mood) {
        const recommendations = {
            happy: [
                { icon: '🎵', title: 'Musik Upbeat', desc: 'Dengarkan playlist musik yang menyenangkan' },
                { icon: '📝', title: 'Journaling', desc: 'Tuliskan momen bahagia hari ini' },
                { icon: '🎯', title: 'Set Goals', desc: 'Manfaatkan energi positif untuk capai target' }
            ],
            sad: [
                { icon: '🎵', title: 'Musik Relaks', desc: 'Dengarkan musik yang menenangkan' },
                { icon: '📞', title: 'Hubungi Teman', desc: 'Berbicara dengan seseorang yang dipercaya' },
                { icon: '🎬', title: 'Film Inspiratif', desc: 'Tonton film yang membangkitkan semangat' }
            ],
            tired: [
                { icon: '💤', title: 'Istirahat', desc: 'Ambil waktu untuk tidur sebentar' },
                { icon: '🧘', title: 'Peregangan', desc: 'Lakukan peregangan ringan' },
                { icon: '🍵', title: 'Teh Hangat', desc: 'Minum teh herbal yang menenangkan' }
            ],
            bored: [
                { icon: '🎮', title: 'Main Game', desc: 'Coba game seru di platform ini' },
                { icon: '📚', title: 'Baca Buku', desc: 'Baca buku atau artikel menarik' },
                { icon: '🎨', title: 'Kreatif', desc: 'Coba kegiatan seni atau kerajinan' }
            ],
            excited: [
                { icon: '🎯', title: 'Channel Energy', desc: 'Fokuskan energi pada proyek atau belajar' },
                { icon: '🏃', title: 'Olahraga', desc: 'Lakukan aktivitas fisik' },
                { icon: '📣', title: 'Berbagi', desc: 'Bagikan semangat dengan teman' }
            ]
        };

        const container = document.querySelector('.mood-recommendations');
        const list = document.querySelector('.recommendation-list');
        
        list.innerHTML = recommendations[mood].map(rec => `
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
        // Initialize finance chart and form handling
        const financeForm = document.getElementById('finance-form');
        if (financeForm) {
            financeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Transaksi berhasil disimpan!');
                financeForm.reset();
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
            // For demo purposes, always succeed
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

            // Update user info in header
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

    initializeTemplates() {
        // Preload templates or initialize any template-related functionality
    }
}

// Password toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const passwordToggle = document.querySelector('.password-toggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type');
            passwordToggle.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    }
});

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LifeDashboard();
});

// Dalam class LifeDashboard, tambahkan method:
setupPWA() {
    if (window.pwaHelper) {
        window.pwaHelper.setupOfflineSupport();
    }
}

// Panggil dalam init():
init() {
    this.setupEventListeners();
    this.checkAuthStatus();
    this.initializeTemplates();
    this.setupPWA(); // Tambah ini
}

// Dalam getPageTemplate(), tambahkan:
getPageTemplate(page) {
    const templates = {
        // ... existing templates ...
        analytics: this.getAnalyticsTemplate(),
    };
    return templates[page] || this.getNotFoundTemplate();
}

getAnalyticsTemplate() {
    return `
        <div class="fade-in">
            <!-- Content dari pages/analytics.html -->
            ${this.getAnalyticsContent()}
        </div>
    `;
}

getAnalyticsContent() {
    return `
        <!-- Isi dari file pages/analytics.html di atas -->
    `;
}

// Dalam initializePageComponents(), tambahkan:
initializePageComponents(page) {
    switch(page) {
        // ... existing cases ...
        case 'analytics':
            this.initializeAnalyticsPage();
            break;
    }
}

initializeAnalyticsPage() {
    if (window.analyticsManager) {
        this.loadAnalyticsData();
    }
}

loadAnalyticsData() {
    // Load and display analytics data
    const dailyStats = window.analyticsManager.getDailyStats();
    
    // Update stats cards
    document.getElementById('sessions-count').textContent = dailyStats.sessions;
    document.getElementById('pageviews-count').textContent = dailyStats.pageViews;
    document.getElementById('events-count').textContent = dailyStats.events;
    document.getElementById('features-count').textContent = dailyStats.uniqueFeatures;
    
    // Load popular features
    this.loadPopularFeatures();
    
    // Load recent journey
    this.loadRecentJourney();
    
    // Load recent errors
    this.loadRecentErrors();
}

loadPopularFeatures() {
    const popularFeatures = window.analyticsManager.getPopularFeatures(5);
    const container = document.getElementById('popular-features-list');
    
    if (!container) return;
    
    if (popularFeatures.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">📊</div>
                <div class="no-data-title">Belum ada data</div>
                <div class="no-data-desc">Gunakan aplikasi untuk melihat analytics</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = popularFeatures.map(feature => `
        <div class="feature-item">
            <div class="feature-info">
                <div class="feature-icon">${feature.name.charAt(0).toUpperCase()}</div>
                <div class="feature-name">${this.formatFeatureName(feature.name)}</div>
            </div>
            <div class="feature-stats">
                <div class="feature-count">${feature.count}x</div>
                <div class="feature-last-used">${new Date(feature.lastUsed).toLocaleDateString('id-ID')}</div>
            </div>
        </div>
    `).join('');
}

loadRecentJourney() {
    const recentJourney = window.analyticsManager.getUserJourney();
    const container = document.getElementById('recent-journey');
    
    if (!container) return;
    
    if (recentJourney.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">🧭</div>
                <div class="no-data-title">Belum ada journey</div>
                <div class="no-data-desc">Navigasi aplikasi untuk melihat user journey</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentJourney.map(step => `
        <div class="journey-step">
            <div class="step-number">${step.sequence}</div>
            <div class="step-content">
                <div class="step-page">${this.formatPageName(step.page)}</div>
                <div class="step-time">${new Date(step.timestamp).toLocaleString('id-ID')}</div>
            </div>
        </div>
    `).join('');
}

loadRecentErrors() {
    const recentErrors = window.analyticsManager.analyticsData.errors.slice(-5).reverse();
    const container = document.getElementById('recent-errors');
    
    if (!container) return;
    
    if (recentErrors.length === 0) {
        container.innerHTML = `
            <div class="no-data">
                <div class="no-data-icon">✅</div>
                <div class="no-data-title">Tidak ada error</div>
                <div class="no-data-desc">Aplikasi berjalan dengan baik!</div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = recentErrors.map(error => `
        <div class="error-item">
            <div class="error-type">${error.type}</div>
            <div class="error-message">${error.message}</div>
            <div class="error-meta">
                <span>${new Date(error.timestamp).toLocaleString('id-ID')}</span>
                ${error.filename ? `<span>File: ${error.filename}</span>` : ''}
                ${error.lineNumber ? `<span>Line: ${error.lineNumber}</span>` : ''}
            </div>
        </div>
    `).join('');
}

formatFeatureName(featureName) {
    const names = {
        'finance_add_transaction': 'Tambah Transaksi',
        'finance_save_data': 'Simpan Data Keuangan',
        'mood_track': 'Track Mood',
        'game_start': 'Mulai Game',
        'game_score_save': 'Simpan Score Game',
        'chatbot_message': 'Pesan Chatbot'
    };
    
    return names[featureName] || featureName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

formatPageName(pageName) {
    const names = {
        'dashboard': 'Dashboard Utama',
        'finance': 'Laporan Keuangan',
        'mood': 'Mood Tracker',
        'games': 'Games & Hiburan',
        'chatbot': 'AI Assistant',
        'analytics': 'Analytics Dashboard',
        'settings': 'Pengaturan'
    };
    
    return names[pageName] || pageName.charAt(0).toUpperCase() + pageName.slice(1);
}
