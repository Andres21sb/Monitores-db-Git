
//get dom and create a div with hello world
document.addEventListener('DOMContentLoaded', () => {
const app = document.getElementById('app');
const divPastel = document.createElement('div');
//div pastel id divPastel
divPastel.id = 'divPastel';
const sgaButton = document.createElement('button');
sgaButton.textContent = 'SGA';
sgaButton.addEventListener('click', () => {
    // Llamar a la API para obtener información del SGA y renderizar el gráfico con sgaView.js
    fetch('/sga')
        .then((response) => response.json())
        .then((data) => {
        renderPieChart(data);
    })
        .catch((error) => {
        console.error('Error al obtener información del SGA:', error);
    });
});
app.appendChild(sgaButton);
app.appendChild(divPastel);
});
