const upper = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lower = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

const LOCAL_TEETH_KEY = "dental_link_sarah_teeth";
const LOCAL_NOTES_KEY = "dental_link_sarah_notes";

let activePatientName = "";
let selectedToothNum = null;
let teethData = {};
let notesData = {};

function loadSarahOdontogramData() {
    let localTeeth = localStorage.getItem(LOCAL_TEETH_KEY);
    let localNotes = localStorage.getItem(LOCAL_NOTES_KEY);

    if (localTeeth) {
        teethData = JSON.parse(localTeeth);
    } else {
        teethData = {};
        [...upper, ...lower].forEach(num => {
            teethData[num] = 'healthy';
        });
        localStorage.setItem(LOCAL_TEETH_KEY, JSON.stringify(teethData));
    }

    if (localNotes) {
        notesData = JSON.parse(localNotes);
    } else {
        notesData = {};
    }
}

// Helper untuk mengekstrak tipe status dasar jika diawali prefix "custom:"
function getToothBaseStatus(statusString) {
    if (statusString && statusString.startsWith("custom:")) {
        return "custom";
    }
    return statusString || 'healthy';
}

function renderJaw(data, id) {
    const container = document.getElementById(id);
    const line = container.querySelector('.jaw-line');
    container.innerHTML = '';
    if (line) container.appendChild(line);

    container.innerHTML += data.map(num => {
        const rawStatus = teethData[num] || 'healthy';
        const status = getToothBaseStatus(rawStatus);
        const isSelected = selectedToothNum === num ? 'selected' : '';
        
        let innerGrid = `
            <div class="tooth-grid">
                <div class="tooth-part"></div>
                <div class="tooth-part"></div>
                <div class="tooth-part"></div>
                <div class="tooth-part"></div>
            </div>
        `;

        if (status === 'missing') {
            innerGrid = `<i class="fa-solid fa-xmark tooth-x-mark"></i>`;
        } else if (status === 'bridge') {
            innerGrid = `
                <div class="tooth-bridge-bar"></div>
                <div class="tooth-grid">
                    <div class="tooth-part"></div>
                    <div class="tooth-part"></div>
                </div>
            `;
        }

        return `
            <div onclick="selectTooth(${num})" id="tooth-${num}" class="tooth-item">
                <span class="tooth-num">${num}</span>
                <div class="tooth-box status-${status} ${isSelected}">
                    ${innerGrid}
                </div>
            </div>
        `;
    }).join("");
}

function openPatientOdontogram(patientName) {
    if (patientName === "Sarah Connor") {
        activePatientName = patientName;
        loadSarahOdontogramData();
        
        document.getElementById("patient-selection-screen").classList.add("hidden");
        document.getElementById("odontogram-main-screen").classList.remove("hidden");
        
        renderJaw(upper, "upper-jaw");
        renderJaw(lower, "lower-jaw");
        
        selectTooth(18);
        showToast("Rekam medis Sarah Connor berhasil dibuka.");
    }
}

function backToPatientSelection() {
    document.getElementById("odontogram-main-screen").classList.add("hidden");
    document.getElementById("patient-selection-screen").classList.remove("hidden");
    selectedToothNum = null;
    activePatientName = "";
}

function showLockedNotification(patientName) {
    showToast(`Pasien ${patientName} adalah dummy. Hanya Sarah Connor yang aktif dalam demo ini.`, "warning");
}

function selectTooth(num) {
    selectedToothNum = num;

    document.querySelectorAll(".tooth-box").forEach(box => {
        box.classList.remove("selected");
    });

    const selected = document.querySelector(`#tooth-${num} .tooth-box`);
    if (selected) {
        selected.classList.add("selected");
    }

    document.getElementById("note-title").innerText = `Catatan Detail Gigi ${num}`;
    document.getElementById("tooth-selected-indicator").innerText = `Gigi ${num}`;

    const currentNote = notesData[num] || "";
    const noteInput = document.getElementById("tooth-note");
    noteInput.value = currentNote;
    noteInput.placeholder = `Masukkan observasi klinis medis khusus untuk gigi nomor ${num}...`;

    // Menghapus kelas 'active-status' dari semua tombol selector kondisi
    document.querySelectorAll(".status-option-btn").forEach(btn => {
        btn.classList.remove("active-status");
    });

    const rawStatus = teethData[num] || 'healthy';
    const statusBase = getToothBaseStatus(rawStatus);

    const customWrapper = document.getElementById("custom-status-wrapper");
    const customInput = document.getElementById("custom-status-text");

    // Efek menyala hijau pada kondisi terpilih (Glow Active Class)
    if (statusBase === "custom") {
        document.getElementById("opt-custom").classList.add("active-status");
        customWrapper.classList.remove("hidden");
        
        // Memasukkan teks custom yang ada jika ada
        const customValue = rawStatus.startsWith("custom:") ? rawStatus.substring(7) : "";
        customInput.value = customValue;
    } else {
        const targetBtn = document.getElementById(`opt-${statusBase}`);
        if (targetBtn) {
            targetBtn.classList.add("active-status");
        }
        customWrapper.classList.add("hidden");
        customInput.value = "";
    }

    updateLiveDescription(num);
}

