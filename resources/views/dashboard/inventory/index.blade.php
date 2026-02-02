<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kassia - Stock Overview</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('css/iventory.css') }}">
</head>
<body>

    <nav class="navbar">
        <div class="logo">
            <img src="../asset/img/kassia-logo-transparent.webp" alt="Kassia Logo" class="logo-img">
            <span>Kassia</span>
        </div>
        <div class="search-bar">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search product...">
        </div>
    </nav>

    <main class="container">
        
        <div class="page-header">
            <h1>Stock Overview</h1>
            <button class="btn-primary">
                <i class="fa-solid fa-plus"></i> Adjustment <i class="fa-solid fa-sliders"></i>
            </button>
        </div>

        <div class="stats-grid">
            <div class="card stat-card">
                <div class="icon-box icon-orange">
                    <i class="fa-solid fa-box-open"></i>
                </div>
                <div class="stat-info">
                    <span class="label">Total Produk</span>
                    <h2 id="total-products">0</h2>
                </div>
            </div>

            <div class="card stat-card bg-yellow-light">
                <div class="icon-box icon-warning">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                </div>
                <div class="stat-info">
                    <span class="label">Stok Menipis</span>
                    <h2 id="low-stock-count" class="text-yellow">0</h2>
                </div>
            </div>

            <div class="card stat-card bg-red-light">
                <div class="icon-box icon-danger">
                    <i class="fa-solid fa-circle-exclamation"></i>
                </div>
                <div class="stat-info">
                    <span class="label">Stok Habis</span>
                    <h2 id="out-stock-count" class="text-red">0</h2>
                </div>
            </div>

            <div class="card daily-stats">
                <div class="stat-row">
                    <span class="text-green"><i class="fa-solid fa-arrow-up"></i> Restock Hari Ini</span>
                    <span class="stat-value text-green">+ 150</span>
                </div>
                <div class="stat-row">
                    <span class="text-red"><i class="fa-solid fa-arrow-down"></i> Pengurangan Hari Ini</span>
                    <span class="stat-value text-red">- 52</span>
                </div>
            </div>
        </div>

        <div class="table-container">
            <div class="table-header-control">
                <h3>Produk</h3>
                <div class="table-filters">
                    <button class="tab-small active">All</button>
                    <button class="tab-small">Low Stock</button>
                    <button class="tab-small">Out of Stock</button>
                    <div class="search-small">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" placeholder="Search product...">
                    </div>
                </div>
            </div>

            <table class="inventory-table">
                <thead>
                    <tr>
                        <th>Produk</th>
                        <th>SKU</th>
                        <th>Stok</th>
                        <th>Min Stok</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="inventory-body">
                    </tbody>
            </table>
             <div class="pagination-container" style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
    <div class="pagination-info" id="pagination-info">
        Showing 0 to 0 of 0 entries
    </div>
    <div class="pagination-controls">
        <button id="btn-prev" class="btn-page" disabled><i class="fa-solid fa-chevron-left"></i> Prev</button>
        <button id="btn-next" class="btn-page">Next <i class="fa-solid fa-chevron-right"></i></button>
    </div>
</div>
        </div>

    </main>
      <div id="adjustModal" class="modal-overlay">
        <div class="modal-container">
            <div class="modal-header">
                <h3>Penyesuaian Stok</h3>
                <button id="closeModalBtn" class="modal-close-btn"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div class="modal-body">
                <div class="product-summary-box">
                    <img id="modalProductImg" src="" alt="Product" class="product-img">
                    <div class="summary-info">
                        <h4 id="modalProductName">Nama Produk</h4>
                        <span id="modalProductSku">SKU-000</span>
                    </div>
                    <div class="current-stock-box">
                        <small>Stok Saat Ini</small>
                        <strong id="modalCurrentStock">0</strong>
                    </div>
                </div>

                <form id="adjustForm">
                    <input type="hidden" id="modalProductId">
                    
                    <div class="form-group">
                        <label>Jenis Penyesuaian</label>
                        <div class="toggle-buttons">
                            <button type="button" class="btn-toggle active" data-type="add">
                                <i class="fa-solid fa-plus"></i> Tambah (Restock)
                            </button>
                            <button type="button" class="btn-toggle" data-type="subtract">
                                <i class="fa-solid fa-minus"></i> Kurang (Terpakai/Rusak)
                            </button>
                            <input type="hidden" id="adjustmentType" value="add">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="adjustAmount">Jumlah</label>
                        <input type="number" id="adjustAmount" class="form-input" min="1" placeholder="Contoh: 10">
                    </div>

                    <div class="form-group">
                        <label for="adjustNote">Catatan (Opsional)</label>
                        <input type="text" id="adjustNote" class="form-input" placeholder="Alasan penyesuaian...">
                    </div>
                </form>
            </div>

            <div class="modal-footer">
                <button id="cancelBtn" class="btn-secondary">Batal</button>
                <button id="saveBtn" class="btn-primary">
                    <i class="fa-solid fa-floppy-disk"></i> Simpan
                </button>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/dashboard/inventory/iventory.js') }}"></script>
</body>
</html>