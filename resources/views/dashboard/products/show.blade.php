<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Detail Produk - Gambar</title>
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
            <input type="text" placeholder="Type to search...">
        </div>
    </nav>

    <div class="container">

        <header class="prod-header-card">
            <div class="prod-info-wrapper">
                <img src="https://images.unsplash.com/photo-1603133872878-684f571d70f2?w=150" alt="Produk"
                    class="prod-main-img">
                <div class="prod-text-details">
                    <h1 class="prod-title">Sego Njamoer Original</h1>
                    <div class="prod-meta">
                        <span class="sku-badge">SKU: SNJ-SBY-001</span>
                        <span class="status-pill active">Aktif</span>
                    </div>
                    <p class="prod-price">Mulai dari <strong>Rp 15.000</strong></p>
                </div>
            </div>

            <div class="prod-actions">
                <button class="btn-outline">Stok: 50</button>
                <button class="btn-primary">Edit Produk</button>
            </div>
        </header>

        <nav class="tab-navigation">
            <a href="#" class="tab-link">Info Produk</a>
            <a href="#" class="tab-link active">Gambar</a>
            <a href="#" class="tab-link">Varian</a>
            <a href="#" class="tab-link">Stok</a>
            <a href="#" class="tab-link">Histori Stok</a>
        </nav>

        <main class="card gallery-section">
            <div class="gallery-header">
                <h3>Gambar Produk</h3>
                <button class="btn-primary" onclick="document.getElementById('fileInput').click()">
                    <span>+</span> Upload Gambar
                </button>
                <input type="file" id="fileInput" hidden multiple accept="image/*">
            </div>

            <div id="galleryGrid" class="gallery-grid">
            </div>

            <div class="pagination">
                <span>Showing page 1 of 1</span>
                <div class="pagination-controls">
                    <button disabled>&lt;</button>
                    <button class="active">1</button>
                    <button disabled>&gt;</button>
                </div>
            </div>
        </main>

    </div>

    <script src="{{ asset('js/dashboard/product/script.js') }}"></script>
</body>

</html>
