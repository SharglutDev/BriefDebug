// <block:setup:1>
const datapoints = [1200, 750, 775, 760, 2560];
const DATA_COUNT = datapoints.length + 2;
const labels = [];
for (let i = 0; i < DATA_COUNT; ++i) {
  labels.push(i.toString());
}
const data = {
  labels: labels,
  datasets: [
    {
      label: "Compte",
      data: datapoints,
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

/************ FORM VALIDATION LOGIC ***********/

const selectElement = (element) => {
  return document.querySelector(`${element}`);
};
const operationForm = selectElement("#operationForm");
const operationTypeSelector = selectElement("#operator");
const operationTitle = selectElement("#titre");
const operationDescription = selectElement("#desc");
const operationAmount = selectElement("#montant");
const formSubmit = selectElement(".btSubmit");

const gridOperationContainer = selectElement(".grid-container");
const operationBlock = selectElement(".operation");

operationForm.addEventListener("submit", (e) => {
  // const mainDiv = document.createElement('div')
  // mainDiv.classList.add("operation", "credit")
  // const gridDiv = document.createElement("div").appendChild(mainDiv)
  // gridDiv.classList.add("grid-x", "grid-padding-x", "align-middle");
  // const cellDiv = document.createElement("div").appendChild(gridDiv)
  // cellDiv.classList.add("cell", "shrink");
  // const pictoDiv = document.createElement("div")
  e.preventDefault();
  const newOperationBlock = gridOperationContainer.appendChild(
    operationBlock.cloneNode()
  );
  console.log(newOperationBlock);
});
const newOperationBlock = gridOperationContainer.appendChild(
  operationBlock.cloneNode()
);
console.log(gridOperationContainer);
