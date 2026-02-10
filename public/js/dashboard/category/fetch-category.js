document.addEventListener("DOMContentLoaded", () => {
    // ================= CONFIG =================
    const CATEGORY_API = "http://192.168.43.6:8002/api/categories";
    const PRODUCT_API = "http://192.168.43.6:8002/api/variants";
    const DEFAULT_IMAGE = "asset/img/products/no_image.jpg";
    const TOKEN = localStorage.getItem("token");

    // ================= STATE =================
    let categories = [];
    let allProducts = [];

    let currentFilter = "Semua Menu";
    let currentCategoryId = null;

    let pagination = null; // ⬅️ ONLY FROM API META

    /**
     * editingCategory:
     * null
     * { mode: 'create', tempName }
     * { mode: 'edit', id, name }
     */
    let editingCategory = null;

    // ================= DOM =================
    const categoryListContainer = document.getElementById("categoryListContainer");
    const productTableBody = document.getElementById("productTableBody");
    const tableInfoText = document.getElementById("tableInfoText");
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const paginationInfo = document.getElementById("paginationInfo");
    const btnPrev = document.getElementById("btnPrev");
    const btnNext = document.getElementById("btnNext");

    // ================= HELPERS =================
    const authHeader = () => ({
        "Authorization": `bearer ${TOKEN}`,
        "Content-Type": "application/json",
    });

    const ensureSuccess = (json, allowed = [200]) => {
        if (!allowed.includes(json.statusCode)) {
            throw new Error(json.result?.errorMessage || "API Error");
        }
    };

    // ================= FETCH CATEGORIES =================
    async function fetchCategories() {
        const res = await fetch(CATEGORY_API, { headers: authHeader() });
        const json = await res.json();
        ensureSuccess(json);

        categories = json.result.data;
        renderCategories();
    }

    // ================= FETCH PRODUCTS (PAGINATED) =================
    async function fetchProducts(categoryId = null, page = 1) {
        const params = new URLSearchParams();
        params.append("category", categoryId ?? "");
        params.append("page", page);

        const res = await fetch(`${PRODUCT_API}?${params.toString()}`, {
            headers: authHeader(),
        });

        const json = await res.json();
        ensureSuccess(json);

        // ⬅️ pagination FULLY from backend
        pagination = json.result.meta;

        const flattened = [];

        json.result.data.forEach(variant => {
            let imageUrl = variant?.image?.url || DEFAULT_IMAGE;
            if (!imageUrl.startsWith("/")) imageUrl = "/" + imageUrl;

            flattened.push({
                variant_id: variant.id,
                product_id: variant.product_id,
                sku: variant.sku || "N/A",
                name: variant.name,
                image: imageUrl,
            });
        });

        allProducts = flattened;

        renderTable();
        updatePaginationUI();
    }

    // ================= INIT =================
    fetchCategories();
    fetchProducts(null, 1);

    // ================= RENDER CATEGORIES =================
    function renderCategories() {
        categoryListContainer.innerHTML = "";

        renderCategoryItem({ id: null, name: "Semua Menu" });
        categories.forEach(cat => renderCategoryItem(cat));
    }

    function renderCategoryItem(cat) {
        const li = document.createElement("li");

        const isEditing =
            editingCategory &&
            (
                (editingCategory.mode === "create" && cat.name === editingCategory.tempName) ||
                (editingCategory.mode === "edit" && cat.id === editingCategory.id)
            );

        if (isEditing) {
            li.className = "cat-item editing";
            li.innerHTML = `
                <input type="text" class="edit-input" value="${cat.name}" id="editInput-${cat.id || 'new'}">
                <div class="cat-actions">
                    <button class="btn-icon-square btn-check" onclick="saveCategory('${cat.id || 'new'}')">
                        <i class="fa-solid fa-check"></i>
                    </button>
                    <button class="btn-icon-square" onclick="cancelEdit()">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            `;
        } else {
            li.className = `cat-item ${currentFilter === cat.name ? "active" : ""}`;
            li.innerHTML = `
                <span class="cat-name">${cat.name}</span>
                ${
                    cat.id
                        ? `<div class="sidebar-actions">
                            <button class="btn-mini" onclick="startEdit('${cat.id}', event)">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                            <button class="btn-mini delete" onclick="deleteCategory('${cat.id}', event)">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>`
                        : ""
                }
            `;

            li.addEventListener("click", () => {
                currentFilter = cat.name;
                currentCategoryId = cat.id;
                renderCategories();
                fetchProducts(cat.id, 1);
            });
        }

        categoryListContainer.appendChild(li);
    }

    // ================= CATEGORY ACTIONS =================
    addCategoryBtn.addEventListener("click", () => {
        if (editingCategory) return;

        let baseName = "New Category";
        let name = baseName;
        let counter = 1;

        const existingNames = categories.map(c => c.name);
        while (existingNames.includes(name)) {
            counter++;
            name = `${baseName} ${counter}`;
        }

        editingCategory = { mode: "create", tempName: name };
        categories = [...categories, { id: null, name }];
        renderCategories();
    });

    window.startEdit = (id, event) => {
        event.stopPropagation();
        const cat = categories.find(c => c.id === id);
        if (!cat) return;

        editingCategory = { mode: "edit", id: cat.id, name: cat.name };
        renderCategories();
    };

    window.saveCategory = async (ref) => {
        const input = document.getElementById(`editInput-${ref}`);
        if (!input) return;

        const name = input.value.trim();
        if (!name) return;

        try {
            if (editingCategory.mode === "create") {
                const res = await fetch(CATEGORY_API, {
                    method: "POST",
                    headers: authHeader(),
                    body: JSON.stringify({ name }),
                });
                const json = await res.json();
                ensureSuccess(json, [201]);
            }

            if (editingCategory.mode === "edit") {
                const res = await fetch(`${CATEGORY_API}/${editingCategory.id}`, {
                    method: "PATCH",
                    headers: authHeader(),
                    body: JSON.stringify({ name }),
                });
                const json = await res.json();
                ensureSuccess(json, [200]);
            }

            editingCategory = null;
            await fetchCategories();

        } catch (err) {
            console.error(err);
        }
    };

    window.cancelEdit = () => {
        if (editingCategory?.mode === "create") {
            categories = categories.filter(c => c.id !== null);
        }
        editingCategory = null;
        renderCategories();
    };

    window.deleteCategory = async (id, event) => {
        event.stopPropagation();
        if (!confirm("Hapus kategori ini?")) return;

        try {
            const res = await fetch(`${CATEGORY_API}/${id}`, {
                method: "DELETE",
                headers: authHeader(),
            });

            const json = await res.json();
            ensureSuccess(json, [200]);

            currentFilter = "Semua Menu";
            currentCategoryId = null;

            await fetchCategories();
            fetchProducts(null, 1);

        } catch (err) {
            console.error(err);
        }
    };

    // ================= TABLE =================
    function renderTable() {
        productTableBody.innerHTML = "";

        tableInfoText.innerText =
            `Menampilkan "${currentFilter}" (${pagination?.total ?? 0} item)`;

        if (!allProducts.length) {
            productTableBody.innerHTML =
                `<tr><td colspan="3" style="text-align:center;color:#999">Tidak ada data</td></tr>`;
            return;
        }

        allProducts.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>
                    <div class="product-cell">
                        <img src="${item.image}" class="product-img" onerror="this.src='${DEFAULT_IMAGE}'">
                        <strong>${item.name}</strong>
                    </div>
                </td>
                <td>${item.sku}</td>
                <td style="text-align:right">
                    <button class="btn-adjust btn-redirect-edit"
                        data-product-id="${item.product_id}"
                        data-variant-id="${item.variant_id}">
                        Edit
                    </button>
                </td>
            `;
            productTableBody.appendChild(tr);
        });
    }
    
    // --- REDIRECT LOGIC ---
    productTableBody.addEventListener("click", (e) => {
        const btn = e.target.closest(".btn-redirect-edit");
        if (btn) {
            const productId = btn.dataset.productId;
            const variantId = btn.dataset.variantId;
            window.location.href = `/dashboard/products/${productId}?tab=variant&variant_id=${variantId}`;
        }
    });

    // ================= PAGINATION UI =================
    function updatePaginationUI() {
        if (!pagination) return;

        const start =
            pagination.total === 0
                ? 0
                : (pagination.current_page - 1) * pagination.per_page + 1;

        const end = Math.min(
            pagination.current_page * pagination.per_page,
            pagination.total
        );

        paginationInfo.innerText =
            `Showing ${start}-${end} of ${pagination.total}`;

        btnPrev.disabled = pagination.current_page === 1;
        btnNext.disabled = pagination.current_page === pagination.last_page;
    }

    btnPrev.addEventListener("click", () => {
        if (!pagination || pagination.current_page === 1) return;
        fetchProducts(currentCategoryId, pagination.current_page - 1);
    });

    btnNext.addEventListener("click", () => {
        if (!pagination || pagination.current_page === pagination.last_page) return;
        fetchProducts(currentCategoryId, pagination.current_page + 1);
    });
});