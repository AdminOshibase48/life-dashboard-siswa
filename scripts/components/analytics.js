// Analytics and User Behavior Tracking
class AnalyticsManager {
    constructor() {
        this.analyticsData = JSON.parse(localStorage.getItem('analytics_data')) || this.initializeAnalytics();
        this.sessionStart = new Date();
        this.init();
    }

    init() {
        this.setupEventTracking();
        this.trackSessionStart();
        this.setupPerformanceMonitoring();
        this.setupErrorTracking();
    }

    initializeAnalytics() {
        return {
            sessions: [],
            pageViews: [],
            events: [],
            errors: [],
            performance: [],
            userJourney: [],
            featureUsage: {},
            lastUpdated: new Date().toISOString()
        };
    }

    setupEventTracking() {
        // Track page views
        this.trackPageView('splash');
        
        // Track navigation
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-page]')) {
                const page = e.target.closest('[data-page]').dataset.page;
                this.trackPageView(page);
            }
            
            if (e.target.closest('[data-track]')) {
                const trackData = e.target.closest('[data-track]').dataset.track;
                this.trackEvent('click', trackData);
            }
        });

        // Track form interactions
        document.addEventListener('submit', (e) => {
            const formId = e.target.id || 'unknown_form';
            this.trackEvent('form_submit', formId);
        });

        // Track feature usage
        this.setupFeatureTracking();
    }

    trackSessionStart() {
        const session = {
            id: this.generateSessionId(),
            startTime: this.sessionStart.toISOString(),
            device: this.getDeviceInfo(),
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            language: navigator.language
        };

        this.analyticsData.sessions.push(session);
        this.saveAnalyticsData();

        // Track session duration when page unloads
        window.addEventListener('beforeunload', () => {
            this.trackSessionEnd();
        });
    }

    trackSessionEnd() {
        const sessionEnd = new Date();
        const duration = sessionEnd - this.sessionStart;
        
        const currentSession = this.analyticsData.sessions[this.analyticsData.sessions.length - 1];
        if (currentSession) {
            currentSession.endTime = sessionEnd.toISOString();
            currentSession.duration = duration;
            currentSession.pageCount = this.analyticsData.pageViews.filter(
                pv => pv.sessionId === currentSession.id
            ).length;
            
            this.saveAnalyticsData();
        }
    }

    trackPageView(pageName) {
        const pageView = {
            sessionId: this.getCurrentSessionId(),
            page: pageName,
            timestamp: new Date().toISOString(),
            referrer: document.referrer,
            url: window.location.href
        };

        this.analyticsData.pageViews.push(pageView);
        
        // Track user journey
        this.trackUserJourney(pageName);
        
        this.saveAnalyticsData();
    }

    trackEvent(eventCategory, eventAction, eventLabel = null, eventValue = null) {
        const event = {
            sessionId: this.getCurrentSessionId(),
            category: eventCategory,
            action: eventAction,
            label: eventLabel,
            value: eventValue,
            timestamp: new Date().toISOString()
        };

        this.analyticsData.events.push(event);
        
        // Track feature usage
        if (eventCategory === 'feature_usage') {
            this.trackFeatureUsage(eventAction);
        }
        
        this.saveAnalyticsData();
    }

    trackUserJourney(pageName) {
        const journeyStep = {
            sessionId: this.getCurrentSessionId(),
            page: pageName,
            timestamp: new Date().toISOString(),
            sequence: this.analyticsData.userJourney.filter(
                j => j.sessionId === this.getCurrentSessionId()
            ).length + 1
        };

        this.analyticsData.userJourney.push(journeyStep);
    }

    trackFeatureUsage(featureName) {
        if (!this.analyticsData.featureUsage[featureName]) {
            this.analyticsData.featureUsage[featureName] = {
                count: 0,
                firstUsed: new Date().toISOString(),
                lastUsed: new Date().toISOString()
            };
        }
        
        this.analyticsData.featureUsage[featureName].count++;
        this.analyticsData.featureUsage[featureName].lastUsed = new Date().toISOString();
    }

    setupFeatureTracking() {
        // Track finance features
        this.setupFinanceTracking();
        
        // Track mood features
        this.setupMoodTracking();
        
        // Track game features
        this.setupGameTracking();
        
        // Track chatbot usage
        this.setupChatbotTracking();
    }

    setupFinanceTracking() {
        // Track transaction additions
        const originalAddTransaction = window.financeManager?.addTransaction;
        if (originalAddTransaction) {
            window.financeManager.addTransaction = (...args) => {
                this.trackEvent('feature_usage', 'finance_add_transaction', args[0].type);
                return originalAddTransaction.apply(window.financeManager, args);
            };
        }

        // Track budget updates
        const originalSaveData = window.financeManager?.saveData;
        if (originalSaveData) {
            window.financeManager.saveData = (...args) => {
                this.trackEvent('feature_usage', 'finance_save_data');
                return originalSaveData.apply(window.financeManager, args);
            };
        }
    }

    setupMoodTracking() {
        const originalSaveCurrentMood = window.moodTracker?.saveCurrentMood;
        if (originalSaveCurrentMood) {
            window.moodTracker.saveCurrentMood = (...args) => {
                const selectedMood = document.querySelector('.mood-option.selected');
                if (selectedMood) {
                    this.trackEvent('feature_usage', 'mood_track', selectedMood.dataset.mood);
                }
                return originalSaveCurrentMood.apply(window.moodTracker, args);
            };
        }
    }

    setupGameTracking() {
        const originalStartGame = window.gamesManager?.startGame;
        if (originalStartGame) {
            window.gamesManager.startGame = (...args) => {
                this.trackEvent('feature_usage', 'game_start', args[0]);
                return originalStartGame.apply(window.gamesManager, args);
            };
        }

        const originalSaveScore = window.gamesManager?.saveScore;
        if (originalSaveScore) {
            window.gamesManager.saveScore = (...args) => {
                this.trackEvent('feature_usage', 'game_score_save', args[0], args[1]);
                return originalSaveScore.apply(window.gamesManager, args);
            };
        }
    }

    setupChatbotTracking() {
        const originalSendMessage = window.chatbot?.sendMessage;
        if (originalSendMessage) {
            window.chatbot.sendMessage = (...args) => {
                this.trackEvent('feature_usage', 'chatbot_message');
                return originalSendMessage.apply(window.chatbot, args);
            };
        }
    }

    setupPerformanceMonitoring() {
        // Track page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            this.trackPerformance('page_load', loadTime);
        });

        // Track resource loading performance
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
                if (entry.entryType === 'resource') {
                    this.trackPerformance('resource_load', entry.duration, entry.name);
                }
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });

        // Track largest contentful paint
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.trackPerformance('lcp', lastEntry.startTime, lastEntry.name);
        });
        
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    }

    trackPerformance(metric, value, resource = null) {
        const performanceEntry = {
            metric: metric,
            value: value,
            resource: resource,
            timestamp: new Date().toISOString(),
            sessionId: this.getCurrentSessionId()
        };

        this.analyticsData.performance.push(performanceEntry);
        this.saveAnalyticsData();
    }

    setupErrorTracking() {
        // Track JavaScript errors
        window.addEventListener('error', (e) => {
            this.trackError('javascript_error', e.error?.message || e.message, e.filename, e.lineno);
        });

        // Track promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.trackError('promise_rejection', e.reason?.message || 'Unknown promise rejection');
        });

        // Track console errors
        const originalConsoleError = console.error;
        console.error = (...args) => {
            this.trackError('console_error', args.join(' '));
            originalConsoleError.apply(console, args);
        };
    }

    trackError(errorType, errorMessage, filename = null, lineNumber = null) {
        const error = {
            type: errorType,
            message: errorMessage,
            filename: filename,
            lineNumber: lineNumber,
            timestamp: new Date().toISOString(),
            sessionId: this.getCurrentSessionId(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.analyticsData.errors.push(error);
        this.saveAnalyticsData();
    }

    getCurrentSessionId() {
        if (this.analyticsData.sessions.length === 0) return null;
        return this.analyticsData.sessions[this.analyticsData.sessions.length - 1].id;
    }

    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getDeviceInfo() {
        const ua = navigator.userAgent;
        let device = 'desktop';
        
        if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
            device = 'mobile';
        } else if (/Tablet|iPad/i.test(ua)) {
            device = 'tablet';
        }
        
        return device;
    }

    saveAnalyticsData() {
        // Keep data size manageable (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        this.analyticsData.pageViews = this.analyticsData.pageViews.filter(
            pv => new Date(pv.timestamp) > thirtyDaysAgo
        );
        
        this.analyticsData.events = this.analyticsData.events.filter(
            e => new Date(e.timestamp) > thirtyDaysAgo
        );
        
        this.analyticsData.errors = this.analyticsData.errors.filter(
            e => new Date(e.timestamp) > thirtyDaysAgo
        );
        
        this.analyticsData.analyticsData.lastUpdated = new Date().toISOString();
        
        localStorage.setItem('analytics_data', JSON.stringify(this.analyticsData));
    }

    // Analytics reporting methods
    getDailyStats(date = new Date()) {
        const dateStr = date.toISOString().split('T')[0];
        
        const dailyPageViews = this.analyticsData.pageViews.filter(
            pv => pv.timestamp.startsWith(dateStr)
        );
        
        const dailyEvents = this.analyticsData.events.filter(
            e => e.timestamp.startsWith(dateStr)
        );
        
        const dailySessions = this.analyticsData.sessions.filter(
            s => s.startTime.startsWith(dateStr)
        );

        return {
            date: dateStr,
            pageViews: dailyPageViews.length,
            events: dailyEvents.length,
            sessions: dailySessions.length,
            uniqueFeatures: new Set(dailyEvents.filter(e => e.category === 'feature_usage').map(e => e.action)).size,
            averageSessionDuration: this.calculateAverageSessionDuration(dailySessions)
        };
    }

    calculateAverageSessionDuration(sessions) {
        const completedSessions = sessions.filter(s => s.duration);
        if (completedSessions.length === 0) return 0;
        
        const totalDuration = completedSessions.reduce((sum, session) => sum + session.duration, 0);
        return totalDuration / completedSessions.length;
    }

    getPopularFeatures(limit = 10) {
        const featureUsage = this.analyticsData.featureUsage;
        const features = Object.entries(featureUsage)
            .map(([name, data]) => ({
                name,
                count: data.count,
                lastUsed: data.lastUsed
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
            
        return features;
    }

    getUserJourney(sessionId = null) {
        const targetSessionId = sessionId || this.getCurrentSessionId();
        return this.analyticsData.userJourney
            .filter(step => step.sessionId === targetSessionId)
            .sort((a, b) => a.sequence - b.sequence);
    }

    exportAnalyticsData() {
        const exportData = {
            analytics: this.analyticsData,
            exportDate: new Date().toISOString(),
            summary: {
                totalSessions: this.analyticsData.sessions.length,
                totalPageViews: this.analyticsData.pageViews.length,
                totalEvents: this.analyticsData.events.length,
                totalErrors: this.analyticsData.errors.length,
                dataPeriod: this.getDataPeriod()
            }
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `analytics-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    getDataPeriod() {
        if (this.analyticsData.pageViews.length === 0) return 'No data';
        
        const firstDate = new Date(this.analyticsData.pageViews[0].timestamp);
        const lastDate = new Date(this.analyticsData.pageViews[this.analyticsData.pageViews.length - 1].timestamp);
        
        return `${firstDate.toLocaleDateString()} - ${lastDate.toLocaleDateString()}`;
    }

    // Privacy controls
    clearAnalyticsData() {
        if (confirm('Apakah Anda yakin ingin menghapus semua data analytics? Tindakan ini tidak dapat dibatalkan.')) {
            this.analyticsData = this.initializeAnalytics();
            localStorage.setItem('analytics_data', JSON.stringify(this.analyticsData));
            this.showNotification('Data analytics berhasil dihapus', 'success');
        }
    }

    showNotification(message, type = 'info') {
        if (window.financeManager && window.financeManager.showNotification) {
            window.financeManager.showNotification(message, type);
        } else {
            alert(message);
        }
    }
}

// Initialize analytics manager
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
});
