document.addEventListener("DOMContentLoaded", () => {
  console.log("SGA");
  // Función para llamar a la API y renderizar el gráfico de líneas del SGA
  let dataSGA = [];

  async function fetchAndRenderSGA() {
    //renderizar el loader
    renderLoader("divSgaGraph");
    setInterval(async () => {
      try {
        const response = await fetch("/sga");
        if (!response.ok) {
          throw new Error("La solicitud no fue exitosa.");
        }

        const data = await response.json();

        // Agregar nuevos datos al array
        dataSGA.push(data);

        // Verificar si el array tiene más de 50 elementos
        if (dataSGA.length > 50) {
          // Eliminar las 10 primeras entradas
          dataSGA.splice(0, 10);
        }

        //verificar el inUse
        if (
          dataSGA[dataSGA.length - 1].calc.inUse >
          dataSGA[dataSGA.length - 1].calc.fullSize * 0.8
        ) {
          //renderizar el boton
          renderTabla();
        } else {
          //unrender rabla
          unrenderTabla();
        }

        if (dataSGA.length >= 1) {
          renderLineChart(dataSGA);
        }
      } catch (error) {
        console.error("Error al obtener información del SGA:", error);
      }
    }, 5000); // Actualiza cada 5 segundos
  }

  // Función para renderizar el gráfico de líneas del SGA
  fetchAndRenderSGA();
});
