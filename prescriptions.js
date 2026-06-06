const prescriptions = [
    {
        date: "10 Apr 2024",
        doctor: "Dr. Jane Doe",
        meds: [
            {
                name: "Amoxicillin 500mg",
                dose: "3x sehari sesudah makan (Habiskan)"
            },
            {
                name: "Ibuprofen 400mg",
                dose: "3x sehari jika nyeri"
            }
        ]
    },
    {
        date: "15 Des 2023",
        doctor: "Dr. Smith",
        meds: [
            {
                name: "Chlorhexidine Mouthwash",
                dose: "Kumur 2x sehari setelah sikat gigi"
            }
        ]
    },
    {
        date: "20 Nov 2023",
        doctor: "Dr. Alan Grant",
        meds: [
            {
                name: "Paracetamol 500mg",
                dose: "2x sehari sesudah makan"
            },
            {
                name: "Vitamin C",
                dose: "1x sehari"
            }
        ]
    }
];

function renderPrescriptions() {
    const container = document.getElementById("prescription-list");
    
    container.innerHTML = prescriptions.map(pres => `
        <div class="prescription-card">
            <div>
                <div class="pres-header">
                    <div class="pres-icon-box">
                        <i class="fa-solid fa-file-prescription"></i>
                    </div>
                    <div>
                        <p class="pres-date">${pres.date}</p>
                        <p class="pres-doctor">Diresepkan oleh ${pres.doctor}</p>
                    </div>
                </div>

                <ul class="meds-list">
                    ${pres.meds.map(med => `
                        <li>
                            <div class="med-item-wrapper">
                                <span class="med-name">${med.name}</span>
                                <span class="med-dose">${med.dose}</span>
                            </div>
                        </li>
                    `).join("")}
                </ul>
            </div>

            <div class="card-actions">
                <button onclick="showToast('Mengunduh PDF preskripsi')" class="btn-download">
                    <i class="fa-solid fa-download"></i>
                    Unduh PDF
                </button>
                <button onclick="showToast('Membuka detail resep')" class="btn-detail">
                    <i class="fa-solid fa-eye"></i>
                    Detail
                </button>
            </div>
        </div>
    `).join("");
}

function showToast(message) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    
    toast.className = "toast";
    toast.innerHTML = `
        <i class="fa-solid fa-circle-check"></i>
        <span>${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Render data saat halaman dimuat
renderPrescriptions();