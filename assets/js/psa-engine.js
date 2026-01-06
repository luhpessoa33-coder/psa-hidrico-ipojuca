/**
 * Motor SIG e Inteligência Territorial PSAH-PE v6.0
 */
let map;

document.addEventListener('DOMContentLoaded', () => {
    map = L.map('map').setView([-8.3, -35.9], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    // Polígono da Bacia do Ipojuca
    L.circle([-8.28, -35.97], { radius: 15000, color: '#198754', fillOpacity: 0.1 })
        .addTo(map).bindPopup('<b>Bacia Hidrográfica do Rio Ipojuca</b>');
});

const PSA_ENGINE = {
    arcgisSync() { alert("Conectando aos Serviços Image Service do ArcGIS Online..."); },
    
    mapbiomasSync() {
        L.tileLayer.wms("https://geoserver.mapbiomas.org/wms", {
            layers: 'mapbiomas_collection8_integration',
            format: 'image/png', transparent: true
        }).addTo(map);
        alert("Camada Mapbiomas 8.0 Sincronizada.");
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
        
        tb.innerHTML = dados.map(d => `<tr><td>${d.Municipio || d.Cidade}</td><td>${d.Area_km2 || 0}</td><td><span class="badge bg-danger">Alta</span></td><td>${d.Percent || 0}%</td></tr>`).join('');
        
        const top10 = [...dados].sort((a,b) => (b.Area_km2 || 0) - (a.Area_km2 || 0)).slice(0, 10);
        rk.innerHTML = '<h6>🏆 Top 10 Cidades Prioritárias</h6>' + 
            top10.map((d, i) => `<div class="small d-flex justify-content-between border-bottom border-white-50 py-1"><span>${i+1}. ${d.Municipio || d.Cidade}</span> <strong>${d.Area_km2} km²</strong></div>`).join('');
        
        document.getElementById('arcgisStats').innerHTML = `<p class="small">A análise espacial detectou que ${top10[0].Municipio} detém a maior concentração de áreas prioritárias para o cenário atual.</p>`;
    },

    runRaster() {
        const v = parseFloat(document.getElementById('rA').value) + parseFloat(document.getElementById('rB').value);
        alert("Calculadora Raster (SSD): O novo índice médio de prioridade é " + v.toFixed(2));
    },

    fieldPhoto(event) {
        alert("Georreferenciando evidência de campo: " + event.target.files[0].name);
        L.marker([-8.35, -36.1]).addTo(map).bindPopup("<b>Ponto de Campo:</b> Nascente").openPopup();
        map.flyTo([-8.35, -36.1], 14);
    }
};
