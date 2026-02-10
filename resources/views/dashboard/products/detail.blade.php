<!-- Extends -->
@extends('layouts.main-dashboard')

<!-- CSS -->
@section('css')
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<link rel="stylesheet" href="{{ asset('css/product/style.css') }}">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700&display=swap"rel="stylesheet">
<style>
        /* Fallback CSS agar tab tidak numpuk jika CSS eksternal delay */
        .tab-content {
            display: none;
        }

        .tab-content.active-content {
            display: block;
            animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(5px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
@endsection


    
<!-- Konten -->
@section('content')
<div class="prod-header-card">
            <div class="prod-info-wrapper">
                <img src="/asset/img/products/no_image.jpg" alt="Produk" class="prod-main-img">
                <div class="prod-text-details">
                    <h1 class="prod-title">Memuat...</h1>
                </div>
            </div>

            <div class="prod-actions">
                <button class="btn-outline" onclick='deleteProduct(@json($productId), event)'>
                    <i class="fa-regular fa-trash-can"></i> Hapus
                </button>
                <button class="btn-primary" onclick='openEditProduct(@json($productId))'>
                    <i class="fa-regular fa-pen-to-square"></i> Edit Produk
                </button>
            </div>
        </div>

        <div class="tabs-wrapper">
            <div class="tabs">
                <a href="#" class="tab-link active" onclick="switchTab(event, 'info')">Info Produk</a>
                <a href="#" class="tab-link" onclick="switchTab(event, 'gallery')">Galeri</a>
                <a href="#" class="tab-link" onclick="switchTab(event, 'variant')">Varian</a>
                <a href="#" class="tab-link" onclick="switchTab(event, 'stock')">Stok</a>
                <a href="#" class="tab-link" onclick="switchTab(event, 'history')">Riwayat</a>
            </div>
        </div>

        <main id="tab-info" class="card tab-content">
            <h3><i class="fa-regular fa-file-lines"></i> Informasi Dasar</h3>
            <div class="info-grid">
                <div class="info-group">
                    <label>Nama Produk</label>
                    <p id="detailName">-</p>
                </div>
                <div class="info-group">
                    <label>Kategori</label>
                    <p id="detailCategory">-</p>
                </div>
                <div class="info-group">
                    <label>Punya Variant?</label>
                    <p id="isVariant">-</p>
                </div>
                <!-- <div class="info-group">
                    <label>Dimensi (PxLxT)</label>
                    <p id="detailDim">-</p>
                </div> -->
                <div class="info-group full-width">
                    <label>Deskripsi Lengkap</label>
                    <p id="detailDesc">-</p>
                </div>
            </div>
        </main>

        <main id="tab-variant" class="card tab-content" style="display: none;">
            <div class="card-header-row"
                style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h3><i class="fa-solid fa-tags"></i> Daftar Varian</h3>
                <button class="btn-sm btn-primary" onclick="openVariantModal()">
                    <i class="fa-solid fa-plus"></i> Varian Baru
                </button>
            </div>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Nama Varian</th>
                            <th>SKU</th>
                            <th>Stok Saat Ini</th>
                            <th>Status</th>
                            <th style="text-align: right;">Aksi</th>
                        </tr>
                    </thead>
                    <tbody id="variantTableBody">
                    </tbody>
                </table>
            </div>
        </main>

        <main id="tab-stock" class="card tab-content" style="display: none;">
            <h3><i class="fa-solid fa-warehouse"></i> Posisi Stok Gudang</h3>
            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>SKU / Varian</th>
                            <th>Total Stok</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="stockTableBody">
                    </tbody>
                </table>
            </div>
        </main>

        <main id="tab-gallery" class="card tab-content" style="display: none;">
            <h3><i class="fa-regular fa-images"></i> Galeri Produk</h3>

            <div id="galleryGrid" class="gallery-grid">
            </div>

            <div
                style="margin-top: 24px; text-align: center; border: 2px dashed #e5e7eb; padding: 30px; border-radius: 12px; background: #f9fafb;">
                <i class="fa-solid fa-cloud-arrow-up" style="font-size: 32px; color: #9ca3af; margin-bottom: 10px;"></i>
                <p style="font-size: 14px; color: var(--text-sub); margin-bottom: 15px;">Drag & Drop gambar di sini atau
                    klik tombol di bawah</p>
                <input type="file" id="inputGalleryUpload" style="display: none;" accept="image/*">
                <button class="btn-outline" onclick="document.getElementById('inputGalleryUpload').click()">Pilih
                    Gambar</button>
            </div>
        </main>

        <main id="tab-history" class="card tab-content" style="display: none;">
            <h3><i class="fa-solid fa-clock-rotate-left"></i> Riwayat Perubahan Stok</h3>

            <div class="table-responsive">
                <table>
                    <thead>
                        <tr>
                            <th>Tanggal & Waktu</th>
                            <th>SKU Varian</th>
                            <th style="color: var(--success-text);">Stok Masuk</th>
                            <th style="color: var(--error-text);">Stok Keluar</th>
                            <th>Total Stok (Akhir)</th>
                            <th>Keterangan</th>
                        </tr>
                    </thead>
                    <tbody id="historyTableBody">
                    </tbody>
                </table>
            </div>
        </main>
    </div>
    <div id="modalVariant" class="modal-overlay" style="display: none;">
        <div class="modal-box">
            <div class="modal-header">
                <h3>Tambah Varian</h3>
                <button onclick="closeVariantModal()"
                    style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
            </div>
            <form id="variantForm">
                <div class="modal-body">
                    <div class="form-group full-width">
                        <label>Nama Varian</label>
                        <input type="text" id="varName" placeholder="Contoh: Merah, XL" required>
                    </div>
                    <div class="form-group full-width">
                        <label>SKU Varian</label>
                        <input type="text" id="varSku" placeholder="" required>
                    </div>
                    <div class="form-group full-width">
                        <label>Deskripsi Varian</label>
                        <textarea id="varDesc" rows="2" placeholder="Keterangan singkat varian ini..."
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px;"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Harga Awal (Rp)</label>
                        <input type="number" id="varHargaAwal" placeholder="0" required>
                        <small style="color: var(--text-sub); font-size: 11px;">*Harga modal/dasar</small>
                    </div>
                    <div class="form-group">
                        <label>Min. Stock Alert</label>
                        <input type="number" id="varMinStock" value="0" required>
                        <small style="color: var(--text-sub); font-size: 11px;">*Batas notifikasi stok
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn-outline" onclick="closeVariantModal()">Batal</button>
                    <button type="submit" class="btn-primary">Simpan</button>
                </div>
            </form>
        </div>
    </div>

    <div id="modalEditVariant" class="modal-overlay" style="display: none;">
        <div class="modal-box">
            <div class="modal-header">
                <h3>Edit Detail Varian</h3>
                <button onclick="closeEditVariantModal()"
                    style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
            </div>
            <form id="editVariantForm">
                <input type="hidden" id="editVarId">

                <div class="modal-body">
                    <div class="form-group full-width">
                        <label>Nama Varian</label>
                        <input type="text" id="editVarName" required placeholder="Contoh: Jumbo / Pedas">
                    </div>

                    <div class="form-group full-width">
                        <label>Deskripsi Varian</label>
                        <textarea id="editVarDesc" rows="2" placeholder="Keterangan singkat varian ini..."
                            style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px;"></textarea>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label>Harga Awal (Rp)</label>
                            <input type="number" id="editVarHargaAwal" required>
                            <small style="color: var(--text-sub); font-size: 11px;">*Harga modal/dasar</small>
                        </div>
                        <div class="form-group">
                            <label>Min. Stock Alert</label>
                            <input type="number" id="editVarMinStock" required>
                            <small style="color: var(--text-sub); font-size: 11px;">*Batas notifikasi stok
                                tipis</small>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Status Varian</label>
                        <div class="toggle-wrap">
                            <label class="switch">
                                <input type="checkbox" id="editVarStatus">
                                <span class="slider"></span>
                            </label>
                            <span id="editVarStatusLabel">Aktif</span>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn-outline" onclick="closeEditVariantModal()">Batal</button>
                    <button type="submit" class="btn-primary">Simpan Perubahan</button>
                </div>
            </form>
        </div>
    </div>

@include('partials.dashboard.modal-produk')

@endsection
        
<!-- JS-->
@section('js')
    <script>
        const productId = @json($productId)
    </script>
    <script src="{{ asset('js/dashboard/product/product-common.js') }}"></script>
    <script src="{{ asset('js/dashboard/product/fetch-detail-product.js') }}"></script>
    {{-- <script src="{{ asset('js/dashboard/product/script.js') }}"></script> --}}
@endsection
