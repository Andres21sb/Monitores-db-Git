function renderHorizontalBarChart(data) {
  
    const tablespaceNames = data.map((entry) => entry.tablespace_name);
    const usedBytes = data.map((entry) => entry.used_bytes);
    const freeBytes = data.map((entry) => entry.free_bytes);
    const maxSizes = data.map((entry) => entry.max_size);
    console.log(`---------->${tablespaceNames}`);
  
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
  