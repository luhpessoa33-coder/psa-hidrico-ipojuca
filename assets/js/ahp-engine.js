/**
 * Motor AHP Industrial V3.0 - Metodologia Thomas Saaty
 */
const AHP_ENGINE = {
    RI: [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45], // Índices de Consistência Randômica

    calcularTudo(matriz) {
        const n = matriz.length;
        
        // 1. Cálculo do Vetor de Prioridade (Normalização)
        let somaColunas = new Array(n).fill(0);
        for(let j=0; j<n; j++) {
            for(let i=0; i<n; i++) somaColunas[j] += matriz[i][j];
        }

        let pesos = new Array(n).fill(0);
        for(let i=0; i<n; i++) {
            let somaLinhaNorm = 0;
            for(let j=0; j<n; j++) somaLinhaNorm += (matriz[i][j] / somaColunas[j]);
            pesos[i] = somaLinhaNorm / n;
        }

        // 2. Cálculo da Consistência (λmax)
        let lambdaMax = 0;
        for(let i=0; i<n; i++) lambdaMax += somaColunas[i] * pesos[i];
        
        const CI = (lambdaMax - n) / (n - 1);
        const CR = CI / this.RI[n-1];

        this.renderizarDemonstracao(pesos, lambdaMax, CI, CR);
        return { pesos, CR };
    },

    renderizarDemonstracao(w, l, ci, cr) {
        const area = document.getElementById('ahpMathOutput');
        area.innerHTML = `
            <div class="p-2 border-start border-4 border-info">
                <strong>Demonstração de Rigor Científico:</strong><br>
                1. Auto-vetor (Pesos): [${w.map(v => (v*100).toFixed(2) + '%').join(', ')}]<br>
                2. Autovalor Máximo (λmax): ${l.toFixed(4)}<br>
                3. Índice de Consistência (CI): ${ci.toFixed(4)}<br>
                4. Razão de Consistência (RC): <strong>${(cr * 100).toFixed(2)}%</strong><br>
                <span class="badge ${cr < 0.1 ? 'bg-success' : 'bg-danger'} mt-2">
                    ${cr < 0.1 ? '✅ Matriz Consistente (Saaty < 10%)' : '❌ Inconsistência Crítica - Revise Julgamentos'}
                </span>
            </div>
        `;
    }
};
