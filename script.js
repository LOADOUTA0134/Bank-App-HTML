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
    const ibanInput = document.getElementById('iban'); // Input-Feld für IBAN

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

    // Lade gespeicherte Transaktionen, Saldo und IBAN aus dem localStorage
    let savedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let savedSaldo = parseFloat(localStorage.getItem('saldo')) || 1500.00;
    let savedLastPayment = localStorage.getItem('lastPayment') || 'Keine letzten Zahlungen';
    let savedIBAN = localStorage.getItem('iban') || 'XXXXXXXXXXXXXXXXXXXX'; // Default-IBAN

    // Funktion zum Update des localStorage
    function updateLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(savedTransactions));
        localStorage.setItem('saldo', savedSaldo.toFixed(2));
        localStorage.setItem('lastPayment', savedLastPayment);
        localStorage.setItem('iban', savedIBAN);
    }

    // Funktion zum Update der UI (Saldo und letzte Zahlung)
    function updateUI() {
        currentSaldoElement.textContent = savedSaldo.toFixed(2).replace(".", ",") + " €";
        lastPaymentElement.textContent = savedLastPayment;
        setSaldoColor();
        // Setze den aktuellen IBAN-Wert ins Input-Feld
        ibanInput.value = maskIBAN(savedIBAN); // IBAN wird maskiert dargestellt
    }

    // Funktion zum Aktualisieren der Transaktionstabelle
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

    // Funktion zum Hinzufügen einer Transaktion zur Tabelle
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

    // Initialisierung der Seite
    updateUI();
    refreshTable();

    // Event Listener für das Öffnen des Transaktions-Popups
    addTransactionBtn.addEventListener('click', () => {
        transactionPopup.style.display = 'block';
    });

    // Event Listener für das Schließen des Transaktions-Popups
    closeBtn.addEventListener('click', () => {
        transactionPopup.style.display = 'none';
    });

    // Event Listener für die Kategorien-Auswahl-Buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            selectedCategoryInput.value = button.getAttribute('data-category');
        });
    });

    // Event Listener für den "Heute"-Button
    todayDateBtn.addEventListener('click', setCurrentDate);

    // Event Listener für die Formularübermittlung (Transaktion hinzufügen)
    transactionForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Daten aus dem Formular holen
        const date = document.getElementById('date').value;
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('selectedCategory').value;
        const status = document.getElementById('status').value;
        const paymentProvider = document.getElementById('searchInput').value;

        // Saldo vor und nach der Transaktion berechnen
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

        // Transaktion zum Array hinzufügen und Saldo aktualisieren
        savedTransactions.push(newTransaction);
        savedSaldo += amount;
        savedLastPayment = `${description}: ${amount.toFixed(2).replace(".", ",")} €`;

        // Beispiel für IBAN-Speicherung mit Maskierung
        const iban = 'DE89370400440532013000'; // Beispiel-IBAN, hier anpassen für echte IBAN
        const maskedIBAN = 'XXXXXX' + iban.substring(iban.length - 3); // Maskierung

        savedIBAN = maskedIBAN;

        // Update des localStorage, UI und Tabelle
        updateLocalStorage();
        updateUI();
        addTransactionToTable(newTransaction);

        // Formular und UI zurücksetzen
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

// Array mit Zahlungsdienstleistern
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

// Funktion für die Suche nach Zahlungsdienstleistern
function searchFunction() {
    var input, filter, ul, li, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("searchResults");
    ul.innerHTML = '';

    // Durchsuche das Array nach Übereinstimmungen und füge gefundene Einträge zur Liste hinzu
    for (i = 0; i < paymentProviders.length; i++) {
        txtValue = paymentProviders[i];
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li = document.createElement('li');
            li.textContent = txtValue;
            li.addEventListener('click', function() {
                input.value = this.textContent; // Setze den Wert ins Suchfeld
                ul.innerHTML = ''; // Leere die Ergebnisliste
            });
            ul.appendChild(li);
        }
    }
}

// Funktion zur Maskierung der IBAN
function maskIBAN(iban) {
    const maskedPart = 'XXXXXX' + iban.substring(iban.length - 3);
    return maskedPart;
}
