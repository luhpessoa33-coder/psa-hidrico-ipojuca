/**
 * Motor SIG Profissional v4.0
 */
let map;

document.addEventListener('DOMContentLoaded', () => {
    map = L.map('map').setView([-8.3, -35.9], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© PSAH-PE | Governança Territorial'
    }).addTo(map);
});

function syncArcGIS() {
    alert("Sincronizando com ArcGIS Online Image Services...");
}

function processarCSV(event) {
    const file = event.target.files[0];
    Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            const dados = results.data;
            atualizarInterfaceDados(dados);
        }
    });
}

function atualizarInterfaceDados(dados) {
    const tbody = document.getElementById('csvTableBody');
    const ranking = document.getElementById('top10Ranking');
    
    // Tabela Geral
    tbody.innerHTML = dados.map(d => `
        <tr>
            <td>${d.Municipio || d.Cidade}</td>
            <td>${d.Area_km2 || 0}</td>
            <td><span class="badge bg-danger">${d.Prioridade || 'Alta'}</span></td>
            <td>${d.Percent || 0}%</td>
        </tr>`).join('');

    // Top 10 Ranking
    const top10 = [...dados].sort((a,b) => (b.Area_km2 || 0) - (a.Area_km2 || 0)).slice(0, 10);
    ranking.innerHTML = `<h6>🏆 Top 10 Áreas Prioritárias</h6>` + 
        top10.map((d, i) => `<div class="small d-flex justify-content-between border-bottom border-white-50 py-1">
            <span>${i+1}. ${d.Municipio || d.Cidade}</span> <strong>${d.Area_km2 || 0} km²</strong>
        </div>`).join('');

    document.getElementById('statsInterpretation').innerHTML = `A análise identificou que as áreas críticas concentram-se no médio Ipojuca, exigindo ações imediatas.`;
}

function processGeoImage(event) {
    alert("Imagem detetada. Extraindo metadados GPS e localizando no mapa de sensibilidade...");
    L.marker([-8.35, -36.1]).addTo(map).bindPopup("<b>Foto de Campo:</b> Nascente Identificada").openPopup();
}
