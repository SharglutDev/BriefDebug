// <block:setup:1>
const balanceArray = [1200, 750, 775, 760, 2560]; // old const datapoints
const DATA_COUNT = balanceArray.length + 2; // old const datapoints
// TODO dynamic length calcul
const labels = [];
for (let i = 0; i < DATA_COUNT; ++i) {
  labels.push(i.toString());
}
const data = {
  labels: labels,
  datasets: [
    {
      label: "Compte",
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
context = document.getElementById("myChart").getContext("2d");
/* Création du graphique */
chart = new Chart(context, config);

/* Générer des données aléatoires */
function generateData() {
  randomTemperature = (Math.random() * Math.floor(50)).toFixed(2); // Deux chiffres après la virgule
  addTemperature(new Date().toLocaleTimeString(), randomTemperature);
}

function addTemperature(time, temperature) {
  /* Ajoute la valeur en X */
  config.data.labels.push(time);

  /* Ajoute la valeur */
  config.data.datasets[0].data.push(temperature);

  /* Rafraichir le graphique */
  chart.update();
}

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
console.log(inputs);
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

  // TODO : try to shorten the code with element.clodeNode() ?

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
  amountCell.appendChild(amountPercent);
  amountPercent.innerHTML = `${(
    (parseInt(operationAmount.value) / balanceArray[balanceArray.length - 1]) *
    100
  ).toFixed(2)}%`;

  // update the balance array for graphic use
  operationTypeSelector.value === "credit"
    ? balanceArray.push(
        balanceArray[balanceArray.length - 1] + parseInt(operationAmount.value)
      )
    : balanceArray.push(
        balanceArray[balanceArray.length - 1] - parseInt(operationAmount.value)
      );

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
    console.log(input);
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
