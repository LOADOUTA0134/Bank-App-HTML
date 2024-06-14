document.addEventListener('DOMContentLoaded', function() {
    console.log('Banking App geladen');

    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const transactionPopup = document.getElementById('transactionPopup');
    const closeBtn = document.querySelector('.popup .close');
    const transactionForm = document.getElementById('transactionForm');
    const transactionsTable = document.getElementById('transactionsTable').querySelector('tbody');
    const categoryButtons = document.querySelectorAll('.categoryBtn');
    const selectedCategoryInput = document.getElementById('selectedCategory');
    const currentSaldoElement = document.getElementById('currentSaldo');
    const lastPaymentElement = document.getElementById('lastPayment');
    const todayDateBtn = document.getElementById('todayDate');

    function setSaldoColor() {
        const currentSaldoText = currentSaldoElement.textContent.replace(",", ".").replace(" €", "");
        const currentSaldoInt = parseFloat(currentSaldoText);

        if (currentSaldoInt >= 0) {
            currentSaldoElement.style.color = "green";
        } else {
            currentSaldoElement.style.color = "red";
        }
    }

    // Funktion, um das heutige Datum zu setzen
    function setCurrentDate() {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        const formattedDate = yyyy + '-' + mm + '-' + dd;
        document.getElementById('date').value = formattedDate;
    }

    // Lade gespeicherte Transaktionen und Saldo aus dem localStorage
    let savedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let savedSaldo = parseFloat(localStorage.getItem('saldo')) || 1500.00;
    let savedLastPayment = localStorage.getItem('lastPayment') || 'Keine letzten Zahlungen';

    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(savedTransactions));
        localStorage.setItem('saldo', savedSaldo.toFixed(2));
        localStorage.setItem('lastPayment', savedLastPayment);
    }

    function updateUI() {
        currentSaldoElement.textContent = savedSaldo.toFixed(2).replace(".", ",") + " €";
        lastPaymentElement.textContent = savedLastPayment;
        setSaldoColor();
    }

    function refreshTable() {
        // Clear table rows
        transactionsTable.innerHTML = '';

        // Re-render all transactions
        savedTransactions.forEach(transaction => {
            const newRow = transactionsTable.insertRow();
            const dateCell = newRow.insertCell(0);
            const descriptionCell = newRow.insertCell(1);
            const amountCell = newRow.insertCell(2);
            const categoryCell = newRow.insertCell(3);
            const statusCell = newRow.insertCell(4);
            const paymentProviderCell = newRow.insertCell(5);
            const saldoBeforeCell = newRow.insertCell(6);
            const saldoAfterCell = newRow.insertCell(7);

            dateCell.textContent = transaction.date;
            descriptionCell.textContent = transaction.description;
            amountCell.textContent = `${transaction.amount} €`;

            // Setze Farbe basierend auf dem Transaktionstyp
            if (parseFloat(transaction.amount) >= 0) {
                amountCell.style.color = 'green';
            } else {
                amountCell.style.color = 'red';
            }

            categoryCell.textContent = transaction.category;
            statusCell.textContent = transaction.status;
            paymentProviderCell.textContent = transaction.paymentProvider;

            saldoBeforeCell.textContent = transaction.saldoBefore.toFixed(2).replace(".", ",") + " €";
            saldoAfterCell.textContent = transaction.saldoAfter.toFixed(2).replace(".", ",") + " €";
        });
    }

    function addTransactionToTable(newTransaction) {
        const newRow = transactionsTable.insertRow();
        const dateCell = newRow.insertCell(0);
        const descriptionCell = newRow.insertCell(1);
        const amountCell = newRow.insertCell(2);
        const categoryCell = newRow.insertCell(3);
        const statusCell = newRow.insertCell(4);
        const paymentProviderCell = newRow.insertCell(5);
        const saldoBeforeCell = newRow.insertCell(6);
        const saldoAfterCell = newRow.insertCell(7);

        dateCell.textContent = newTransaction.date;
        descriptionCell.textContent = newTransaction.description;
        amountCell.textContent = `${newTransaction.amount} €`;

        // Setze Farbe basierend auf dem Transaktionstyp
        if (parseFloat(newTransaction.amount) >= 0) {
            amountCell.style.color = 'green';
        } else {
            amountCell.style.color = 'red';
        }

        categoryCell.textContent = newTransaction.category;
        statusCell.textContent = newTransaction.status;
        paymentProviderCell.textContent = newTransaction.paymentProvider;
        saldoBeforeCell.textContent = newTransaction.saldoBefore.toFixed(2).replace(".", ",") + " €";
        saldoAfterCell.textContent = newTransaction.saldoAfter.toFixed(2).replace(".", ",") + " €";
    }

    // Initialisierung
    updateUI();
    refreshTable();

    addTransactionBtn.addEventListener('click', () => {
        transactionPopup.style.display = 'block';
    });

    closeBtn.addEventListener('click', () => {
        transactionPopup.style.display = 'none';
    });

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedCategoryInput.value = button.getAttribute('data-category');
        });
    });

    // Eventlistener für den "Heute"-Button
    todayDateBtn.addEventListener('click', setCurrentDate);

    // Eventlistener für die Formularübermittlung
    transactionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('selectedCategory').value;
        const status = document.getElementById('status').value;
        const paymentProvider = document.getElementById('searchInput').value;

        const saldoBefore = savedSaldo;
        const newTransaction = {
            date: date,
            description: description,
            amount: amount.toFixed(2),
            category: category,
            status: status,
            paymentProvider: paymentProvider,
            saldoBefore: saldoBefore,
            saldoAfter: saldoBefore + amount
        };

        // Transaktion zum localStorage hinzufügen
        savedTransactions.push(newTransaction);
        savedSaldo += amount;
        savedLastPayment = `${description}: ${amount.toFixed(2).replace(".", ",")} €`;

        updateLocalStorage();
        updateUI();
        addTransactionToTable(newTransaction);

        transactionPopup.style.display = 'none';
        transactionForm.reset();
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        selectedCategoryInput.value = '';

        // Letzte Zahlung aktualisieren
        lastPaymentElement.textContent = savedLastPayment;

        // Saldo-Farbe aktualisieren
        setSaldoColor();
    });

    // Saldo-Farbe initial setzen
    setSaldoColor();
});

var paymentProviders = [
    "Keiner",
    "PayPal",
    "Stripe",
    "Square",
    "Adyen",
    "Braintree",
    "Authorize.Net",
    "Worldpay",
    "WePay",
    "2Checkout",
    "Cash App",
    "Banküberweisung",
    "Sofortüberweisung",
    "Rechnung",
    "Klarna"
];

// Funktion für die Suche
function searchFunction() {
    var input, filter, ul, li, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("searchResults");
    ul.innerHTML = '';

    for (i = 0; i < paymentProviders.length; i++) {
        txtValue = paymentProviders[i];
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li = document.createElement('li');
            li.textContent = txtValue;
            li.addEventListener('click', function() {
                input.value = this.textContent; // Hier ändern
                ul.innerHTML = '';
            });
            ul.appendChild(li);
        }
    }
}
