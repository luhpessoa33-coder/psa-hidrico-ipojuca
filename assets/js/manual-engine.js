/**
 * Motor de Governança Documental e IA v6.0
 */
const MANUAL_ENGINE = {
    campos: {
        manual: ["Título Oficial", "Responsável Técnico", "CREA/CRBio", "Resumo Metodológico", "Metas PSA"],
        relatorio: ["Projeto Ipojuca PSA", "Número ART", "Coordenadas SIRGAS", "Análise de Sensibilidade", "Conclusão Ambiental"]
    },

    setupTemplate() {
        const t = document.getElementById('docType').value;
        const container = document.getElementById('aiInputs');
        container.innerHTML = this.campos[t].map(c => `
            <div class="mb-2">
                <label class="x-small fw-bold text-uppercase text-muted">${c} *</label>
                <textarea id="f_${c.replace(/\s/g,'')}" class="form-control form-control-sm" rows="2" oninput="MANUAL_ENGINE.sync()"></textarea>
            </div>
        `).join('');
        this.sync();
    },

    sync() {
        const preview = document.getElementById('abntPreview');
        const tipo = document.getElementById('docType').value;
        const titulo = document.querySelector('textarea')?.value || "TÍTULO DO DOCUMENTO";
        
        preview.innerHTML = `
            <div class="text-center fw-bold mb-5">
                INSTITUTO FEDERAL DE PERNAMBUCO | CAMPUS RECIFE<br>
                MESTRADO EM GESTÃO AMBIENTAL (MPGA)
            </div>
            <h4 class="text-center text-uppercase border-bottom pb-4">${titulo}</h4>
            <div class="mt-5">
                <p><strong>NATUREZA:</strong> ${tipo.toUpperCase()} DE PSA HÍDRICO</p>
                <p class="mt-4 text-justify">Este produto técnico constitui a base metológica para a implementação de Programas de Pagamentos por Serviços Ambientais na Bacia do Rio Ipojuca.</p>
                <div class="p-4 border bg-light mt-4 italic">${document.querySelectorAll('textarea')[3]?.value || 'Aguardando processamento de texto...'}</div>
            </div>`;
    },

    analyzeFile(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            alert("IA Analisando Arquivo: Organizando conteúdo em seções ABNT...");
            const texto = e.target.result;
            // Simulação de organização por IA: Injetando no campo de metodologia
            const campo = document.querySelectorAll('textarea')[3];
            if(campo) campo.value = texto.substring(0, 500) + "... [Organizado via IA]";
            this.sync();
        };
        reader.readAsText(file);
    },

    exportPDF() {
        if (!localStorage.getItem('psa_session_master')) return alert("Erro: Somente usuários MASTER podem exportar documentos.");
        window.print();
    },

    openGoogleDocs() {
        // Link para template ABNT público para o usuário copiar
        const templateURL = "https://docs.google.com/document/d/1B0X1x_VnScl8Gv8O7p_Xm-x7l_wP5T6k_Fq7oFk_W8o/copy";
        window.open(templateURL, '_blank');
        alert("O sistema abriu um modelo ABNT no seu Google Docs. Copie e cole os textos gerados pela IA acima.");
    }
};

document.addEventListener('DOMContentLoaded', () => MANUAL_ENGINE.setupTemplate());
