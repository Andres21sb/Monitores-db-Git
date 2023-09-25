function renderHorizontalBarChart(data) {
  
    const tablespaceNames = data.map((entry) => entry.tablespace_name);
    const usedBytes = data.map((entry) => entry.used_bytes);
    const freeBytes = data.map((entry) => entry.free_bytes);
    const maxSizes = data.map((entry) => entry.max_size);
    console.log(`---------->${maxSizes}`);
  
    // Obtén el elemento div donde se renderizará el gráfico de barras horizontales (reemplaza 'divContainer' con el ID de tu div)
    const divBarChart = document.getElementById("divGraphTS");
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
            type: "bubble",
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

  async function renderTablaTS() {
    const divTS = document.getElementById("divTS");
    
    // Intenta recuperar el elemento divButton
    let divTablesTS = document.getElementById("divTablesTS");
  
    // Si divButton no existe, créalo
    if (!divTablesTS) {
      divTablesTS = document.createElement("div");
      divTablesTS.id = "divTablesTS";
      divTS.appendChild(divTablesTS);
    }
  
    // Resto del código para crear el botón
    divTablesTS.innerHTML = " ";
    renderLoader("divTablesTS");
  
    //fetch for /sga/sqls
    const response2 = await fetch("/ts/tables");

    if (!response2.ok) {
        throw new Error("La solicitud no fue exitosa.");
    }
    const data = await response2.json();
    //render table
    renderTablaData(data);
  }
  
  renderTablaData = (data) => {
    //create table with data
    const table = document.createElement("table");
    //table.className = "fixed_headers";s
    table.innerHTML = `
  <thead>
  
  <tr>
    <th scope="col">OWNER</th>
    <th scope="col">TABLE_NAME</th>
    <th scope="col">TAMAÑO (MB)</th>
    <th scope="col">TABLESPACE_NAME</th>
  </tr>
  </thead>
  <tbody>
  </tbody>
  `;
    //add data to table
    data.forEach((element) => {
      table.innerHTML += `
    <tr>
    <td>${element.owner}</td>
    <td>${element.table_name}</td>
    <td>${element.tam}</td>
    <td>${element.tablespace_name}</td>
  </tr>
    `;
    });
    //add table to divButton
    divTablesTS.innerHTML = " ";
    divTablesTS.className = "table-sqls";
    divTablesTS.appendChild(table);
  };
  
  unrenderTabla = () => {
    if(document.getElementById("divButton")){
      document.getElementById("divButton").remove();
    }
  };
  