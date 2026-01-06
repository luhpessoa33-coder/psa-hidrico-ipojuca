/**
 * data-stats.js - Processamento de Planilhas e Rankings v7.0
 */
const DATA_STATS = {
    processar(event) {
        Papa.parse(event.target.files[0], {
            header: true, dynamicTyping: true, skipEmptyLines: true,
            complete: (results) => this.gerarOutput(results.data)
        });
    },

    gerarOutput(dados) {
        const tb = document.getElementById('statsBody');
        const rk = document.getElementById('rankingCard');
        
        // Tabela Completa
        tb.innerHTML = dados.map(d => `
            <tr>
                <td class="fw-bold">${d.Municipio || d.Cidade}</td>
                <td>${d.Area_km2 || 0}</td>
                <td><span class="badge ${d.Area_km2 > 100 ? 'bg-danger' : 'bg-primary'}">Ranking SIG</span></td>
                <td>${d.Percent || 0}%</td>
            </tr>`).join('');
        
        // Ranking Top 10
        const top10 = [...dados].sort((a,b) => (b.Area_km2 || 0) - (a.Area_km2 || 0)).slice(0, 10);
        rk.innerHTML = '<h6 class="border-bottom pb-2 mb-2"><i class="fas fa-chart-line"></i> Top 10 Cidades (Área Prioritária)</h6>' + 
            top10.map((d, i) => `
                <div class="small d-flex justify-content-between border-bottom border-white-50 py-1">
                    <span>${i+1}. ${d.Municipio || d.Cidade}</span> 
                    <strong>${d.Area_km2 || 0} km²</strong>
                </div>`).join('');
        
        document.getElementById('interpretacaoIA').innerHTML = `
            <strong><i class="fas fa-robot"></i> Insight da IA:</strong><br>
            A análise espacial detectou que <strong>${top10[0].Municipio}</strong> lidera as áreas prioritárias, representando ${(top10[0].Percent || 0)}% da bacia do Rio Ipojuca.`;
    }
};
