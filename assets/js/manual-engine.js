/**
 * Motor IA Documental e ABNT v6.0 (Unifica manual-formatter)
 */
const MANUAL_ENGINE = {
    secoes: {
        manual: ["Título do Manual*", "Responsável Técnico (CREA)*", "Metodologia de Priorização*", "Resultados Geospaciais*", "Normas de Execução"],
        relatorio: ["Projeto PSA Ipojuca*", "Nº ART/Documento*", "Coordenadas SIRGAS 2000*", "Análise de Impacto*", "Conclusão Ambiental"]
    },

    setupTemplate() {
        const t = document.getElementById('docType').value;
        const container = document.getElementById('aiInputs');
        container.innerHTML = `<h6>Preenchimento Obrigatório</h6>` + 
            this.secoes[t].map(c => `
                <div class="mb-3">
                    <label class="x-small fw-bold text-uppercase text-muted">${c}</label>
                    <textarea id="f_${c.replace(/[* ]/g,'')}" class="form-control form-control-sm shadow-inner" rows="3" oninput="MANUAL_ENGINE.sync()"></textarea>
                </div>
            `).join('');
        this.sync();
    },

    sync() {
        const preview = document.getElementById('abntPreview');
        const tipo = document.getElementById('docType').value;
        const titulo = document.querySelector('textarea')?.value || "TÍTULO DO DOCUMENTO";
        const responsavel = document.querySelectorAll('textarea')[1]?.value || "Nome do Responsável";
        const metodologia = document.querySelectorAll('textarea')[3]?.value || "Aguardando preenchimento ou análise da IA...";
        
        preview.innerHTML = `
            <div class="text-center mb-5">
                <h6 class="fw-bold">INSTITUTO FEDERAL DE PERNAMBUCO | CAMPUS RECIFE</h6>
                <p class="small">MESTRADO PROFISSIONAL EM GESTÃO AMBIENTAL (MPGA)</p>
                <div style="margin-top: 6cm;">
                    <h4 class="fw-bold text-uppercase">${titulo}</h4>
                </div>
                <div style="margin-top: 8cm;">
                    <p class="mb-1"><strong>Responsável:</strong> ${responsavel}</p>
                    <p class="small mt-5">IPOJUCA - PERNAMBUCO<br>2026</p>
                </div>
            </div>
            <div style="page-break-after: always; height: 1px;"></div>
            <div class="mt-4">
                <h5 class="fw-bold text-uppercase mb-4">1. INTRODUÇÃO E OBJETIVO</h5>
                <p>Este documento constitui produto técnico de suporte à decisão para implementação de PSA Hídrico na Bacia do Rio Ipojuca, sob o tipo <strong>${tipo.toUpperCase()}</strong>.</p>
                <h5 class="fw-bold text-uppercase mt-5 mb-4">2. DESENVOLVIMENTO TÉCNICO</h5>
                <div class="p-3 border-start border-4 bg-light shadow-inner">${metodologia}</div>
            </div>
            <div class="mt-5 pt-5 text-center">
                <div style="width: 250px; border-top: 1px solid #000; margin: 4cm auto 0 auto;"></div>
                <p class="small">Assinatura do Responsável Técnico</p>
            </div>`;
    },

    analyzeFile(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            alert("⚙️ IA Iniciando Análise de Conteúdo...");
            const texto = e.target.result;
            // Simulação de IA organizando o texto e injetando na seção 3 (Metodologia/Impacto)
            const campoAlvo = document.querySelectorAll('textarea')[3];
            if(campoAlvo) {
                campoAlvo.value = texto.substring(0, 1000) + "... [CONTEÚDO ANALISADO E ORGANIZADO PELA IA PSA-IPOJUCA]";
                this.sync();
            }
        };
        reader.readAsText(file);
    },

    exportPDF() {
        if (!localStorage.getItem('psa_session_master')) return alert("Ação bloqueada: Apenas usuários MASTER podem emitir documentos finais.");
        window.print();
    },

    openGoogleDocs() {
        window.open("https://docs.google.com/document/d/1B0X1x_VnScl8Gv8O7p_Xm-x7l_wP5T6k_Fq7oFk_W8o/copy", '_blank');
        alert("O sistema abriu um modelo ABNT no Google Docs. Transfira o conteúdo gerado pela IA para edição final.");
    }
};

document.addEventListener('DOMContentLoaded', () => MANUAL_ENGINE.setupTemplate());
