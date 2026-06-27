const clinics = [
  {
    id: 1,
    name: "Dental Care Plus - Senopati",
    distance: "1.2 km",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "Jl. Senopati No.45, Kebayoran Baru, Jakarta Selatan.",
    services: [
      { name: "Konsultasi Umum", price: "Rp 150.000" },
      { name: "Scaling", price: "Rp 350.000" },
      { name: "Tambal Gigi", price: "Rp 400.000" }
    ]
  },
  {
    id: 2,
    name: "Smile & Shine Clinic",
    distance: "2.5 km",
    rating: "4.7",
    image: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "Pondok Indah Mall 2, Jakarta Selatan.",
    services: [
      { name: "Bleaching", price: "Rp 2.500.000" },
      { name: "Kawat Gigi", price: "Rp 6.000.000" }
    ]
  },
  {
    id: 3,
    name: "Klinik Gigi Keluarga Sehat",
    distance: "3.8 km",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    address: "Jl. Kemang Raya No.12, Jakarta Selatan.",
    services: [
      { name: "Cabut Gigi", price: "Rp 300.000" },
      { name: "Root Canal", price: "Rp 800.000" },
      { name: "Konsultasi Tambal Gigi", price: "Rp 150.000" }
    ]
  }
];

let currentClinicName = "";
let isLocationAllowedWithDistance = true; // State penanda apakah jarak ditampilkan
const CHAT_STORAGE_KEY = "chat_senopati";
const SCHEDULE_STORAGE_KEY = "dental_schedules";

// Mendapatkan data jadwal dari localStorage atau menginisialisasi dengan data default tunggal
function getSchedules() {
    let data = localStorage.getItem(SCHEDULE_STORAGE_KEY);
    if (!data) {
        const defaultSchedules = [{
            id: "APP-003",
            date: "2024-05-18",
            time: "11:00",
            doctor: "Dr. Alan Grant",
            clinic: "Klinik Gigi Keluarga Sehat",
            type: "Konsultasi Tambal Gigi",
            status: "upcoming",
            patientName: "Sarah Connor"
        }];
        localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(defaultSchedules));
        return defaultSchedules;
    }
    return JSON.parse(data);
}

// --- LOGIKA LOKASI ---
function handleLocationAllow() {
    document.getElementById("location-prompt").classList.add("hidden");
    document.getElementById("location-text").innerText = "Jakarta Selatan";
    document.getElementById("clinics-section-header").classList.remove("hidden");
    document.getElementById("clinics-container").classList.remove("hidden");
    isLocationAllowedWithDistance = true;
    applySorting(); // Gunakan fungsi sort yang langsung merender dashboard
}

function handleLocationDeny() {
    document.getElementById("location-prompt").classList.add("hidden");
    document.getElementById("manual-location-form").classList.remove("hidden");
}

function submitManualLocation() {
    const city = document.getElementById("input-city").value.trim();
    const province = document.getElementById("input-province").value.trim();
    
    if (!city || !province) {
        showToast("Mohon lengkapi Kota dan Provinsi terlebih dahulu.");
        return;
    }
    
    document.getElementById("manual-location-form").classList.add("hidden");
    document.getElementById("location-text").innerText = `${city}, ${province}`;
    document.getElementById("clinics-section-header").classList.remove("hidden");
    document.getElementById("clinics-container").classList.remove("hidden");
    isLocationAllowedWithDistance = false;
    applySorting(); // Gunakan fungsi sort yang langsung merender dashboard
}

// Helper untuk parsing jarak (misal: "1.2 km" -> 1.2)
function parseDistance(distanceStr) {
    return parseFloat(distanceStr.replace(/[^0-9.]/g, ''));
}

// Helper untuk mengambil harga minimum layanan di sebuah klinik (misal: "Rp 150.000" -> 150000)
function getMinPrice(clinic) {
    if (!clinic.services || clinic.services.length === 0) return 0;
    const prices = clinic.services.map(service => {
        return parseInt(service.price.replace(/[^0-9]/g, ''), 10);
    });
    return Math.min(...prices);
}

