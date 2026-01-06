/**
 * manual-engine.js - IA Documental v7.0
 * Unifica manual-formatter e google-docs-bridge
 */
const MANUAL_ENGINE = {
    campos: {
        manual: ["Título do Manual", "Autor Principal", "CREA/CRBio", "Metodologia Científica", "Resultados SIG"],
        relatorio: ["Projeto PSA Ipojuca", "Número ART", "Coordenadas SIRGAS", "Análise de Sensibilidade", "Conclusão Técnica"]
    },

    carregarTemplate() {
        const t = document.getElementById('docType').value;
        const container = document.getElementById('docFields');
        container.innerHTML = this.campos[t].map(c => `
            <div class="mb-3">
                <label class="x-small fw-bold text-uppercase text-muted">${c} *</label>
                <textarea id="f_${c.replace(/\s/g,'')}" class="form-control form-control-sm" rows="3" oninput="MANUAL_ENGINE.sync()"></textarea>
            </div>
        `).join('');
        this.sync();
    },

    sync() {
        const preview = document.getElementById('previewABNT');
        const tipo = document.getElementById('docType').value;
        const titulo = document.querySelector('textarea')?.value || "TÍTULO DO DOCUMENTO";
        const autor = document.querySelectorAll('textarea')[1]?.value || "Nome do Responsável";
        const textoIA = document.querySelectorAll('textarea')[3]?.value || "Aguardando preenchimento ou análise da IA...";
        
        preview.innerHTML = `
            <div class="text-center mb-5">
                <h6 class="fw-bold">INSTITUTO FEDERAL DE PERNAMBUCO | CAMPUS RECIFE</h6>
                <p class="small">MESTRADO EM GESTÃO AMBIENTAL (MPGA)</p>
                <div style="margin-top: 6cm;">
                    <h4 class="fw-bold text-uppercase">${titulo}</h4>
                </div>
                <div style="margin-top: 8cm;">
                    <p class="mb-1"><strong>Responsável:</strong> ${autor}</p>
                    <p class="small mt-5">RECIFE, PE<br>2026</p>
                </div>
            </div>
            <div style="page-break-after: always; height: 1px;"></div>
            <div class="mt-4">
                <h5 class="fw-bold text-uppercase mb-4">1. DESENVOLVIMENTO TÉCNICO</h5>
                <p>Este documento constitui um <strong>${tipo.toUpperCase()}</strong> gerado via Análise Multicritério.</p>
                <div class="p-4 border-start border-4 bg-light shadow-sm">${textoIA}</div>
            </div>`;
    },

    analyzeIA(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            alert("⚙️ IA PSAH-PE: Organizando texto e formatando seções técnicas...");
            const texto = e.target.result;
            const campoAlvo = document.querySelectorAll('textarea')[3];
            if (campoAlvo) {
                campoAlvo.value = texto.substring(0, 1500) + "... [FORMATADO VIA IA]";
                this.sync();
            }
        };
        reader.readAsText(file);
    },

    exportar() {
        if (!localStorage.getItem('psa_session_master')) return alert("Acesso Master Requerido para Exportação PDF.");
        window.print();
    },

    googleDocs() {
        window.open("https://docs.google.com/document/d/1B0X1x_VnScl8Gv8O7p_Xm-x7l_wP5T6k_Fq7oFk_W8o/copy", '_blank');
        alert("Modelo ABNT aberto no Google Docs. Transfira o conteúdo da IA para edição.");
    }
};
document.addEventListener('DOMContentLoaded', () => MANUAL_ENGINE.carregarTemplate());
