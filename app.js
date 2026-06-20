// =========================
// DEFAULT CATEGORIES
// =========================

const defaultCategories = [
    ["Rent", 3000],
    ["Phone Bill", 1080],
    ["Football", 300],
    ["Cosmetics", 500],
    ["Petrol", 210],
    ["Cycle", 500],
    ["Coffee", 1000],
    ["Non Items", 300],
    ["Loan", 900],
    ["Cigarettes", 1500],
    ["TV Fee", 243]
];

// =========================
// STORAGE
// =========================

let incomeSources = [];
let categories = [];
let coffeeTransactions = [];
let cigaretteTransactions = [];
let monthlyHistory = [];

loadData();

// =========================
// INIT
// =========================

document.addEventListener("DOMContentLoaded", () => {

    createDefaultCategories();

    renderIncome();

    renderCategories();

    setupTabs();

    calculateEverything();

});

// =========================
// TABS
// =========================

function setupTabs(){

    document.querySelectorAll(".tab-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            document.querySelectorAll(".tab-btn")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            document.querySelectorAll(".page")
                .forEach(page => page.classList.remove("active-page"));

            document
                .getElementById(btn.dataset.page)
                .classList.add("active-page");

        });

    });

}

// =========================
// INCOME
// =========================

document.getElementById("addIncomeBtn")
.addEventListener("click", () => {

    incomeSources.push({
        name:"",
        amount:0
    });

    renderIncome();

});

function renderIncome(){

    const container =
        document.getElementById("incomeContainer");

    container.innerHTML = "";

    incomeSources.forEach((item,index)=>{

        const row = document.createElement("div");

        row.className = "category-card";

        row.innerHTML = `
            <input
                placeholder="Income Name"
                value="${item.name}"
                onchange="updateIncomeName(${index}, this.value)"
            >

            <input
                type="number"
                value="${item.amount}"
                onchange="updateIncomeAmount(${index}, this.value)"
            >
        `;

        container.appendChild(row);

    });

}

function updateIncomeName(index,value){

    incomeSources[index].name = value;

    saveData();

}

function updateIncomeAmount(index,value){

    incomeSources[index].amount =
        Number(value) || 0;

    calculateEverything();

}

// =========================
// CATEGORIES
// =========================

function createDefaultCategories(){

    if(categories.length > 0) return;

    defaultCategories.forEach(item=>{

        categories.push({

            name:item[0],
            budget:item[1],
            spent:0

        });

    });

}

function renderCategories(){

    const container =
        document.getElementById("categoriesContainer");

    container.innerHTML = "";

    categories.forEach((cat,index)=>{

        const remaining =
            cat.budget - cat.spent;

        const percent =
            cat.budget > 0
            ? Math.min(
                100,
                (cat.spent / cat.budget) * 100
            )
            : 0;

        const card =
            document.createElement("div");

        card.className = "category-card";

        card.innerHTML = `
            <h4>${cat.name}</h4>

            <label>Budget</label>
            <input
                type="number"
                value="${cat.budget}"
                onchange="updateBudget(${index}, this.value)"
            >

            <label>Spent</label>
            <input
                type="number"
                value="${cat.spent}"
                onchange="updateSpent(${index}, this.value)"
            >

            <p>Remaining:
                ${remaining.toFixed(2)}
            </p>

            <div class="progress">
                <div
                    class="progress-fill"
                    style="width:${percent}%"
                ></div>
            </div>
        `;

        container.appendChild(card);

    });

}

function updateBudget(index,value){

    categories[index].budget =
        Number(value)||0;

    calculateEverything();

}

function updateSpent(index,value){

    categories[index].spent =
        Number(value)||0;

    calculateEverything();

}

// =========================
// CUSTOM CATEGORY
// =========================

document.getElementById("addCategoryBtn")
.addEventListener("click", ()=>{

    const name =
        prompt("Category Name");

    if(!name) return;

    categories.push({

        name,
        budget:0,
        spent:0

    });

    renderCategories();

    saveData();

});

// =========================
// HOUSING
// =========================

document
.getElementById("waterBill")
.addEventListener("input",calculateEverything);

document
.getElementById("electricityBill")
.addEventListener("input",calculateEverything);

// =========================
// COFFEE
// =========================

document
.getElementById("addCoffeeBtn")
.addEventListener("click",()=>{

    const value =
        Number(
            document
            .getElementById("coffeeInput")
            .value
        );

    if(!value) return;

    coffeeTransactions.push({

        amount:value,
        date:new Date().toLocaleString()

    });

    const coffee =
        categories.find(
            c=>c.name==="Coffee"
        );

    if(coffee){

        coffee.spent += value;

    }

    document
    .getElementById("coffeeInput")
    .value = "";

    renderCoffee();

    calculateEverything();

});

// =========================
// CIGARETTES
// =========================

document
.getElementById("addCigaretteBtn")
.addEventListener("click",()=>{

    const value =
        Number(
            document
            .getElementById("cigaretteInput")
            .value
        );

    if(!value) return;

    cigaretteTransactions.push({

        amount:value,
        date:new Date().toLocaleString()

    });

    const cig =
        categories.find(
            c=>c.name==="Cigarettes"
        );

    if(cig){

        cig.spent += value;

    }

    document
    .getElementById("cigaretteInput")
    .value = "";

    renderCigarettes();

    calculateEverything();

});

// =========================
// RENDER COFFEE
// =========================

