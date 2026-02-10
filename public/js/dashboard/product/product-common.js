// product-common.js
const API_BASE = "http://192.168.43.6:8002/api";
const API_PRODUCTS = `${API_BASE}/products`;
const API_CATEGORIES = `${API_BASE}/categories`;

const TOKEN = localStorage.getItem("token");

const authHeader = () => ({
    Authorization: `bearer ${TOKEN}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
});

function formatDateTime(iso) {
    const d = new Date(iso);
    return d.toLocaleString("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}
