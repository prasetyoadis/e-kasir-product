<!-- Extends -->
@extends('layouts.main-dashboard')

<!-- CSS -->
@section('css')
<link rel="stylesheet" href="{{ asset('css/product/style.css') }}">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
@endsection


<!-- Konten -->
@section('content')
<div class="page-header">
    <h1 class="page-title">Daftar Produk</h1>
    <div class="header-actions">
        <button id="btnTambah" class="btn-primary">
            <span>+</span> Tambah Produk
        </button>
    </div>
</div>
<div class="card">
    <div class="filter-bar">
        <select id="categoryFilter" class="filter-select">
            <option value="">Semua Kategori</option>
            <option value="Makanan">Makanan</option>
            <option value="Minuman">Minuman</option>
            <option value="Snack">Snack</option>
        </select>
        <input type="text" id="searchInput" class="table-search" placeholder="Cari nama produk...">
    </div>

    <div class="table-responsive">
        <table>
            <thead>
                <tr>
                    <th>Produk</th>
                    <th>Kategori</th>
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
</div>

@include('partials.dashboard.modal-produk')
@endsection

    
<!-- JS-->
@section('js')
    <script src="{{ asset('js/dashboard/product/product-common.js') }}"></script>
    <script src="{{ asset('js/dashboard/product/fetch-product.js') }}"></script>
    {{-- <script src="{{ asset('js/dashboard/product/script.js') }}"></script> --}}
@endsection