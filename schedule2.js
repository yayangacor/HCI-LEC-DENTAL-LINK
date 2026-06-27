const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const grid = document.getElementById("calendar-grid");

let html = "";

html += days.map(day => `
  <div class="calendar-day-header">
    ${day}
  </div>
`).join("");

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

document.addEventListener("DOMContentLoaded", function () {
    const hamburgerToggle = document.getElementById("hamburger-toggle");
    const sidebar = document.querySelector(".sidebar");
    
    const overlay = document.createElement("div");
    overlay.className = "sidebar-overlay";
    document.body.appendChild(overlay);

    function toggleSidebar() {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("show");
    }

    if (hamburgerToggle) {
        hamburgerToggle.addEventListener("click", toggleSidebar);
    }

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