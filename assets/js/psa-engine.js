let map;

function initSSD() {
    map = L.map('map').setView([-8.3, -35.9], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© PSAH-PE | Governança MPGA'
    }).addTo(map);

    // Carregar polígono da Bacia do Ipojuca
    L.circle([-8.28, -35.97], { radius: 15000, color: '#198754', fillOpacity: 0.1 })
        .addTo(map).bindPopup('<b>Bacia Hidrográfica do Rio Ipojuca</b><br>Área de Monitoramento Prioritário');
}

/**
 * Interpretação Estatística (Estilo ArcGIS Summary)
 */
function gerarInterpretacaoSIG(tabelaDados) {
    const totalArea = tabelaDados.reduce((a, b) => a + b.area, 0);
    const areaPrioritaria = tabelaDados.filter(d => d.classe >= 4).reduce((a, b) => a + b.area, 0);
    const percent = (areaPrioritaria / totalArea) * 100;

    const output = document.getElementById('statsInterpretation');
    output.innerHTML = `
        <h5>Sumário Executivo Territorial</h5>
        <div class="display-6 font-bold">${percent.toFixed(1)}%</div>
        <p class="small">Da bacia encontra-se em classes de ALTA ou MUITO ALTA prioridade.</p>
        <hr>
        <p><strong>Tendência:</strong> ${percent > 30 ? 'Necessidade Crítica de Intervenção' : 'Estabilidade Territorial'}</p>
    `;
}

function processGeoImage(event) {
    const file = event.target.files[0];
    alert(`Imagem Georreferenciada: ${file.name}\nLocalizando coordenadas no mosaico de prioridade final...`);
    // Simulação de ponto SIG
    L.marker([-8.35, -36.1]).addTo(map).bindPopup('Ponto de Monitoramento PSA').openPopup();
}
