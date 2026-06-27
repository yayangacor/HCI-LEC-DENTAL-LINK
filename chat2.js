const textarea = document.querySelector(".chat-textarea");
const btnSend = document.querySelector(".btn-send");
const messagesContainer = document.getElementById("doctor-chat-messages");
const CHAT_STORAGE_KEY = "chat_senopati";

function getChatHistory() {
    const history = localStorage.getItem(CHAT_STORAGE_KEY);
    return history ? JSON.parse(history) : [];
}

function saveChatHistory(history) {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(history));
}

function renderDoctorChat() {
    if (!messagesContainer) return;
    const history = getChatHistory();
    
    messagesContainer.innerHTML = `
        <div class="date-divider">
            <div class="date-line"></div>
            <span class="date-badge">Hari Ini</span>
        </div>
    `;
    
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
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

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
    
    textarea.value = "";
    textarea.style.height = "44px";
}

textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
});

textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendDoctorMessage();
    }
});

if (btnSend) {
    btnSend.addEventListener("click", (e) => {
        e.preventDefault();
        sendDoctorMessage();
    });
}

window.addEventListener('storage', function(e) {
    if (e.key === CHAT_STORAGE_KEY) {
        renderDoctorChat();
    }
});

renderDoctorChat();

document.addEventListener("DOMContentLoaded", function () {
    const hamburgerToggle = document.getElementById("hamburger-toggle");
    const sidebar = document.querySelector(".sidebar");
    
    if (!hamburgerToggle || !sidebar) return;

    const overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);

    function toggleSidebar() {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("show");
    }

    hamburgerToggle.addEventListener("click", toggleSidebar);
    overlay.addEventListener("click", toggleSidebar);

    const navLinks = document.querySelectorAll(".sidebar-nav .nav-item");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (sidebar.classList.contains("active")) {
                toggleSidebar();
            }
        });
    });
});