function renderCoffee(){

    const coffee =
        categories.find(
            c=>c.name==="Coffee"
        );

    document
    .getElementById("coffeeSpent")
    .innerText =
        coffee.spent.toFixed(2);

    document
    .getElementById("coffeeRemaining")
    .innerText =
        (coffee.budget-coffee.spent)
        .toFixed(2);

    const history =
        document
        .getElementById("coffeeHistory");

    history.innerHTML = "";

    coffeeTransactions
    .slice()
    .reverse()
    .forEach(item=>{

        history.innerHTML += `
            <div class="history-item">
                ${item.date}
                <br>
                ${item.amount.toFixed(2)} MVR
            </div>
        `;

    });

}

// =========================
// RENDER CIGARETTES
// =========================

function renderCigarettes(){

    const cig =
        categories.find(
            c=>c.name==="Cigarettes"
        );

    document
    .getElementById("cigaretteSpent")
    .innerText =
        cig.spent.toFixed(2);

    document
    .getElementById("cigaretteRemaining")
    .innerText =
        (cig.budget-cig.spent)
        .toFixed(2);

    const history =
        document
        .getElementById("cigaretteHistory");

    history.innerHTML = "";

    cigaretteTransactions
    .slice()
    .reverse()
    .forEach(item=>{

        history.innerHTML += `
            <div class="history-item">
                ${item.date}
                <br>
                ${item.amount.toFixed(2)} MVR
            </div>
        `;

    });

}

// =========================
// SAVINGS GOAL
// =========================

document
.getElementById("goalTarget")
.addEventListener("input",
calculateEverything);

document
.getElementById("goalName")
.addEventListener("input",
calculateEverything);

// =========================
// HISTORY
// =========================

document
.getElementById("saveMonthBtn")
.addEventListener("click",()=>{

    const record = {

        date:new Date()
        .toLocaleDateString(),

        income:getIncome(),

        expenses:getExpenses(),

        savings:getSavings(),

        coffee:[...coffeeTransactions],

        cigarettes:[...cigaretteTransactions]

    };

    monthlyHistory.push(record);

    renderHistory();

    saveData();

});

function renderHistory(){

    const container =
        document
        .getElementById("historyContainer");

    container.innerHTML = "";

    monthlyHistory
    .slice()
    .reverse()
    .forEach(item=>{

        container.innerHTML += `
            <div class="history-item">
                <strong>${item.date}</strong>
                <br><br>
                Income:
                ${item.income.toFixed(2)}
                <br>
                Expenses:
                ${item.expenses.toFixed(2)}
                <br>
                Savings:
                ${item.savings.toFixed(2)}
                <br>
                Coffee Logs:
                ${item.coffee.length}
                <br>
                Cigarette Logs:
                ${item.cigarettes.length}
            </div>
        `;

    });

}

// =========================
// CALCULATIONS
// =========================

function getIncome(){

    return incomeSources
    .reduce(
        (a,b)=>a+b.amount,
        0
    );

}

function getExpenses(){

    return categories
    .reduce(
        (a,b)=>a+b.spent,
        0
    );

}

function getHousingLeftover(){

    const water =
        Number(
            document
            .getElementById("waterBill")
            .value
        ) || 0;

    const electric =
        Number(
            document
            .getElementById("electricityBill")
            .value
        ) || 0;

    return 6000 - (water + electric);

}

function getSavings(){

    return getIncome()
        - getExpenses()
        + getHousingLeftover();

}

function calculateEverything(){

    renderCategories();

    renderCoffee();

    renderCigarettes();

    const income =
        getIncome();

    const expenses =
        getExpenses();

    const housing =
        getHousingLeftover();

    const savings =
        getSavings();

    document
    .getElementById("incomeTotal")
    .innerText =
        income.toFixed(2);

    document
    .getElementById("incomeDisplay")
    .innerText =
        income.toFixed(2)+" MVR";

    document
    .getElementById("expenseDisplay")
    .innerText =
        expenses.toFixed(2)+" MVR";

    document
    .getElementById("housingLeftDisplay")
    .innerText =
        housing.toFixed(2)+" MVR";

    document
    .getElementById("totalSavings")
    .innerText =
        savings.toFixed(2)+" MVR";

    document
    .getElementById("personalTotal")
    .innerText =
        expenses.toFixed(2);

    const water =
        Number(
            document
            .getElementById("waterBill")
            .value
        ) || 0;

    const electric =
        Number(
            document
            .getElementById("electricityBill")
            .value
        ) || 0;

    document
    .getElementById("housingTotal")
    .innerText =
        (water+electric)
        .toFixed(2);

    document
    .getElementById("housingLeftover")
    .innerText =
        housing.toFixed(2);

    const goalTarget =
        Number(
            document
            .getElementById("goalTarget")
            .value
        ) || 0;

    const goalName =
        document
        .getElementById("goalName")
        .value || "Goal";

    if(goalTarget > 0){

        const percent =
            Math.min(
                100,
                (savings/goalTarget)
                *100
            );

        document
        .getElementById("goalBar")
        .style.width =
            percent+"%";

        document
        .getElementById("goalText")
        .innerText =
            `${goalName}: ${savings.toFixed(2)} / ${goalTarget.toFixed(2)} MVR`;

    }

    saveData();

}

// =========================
// SAVE / LOAD
// =========================

function saveData(){

    localStorage.setItem(
        "budgetAppData",
        JSON.stringify({

            incomeSources,
            categories,
            coffeeTransactions,
            cigaretteTransactions,
            monthlyHistory

        })
    );

}

function loadData(){

    const data =
        JSON.parse(
            localStorage.getItem(
                "budgetAppData"
            )
        );

    if(!data) return;

    incomeSources =
        data.incomeSources || [];

    categories =
        data.categories || [];

    coffeeTransactions =
        data.coffeeTransactions || [];

    cigaretteTransactions =
        data.cigaretteTransactions || [];

    monthlyHistory =
        data.monthlyHistory || [];

}
