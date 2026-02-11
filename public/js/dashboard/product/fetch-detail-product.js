import { handleApiError } from '../../errors/handleApiError.js';

/**
 * ============================================================================
 * 1. GLOBAL TAB SWITCHING (UNCHANGED)
 * ============================================================================
 */
window.switchTab = function (event, tabName) {
    if (event) event.preventDefault();

    document.querySelectorAll(".tab-link").forEach(link =>
        link.classList.remove("active")
    );

    if (event) event.currentTarget.classList.add("active");

    document.querySelectorAll(".tab-content").forEach(content => {
        content.style.display = "none";
        content.classList.remove("active-content");
    });

    const target = document.getElementById("tab-" + tabName);
    if (target) {
        target.style.display = "block";
        target.classList.add("active-content");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const isDetailPage = document.querySelector(".prod-title") !== null;
    if (!isDetailPage) return;

    if (!productId) {
        console.warn("productId tidak ditemukan");
        return;
    }
    let productData;
    let categories = [];
    
    fetchCategories();
    fetchProductDetail(productId);

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

    function renderCategorySelect(categories) {
        const selectEdit = document.getElementById("inputKategori");
        if (!selectEdit) return;

        // reset option, jaga placeholder tetap ada
        selectEdit.innerHTML = `<option value="">Pilih Kategori</option>`;
        
        categories.forEach(cat => {
            const option1 = document.createElement("option");
            option1.value = cat.id;      // penting: pakai id
            option1.textContent = cat.name;
            selectEdit.appendChild(option1);
        });
    }
    /**
     * =========================================================================
     * 4. DETAIL PAGE (VARIANT MODAL + AUTO OPEN)
     * =========================================================================
     */
    async function fetchProductDetail(productId) {
        try {
            const res = await fetch(`${API_PRODUCTS}/${productId}`, {
                headers: authHeader(),
            });
            const json = await res.json();
            if (json.statusCode !== 200) throw new Error(json.result.errorMessage);

            productData = json.result.data
            initDetailPage(productData);

        } catch (err) {
            console.error(err);
        }
    }

    function initDetailPage(detailData) {
        document.querySelector(".prod-title").textContent = detailData.name;

        const mainImg = document.querySelector(".prod-main-img");
        const defaultImg =
            detailData.images?.find(i => i.is_default) || detailData.images?.[0];
        if (mainImg && defaultImg) mainImg.src = defaultImg.url;

        document.getElementById("detailName").textContent = detailData.name;
        document.getElementById("detailCategory").textContent =
            detailData.categories?.join(", ") || "-";
        document.getElementById("detailDesc").textContent =
            detailData.description || "-";
        document.getElementById("isVariant").textContent =
            detailData.is_variant ? "Punya" : "Tidak" || "-";
        
        renderVariantTable(detailData.variants || []);
        renderStock(detailData.variants || []);
        renderGallery(detailData.images || []);
        renderHistory(detailData.variants || []);
        initDefaultTab();
    }

    function renderStock(variants) {
        // --- C. Render Tabel Stok ---
        const stockBody = document.getElementById("stockTableBody");
        if (stockBody && variants) {
            stockBody.innerHTML = "";
            variants.forEach((v) => {
                const tr = document.createElement("tr");
                const statusBadge = v.is_active
                    ? `<span class="badge badge-active">Aktif</span>`
                    : `<span class="badge badge-inactive">Nonaktif</span>`;
                tr.innerHTML = `
                    <td style="font-family:monospace">${v.sku || "-"}</td>
                    <td><strong>${v.stock}</strong></td>
                    <td>${statusBadge}</td>
                `;
                stockBody.appendChild(tr);
            });
        }
    }
    function renderGallery(images) {
        const gallery = document.getElementById("galleryGrid");
        if (!gallery) return;

        gallery.innerHTML = "";
        images.forEach(img => {
            const div = document.createElement("div");
            div.className = "img-card";
            div.innerHTML = `
                <div class="img-thumb-wrapper">
                    <img src="${img.url}" class="img-thumb">
                    ${img.is_default ? '<span class="default-badge">Default</span>' : ""}
                </div>
            `;
            gallery.appendChild(div);
        });
    }
    function renderHistory(variants) {
        const historyBody = document.getElementById("historyTableBody");
        if (!historyBody) return;

        historyBody.innerHTML = "";

        variants.forEach(variant => {
            if (!variant.history_stock || variant.history_stock.length === 0) return;

            let runningTotal = variant.stock;

            variant.history_stock.forEach(log => {
                const tr = document.createElement("tr");
                const inClass =
                    log.type === "in"
                        ? "color: var(--success-text); font-weight:bold;"
                        : "color: #ccc;";
                const outClass =
                    log.type === "out"
                        ? "color: var(--error-text); font-weight:bold;"
                        : "color: #ccc;";
                const valIn = log.type === "in" ? `+${log.quantity}` : "-";
                const valOut = log.type === "out" ? `-${log.quantity}` : "-";

                tr.innerHTML = `
                    <td style="color:#666; font-size:13px;">${formatDateTime(log.created_at)}</td>
                    <td style="font-family:monospace; font-weight:600;">${variant.sku || "-"}</td>
                    <td style="${inClass}">${valIn}</td>
                    <td style="${outClass}">${valOut}</td>
                    <td><strong>${log.total}</strong></td>
                    <td style="font-size:13px; color:#555;">${log.type}: ${log.note ?? "-"}</td>
                `;
                
                historyBody.appendChild(tr);
            });
        });

        if (historyBody.children.length === 0) {
            historyBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted">
                        Tidak ada history stok
                    </td>
                </tr>
            `;
        }
    }


    function renderVariantTable(variants) {
        const body = document.getElementById("variantTableBody");
        if (!body) return;

        body.innerHTML = "";
        
        variants.forEach(v => {
            const statusBadge = v.is_active
                    ? `<span class="badge badge-active"><span class="dot bg-green"></span> Aktif</span>`
                    : `<span class="badge badge-inactive"><span class="dot bg-gray"></span> Nonaktif</span>`;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td><strong>${v.variant_name}</strong></td>
                <td>${v.sku || "-"}</td>
                <td>${v.stock ?? 0}</td>
                <td>${statusBadge}</td>
                <td style="text-align:right">
                    <button class="btn-sm btn-outline"
                        onclick="openJualModal('${v.id}')"
                    >
                        Jual
                    </button>
                    <button class="btn-sm btn-outline"
                        onclick="openEditVariantModal(
                            '${v.id}',
                            '${v.variant_name}',
                            '${(v.description || "").replace(/'/g, "")}',
                            ${v.harga_awal || 0},
                            ${v.min_stock || 0},
                            ${v.is_active}
                    )">
                        Edit
                    </button>
                </td>
            `;
            body.appendChild(tr);
        });
    }
    /**
     * MODAL TRANSACTION ITEMS SET HARGA JUAL PRODUCT
     */
    window.openJualModal = function () {
        const modalJual = document.getElementById("modalJual");
        if (modalJual) {
            modalJual.classList.add("open");
            modalJual.style.display = "flex";
        }
    };

    window.closeJualModal = function () {
        const modalJual = document.getElementById("modalJual");
        if (modalJual) {
            modalJual.classList.remove("open");
            modalJual.style.display = "none";
        }
    };


    /**
     * =========================================================================
     * 5. AUTO TAB + AUTO OPEN VARIANT MODAL
     * =========================================================================
     */
    function initDefaultTab() {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        const variantId = params.get("variant_id");

        if (tab) {
            switchTab(null, tab);

            if (tab === "variant" && variantId) {
                setTimeout(() => {
                    document.querySelectorAll("#variantTableBody button")
                        .forEach(btn => {
                            if (btn.getAttribute("onclick")?.includes(`'${variantId}'`)) {
                                btn.click();
                            }
                        });
                }, 300);
            }
        } else {
            switchTab(null, "info");
        }
    }

    // ========================================================================
    // 5. MODAL LOGIC KHUSUS EDIT VARIAN
    // ========================================================================
    window.openVariantModal = function () {
        const modalVariant = document.getElementById("modalVariant");
        if (modalVariant) {
            modalVariant.classList.add("open");
            modalVariant.style.display = "flex";
        }
    };

    window.closeVariantModal = function () {
        const modalVariant = document.getElementById("modalVariant");
        if (modalVariant) {
            modalVariant.classList.remove("open");
            modalVariant.style.display = "none";
        }
    };

    window.openEditVariantModal = function (
        id,
        name,
        desc,
        hargaAwal,
        minStock,
        isActive,
    ) {
        const modal = document.getElementById("modalEditVariant");
        if (modal) {
            const idInput = document.getElementById("editVarId");
            const nameInput = document.getElementById("editVarName");
            const descInput = document.getElementById("editVarDesc");
            const hargaInput = document.getElementById("editVarHargaAwal");
            const minStockInput = document.getElementById("editVarMinStock");
            const statusCheck = document.getElementById("editVarStatus");
            const statusLabel = document.getElementById("editVarStatusLabel");

            if (idInput) idInput.value = id;
            if (nameInput) nameInput.value = name;
            if (descInput) descInput.value = desc;
            if (hargaInput) hargaInput.value = hargaAwal;
            if (minStockInput) minStockInput.value = minStock;

            if (productData.is_variant === false) {
                nameInput.disabled = true;
                descInput.disabled = true;
            }
            const isActiveBool = isActive === true || isActive === "true";
            if (statusCheck) statusCheck.checked = isActiveBool;
            if (statusLabel)
                statusLabel.textContent = isActiveBool ? "Aktif" : "Non-Aktif";

            modal.classList.add("open");
            modal.style.display = "flex";
        }
    };

    window.closeEditVariantModal = function () {
        const modal = document.getElementById("modalEditVariant");
        if (modal) {
            modal.classList.remove("open");
            modal.style.display = "none";
        }
    };

    const editStatusCheck = document.getElementById("editVarStatus");
    const editStatusLabel = document.getElementById("editVarStatusLabel");
    if (editStatusCheck && editStatusLabel) {
        editStatusCheck.addEventListener("change", function () {
            editStatusLabel.textContent = this.checked ? "Aktif" : "Non-Aktif";
        });
    }

    const editForm = document.getElementById("editVariantForm");
    const variantForm = document.getElementById("variantForm");

    // UPDATE VARIANT (PATCH)
    if (editForm) {
        editForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            e.stopPropagation(); 

            const variantId = document.getElementById("editVarId").value;
            const name = document.getElementById("editVarName").value;
            const desc = document.getElementById("editVarDesc").value;
            const hargaAwal = document.getElementById("editVarHargaAwal").value;
            const minStock = document.getElementById("editVarMinStock").value;

            try {
                const response = await fetch(
                    `${API_PRODUCTS}/${productId}/variants/${variantId}`,
                    {
                        method: "PATCH",
                        headers: authHeader(),
                        body: JSON.stringify({
                            variant_name: name,
                            description: desc,
                            harga_awal: hargaAwal,
                            min_stock: minStock
                        }),
                    }
                );

                const json = await response.json();
                
                // === GENERAL RESPONSE HANDLING ===
                if (json.statusCode >= 400) {
                    // console.log(json.result?.errorCode || "Terjadi kesalahan");
                    if (json.statusCode === 400 || json.statusCode === 404) {
                        handleApiError(json.result.errorCode, "warning");
                    }else{
                        handleApiError(json.result.errorCode);
                    }
                    return;
                }

                editForm.reset();
                closeEditVariantModal();
                fetchProductDetail(productId); // fetch ulang
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        });
    }

    // CREATE VARIANT (POST)
    if (variantForm) {
        variantForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            e.stopPropagation(); 
            
            const name = document.getElementById("varName").value;
            const sku = document.getElementById("varSku").value;
            const desc = document.getElementById("varDesc").value;
            const hargaAwal = document.getElementById("varHargaAwal").value;
            const minStock = document.getElementById("varMinStock").value;

            try {
                const response = await fetch(`${API_PRODUCTS}/${productId}/variants`, {
                    method: "POST",
                    headers: authHeader(),
                    body: JSON.stringify({
                        variant_name: name,
                        sku: sku,
                        description: desc,
                        harga_awal: hargaAwal,
                        min_stock: minStock,
                    }),
                });
                const json = await response.json();
                
                // === GENERAL RESPONSE HANDLING ===
                if (json.statusCode >= 400) {
                    // console.log(json.result?.errorCode || "Terjadi kesalahan");
                    if (json.statusCode === 400 || json.statusCode === 404) {
                        handleApiError(json.result.errorCode, "warning");
                    }else{
                        handleApiError(json.result.errorCode);
                    }
                    return;
                }

                variantForm.reset();
                handleApiError(json.result.errorCode, "success");
                closeVariantModal();
                fetchProductDetail(productId); // fetch ulang
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        });
    }

    /**
     * DELETE PRODUCT
     */

    window.deleteProduct = async (id, event) => {
        event.stopPropagation();
        if (!confirm("Yakin Hapus Product ini?")) return;

        try {
            const response = await fetch(`${API_PRODUCTS}/${id}`, {
                method: "DELETE",
                headers: authHeader(),
            });

            const json = await response.json();
                
            // === GENERAL RESPONSE HANDLING ===
            if (json.statusCode >= 400) {
                // console.log(json.result?.errorCode || "Terjadi kesalahan");
                if (json.statusCode === 400 || json.statusCode === 404) {
                    handleApiError(json.result.errorCode, "warning");
                }else{
                    handleApiError(json.result.errorCode);
                }
                return;
            }

            window.location.href = 'http://127.0.0.1:8002/dashboard/products';
        } catch (err) {
            console.error(err);
        }
    };

    /**
     * MODAL PRODUCT
     */
    // Modal Elements
    const modalProduct = document.getElementById("modalForm");
    const btnClose = document.getElementById("closeModal");
    const btnBatal = document.getElementById("btnBatal");
    const productForm = document.getElementById("productForm");

    // Input Form
    const inputId = document.getElementById("productId");
    const inputNama = document.getElementById("inputNama");
    const skuField = document.getElementById("skuField");
    const statusField = document.getElementById("statusField");
    const gambarField = document.getElementById("gambarField");
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
        modalProduct.classList.add("open");
        modalProduct.style.display = "flex";

        const toggleStatus = () => {
            statusLabel.textContent = inputVariant.checked ? "Aktif" : "Tidak";
        }

        inputStatus.addEventListener('change', toggleStatus);
        
    }

    function hideModal() {
        modalProduct.classList.remove("open");
        modalProduct.style.display = "none";
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

    if (btnClose) btnClose.addEventListener("click", hideModal);
    if (btnBatal) btnBatal.addEventListener("click", hideModal);

    let isEditMode = true;
    // ===== EDIT PRODUK (UNCHANGED BEHAVIOR) =====
    window.openEditProduct = function (id) {
        if (!productData) return;
        productForm.reset();
        modalTitle.textContent = "Edit Produk";
        
        if (isEditMode) {
            variantField.classList.add('hidden');
            skuField.classList.add('hidden');
            hppField.classList.add('hidden');
            gambarField.classList.add('hidden');
            statusField.classList.remove('hidden');
        }
        inputId.value = productData.id;
        inputNama.value = productData.name;
        inputDesc.value = productData.description || "";
        
        const productCatId = categories.find(cat => cat.name === productData.categories[0]);
        if (inputKategori && productData.categories)
            inputKategori.value = productCatId.id;
        
        inputStatus.checked = productData.is_active === true;
        statusLabel.textContent = inputStatus.checked ? "Aktif" : "Nonaktif";

        showModal();
    };

    // FETCH UPDATE PRODUCT 
    if (productForm) {
        productForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = new FormData();

            if (isEditMode) {
                formData.append("name", inputNama.value);
                formData.append("description", inputDesc.value);
                // formData.append("categories[0]", inputKategori.value);
                formData.append("is_active", inputStatus.checked ? 1 : 0);
                formData.append("_method", "PATCH"); 
            }

            try {
                const response = await fetch(`${API_PRODUCTS}/${productId}`, {
                    method: "POST",
                    headers: {
                        Authorization: `bearer ${TOKEN}`,
                    },
                    body: formData,
                });

                const json = await response.json();
                
                // === GENERAL RESPONSE HANDLING ===
                if (json.statusCode >= 400) {
                    // console.log(json.result?.errorCode || "Terjadi kesalahan");
                    if (json.statusCode === 400 || json.statusCode === 404) {
                        handleApiError(json.result.errorCode, "warning");
                    }else{
                        handleApiError(json.result.errorCode);
                    }
                    return;
                }

                resetForm();
                handleApiError(json.result.errorCode, "success");
                hideModal();
                fetchProductDetail(productId); // fetch ulang
            } catch (err) {
                console.error(err);
                console.log("Gagal terhubung ke server");
            }
        });
    }
});