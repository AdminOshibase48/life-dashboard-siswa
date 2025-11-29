// AI Chatbot Component
class Chatbot {
    constructor() {
        this.conversationHistory = JSON.parse(localStorage.getItem('chat_history')) || [];
        this.isTyping = false;
        this.quickReplies = {
            study: [
                "Tips belajar efektif",
                "Cara mengatur jadwal belajar",
                "Teknik menghafal yang baik",
                "Mengatasi malas belajar"
            ],
            mood: [
                "Saya merasa sedih hari ini",
                "Bagaimana cara meningkatkan mood?",
                "Rekomendasi musik untuk belajar",
                "Aktivitas yang menyenangkan"
            ],
            finance: [
                "Cara menabung yang efektif",
                "Tips mengatur uang saku",
                "Budgeting untuk pelajar",
                "Cara mengurangi pengeluaran"
            ],
            general: [
                "Rekomendasi film bagus",
                "Aplikasi produktivitas terbaik",
                "Tips manage waktu",
                "Ide kegiatan weekend"
            ]
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderChatHistory();
        this.setupQuickReplies();
    }

    setupEventListeners() {
        const chatInput = document.getElementById('chat-input');
        const sendButton = document.getElementById('send-message');

        if (chatInput && sendButton) {
            // Send message on button click
            sendButton.addEventListener('click', () => {
                this.sendMessage();
            });

            // Send message on Enter key
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Auto-resize textarea
            chatInput.addEventListener('input', () => {
                this.autoResizeTextarea(chatInput);
            });
        }

        // Quick replies
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-reply')) {
                const message = e.target.dataset.message;
                this.addMessage(message, 'user');
                this.getAIResponse(message);
            }

            if (e.target.classList.contains('suggestion-category')) {
                const category = e.target.dataset.category;
                this.showCategorySuggestions(category);
            }
        });
    }

    setupQuickReplies() {
        const quickRepliesContainer = document.querySelector('.quick-replies');
        if (!quickRepliesContainer) return;

        // Show some general quick replies
        const generalReplies = this.quickReplies.general.slice(0, 3);
        quickRepliesContainer.innerHTML = generalReplies.map(reply => `
            <button class="quick-reply" data-message="${reply}">${reply}</button>
        `).join('');
    }

    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput.value.trim();

        if (message && !this.isTyping) {
            this.addMessage(message, 'user');
            chatInput.value = '';
            this.autoResizeTextarea(chatInput);
            this.getAIResponse(message);
        }
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) return;

        const messageId = this.generateId();
        const timestamp = new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.dataset.messageId = messageId;

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${sender === 'user' ? '👤' : '🤖'}
            </div>
            <div class="message-content">
                <div class="message-text">${this.formatMessage(text)}</div>
                <div class="message-time">${timestamp}</div>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        // Save to history
        if (sender === 'user') {
            this.conversationHistory.push({
                id: messageId,
                sender: 'user',
                text: text,
                timestamp: new Date().toISOString()
            });
        }

        this.saveHistory();
    }

    async getAIResponse(userMessage) {
        this.showTypingIndicator();
        this.isTyping = true;

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

            const response = this.generateResponse(userMessage);
            this.addMessage(response, 'bot');
            
            // Update quick replies based on context
            this.updateContextualQuickReplies(userMessage);

        } catch (error) {
            console.error('Error getting AI response:', error);
            this.addMessage('Maaf, terjadi kesalahan. Silakan coba lagi.', 'bot');
        } finally {
            this.hideTypingIndicator();
            this.isTyping = false;
        }
    }

    generateResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Study-related queries
        if (message.includes('belajar') || message.includes('studi') || message.includes('tugas')) {
            return this.getStudyResponse(message);
        }
        
        // Mood-related queries
        if (message.includes('mood') || message.includes('sedih') || message.includes('senang') || 
            message.includes('lelah') || message.includes('bosan') || message.includes('semangat')) {
            return this.getMoodResponse(message);
        }
        
        // Finance-related queries
        if (message.includes('uang') || message.includes('keuangan') || message.includes('tabung') || 
            message.includes('budget') || message.includes('belanja')) {
            return this.getFinanceResponse(message);
        }
        
        // General queries
        if (message.includes('musik') || message.includes('lagu')) {
            return this.getMusicResponse();
        }
        
        if (message.includes('film') || message.includes('nonton')) {
            return this.getMovieResponse();
        }
        
        if (message.includes('game') || message.includes('main')) {
            return this.getGameResponse();
        }
        
        // Default response
        return this.getDefaultResponse();
    }

    getStudyResponse(message) {
        const responses = [
            `Tips belajar efektif:\n\n1. **Gunakan teknik Pomodoro**: 25 menit belajar, 5 menit istirahat\n2. **Buat ringkasan**: Gunakan mind mapping untuk visualisasi\n3. **Ajarkan orang lain**: Cara terbaik untuk memahami materi\n4. **Tidur yang cukup**: Konsolidasi memori terjadi saat tidur\n5. **Review berkala**: Ulangi materi dalam 24 jam, 1 minggu, dan 1 bulan`,

            `Untuk mengatur jadwal belajar:\n\n• Tentukan prioritas mata pelajaran\n• Alokasikan waktu berdasarkan kesulitan\n• Sediakan waktu untuk review\n• Jangan lupa istirahat dan hiburan\n• Gunakan aplikasi reminder seperti Google Calendar`,

            `Mengatasi malas belajar:\n\n🏃‍♂️ **Mulai dengan yang kecil**: 5 menit saja dulu\n🎯 **Tentukan tujuan jelas**: "Saya akan belajar 1 bab hari ini"\n🏆 **Beri reward**: Setelah selesai, lakukan hal menyenangkan\n📱 **Minimalkan distraksi**: Matikan notifikasi sementara\n👥 **Belajar kelompok**: Buat lebih menyenangkan`,

            `Teknik menghafal yang efektif:\n\n🔁 **Spaced Repetition**: Ulangi dengan interval semakin panjang\n🎨 **Visual Association**: Buat asosiasi visual dengan gambar\n🗣️ **Mnemonics**: Gunakan singkatan atau cerita\n🏃‍♂️ **Active Recall**: Coba ingat tanpa melihat catatan\n📝 **Teach Back**: Ajarkan materi kepada orang lain`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    getMoodResponse(message) {
        if (message.includes('sedih') || message.includes('bad mood')) {
            return `Saya turut prihatin mendengarnya. Coba lakukan ini:\n\n💙 **Ekspresikan perasaan**: Tulis di jurnal atau bicara dengan teman\n🎵 **Dengarkan musik**: Lagu sedih justru bisa membantu proses healing\n🌳 **Keluar rumah**: Hirup udara segar dan lihat pemandangan\n🧘‍♂️ **Meditasi singkat**: 5 menit mindfulness bisa menenangkan\n🍵 **Minum teh hangat**: Chamomile atau peppermint bisa relaksasi\n\nIngat, perasaan sedih adalah hal normal dan akan berlalu. 💫`;
        }

        if (message.includes('lelah') || message.includes('capek')) {
            return `Wah, sepertinya kamu butuh istirahat! Coba:\n\n😴 **Power nap**: Tidur 20 menit bisa menyegarkan\n💧 **Minum air**: Dehidrasi sering bikin lelah\n🍎 **Makan snack sehat**: Pisang atau kacang-kacangan\n🧘‍♂️ **Peregangan**: Lakukan 5 menit stretching\n🎵 **Musik energik**: Dengarkan lagu upbeat\n\nJangan lupa, istirahat itu produktif juga! ✨`;
        }

        if (message.includes('bosan')) {
            return `Bosan itu tanda butuh tantangan baru! Coba:\n\n🎮 **Main game edukatif**: Coba game di platform ini\n📚 **Baca buku genre baru**: Keluar dari zona nyaman\n🎨 **Aktivitas kreatif**: Gambar, tulis, atau buat kerajinan\n🏃‍♂️ **Coba hobi baru**: Masak, fotografi, atau olahraga\n👥 **Video call teman**: Ngobrol seru bisa hilangkan bosan\n\nSometimes boredom leads to the most creative ideas! 💡`;
        }

        if (message.includes('senang') || message.includes('happy')) {
            return `Wah, senang mendengarnya! 🎉\n\nIni saat yang tepat untuk:\n\n📝 **Journaling**: Tulis momen bahagia untuk dikenang\n🎯 **Set goals**: Manfaatkan energi positif untuk capai target\n📞 **Berbagi**: Sebarkan kebahagiaan ke orang lain\n💃 **Ekspresikan**: Dance party kecil-kecilan!\n\nSemoga kebahagiaanmu terus berlanjut! ✨`;
        }

        return `Untuk meningkatkan mood, coba:\n\n🎵 **Dengarkan musik favorit**\n🏃‍♂️ **Olahraga ringan 15 menit**\n📞 **Hubungi teman atau keluarga**\n🎮 **Main game menyenangkan**\n🌳 **Jalan-jalan di luar rumah**\n\nApa ada hal spesifik yang bisa saya bantu? 😊`;
    }

    getFinanceResponse(message) {
        const responses = [
            `Tips menabung untuk pelajar:\n\n💰 **50-30-20 Rule**: \n   • 50% untuk kebutuhan\n   • 30% untuk keinginan\n   • 20% untuk tabungan\n\n📱 **Gunakan aplikasi tracking** seperti fitur finance di platform ini\n🎯 **Set target kecil**: Rp 10.000/hari = Rp 300.000/bulan\n🚫 **Hindari impulse buying**: Tunggu 24 jam sebelum beli\n📊 **Review weekly**: Cek pengeluaran tiap minggu`,

            `Cara mengatur uang saku:\n\n📝 **Catat semua pengeluaran**\n🥪 **Bawa bekal**: Lebih hemat dan sehat\n🚌 **Gunakan transportasi umum**: Lebih murah\n🎁 **Batas hadiah sendiri**: Max 10% dari uang saku\n💡 **Cari pendapatan tambahan**: Jual barang tidak terpakai`,

            `Budgeting sederhana:\n\n1. **Makanan**: 40%\n2. **Transportasi**: 20%\n3. **Hiburan**: 15%\n4. **Pendidikan**: 15%\n5. **Tabungan**: 10%\n\nSesuaikan dengan kebutuhanmu! Gunakan fitur finance tracker untuk monitor.`
        ];

        return responses[Math.floor(Math.random() * responses.length)];
    }

    getMusicResponse() {
        const playlists = {
            fokus: "Lofi hip hop, classical music, atau ambient sounds",
            semangat: "Pop upbeat, EDM, atau lagu motivasi",
            relaks: "Jazz smooth, acoustic, atau nature sounds",
            sedih: "Ballads, indie folk, atau piano instrumental"
        };

        return `Rekomendasi musik berdasarkan kebutuhan:\n\n🎧 **Untuk fokus belajar**: ${playlists.fokus}\n💃 **Untuk semangat**: ${playlists.semangat}\n😌 **Untuk relaksasi**: ${playlists.relaks}\n💙 **Untuk healing**: ${playlists.sedih}\n\nPlatform: Spotify, YouTube Music, atau Joox memiliki playlist yang bagus!`;
    }

    getMovieResponse() {
        const movies = {
            inspiratif: "The Pursuit of Happyness, Freedom Writers, Good Will Hunting",
            komedi: "The Intern, Yes Man, School of Rock",
            motivasi: "Rocky, The Social Network, The King's Speech",
            petualangan: "Harry Potter, The Lord of the Rings, Jurassic Park"
        };

        return `Rekomendasi film bagus:\n\n🎬 **Inspiratif**: ${movies.inspiratif}\n😂 **Komedi ringan**: ${movies.komedi}\n💪 **Motivasi**: ${movies.motivasi}\n🏔️ **Petualangan**: ${movies.petualangan}\n\nPerfect for weekend relaxation! 🍿`;
    }

    getGameResponse() {
        return `Game seru di platform ini:\n\n🧩 **Puzzle Challenge**: Asah otak dengan puzzle menyenangkan\n🎯 **Memory Match**: Uji daya ingat
