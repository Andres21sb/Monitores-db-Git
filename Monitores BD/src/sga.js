document.addEventListener('DOMContentLoaded', () => {
  console.log('SGA');
  // Función para llamar a la API y renderizar el gráfico de líneas del SGA
  let dataSGA = [];
  let dataTS = [];
  
  
  async function fetchAndRenderSGA() {
    //renderizar el loader
    renderLoader();
    setInterval(async () => {
      try {
        const response = await fetch("/sga");
        if (!response.ok) {
          throw new Error("La solicitud no fue exitosa.");
        }

        const data = await response.json();

        // Agregar nuevos datos al array
        dataSGA.push(data);

        // Verificar si el array tiene más de 200 elementos
        if (dataSGA.length > 200) {
          // Eliminar las 10 primeras entradas
          dataSGA.splice(0, 10);
        }

        if(dataSGA.length>=1){
          renderLineChart(dataSGA);
        }
      } catch (error) {
        console.error("Error al obtener información del SGA:", error);
      }
    }, 5000); // Actualiza cada 5 segundos
  }

  async function fetchAndRenderTS(){
    renderLoaderTS();
    setInterval(async () => {
      try {
        const response = await fetch("/sga/tsstats");
        if (!response.ok) {
          throw new Error("La solicitud no fue exitosa.");
        }

        const data = await response.json();
        //dataTS.push(data);
        console.log(data);
        renderHorizontalBarChart(data);
      } catch (error) {
        console.error("Error al obtener información de tablespaces:", error);
      }
    }, 10000); // Actualiza cada 5 segundos
  }

  // Función para renderizar el gráfico de líneas del SGA
  fetchAndRenderSGA();
  fetchAndRenderTS();
});
