// PWA Service Worker dan Install Prompt
class PWAHelper {
    constructor() {
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
        this.setupAppManifest();
        this.checkStandaloneMode();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', async () => {
                try {
                    const registration = await navigator.serviceWorker.register('/sw.js');
                    console.log('ServiceWorker registered: ', registration);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('ServiceWorker update found!');
                        
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                this.showUpdateNotification();
                            }
                        });
                    });
                } catch (error) {
                    console.log('ServiceWorker registration failed: ', error);
                }
            });
        }
    }

    setupInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            this.deferredPrompt = null;
            this.showNotification('Aplikasi berhasil diinstall! 🎉', 'success');
            this.trackEvent('app_installed');
        });
    }

    setupAppManifest() {
        // Dynamic manifest based on current theme
        const manifest = {
            "name": "Life Dashboard Siswa",
            "short_name": "StudentLife",
            "description": "Pusat aktivitas pribadi untuk siswa",
            "start_url": "/",
            "display": "standalone",
            "background_color": "#f8fafc",
            "theme_color": "#4361ee",
            "orientation": "portrait-primary",
            "icons": [
                {
                    "src": "/assets/icons/icon-72x72.png",
                    "sizes": "72x72",
                    "type": "image/png"
                },
                {
                    "src": "/assets/icons/icon-96x96.png",
                    "sizes": "96x96",
                    "type": "image/png"
                },
                {
                    "src": "/assets/icons/icon-128x128.png",
                    "sizes": "128x128",
                    "type": "image/png"
                },
                {
                    "src": "/assets/icons/icon-144x144.png",
                    "sizes": "144x144",
                    "type": "image/png"
                },
                {
                    "src": "/assets/icons/icon-152x152.png",
                    "sizes": "152x152",
                    "type": "image/png"
                },
                {
                    "src": "/assets/icons/icon-192x192.png",
                    "sizes": "192x192",
                    "type": "image/png"
                },
                {
                    "src": "/assets/icons/icon-384x384.png",
                    "sizes": "384x384",
                    "type": "image/png"
                },
                {
                    "src": "/assets/icons/icon-512x512.png",
                    "sizes": "512x512",
                    "type": "image/png"
                }
            ],
            "categories": ["education", "productivity", "utilities"],
            "lang": "id-ID"
        };

        // Set manifest dynamically
        const manifestElement = document.createElement('link');
        manifestElement.rel = 'manifest';
        manifestElement.href = 'data:application/manifest+json,' + encodeURIComponent(JSON.stringify(manifest));
        document.head.appendChild(manifestElement);
    }

    showInstallPrompt() {
        // Create install prompt UI
        const installPrompt = document.createElement('div');
        installPrompt.className = 'install-prompt';
        installPrompt.innerHTML = `
            <div class="install-prompt-content">
                <div class="install-icon">📱</div>
                <div class="install-text">
                    <div class="install-title">Install StudentLife</div>
                    <div class="install-desc">Akses lebih cepat dari homescreen!</div>
                </div>
                <div class="install-actions">
                    <button class="btn btn-outline btn-sm" id="install-later">Nanti</button>
                    <button class="btn btn-primary btn-sm" id="install-now">Install</button>
                </div>
            </div>
        `;

        // Add styles
        if (!document.querySelector('#install-prompt-styles')) {
            const styles = document.createElement('style');
            styles.id = 'install-prompt-styles';
            styles.textContent = `
                .install-prompt {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--surface);
                    border: 2px solid var(--primary);
                    border-radius: var(--radius);
                    padding: 1rem;
                    box-shadow: var(--shadow-lg);
                    z-index: 10000;
                    max-width: 400px;
                    width: 90%;
                    animation: slideUp 0.3s ease;
                }
                
                .install-prompt-content {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .install-icon {
                    font-size: 2rem;
                    flex-shrink: 0;
                }
                
                .install-text {
                    flex: 1;
                }
                
                .install-title {
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 0.25rem;
                }
                
                .install-desc {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                }
                
                .install-actions {
                    display: flex;
                    gap: 0.5rem;
                    flex-shrink: 0;
                }
                
                @keyframes slideUp {
                    from {
                        transform: translateX(-50%) translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                }
                
                @keyframes slideDown {
                    from {
                        transform: translateX(-50%) translateY(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(-50%) translateY(100%);
                        opacity: 0;
                    }
                }
                
                .install-prompt.hiding {
                    animation: slideDown 0.3s ease;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(installPrompt);

        // Event listeners
        document.getElementById('install-now').addEventListener('click', () => {
            this.installApp();
            this.hideInstallPrompt(installPrompt);
        });

        document.getElementById('install-later').addEventListener('click', () => {
            this.hideInstallPrompt(installPrompt);
            // Show again after 1 week
            setTimeout(() => this.showInstallPrompt(), 7 * 24 * 60 * 60 * 1000);
        });

        // Auto hide after 10 seconds
        setTimeout(() => {
            if (installPrompt.parentNode) {
                this.hideInstallPrompt(installPrompt);
            }
        }, 10000);
    }

    hideInstallPrompt(prompt) {
        prompt.classList.add('hiding');
        setTimeout(() => {
            if (prompt.parentNode) {
                prompt.parentNode.removeChild(prompt);
            }
        }, 300);
    }

    async installApp() {
        if (!this.deferredPrompt) return;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        this.deferredPrompt = null;
    }

    showUpdateNotification() {
        const updateNotification = document.createElement('div');
        updateNotification.className = 'notification notification-info';
        updateNotification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">🔄</span>
                <span class="notification-message">Update tersedia! Tutup dan buka kembali aplikasi.</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        document.body.appendChild(updateNotification);
        
        setTimeout(() => {
            if (updateNotification.parentNode) {
                updateNotification.remove();
            }
        }, 5000);
    }

    checkStandaloneMode() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            document.body.classList.add('standalone-mode');
            this.trackEvent('app_standalone');
        }
    }

    trackEvent(eventName, data = {}) {
        // Simple analytics tracking
        const events = JSON.parse(localStorage.getItem('app_events') || '[]');
        events.push({
            event: eventName,
            timestamp: new Date().toISOString(),
            ...data
        });
        localStorage.setItem('app_events', JSON.stringify(events.slice(-100))); // Keep last 100 events
    }

    // Offline functionality
    setupOfflineSupport() {
        // Check online status
        window.addEventListener('online', () => {
            this.showNotification('Koneksi internet tersedia', 'success');
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            this.showNotification('Anda sedang offline', 'warning');
        });

        // Initial check
        if (!navigator.onLine) {
            this.showNotification('Mode offline aktif', 'info');
        }
    }

    async syncOfflineData() {
        // Sync any pending offline data
        const pendingActions = JSON.parse(localStorage.getItem('pending_actions') || '[]');
        
        if (pendingActions.length > 0) {
            this.showNotification(`Menyinkronkan ${pendingActions.length} aksi...`, 'info');
            
            // Process pending actions
            for (const action of pendingActions) {
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 500));
                    console.log('Synced action:', action);
                } catch (error) {
                    console.error('Failed to sync action:', error);
                }
            }
            
            // Clear pending actions
            localStorage.removeItem('pending_actions');
            this.showNotification('Sinkronisasi selesai!', 'success');
        }
    }

    showNotification(message, type = 'info') {
        // Use existing notification system
        if (window.financeManager) {
            window.financeManager.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize PWA features
document.addEventListener('DOMContentLoaded', () => {
    window.pwaHelper = new PWAHelper();
});
