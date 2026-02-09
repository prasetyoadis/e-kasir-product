<div class="sidebar-overlay" id="sidebarOverlay" onclick="toggleSidebar()"></div>

<aside class="popup-sidebar" id="mainSidebar">
    
    <div class="sidebar-header">
        <div class="brand-wrapper">
            <img src="{{ asset('asset/img/kassia-logo-transparent.webp') }}" alt="Kassia">
            <span>KASSIA</span>
        </div>
        <button class="btn-close-sidebar" onclick="toggleSidebar()">
            <i class="fa-solid fa-xmark"></i>
        </button>
    </div>

    <ul class="sidebar-menu">
        
        <li class="menu-category">Main</li>
        <li>
            <a href="/dashboard" class="nav-link {{ Request::is('dashboard') ? 'active' : '' }}">
                <i class="fa-solid fa-gauge-high"></i> Dashboard
            </a>
        </li>

        <li class="menu-category">Inventory & Product</li>
        <li>
            <a href="/product/inventory" class="nav-link {{ Request::is('dashboard/inventory*') ? 'active' : '' }}">
                <i class="fa-solid fa-boxes-stacked"></i> Stock Overview
            </a>
        </li>
        <li>
            <a href="/product/category" class="nav-link {{ Request::is('dashboard/category*') ? 'active' : '' }}">
                <i class="fa-solid fa-tags"></i> Manajemen Kategori
            </a>
        </li>
        <li>
            <a href="/product/list" class="nav-link {{ Request::is('product/list*') ? 'active' : '' }}">
                <i class="fa-solid fa-box-open"></i> Daftar Produk
            </a>
        </li>

        <li class="menu-category">Transaction</li>
        <li>
            <a href="/transaction/cafe" class="nav-link {{ Request::is('transaction/cafe*') ? 'active' : '' }}">
                <i class="fa-solid fa-mug-hot"></i> Kasir Cafe
            </a>
        </li>
        <li>
            <a href="/transaction/pos" class="nav-link {{ Request::is('transaction/pos*') ? 'active' : '' }}">
                <i class="fa-solid fa-cash-register"></i> Kasir POS (Retail)
            </a>
        </li>

        <li class="menu-category">System</li>
        <li>
            <a href="/settings" class="nav-link">
                <i class="fa-solid fa-gear"></i> Settings
            </a>
        </li>
    </ul>

    <div class="sidebar-user-info">
        <i class="fa-solid fa-circle-user" style="font-size: 32px; color: var(--color-earth-brown);"></i>
        <div>
            <div style="font-weight:bold; font-size: 0.95rem;">Administrator</div>
            <div class="logout-link" onclick="window.location.href='/logout'">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
            </div>
        </div>
    </div>

</aside>

<script>
    function toggleSidebar() {
        const sidebar = document.getElementById('mainSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        }
    }
</script>