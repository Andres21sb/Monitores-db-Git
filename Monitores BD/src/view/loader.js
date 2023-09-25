function renderLoader(id) {
    console.log('Loader');
    const divSga = document.getElementById(id);
     //add css class
     divSga.className = 'sga-container';
    // Limpia el contenido actual del div
    divSga.innerHTML = "";
  
    // Crea el elemento <span> con la clase "loader"
    const loaderSpan = document.createElement("span");
    loaderSpan.className = "loader";
  
    // Agrega el elemento <span> al div
    divSga.appendChild(loaderSpan);
  }
  