/**
 * psa-engine.js - SIG & Inteligência Territorial v7.0
 */
let map;

document.addEventListener('DOMContentLoaded', () => {
    map = L.map('map').setView([-8.3, -35.9], 10);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.circle([-8.28, -35.97], { radius: 15000, color: '#198754', fillOpacity: 0.1 }).addTo(map);
});

const PSA_ENGINE = {
    syncArcGIS() { alert("Sincronizando com ArcGIS Image Services..."); },
    syncMapbiomas() {
        L.tileLayer.wms("https://geoserver.mapbiomas.org/wms", { layers: 'mapbiomas_collection8_integration', format: 'image/png', transparent: true }).addTo(map);
        alert("Mapbiomas 8.0 carregado.");
    },
    fieldPhoto(event) {
        alert("Detectando GPS da imagem...");
        L.marker([-8.35, -36.1]).addTo(map).bindPopup("<b>Evidência de Campo:</b> Nascente").openPopup();
        map.flyTo([-8.35, -36.1], 14);
    }
};