function updateLiveDescription(num) {
    const rawStatus = teethData[num] || 'healthy';
    const statusBase = getToothBaseStatus(rawStatus);
    const descBox = document.getElementById("live-desc-box");
    
    let label = "";
    let cssClass = "";
    let desc = "";

    switch(statusBase) {
        case 'caries':
            label = "Caries / Karies";
            cssClass = "status-caries";
            desc = "Gigi mengalami pembusukan atau terdapat lubang aktif yang membutuhkan penambalan segera.";
            break;
        case 'filled':
            label = "Filled / Ditambal";
            cssClass = "status-filled";
            desc = "Gigi telah berhasil ditambal secara komposit/semen ionomer kaca dan dalam kondisi stabil.";
            break;
        case 'missing':
            label = "Missing / Hilang";
            cssClass = "status-missing";
            desc = "Gigi telah dicabut sepenuhnya melalui tindakan bedah atau ekstraksi konvensional.";
            break;
        case 'bridge':
            label = "Bridge / Jembatan";
            cssClass = "status-bridge";
            desc = "Gigi dipasangi penyangga jembatan prostetik untuk menggantikan kehilangan gigi di sebelahnya.";
            break;
        case 'custom':
            const customLabelText = rawStatus.startsWith("custom:") ? rawStatus.substring(7) : "Diagnosis Khusus";
            label = `Custom: ${customLabelText}`;
            cssClass = "status-custom";
            desc = "Kondisi klinis khusus yang dikustomisasi secara spesifik oleh dokter pemeriksa.";
            break;
        default:
            label = "Healthy / Sehat";
            cssClass = "status-healthy";
            desc = "Gigi dalam keadaan sehat, mahkota gigi utuh, dan tidak memiliki karies aktif.";
    }

    descBox.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
            <div>Status Gigi ${num}: <strong class="live-condition-title ${cssClass}">${label}</strong></div>
            <p style="font-size: 11px; opacity: 0.9; font-weight: normal; margin-top: 2px;">${desc}</p>
        </div>
    `;
}

function setToothStatus(status) {
    if (!selectedToothNum) {
        showToast("Silakan pilih gigi terlebih dahulu pada bagan di atas!");
        return;
    }

    const customWrapper = document.getElementById("custom-status-wrapper");
    const customInput = document.getElementById("custom-status-text");

    if (status === 'custom') {
        customWrapper.classList.remove("hidden");
        const initVal = customInput.value.trim() || "Deskripsi Custom";
        teethData[selectedToothNum] = "custom:" + initVal;
        customInput.focus();
    } else {
        customWrapper.classList.add("hidden");
        teethData[selectedToothNum] = status;
    }

    localStorage.setItem(LOCAL_TEETH_KEY, JSON.stringify(teethData));
    
    renderJaw(upper, "upper-jaw");
    renderJaw(lower, "lower-jaw");
    
    selectTooth(selectedToothNum);

    let statusLabel = status.toUpperCase();
    if (status === 'custom') {
        const val = customInput.value.trim() || "DESKRIPSI CUSTOM";
        showToast(`Status gigi ${selectedToothNum} telah diubah menjadi CUSTOM (${val})`);
    } else {
        showToast(`Status gigi ${selectedToothNum} telah diubah menjadi ${statusLabel}`);
    }
}

// Menyimpan input custom deskripsi saat diketik dokter
function saveCustomStatus() {
    if (!selectedToothNum) return;
    const customInput = document.getElementById("custom-status-text");
    const val = customInput.value.trim() || "Deskripsi Custom";
    
    teethData[selectedToothNum] = "custom:" + val;
    localStorage.setItem(LOCAL_TEETH_KEY, JSON.stringify(teethData));
    
    updateLiveDescription(selectedToothNum);
    
    renderJaw(upper, "upper-jaw");
    renderJaw(lower, "lower-jaw");

    const selected = document.querySelector(`#tooth-${selectedToothNum} .tooth-box`);
    if (selected) {
        selected.classList.add("selected");
    }
}

