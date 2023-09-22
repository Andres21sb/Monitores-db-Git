

function renderLineChart(data) {
  const timestamps = data.map((entry) => entry.calc.time); // Suponiendo que tienes una columna de marca de tiempo
  const values = data.map((entry) => entry.calc.inUse); // Suponiendo que tienes una columna de valores
  console.log(timestamps, values);

  // Obtén el elemento div donde se renderizará el gráfico de líneas (reemplaza 'divContainer' con el ID de tu div)
  const divLineChart = document.getElementById('divSga');

  // Crea un elemento canvas y agrégalo al div
  const canvas = document.createElement('canvas');
  divLineChart.innerHTML = ' '; // Borra cualquier contenido anterior
  divLineChart.appendChild(canvas);

  // Crea el gráfico de líneas en el canvas
  new Chart(canvas, {
    type: 'line',
    data: {
      labels: timestamps, // Utiliza directamente las marcas de tiempo como etiquetas
      datasets: [
        {
          label: 'SGA Usage',
          data: values,
          fill: false,
          borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
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
        },
      },
    },
  });
}

