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
{ name: "Root Canal", price: "Rp 800.000" }
]
}
];

let currentClinicName = "";

function renderDashboard() {
const container = document.getElementById("clinics-container");
container.innerHTML = clinics.map(clinic => `
<div onclick="openModal(${clinic.id})" class="clinic-card">
<div class="clinic-image-wrapper">
<img src="${clinic.image}" alt="${clinic.name}">
<div class="clinic-distance">
<i class="fa-solid fa-location-arrow text-emerald-500"></i>
${clinic.distance}
</div>
</div>
<div class="clinic-content">
<div>
<h4 class="clinic-name">${clinic.name}</h4>
<div class="clinic-rating">
<i class="fa-solid fa-star"></i>
${clinic.rating}
</div>
</div>
<button class="btn-card">Lihat Info & Biaya</button>
</div>
</div>
`).join("");
}

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

const modal = document.getElementById("clinic-modal");
modal.classList.add("show");
}

function closeModal() {
const modal = document.getElementById("clinic-modal");
modal.classList.remove("show");
}

function toggleChat() {
closeModal();
const chatWidget = document.getElementById("chat-widget");
chatWidget.classList.add("show");
document.getElementById("chat-clinic-name").innerText = currentClinicName;

const messages = document.getElementById("chat-messages");
if (messages.children.length === 0) {
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

messages.innerHTML += `
<div class="chat-msg-sent">${text}</div>
`;

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

function makeAppointment() {
closeModal();
showToast(`Berhasil memulai proses Janji Temu untuk ${currentClinicName}`);
setTimeout(() => {
window.location.href = "schedule.html";
}, 1200);
}

document.getElementById("clinic-modal").addEventListener("click", function(e) {
if (e.target === this) {
closeModal();
}
});

renderDashboard();