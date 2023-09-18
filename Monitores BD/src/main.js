
// main.js

document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');
    const divPastel = document.createElement('div');
    divPastel.id = 'divContainer';
  
    const tsButton = document.createElement('button');
    tsButton.textContent = 'TS';
  
    app.appendChild(createSGAButton()); // Agrega el botón del SGA
    app.appendChild(tsButton);
    app.appendChild(divPastel);
  });
  