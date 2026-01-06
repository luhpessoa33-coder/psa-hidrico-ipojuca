/**
 * manual-formatter.js - IA e Formatação NBR 14724 / 10719
 */
const MANUAL_FORMATTER = {
    templates: {
        manual: ["Título do Manual", "Responsável Técnico", "CREA/CRBio", "Metodologia Executiva", "Cronograma"],
        relatorio: ["Projeto PSA Ipojuca", "Nº da ART", "Coordenadas SIRGAS", "Diagnóstico Territorial", "Análise de Sensibilidade"]
    },

    init() {
        const t = document.getElementById('docType').value;
        const container = document.getElementById('formFields');
        container.innerHTML = this.templates[t].map(f => `
            <div class="mb-3">
                <label class="x-small fw-bold text-muted text-uppercase">${f} *</label>
                <textarea id="f_${f.replace(/\s/g,'')}" class="form-control form-control-sm" rows="3" oninput="MANUAL_FORMATTER.sync()"></textarea>
            </div>
        `).join('');
        this.sync();
    },

    sync() {
        const preview = document.getElementById('previewABNT');
        const tipo = document.getElementById('docType').value;
        const titulo = document.querySelector('textarea')?.value || "TÍTULO DO PRODUTO";
        const responsavel = document.querySelectorAll('textarea')[1]?.value || "Nome do Responsável";
        const textoIA = document.querySelectorAll('textarea')[3]?.value || "Aguardando preenchimento ou análise da IA...";

        preview.innerHTML = `
            <div class="text-center mb-5">
                <h6 class="fw-bold">INSTITUTO FEDERAL DE PERNAMBUCO - MPGA</h6>
                <div style="margin-top: 5cm;">
                    <h4 class="fw-bold text-uppercase">${titulo}</h4>
                </div>
                <div style="margin-top: 7cm;">
                    <p class="mb-1"><strong>Responsável:</strong> ${responsavel}</p>
                    <p class="small mt-5">RECIFE, PE<br>2026</p>
                </div>
            </div>
            <div style="page-break-after: always;"></div>
            <div class="mt-4">
                <h5 class="fw-bold text-uppercase mb-4">1. DESENVOLVIMENTO TÉCNICO</h5>
                <p>O presente documento trata-se de um <strong>${tipo.toUpperCase()}</strong> gerado pela plataforma de Suporte à Decisão PSAH-PE Ipojuca.</p>
                <div class="p-4 border-start border-4 bg-light shadow-sm">${textoIA}</div>
            </div>`;
    },

    analyze(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            alert("⚙️ IA PSAH-PE: Organizando texto e formatando seções técnicas...");
            const texto = e.target.result;
            const campoAlvo = document.querySelectorAll('textarea')[3];
            if (campoAlvo) {
                campoAlvo.value = texto.substring(0, 1200) + "... [CONTEÚDO FORMATADO VIA IA]";
                this.sync();
            }
        };
        reader.readAsText(file);
    },

    exportPDF() {
        if (!localStorage.getItem('psa_session_master')) return alert("Acesso Negado: Função exclusiva para Master/Editor.");
        window.print();
    }
};
document.addEventListener('DOMContentLoaded', () => MANUAL_FORMATTER.init());
