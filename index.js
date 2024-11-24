const form = document.getElementById("expenseForm");
    const expenseList = document.getElementById("expenseList");
    const incomeDisplay = document.getElementById("incomeDisplay");
    const incomeUsage = document.getElementById("incomeUsage");
    const ctx = document.getElementById("expenseChart").getContext("2d");
    const status = document.querySelector("#status");
    let chart; // Chart instance
    let monthlyIncome = 0; // Store the monthly income

    // Set Monthly Income
    function setIncome() {
      const incomeInput = document.getElementById("income").value;
      if (incomeInput && parseFloat(incomeInput) > 0) {
        monthlyIncome = parseFloat(incomeInput);
        incomeDisplay.textContent = `Monthly Income: $${monthlyIncome}`;
        
        updateIncomeUsage();
      } else {
        alert("Please enter a valid income amount.");
      }
    }

    // Load Expenses from Local Storage
    function loadExpenses() {
      const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
      expenseList.innerHTML  = ""; // Clear the list

      expenses.forEach((expense, index) => {
        const li = document.createElement("li");
        li.textContent = `${expense.name} - $${expense.amount} (${expense.category})`;
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteExpense(index);
        li.appendChild(deleteBtn);
        expenseList.appendChild(li);
      });

      updateChart(); // Update the chart whenever expenses are loaded
      updateIncomeUsage(); // Update the income usage percentage
    }

    // Add an Expense
    function addExpense(e) {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const amount = document.getElementById("amount").value;
      const category = document.getElementById("category").value;

      if (name && amount && category) {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses.push({ name, amount: parseFloat(amount), category });
        localStorage.setItem("expenses", JSON.stringify(expenses));
        loadExpenses();
        form.reset();
      }
    }

    // Delete an Expense
    function deleteExpense(index) {
      const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
      expenses.splice(index, 1);
      localStorage.setItem("expenses", JSON.stringify(expenses));
      loadExpenses();
    }

    // Calculate Total Expenses
    function calculateTotalExpenses() {
      const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
      return expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    // Update Income Usage Percentage
    function updateIncomeUsage() {
        const totalExpenses = calculateTotalExpenses();
        const percentageUsed = monthlyIncome > 0 ? ((totalExpenses / monthlyIncome) * 100).toFixed(2) : 0;
        incomeUsage.textContent = `You have used: ${percentageUsed}% of your income`;
      
        // Update status
        if (percentageUsed > 70) {
          status.textContent = "BAD";
          status.className = "BAD";
        } else if (percentageUsed > 50 && percentageUsed <= 70) {
          status.textContent = "FAIR";
          status.className = "FAIR";
        } else if (percentageUsed > 0 && percentageUsed <= 50) {
          status.textContent = "GOOD";
          status.className = "GOOD";
        } else {
          status.textContent = ""; // Reset if no expenses
        }
      }

    // Calculate Category Totals
    function calculateCategoryTotals() {
      const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
      const categoryTotals = {};

      expenses.forEach((expense) => {
        if (categoryTotals[expense.category]) {
          categoryTotals[expense.category] += expense.amount;
        } else {
          categoryTotals[expense.category] = expense.amount;
        }
      });
      

      return categoryTotals;
    }

    // Update Pie Chart
    function updateChart() {
      const categoryTotals = calculateCategoryTotals();
      const labels = Object.keys(categoryTotals);
      const data = Object.values(categoryTotals);

      if (chart) chart.destroy(); // Destroy previous chart instance to avoid duplication

      chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: [
                "#FF6384", // Red
                "#36A2EB", // Blue
                "#FFCE56", // Yellow
                "#4BC0C0", // Teal
                "#9966FF", // Purple
                "#e9d8a6",
                "#4c956c"
              ],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1.5, 
          plugins: {
            legend: {
              position: "top",
            },
          },
        },
      });
    }

    // Event Listeners
    form.addEventListener("submit", addExpense);

    // Initial Load
    loadExpenses();
    
    