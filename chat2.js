// Ambil elemen DOM yang dibutuhkan
const textarea = document.querySelector(".chat-textarea");
const btnSend = document.querySelector(".btn-send");
const messagesContainer = document.getElementById("doctor-chat-messages");

const CHAT_STORAGE_KEY = "chat_senopati";

// Fungsi mengambil data obrolan dari local storage
function getChatHistory() {
    const history = localStorage.getItem(CHAT_STORAGE_KEY);
    return history ? JSON.parse(history) : [];
}

// Fungsi menyimpan data obrolan ke local storage
function saveChatHistory(history) {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(history));
}

// Merender obrolan pada panel dokter
function renderDoctorChat() {
    if (!messagesContainer) return;
    const history = getChatHistory();
    
    // Siapkan wadah pesan dengan pemisah tanggal hari ini
    messagesContainer.innerHTML = `
        <div class="date-divider">
            <div class="date-line"></div>
            <span class="date-badge">Hari Ini</span>
        </div>
    `;
    
    // Susun baris chat berdasarkan pengirim
    history.forEach(msg => {
        if (msg.sender === 'patient') {
            messagesContainer.innerHTML += `
                <div class="message-row patient">
                    <div class="avatar-xs bg-emerald-light text-emerald-dark">SC</div>
                    <div class="message-content">
                        <div class="bubble bubble-patient">${msg.text}</div>
                        <p class="message-time">${msg.timestamp}</p>
                    </div>
                </div>
            `;
        } else {
            messagesContainer.innerHTML += `
                <div class="message-row doctor">
                    <div class="avatar-xs bg-slate-200 text-gray-600">DS</div>
                    <div class="message-content">
                        <div class="bubble bubble-doctor">${msg.text}</div>
                        <p class="message-time">${msg.timestamp} <i class="fa-solid fa-check-double text-emerald-500"></i></p>
                    </div>
                </div>
            `;
        }
    });
    
    // Gulir otomatis ke bagian bawah pesan terbaru
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Fungsi mengirim pesan dari sisi dokter
function sendDoctorMessage() {
    const text = textarea.value.trim();
    if (!text) return;

    const history = getChatHistory();
    history.push({
        sender: 'doctor',
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    saveChatHistory(history);
    
    renderDoctorChat();
    
    // Bersihkan textarea dan reset tinggi barisnya
    textarea.value = "";
    textarea.style.height = "44px";
}

// Menyesuaikan tinggi textarea secara dinamis sesuai teks masukan
textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
});

// Mengirim pesan saat tombol Enter ditekan (tanpa tombol Shift)
textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendDoctorMessage();
    }
});

// Mengirim pesan saat tombol kirim (ikon pesawat kertas) diklik
if (btnSend) {
    btnSend.addEventListener("click", (e) => {
        e.preventDefault();
        sendDoctorMessage();
    });
}

// Sinkronisasi pesan secara real-time ketika ada pembaruan di tab pasien (dashboard.html)
window.addEventListener('storage', function(e) {
    if (e.key === CHAT_STORAGE_KEY) {
        renderDoctorChat();
    }
});

// Jalankan render obrolan awal saat halaman pertama kali dimuat
renderDoctorChat();