// Sample data for demonstration
let monthlyData = []
  
  // Function to save data to local storage
  function saveDataToLocalStorage(data) {
    localStorage.setItem("monthlyData", JSON.stringify(data));
  }
  
  // Function to load data from local storage
  function loadDataFromLocalStorage() {
    const storedData = localStorage.getItem("monthlyData");
    if (storedData) {
      return JSON.parse(storedData);
    }
    return [];
  }
  
  // Function to generate the table rows dynamically, including delete buttons
  function generateTableRows(data) {
    const tableBody = document.getElementById("monthly-report-table");
    tableBody.innerHTML = ""; // Clear existing table
  
    data.forEach((item, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${item.month}</td>
        <td>${item.farmerName}</td>
        <td>${item.milkReceived}</td>
        <td>${item.totalIncome}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      `;
      tableBody.appendChild(row);
    });
  
    // Attach event listeners to delete buttons
    const deleteButtons = document.getElementsByClassName("delete-btn");
    for (const button of deleteButtons) {
      button.addEventListener("click", deleteFarmerData);
    }
  }
  
  // Function to delete farmer data when the delete button is clicked
  function deleteFarmerData(event) {
    const index = event.target.getAttribute("data-index");
    if (index !== null) {
      monthlyData.splice(index, 1); // Remove the data from the array
      generateTableRows(monthlyData); // Regenerate the table with updated data
      saveDataToLocalStorage(monthlyData); // Save the data to local storage after updating the table
    }
  }
  
  // Function to show the modal form
  function showModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "flex";
  }
  
  // Function to hide the modal form
  function hideModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
  }
  
  // Function to handle form submission and add farmer data to the table
  function addFarmerData(event) {
    event.preventDefault();
  
    const month = document.getElementById("month").value;
    const farmerName = document.getElementById("farmerName").value;
    const milkReceived = parseInt(document.getElementById("milkReceived").value);
    const totalIncome = parseInt(document.getElementById("totalIncome").value);
  
    const newData = { month, farmerName, milkReceived, totalIncome };
    monthlyData.push(newData); // Add the new data to the array
  
    // Clear form fields and hide the modal
    document.getElementById("farmerForm").reset();
    hideModal();
  
    // Generate the table rows with updated data
    generateTableRows(monthlyData);
  
    // Save the data to local storage after adding new data
    saveDataToLocalStorage(monthlyData);
  }
  
  // Event listeners
  const addFarmerBtn = document.getElementById("addFarmerBtn");
  const modalForm = document.getElementById("farmerForm");
  
  addFarmerBtn.addEventListener("click", showModal);
  modalForm.addEventListener("submit", addFarmerData);
  
  // Function to create a simple calendar using Date object
  function createCalendar() {
    const calendarContainer = document.getElementById("calendar");
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const currentDate = new Date();
  
    let calendarHTML = "<div class='calendar'>";
  
    months.forEach((month, index) => {
      const isActive = index === currentDate.getMonth();
      const monthClass = isActive ? "active" : "";
      calendarHTML += `<div class='calendar-month ${monthClass}'>${month}</div>`;
    });
  
    calendarHTML += "</div>";
    calendarContainer.innerHTML = calendarHTML;
  }
  
  // Load data from local storage when the page loads
  window.addEventListener("load", () => {
    monthlyData = loadDataFromLocalStorage();
    generateTableRows(monthlyData);
    createCalendar();
  });
  