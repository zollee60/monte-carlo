export const loadResults = (ra,id) => {
    let resultDiv = document.getElementById(id);
    
    let table = document.createElement('table');

    table.innerHTML += `
        <tr>
            <th>Próbálkozás</th>
            <th>Legpontosabb közelítés</th>
        </tr>
    `;

    ra.forEach((r) => {
        table.innerHTML += `
        <tr>
            <td>${r.try+1}. próba</td>
            <td>${r.value}</td>
        </tr>
        `;
    });

    resultDiv.appendChild(table);
    resultDiv.style.display = 'block';
};

export const resetResults = (id) => {
    let resultDiv = document.getElementById(id);
    resultDiv.innerHTML = '';
    resultDiv.style.display = 'none';
}
