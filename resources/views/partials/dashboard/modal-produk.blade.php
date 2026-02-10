<div id="modalForm" class="modal-overlay">
    <div class="modal-box">
        <div class="modal-header">
            <h3 id="modalTitle">Tambah Produk</h3>
            <button id="closeModal" style="background:none; border:none; font-size:24px; cursor:pointer;">&times;</button>
        </div>

        <form id="productForm">
            <input type="hidden" id="productId">

            <div class="modal-body">
                <div class="form-group full-width">
                    <label>Nama Produk</label>
                    <input type="text" id="inputNama" required placeholder="Contoh: Nasi Goreng">
                </div>
                {{-- SKU --}}
                <div id="skuField" class="form-group full-width">
                    <label>SKU</label>
                    <input
                        type="text"
                        id="inputSKU"
                        class="form-control"
                        placeholder="Contoh: SKU-001"
                    >
                </div>
                
                <div id="gambarField" class="form-group">
                    <label>Gambar Produk</label>
                    <div class="" style="display:flex; gap:12px">
                        <div id="imagePreviewContainer" style="with:auto, margin-bottom: 10px; display: none;">
                            <img id="imagePreview" src="" alt="Preview"
                                style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd;">
                        </div>
                        <div class="">
                            <input type="file" id="inputImage" accept="image/*">
                            <small style="color: #6B7280; font-size: 12px; margin-top: 4px;">Format: JPG, PNG, WEBP</small>
                        </div>
                    </div>
                </div>

                <div id="statusField" class="form-group">
                    <label>Status</label>
                    <div class="toggle-wrap">
                        <label class="switch">
                            <input type="checkbox" id="inputStatus" checked>
                            <span class="slider"></span>
                        </label>
                        <span id="statusLabel">Aktif</span>
                    </div>
                </div>

                <div class="form-group">
                    <label>Kategori</label>
                    <select id="inputKategori" required>
                        <option value="">Pilih Kategori</option>
                        <option value="Makanan">Makanan</option>
                        <option value="Minuman">Minuman</option>
                        <option value="Snack">Snack</option>
                    </select>
                </div>

                <div id="variantField" class="form-group">
                    <label>Punya Variant?</label>
                    <div class="toggle-wrap">
                        <label class="switch">
                            <input type="checkbox" id="inputVariant">
                            <span class="slider"></span>
                        </label>
                        <span id="variantLabel">Tidak</span>
                    </div>
                </div>
                <div id="hppField" class="form-group">
                    <label>Harga Awal (Rp)</label>
                    <input type="number" id="inputHpp">
                    <small style="color: var(--text-sub); font-size: 11px;">*Harga modal/dasar</small>
                </div>
                <div class="form-group full-width">
                    <label>Deskripsi</label>
                    <textarea id="inputDesc" rows="3" placeholder="Tulis deskripsi produk di sini..."
                        style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; resize: vertical; font-family: inherit;"></textarea>
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" id="btnBatal" class="btn-outline">Batal</button>
                <button type="submit" id="btnSimpan" class="btn-primary">Simpan</button>
            </div>
        </form>
    </div>
</div>
