
// main.js

document.addEventListener('DOMContentLoaded', () => {
  console.log('Main');
    const app = document.getElementById('app');
    const divContainer = document.createElement('div');
    
    const divSga = document.createElement('div');
    divSga.id = 'divSga';
    const pSga = document.createElement('p');
    pSga.innerHTML = 'SGA';
    divSga.appendChild(pSga);
    divContainer.appendChild(divSga);

    const divTS = document.createElement('div');
    divTS.id = 'divTS';
    const pTS = document.createElement('p');
    pTS.innerHTML = 'TS';
    divTS.appendChild(pTS);
    divContainer.appendChild(divTS);

    divContainer.id = 'divContainer';
    //add css class
    divContainer.className = 'container';
    app.appendChild(divContainer);
  });
    
  