// --- LOGIKA SORTING DATA ---
function applySorting() {
    const sortBy = document.getElementById("sort-by").value;
    
    // Duplikasi array clinics agar tidak mutasi data asli
    let sortedClinics = [...clinics];
    
    if (sortBy === "rating-desc") {
        sortedClinics.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else if (sortBy === "rating-asc") {
        sortedClinics.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
    } else if (sortBy === "price-asc") {
        sortedClinics.sort((a, b) => getMinPrice(a) - getMinPrice(b));
    } else if (sortBy === "price-desc") {
        sortedClinics.sort((a, b) => getMinPrice(b) - getMinPrice(a));
    } else if (sortBy === "distance-asc") {
        sortedClinics.sort((a, b) => parseDistance(a.distance) - parseDistance(b.distance));
    } else if (sortBy === "distance-desc") {
        sortedClinics.sort((a, b) => parseDistance(b.distance) - parseDistance(a.distance));
    }
    
    renderDashboard(sortedClinics, isLocationAllowedWithDistance);
}

// --- LOGIKA RENDER DASHBOARD (DIPERBARUI) ---
function renderDashboard(clinicsData, showDistance = true) {
    const container = document.getElementById("clinics-container");
    if (!container) return;
    
    container.innerHTML = clinicsData.map(clinic => {
        const distanceBadgeHTML = showDistance ? `
            <div class="clinic-distance">
                <i class="fa-solid fa-location-arrow text-emerald-500"></i>
                ${clinic.distance}
            </div>
        ` : '';

        // Menampilkan info harga terendah di card agar pengguna tahu perbandingan harganya
        const minPriceFormatted = clinic.services.length > 0 ? clinic.services[0].price : "Rp 0";

        return `
            <div onclick="openModal(${clinic.id})" class="clinic-card">
                <div class="clinic-image-wrapper">
                    <img src="${clinic.image}" alt="${clinic.name}">
                    ${distanceBadgeHTML}
                </div>
                <div class="clinic-content">
                    <div>
                        <h4 class="clinic-name">${clinic.name}</h4>
                        <div class="clinic-rating">
                            <i class="fa-solid fa-star"></i>
                            ${clinic.rating}
                            <span style="color: var(--gray-400); font-weight: normal; margin-left: 8px;">• Mulai ${minPriceFormatted}</span>
                        </div>
                    </div>
                    <button class="btn-card">Lihat Info & Biaya</button>
                </div>
            </div>
        `;
    }).join("");
}

// --- LOGIKA MODAL, CHAT & JANJI TEMU ---
function openModal(id) {
    const clinic = clinics.find(c => c.id === id);
    if (!clinic) return;

    currentClinicName = clinic.name;
    document.getElementById("modal-image").style.backgroundImage = `url('${clinic.image}')`;
    document.getElementById("modal-title").innerText = clinic.name;
    document.getElementById("modal-rating").innerText = clinic.rating;
    document.getElementById("modal-address").innerHTML = `
        <i class="fa-solid fa-location-dot mt-1 text-emerald-500"></i>
        <span>${clinic.address}</span>
    `;

    document.getElementById("modal-costs").innerHTML = clinic.services.map(service => `
        <tr>
            <td>${service.name}</td>
            <td>${service.price}</td>
        </tr>
    `).join("");

    // VALIDASI: Cegah pembuatan janji ganda bila klinik sudah ada di jadwal
    const schedules = getSchedules();
    const isBooked = schedules.some(s => s.clinic === clinic.name);
    const appointBtn = document.getElementById("btn-appoint-action");

    if (isBooked) {
        appointBtn.innerHTML = `<i class="fa-solid fa-calendar-check"></i> Sudah Ada di Jadwal`;
        appointBtn.style.backgroundColor = "var(--gray-400)";
        appointBtn.style.cursor = "not-allowed";
        appointBtn.onclick = function() {
            showToast(`Gagal: Anda sudah memiliki jadwal aktif di ${clinic.name}`);
        };
    } else {
        appointBtn.innerHTML = `<i class="fa-solid fa-calendar-plus"></i> Buat Janji`;
        appointBtn.style.backgroundColor = "var(--emerald-600)";
        appointBtn.style.cursor = "pointer";
        appointBtn.onclick = function() {
            closeModal();
            openAppointmentForm(clinic);
        };
    }

    const modal = document.getElementById("clinic-modal");
    modal.classList.add("show");
}

function closeModal() {
    document.getElementById("clinic-modal").classList.remove("show");
}

function openAppointmentForm(clinic) {
    const select = document.getElementById("appt-service");
    
    // Memasukkan pilihan layanan khusus dari klinik terpilih
    select.innerHTML = clinic.services.map(s => `
        <option value="${s.name}">${s.name} - ${s.price}</option>
    `).join("");
    
    // Batasi tanggal input agar minimal hari ini
    document.getElementById("appt-date").min = new Date().toISOString().split("T")[0];
    document.getElementById("appointment-modal").classList.add("show");
}

function closeAppointmentForm() {
    document.getElementById("appointment-modal").classList.remove("show");
    document.getElementById("appt-date").value = "";
    document.getElementById("appt-time").value = "";
}

function submitAppointment() {
    const patientName = document.getElementById("appt-name").value.trim();
    const date = document.getElementById("appt-date").value;
    const time = document.getElementById("appt-time").value;
    const service = document.getElementById("appt-service").value;

    if (!patientName || !date || !time || !service) {
        showToast("Mohon lengkapi seluruh kolom formulir!");
        return;
    }

    const schedules = getSchedules();
    
    const newAppointment = {
        id: "APP-" + Math.floor(1000 + Math.random() * 9000),
        date: date, // Disimpan dalam format ISO standard YYYY-MM-DD
        time: time,
        doctor: "Dokter (Menunggu Konfirmasi)", 
        clinic: currentClinicName,
        type: service,
        status: "pending", // Status default pending
        patientName: patientName
    };

    schedules.push(newAppointment);
    localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedules));

    closeAppointmentForm();
    showToast(`Berhasil memesan janji temu di ${currentClinicName}!`);
    
    setTimeout(() => {
        window.location.href = "schedule.html";
    }, 1200);
}

