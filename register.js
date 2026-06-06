let currentRole = 'pasien';

function setRole(role) {
    currentRole = role;
    
    const btnPasien = document.getElementById('btn-pasien');
    const btnDokter = document.getElementById('btn-dokter');
    const doctorFields = document.getElementById('doctor-fields');
    const clinicInput = document.getElementById('clinicInput');
    const locationInput = document.getElementById('locationInput');

    // Reset error message
    document.getElementById('errorMessage').style.display = 'none';

    if (role === 'pasien') {
        btnPasien.classList.add('active');
        btnPasien.classList.remove('inactive');
        btnDokter.classList.remove('active');
        btnDokter.classList.add('inactive');
        
        doctorFields.style.display = 'none';
        clinicInput.required = false;
        locationInput.required = false;
    } else {
        btnDokter.classList.add('active');
        btnDokter.classList.remove('inactive');
        btnPasien.classList.remove('active');
        btnPasien.classList.add('inactive');
        
        doctorFields.style.display = 'block';
        clinicInput.required = true;
        locationInput.required = true;
    }
}

function togglePassword(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

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

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const errorBox = document.getElementById('errorMessage');
    errorBox.style.display = 'none';

    // Get input values
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    const confirmPassword = document.getElementById('confirmPasswordInput').value;
    
    // Validasi Password Match
    if (password !== confirmPassword) {
        errorBox.textContent = "Kata sandi tidak cocok!";
        errorBox.style.display = 'block';
        return;
    }

    // Ambil Data yang sudah ada di LocalStorage
    let users = JSON.parse(localStorage.getItem('dentalLinkUsers')) || [];

    // Validasi Email Unik
    const emailExists = users.some(user => user.email === email);
    if (emailExists) {
        errorBox.textContent = "Email ini sudah terdaftar!";
        errorBox.style.display = 'block';
        return;
    }

    // Susun Data User Baru (JSON Format)
    const newUser = {
        id: Date.now().toString(),
        role: currentRole,
        name: name,
        email: email,
        password: password // Dalam real app harus di-hash (misal bcrypt)
    };

    if (currentRole === 'dokter') {
        newUser.clinic = document.getElementById('clinicInput').value;
        newUser.location = document.getElementById('locationInput').value;
    }

    // Tambahkan dan Simpan ke LocalStorage
    users.push(newUser);
    localStorage.setItem('dentalLinkUsers', JSON.stringify(users));

    // UI Loading State
    const btn = e.target.querySelector('.submit-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch loading-icon"></i> Mendaftar...';
    btn.disabled = true;

    // Simulasi loading API & Redirect
    setTimeout(() => {
        alert('Pendaftaran Berhasil! Silakan masuk menggunakan akun Anda.');
        window.location.href = 'login.html';
    }, 1500);
});