/**
 * assets/js/manual-formatter.js
 * Gerador de Documentos Técnicos ABNT (Manual e Relatório)
 */

const ManualFormatter = {
    // Campos Obrigatórios para Manual Técnico
    camposManual: ['titulo', 'autor', 'objetivo', 'metodologia', 'conclusao'],
    
    // Campos Obrigatórios para Relatório Ambiental
    camposRelatorio: ['projeto', 'responsavel_tecnico', 'art_numero', 'localizacao_coords', 'analise_impacto'],

    gerarPreview(tipo) {
        if (!localStorage.getItem('psa_user_logged')) return alert("Acesso negado. Por favor, faça login.");
        
        const contentArea = document.getElementById('manualPreview');
        let html = "";

        if (tipo === 'manual') {
            html = this.templateManual();
        } else {
            html = this.templateRelatorio();
        }

        contentArea.innerHTML = html;
        contentArea.className = "abnt-page shadow-lg fade-in";
    },

    templateManual() {
        return `
            <div class="abnt-document text-justify" style="font-family: 'Times New Roman', serif;">
                <div class="text-center fw-bold mb-5">MANUAL TÉCNICO DE EXECUÇÃO - PSA HÍDRICO</div>
                <p><strong>Autor:</strong> ${document.getElementById('docAuthor').value}</p>
                <p><strong>Objetivo:</strong> ${document.getElementById('docObjective').value}</p>
                <h5 class="mt-4">1. Metodologia de Cálculo (AHP/Saaty)</h5>
                <p>${document.getElementById('docMethodology').value}</p>
                <h5 class="mt-4">2. Conclusões e Recomendações</h5>
                <p>${document.getElementById('docConclusion').value}</p>
            </div>`;
    },

    templateRelatorio() {
        return `
            <div class="abnt-document" style="font-family: Arial, sans-serif;">
                <div class="text-center fw-bold text-uppercase mb-4">Relatório Técnico Ambiental</div>
                <div class="border p-2 mb-3 bg-light">
                    <p class="mb-1"><strong>Projeto:</strong> ${document.getElementById('repProject').value}</p>
                    <p class="mb-1"><strong>Responsável Técnico (ART):</strong> ${document.getElementById('repART').value}</p>
                    <p class="mb-1"><strong>Coordenadas SIG:</strong> ${document.getElementById('repCoords').value}</p>
                </div>
                <h6 class="fw-bold">Análise de Impactos Identificados:</h6>
                <p>${document.getElementById('repImpact').value}</p>
            </div>`;
    }
};