// --- LOGIKA CHAT ---
function getChatHistory() {
    const history = localStorage.getItem(CHAT_STORAGE_KEY);
    return history ? JSON.parse(history) : [];
}

function saveChatHistory(history) {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(history));
}

function renderPatientChat() {
    const messages = document.getElementById("chat-messages");
    if (!messages) return;
    const history = getChatHistory();
    
    messages.innerHTML = '';
    
    if (history.length === 0) {
        messages.innerHTML = `
            <div class="chat-msg-received">
                Halo! Ada yang bisa kami bantu mengenai layanan di <b>${currentClinicName}</b>?
            </div>
        `;
    } else {
        history.forEach(msg => {
            if (msg.sender === 'patient') {
                messages.innerHTML += `<div class="chat-msg-sent">${msg.text}</div>`;
            } else {
                messages.innerHTML += `<div class="chat-msg-received">${msg.text}</div>`;
            }
        });
    }
    messages.scrollTop = messages.scrollHeight;
}

function toggleChat() {
    closeModal();
    const chatWidget = document.getElementById("chat-widget");
    chatWidget.classList.add("show");
    document.getElementById("chat-clinic-name").innerText = currentClinicName;

    if (currentClinicName === "Dental Care Plus - Senopati") {
        renderPatientChat();
    } else {
        const messages = document.getElementById("chat-messages");
        messages.innerHTML = `
            <div class="chat-msg-received">
                Halo! Ada yang bisa kami bantu mengenai layanan di <b>${currentClinicName}</b>?
            </div>
        `;
    }
}

function closeChat() {
    document.getElementById("chat-widget").classList.remove("show");
}

function sendMessage() {
    const input = document.getElementById("chat-input");
    const text = input.value.trim();
    if (!text) return;

    const messages = document.getElementById("chat-messages");

    if (currentClinicName === "Dental Care Plus - Senopati") {
        const history = getChatHistory();
        history.push({
            sender: 'patient',
            text: text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        saveChatHistory(history);
        renderPatientChat();
        input.value = "";
    } else {
        messages.innerHTML += `<div class="chat-msg-sent">${text}</div>`;
        input.value = "";
        messages.scrollTop = messages.scrollHeight;

        setTimeout(() => {
            messages.innerHTML += `
                <div class="chat-msg-received">
                    Terima kasih. Tim medis kami akan segera merespon pesan Anda.
                </div>
            `;
            messages.scrollTop = messages.scrollHeight;
        }, 1000);
    }
}

function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast-item";
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check text-emerald-500 text-xl"></i>
        <span class="toast-text">${message}</span>
    `;

    document.getElementById("toast-container").appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Event Listeners
const clinicModal = document.getElementById("clinic-modal");
if (clinicModal) {
    clinicModal.addEventListener("click", function(e) {
        if (e.target === this) closeModal();
    });
}

const apptModal = document.getElementById("appointment-modal");
if (apptModal) {
    apptModal.addEventListener("click", function(e) {
        if (e.target === this) closeAppointmentForm();
    });
}

const chatInput = document.getElementById("chat-input");
if (chatInput) {
    chatInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
    });
}

window.addEventListener('storage', function(e) {
    const widget = document.getElementById("chat-widget");
    if (e.key === CHAT_STORAGE_KEY && 
        widget && widget.classList.contains("show") && 
        currentClinicName === "Dental Care Plus - Senopati") {
        renderPatientChat();
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const hamburgerToggle = document.getElementById("hamburger-toggle");
    const sidebar = document.querySelector(".sidebar");
    
    // Buat element overlay secara dinamis agar HTML tetap bersih
    const overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);

    // Fungsi membuka / menutup sidebar
    function toggleSidebar() {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("show");
    }

    // Event listener saat hamburger diklik
    if (hamburgerToggle) {
        hamburgerToggle.addEventListener("click", toggleSidebar);
    }

    // Event listener saat area luar sidebar (overlay) diklik untuk menutup menu
    overlay.addEventListener("click", toggleSidebar);

    // Otomatis tutup sidebar jika pengguna menekan link navigasi internal
    const navLinks = document.querySelectorAll(".sidebar-nav .nav-item");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (sidebar.classList.contains("active")) {
                toggleSidebar();
            }
        });
    });
});