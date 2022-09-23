// <block:setup:1>
const balanceArray = [1200, 750, 775, 760, 2560]; // old const datapoints
const DATA_COUNT = balanceArray.length; // old const datapoints / retrait du +2
// TODO dynamic length calcul
const labels = [];
for (let i = 0; i < DATA_COUNT; i++) {
  labels.push(i.toString());
}
const data = {
  labels: labels,
  datasets: [
    {
      label: "Compte", // old : Compte
      data: balanceArray, // old : datapoints
      borderColor: "purple",
      // fill: true,
      cubicInterpolationMode: "monotone",
    },
  ],
};
// </block:setup>

// <block:config:0>
const config = {
  type: "line",
  data: data,
  options: {
    elements: {
      point: {
        radius: 0,
      },
    },
    responsive: true,
    plugins: {
      legend: false,
      //   title: {
      //     display: true,
      //     text: "Chart.js Line Chart - Cubic interpolation mode",
      //   },
    },
    interaction: {
      intersect: false,
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  },
};

/*Le contexte du canevas HTML */
const context = document.getElementById("myChart").getContext("2d");
/* Création du graphique */
const chart = new Chart(context, config);

/* Générer des données aléatoires */
function generateData() {
  randomNewSold = (Math.random() * Math.floor(2500)).toFixed(2); // Deux chiffres après la virgule
  let getLastLabel = data.labels[data.labels.length - 1];
  let getOperationNumber = (parseInt(getLastLabel) + 1).toString(); // increment 1 to last operation value and transform it back to string
  addSold(getOperationNumber, randomNewSold);
}

function addSold(operationNumber, newSold) {
  /* Ajoute la valeur en X */
  config.data.labels.push(operationNumber);

  /* Ajoute la valeur */
  config.data.datasets[0].data.push(newSold);

  /* Rafraichir le graphique */
  chart.update();
}

// generateData();
// generateData();
// generateData();

/************************ FORM VALIDATION  ************************/

// create a custom DOM selector function for DRY (is it usefull ?)
const selectElement = (element) => {
  return document.querySelector(`${element}`);
};

// DOM selectors
const balance = selectElement("#solde");
const balanceFace = selectElement("#balance-face");

const operationForm = selectElement("#operationForm");
const inputs = document.querySelectorAll("#operationForm input");

const operationTypeSelector = selectElement("#operator");
const operationTitle = selectElement("#titre");
const operationDescription = selectElement("#desc");
const operationAmount = selectElement("#montant");

const gridOperationContainer = document.querySelectorAll(".grid-container")[1];

// format number to 1 000 instead 1000
const addSpaceInNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

operationForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //// DOM creation of the whole HTML operation blocks with dynamic values \\\\

  // TODO : inject directly html code in a innerHTML

  const mainDiv = document.createElement("div");
  gridOperationContainer.appendChild(mainDiv);
  mainDiv.classList.add(
    "operation",
    `${operationTypeSelector.value === "credit" ? "credit" : "debit"}`
  );

  const gridDiv = document.createElement("div");
  mainDiv.appendChild(gridDiv);
  gridDiv.classList.add("grid-x", "grid-padding-x", "align-middle");

  const pictoCell = document.createElement("div");
  gridDiv.appendChild(pictoCell);
  pictoCell.classList.add("cell", "shrink");

  const pictoDiv = document.createElement("div");
  pictoCell.appendChild(pictoDiv);
  pictoDiv.classList.add("picto");

  const pictoImg = document.createElement("img");
  pictoDiv.appendChild(pictoImg);
  pictoImg.src =
    operationTypeSelector.value === "credit"
      ? "./assets/images/sac-dargent.png"
      : "./assets/images/depenses.png";
  pictoImg.setAttribute(
    "alt",
    `${operationTypeSelector.value === "credit" ? "credit" : "debit"}`
  );

  const infoCell = document.createElement("div");
  gridDiv.appendChild(infoCell);
  infoCell.classList.add("cell", "auto");

  const infoTitle = document.createElement("h2");
  infoCell.appendChild(infoTitle);
  infoTitle.innerHTML = `${operationTitle.value}`;

  const infoSpan = document.createElement("small");
  infoCell.appendChild(infoSpan);
  infoSpan.innerHTML = `${operationDescription.value}`;

  const amountCell = document.createElement("div");
  gridDiv.appendChild(amountCell);
  amountCell.classList.add("cell", "small-3", "text-right");

  const amountValue = document.createElement("p");
  amountCell.appendChild(amountValue);
  amountValue.classList.add("count");
  amountValue.innerHTML = `${addSpaceInNumber(operationAmount.value)}€`;

  let amountPercent = document.createElement("small");
  let convertToAbsoluteNum = Math.abs(balanceArray[balanceArray.length - 1]);
  console.log(operationAmount.value);
  console.log(convertToAbsoluteNum);

  amountCell.appendChild(amountPercent);
  amountPercent.innerHTML = `${(
    (parseInt(operationAmount.value) / convertToAbsoluteNum) *
    100
  ).toFixed(2)}%`;

  // update graphic
  let operationNumber = balanceArray.length;
  let newSold =
    operationTypeSelector.value === "credit"
      ? balanceArray[balanceArray.length - 1] + parseInt(operationAmount.value)
      : balanceArray[balanceArray.length - 1] - parseInt(operationAmount.value);
  addSold(operationNumber, newSold);

  // dynamic update of current balance
  let updatedBalance = balanceArray[balanceArray.length - 1].toFixed(2);
  let formatedBalance = addSpaceInNumber(updatedBalance);
  balance.innerHTML = `${formatedBalance}€`;

  // dynamic update of balance face
  if (updatedBalance >= 500) {
    balanceFace.innerHTML = "on est bien 😃";
    balanceFace.classList.add("good");
    balanceFace.classList.remove("bad");
  } else if (updatedBalance < 500 && updatedBalance > 50) {
    balanceFace.innerHTML = "ça devient chaud 😬";
    balanceFace.classList.add("good");
    balanceFace.classList.remove("bad");
  } else {
    balanceFace.innerHTML = "c'est la cata 😱";
    balanceFace.classList.add("bad");
    balanceFace.classList.remove("good");
  }

  // clear inputs
  operationTypeSelector.value = "--";

  inputs.forEach((input) => {
    input.value = "";
  });
});

