const upper = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
const lower = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];

function renderJaw(data, id) {
    const container = document.getElementById(id);

    container.innerHTML += data.map(num => `
        <div onclick="selectTooth(${num})" id="tooth-${num}" class="tooth-item">
            <span class="tooth-num">${num}</span>
            <div class="tooth-box">
                <div class="tooth-grid">
                    <div class="tooth-part"></div>
                    <div class="tooth-part"></div>
                    <div class="tooth-part"></div>
                    <div class="tooth-part"></div>
                </div>
            </div>
        </div>
    `).join("");
}

// Inisialisasi render gigi
renderJaw(upper, "upper-jaw");
renderJaw(lower, "lower-jaw");

function selectTooth(num) {
    // Menghapus state terpilih (selected) dari semua gigi
    document.querySelectorAll(".tooth-box").forEach(box => {
        box.classList.remove("selected");
    });

    // Menambahkan state terpilih (selected) ke gigi yang diklik
    const selected = document.querySelector(`#tooth-${num} .tooth-box`);
    if (selected) {
        selected.classList.add("selected");
    }

    // Mengubah judul catatan
    document.getElementById("note-title").innerText = `Catatan Detail - Gigi ${num}`;

    // Mengubah placeholder catatan dan set fokus
    const noteInput = document.getElementById("tooth-note");
    noteInput.placeholder = `Masukkan observasi medis untuk gigi nomor ${num}...`;
    noteInput.focus();
}