/**
 * ============================================================================
 * GLOBAL FUNCTION: TAB SWITCHING
 * ============================================================================
 * Didefinisikan di window agar bisa dipanggil via atribut 'onclick' di HTML.
 */
window.switchTab = function (event, tabName) {
    // 1. Jika dipanggil dari klik tombol (bukan auto-load), prevent default link behavior
    if (event) event.preventDefault();

    // 2. Reset status aktif pada semua tombol tab
    // Hanya jalan jika ada event klik (manual trigger)
    if (event) {
        document.querySelectorAll(".tab-link").forEach((link) => {
            link.classList.remove("active");
        });
        event.currentTarget.classList.add("active");
    }

    // 3. Sembunyikan SEMUA konten tab
    document.querySelectorAll(".tab-content").forEach((content) => {
        content.style.display = "none";
        content.classList.remove("active-content");
    });

    // 4. Tampilkan konten tab yang dipilih
    const targetId = "tab-" + tabName;
    const target = document.getElementById(targetId);

    if (target) {
        target.style.display = "flex"; // Gunakan flex agar layout card rapi
        target.style.flexDirection = "column";
        target.classList.add("active-content");
    } else {
        console.warn(`Tab target dengan ID '${targetId}' tidak ditemukan.`);
    }
};

/**
 * ============================================================================
 * MAIN LOGIC (DOM READY)
 * ============================================================================
 */
