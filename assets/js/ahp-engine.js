/**
 * ahp-engine.js - Rigor de Thomas Saaty v7.0
 * Cálculos completos: Autovetores, λmax, CI e RC.
 */
const AHP_ENGINE = {
    RI: [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49], // Índices Aleatórios de Saaty
    criterios: ["Nascentes", "Cobertura", "Erosão", "Floresta", "Declividade"],

    init() {
        const ui = document.getElementById('ahpMatrixUI');
        let html = `<table class="table table-bordered table-sm text-center bg-white shadow-sm">
            <thead class="table-dark"><tr><th>Critérios</th>`;
        this.criterios.forEach(c => html += `<th>${c}</th>`);
        html += `</tr></thead><tbody>`;

        for (let i = 0; i < 5; i++) {
            html += `<tr><td class="fw-bold bg-light x-small">${this.criterios[i]}</td>`;
            for (let j = 0; j < 5; j++) {
                if (i === j) {
                    html += `<td><input type="text" value="1" disabled class="form-control form-control-sm text-center"></td>`;
                } else {
                    html += `<td><input type="number" id="m_${i}_${j}" value="1" step="1" min="0.11" max="9" class="form-control form-control-sm text-center"></td>`;
                }
            }
            html += `</tr>`;
        }
        html += `</tbody></table><button class="btn btn-primary w-100 shadow fw-bold" onclick="AHP_ENGINE.processarSaaty()">CALCULAR CONSISTÊNCIA COMPLETA</button>`;
        ui.innerHTML = html;
    },

    processarSaaty() {
        const n = this.criterios.length;
        let matriz = Array.from({ length: n }, () => new Array(n).fill(1));

        // 1. Capturar valores da matriz
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i !== j) {
                    let val = parseFloat(document.getElementById(`m_${i}_${j}`).value);
                    matriz[i][j] = val;
                }
            }
        }

        // 2. Soma das Colunas
        let somaColunas = new Array(n).fill(0);
        for (let j = 0; j < n; j++) {
            for (let i = 0; i < n; i++) somaColunas[j] += matriz[i][j];
        }

        // 3. Normalização e Pesos (Autovetor aproximado)
        let pesos = new Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            let somaLinhaNorm = 0;
            for (let j = 0; j < n; j++) {
                somaLinhaNorm += (matriz[i][j] / somaColunas[j]);
            }
            pesos[i] = somaLinhaNorm / n;
        }

        // 4. Cálculo do λmax (Cálculo do vetor de coerência)
        // Multiplica Matriz Original pelo Vetor de Pesos (A * w)
        let Aw = new Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                Aw[i] += matriz[i][j] * pesos[j];
            }
        }

        // λ por elemento = (A*w)_i / w_i
        let lambdas = pesos.map((w, i) => Aw[i] / w);
        let lambdaMax = lambdas.reduce((a, b) => a + b) / n;

        // 5. Índices CI e RC
        const CI = (lambdaMax - n) / (n - 1);
        const RC = CI / this.RI[n - 1];

        this.demonstrar(pesos, lambdaMax, CI, RC);
    },

    demonstrar(w, l, ci, rc) {
        const div = document.getElementById('ahpResults');
        div.innerHTML = `
            <div class="card p-3 border-start border-4 border-info shadow-sm bg-white">
                <h6 class="fw-bold text-primary mb-3">MEMORIAL DE CÁLCULO - RIGOR DE SAATY</h6>
                <div class="row">
                    <div class="col-md-6">
                        <p class="mb-1"><strong>1. Pesos Calculados (Autovetor):</strong></p>
                        <ul class="x-small list-unstyled ps-2">
                            ${this.criterios.map((c, i) => `<li>${c}: <b>${(w[i] * 100).toFixed(2)}%</b></li>`).join('')}
                        </ul>
                    </div>
                    <div class="col-md-6 border-start">
                        <p class="mb-1"><strong>2. Índices de Consistência:</strong></p>
                        <ul class="small list-unstyled">
                            <li>Autovalor Máximo (λmax): <b>${l.toFixed(4)}</b></li>
                            <li>Índice de Consistência (CI): <b>${ci.toFixed(4)}</b></li>
                            <li>Razão de Consistência (RC): <b class="${rc < 0.1 ? 'text-success' : 'text-danger'}">${(rc * 100).toFixed(2)}%</b></li>
                        </ul>
                    </div>
                </div>
                <hr>
                <div class="alert ${rc < 0.1 ? 'alert-success' : 'alert-danger'} p-2 m-0 small fw-bold text-center">
                    ${rc < 0.1 ? '✅ CONSISTENTE: Os pesos podem ser utilizados na ferramenta SIG.' : '❌ INCONSISTENTE: Revise os julgamentos na matriz.'}
                </div>
            </div>`;
    }
};
document.addEventListener('DOMContentLoaded', () => AHP_ENGINE.init());
