// Mengambil elemen HTML berdasarkan id.
const expenseForm = document.getElementById("expenseForm");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseList = document.getElementById("expenseList");
const totalExpense = document.getElementById("totalExpense");
const alertMessage = document.getElementById("alertMessage");
const clearExpensesButton = document.getElementById("clearExpenses");

// Membaca data tersimpan. Jika belum ada, gunakan data contoh
const savedExpenses = localStorage.getItem("expenses");
let expenses = savedExpenses !== null ? JSON.parse(savedExpenses) : [];

// Simpan data contoh agar tetap tersedia setelah refresh.
if (savedExpenses === null) {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Mengubah angka menjadi format Rupiah.
function formatRupiah(amount) {
  return "Rp " + amount.toLocaleString("id-ID");
}

// Merender seluruh array ke DOM dengan looping.
function renderExpenses() {
  expenseList.innerHTML = "";
  let total = 0;

  expenses.forEach(function(expense, index) {
    const item = document.createElement("li");
    item.className = "list-group-item expense-item";

    const details = document.createElement("div");
    details.className = "expense-details";

    const name = document.createElement("span");
    name.className = "expense-name";
    name.textContent = expense.name;

    const amount = document.createElement("span");
    amount.className = "expense-amount";
    amount.textContent = formatRupiah(expense.amount);

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-outline-danger btn-sm delete-button";
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can me-1"></i> Hapus';
    deleteButton.addEventListener("click", function() {
      deleteExpense(index);
    });

    details.appendChild(name);
    details.appendChild(amount);
    item.appendChild(details);
    item.appendChild(deleteButton);
    expenseList.appendChild(item);

    total += expense.amount;
  });

  totalExpense.textContent = formatRupiah(total);

  if (expenses.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "list-group-item empty-state";
    emptyItem.textContent = "Belum ada pengeluaran.";
    expenseList.appendChild(emptyItem);
  }
}

// Menghapus satu pengeluaran berdasarkan index array.
function deleteExpense(index) {
  expenses.splice(index, 1);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  renderExpenses();
}

// Menghapus seluruh data pengeluaran sekaligus.
clearExpensesButton.addEventListener("click", function() {
  if (expenses.length === 0) {
    return;
  }

  const confirmDelete = confirm("Yakin ingin menghapus semua data pengeluaran?");

  if (confirmDelete) {
    expenses = [];
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
  }
});

// Validasi dan proses penambahan data.
expenseForm.addEventListener("submit", function(event) {
  event.preventDefault();

  const nameValue = expenseName.value.trim();
  const amountText = expenseAmount.value.trim();
  const amountValue = Number(amountText);

  // if/else: data tidak ditambahkan jika ada input kosong/tidak valid.
  if (nameValue === "" || amountText === "" ||
      !Number.isFinite(amountValue) || amountValue <= 0) {
    alertMessage.classList.remove("d-none");
    return;
  } else {
    alertMessage.classList.add("d-none");

    // Membuat object baru dan memasukkannya ke array.
    const newExpense = {
      name: nameValue,
      amount: amountValue
    };
    expenses.push(newExpense);

    // Menyimpan array of objects ke localStorage.
    localStorage.setItem("expenses", JSON.stringify(expenses));

    // Memperbarui tampilan dan mengosongkan form.
    renderExpenses();
    expenseForm.reset();
    expenseName.focus();
  }
});

// Menampilkan data dari localStorage ketika halaman pertama dibuka.
renderExpenses();
