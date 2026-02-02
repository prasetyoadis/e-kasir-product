<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Manajemen Produk - Kassia</title>
    <link rel="stylesheet" href="{{ asset('css/product/style.css') }}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>

<body>

    <nav class="topbar">
        <div class="brand">
            <img src="{{ asset('asset/img/kassia-logo-transparent.webp') }}" alt="Logo" class="brand-icon">

            <img src="{{ asset('asset/img/kassia-bg-trans.webp') }}" alt="Kassia" class="brand-text">
        </div>
        <div class="global-search">
            <input type="text" placeholder="Global search..." disabled style="cursor: not-allowed; opacity: 0.6;">
        </div>
    </nav>

    <div class="container">

        <header class="page-header">
            <h1 class="page-title">Daftar Produk</h1>
            <div class="header-actions">
                <input type="text" id="searchInput" class="table-search" placeholder="Cari nama produk...">
                <button id="btnTambah" class="btn-primary">
                    <span>+</span> Tambah Produk
                </button>
            </div>
        </header>

        <main class="card">

            <div class="filter-bar">
                <select id="categoryFilter" class="filter-select">
                    <option value="">Semua Kategori</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Minuman">Minuman</option>
                    <option value="Snack">Snack</option>
                </select>
            </div>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Produk</th>
                            <th>Kategori</th>
                            <th>Harga</th>
                            <th>Status</th>
                            <th>Stok</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                    </tbody>
                </table>
            </div>

            <div class="pagination">
                <span id="pageInfo">Showing 0 of 0 entries</span>

                <div class="pagination-controls">
                    <div class="page-nav">
                        <button id="btnPrev">&lt;</button>
                        <button id="btnNext">&gt;</button>
                    </div>

                    <div class="pagination-input-group">
                        <span>Go to page:</span>
                        <input type="number" id="gotoPageInput" class="page-input" min="1">
                        <button id="btnGo" class="btn-outline" style="padding: 6px 10px;">Go</button>
                    </div>
                </div>
            </div>

        </main>
    </div>

    @include('partials.dashboard.products.modal-produk')

    <script src="{{ asset('js/dashboard/product/script.js') }}"></script>
</body>

</html>
