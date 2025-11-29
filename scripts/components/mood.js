// Mood Tracker Component
class MoodTracker {
    constructor() {
        this.moodHistory = JSON.parse(localStorage.getItem('mood_history')) || [];
        this.recommendations = {
            happy: [
                { 
                    icon: '🎵', 
                    title: 'Musik Upbeat', 
                    desc: 'Dengarkan playlist musik yang menyenangkan untuk menjaga semangat',
                    action: () => this.playMusic('upbeat')
                },
                { 
                    icon: '📝', 
                    title: 'Journaling', 
                    desc: 'Tuliskan momen bahagia hari ini untuk dikenang',
                    action: () => this.startJournaling()
                },
                { 
                    icon: '🎯', 
                    title: 'Set Goals', 
                    desc: 'Manfaatkan energi positif untuk mencapai target belajar',
                    action: () => this.setGoals()
                },
                { 
                    icon: '📞', 
                    title: 'Berbagi Kebahagiaan', 
                    desc: 'Bagikan mood baik Anda dengan teman atau keluarga',
                    action: () => this.shareMood()
                }
            ],
            sad: [
                { 
                    icon: '🎵', 
                    title: 'Musik Relaks', 
                    desc: 'Dengarkan musik yang menenangkan hati dan pikiran',
                    action: () => this.playMusic('relaxing')
                },
                { 
                    icon: '📞', 
                    title: 'Hubungi Teman', 
                    desc: 'Berbicara dengan seseorang yang Anda percayai',
                    action: () => this.callFriend()
                },
                { 
                    icon: '🎬', 
                    title: 'Film Inspiratif', 
                    desc: 'Tonton film yang membangkitkan semangat dan motivasi',
                    action: () => this.watchMovie()
                },
                { 
                    icon: '🧘', 
                    title: 'Meditasi Singkat', 
                    desc: 'Lakukan meditasi 5 menit untuk menenangkan pikiran',
                    action: () => this.startMeditation()
                }
            ],
            tired: [
                { 
                    icon: '💤', 
                    title: 'Istirahat Sejenak', 
                    desc: 'Ambil waktu 15-20 menit untuk tidur sebentar',
                    action: () => this.takeNap()
                },
                { 
                    icon: '🧘', 
                    title: 'Peregangan', 
                    desc: 'Lakukan peregangan ringan untuk melancarkan peredaran darah',
                    action: () => this.doStretching()
                },
                { 
                    icon: '🍵', 
                    title: 'Teh Hangat', 
                    desc: 'Minum teh herbal yang menenangkan seperti chamomile',
                    action: () => this.drinkTea()
                },
                { 
                    icon: '🎵', 
                    title: 'Musik Tenang', 
                    desc: 'Dengarkan musik instrumental yang menenangkan',
                    action: () => this.playMusic('calm')
                }
            ],
            bored: [
                { 
                    icon: '🎮', 
                    title: 'Main Game', 
                    desc: 'Coba game seru di platform ini untuk menghilangkan kebosanan',
                    action: () => this.playGames()
                },
                { 
                    icon: '📚', 
                    title: 'Baca Buku', 
                    desc: 'Baca buku atau artikel menarik yang belum sempat dibaca',
                    action: () => this.readBook()
                },
                { 
                    icon: '🎨', 
                    title: 'Aktivitas Kreatif', 
                    desc: 'Coba kegiatan seni atau kerajinan tangan',
                    action: () => this.doCreativeActivity()
                },
                { 
                    icon: '🚶', 
                    title: 'Jalan-Jalan', 
                    desc: 'Keluar sebentar untuk menghirup udara segar',
                    action: () => this.takeWalk()
                }
            ],
            excited: [
                { 
                    icon: '🎯', 
                    title: 'Channel Energy', 
                    desc: 'Fokuskan energi pada proyek atau belajar yang menantang',
                    action: () => this.channelEnergy()
                },
                { 
                    icon: '🏃', 
                    title: 'Olahraga', 
                    desc: 'Lakukan aktivitas fisik untuk melepaskan energi berlebih',
                    action: () => this.doExercise()
                },
                { 
                    icon: '📣', 
                    title: 'Berbagi Semangat', 
                    desc: 'Bagikan semangat dan energi positif dengan teman',
                    action: () => this.shareExcitement()
                },
                { 
                    icon: '🎉', 
                    title: 'Rayakan Pencapaian', 
                    desc: 'Akui dan rayakan hal-hal baik yang terjadi',
                    action: () => this.celebrate()
                }
            ]
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderCurrentMood();
        this.renderMoodHistory();
        this.renderMoodStats();
    }

    setupEventListeners() {
        // Mood selection
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mood-option')) {
                const moodOption = e.target.closest('.mood-option');
                const mood = moodOption.dataset.mood;
                this.selectMood(mood);
            }

            // Recommendation actions
            if (e.target.closest('.recommendation-action')) {
                const actionBtn = e.target.closest('.recommendation-action');
                const action = actionBtn.dataset.action;
                this.executeAction(action);
            }
        });

        // Intensity slider
        const intensitySlider = document.querySelector('.intensity-slider');
        if (intensitySlider) {
            intensitySlider.addEventListener('input', (e) => {
                this.updateIntensity(e.target.value);
            });
        }

        // Save mood with notes
        const saveBtn = document.querySelector('#save-mood');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveCurrentMood();
            });
        }
    }

    selectMood(mood) {
        // Update UI
        document.querySelectorAll('.mood-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.querySelector(`[data-mood="${mood}"]`).classList.add('selected');

        // Show intensity slider
        this.showIntensitySlider();

        // Show recommendations
        this.showRecommendations(mood);

        // Update current mood display
        this.updateCurrentMoodDisplay(mood);
    }

    showIntensitySlider() {
        const intensitySection = document.querySelector('.mood-intensity');
        if (intensitySection) {
            intensitySection.classList.remove('hidden');
        }
    }

    updateIntensity(value) {
        const intensityLabels = document.querySelectorAll('.intensity-labels span');
        intensityLabels.forEach((label, index) => {
            if (index === parseInt(value) - 1) {
                label.style.fontWeight = '600';
                label.style.color = 'var(--primary)';
            } else {
                label.style.fontWeight = '400';
                label.style.color = 'var(--text-light)';
            }
        });
    }

    showRecommendations(mood) {
        const recommendations = this.recommendations[mood] || [];
        const container = document.querySelector('.mood-recommendations');
        const list = document.querySelector('.recommendation-list');

        if (!container || !list) return;

        list.innerHTML = recommendations.map((rec, index) => `
            <div class="recommendation-item">
                <div class="recommendation-icon">${rec.icon}</div>
                <div class="recommendation-content">
                    <div class="recommendation-title">${rec.title}</div>
                    <div class="recommendation-desc">${rec.desc}</div>
                    <button class="btn btn-outline btn-sm recommendation-action" 
                            data-action="action-${index}">
                        Coba Sekarang
                    </button>
                </div>
            </div>
        `).join('');

        container.classList.remove('hidden');

        // Store current recommendations for action handling
        this.currentRecommendations = recommendations;
    }

    updateCurrentMoodDisplay(mood) {
        const currentMoodSection = document.querySelector('.current-mood');
        if (!currentMoodSection) return;

        const moodData = this.getMoodData(mood);
        
        currentMoodSection.innerHTML = `
            <div class="current-mood-emoji">${moodData.emoji}</div>
            <div class="current-mood-text">${moodData.text}</div>
            <div class="current-mood-desc">${moodData.description}</div>
        `;

        // Add color variation based on mood
        currentMoodSection.className = `current-mood mood-${mood}`;
    }

    saveCurrentMood() {
        const selectedMood = document.querySelector('.mood-option.selected');
        const intensity = document.querySelector('.intensity-slider')?.value || 3;
        const notes = document.querySelector('.notes-textarea')?.value || '';

        if (!selectedMood) {
            this.showNotification('Pilih mood terlebih dahulu!', 'warning');
            return;
        }

        const moodEntry = {
            id: this.generateId(),
            mood: selectedMood.dataset.mood,
            intensity: parseInt(intensity),
            notes: notes,
            timestamp: new Date().toISOString(),
            date: new Date().toLocaleDateString('id-ID')
        };

        this.moodHistory.unshift(moodEntry);
        this.saveData();
        
        this.renderMoodHistory();
        this.renderMoodStats();
        
        this.showNotification('Mood berhasil disimpan!', 'success');
        
        // Reset form
        this.resetMoodForm();
    }

    resetMoodForm() {
        document.querySelectorAll('.mood-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        const intensitySection = document.querySelector('.mood-intensity');
        if (intensitySection) {
            intensitySection.classList.add('hidden');
        }
        
        const recommendationsSection = document.querySelector('.mood-recommendations');
        if (recommendationsSection) {
            recommendationsSection.classList.add('hidden');
        }
        
        const notesTextarea = document.querySelector('.notes-textarea');
        if (notesTextarea) {
            notesTextarea.value = '';
        }
        
        // Reset current mood display
        this.renderCurrentMood();
    }

    renderCurrentMood() {
        const currentMoodSection = document.querySelector('.current-mood');
        if (!currentMoodSection) return;

        const today = new Date().toLocaleDateString('id-ID');
        const todayMood = this.moodHistory.find(entry => entry.date === today);

        if (todayMood) {
            const moodData = this.getMoodData(todayMood.mood);
            currentMoodSection.innerHTML = `
                <div class="current-mood-emoji">${moodData.emoji}</div>
                <div class="current-mood-text">${moodData.text}</div>
                <div class="current-mood-desc">Intensitas: ${todayMood.intensity}/5</div>
                ${todayMood.notes ? `<div class="current-mood-notes">"${todayMood.notes}"</div>` : ''}
            `;
            currentMoodSection.className = `current-mood mood-${todayMood.mood}`;
        } else {
            currentMoodSection.innerHTML = `
                <div class="current-mood-emoji">😊</div>
                <div class="current-mood-text">Bagaimana perasaan Anda hari ini?</div>
                <div class="current-mood-desc">Pilih mood untuk memulai</div>
            `;
            currentMoodSection.className = 'current-mood';
        }
    }

    renderMoodHistory() {
        const historyContainer = document.querySelector('.history-list');
        if (!historyContainer) return;

        if (this.moodHistory.length === 0) {
            historyContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📊</div>
                    <div class="empty-title">Belum ada riwayat mood</div>
                    <div class="empty-desc">Mood yang Anda simpan akan muncul di sini</div>
                </div>
            `;
            return;
        }

        historyContainer.innerHTML = this.moodHistory.slice(0, 10).map(entry => {
            const moodData = this.getMoodData(entry.mood);
            return `
                <div class="history-item mood-${entry.mood}">
                    <div class="history-emoji">${moodData.emoji}</div>
                    <div class="history-content">
                        <div class="history-mood">${moodData.text}</div>
                        <div class="history-intensity">Intensitas: ${entry.intensity}/5</div>
                        ${entry.notes ? `<div class="history-notes">${entry.notes}</div>` : ''}
                    </div>
                    <div class="history-time">
                        <div>${this.formatTime(entry.timestamp)}</div>
                        <div style="font-size: 0.7rem; opacity: 0.7;">${entry.date}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderMoodStats() {
        const statsContainer = document.querySelector('.mood-stats');
        if (!statsContainer) return;

        const last7Days = this.getLast7DaysMoods();
        const moodCounts = this.countMoods(last7Days);
        const mostFrequentMood = this.getMostFrequentMood(moodCounts);

        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="mood-emoji">📅</div>
                <div class="stat-number">${last7Days.length}</div>
                <div class="stat-label">Hari tercatat</div>
            </div>
            <div class="stat-card">
                <div class="mood-emoji">${this.getMoodData(mostFrequentMood).emoji}</div>
                <div class="stat-number">${mostFrequentMood ? this.getMoodData(mostFrequentMood).text : '-'}</div>
                <div class="stat-label">Mood terbanyak</div>
            </div>
            <div class="stat-card">
                <div class="mood-emoji">📈</div>
                <div class="stat-number">${this.calculateAverageIntensity().toFixed(1)}</div>
                <div class="stat-label">Rata-rata intensitas</div>
            </div>
            <div class="stat-card">
                <div class="mood-emoji">💪</div>
                <div class="stat-number">${this.getConsistencyStreak()}</div>
                <div class="stat-label">Hari konsisten</div>
            </div>
        `;
    }

    getMoodData(mood) {
        const moodData = {
            happy: {
                emoji: '😊',
                text: 'Senang',
                description: 'Hari yang menyenangkan!'
            },
            sad: {
                emoji: '😢',
                text: 'Sedih',
                description: 'Semoga hari esok lebih baik'
            },
            tired: {
                emoji: '😴',
                text: 'Lelah',
                description: 'Waktunya istirahat sejenak'
            },
            bored: {
                emoji: '😐',
                text: 'Bosan',
                description: 'Cari aktivitas baru mungkin?'
            },
            excited: {
                emoji: '🎉',
                text: 'Semangat',
                description: 'Energi positif mengalir!'
            }
        };
        
        return moodData[mood] || { emoji: '😊', text: 'Netral', description: 'Hari yang biasa' };
    }

    getLast7DaysMoods() {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        return this.moodHistory.filter(entry => 
            new Date(entry.timestamp) >= oneWeekAgo
        );
    }

    countMoods(moodEntries) {
        const counts = {};
        moodEntries.forEach(entry => {
            counts[entry.mood] = (counts[entry.mood] || 0) + 1;
        });
        return counts;
    }

    getMostFrequentMood(moodCounts) {
        let maxCount = 0;
        let mostFrequent = null;
        
        Object.entries(moodCounts).forEach(([mood, count]) => {
            if (count > maxCount) {
                maxCount = count;
                mostFrequent = mood;
            }
        });
        
        return mostFrequent;
    }

    calculateAverageIntensity() {
        if (this.moodHistory.length === 0) return 0;
        
        const total = this.moodHistory.reduce((sum, entry) => sum + entry.intensity, 0);
        return total / this.moodHistory.length;
    }

    getConsistencyStreak() {
        if (this.moodHistory.length === 0) return 0;
        
        let streak = 0;
        const today = new Date();
        const dates = [...new Set(this.moodHistory.map(entry => entry.date))].sort().reverse();
        
        for (let i = 0; i < dates.length; i++) {
            const expectedDate = new Date(today);
            expectedDate.setDate(today.getDate() - i);
            const expectedDateStr = expectedDate.toLocaleDateString('id-ID');
            
            if (dates.includes(expectedDateStr)) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    // Action methods for recommendations
    playMusic(type) {
        const playlists = {
            upbeat: 'https://open.spotify.com/playlist/37i9dQZF1DX0XUsuxWHRQd',
            relaxing: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6',
            calm: 'https://open.spotify.com/playlist/37i9dQZF1DX4WYpdgoIcn6'
        };
        
        this.showNotification(`Membuka playlist ${type}...`, 'info');
        // In real implementation, open music service
        setTimeout(() => {
            window.open(playlists[type] || playlists.calm, '_blank');
        }, 1000);
    }

    startJournaling() {
        this.showNotification('Membuka jurnal...', 'info');
        // Navigate to journal page or open modal
    }

    setGoals() {
        this.showNotification('Membuka goal setting...', 'info');
        // Navigate to goals page
    }

    shareMood() {
        this.showNotification('Mempersiapkan berbagi mood...', 'info');
        // Implement share functionality
    }

    callFriend() {
        this.showNotification('Membuka kontak teman...', 'info');
        // Implement contact functionality
    }

    watchMovie() {
        const movies = [
            'https://netflix.com',
            'https://youtube.com',
            'https://disneyplus.com'
        ];
        this.showNotification('Mencari film inspiratif...', 'info');
        setTimeout(() => {
            window.open(movies[Math.floor(Math.random() * movies.length)], '_blank');
        }, 1000);
    }

    startMeditation() {
        this.showNotification('Memulai sesi meditasi...', 'info');
        // Open meditation guide or timer
    }

    takeNap() {
        this.showNotification('Mengatur timer istirahat 20 menit...', 'info');
        // Open timer functionality
    }

    doStretching() {
        this.showNotification('Membuka panduan peregangan...', 'info');
        // Open stretching guide
    }

    drinkTea() {
        this.showNotification('Jangan lupa minum air putih juga! ☕', 'info');
    }

    playGames() {
        this.showNotification('Membuka halaman games...', 'info');
        window.app.navigateTo('games');
    }

    readBook() {
        this.showNotification('Mencari rekomendasi buku...', 'info');
        // Open books recommendations
    }

    doCreativeActivity() {
        this.showNotification('Membuka ide aktivitas kreatif...', 'info');
        // Open creative ideas
    }

    takeWalk() {
        this.showNotification('Jalan-jalan sebentar bisa menyegarkan! 🚶', 'info');
    }

    channelEnergy() {
        this.showNotification('Membuka daftar tugas prioritas...', 'info');
        // Open todo list or goals
    }

    doExercise() {
        this.showNotification('Membuka panduan olahraga...', 'info');
        // Open exercise guide
    }

    shareExcitement() {
        this.showNotification('Mempersiapkan berbagi semangat...', 'info');
        // Implement share functionality
    }

    celebrate() {
        this.showNotification('Selamat! Anda pantas merayakannya! 🎉', 'success');
    }

    executeAction(actionIndex) {
        const actionNumber = parseInt(actionIndex.split('-')[1]);
        if (this.currentRecommendations && this.currentRecommendations[actionNumber]) {
            this.currentRecommendations[actionNumber].action();
        }
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveData() {
        localStorage.setItem('mood_history', JSON.stringify(this.moodHistory));
    }

    showNotification(message, type = 'info') {
        // Use the same notification system as finance manager
        if (window.financeManager) {
            window.financeManager.showNotification(message, type);
        } else {
            alert(message); // Fallback
        }
    }
}

// Initialize mood tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.mood-tracker')) {
        window.moodTracker = new MoodTracker();
    }
});
