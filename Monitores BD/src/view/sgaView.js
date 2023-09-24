function renderLineChart(data) {
  const timestamps = data.map((entry) => entry.calc.time); // Suponiendo que tienes una columna de marca de tiempo
  const values = data.map((entry) => entry.calc.inUse); // Suponiendo que tienes una columna de valores

  // Obtén el elemento div donde se renderizará el gráfico de líneas (reemplaza 'divContainer' con el ID de tu div)
  const divLineChart = document.getElementById("divSga");
  divLineChart.className = "line-chart-container";
  //divLineChart.innerHTML = " ";

  // Crea un elemento canvas y agrégalo al div
  const canvas = document.createElement("canvas");
  divLineChart.innerHTML = " "; // Borra cualquier contenido anterior
  divLineChart.appendChild(canvas);

  // Define el valor de tu "High Water Mark"
  const highWaterMark = Math.round(data[data.length - 1].calc.fullSize * 0.8); // Redondea el valor al número entero más cercano
  console.log("HWM " + highWaterMark);
  // Crea el gráfico de líneas en el canvas
  new Chart(canvas, {
    type: "line",
    data: {
      labels: timestamps, // Utiliza directamente las marcas de tiempo como etiquetas
      datasets: [
        {
          label: "SGA Usage (MB) -> "+data[data.length - 1].calc.inUse+" MB",
          data: values,
          fill: false,
          borderColor:
            data[data.length - 1].calc.inUse >= highWaterMark - 50 && data[data.length - 1].calc.inUse < highWaterMark
              ? "#FFA500"
              : data[data.length - 1].calc.inUse > highWaterMark
              ? "red"
              : "green",
          borderWidth: 2,
        },
        {
          label: "High Water Mark (80%) -> "+highWaterMark+" MB",
          data: Array(timestamps.length).fill(highWaterMark),
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
          borderWidth: 2,
        },
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
