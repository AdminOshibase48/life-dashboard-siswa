// Settings and Preferences Manager
class SettingsManager {
    constructor() {
        this.settings = JSON.parse(localStorage.getItem('app_settings')) || this.getDefaultSettings();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applySettings();
        this.renderSettingsForm();
    }

    getDefaultSettings() {
        return {
            theme: 'light',
            language: 'id',
            notifications: {
                enabled: true,
                sound: true,
                vibration: true,
                reminders: true
            },
            privacy: {
                analytics: true,
                saveHistory: true,
                autoBackup: false
            },
            appearance: {
                fontSize: 'medium',
                reduceMotion: false,
                highContrast: false
            },
            data: {
                autoSave: true,
                backupFrequency: 'weekly',
                exportFormat: 'json'
            },
            study: {
                pomodoroDuration: 25,
                breakDuration: 5,
                studyReminders: true
            }
        };
    }

    setupEventListeners() {
        // Settings form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'settings-form') {
                e.preventDefault();
                this.saveSettings();
            }
        });

        // Real-time setting changes
        document.addEventListener('change', (e) => {
            if (e.target.name && e.target.name.startsWith('setting_')) {
                this.handleSettingChange(e.target.name, e.target.value, e.target.checked);
            }
        });

        // Backup actions
        document.addEventListener('click', (e) => {
            if (e.target.id === 'backup-now') {
                this.createBackup();
            }
            if (e.target.id === 'restore-backup') {
                this.showRestoreModal();
            }
            if (e.target.id === 'reset-settings') {
                this.resetSettings();
            }
        });
    }

    handleSettingChange(settingName, value, checked) {
        const settingPath = settingName.replace('setting_', '').split('_');
        this.updateNestedSetting(this.settings, settingPath, checked !== undefined ? checked : value);
        this.applySettings();
        this.saveSettingsToStorage();
    }

    updateNestedSetting(obj, path, value) {
        const key = path[0];
        if (path.length === 1) {
            obj[key] = value;
        } else {
            if (!obj[key] || typeof obj[key] !== 'object') {
                obj[key] = {};
            }
            this.updateNestedSetting(obj[key], path.slice(1), value);
        }
    }

    applySettings() {
        this.applyTheme();
        this.applyAccessibility();
        this.applyNotificationSettings();
    }

    applyTheme() {
        const root = document.documentElement;
        
        // Remove existing theme classes
        root.classList.remove('theme-light', 'theme-dark', 'theme-blue', 'theme-green');
        
        // Add current theme class
        root.classList.add(`theme-${this.settings.theme}`);
        
        // Update CSS variables based on theme
        this.updateThemeVariables();
    }

    updateThemeVariables() {
        const root = document.documentElement;
        const themes = {
            light: {
                '--background': '#f8fafc',
                '--surface': '#ffffff',
                '--text-primary': '#1e293b',
                '--text-secondary': '#64748b',
                '--border': '#e2e8f0'
            },
            dark: {
                '--background': '#0f172a',
                '--surface': '#1e293b',
                '--text-primary': '#f1f5f9',
                '--text-secondary': '#94a3b8',
                '--border': '#334155'
            },
            blue: {
                '--background': '#eff6ff',
                '--surface': '#ffffff',
                '--text-primary': '#1e3a8a',
                '--text-secondary': '#3b82f6',
                '--border': '#dbeafe'
            },
            green: {
                '--background': '#f0fdf4',
                '--surface': '#ffffff',
                '--text-primary': '#166534',
                '--text-secondary': '#22c55e',
                '--border': '#dcfce7'
            }
        };

        const currentTheme = themes[this.settings.theme] || themes.light;
        Object.entries(currentTheme).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });
    }

    applyAccessibility() {
        const root = document.documentElement;
        
        // Font size
        const fontSizes = {
            small: '14px',
            medium: '16px',
            large: '18px',
            xlarge: '20px'
        };
        root.style.setProperty('--base-font-size', fontSizes[this.settings.appearance.fontSize]);
        
        // Reduce motion
        if (this.settings.appearance.reduceMotion) {
            root.style.setProperty('--animation-duration', '0.1s');
        } else {
            root.style.setProperty('--animation-duration', '0.3s');
        }
        
        // High contrast
        if (this.settings.appearance.highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }
    }

    applyNotificationSettings() {
        // In a real app, this would configure push notifications
        console.log('Notification settings applied:', this.settings.notifications);
    }

    renderSettingsForm() {
        const form = document.getElementById('settings-form');
        if (!form) return;

        form.innerHTML = this.getSettingsFormHTML();
    }

    getSettingsFormHTML() {
        return `
            <div class="settings-sections">
                <!-- Tampilan -->
                <div class="settings-section">
                    <h3>🎨 Tampilan</h3>
                    <div class="setting-group">
                        <label class="setting-label">Tema</label>
                        <select name="setting_theme" class="setting-input">
                            <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Terang</option>
                            <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Gelap</option>
                            <option value="blue" ${this.settings.theme === 'blue' ? 'selected' : ''}>Biru</option>
                            <option value="green" ${this.settings.theme === 'green' ? 'selected' : ''}>Hijau</option>
                        </select>
                    </div>
                    
                    <div class="setting-group">
                        <label class="setting-label">Ukuran Font</label>
                        <select name="setting_appearance_fontSize" class="setting-input">
                            <option value="small" ${this.settings.appearance.fontSize === 'small' ? 'selected' : ''}>Kecil</option>
                            <option value="medium" ${this.settings.appearance.fontSize === 'medium' ? 'selected' : ''}>Sedang</option>
                            <option value="large" ${this.settings.appearance.fontSize === 'large' ? 'selected' : ''}>Besar</option>
                            <option value="xlarge" ${this.settings.appearance.fontSize === 'xlarge' ? 'selected' : ''}>Sangat Besar</option>
                        </select>
                    </div>
                    
                    <div class="setting-options">
                        <label class="setting-option">
                            <input type="checkbox" name="setting_appearance_reduceMotion" ${this.settings.appearance.reduceMotion ? 'checked' : ''}>
                            <span class="setting-option-text">Kurangi Animasi</span>
                        </label>
                        <label class="setting-option">
                            <input type="checkbox" name="setting_appearance_highContrast" ${this.settings.appearance.highContrast ? 'checked' : ''}>
                            <span class="setting-option-text">Kontras Tinggi</span>
                        </label>
                    </div>
                </div>

                <!-- Notifikasi -->
                <div class="settings-section">
                    <h3>🔔 Notifikasi</h3>
                    <div class="setting-options">
                        <label class="setting-option">
                            <input type="checkbox" name="setting_notifications_enabled" ${this.settings.notifications.enabled ? 'checked' : ''}>
                            <span class="setting-option-text">Aktifkan Notifikasi</span>
                        </label>
                        <label class="setting-option">
                            <input type="checkbox" name="setting_notifications_sound" ${this.settings.notifications.sound ? 'checked' : ''}>
                            <span class="setting-option-text">Suara Notifikasi</span>
                        </label>
                        <label class="setting-option">
                            <input type="checkbox" name="setting_notifications_vibration" ${this.settings.notifications.vibration ? 'checked' : ''}>
                            <span class="setting-option-text">Getar</span>
                        </label>
                        <label class="setting-option">
                            <input type="checkbox" name="setting_notifications_reminders" ${this.settings.notifications.reminders ? 'checked' : ''}>
                            <span class="setting-option-text">Pengingat Belajar</span>
                        </label>
                    </div>
                </div>

                <!-- Privasi & Data -->
                <div class="settings-section">
                    <h3>🔒 Privasi & Data</h3>
                    <div class="setting-options">
                        <label class="setting-option">
                            <input type="checkbox" name="setting_privacy_analytics" ${this.settings.privacy.analytics ? 'checked' : ''}>
                            <span class="setting-option-text">Analytics Usage</span>
                        </label>
                        <label class="setting-option">
                            <input type="checkbox" name="setting_privacy_saveHistory" ${this.settings.privacy.saveHistory ? 'checked' : ''}>
                            <span class="setting-option-text">Simpan Riwayat Chat</span>
                        </label>
                        <label class="setting-option">
                            <input type="checkbox" name="setting_privacy_autoBackup" ${this.settings.privacy.autoBackup ? 'checked' : ''}>
                            <span class="setting-option-text">Backup Otomatis</span>
                        </label>
                    </div>
                    
                    <div class="setting-group">
                        <label class="setting-label">Frekuensi Backup</label>
                        <select name="setting_data_backupFrequency" class="setting-input">
                            <option value="daily" ${this.settings.data.backupFrequency === 'daily' ? 'selected' : ''}>Harian</option>
                            <option value="weekly" ${this.settings.data.backupFrequency === 'weekly' ? 'selected' : ''}>Mingguan</option>
                            <option value="monthly" ${this.settings.data.backupFrequency === 'monthly' ? 'selected' : ''}>Bulanan</option>
                        </select>
                    </div>
                </div>

                <!-- Study Preferences -->
                <div class="settings-section">
                    <h3>📚 Preferensi Belajar</h3>
                    <div class="setting-group">
                        <label class="setting-label">Durasi Pomodoro (menit)</label>
                        <input type="number" name="setting_study_pomodoroDuration" 
                               value="${this.settings.study.pomodoroDuration}" 
                               min="5" max="60" class="setting-input">
                    </div>
                    
                    <div class="setting-group">
                        <label class="setting-label">Durasi Istirahat (menit)</label>
                        <input type="number" name="setting_study_breakDuration" 
                               value="${this.settings.study.breakDuration}" 
                               min="1" max="30" class="setting-input">
                    </div>
                    
                    <div class="setting-options">
                        <label class="setting-option">
                            <input type="checkbox" name="setting_study_studyReminders" ${this.settings.study.studyReminders ? 'checked' : ''}>
                            <span class="setting-option-text">Pengingat Jadwal Belajar</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="settings-actions">
                <button type="submit" class="btn btn-primary">Simpan Pengaturan</button>
                <button type="button" class="btn btn-outline" id="reset-settings">Reset ke Default</button>
            </div>
        `;
    }

    saveSettings() {
        this.saveSettingsToStorage();
        this.showNotification('Pengaturan berhasil disimpan!', 'success');
        
        // Track setting change
        if (window.analyticsManager) {
            window.analyticsManager.trackEvent('settings', 'save');
        }
    }

    saveSettingsToStorage() {
        localStorage.setItem('app_settings', JSON.stringify(this.settings));
    }

    resetSettings() {
        if (confirm('Apakah Anda yakin ingin mengembalikan semua pengaturan ke default?')) {
            this.settings = this.getDefaultSettings();
            this.saveSettingsToStorage();
            this.applySettings();
            this.renderSettingsForm();
            this.showNotification('Pengaturan berhasil direset!', 'success');
        }
    }

    async createBackup() {
        try {
            const backupData = {
                settings: this.settings,
                finance: {
                    transactions: JSON.parse(localStorage.getItem('finance_transactions') || '[]'),
                    budgets: JSON.parse(localStorage.getItem('finance_budgets') || '[]')
                },
                mood: {
                    history: JSON.parse(localStorage.getItem('mood_history') || '[]')
                },
                games: {
                    scores: JSON.parse(localStorage.getItem('game_scores') || '[]')
                },
                chat: {
                    history: JSON.parse(localStorage.getItem('chat_history') || '[]')
                },
                backupDate: new Date().toISOString(),
                version: '1.0.0'
            };

            const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `studentlife-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            URL.revokeObjectURL(url);

            this.showNotification('Backup berhasil dibuat!', 'success');
            
        } catch (error) {
            this.showNotification('Gagal membuat backup: ' + error.message, 'error');
        }
    }

    showRestoreModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Restore Backup</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="file-dropzone" id="restore-dropzone">
                        <div class="file-dropzone-icon">📁</div>
                        <div class="file-dropzone-text">
                            <div>Klik untuk memilih file backup</div>
                            <div class="file-dropzone-hint">atau tarik file ke sini</div>
                        </div>
                        <input type="file" id="restore-file" accept=".json" style="display: none;">
                    </div>
                    <div class="restore-options">
                        <label class="setting-option">
                            <input type="checkbox" id="restore-settings" checked>
                            <span class="setting-option-text">Restore Pengaturan</span>
                        </label>
                        <label class="setting-option">
                            <input type="checkbox" id="restore-data" checked>
                            <span class="setting-option-text">Restore Data Aplikasi</span>
                        </label>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="cancel-restore">Batal</button>
                    <button class="btn btn-primary" id="confirm-restore" disabled>Restore</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupRestoreModal(modal);
    }

    setupRestoreModal(modal) {
        const dropzone = modal.querySelector('#restore-dropzone');
        const fileInput = modal.querySelector('#restore-file');
        const confirmBtn = modal.querySelector('#confirm-restore');
        let selectedFile = null;

        // File selection
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.classList.add('dragover');
        });
        dropzone.addEventListener('dragleave', () => {
            dropzone.classList.remove('dragover');
        });
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelect(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelect(e.target.files[0]);
            }
        });

        function handleFileSelect(file) {
            if (file.type === 'application/json' || file.name.endsWith('.json')) {
                selectedFile = file;
                dropzone.innerHTML = `
                    <div class="file-dropzone-icon">✅</div>
                    <div class="file-dropzone-text">
                        <div>${file.name}</div>
                        <div class="file-dropzone-hint">File siap untuk restore</div>
                    </div>
                `;
                confirmBtn.disabled = false;
            } else {
                this.showNotification('Hanya file JSON yang didukung', 'error');
            }
        }

        // Modal actions
        modal.querySelector('.modal-close').addEventListener('click', () => modal.remove());
        modal.querySelector('#cancel-restore').addEventListener('click', () => modal.remove());
        
        confirmBtn.addEventListener('click', () => {
            if (selectedFile) {
                this.restoreBackup(selectedFile);
                modal.remove();
            }
        });
    }

    async restoreBackup(file) {
        try {
            const text = await this.readFileAsText(file);
            const backupData = JSON.parse(text);
            
            // Validate backup file
            if (!this.validateBackup(backupData)) {
                throw new Error('Format file backup tidak valid');
            }

            // Restore settings
            if (document.getElementById('restore-settings').checked && backupData.settings) {
                this.settings = backupData.settings;
                this.saveSettingsToStorage();
                this.applySettings();
            }

            // Restore application data
            if (document.getElementById('restore-data').checked) {
                this.restoreAppData(backupData);
            }

            this.showNotification('Backup berhasil direstore!', 'success');
            
            // Reload to apply changes
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            this.showNotification('Gagal restore backup: ' + error.message, 'error');
        }
    }

    readFileAsText(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = e => reject(e);
            reader.readAsText(file);
        });
    }

    validateBackup(backupData) {
        return backupData && 
               backupData.version && 
               backupData.backupDate &&
               backupData.settings;
    }

    restoreAppData(backupData) {
        if (backupData.finance) {
            if (backupData.finance.transactions) {
                localStorage.setItem('finance_transactions', JSON.stringify(backupData.finance.transactions));
            }
            if (backupData.finance.budgets) {
                localStorage.setItem('finance_budgets', JSON.stringify(backupData.finance.budgets));
            }
        }
        
        if (backupData.mood && backupData.mood.history) {
            localStorage.setItem('mood_history', JSON.stringify(backupData.mood.history));
        }
        
        if (backupData.games && backupData.games.scores) {
            localStorage.setItem('game_scores', JSON.stringify(backupData.games.scores));
        }
        
        if (backupData.chat && backupData.chat.history) {
            localStorage.setItem('chat_history', JSON.stringify(backupData.chat.history));
        }
    }

    showNotification(message, type = 'info') {
        if (window.financeManager && window.financeManager.showNotification) {
            window.financeManager.showNotification(message, type);
        } else {
            alert(message);
        }
    }

    // Utility method to get specific setting
    getSetting(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.settings);
    }
}

// Initialize settings manager
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});
