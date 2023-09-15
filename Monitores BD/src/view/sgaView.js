function renderPieChart(chartData) {
    // Extraer los nombres y valores del arreglo de datos
    const labels = chartData.map((data) => data[0]);
    const values = chartData.map((data) => data[1]);
  
    // Obtener el elemento div donde se renderizará el gráfico (reemplaza 'divPastel' con el ID de tu div)
    const divPastel = document.getElementById('divPastel');
  
    // Crear un elemento canvas y agregarlo al div
    const canvas = document.createElement('canvas');
    divPastel.appendChild(canvas);
  
    // Crear el gráfico de pastel en el canvas
    new Chart(canvas, {
      type: 'pie',
      data: {
        labels: labels.map((label, index) => `${label} (${values[index].toFixed(2)} MB)`), // Agrega "MB" a las etiquetas
        datasets: [
          {
            data: values,
            backgroundColor: [
              'rgba(255, 99, 132, 0.7)',
              'rgba(54, 162, 235, 0.7)',
              'rgba(255, 206, 86, 0.7)',
              'rgba(75, 192, 192, 0.7)',
            ],
          },
        ],
      },
      options: {
        plugins: {
          datalabels: {
            anchor: 'end',
            align: 'start',
            color: 'white', // Color de los números
            formatter: (value) => {
              // Personaliza cómo se muestran los números aquí
              return value.toFixed(2); // Muestra el número con 2 decimales
            },
          },
        },
      },
    });
}

  