const schedules = [
  {
    id: "APP-001",
    date: "24 Mei 2024",
    time: "09:00 WIB",
    doctor: "Dr. Smith",
    clinic: "Dental Care Plus - Senopati",
    type: "Perawatan Saluran Akar (Kunjungan 2)",
    status: "upcoming"
  },
  {
    id: "APP-002",
    date: "10 Apr 2024",
    time: "14:30 WIB",
    doctor: "Dr. Jane Doe",
    clinic: "Smile & Shine Clinic",
    type: "Pembersihan Karang Gigi",
    status: "completed"
  },
  {
    id: "APP-003",
    date: "18 Mei 2024",
    time: "11:00 WIB",
    doctor: "Dr. Alan Grant",
    clinic: "Klinik Gigi Keluarga Sehat",
    type: "Konsultasi Tambal Gigi",
    status: "upcoming"
  }
];

function renderSchedule() {
  const container = document.getElementById("schedule-list");
  
  container.innerHTML = schedules.map(sch => {
    const isUpcoming = sch.status === "upcoming";
    const dateParts = sch.date.split(' ');
    const month = dateParts[1];
    const day = dateParts[0];

    return `
      <div class="schedule-card ${isUpcoming ? 'upcoming' : 'completed'}">
        <div class="schedule-main-info">
          
          <div class="date-badge ${isUpcoming ? 'upcoming' : 'completed'}">
            <span class="date-month">${month}</span>
            <span class="date-day">${day}</span>
          </div>

          <div class="detail-container">
            <div class="meta-row">
              <p class="time-text">
                <i class="fa-regular fa-clock"></i>
                ${sch.time}
              </p>
              <span class="status-badge ${isUpcoming ? 'upcoming' : 'completed'}">
                ${isUpcoming ? 'Akan Datang' : 'Selesai'}
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

        ${isUpcoming ? `
          <div class="action-buttons">
            <button onclick="showToast('Berhasil melakukan reschedule janji temu')" class="btn-secondary">
              Reschedule
            </button>
            <button onclick="showToast('Kehadiran berhasil dikonfirmasi')" class="btn-accent">
              Siap Hadir
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

// Inisialisasi awal
renderSchedule();