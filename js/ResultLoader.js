export const loadPIResults = (closest,id) => {
    let resultDiv = document.getElementById(id);
    
    let table = document.createElement('table');

    table.innerHTML += `
        <tr>
            <th>Próbálkozás</th>
            <th>Érték</th>
        </tr>
    `;

   
        table.innerHTML += `
        <tr>
            <td>Legpontosabb közelítés</td>
            <td>${closest}</td>
        </tr>
        `;

        table.innerHTML += `
        <tr>
            <td>PI értéke</td>
            <td>${Math.PI}</td>
        </tr>
        `;

    resultDiv.appendChild(table);
    resultDiv.style.display = 'block';
};

export const loadAreaResults = (closest, id) => {
    
}

export const resetResults = (id) => {
    let resultDiv = document.getElementById(id);
    resultDiv.innerHTML = '';
    resultDiv.style.display = 'none';
}


