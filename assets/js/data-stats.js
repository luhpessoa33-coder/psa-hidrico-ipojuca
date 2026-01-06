/**
 * data-stats.js - Processamento Geoestatístico
 */
const DATA_STATS = {
    processar(event) {
        Papa.parse(event.target.files[0], {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => this.gerarDashboard(results.data)
        });
    },

    gerarDashboard(dados) {
        const tbody = document.getElementById('statsBody');
        const ranking = document.getElementById('rankingCard');
        
        // Limpa e popula tabela
        tbody.innerHTML = dados.map(d => `
            <tr>
                <td class="fw-bold">${d.Municipio || d.Cidade}</td>
                <td>${d.Area_km2 || 0}</td>
                <td><span class="badge ${d.Area_km2 > 100 ? 'bg-danger' : 'bg-warning'}">Classe prioritária</span></td>
                <td>${d.Percent || 0}%</td>
            </tr>`).join('');
        
        // Ranking Top 10 Real
        const top10 = [...dados].sort((a,b) => (b.Area_km2 || 0) - (a.Area_km2 || 0)).slice(0, 10);
        ranking.innerHTML = '<h6 class="border-bottom pb-2 mb-2"><i class="fas fa-medal"></i> Top 10 Cidades em Prioridade</h6>' + 
            top10.map((d, i) => `
                <div class="small d-flex justify-content-between border-bottom border-white-50 py-1">
                    <span>${i+1}. ${d.Municipio || d.Cidade}</span> 
                    <strong>${d.Area_km2} km²</strong>
                </div>`).join('');
        
        document.getElementById('interpretacaoIA').innerHTML = `
            <strong><i class="fas fa-brain"></i> Diagnóstico Automático:</strong><br>
            A análise espacial via CSV identificou que <strong>${top10[0].Municipio}</strong> possui a maior área crítica para PSA, exigindo maior aporte de recursos financeiros.`;
    }
};
