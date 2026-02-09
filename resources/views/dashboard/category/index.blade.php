<!-- Konten -->
 @extends('layouts.main-dashboard')

@section('css')
 <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    
    <link rel="stylesheet" href="{{ asset('css/category.css') }}">
   
@endsection
<!-- section Konten -->
 @section('content')
 
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
                                    <th>SKU</th> <th>Actions</th>
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

 @endsection

 @section('js')
 <script src="{{ asset('js/dashboard/category/category.js') }}"></script>
 @endsection
    
