// Offline Data Management
class OfflineManager {
    constructor() {
        this.pendingActions = JSON.parse(localStorage.getItem('pending_actions') || '[]');
        this.init();
    }

    init() {
        this.setupOnlineHandler();
        this.setupSyncIndicator();
    }

    setupOnlineHandler() {
        window.addEventListener('online', () => {
            this.handleOnline();
        });

        window.addEventListener('offline', () => {
            this.handleOffline();
        });

        // Initial status
        if (!navigator.onLine) {
            this.handleOffline();
        }
    }

    setupSyncIndicator() {
        // Create sync indicator in UI
        const syncIndicator = document.createElement('div');
        syncIndicator.id = 'sync-indicator';
        syncIndicator.innerHTML = `
            <div class="sync-status offline">
                <span class="sync-icon">🔴</span>
                <span class="sync-text">Offline</span>
            </div>
        `;

        // Add styles
        if (!document.querySelector('#sync-styles')) {
            const styles = document.createElement('style');
            styles.id = 'sync-styles';
            styles.textContent = `
                #sync-indicator {
                    position: fixed;
                    top: 10px;
                    left: 10px;
                    z-index: 1000;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: 20px;
                    padding: 0.5rem 1rem;
                    box-shadow: var(--shadow);
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                
                .sync-status.offline {
                    color: var(--error);
                }
                
                .sync-status.syncing {
                    color: var(--warning);
                }
                
                .sync-status.online {
                    color: var(--success);
                }
                
                .sync-icon {
                    font-size: 0.7rem;
                }
                
                .sync-text {
                    font-weight: 500;
                }
                
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { opacity: 1; }
                }
                
                .sync-status.syncing .sync-icon {
                    animation: pulse 1s infinite;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(syncIndicator);
    }

    handleOnline() {
        const indicator = document.querySelector('#sync-indicator');
        if (indicator) {
            indicator.innerHTML = `
                <div class="sync-status syncing">
                    <span class="sync-icon">🟡</span>
                    <span class="sync-text">Menyinkronkan...</span>
                </div>
            `;
        }

        // Process pending actions
        this.processPendingActions().then(() => {
            if (indicator) {
                indicator.innerHTML = `
                    <div class="sync-status online">
                        <span class="sync-icon">🟢</span>
                        <span class="sync-text">Online</span>
                    </div>
                `;
                
                // Hide after 3 seconds
                setTimeout(() => {
                    indicator.style.opacity = '0';
                    setTimeout(() => indicator.remove(), 300);
                }, 3000);
            }
        });
    }

    handleOffline() {
        const indicator = document.querySelector('#sync-indicator');
        if (indicator) {
            indicator.innerHTML = `
                <div class="sync-status offline">
                    <span class="sync-icon">🔴</span>
                    <span class="sync-text">Offline</span>
                </div>
            `;
        }

        this.showOfflineNotification();
    }

    async processPendingActions() {
        if (this.pendingActions.length === 0) return;

        const totalActions = this.pendingActions.length;
        let processed = 0;

        for (const action of this.pendingActions) {
            try {
                await this.executePendingAction(action);
                processed++;
                
                // Update progress if needed
                this.updateSyncProgress(processed, totalActions);
            } catch (error) {
                console.error('Failed to process action:', action, error);
            }
        }

        // Clear processed actions
        this.pendingActions = this.pendingActions.filter(action => 
            !this.pendingActions.includes(action)
        );
        this.savePendingActions();

        this.showNotification(`Berhasil menyinkronkan ${processed} aksi`, 'success');
    }

    async executePendingAction(action) {
        // Simulate API call based on action type
        switch (action.type) {
            case 'finance_transaction':
                // In real app, this would be an API call
                await new Promise(resolve => setTimeout(resolve, 500));
                console.log('Synced finance transaction:', action.data);
                break;
                
            case 'mood_entry':
                await new Promise(resolve => setTimeout(resolve, 300));
                console.log('Synced mood entry:', action.data);
                break;
                
            case 'game_score':
                await new Promise(resolve => setTimeout(resolve, 200));
                console.log('Synced game score:', action.data);
                break;
                
            default:
                console.log('Unknown action type:', action.type);
        }
    }

    updateSyncProgress(processed, total) {
        // Update UI with sync progress if needed
        const indicator = document.querySelector('#sync-indicator');
        if (indicator && total > 1) {
            indicator.querySelector('.sync-text').textContent = 
                `Menyinkronkan... (${processed}/${total})`;
        }
    }

    addPendingAction(type, data) {
        const action = {
            id: this.generateId(),
            type: type,
            data: data,
            timestamp: new Date().toISOString(),
            attempts: 0
        };

        this.pendingActions.push(action);
        this.savePendingActions();

        // Show offline notification if applicable
        if (!navigator.onLine) {
            this.showOfflineActionNotification();
        }

        return action.id;
    }

    savePendingActions() {
        localStorage.setItem('pending_actions', JSON.stringify(this.pendingActions));
    }

    showOfflineNotification() {
        this.showNotification(
            'Anda sedang offline. Perubahan akan disinkronkan ketika online.',
            'warning',
            5000
        );
    }

    showOfflineActionNotification() {
        this.showNotification(
            'Tindakan disimpan secara offline dan akan disinkronkan nanti.',
            'info',
            3000
        );
    }

    showNotification(message, type = 'info', duration = 3000) {
        if (window.financeManager && window.financeManager.showNotification) {
            window.financeManager.showNotification(message, type);
        } else {
            // Fallback notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'error' ? '#ef4444' : type === 'warning' ? '#fbbf24' : type === 'success' ? '#4ade80' : '#4361ee'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
                z-index: 10000;
                max-width: 400px;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transition = 'opacity 0.3s';
                setTimeout(() => notification.remove(), 300);
            }, duration);
        }
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Data export for backup
    exportAllData() {
        const data = {
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
            settings: {
                user: JSON.parse(localStorage.getItem('user_data') || '{}'),
                preferences: JSON.parse(localStorage.getItem('user_preferences') || '{}')
            },
            exportDate: new Date().toISOString(),
            version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `studentlife-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        this.showNotification('Backup data berhasil diekspor', 'success');
    }

    // Data import from backup
    async importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Validate data structure
                    if (!this.validateImportData(data)) {
                        throw new Error('Format file backup tidak valid');
                    }
                    
                    // Import data to respective storage
                    this.processImportData(data);
                    
                    this.showNotification('Data berhasil diimpor!', 'success');
                    resolve();
                    
                } catch (error) {
                    this.showNotification('Gagal mengimpor data: ' + error.message, 'error');
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                this.showNotification('Gagal membaca file', 'error');
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file);
        });
    }

    validateImportData(data) {
        return data && 
               data.version && 
               data.finance && 
               data.mood && 
               data.games;
    }

    processImportData(data) {
        // Import finance data
        if (data.finance.transactions) {
            localStorage.setItem('finance_transactions', JSON.stringify(data.finance.transactions));
        }
        if (data.finance.budgets) {
            localStorage.setItem('finance_budgets', JSON.stringify(data.finance.budgets));
        }
        
        // Import mood data
        if (data.mood.history) {
            localStorage.setItem('mood_history', JSON.stringify(data.mood.history));
        }
        
        // Import game data
        if (data.games.scores) {
            localStorage.setItem('game_scores', JSON.stringify(data.games.scores));
        }
        
        // Import chat data
        if (data.chat.history) {
            localStorage.setItem('chat_history', JSON.stringify(data.chat.history));
        }
        
        // Import settings
        if (data.settings.user) {
            localStorage.setItem('user_data', JSON.stringify(data.settings.user));
        }
        if (data.settings.preferences) {
            localStorage.setItem('user_preferences', JSON.stringify(data.settings.preferences));
        }
        
        // Reload the app to reflect imported data
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// Initialize offline manager
document.addEventListener('DOMContentLoaded', () => {
    window.offlineManager = new OfflineManager();
});
