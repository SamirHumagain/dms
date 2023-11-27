// JavaScript Code (script.js)

let farmers = [];

// Function to calculate income based on milk received, fat content, and additional amount per fat
function calculateIncome(milkReceived, fatContent) {
    const additionalAmountPerFat = 17; // Additional amount in rupees per 1 unit of fat
    const incomeINR = milkReceived * fatContent * additionalAmountPerFat;

    return incomeINR;
}

// Function to add a new row for a farmer in the table
function addFarmerRow(farmer) {
    const tableBody = document.getElementById("farmers-table-body");

    const { name, number, milkReceived, fatContent } = farmer;
    const income = calculateIncome(milkReceived, fatContent);

    const newRow = document.createElement("tr");
    newRow.innerHTML = `
        <td contenteditable>${name}</td>
        <td contenteditable>${number}</td>
        <td contenteditable>${milkReceived}</td>
        <td contenteditable>${fatContent}</td>
        <td>₹${income.toFixed(2)}</td>
        <td>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
            <button class="save-btn" style="display: none;">Save</button>
        </td>
    `;

    tableBody.appendChild(newRow);
    addRowEventListeners(newRow);
    updateTotalIncome();
    saveFarmersToLocalStorage(); // Automatically save data to localStorage
}

// Function to handle the "Add Farmer" button click
function onAddFarmerButtonClick() {
    const newFarmer = {
        name: "",
        number: "",
        milkReceived: 0,
        fatContent: 0,
    };

    farmers.push(newFarmer);
    addFarmerRow(newFarmer);
}

// Function to update the income of a farmer row
function updateFarmerIncome(row) {
    const milkReceived = parseFloat(row.cells[2].innerText);
    const fatContent = parseFloat(row.cells[3].innerText);

    const income = calculateIncome(milkReceived, fatContent);
    row.cells[4].innerText = `₹${income.toFixed(2)}`;
    updateTotalIncome();
    saveFarmersToLocalStorage(); // Automatically save data to localStorage
}

// Function to calculate the total income of all farmers
function calculateTotalIncome() {
    let totalIncome = 0;

    const tableRows = document.querySelectorAll("#farmers-table-body tr");
    tableRows.forEach(row => {
        const milkReceived = parseFloat(row.cells[2].innerText);
        const fatContent = parseFloat(row.cells[3].innerText);
        const income = calculateIncome(milkReceived, fatContent);
        totalIncome += income;
    });

    return totalIncome;
}

// Function to update the total income display at the bottom
function updateTotalIncome() {
    const totalIncomeElement = document.getElementById("total-income");
    const totalIncome = calculateTotalIncome();
    totalIncomeElement.innerText = `Total Income: ₹${totalIncome.toFixed(2)}`;
}

// Function to handle the "Edit" button click
function onEditButtonClick(event) {
    const row = event.target.closest("tr");
    row.querySelectorAll("td[contenteditable]").forEach(td => td.setAttribute("contenteditable", "true"));

    row.querySelector(".edit-btn").style.display = "none";
    row.querySelector(".delete-btn").style.display = "none";
    row.querySelector(".save-btn").style.display = "inline-block";
}

// Function to handle the "Save" button click
function onSaveButtonClick(row) {
    row.querySelectorAll("td[contenteditable]").forEach(td => td.removeAttribute("contenteditable"));

    row.querySelector(".edit-btn").style.display = "inline-block";
    row.querySelector(".delete-btn").style.display = "inline-block";
    row.querySelector(".save-btn").style.display = "none";

    // Update the farmer object with the edited values
    const farmerIndex = row.rowIndex - 1;
    farmers[farmerIndex].name = row.cells[0].innerText;
    farmers[farmerIndex].number = row.cells[1].innerText;
    farmers[farmerIndex].milkReceived = parseFloat(row.cells[2].innerText);
    farmers[farmerIndex].fatContent = parseFloat(row.cells[3].innerText);

    // Recalculate the income and update the income cell
    const income = calculateIncome(farmers[farmerIndex].milkReceived, farmers[farmerIndex].fatContent);
    row.cells[4].innerText = `₹${income.toFixed(2)}`;
    updateTotalIncome();
    saveFarmersToLocalStorage(); // Automatically save data to localStorage
}

// Function to handle the "Delete" button click
function onDeleteButtonClick(event) {
    const row = event.target.closest("tr");
    const farmerIndex = row.rowIndex - 1;
    farmers.splice(farmerIndex, 1);
    row.remove();
    updateTotalIncome();
    saveFarmersToLocalStorage(); // Automatically save data to localStorage
}

// Function to add event listeners to the row buttons
function addRowEventListeners(row) {
    row.querySelector(".edit-btn").addEventListener("click", onEditButtonClick);
    row.querySelector(".delete-btn").addEventListener("click", onDeleteButtonClick);
    row.querySelector(".save-btn").addEventListener("click", onSaveButtonClick.bind(null, row));
    row.querySelectorAll("td[contenteditable]").forEach(td => {
        td.addEventListener("input", updateFarmerIncome.bind(null, row));
    });
}

// Function to save the farmer data to localStorage
function saveFarmersToLocalStorage() {
    localStorage.setItem("farmers", JSON.stringify(farmers));
}

// Function to load the farmer data from localStorage on page load
function loadFarmersFromLocalStorage() {
    const savedFarmers = localStorage.getItem("farmers");
    if (savedFarmers) {
        farmers = JSON.parse(savedFarmers);
        generateTableRows();
    }
}

// Function to generate the initial table rows on page load
function generateTableRows() {
    const tableBody = document.getElementById("farmers-table-body");
    tableBody.innerHTML = "";

    farmers.forEach(farmer => {
        addFarmerRow(farmer);
    });

    updateTotalIncome();
}

// Add event listener for the "Add Farmer" button
document.getElementById("add-farmer-btn").addEventListener("click", onAddFarmerButtonClick);

// Call the function to load farmer data from localStorage on page load
loadFarmersFromLocalStorage();
generateTableRows();
