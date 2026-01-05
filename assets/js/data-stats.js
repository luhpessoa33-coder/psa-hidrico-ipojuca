/**
 * assets/js/data-stats.js - Motor Estatístico PSA 
 */
function gerarInterpretacaoEstatistica(dados) {
    const totalArea = dados.reduce((sum, item) => sum + item.area, 0);
    const mediaPrioridade = dados.reduce((sum, item) => sum + item.peso, 0) / dados.length;
    
    // Simulação de interpretação espacial (ArcGIS Style)
    let interpretacao = `
        <div class="interpretacao-box p-3 bg-light border-start border-4 border-primary">
            <h6><i class="fas fa-chart-bar"></i> Sumário Estatístico da Bacia</h6>
            <ul class="small list-unstyled">
                <li><strong>Área Total Analisada:</strong> ${totalArea.toLocaleString()} ha</li>
                <li><strong>Densidade de Prioridade:</strong> ${(mediaPrioridade * 10).toFixed(2)}%</li>
                <li><strong>Tendência Territorial:</strong> ${mediaPrioridade > 7 ? 'Zonas Críticas de Conservação' : 'Zonas de Recuperação Moderada'}</li>
            </ul>
        </div>`;
    
    document.getElementById('estatisticaResult').innerHTML = interpretacao;
}
