const SCHEDULE_STORAGE_KEY = "dental_schedules";

const clinicsData = [
  { name: "Dental Care Plus - Senopati", services: [{ name: "Konsultasi Umum" }, { name: "Scaling" }, { name: "Tambal Gigi" }] },
  { name: "Smile & Shine Clinic", services: [{ name: "Bleaching" }, { name: "Kawat Gigi" }] },
  { name: "Klinik Gigi Keluarga Sehat", services: [{ name: "Cabut Gigi" }, { name: "Root Canal" }, { name: "Konsultasi Tambal Gigi" }] }
];

let currentRescheduleId = null;
let currentActiveTab = "active"; // Nilai: 'active' (Upcoming + Pending) atau 'completed'

// Fungsi konverter tanggal yang sangat tangguh terhadap anomali format dan Timezone Offset
function parseDateForDisplay(dateStr) {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    if (!dateStr) return { day: "--", month: "---" };

    // Kasus 1: Format ISO 'YYYY-MM-DD'
    if (dateStr.includes("-")) {
        const parts = dateStr.split("-");
        if (parts.length === 3) {
            const monthIdx = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            return {
                day: day.toString(),
                month: months[monthIdx] || "Mei"
            };
        }
    }

    // Kasus 2: Format 'DD Month YYYY' (misal: "18 Mei 2024")
    const parts = dateStr.split(" ");
    if (parts.length >= 2) {
        if (!isNaN(parts[0])) {
            return { day: parts[0], month: parts[1] };
        } else if (!isNaN(parts[1])) {
            return { day: parts[1], month: parts[0] };
        }
    }

    // Kasus 3: General standard Javascript Date Parsing
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
        return { day: "18", month: "Mei" };
    }
    return {
        day: d.getDate().toString(),
        month: months[d.getMonth()]
    };
}

// Mengambil data ter-update
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

// Fungsi ganti tab visual dan render ulang filter
function switchTab(tabType) {
    currentActiveTab = tabType;
    document.getElementById("tab-btn-upcoming").classList.toggle("active", tabType === "active");
    document.getElementById("tab-btn-history").classList.toggle("active", tabType === "completed");
    renderSchedule();
}

function renderSchedule() {
    const container = document.getElementById("schedule-list");
    if (!container) return;
    
    const schedules = getSchedules();

    // Memfilter data berdasarkan tab aktif
    let filteredSchedules = [];
    if (currentActiveTab === "active") {
        // Tab "Akan Datang" menampilkan status 'upcoming' dan 'pending'
        filteredSchedules = schedules.filter(sch => sch.status === "upcoming" || sch.status === "pending");
    } else {
        // Tab "Riwayat" menampilkan status 'completed'
        filteredSchedules = schedules.filter(sch => sch.status === "completed");
    }

    // Jika kosong, tampilkan ilustrasi pesan kosong
    if (filteredSchedules.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 48px 16px; color: var(--gray-500);">
                <i class="fa-solid fa-calendar-xmark" style="font-size: 48px; margin-bottom: 16px; color: var(--gray-400);"></i>
                <p style="font-weight: 700; font-size: 16px; margin-bottom: 4px;">Tidak Ada Jadwal</p>
                <p style="font-size: 13px;">Belum ada janji temu yang terdaftar di kategori ini.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredSchedules.map(sch => {
        const isUpcoming = sch.status === "upcoming";
        const isPending = sch.status === "pending";
        const isCompleted = sch.status === "completed";
        
        let statusLabel = "Akan Datang";
        let statusClass = "upcoming";

        if (isPending) {
            statusLabel = "Pending (Menunggu Konfirmasi)";
            statusClass = "pending";
        } else if (isCompleted) {
            statusLabel = "Selesai";
            statusClass = "completed";
        }

        const displayDate = parseDateForDisplay(sch.date);

        return `
            <div class="schedule-card ${statusClass}">
                <div class="schedule-main-info">
                    
                    <div class="date-badge ${statusClass}">
                        <span class="date-month">${displayDate.month}</span>
                        <span class="date-day">${displayDate.day}</span>
                    </div>

                    <div class="detail-container">
                        <div class="meta-row">
                            <p class="time-text">
                                <i class="fa-regular fa-clock"></i>
                                ${sch.time}
                            </p>
                            <span class="status-badge ${statusClass}">
                                ${statusLabel}
                            </span>
                        </div>

                        <h4 class="appointment-title">${sch.type}</h4>
                        
                        <p class="doctor-text">
                            <i class="fa-solid fa-user-doctor"></i>
                            ${sch.doctor}
                        </p>

                        <p class="clinic-text">
                            <i class="fa-solid fa-building-user"></i>
                            ${sch.clinic}
                        </p>
                    </div>

                </div>

                ${(isUpcoming || isPending) ? `
                    <div class="action-buttons">
                        <button onclick="openRescheduleModal('${sch.id}')" class="btn-secondary">
                            Reschedule
                        </button>
                    </div>
                ` : `
                    <div class="action-buttons">
                        <button onclick="showToast('Membuka catatan medis')" class="btn-secondary">
                            Lihat Catatan Medis
                        </button>
                    </div>
                `}
            </div>
        `;
    }).join("");
}

// LOGIKA FORMULIR RESCHEDULE
function openRescheduleModal(id) {
    currentRescheduleId = id;
    const schedules = getSchedules();
    const appt = schedules.find(s => s.id === id);
    if (!appt) return;

    document.getElementById("reschedule-name").value = appt.patientName || "Sarah Connor";
    document.getElementById("reschedule-date").value = appt.date;
    document.getElementById("reschedule-time").value = appt.time.replace(" WIB", "");

    // Ambil opsi layanan berdasarkan nama klinik
    const clinicData = clinicsData.find(c => c.name === appt.clinic);
    const select = document.getElementById("reschedule-service");
    
    if (clinicData) {
        select.innerHTML = clinicData.services.map(s => 
            `<option value="${s.name}" ${s.name === appt.type ? 'selected' : ''}>${s.name}</option>`
        ).join("");
    } else {
        select.innerHTML = `<option value="${appt.type}" selected>${appt.type}</option>`;
    }

    document.getElementById("reschedule-modal").classList.add("show");
}

function closeRescheduleModal() {
    document.getElementById("reschedule-modal").classList.remove("show");
    currentRescheduleId = null;
}

function submitReschedule() {
    const patientName = document.getElementById("reschedule-name").value.trim();
    const date = document.getElementById("reschedule-date").value;
    const time = document.getElementById("reschedule-time").value;
    const service = document.getElementById("reschedule-service").value;

    if (!patientName || !date || !time || !service) {
        showToast("Mohon lengkapi semua data formulir.");
        return;
    }

    const schedules = getSchedules();
    const idx = schedules.findIndex(s => s.id === currentRescheduleId);
    
    if (idx !== -1) {
        schedules[idx].patientName = patientName;
        schedules[idx].date = date;
        schedules[idx].time = time;
        schedules[idx].type = service;
        schedules[idx].status = "pending"; // status otomatis berubah menjadi pending
        schedules[idx].doctor = "Dokter (Menunggu Konfirmasi)";

        localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedules));
        
        closeRescheduleModal();
        showToast("Jadwal Anda berhasil diatur ulang (Status: Pending)");
        renderSchedule();
    }
}

// Event penutup modal background luar
const reschModal = document.getElementById("reschedule-modal");
if (reschModal) {
    reschModal.addEventListener("click", function(e) {
        if (e.target === this) closeRescheduleModal();
    });
}

function showToast(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast-message";
    
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span class="toast-text">${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Inisialisasi awal render
renderSchedule();