const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const balanceDisplay = document.getElementById('balance');
const incomeDisplay = document.getElementById('income');
const expenseDisplay = document.getElementById('expense');
const tableBody = document.querySelector('#transaction-table tbody');

let transactions = [];
let editIndex = null;

function updateBalance() {
    let balance = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    transactions.forEach(tx => {
        if (tx.category === 'income') {
            balance += tx.amount;
            totalIncome += tx.amount;
        } else {
            balance -= tx.amount;
            totalExpense += tx.amount;
        }
    });
    balanceDisplay.textContent = `₹${balance.toFixed(2)}`;
    incomeDisplay.textContent = `₹${totalIncome.toFixed(2)}`;
    expenseDisplay.textContent = `₹${totalExpense.toFixed(2)}`;
}

function renderTransactions() {
    tableBody.innerHTML = '';
    transactions.forEach((tx, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${idx + 1}</td>
            <td>${tx.description}</td>
            <td>${tx.category === 'expense' ? '-' : ''}₹${tx.amount.toFixed(2)}</td>
            <td><span class="category-${tx.category}">${tx.category.charAt(0).toUpperCase() + tx.category.slice(1)}</span></td>
            <td>${tx.date}</td>
            <td><button class="edit-btn" title="Edit" data-index="${idx}">✎</button></td>
            <td><button class="delete-btn" title="Delete" data-index="${idx}">&times;</button></td>
        `;
        tableBody.appendChild(row);
    });
}

tableBody.addEventListener('click', function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const idx = parseInt(e.target.getAttribute('data-index'));
        transactions.splice(idx, 1);
        updateBalance();
        renderTransactions();
        if (editIndex === idx) {
            resetForm();
        }
    }
    if (e.target.classList.contains('edit-btn')) {
        const idx = parseInt(e.target.getAttribute('data-index'));
        const tx = transactions[idx];
        descriptionInput.value = tx.description;
        amountInput.value = tx.amount;
        categoryInput.value = tx.category;
        form.querySelector('button[type="submit"]').textContent = 'Update Transaction';
        editIndex = idx;
    }
});

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    if (!description || isNaN(amount) || amount <= 0 || !category) {
        alert('Please enter valid data for all fields.');
        return;
    }
    if (editIndex !== null) {
        // Update existing transaction
        transactions[editIndex].description = description;
        transactions[editIndex].amount = amount;
        transactions[editIndex].category = category;
        // Keep the original date
        editIndex = null;
        form.querySelector('button[type="submit"]').textContent = 'Add Transaction';
    } else {
        const date = new Date().toLocaleDateString();
        transactions.push({ description, amount, category, date });
    }
    updateBalance();
    renderTransactions();
    form.reset();
});

function resetForm() {
    form.reset();
    editIndex = null;
    form.querySelector('button[type="submit"]').textContent = 'Add Transaction';
}

// Initial render
updateBalance();
renderTransactions(); 