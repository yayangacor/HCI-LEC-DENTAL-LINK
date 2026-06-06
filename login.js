// Ganti bagian <script> di dalam login.html dengan kode ini:

// Seeding akun demo jika belum ada di localStorage
(function seedDemoAccounts() {
    const demoUsers = [
        {
            id: "demo-pasien-id",
            role: "pasien",
            name: "Sarah Connor",
            email: "pasien@demo.com",
            password: "password123"
        },
        {
            id: "demo-dokter-id",
            role: "dokter",
            name: "Dr. Smith",
            email: "dokter@demo.com",
            password: "password123",
            clinic: "Dental Care Plus - Senopati",
            location: "Jakarta Selatan"
        }
    ];

    let users = JSON.parse(localStorage.getItem('dentalLinkUsers')) || [];
    demoUsers.forEach(demoUser => {
        if (!users.some(u => u.email === demoUser.email)) {
            users.push(demoUser);
        }
    });
    localStorage.setItem('dentalLinkUsers', JSON.stringify(users));
})();

let currentRole = 'pasien';

function setRole(role) {
    currentRole = role;
    const btnPasien = document.getElementById('btn-pasien');
    const btnDokter = document.getElementById('btn-dokter');

    // Reset error jika ganti tab
    const errorBox = document.getElementById('loginError');
    if(errorBox) errorBox.style.display = 'none';

    if (role === 'pasien') {
        btnPasien.classList.add('active');
        btnPasien.classList.remove('inactive');
        btnDokter.classList.remove('active');
        btnDokter.classList.add('inactive');
    } else {
        btnDokter.classList.add('active');
        btnDokter.classList.remove('inactive');
        btnPasien.classList.remove('active');
        btnPasien.classList.add('inactive');
    }
}

function togglePassword() {
    const input = document.getElementById('passwordInput');
    const icon = document.getElementById('eyeIcon');
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    }
}

// Tambahkan elemen error text di dalam HTML login (di atas tombol submit) jika belum ada.
// Contoh: <div id="loginError" style="color:red; font-size:13px; text-align:center; margin-bottom:15px; display:none;"></div>

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Buat/ambil elemen error dynamically jika belum ditambahkan di HTML
    let errorBox = document.getElementById('loginError');
    if (!errorBox) {
        errorBox = document.createElement('div');
        errorBox.id = 'loginError';
        errorBox.style.cssText = 'color: #ef4444; font-size: 13px; font-weight: 600; text-align: center; margin-bottom: 16px; background-color: #fef2f2; padding: 10px; border-radius: 12px; display: none;';
        this.insertBefore(errorBox, this.querySelector('.submit-btn'));
    }
    
    errorBox.style.display = 'none';

    const email = document.querySelector('input[type="email"]').value;
    const password = document.getElementById('passwordInput').value;

    // Ambil data users dari LocalStorage
    const users = JSON.parse(localStorage.getItem('dentalLinkUsers')) || [];

    // Cari User yang Cocok
    const matchedUser = users.find(u => 
        u.email === email && 
        u.password === password && 
        u.role === currentRole
    );

    if (matchedUser) {
        const btn = e.target.querySelector('.submit-btn');
        btn.innerHTML = '<i class="fa-solid fa-circle-notch loading-icon"></i> Memverifikasi...';
        btn.disabled = true;

        // Simpan sesi aktif ke localStorage
        localStorage.setItem('activeUser', JSON.stringify({
            name: matchedUser.name,
            role: matchedUser.role,
            email: matchedUser.email
        }));

        setTimeout(() => {
            if (currentRole === 'pasien') {
                window.location.href = 'dashboard.html';
            } else {
                window.location.href = 'dashboard2.html';
            }
        }, 1000);
    } else {
        // Tampilkan pesan gagal
        errorBox.textContent = "Email, Kata Sandi, atau Peran (Pasien/Dokter) salah!";
        errorBox.style.display = 'block';
    }
});

function loginDemo(role) {
    const email = role === 'pasien' ? 'pasien@demo.com' : 'dokter@demo.com';
    const password = 'password123';

    setRole(role);

    document.getElementById('emailInput').value = email;
    document.getElementById('passwordInput').value = password;

    // Trigger form submit
    setTimeout(() => {
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }, 100);
}