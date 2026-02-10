

/**
 * ============================================================================
 * 2. MAIN
 * ============================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
    // ================= STATE =================
    const isIndexPage = document.getElementById("tableBody") !== null;
    if (!isIndexPage) return;
    
    let originalData = []; // ⬅️ penting utk modal edit produk
    let categories = [];
    
    fetchCategories();
    fetchProductList();

    // ================= FETCH CATEGORIES =================
    async function fetchCategories() {
        const res = await fetch(API_CATEGORIES, { headers: authHeader() });
        const json = await res.json();
        if (!json.statusCode === 200) {
            throw new Error(json.result?.errorMessage || "API Error");
        }

        categories = json.result.data;

        renderCategorySelect(categories);
    }

    /**
     * =========================================================================
     * 3. INDEX PAGE (LIST PRODUK + MODAL EDIT PRODUK)
     * =========================================================================
     */
    async function fetchProductList() {
        try {
            const res = await fetch(`${API_PRODUCTS}?sort_by=created_at&order=desc`, { headers: authHeader() });
            const json = await res.json();
            if (json.statusCode !== 200) throw new Error(json.result.errorMessage);

            originalData = json.result.data;
            initIndexPage(originalData);

        } catch (err) {
            console.error(err);
            document.getElementById("tableBody").innerHTML =
                `<tr><td colspan="5" style="text-align:center;color:red">${err.message}</td></tr>`;
        }
    }

    function renderCategorySelect(categories) {
        const selectEdit = document.getElementById("inputKategori");
        const selectCategoryTable = document.getElementById("categoryFilter");
        if (!selectEdit && !selectCategoryTable) return;

        // reset option, jaga placeholder tetap ada
        selectEdit.innerHTML = `<option value="">Pilih Kategori</option>`;
        selectCategoryTable.innerHTML = `<option value="">Semua Kategori</option>`;
        
        categories.forEach(cat => {
            const option1 = document.createElement("option");
            const option2 = document.createElement("option");
            option1.value = cat.id;      // penting: pakai id
            option2.value = cat.id;      // penting: pakai id
            option1.textContent = cat.name;
            option2.textContent = cat.name;
            selectEdit.appendChild(option1);
            selectCategoryTable.appendChild(option2);
        });
    }
    
    function initIndexPage(dataList) {
        const tableBody = document.getElementById("tableBody");
        
        let isEditMode = false;
       
        // Modal Elements
        const modal = document.getElementById("modalForm");
        const modalTitle = document.getElementById("modalTitle");
        const btnTambah = document.getElementById("btnTambah");
        const btnClose = document.getElementById("closeModal");
        const btnBatal = document.getElementById("btnBatal");
        const productForm = document.getElementById("productForm");

        // Input Form
        const inputId = document.getElementById("productId");
        const inputNama = document.getElementById("inputNama");
        const inputSKU = document.getElementById("inputSKU");
        const inputHPP = document.getElementById("inputHpp");
        const skuField = document.getElementById("skuField");
        const statusField = document.getElementById("statusField");
        const variantField = document.getElementById("variantField");
        const hppField = document.getElementById("hppField");
        const inputKategori = document.getElementById("inputKategori");
        const inputDesc = document.getElementById("inputDesc");
        const inputStatus = document.getElementById("inputStatus");
        const inputVariant = document.getElementById("inputVariant");
        const statusLabel = document.getElementById("statusLabel");
        const variantLabel = document.getElementById("variantLabel");
        const imagePreview = document.getElementById("imagePreview");
        const previewContainer = document.getElementById("imagePreviewContainer");
        
        function showModal() {
            modal.classList.add("open");
            modal.style.display = "flex";

            if (!inputVariant || !skuField) return;

            const toggleSkuField = () => {
                if (isEditMode) {
                    skuField.classList.add('hidden');
                    hppField.classList.add('hidden');
                }else{
                    skuField.classList.toggle('hidden', inputVariant.checked);
                    hppField.classList.toggle('hidden', inputVariant.checked);
                    variantLabel.textContent = inputVariant.checked ? "Punya" : "Tidak";
                }
            };
            const toggleStatus = () => {
                statusLabel.textContent = inputVariant.checked ? "Aktif" : "Tidak";
            }

            toggleSkuField();
            inputVariant.addEventListener('change', toggleSkuField);
            inputStatus.addEventListener('change', toggleStatus);
            
        }

        function hideModal() {
            modal.classList.remove("open");
            modal.style.display = "none";
        }

        function resetForm() {
            if (productForm) productForm.reset();
            if (inputId) inputId.value = "";
            if (imagePreview) imagePreview.src = "";
            if (previewContainer) previewContainer.style.display = "none";
            if (inputStatus) inputStatus.checked = true;
            if (inputVariant) inputVariant.checked = false;
            if (statusLabel) statusLabel.textContent = "Aktif";
            if (variantLabel) statusLabel.textContent = "Tidak";
        }

        if (btnTambah)
            btnTambah.addEventListener("click", () => {
                resetForm();
                isEditMode = false;
                statusField.classList.add('hidden');
                variantField.classList.remove('hidden');
                hppField.classList.remove('hidden');
                if (modalTitle) modalTitle.textContent = "Tambah Produk";
                showModal();
            });

        if (btnClose) btnClose.addEventListener("click", hideModal);
        if (btnBatal) btnBatal.addEventListener("click", hideModal);

        // ===== EDIT PRODUK (UNCHANGED BEHAVIOR) =====
        window.openEditProduct = function (id) {
            const product = originalData.find(p => p.id === id);
            if (!product) return;

            productForm.reset();
            isEditMode = true;
            modalTitle.textContent = "Edit Produk";
            
            if (isEditMode) {
                variantField.classList.add('hidden');
                statusField.classList.remove('hidden');
                hppField.classList.add('hidden');
            }
            inputId.value = product.id;
            inputNama.value = product.name;
            inputDesc.value = product.description || "";
            
            productCatId = categories.find(cat => cat.name === product.categories[0]);
            if (inputKategori && product.categories)
                inputKategori.value = productCatId.id;
            
            inputStatus.checked = product.is_active === true;
            statusLabel.textContent = inputStatus.checked ? "Aktif" : "Nonaktif";

            if (product.image?.url) {
                imagePreview.src = product.image.url;
                previewContainer.style.display = "block";
            }

            showModal();
        };

        if (productForm) {
            productForm.addEventListener("submit", async function (e) {
                e.preventDefault();

                const productId = inputId.value;
                const formData = new FormData();

                if (isEditMode) {
                    formData.append("name", inputNama.value);
                    formData.append("description", inputDesc.value);
                    formData.append("categories[0]", inputKategori.value);
                    formData.append("is_active", inputStatus.checked ? 1 : 0);
    
                    console.log(formData);
                    // const imageInput = document.getElementById("inputImage");
                    // if (imageInput && imageInput.files.length > 0) {
                    //     formData.append("image", imageInput.files[0]);
                    // }
                }else {
                    formData.append("name", inputNama.value);
                    formData.append("description", inputDesc.value);
                    formData.append("categories[0]", inputKategori.value);
                    formData.append("sku", inputSKU.value);
                    formData.append("harga_awal", inputHPP.value);
                    formData.append("is_variant", inputVariant.checked ? 1 : 0);

                    // const imageInput = document.getElementById("inputImage");
                    // if (imageInput && imageInput.files.length > 0) {
                    //     formData.append("image", imageInput.files[0]);
                    // }
                }

                let url = API_PRODUCTS;

                if (isEditMode && productId) {
                    url = `${API_PRODUCTS}/${productId}`;
                    formData.append("_method", "PATCH"); 
                    // kalau backend Laravel pakai method spoofing
                }

                try {
                    const res = await fetch(url, {
                        method: "POST",
                        headers: {
                            Authorization: `bearer ${TOKEN}`,
                        },
                        body: formData,
                    });

                    const json = await res.json();

                    console.log(json);

                    // === GENERAL RESPONSE HANDLING ===
                    if (json.statusCode >= 400) {
                        console.log(json.result?.errors || "Terjadi kesalahan");
                        return;
                    }

                    hideModal();
                    fetchProductList(); // fungsi existing lu
                } catch (err) {
                    console.error(err);
                    console.log("Gagal terhubung ke server");
                }
            });
        }
        // ===== RENDER TABLE (MINIMAL CHANGE: DATA SOURCE REAL) =====
        function renderTable(data) {
            tableBody.innerHTML = "";

            if (!data.length) {
                tableBody.innerHTML =
                    `<tr><td colspan="5" style="text-align:center">Data kosong</td></tr>`;
                return;
            }

            data.forEach(item => {
                const isActive = item.is_active;
                const statusBadge = isActive
                    ? `<span class="badge badge-active"><span class="dot bg-green"></span> Aktif</span>`
                    : `<span class="badge badge-inactive"><span class="dot bg-gray"></span> Nonaktif</span>`;

                // --- PERBAIKAN STOK UNDEFINED DISINI ---
                // Menggunakan item.total_stock sesuai JSON, bukan current_stock
                const stockCount =
                    item.total_stock !== undefined ? item.total_stock : 0;
                const dotStock = stockCount > 0 ? "bg-green" : "bg-red";

                const sku = item.variants?.[0]?.sku || "-";
                const img = item.image?.url || "/asset/img/products/no_image.jpg";
                const category = item.categories?.[0] || "-";

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>
                        <div class="product-cell">
                            <img src="${img}" class="product-img">
                            <div class="product-info">
                                <h4>${item.name}</h4>
                                <small>${sku}</small>
                            </div>
                        </div>
                    </td>
                    <td>${category}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span class="dot ${dotStock}"></span>
                            <strong>${stockCount}</strong>
                        </div>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-outline"
                                onclick="window.location.href='/dashboard/products/${item.id}'">
                                Detail
                            </button>
                            <button class="btn-outline"
                                onclick="openEditProduct('${item.id}')">
                                Edit
                            </button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }

        renderTable(dataList);
    }
});