// Fungsi Submit Catatan Spesifik (Sesuai Permintaan)
function submitToothNote() {
    if (!selectedToothNum) {
        showToast("Silakan pilih gigi terlebih dahulu pada bagan di atas!", "error");
        return;
    }

    const noteInput = document.getElementById("tooth-note");
    const val = noteInput.value;
    
    notesData[selectedToothNum] = val;
    localStorage.setItem(LOCAL_NOTES_KEY, JSON.stringify(notesData));

    showToast(`Catatan klinis pada gigi ${selectedToothNum} berhasil disimpan.`);
}

function useClinicalTemplate() {
    if (!selectedToothNum) {
        showToast("Pilih salah satu gigi terlebih dahulu!");
        return;
    }

    const rawStatus = teethData[selectedToothNum] || 'healthy';
    const currentStatus = getToothBaseStatus(rawStatus);
    let templateText = "";

    switch(currentStatus) {
        case 'caries':
            templateText = `[PEMERIKSAAN GIGI ${selectedToothNum}]\n- Karies media pada bagian oklusal gigi.\n- Perkusi: Negatif, Palpasi: Negatif.\n- Rencana Perawatan: Preparasi kavitas diikuti penambalan resin komposit sinar (light-cured composite). Palasi fluroda lokal pasca-tindakan.`;
            break;
        case 'filled':
            templateText = `[EVALUASI GIGI ${selectedToothNum}]\n- Restorasi resin komposit terpasang dengan baik.\n- Batas marginal adaptasi restorasi rapat, tidak ada kebocoran marginal (microleakage).\n- Oklusi stabil, tidak ada keluhan sekunder atau hipersensitivitas dari pasien.`;
            break;
        case 'missing':
            templateText = `[KONDISI GIGI ${selectedToothNum}]\n- Riwayat pencabutan karena nekrosis pulpa / impaksi gigi.\n- Soket ekstraksi telah sembuh sempurna tanpa tanda-tanda dry socket.\n- Rencana Rehabilitatif: Disarankan pemasangan implan gigi tunggal atau gigi tiruan jembatan (bridge).`;
            break;
        case 'bridge':
            templateText = `[PROSTETIK GIGI ${selectedToothNum}]\n- Gigi berfungsi sebagai abutment/pontic bridge prostetik.\n- Retensi sangat baik, integrasi jaringan periodontal gingiva sehat.\n- Pasien diinstruksikan menjaga kebersihan interdental dengan superfloss.`;
            break;
        case 'custom':
            const descText = rawStatus.startsWith("custom:") ? rawStatus.substring(7) : "diagnosis khusus";
            templateText = `[PEMERIKSAAN KHUSUS GIGI ${selectedToothNum}]\n- Ditemukan kondisi klinis berupa: ${descText}.\n- Dilakukan tes vitalitas termal (sensibilitas) dan palpasi area gingiva sekitar.\n- Rencana Perawatan: Observasi berkala dan terapi penunjang simtomatik.`;
            break;
        default:
            templateText = `[PEMERIKSAAN GIGI ${selectedToothNum}]\n- Gigi dalam kondisi sehat, oklusi ideal.\n- Akumulasi plak minimal, kalkulus tidak ditemukan.\n- Tindakan: Profilaksis rutin (scaling) seluruh kuadran mulut untuk menjaga higienitas periodontal.`;
    }

    const noteInput = document.getElementById("tooth-note");
    noteInput.value = templateText;
    
    // Kita biarkan dokter menyunting template dulu sebelum menekan "Simpan Catatan"
    noteInput.focus();
    showToast(`Template medis berhasil dipasang pada Gigi ${selectedToothNum}! Silakan klik Simpan Catatan.`);
}

function submitPrescription() {
    const rxName = document.getElementById("rx-name").value.trim();
    const rxQty = document.getElementById("rx-quantity").value.trim();
    const rxFreq = document.getElementById("rx-frequency").value.trim();

    if (!rxName || !rxQty || !rxFreq) {
        showToast("Mohon isi field bertanda bintang (*) untuk memberikan resep obat!", "error");
        return;
    }

    showToast(`Resep obat [${rxName} - Qty: ${rxQty}] berhasil dikirim ke sistem!`);

    document.getElementById("rx-name").value = "";
    document.getElementById("rx-quantity").value = "";
    document.getElementById("rx-frequency").value = "";
    document.getElementById("rx-notes").value = "";
}

function showToast(message, type = "success") {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.className = "toast-item";
    
    let iconClass = "fa-circle-check text-emerald-500";
    if (type === "warning") iconClass = "fa-triangle-exclamation text-amber-500";
    if (type === "error") iconClass = "fa-circle-xmark text-red-500";

    toast.innerHTML = `
        <i class="fa-solid ${iconClass} text-xl"></i>
        <span class="toast-text">${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
        toast.remove();
    }, 3000);
}