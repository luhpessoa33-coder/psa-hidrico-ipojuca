/**
 * assets/js/manual-engine.js
 * MOTOR DE GOVERNANÇA DOCUMENTAL - PSAH-PE IPOJUCA
 * Lógica de Automação ABNT para Manuais e Relatórios Técnicos
 */

const MANUAL_ENGINE = {
    // 1. DEFINIÇÃO DE TEMPLATES E REGRAS
    templates: {
        manual: {
            nome: "Manual Técnico de Execução",
            norma: "ABNT NBR 14724:2011",
            cor: "#198754",
            campos: [
                { id: 'm_titulo', label: 'Título do Manual', type: 'text', placeholder: 'Ex: Guia de Monitoramento de Nascentes', required: true },
                { id: 'm_autor', label: 'Responsável Técnico', type: 'text', placeholder: 'Nome Completo', required: true },
                { id: 'm_registro', label: 'Registro Profissional (CREA/CRBio)', type: 'text', placeholder: 'Nº do Registro', required: true },
                { id: 'm_objetivo', label: 'Objetivo do Manual', type: 'textarea', placeholder: 'Descreva a finalidade deste guia...', required: true },
                { id: 'm_metodologia', label: 'Metodologia (Saaty/SIG)', type: 'textarea', placeholder: 'Detalhes do processamento...', required: true },
                { id: 'm_conclusao', label: 'Considerações Finais', type: 'textarea', placeholder: 'Recomendações técnicas...', required: true }
            ]
        },
        relatorio: {
            nome: "Relatório Técnico Ambiental",
            norma: "ABNT NBR 10719:2011",
            cor: "#0d6efd",
            campos: [
                { id: 'r_projeto', label: 'Nome do Projeto PSA', type: 'text', placeholder: 'Ex: Projeto Ipojuca Sustentável', required: true },
                { id: 'r_art', label: 'Número da ART/AFT', type: 'text', placeholder: 'Número do documento legal', required: true },
                { id: 'r_local', label: 'Coordenadas da Área (SIRGAS 2000)', type: 'text', placeholder: 'Lat/Long ou UTM', required: true },
                { id: 'r_diagnostico', label: 'Diagnóstico Ambiental', type: 'textarea', placeholder: 'Estado atual da área...', required: true },
                { id: 'r_impacto', label: 'Análise de Impacto/Prioridade', type: 'textarea', placeholder: 'Resultados da análise MCDA...', required: true }
            ]
        }
    },

    // 2. INICIALIZAÇÃO E CARREGAMENTO DINÂMICO
    carregarModelo() {
        const tipo = document.getElementById('docType').value;
        const config = this.templates[tipo];
        const container = document.getElementById('formFields');
        
        // Limpa e Reconstrói o formulário lateral
        container.innerHTML = `
            <div class="alert alert-info py-2 small mb-3">
                <i class="fas fa-info-circle"></i> <strong>Padrão:</strong> ${config.norma}
            </div>`;
        
        config.campos.forEach(campo => {
            const inputHtml = campo.type === 'textarea' 
                ? `<textarea id="${campo.id}" class="form-control form-control-sm mb-2" rows="3" oninput="MANUAL_ENGINE.sync()"></textarea>`
                : `<input type="${campo.type}" id="${campo.id}" class="form-control form-control-sm mb-2" placeholder="${campo.placeholder}" oninput="MANUAL_ENGINE.sync()">`;
            
            container.innerHTML += `
                <div class="mb-2">
                    <label class="x-small fw-bold text-uppercase text-muted">${campo.label} ${campo.required ? '<span class="text-danger">*</span>' : ''}</label>
                    ${inputHtml}
                </div>`;
        });

        this.sync(); // Atualiza o preview inicial
    },

    // 3. SINCRONIZAÇÃO EM TEMPO REAL COM A PÁGINA A4
    sync() {
        const tipo = document.getElementById('docType').value;
        const preview = document.getElementById('manualPreview');
        
        if (tipo === 'manual') {
            this.renderManualPreview(preview);
        } else {
            this.renderRelatorioPreview(preview);
        }
    },

    renderManualPreview(el) {
        el.innerHTML = `
            <div class="text-center mb-5">
                <h6 class="fw-bold">INSTITUTO FEDERAL DE PERNAMBUCO - CAMPUS RECIFE</h6>
                <p class="small">MESTRADO PROFISSIONAL EM GESTÃO AMBIENTAL (MPGA)</p>
                <div style="margin-top: 8cm;">
                    <h4 class="fw-bold text-uppercase">${document.getElementById('m_titulo')?.value || '[TÍTULO DO MANUAL]'}</h4>
                </div>
                <div style="margin-top: 8cm;">
                    <p class="mb-1"><strong>Responsável:</strong> ${document.getElementById('m_autor')?.value || '___'}</p>
                    <p><strong>Registro Profissional:</strong> ${document.getElementById('m_registro')?.value || '___'}</p>
                    <p class="small mt-5">IPOJUCA - PERNAMBUCO<br>2026</p>
                </div>
            </div>
            <div style="page-break-after: always;"></div>
            <div class="mt-4">
                <h5 class="fw-bold text-uppercase">1. OBJETIVO GERAL</h5>
                <p>${document.getElementById('m_objetivo')?.value || 'Aguardando preenchimento...'}</p>
                <h5 class="fw-bold text-uppercase mt-4">2. METODOLOGIA E PROCESSAMENTO</h5>
                <p>${document.getElementById('m_metodologia')?.value || 'Os dados técnicos serão injetados aqui.'}</p>
                <h5 class="fw-bold text-uppercase mt-4">3. CONSIDERAÇÕES TÉCNICAS</h5>
                <p>${document.getElementById('m_conclusao')?.value || '...'}</p>
            </div>
        `;
    },

    renderRelatorioPreview(el) {
        el.innerHTML = `
            <div class="text-center mb-4">
                <h5 class="fw-bold">RELATÓRIO TÉCNICO AMBIENTAL - PSAH-PE</h5>
                <small>Sistema de Suporte à Decisão Georreferenciado</small>
            </div>
            <div class="border p-3 bg-light mb-4 shadow-sm" style="border-left: 5px solid #0d6efd !important;">
                <p class="mb-1"><strong>PROJETO:</strong> ${document.getElementById('r_projeto')?.value || '___'}</p>
                <p class="mb-1"><strong>Nº ART/DOCUMENTO:</strong> ${document.getElementById('r_art')?.value || '___'}</p>
                <p class="mb-0"><strong>COORDENADAS ÁREA:</strong> ${document.getElementById('r_local')?.value || '___'}</p>
            </div>
            <h6 class="fw-bold text-uppercase">1. DIAGNÓSTICO DA ÁREA</h6>
            <p>${document.getElementById('r_diagnostico')?.value || 'Aguardando dados...'}</p>
            <h6 class="fw-bold text-uppercase mt-4">2. ANÁLISE DE IMPACTO E PRIORIDADE</h6>
            <p>${document.getElementById('r_impacto')?.value || 'Aguardando processamento estatístico...'}</p>
            <div class="mt-5 pt-5 text-center">
                <div style="width: 200px; border-top: 1px solid #000; margin: 0 auto;"></div>
                <p class="small">Assinatura do Responsável Técnico</p>
            </div>
        `;
    },

    // 4. VALIDAÇÃO DE CAMPOS E EXPORTAÇÃO
    validarEExportar() {
        // Verifica se o usuário está logado (Governança Master)
        if (!localStorage.getItem('psa_session_active')) {
            alert("⚠️ ACESSO NEGADO: Apenas usuários autenticados (Editor/Master) podem gerar documentos oficiais.");
            return;
        }

        const tipo = document.getElementById('docType').value;
        const config = this.templates[tipo];
        let faltantes = [];

        config.campos.forEach(campo => {
            const input = document.getElementById(campo.id);
            if (campo.required && (!input || !input.value.trim())) {
                faltantes.push(campo.label);
            }
        });

        if (faltantes.length > 0) {
            alert(`⚠️ ALERTA DE INTEGRIDADE:\nOs seguintes campos são obrigatórios para emissão do documento:\n- ${faltantes.join('\n- ')}`);
        } else {
            alert("✅ Validação Científica Concluída.\nO documento será gerado seguindo as normas ABNT.");
            window.print(); // O CSS já está configurado para ocultar a interface e mostrar apenas a página A4
        }
    },

    // 5. INTEGRAÇÃO DE ARQUIVO (UPLOAD -> CAMPO)
    processarTextoSubido(texto) {
        const tipo = document.getElementById('docType').value;
        const alvo = tipo === 'manual' ? 'm_metodologia' : 'r_diagnostico';
        const campo = document.getElementById(alvo);
        
        if (campo) {
            campo.value = texto;
            this.sync();
            alert("ℹ️ Informação: O conteúdo do arquivo subido foi integrado ao campo de texto do documento.");
        }
    }
};

// Inicialização ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => MANUAL_ENGINE.carregarModelo());
