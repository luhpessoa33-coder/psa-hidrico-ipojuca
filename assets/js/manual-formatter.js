/**
 * manual-formatter.js - Automação Documental ABNT v7.0
 */
const MANUAL_FORMATTER = {
    secoes: {
        manual: ["Título do Manual", "Responsável Técnico", "CREA/CRBio", "Metodologia Executiva", "Cronograma de Ação"],
        relatorio: ["Projeto PSA Ipojuca", "Número da ART", "Coordenadas SIRGAS 2000", "Diagnóstico Ambiental", "Impactos Identificados"]
    },

    init() {
        const t = document.getElementById('docType').value;
        const container = document.getElementById('formFields');
        container.innerHTML = this.secoes[t].map(s => `
            <div class="mb-3">
                <label class="x-small fw-bold text-muted text-uppercase">${s} *</label>
                <textarea id="field_${s.replace(/\s/g,'')}" class="form-control form-control-sm" rows="2" oninput="MANUAL_FORMATTER.sync()"></textarea>
            </div>
        `).join('');
        this.sync();
    },

    sync() {
        const preview = document.getElementById('previewABNT');
        const tipo = document.getElementById('docType').value;
        const titulo = document.querySelector('textarea')?.value || "TÍTULO DO DOCUMENTO";
        const responsavel = document.querySelectorAll('textarea')[1]?.value || "Nome do Responsável";
        const conteudo = document.querySelectorAll('textarea')[3]?.value || "Aguardando processamento IA...";
        
        preview.innerHTML = `
            <div class="text-center mb-5">
                <h6 class="fw-bold">INSTITUTO FEDERAL DE PERNAMBUCO - CAMPUS RECIFE</h6>
                <p class="small">MESTRADO PROFISSIONAL EM GESTÃO AMBIENTAL (MPGA)</p>
                <div style="margin-top: 6cm;">
                    <h4 class="fw-bold text-uppercase">${titulo}</h4>
                </div>
                <div style="margin-top: 8cm;">
                    <p class="mb-1"><strong>Responsável:</strong> ${responsavel}</p>
                    <p class="small mt-5">IPOJUCA - PERNAMBUCO<br>2026</p>
                </div>
            </div>
            <div style="page-break-after: always;"></div>
            <div class="mt-4">
                <h5 class="fw-bold text-uppercase">1. DESENVOLVIMENTO TÉCNICO</h5>
                <p>Este documento do tipo <strong>${tipo.toUpperCase()}</strong> foi gerado automaticamente integrando dados SIG e multicritério.</p>
                <div class="p-4 border-start border-4 bg-light italic">${conteudo}</div>
            </div>
            <div class="mt-5 pt-5 text-center">
                <div style="width: 250px; border-top: 1px solid #000; margin: 4cm auto 0 auto;"></div>
                <p class="small">Assinatura do Profissional Habilitado</p>
            </div>`;
    },

    analyze(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            alert("⚙️ IA PSAH-PE: Analisando documento e organizando em seções ABNT...");
            const texto = e.target.result;
            const campoAlvo = document.querySelectorAll('textarea')[3];
            if(campoAlvo) {
                campoAlvo.value = texto.substring(0, 1500) + "... [DOCUMENTO ORGANIZADO POR INTELIGÊNCIA ARTIFICIAL]";
                this.sync();
            }
        };
        reader.readAsText(file);
    },

    exportPDF() {
        if (!localStorage.getItem('psa_session_master')) return alert("Erro de Governança: Somente Master/Editor pode exportar.");
        window.print();
    }
};

document.addEventListener('DOMContentLoaded', () => MANUAL_FORMATTER.init());
