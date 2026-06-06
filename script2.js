const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const grid = document.getElementById("calendar-grid");

let html = "";

// Render header hari
html += days.map(day => `
  <div class="calendar-day-header">
    ${day}
  </div>
`).join("");

// Render tanggal 1 sampai 31
for (let i = 1; i <= 31; i++) {
  const today = i === 24;

  html += `
    <div class="calendar-cell ${today ? 'today' : ''}">
      <span class="${today ? 'day-number today-active' : 'day-number'}">
        ${i}
      </span>

      ${today ? `
        <div class="event-list">
          <div class="event-badge event-emerald">
            09:00 Sarah C.
          </div>
          <div class="event-badge event-blue">
            10:30 John D.
          </div>
          <div class="event-badge event-rose">
            13:00 Rachel Z.
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

grid.innerHTML = html;