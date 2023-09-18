// sga.js

// Función para llamar a la API y renderizar el gráfico del SGA
function fetchAndRenderSGA() {
    fetch('/sga')
      .then((response) => response.json())
      .then((data) => {
        renderPieChart(data);
      })
      .catch((error) => {
        console.error('Error al obtener información del SGA:', error);
      });
  }
  
  // Crea el botón del SGA y agrega el evento click
  function createSGAButton() {
    const sgaButton = document.createElement('button');
    sgaButton.textContent = 'SGA';
    sgaButton.addEventListener('click', fetchAndRenderSGA);
    return sgaButton;
  }
  