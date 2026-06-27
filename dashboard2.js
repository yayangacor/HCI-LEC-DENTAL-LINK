const patients = [
{
id: "PT-8472",
name: "Sarah Connor",
time: "09:00 AM",
procedure: "Root Canal",
status: "In Waiting Room"
},
{
id: "PT-3921",
name: "John Doe",
time: "09:30 AM",
procedure: "Cleaning",
status: "Confirmed"
},
{
id: "PT-1054",
name: "Mike Ross",
time: "10:00 AM",
procedure: "Checkup",
status: "Confirmed"
},
{
id: "PT-2210",
name: "Rachel Zane",
time: "10:30 AM",
procedure: "Extraction",
status: "Completed"
}
];

const table = document.getElementById("active-patients-list");

table.innerHTML = patients.map(p => {
const isWaiting = p.status.includes('Waiting');
const indicatorClass = isWaiting ? 'indicator-green' : 'indicator-yellow';

return `
<tr class="patient-row">
<td>
<div class="patient-info-wrapper">
<div class="patient-initial-circle">
${p.name.charAt(0)}
</div>
<div>
<p class="patient-name">${p.name}</p>
<p class="patient-id">ID: ${p.id}</p>
</div>
</div>
</td>
<td class="patient-time">${p.time}</td>
<td>
<span class="procedure-tag">${p.procedure}</span>
</td>
<td>
<div class="status-container">
<div class="status-indicator ${indicatorClass}"></div>
<span class="status-label">${p.status}</span>
</div>
</td>
<td class="text-right">
<button class="btn-view-record">Lihat Rekam</button>
</td>
</tr>
`;
}).join("");

const hamburgerToggle = document.getElementById("hamburger-toggle");
const sidebar = document.querySelector(".sidebar");

if (hamburgerToggle && sidebar) {
    let overlay = document.querySelector(".sidebar-overlay");
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.className = "sidebar-overlay";
        document.body.appendChild(overlay);
    }

    function toggleSidebar() {
        sidebar.classList.toggle("active");
        overlay.classList.toggle("show");
    }

    hamburgerToggle.addEventListener("click", function(e) {
        e.preventDefault();
        toggleSidebar();
    });

    overlay.addEventListener("click", toggleSidebar);

    const navLinks = document.querySelectorAll(".sidebar-nav .nav-item");
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (sidebar.classList.contains("active")) {
                toggleSidebar();
            }
        });
    });
}