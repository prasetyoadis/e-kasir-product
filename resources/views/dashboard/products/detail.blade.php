<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Detail Produk</title>
    <link rel="stylesheet" href="{{ asset('css/product/style.css') }}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

    <style>
        /* CSS Inline untuk memastikan Tab bekerja jika CSS eksternal bermasalah */
        .tab-content {
            display: none;
        }

        /* Sembunyikan semua tab secara default */
        .tab-content.active-content {
            display: flex;
            flex-direction: column;
        }
    </style>
</head>

<body>

    <nav class="topbar">
        <div class="brand">
            <img src="{{ asset('asset/img/kassia-logo-transparent.webp') }}" alt="Kassia" style="height: 30px;">
        </div>
        <div class="global-search">
            <input type="text" placeholder="Cari produk...">
        </div>
    </nav>

    <div class="container">

        <header class="prod-header-card">
            <div class="prod-info-wrapper">
                <img src="https://via.placeholder.com/80" alt="Produk" class="prod-main-img">
                <div class="prod-text-details">
                    <h1 class="prod-title">Memuat Data...</h1>
                    <div class="prod-meta">
                        <span class="prod-subtitle">SKU: -</span>
                        <span class="stock-text"> | Total Stok: <strong id="headerTotalStock">0</strong></span>
                    </div>
                </div>
            </div>
            <div class="header-actions">
                <button class="btn-outline">Hapus</button>
                <button class="btn-primary">Edit Produk</button>
            </div>
        </header>

        <div class="tabs-wrapper">
            <div class="tabs">
                <a href="#" class="tab-link active" onclick="switchTab(event, 'info')">Info Produk</a>
                <a href="#" class="tab-link" onclick="switchTab(event, 'variant')">Varian & Harga</a>
                <a href="#" class="tab-link" onclick="switchTab(event, 'stock')">Stok & Lokasi</a>
                <a href="#" class="tab-link" onclick="switchTab(event, 'gallery')">Galeri</a>
            </div>
        </div>

        <main id="tab-info" class="card tab-content">
            <h3>Informasi Dasar</h3>
            <div class="info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="info-group">
                    <label style="color:#666; font-size:13px;">Nama Produk</label>
                    <p id="detailName" style="font-weight:600;">-</p>
                </div>
                <div class="info-group">
                    <label style="color:#666; font-size:13px;">Kategori</label>
                    <p id="detailCategory" style="font-weight:600;">-</p>
                </div>
                <div class="info-group full-width" style="grid-column: span 2;">
                    <label style="color:#666; font-size:13px;">Deskripsi</label>
                    <p id="detailDesc" style="font-weight:600;">-</p>
                </div>
            </div>
        </main>

        <main id="tab-variant" class="card tab-content" style="display: none;">
            <div class="card-header-row"
                style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3>Daftar Varian</h3>
                <button class="btn-sm btn-outline" onclick="openVariantModal()">+ Varian Baru</button>
            </div>
            <div class="table-responsive">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="text-align: left; background: #f9fafb;">
                            <th style="padding: 10px;">Nama Varian</th>
                            <th style="padding: 10px;">SKU</th>
                            <th style="padding: 10px;">Stok</th>
                            <th style="padding: 10px;">Status</th>
                            <th style="padding: 10px;">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="variantTableBody">
                    </tbody>
                </table>
            </div>
        </main>

        <main id="tab-stock" class="card tab-content" style="display: none;">
            <h3>Posisi Stok</h3>
            <div class="table-responsive">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="text-align: left; background: #f9fafb;">
                            <th style="padding: 10px;">SKU</th>
                            <th style="padding: 10px;">Total Stok</th>
                            <th style="padding: 10px;">Status</th>
                        </tr>
                    </thead>
                    <tbody id="stockTableBody">
                    </tbody>
                </table>
            </div>
        </main>

        <main id="tab-gallery" class="card tab-content" style="display: none;">
            <h3>Galeri Produk</h3>
            <div id="galleryGrid" style="display: flex; gap: 15px; flex-wrap: wrap;">
            </div>
        </main>

    </div>
    <div id="modalVariant" class="modal-overlay"
        style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 999; justify-content: center; align-items: center;">
        <div class="modal-box" style="background: #fff; padding: 25px; border-radius: 12px;">
            <h3>Kelola Varian</h3>
            <form id="variantForm">
                <p>Form Varian (Demo)</p>
                <div style="margin-top: 15px; text-align: right;">
                    <button type="button" onclick="closeVariantModal()">Tutup</button>
                </div>
            </form>
        </div>
    </div>

    <script src="{{ asset('js/dashboard/product/script.js') }}"></script>
</body>

</html>