document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded & DOM Ready");

    // ===============================================
    // 1. KONFIGURASI PATH API (JSON)
    // ===============================================
    // Gunakan "/" di depan agar path absolut dari root public
    const API_PATH_INDEX = "/test-response/success/product/200-get-all-product.json";
    const API_PATH_DETAIL = "/test-response/success/product/200-get-product.json";

    // ===============================================
    // 2. DETEKSI HALAMAN
    // ===============================================
    const isIndexPage = document.getElementById("tableBody") !== null;
    const isDetailPage = document.querySelector(".prod-title") !== null;

    // ===============================================
    // 3. ROUTING LOGIC
    // ===============================================
    if (isIndexPage) {
        console.log("Mode: Halaman List Produk");
        fetchData(API_PATH_INDEX, initIndexPage);
    }
    else if (isDetailPage) {
        console.log("Mode: Halaman Detail Produk");
        fetchData(API_PATH_DETAIL, initDetailPage);
    }

    // ===============================================
    // 4. FUNGSI FETCH DATA (REUSABLE)
    // ===============================================
    function fetchData(url, callback) {
        console.log("Mengambil data dari:", url);

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
                return res.json();
            })
            .then((json) => {
                // Validasi struktur JSON standar { result: { data: ... } }
                if (json.result && json.result.data) {
                    callback(json.result.data);
                } else {
                    throw new Error("Format JSON tidak valid (key result.data hilang).");
                }
            })
            .catch((err) => {
                console.error("Fetch Error:", err);
                handleErrorDisplay(err);
            });
    }

    // Menampilkan error di UI agar user tahu
    function handleErrorDisplay(err) {
        const msg = `Gagal memuat data: ${err.message}`;
        if (isIndexPage) {
            document.getElementById("tableBody").innerHTML =
                `<tr><td colspan="5" style="color:red; text-align:center; padding:20px;">${msg}</td></tr>`;
        } else if (isDetailPage) {
            document.querySelector(".prod-title").textContent = "Error";
            alert(msg);
        }
    }

    // ========================================================================
    // 5. LOGIKA HALAMAN INDEX (LIST PRODUK)
    // ========================================================================
    function initIndexPage(dataList) {
        const tableBody = document.getElementById("tableBody");
        if (!tableBody) return;

        // Render Awal
        renderTable(dataList);

        function renderTable(data) {
            tableBody.innerHTML = "";

            if(data.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Data Kosong</td></tr>`;
                return;
            }

            data.forEach((item, index) => {
                // Tentukan status badge
                const isActive = item.is_active;
                const statusBadge = isActive
                    ? `<span class="badge badge-active"><span class="dot bg-green"></span> Aktif</span>`
                    : `<span class="badge badge-inactive"><span class="dot bg-gray"></span> Nonaktif</span>`;

                const dotStock = item.current_stock > 0 ? "bg-green" : "bg-red";

                // Handle Image
                const imgUrl = (item.image && item.image.url) ? item.image.url : "https://via.placeholder.com/56";

                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>
                        <div class="product-cell">
                            <img src="${imgUrl}" class="product-img" onerror="this.src='https://via.placeholder.com/56'">
                            <div class="product-info">
                                <h4>${item.name}</h4>
                                <small style="color:#888;">${item.sku || '-'}</small>
                            </div>
                        </div>
                    </td>
                    <td>${item.categories ? item.categories[0] : '-'}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span class="dot ${dotStock}"></span>
                            <strong>${item.current_stock}</strong>
                        </div>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn-outline" onclick="window.location.href='/dashboard/products/detail?id=${item.id}'">Detail</button>
                            <button class="btn-outline">Edit</button>
                        </div>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }

        // Search Logic Sederhana
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.addEventListener("input", (e) => {
                const keyword = e.target.value.toLowerCase();
                const filtered = dataList.filter(item => item.name.toLowerCase().includes(keyword));
                renderTable(filtered);
            });
        }
    }

    // ========================================================================
    // 6. LOGIKA HALAMAN DETAIL (DETAIL PRODUK)
    // ========================================================================
    function initDetailPage(detailData) {
        console.log("Data Detail Diterima:", detailData);

        // --- A. Render Header Info ---
        const domTitle = document.querySelector(".prod-title");
        const domImg = document.querySelector(".prod-main-img");
        const domSku = document.querySelector(".prod-subtitle");
        const domTotalStock = document.getElementById("headerTotalStock");

        if(domTitle) domTitle.textContent = detailData.name;

        // Ambil gambar default atau gambar pertama
        if (domImg && detailData.image && detailData.image.length > 0) {
            const defaultImg = detailData.image.find(img => img.is_default) || detailData.image[0];
            domImg.src = defaultImg.url;
        }

        // Tampilkan SKU dari varian pertama (jika root tidak punya SKU)
        if(domSku) {
            const displaySku = (detailData.variants && detailData.variants.length > 0)
                ? detailData.variants[0].sku
                : (detailData.sku || "-");
            domSku.textContent = "SKU: " + displaySku.split('-').slice(0, 2).join('-');
        }

        // Hitung Total Stok
        const totalStock = (detailData.variants || []).reduce((acc, curr) => acc + (curr.stock || 0), 0);
        if(domTotalStock) domTotalStock.textContent = totalStock;


        // --- B. Render Tab Info Dasar ---
        const setText = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
        setText("detailName", detailData.name);
        setText("detailCategory", detailData.categories ? detailData.categories.join(", ") : "-");
        setText("detailDesc", detailData.description || "-");


        // --- C. Render Tab Varian (TABEL VARIAN) ---
        const variantBody = document.getElementById("variantTableBody");
        if (variantBody) {
            variantBody.innerHTML = "";
            const variants = detailData.variants || [];

            if (variants.length === 0) {
                variantBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">Belum ada varian</td></tr>`;
            } else {
                variants.forEach((v) => {
                    const isActive = v.is_active;
                    const badgeClass = isActive ? 'badge-active' : 'badge-inactive';
                    const statusText = isActive ? 'Aktif' : 'Nonaktif';

                    // Note: JSON Detail menggunakan key 'stock', JSON Index menggunakan 'current_stock'
                    const stok = v.stock !== undefined ? v.stock : v.current_stock;

                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td><strong>${v.variant_name}</strong></td>
                        <td style="font-family:monospace; color:#555;">${v.sku || '-'}</td>
                        <td>${stok} pcs</td>
                        <td><span class="badge ${badgeClass}">${statusText}</span></td>
                        <td><button class="btn-icon" title="Edit Varian">✎</button></td>
                    `;
                    variantBody.appendChild(tr);
                });
            }
        }


        // --- D. Render Tab Stok (TABEL STOK) ---
        const stockBody = document.getElementById("stockTableBody");
        if (stockBody) {
            stockBody.innerHTML = "";
            const variants = detailData.variants || [];

            if (variants.length === 0) {
                stockBody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding:20px;">Data Stok Tidak Tersedia</td></tr>`;
            } else {
                variants.forEach((v) => {
                    const tr = document.createElement("tr");
                    const isActive = v.is_active;
                    const badgeClass = isActive ? 'badge-active' : 'badge-inactive';
                    const statusText = isActive ? 'Aktif' : 'Nonaktif';
                    const stok = v.stock !== undefined ? v.stock : 0;

                    tr.innerHTML = `
                        <td style="font-family:monospace; color:#333;">${v.sku || '-'}</td>
                        <td><strong>${stok}</strong></td>
                        <td><span class="badge ${badgeClass}">${statusText}</span></td>
                    `;
                    stockBody.appendChild(tr);
                });
            }
        }

        // --- E. Render Tab Galeri ---
        const galleryGrid = document.getElementById("galleryGrid");
        if (galleryGrid) {
            galleryGrid.innerHTML = "";
            const images = detailData.image || [];

            if(images.length === 0) {
                galleryGrid.innerHTML = "<p>Tidak ada gambar</p>";
            } else {
                images.forEach(img => {
                    const card = document.createElement("div");
                    card.className = "img-card";
                    card.innerHTML = `
                        <div class="img-thumb-wrapper">
                            <img src="${img.url}" class="img-thumb" onerror="this.src='https://via.placeholder.com/150'">
                            ${img.is_default ? '<span class="default-badge">Default</span>' : ''}
                        </div>
                    `;
                    galleryGrid.appendChild(card);
                });
            }
        }

        // --- F. AUTO OPEN TAB DEFAULT (PENTING!) ---
        // Membuka tab 'info' secara otomatis agar halaman tidak terlihat kosong
        initDefaultTab();
    }

    // Fungsi Auto Open Tab
    function initDefaultTab() {
        // Cek apakah URL punya parameter ?tab=...
        const urlParams = new URLSearchParams(window.location.search);
        const tabParam = urlParams.get('tab');

        if(tabParam) {
            switchTab(null, tabParam);
            const activeLink = document.querySelector(`.tab-link[onclick*='${tabParam}']`);
            if(activeLink) activeLink.classList.add('active');
        } else {
            // Default ke tab Info
            switchTab(null, 'info');
            // Manual set class active ke link pertama
            const infoLink = document.querySelector(".tab-link");
            if(infoLink) infoLink.classList.add('active');
        }
    }

    // ===============================================
    // 7. MODAL LOGIC (Placeholder)
    // ===============================================
    // Logic modal varian (hanya visual interaction)
    const modalVariant = document.getElementById("modalVariant");
    const variantForm = document.getElementById("variantForm");

    window.openVariantModal = function () {
        if (variantForm) variantForm.reset();
        if (modalVariant) modalVariant.classList.add("open");
        // fallback jika class open tidak didefinisikan di css, pakai inline style
        if (modalVariant) modalVariant.style.display = "flex";
    };

    window.closeVariantModal = function () {
        if (modalVariant) modalVariant.classList.remove("open");
        if (modalVariant) modalVariant.style.display = "none";
    };

});
