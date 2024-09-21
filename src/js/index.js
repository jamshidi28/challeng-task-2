document.addEventListener('DOMContentLoaded', function () {
    let isPriceAsc = true;
    let isDateAsc = true;
    let transactions = [];

    function dataTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    }

    function getTransactions() {
        axios.get('http://localhost:3000/transactions')
            .then(response => {
                transactions = response.data;
                displayTransactions(transactions);
                document.getElementById('transaction-table').style.display = 'block'; // نمایش جدول پس از بارگذاری
            })
            .catch(error => {
                console.error('خطا در دریافت تراکنش‌ها:', error.message);
            });
    }

    function displayTransactions(data) {
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.type}</td>
                <td>${item.price}</td>
                <td>${item.refId}</td>
                <td>${dataTime(item.date)}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function filterTransactions(query = "") {
        const filtered = transactions.filter(item => item.refId.toString().startsWith(query));
        displayTransactions(filtered);
    }

    // نشان دادن دیتاها در هنگام کلیک
    const loadBtn = document.getElementById('load-button');
    loadBtn.addEventListener('click', () => {
        loadBtn.style.display = 'none';
        getTransactions(); // بارگذاری تراکنش‌ها
    });

    // سرچ
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        filterTransactions(query);
    });

    // مرتب‌سازی بر اساس قیمت
    const sortPrice = document.getElementById('sort-icon-price')
    sortPrice.addEventListener('click', () => {
        const sorted = [...transactions].sort((a, b) => isPriceAsc ? a.price - b.price : b.price - a.price);
        displayTransactions(sorted);
        isPriceAsc = !isPriceAsc;
    });

    // مرتب‌سازی بر اساس تاریخ
    const sortDate =document.getElementById('sort-icon-date')
    sortDate.addEventListener('click', () => {
        const sorted = [...transactions].sort((a, b) => isDateAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date));
        displayTransactions(sorted);
        isDateAsc = !isDateAsc;
    });
});