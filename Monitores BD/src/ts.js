document.addEventListener('DOMContentLoaded', () => {
console.log('TS');
async function fetchAndRenderTS(){
    //renderLoader("divTS");
    setInterval(async () => {
      try {
        const response = await fetch("/ts/tsstats");
        
        if (!response.ok) {
          throw new Error("La solicitud no fue exitosa.");
        }

        const data = await response.json();
        //dataTS.push(data);
        console.log(data);
        renderHorizontalBarChart(data);
        renderTablaTS();
      } catch (error) {
        console.error("Error al obtener información de tablespaces:", error);
      }
    }, 5000); // Actualiza cada 5 segundos
  }

  fetchAndRenderTS();
});