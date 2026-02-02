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

                <div class="form-group">
                    <label>Gambar Produk</label>

                    <div id="imagePreviewContainer" style="margin-bottom: 10px; display: none;">
                        <img id="imagePreview" src="" alt="Preview"
                            style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd;">
                    </div>

                    <input type="file" id="inputImage" accept="image/*">
                    <small style="color: #6B7280; font-size: 12px; margin-top: 4px;">Format: JPG, PNG, WEBP (Klik Edit
                        untuk ganti)</small>
                </div>

                <div class="form-group">
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

                <div class="form-group">
                    <label>Harga (Rp)</label>
                    <input type="number" id="inputHarga" required placeholder="0">
                </div>
            </div>

            <div class="modal-footer">
                <button type="button" id="btnBatal" class="btn-outline">Batal</button>
                <button type="submit" id="btnSimpan" class="btn-primary">Simpan</button>
            </div>
        </form>
    </div>
</div>
