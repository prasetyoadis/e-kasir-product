<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Detail Produk</title>
    <link rel="stylesheet" href="{{ asset('css/product/style.css') }}">
    <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700&display=swap"
        rel="stylesheet">
</head>

<body>

    <nav class="topbar">
        <div class="brand">
            <img src="{{ asset('asset/img/kassia-outline-transparent.webp') }}" alt="Logo" class="brand-icon">
            <img src="{{ asset('asset/img/kassia-bg-trans.webp') }}" alt="Kassia" class="brand-text">
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
                    <h1 class="prod-title">Memuat...</h1>
                    <div class="prod-meta">
                        <span class="status-pill active">Aktif</span>
                    </div>
                </div>
            </div>
            <div class="prod-actions">
                <div class="stock-counter">
                    <span class="label">Total Stok</span>
                    <span class="value" id="headerTotalStock">0</span>
                </div>
                <button class="btn-primary">Edit Produk</button>
            </div>
        </header>

        <nav class="tab-navigation">
            <a href="#" class="tab-link active" onclick="switchTab(event, 'info')">Info Produk</a>
            <a href="#" class="tab-link" onclick="switchTab(event, 'gambar')">Gambar</a>
            <a href="#" class="tab-link" onclick="switchTab(event, 'varian')">Varian</a>
            <a href="#" class="tab-link" onclick="switchTab(event, 'stok')">Stok</a>
            <a href="#" class="tab-link" onclick="switchTab(event, 'history')">Histori Stok</a>
        </nav>

        <main id="tab-info" class="card tab-content" style="display: flex; flex-direction: column;">
            <div class="info-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="info-group">
                    <label style="color: #666; font-size: 14px;">Nama Produk</label>
                    <p id="detailName" style="font-weight: 600; font-size: 16px; color: #000;">Memuat...</p>
                </div>
                <div class="info-group">
                    <label style="color: #666; font-size: 14px;">Kategori</label>
                    <p id="detailCategory" style="font-weight: 600;">-</p>
                </div>
                <div class="info-group full-width" style="grid-column: span 2;">
                    <label style="color: #666; font-size: 14px;">Deskripsi</label>
                    <p id="detailDesc" style="line-height: 1.6;">-</p>
                </div>
                <div class="info-group">
                    <label style="color: #666; font-size: 14px;">Berat</label>
                    <p id="detailWeight">-</p>
                </div>
                <div class="info-group">
                    <label style="color: #666; font-size: 14px;">Dimensi</label>
                    <p id="detailDim">-</p>
                </div>
            </div>
        </main>

        <main id="tab-gambar" class="card tab-content" style="display: none;">
            <div class="gallery-header">
                <h3>Galeri Produk</h3>
                <button class="btn-primary" onclick="document.getElementById('inputGalleryUpload').click()">+ Upload
                    Gambar</button>
                <input type="file" id="inputGalleryUpload" hidden multiple accept="image/*">
            </div>
            <div id="galleryGrid" class="gallery-grid"></div>
        </main>

        <main id="tab-varian" class="card tab-content" style="display: none;">
            <div class="gallery-header">
                <h3>Daftar Varian</h3>
                <button class="btn-primary" onclick="openVariantModal()">+ Tambah Varian</button>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Nama Varian</th>
                            <th>Harga</th>
                            <th>SKU</th>
                            <th>Stok Total</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="variantTableBody"></tbody>
                </table>
            </div>
        </main>

        <main id="tab-stok" class="card tab-content" style="display: none;">
            <div class="gallery-header">
                <h3>Lokasi Stok</h3>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Lokasi Gudang</th>
                            <th>Varian</th>
                            <th>Jumlah</th>
                            <th>Posisi Rak</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="stockTableBody"></tbody>
                </table>
            </div>
        </main>

        <main id="tab-history" class="card tab-content" style="display: none;">
            <h3>Riwayat Perubahan Stok</h3>
            <div id="historyTimeline" class="history-timeline"></div>
        </main>

    </div>

    <div class="modal-overlay" id="modalVariant">
        <div class="modal-box">
            <div class="modal-header">
                <h3 id="modalVariantTitle">Tambah Varian</h3>
                <button class="btn-outline" style="border:none; width:auto;" onclick="closeVariantModal()">✕</button>
            </div>
            <form id="variantForm">
                <div class="modal-body">
                    <input type="hidden" id="variantId">
                    <div class="form-group full-width">
                        <label>Nama Varian</label>
                        <input type="text" id="varName" required>
                    </div>
                    <div class="form-group">
                        <label>Harga (Rp)</label>
                        <input type="number" id="varPrice" required>
                    </div>
                    <div class="form-group">
                        <label>SKU Varian</label>
                        <input type="text" id="varSku">
                    </div>
                    <div class="form-group">
                        <label>Stok Awal</label>
                        <input type="number" id="varStock" value="0">
                    </div>
                    <div class="form-group">
                        <label>Status</label>
                        <div class="toggle-wrap">
                            <label class="switch">
                                <input type="checkbox" id="varStatus" checked>
                                <span class="slider"></span>
                            </label>
                            <span id="varStatusLabel">Aktif</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-outline" onclick="closeVariantModal()">Batal</button>
                    <button type="submit" class="btn-primary">Simpan</button>
                </div>
            </form>
        </div>
    </div>

    <script src="{{ asset('js/dashboard/product/script.js') }}"></script>
</body>

</html>
