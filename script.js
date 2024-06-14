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
    const savedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const savedSaldo = parseFloat(localStorage.getItem('saldo')) || 1500.00;
    const savedLastPayment = localStorage.getItem('lastPayment') || 'Keine letzten Zahlungen';

    currentSaldoElement.textContent = savedSaldo.toFixed(2).replace(".", ",") + " €";
    lastPaymentElement.textContent = savedLastPayment;

    savedTransactions.forEach(transaction => {
        const newRow = transactionsTable.insertRow();
        const dateCell = newRow.insertCell(0);
        const descriptionCell = newRow.insertCell(1);
        const amountCell = newRow.insertCell(2);
        const categoryCell = newRow.insertCell(3);
        const statusCell = newRow.insertCell(4);
        const paymentProviderCell = newRow.insertCell(5);

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
    });

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
        const amount = parseFloat(document.getElementById('amount').value).toFixed(2);
        const category = document.getElementById('selectedCategory').value;
        const status = document.getElementById('status').value;
        const paymentProvider = document.getElementById('searchInput').value; 

        const newTransaction = {
            date: date,
            description: description,
            amount: amount,
            category: category,
            status: status,
            paymentProvider: paymentProvider 
        };

        // Transaktion zum localStorage hinzufügen
        savedTransactions.push(newTransaction);
        localStorage.setItem('transactions', JSON.stringify(savedTransactions));

        const newRow = transactionsTable.insertRow();
        const dateCell = newRow.insertCell(0);
        const descriptionCell = newRow.insertCell(1);
        const amountCell = newRow.insertCell(2);
        const categoryCell = newRow.insertCell(3);
        const statusCell = newRow.insertCell(4);
        const paymentProviderCell = newRow.insertCell(5); 

        dateCell.textContent = date;
        descriptionCell.textContent = description;
        amountCell.textContent = `${amount} €`;

        // Farbe basierend auf Transaktionstyp setzen
        if (parseFloat(amount) >= 0) {
            amountCell.style.color = 'green';
        } else {
            amountCell.style.color = 'red';
        }

        categoryCell.textContent = category;
        statusCell.textContent = status;
        paymentProviderCell.textContent = paymentProvider;

        transactionPopup.style.display = 'none';
        transactionForm.reset();
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        selectedCategoryInput.value = '';

        // Letzte Zahlung aktualisieren
        lastPaymentElement.textContent = `${description}: ${amount} €`;
        localStorage.setItem('lastPayment', lastPaymentElement.textContent);

        // Aktuellen Saldo aktualisieren
        let currentSaldo = parseFloat(currentSaldoElement.textContent.replace(/[^0-9,-]+/g,"").replace(",", "."));
        currentSaldo += parseFloat(amount);
        currentSaldoElement.textContent = currentSaldo.toFixed(2).replace(".", ",") + " €";
        localStorage.setItem('saldo', currentSaldo);

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

document.addEventListener('DOMContentLoaded', function() {
    const setSaldoBtn = document.getElementById('setSaldoBtn');
    const saldoInput = document.getElementById('saldo');
    const confirmPopup = document.getElementById('confirmPopup');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmInfo = document.getElementById('confirmInfo');
    const close = document.getElementById('close');
    const confirmText = document.getElementById('confirmText');
    const errorMessage = document.getElementById('errorMessage');

    setSaldoBtn.addEventListener('click', () => {
        confirmInfo.textContent = `Möchten Sie den Kontostand auf ${saldoInput.value} € setzen? Alle Transaktionen werden aus dem Speicher entfernt!`;
        confirmPopup.style.display = 'block';
    });

    cancelBtn.addEventListener('click', () => {
        confirmPopup.style.display = 'none';
    });

    close.addEventListener('click', () => {
        confirmPopup.style.display = 'none';
    });

    confirmBtn.addEventListener('click', () => {
        const confirmInput = confirmText.value.trim();

        if (confirmInput === "BESTÄTIGEN") {
            const newSaldo = parseFloat(saldoInput.value);
            confirmPopup.style.display = 'none';
            if (!isNaN(newSaldo)) {
                localStorage.removeItem('transactions');
                localStorage.removeItem('lastPayment');
                localStorage.setItem('saldo', newSaldo);
                currentSaldoElement.textContent = newSaldo.toFixed(2).replace(".", ",") + " €";
                setSaldoColor();
            }

        } else {
            errorMessage.classList.remove('hidden');
            errorMessage.classList.add('error');
            setTimeout(function() {
                errorMessage.classList.remove('error');
            }, 1000); 
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {

    const saveSettingsBtn = document.getElementById('saveSettings');

    saveSettingsBtn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const infoSaldo = document.getElementById('infoSaldo');
    let tooltip = null;

    infoSaldo.addEventListener('mouseover', (event) => {
        const tooltipText = 'Hiermit können Sie das Startsaldo des Kontos festlegen. Das Ändern des Saldos führt zur Löschung der Transaktionen im Zusammenhang mit dem vorherigen Saldo.';
        if (!tooltip) {
            tooltip = createTooltip(tooltipText);
        }
        positionTooltip(event.pageX, event.pageY);
        tooltip.classList.add('show');
    });

    infoSaldo.addEventListener('mouseout', () => {
        if (tooltip) {
            tooltip.classList.remove('show');
            setTimeout(() => {
                if (tooltip) {
                    tooltip.parentNode.removeChild(tooltip);
                    tooltip = null;
                }
            }, 300);
        }
    });
    

    function createTooltip(text) {
        const newTooltip = document.createElement('div');
        newTooltip.textContent = text;
        newTooltip.classList.add('tooltip');
        document.body.appendChild(newTooltip);
        return newTooltip;
    }

    function positionTooltip(mouseX, mouseY) {
        if (tooltip) {
            tooltip.style.top = mouseY + 'px';
            tooltip.style.left = mouseX + 'px';
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const infoBetrag = document.getElementById('infoBetrag');
    let tooltip = null;

    infoBetrag.addEventListener('mouseover', (event) => {
        const tooltipText = 'Eingaben ohne "-" werden automatisch zum Saldo addiert, Eingaben mit "-" subtrahieren vom Saldo.';
        if (!tooltip) {
            tooltip = createTooltip(tooltipText);
        }
        positionTooltip(event.pageX, event.pageY);
        tooltip.classList.add('show');
    });

    infoBetrag.addEventListener('mouseout', () => {
        if (tooltip) {
            tooltip.classList.remove('show');
            setTimeout(() => {
                if (tooltip) {
                    tooltip.parentNode.removeChild(tooltip);
                    tooltip = null;
                }
            }, 300);
        }
    });
    

    function createTooltip(text) {
        const newTooltip = document.createElement('div');
        newTooltip.textContent = text;
        newTooltip.classList.add('tooltip');
        document.body.appendChild(newTooltip);
        return newTooltip;
    }

    function positionTooltip(mouseX, mouseY) {
        if (tooltip) {
            tooltip.style.top = mouseY + 'px';
            tooltip.style.left = mouseX + 'px';
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const currentSaldo = document.getElementById('currentSaldo');
    const currentSaldoText = currentSaldo.textContent.replace(",", ".").replace(" €", "");
    const currentSaldoInt = parseFloat(currentSaldoText);

    if (currentSaldoInt >= 0) {
        currentSaldo.style.color = "green";
    } else {
        currentSaldo.style.color = "red";
    }
});
