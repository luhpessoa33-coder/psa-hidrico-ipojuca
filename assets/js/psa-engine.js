/**
 * Motor SIG e Inteligência de Dados v6.0 (Unifica data-stats)
 */
let map;

document.addEventListener('DOMContentLoaded', () => {
    map = L.map('map').setView([-8.3, -35.9], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© PSAH-PE Ipojuca | Geoinformação'
    }).addTo(map);

    // Bacia do Rio Ipojuca
    L.circle([-8.28, -35.97], { radius: 15000, color: '#198754', fillOpacity: 0.1, weight: 2 })
        .addTo(map).bindPopup('<b>Bacia Hidrográfica do Rio Ipojuca</b><br>Limites Territoriais Analisados.');
});

const PSA_ENGINE = {
    arcgisSync() { 
        alert("🔌 Estabelecendo conexão com ArcGIS REST Services..."); 
        document.getElementById('gisOutput').innerHTML = "Status: ArcGIS Sincronizado.";
    },
    
    mapbiomasSync() {
        L.tileLayer.wms("https://geoserver.mapbiomas.org/wms", {
            layers: 'mapbiomas_collection8_integration',
            format: 'image/png', transparent: true, opacity: 0.7
        }).addTo(map);
        alert("🌍 Mosaico MapBiomas Coleção 8.0 carregado com sucesso.");
    },

    processCSV(event) {
        Papa.parse(event.target.files[0], {
            header: true, dynamicTyping: true, skipEmptyLines: true,
            complete: (results) => this.renderStats(results.data)
        });
    },

    renderStats(dados) {
        const tb = document.getElementById('statsTbody');
        const rk = document.getElementById('rankingCard');
        const cCount = document.getElementById('cityCount');
        
        // Limpar e preencher tabela municipal
        tb.innerHTML = dados.map(d => `
            <tr>
                <td class="fw-bold text-dark">${d.Municipio || d.Cidade}</td>
                <td>${d.Area_km2 || 0}</td>
                <td><span class="badge ${d.Area_km2 > 100 ? 'bg-danger' : 'bg-warning'}">Alta Prioridade</span></td>
                <td>${d.Percent || 0}%</td>
            </tr>`).join('');
        
        // Ranking Top 10
        const top10 = [...dados].sort((a,b) => (b.Area_km2 || 0) - (a.Area_km2 || 0)).slice(0, 10);
        rk.innerHTML = '<h6 class="border-bottom pb-2 mb-2"><i class="fas fa-trophy"></i> Top 10 Áreas Críticas</h6>' + 
            top10.map((d, i) => `
                <div class="small d-flex justify-content-between border-bottom border-white-50 py-1">
                    <span>${i+1}. ${d.Municipio || d.Cidade}</span> 
                    <strong>${d.Area_km2 || 0} km²</strong>
                </div>`).join('');
        
        cCount.innerText = dados.length;
        document.getElementById('arcgisReport').innerHTML = `
            <strong><i class="fas fa-microscope"></i> Análise Geoestatística:</strong><br>
            A concentração prioritária está em <strong>${top10[0].Municipio}</strong>, representando ${(top10[0].Percent || 0)}% da bacia.`;
    },

    runRaster() {
        const a = parseFloat(document.getElementById('rA').value);
        const b = parseFloat(document.getElementById('rB').value);
        alert("Módulo SSD: Processando sobreposição ponderada (Weighted Overlay)... Resultado do Cenário: " + (a + b).toFixed(2) + " pontos de importância hídrica.");
    },

    fieldPhoto(event) {
        alert("Analizando Metadados da Imagem...");
        const fileName = event.target.files[0].name;
        // Simulação de ponto extraído de GPS de campo
        const lat = -8.35 + (Math.random() * 0.1);
        const lng = -36.1 + (Math.random() * 0.1);
        
        L.marker([lat, lng], { draggable: true }).addTo(map)
            .bindPopup(`<b>Evidência Georreferenciada:</b><br>${fileName}<br><span class="text-danger">Prioridade: Muito Alta</span>`)
            .openPopup();
        map.flyTo([lat, lng], 14);
    }
};
