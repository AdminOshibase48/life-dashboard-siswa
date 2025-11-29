// Finance Component
class FinanceManager {
    constructor() {
        this.transactions = JSON.parse(localStorage.getItem('finance_transactions')) || [];
        this.budgets = JSON.parse(localStorage.getItem('finance_budgets')) || this.getDefaultBudgets();
        this.chart = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderOverview();
        this.renderTransactions();
        this.renderBudgets();
        this.initCharts();
    }

    setupEventListeners() {
        // Finance form submission
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'finance-form') {
                e.preventDefault();
                this.handleTransactionSubmit(e.target);
            }
        });

        // Period filter changes
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('period-select')) {
                this.updateCharts();
            }
        });

        // Export buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('export-btn')) {
                const format = e.target.dataset.format;
                this.exportData(format);
            }
        });
    }

    handleTransactionSubmit(form) {
        const formData = new FormData(form);
        const transaction = {
            id: this.generateId(),
            type: formData.get('type'),
            amount: parseFloat(formData.get('amount')),
            category: formData.get('category'),
            description: formData.get('description'),
            date: new Date().toISOString()
        };

        this.addTransaction(transaction);
        form.reset();
        
        // Show success message
        this.showNotification('Transaksi berhasil ditambahkan!', 'success');
    }

    addTransaction(transaction) {
        this.transactions.unshift(transaction);
        this.saveData();
        this.renderOverview();
        this.renderTransactions();
        this.updateCharts();
        this.updateBudgets();
    }

    deleteTransaction(transactionId) {
        this.transactions = this.transactions.filter(t => t.id !== transactionId);
        this.saveData();
        this.renderOverview();
        this.renderTransactions();
        this.updateCharts();
        this.updateBudgets();
    }

    renderOverview() {
        const overviewContainer = document.querySelector('.finance-overview');
        if (!overviewContainer) return;

        const stats = this.calculateStats();

        overviewContainer.innerHTML = `
            <div class="overview-card income">
                <div class="overview-icon">💰</div>
                <div class="overview-value">${this.formatCurrency(stats.income)}</div>
                <div class="overview-label">Pemasukan</div>
            </div>
            <div class="overview-card expense">
                <div class="overview-icon">💸</div>
                <div class="overview-value">${this.formatCurrency(stats.expense)}</div>
                <div class="overview-label">Pengeluaran</div>
            </div>
            <div class="overview-card balance">
                <div class="overview-icon">🏦</div>
                <div class="overview-value">${this.formatCurrency(stats.balance)}</div>
                <div class="overview-label">Saldo</div>
            </div>
            <div class="overview-card budget">
                <div class="overview-icon">📊</div>
                <div class="overview-value">${stats.budgetUsage}%</div>
                <div class="overview-label">Budget Terpakai</div>
            </div>
        `;
    }

    renderTransactions() {
        const transactionsContainer = document.querySelector('.transaction-list');
        if (!transactionsContainer) return;

        if (this.transactions.length === 0) {
            transactionsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">💸</div>
                    <div class="empty-title">Belum ada transaksi</div>
                    <div class="empty-desc">Tambahkan transaksi pertama Anda untuk memulai</div>
                </div>
            `;
            return;
        }

        transactionsContainer.innerHTML = this.transactions.map(transaction => `
            <div class="transaction-item ${transaction.type}">
                <div class="transaction-icon">
                    ${this.getCategoryIcon(transaction.category)}
                </div>
                <div class="transaction-content">
                    <div class="transaction-title">${transaction.description}</div>
                    <div class="transaction-category">${this.getCategoryName(transaction.category)}</div>
                </div>
                <div class="transaction-amount">
                    ${transaction.type === 'income' ? '+' : '-'}${this.formatCurrency(transaction.amount)}
                </div>
                <div class="transaction-date">
                    ${this.formatDate(transaction.date)}
                </div>
                <div class="transaction-actions">
                    <button class="action-btn" onclick="financeManager.deleteTransaction('${transaction.id}')" title="Hapus">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderBudgets() {
        const budgetsContainer = document.querySelector('.budget-list');
        if (!budgetsContainer) return;

        const budgetStats = this.calculateBudgetStats();

        budgetsContainer.innerHTML = Object.entries(this.budgets).map(([category, budget]) => {
            const spent = budgetStats[category] || 0;
            const percentage = budget > 0 ? (spent / budget) * 100 : 0;
            const status = percentage < 60 ? 'low' : percentage < 90 ? 'medium' : 'high';

            return `
                <div class="budget-item">
                    <div class="budget-category">
                        ${this.getCategoryIcon(category)} ${this.getCategoryName(category)}
                    </div>
                    <div class="budget-bar">
                        <div class="budget-fill ${status}" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                    <div class="budget-amount">
                        ${this.formatCurrency(spent)} / ${this.formatCurrency(budget)}
                    </div>
                    <div class="budget-percentage ${status}">
                        ${Math.round(percentage)}%
                    </div>
                </div>
            `;
        }).join('');
    }

    initCharts() {
        this.renderIncomeExpenseChart();
        this.renderCategoryChart();
    }

    renderIncomeExpenseChart() {
        const chartContainer = document.getElementById('income-expense-chart');
        if (!chartContainer) return;

        // For demo purposes - in real implementation, use Chart.js or similar
        chartContainer.innerHTML = `
            <div class="chart-placeholder">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">📊</div>
                    <div>Grafik Pemasukan vs Pengeluaran</div>
                    <div style="font-size: 0.8rem; color: var(--text-light); margin-top: 0.5rem;">
                        Data akan ditampilkan di sini
                    </div>
                </div>
            </div>
        `;
    }

    renderCategoryChart() {
        const chartContainer = document.getElementById('category-chart');
        if (!chartContainer) return;

        // For demo purposes - in real implementation, use Chart.js or similar
        chartContainer.innerHTML = `
            <div class="chart-placeholder">
                <div style="text-align: center;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">🥗</div>
                    <div>Grafik Pengeluaran per Kategori</div>
                    <div style="font-size: 0.8rem; color: var(--text-light); margin-top: 0.5rem;">
                        Data akan ditampilkan di sini
                    </div>
                </div>
            </div>
        `;
    }

    updateCharts() {
        this.renderIncomeExpenseChart();
        this.renderCategoryChart();
    }

    updateBudgets() {
        this.renderBudgets();
    }

    calculateStats() {
        const income = this.transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = this.transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const balance = income - expense;

        const totalBudget = Object.values(this.budgets).reduce((sum, budget) => sum + budget, 0);
        const budgetUsage = totalBudget > 0 ? Math.round((expense / totalBudget) * 100) : 0;

        return { income, expense, balance, budgetUsage };
    }

    calculateBudgetStats() {
        const stats = {};
        
        this.transactions
            .filter(t => t.type === 'expense')
            .forEach(transaction => {
                stats[transaction.category] = (stats[transaction.category] || 0) + transaction.amount;
            });

        return stats;
    }

    getDefaultBudgets() {
        return {
            food: 500000,
            transport: 300000,
            entertainment: 200000,
            education: 400000,
            other: 100000
        };
    }

    getCategoryIcon(category) {
        const icons = {
            food: '🍔',
            transport: '🚗',
            entertainment: '🎬',
            education: '📚',
            other: '📦'
        };
        return icons[category] || '💰';
    }

    getCategoryName(category) {
        const names = {
            food: 'Makanan',
            transport: 'Transportasi',
            entertainment: 'Hiburan',
            education: 'Pendidikan',
            other: 'Lainnya'
        };
        return names[category] || category;
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    saveData() {
        localStorage.setItem('finance_transactions', JSON.stringify(this.transactions));
        localStorage.setItem('finance_budgets', JSON.stringify(this.budgets));
    }

    exportData(format) {
        let data, mimeType, filename;

        switch (format) {
            case 'csv':
                data = this.convertToCSV();
                mimeType = 'text/csv';
                filename = 'laporan-keuangan.csv';
                break;
            case 'json':
                data = JSON.stringify({
                    transactions: this.transactions,
                    budgets: this.budgets,
                    exportDate: new Date().toISOString()
                }, null, 2);
                mimeType = 'application/json';
                filename = 'laporan-keuangan.json';
                break;
            case 'pdf':
                // In real implementation, generate PDF
                this.showNotification('Fitur ekspor PDF akan segera hadir!', 'info');
                return;
            default:
                return;
        }

        const blob = new Blob([data], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);

        this.showNotification(`Laporan berhasil diekspor sebagai ${format.toUpperCase()}!`, 'success');
    }

    convertToCSV() {
        const headers = ['Tanggal', 'Jenis', 'Kategori', 'Deskripsi', 'Jumlah'];
        const rows = this.transactions.map(transaction => [
            this.formatDate(transaction.date),
            transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
            this.getCategoryName(transaction.category),
            transaction.description,
            transaction.amount
        ]);

        return [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
            </div>
        `;

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--surface);
                    border: 1px solid var(--border);
                    border-radius: var(--radius);
                    padding: 1rem 1.5rem;
                    box-shadow: var(--shadow-lg);
                    z-index: 1000;
                    animation: slideInRight 0.3s ease;
                    max-width: 400px;
                }
                
                .notification-success {
                    border-left: 4px solid var(--success);
                }
                
                .notification-error {
                    border-left: 4px solid var(--error);
                }
                
                .notification-info {
                    border-left: 4px solid var(--primary);
                }
                
                .notification-warning {
                    border-left: 4px solid var(--warning);
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                
                .notification-icon {
                    font-size: 1.2rem;
                }
                
                .notification-message {
                    color: var(--text-primary);
                    font-weight: 500;
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || '💡';
    }
}

// Initialize finance manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.finance-overview')) {
        window.financeManager = new FinanceManager();
    }
});
