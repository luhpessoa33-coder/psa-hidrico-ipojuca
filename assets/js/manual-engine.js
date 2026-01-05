/**
 * assets/js/manual-engine.js
 * Motor de Governança Documental - PSAH-PE
 */

const MANUAL_ENGINE = {
    // Definição de Regras Estritas
    templates: {
        manual: {
            nome: "Manual Técnico de Execução",
            norma: "ABNT NBR 14724:2011",
            campos: [
                { id: 'm_titulo', label: 'Título do Manual', type: 'text', placeholder: 'Ex: Manual de Monitoramento de Nascentes', required: true },
                { id: 'm_autor', label: 'Responsável Técnico', type: 'text', placeholder: 'Nome Completo', required: true },
                { id: 'm_crea', label: 'Registro Profissional (CREA/CRBio)', type: 'text', placeholder: 'Nº do Registro', required: true },
                { id: 'm_objetivo', label: 'Objetivo Geral', type: 'textarea', required: true },
                { id: 'm_metodologia', label: 'Metodologia Aplicada (Saaty)', type: 'textarea', required: true },
                { id: 'm_conclusao', label: 'Recomendações Técnicas', type: 'textarea', required: true }
            ]
        },
        relatorio: {
            nome: "Relatório Técnico Ambiental",
            norma: "ABNT NBR 10719:2011",
            campos: [
                { id: 'r_projeto', label: 'Nome do Projeto PSA', type: 'text', required: true },
                { id: 'r_art', label: 'Número da ART', type: 'text', required: true },
                { id: 'r_coordenadas', label: 'Coordenadas Geográficas (SIRGAS)', type: 'text', placeholder: 'Lat/Long decimais', required: true },
                { id: 'r_impacto', label: 'Análise de Impacto Identificado', type: 'textarea', required: true },
                { id: 'r_diagnostico', label: 'Diagnóstico da Área', type: 'textarea', required: true }
            ]
        }
    },

    // Inicia o formulário baseado na escolha do usuário
    carregarModelo() {
        const tipo = document.getElementById('docType').value;
        const config = this.templates[tipo];
        const container = document.getElementById('formFields');
        
        container.innerHTML = `<h6>Regras de Preenchimento (${config.norma})</h6>`;
        
        config.campos.forEach(campo => {
            const input = campo.type === 'textarea' 
                ? `<textarea id="${campo.id}" class="form-control form-control-sm mb-2" rows="3" oninput="MANUAL_ENGINE.syncPreview()"></textarea>`
                : `<input type="${campo.type}" id="${campo.id}" class="form-control form-control-sm mb-2" placeholder="${campo.placeholder || ''}" oninput="MANUAL_ENGINE.syncPreview()">`;
            
            container.innerHTML += `
                <div class="mb-2">
                    <label class="small fw-bold">${campo.label} ${campo.required ? '<span class="text-danger">*</span>' : ''}</label>
                    ${input}
                </div>`;
        });

        this.syncPreview();
    },

    // Sincronização em Tempo Real com a "Página Digital"
    syncPreview() {
        const tipo = document.getElementById('docType').value;
        const preview = document.getElementById('manualPreview');
        
        if (tipo === 'manual') {
            preview.innerHTML = `
                <div class="abnt-content">
                    <div class="text-center fw-bold text-uppercase mb-5">
                        Instituto Federal de Pernambuco - MPGA<br>
                        ${document.getElementById('m_titulo')?.value || '[TÍTULO DO MANUAL]'}
                    </div>
                    <p><strong>Responsável:</strong> ${document.getElementById('m_autor')?.value || '___'}</p>
                    <p><strong>Registro:</strong> ${document.getElementById('m_crea')?.value || '___'}</p>
                    <h5 class="mt-4">1. OBJETIVO</h5>
                    <p>${document.getElementById('m_objetivo')?.value || 'Aguardando preenchimento...'}</p>
                    <h5 class="mt-4">2. METODOLOGIA</h5>
                    <p>${document.getElementById('m_metodologia')?.value || 'O conteúdo do arquivo subido será injetado aqui.'}</p>
                </div>`;
        } else {
            preview.innerHTML = `
                <div class="abnt-content">
                    <div class="text-center fw-bold mb-4">RELATÓRIO TÉCNICO AMBIENTAL - PSAH-PE</div>
                    <div class="border p-3 bg-light mb-3">
                        <strong>Projeto:</strong> ${document.getElementById('r_projeto')?.value || '___'}<br>
                        <strong>ART:</strong> ${document.getElementById('r_art')?.value || '___'}<br>
                        <strong>Localização:</strong> ${document.getElementById('r_coordenadas')?.value || '___'}
                    </div>
                    <h6>DIAGNÓSTICO E IMPACTO:</h6>
                    <p>${document.getElementById('r_impacto')?.value || 'Aguardando preenchimento...'}</p>
                </div>`;
        }
    },

    // Validação de Campos Obrigatórios e Alertas de Governança
    validarEExportar() {
        const tipo = document.getElementById('docType').value;
        const config = this.templates[tipo];
        let erros = [];

        config.campos.forEach(campo => {
            const val = document.getElementById(campo.id).value;
            if (campo.required && !val) erros.push(campo.label);
        });

        if (erros.length > 0) {
            alert(`⚠️ ALERTA DE GOVERNANÇA:\nOs seguintes campos obrigatórios estão vazios:\n- ${erros.join('\n- ')}`);
        } else {
            alert("✅ Validação Científica Concluída. Gerando arquivo...");
            window.print(); // Simulação de exportação para PDF preservando estilo
        }
    },

    // Integração de Arquivo Externo no Template
    processarUploadParaTemplate(texto) {
        const tipo = document.getElementById('docType').value;
        if (tipo === 'manual') {
            const campo = document.getElementById('m_metodologia');
            if (campo) {
                campo.value = texto;
                this.syncPreview();
                alert("ℹ️ O conteúdo do arquivo foi configurado automaticamente para a seção de Metodologia do Manual.");
            }
        }
    }
};

// Inicialização automática ao carregar a página
document.addEventListener('DOMContentLoaded', () => MANUAL_ENGINE.carregarModelo());
