<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kassia - Manajemen Kategori</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="{{ asset('css/category.css') }}">
    <style>
        /* Simple Navbar Style untuk Demo ini */
        .navbar { display: flex; justify-content: space-between; align-items: center; padding: 15px 30px; background: #fff; border-bottom: 1px solid #e6e4dc; }
        .logo { display: flex; align-items: center; font-weight: 700; font-size: 1.2rem; color: #2f2f2a; }
        .logo img { height: 35px; margin-right: 10px; }
        .search-bar { background: #fffef9; padding: 8px 15px; border-radius: 20px; border: 1px solid #e6e4dc; display: flex; align-items: center; width: 300px; }
        .search-bar input { border: none; background: transparent; margin-left: 10px; outline: none; width: 100%; }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="logo">
            <img src="{{ asset('asset/img/kassia-logo-transparent.webp') }}" alt="Kassia">
            <span>Kassia</span>
        </div>
        <div class="search-bar">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Search...">
        </div>
    </nav>

    <main class="container">
        
        <div class="page-header">
            <h1>Manajemen Kategori</h1>
            <button class="btn-primary" id="addCategoryBtn">
                <i class="fa-solid fa-plus"></i> Tambah Kategori
            </button>
        </div>

        <div class="content-grid">
            <div class="card category-sidebar">
                <div class="list-header">Daftar Kategori</div>
                <ul class="category-list" id="categoryListContainer">
                    <li class="cat-item">Loading categories...</li>
                </ul>
            </div>

            <div class="table-wrapper">
                <div class="table-container">
                    <div style="margin-bottom: 15px; color: #8b7e66; font-size: 0.9rem;" id="tableInfoText">
                        Showing all entries
                    </div>
                   <div class="table-responsive">
                <table class="inventory-table">
                    <thead>
                        <tr>
                            <th>Produk</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="productTableBody">
                        </tbody>
                </table>
            </div>

                    <div class="pagination-container">
                        <div class="pagination-info" id="paginationInfo">Showing 0 of 0</div>
                        <div class="pagination-controls">
                            <button id="btnPrev" class="btn-page" disabled><i class="fa-solid fa-chevron-left"></i> Prev</button>
                            <button id="btnNext" class="btn-page" disabled>Next <i class="fa-solid fa-chevron-right"></i></button>
                        </div>
                    </div>
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
                                <i class="fa-solid fa-minus"></i> Kurang (Terpakai)
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
                <button id="saveBtn" class="btn-primary"><i class="fa-solid fa-floppy-disk"></i> Simpan</button>
            </div>
        </div>
    </div>

    <script src="{{ asset('js/dashboard/category/category.js') }}"></script>
</body>
</html>