// ******************** CREDIT / DEBIT FILTER ********************

const allFilterBtns = document.querySelectorAll(".navHeader a");
const allOpBtn = selectElement(".all-operations");
const debitBtn = selectElement(".debit");
const creditBtn = selectElement(".credit");

debitBtn.addEventListener("click", () => {
  const selectAllOperations = document.querySelectorAll(".operation");

  allFilterBtns.forEach((filterBtn) => {
    filterBtn.classList.value.includes("debit")
      ? filterBtn.classList.add("active")
      : filterBtn.classList.remove("active");
  });
  selectAllOperations.forEach((operation) => {
    operation.classList.value.includes("debit")
      ? operation.classList.remove("disabled")
      : operation.classList.add("disabled");
  });
});

creditBtn.addEventListener("click", () => {
  const selectAllOperations = document.querySelectorAll(".operation");

  allFilterBtns.forEach((filterBtn) => {
    filterBtn.classList.value.includes("credit")
      ? filterBtn.classList.add("active")
      : filterBtn.classList.remove("active");
  });
  selectAllOperations.forEach((operation) => {
    operation.classList.value.includes("credit")
      ? operation.classList.remove("disabled")
      : operation.classList.add("disabled");
  });
});

allOpBtn.addEventListener("click", () => {
  const selectAllOperations = document.querySelectorAll(".operation");

  allFilterBtns.forEach((filterBtn) => {
    filterBtn.classList.value.includes("all-operations")
      ? filterBtn.classList.add("active")
      : filterBtn.classList.remove("active");
  });
  selectAllOperations.forEach((operation) => {
    operation.classList.remove("disabled");
  });
});
