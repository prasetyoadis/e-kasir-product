document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // 1. DEFINISI ELEMENT (SELEKTOR)
    // ==========================================

    // Sidebar Elements
    const btnSidebarToggle = document.getElementById("btnSidebarToggle"); // Tombol Garis Tiga di Header
    const sidebar = document.getElementById("mainSidebar"); // Sidebar itu sendiri
    const overlay = document.getElementById("sidebarOverlay"); // Layar hitam
    const btnCloseSidebar = document.getElementById("btnCloseSidebar"); // Tombol X di dalam Sidebar

    // Notification Elements
    const btnNotif = document.getElementById("btnNotifToggle");
    const dropdownNotif = document.getElementById("notifDropdown");
    const badge = document.querySelector(".notif-badge");
    const btnMarkRead = document.querySelector(".mark-read");

    // Profile Elements
    const btnProfile = document.getElementById("btnProfileToggle");
    const dropdownProfile = document.getElementById("profileDropdown");

    // ==========================================
    // 2. LOGIKA SIDEBAR
    // ==========================================
    function toggleSidebar() {
        if (sidebar && overlay) {
            sidebar.classList.toggle("active");
            overlay.classList.toggle("active");
        }
    }

    // Event: Buka Sidebar (Klik Hamburger)
    if (btnSidebarToggle) {
        btnSidebarToggle.addEventListener("click", function (e) {
            e.stopPropagation(); // Mencegah event bubbling
            toggleSidebar();
        });
    }

    // Event: Tutup Sidebar (Klik Overlay Hitam)
    if (overlay) {
        overlay.addEventListener("click", toggleSidebar);
    }

    // Event: Tutup Sidebar (Klik Tombol X)
    if (btnCloseSidebar) {
        btnCloseSidebar.addEventListener("click", toggleSidebar);
    }

    // ==========================================
    // 3. LOGIKA DROPDOWN (NOTIFIKASI & PROFIL)
    // ==========================================

    // Toggle Dropdown Notifikasi
    if (btnNotif && dropdownNotif) {
        btnNotif.addEventListener("click", function (e) {
            e.stopPropagation();
            // Tutup profil jika sedang terbuka agar tidak tumpang tindih
            if (dropdownProfile) dropdownProfile.classList.remove("active");
            dropdownNotif.classList.toggle("active");
        });
    }

    // Toggle Dropdown Profil
    if (btnProfile && dropdownProfile) {
        btnProfile.addEventListener("click", function (e) {
            e.stopPropagation();
            // Tutup notifikasi jika sedang terbuka
            if (dropdownNotif) dropdownNotif.classList.remove("active");
            dropdownProfile.classList.toggle("active");
        });
    }

    // Global Click (Tutup dropdown jika klik sembarang tempat)
    document.addEventListener("click", function (e) {
        // Cek klik di luar Notifikasi
        if (dropdownNotif && btnNotif) {
            if (
                !dropdownNotif.contains(e.target) &&
                !btnNotif.contains(e.target)
            ) {
                dropdownNotif.classList.remove("active");
            }
        }

        // Cek klik di luar Profil
        if (dropdownProfile && btnProfile) {
            if (
                !dropdownProfile.contains(e.target) &&
                !btnProfile.contains(e.target)
            ) {
                dropdownProfile.classList.remove("active");
            }
        }

        // Catatan: Sidebar tidak ditutup lewat sini karena sudah dihandle overlay
    });

    // ==========================================
    // 4. LOGIKA BADGE NOTIFIKASI
    // ==========================================
    function updateNotificationBadge() {
        const unreadCount =
            document.querySelectorAll(".notif-item.unread").length;
        if (badge) {
            // Tampilkan titik merah jika ada yang unread
            badge.style.display = unreadCount > 0 ? "block" : "none";
        }
    }

    // Event: Klik "Tandai dibaca"
    if (btnMarkRead) {
        btnMarkRead.addEventListener("click", function (e) {
            e.preventDefault();
            const unreadItems = document.querySelectorAll(".notif-item.unread");

            // Hapus status unread dari semua item
            unreadItems.forEach((item) => {
                item.classList.remove("unread");
                const dot = item.querySelector(".dot-unread");
                if (dot) dot.remove();
            });

            // Update badge (hilangkan titik merah)
            updateNotificationBadge();
        });
    }

    // Jalankan cek badge saat halaman dimuat
    updateNotificationBadge();
});
