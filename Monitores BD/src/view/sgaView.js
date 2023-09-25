function renderLineChart(data) {
  const timestamps = data.map((entry) => entry.calc.time); // Suponiendo que tienes una columna de marca de tiempo
  const values = data.map((entry) => entry.calc.inUse); // Suponiendo que tienes una columna de valores

  // Obtén el elemento div donde se renderizará el gráfico de líneas (reemplaza 'divContainer' con el ID de tu div)
  const divLineChart = document.getElementById("divSga");
  divLineChart.className = 'line-chart-container';
  //divLineChart.innerHTML = " ";

  // Crea un elemento canvas y agrégalo al div
  const canvas = document.createElement("canvas");
  divLineChart.innerHTML = " "; // Borra cualquier contenido anterior
  divLineChart.appendChild(canvas);

  // Define el valor de tu "High Water Mark"
  const highWaterMark = Math.round(data[data.length-1].calc.fullSize * 0.8); // Redondea el valor al número entero más cercano
 // console.log('HWM '+highWaterMark);
  // Crea el gráfico de líneas en el canvas
  new Chart(canvas, {
    type: "line",
    data: {
      labels: timestamps, // Utiliza directamente las marcas de tiempo como etiquetas
      datasets: [
        {
          label: "SGA Usage",
          data: values,
          fill: false,
          borderColor: data[data.length-1].calc.inUse >= highWaterMark - 10 && data[data.length-1].calc.inUse <= highWaterMark + 10 ? "#FFA500" : (data[data.length-1].calc.inUse < highWaterMark - 10 ? "green" : "red"),
          borderWidth: 2,
        },{
          label: 'High Water Mark',
          data: Array(timestamps.length).fill(highWaterMark),
          borderColor: 'rgba(75, 192, 192, 1)',
          fill: false,
          borderWidth: 2,
      }
        
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          // No especificamos 'type: "time"' ya que estamos utilizando las marcas de tiempo directamente
          // Puedes ajustar la visualización de las etiquetas según tus necesidades
          ticks: {
            display: true, // Muestra las etiquetas en el eje x
            autoSkip: true, // Puede ajustar esto según la cantidad de datos
            maxTicksLimit: 10, // Límite máximo de etiquetas
          },
        },
        y: {
          beginAtZero: true,

          max: data[0].calc.fullSize,
        },
      },
    },
  });
}

function renderHorizontalBarChart(data) {
  const tablespaceNames = data.map((entry) => entry.stats.tablespace_name);
  const usedBytes = data.map((entry) => entry.stats.used_bytes);
  const freeBytes = data.map((entry) => entry.stats.free_bytes);
  const maxSizes = data.map((entry) => entry.stats.max_size);

  // Obtén el elemento div donde se renderizará el gráfico de barras horizontales (reemplaza 'divContainer' con el ID de tu div)
  const divBarChart = document.getElementById("divTS");
  divBarChart.className = 'horizontal-bar-chart-container';
  divBarChart.innerHTML = " "; // Borra cualquier contenido anterior

  // Crea un elemento canvas y agrégalo al div
  const canvas = document.createElement("canvas");
  divBarChart.appendChild(canvas);

  // Crea un arreglo de colores para las barras (verde para utilizado y azul para libre)
  const backgroundColors = data.map(() => ["lightblue", "green"]);

  // Crea el gráfico de barras horizontales en el canvas
  new Chart(canvas, {
    type: "bar",
    data: {
      labels: tablespaceNames,
      datasets: [
        {
          label: "Libre (MB)",
          data: freeBytes,
          backgroundColor: backgroundColors.map((colors) => colors[1]),
        },
        {
          label: "Utilizado (MB)",
          data: usedBytes,
          backgroundColor: backgroundColors.map((colors) => colors[0]),
        },
        
        {
          label: "Tamaño Máximo (MB)",
          data: maxSizes,
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 2,
          type: "line",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y',
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  
}
