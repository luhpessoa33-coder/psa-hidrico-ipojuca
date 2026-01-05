/**
 * assets/js/gov-admin.js
 * SISTEMA DE GOVERNANÇA E GESTÃO MASTER - PSAH-PE IPOJUCA
 * Desenvolvido para: Luana Pessoa (Master)
 */

// 1. CONFIGURAÇÕES DE ACESSO E ESTADO INICIAL
const MASTER_CONFIG = {
    user: "luanapessoa",
    pass: "psa2026-ifpe"
};

// Inicializa a base de dados de usuários no LocalStorage se não existir
if (!localStorage.getItem('psa_gov_users')) {
    const usuariosIniciais = [
        { nome: "Administrador Geral", doc: "000.000.000-00", email: "admin@ifpe.edu.br", tel: "8199999999", nivel: "Master", senha: "psa2026-ifpe" }
    ];
    localStorage.setItem('psa_gov_users', JSON.stringify(usuariosIniciais));
}

// 2. SISTEMA DE AUTENTICAÇÃO MULTINÍVEL
function abrirPortal() {
    const loginContent = document.getElementById('loginContent');
    loginContent.innerHTML = `
        <div class="modal-body p-5 text-center">
            <i class="fas fa-user-shield fa-4x text-success mb-4"></i>
            <h4 class="fw-bold mb-4">Portal de Governança</h4>
            <div class="form-floating mb-2">
                <input type="text" id="userInput" class="form-control" placeholder="Usuário">
                <label>Utilizador ou E-mail</label>
            </div>
            <div class="form-floating mb-4">
                <input type="password" id="passInput" class="form-control" placeholder="Senha">
                <label>Chave de Acesso</label>
            </div>
            <button class="btn btn-success btn-lg w-100 shadow" onclick="GOV_ADMIN.login()">
                <i class="fas fa-sign-in-alt"></i> Entrar no Sistema
            </button>
        </div>
    `;
    new bootstrap.Modal(document.getElementById('loginModal')).show();
}

const GOV_ADMIN = {
    login() {
        const u = document.getElementById('userInput').value;
        const p = document.getElementById('passInput').value;
        const users = JSON.parse(localStorage.getItem('psa_gov_users'));

        // Validação Master
        if (u === MASTER_CONFIG.user && p === MASTER_CONFIG.pass) {
            this.setSession({ nome: "Luana Pessoa", nivel: "Master" });
            return;
        }

        // Validação Usuários Cadastrados
        const userFound = users.find(user => (user.nome === u || user.email === u) && user.senha === p);
        if (userFound) {
            this.setSession(userFound);
        } else {
            alert("⚠️ Acesso Negado: Credenciais inválidas ou sem autorização.");
        }
    },

    setSession(user) {
        localStorage.setItem('psa_session_active', JSON.stringify(user));
        alert(`Bem-vinda(o), ${user.nome}. Nível de acesso: ${user.nivel}`);
        location.reload();
    },

    logout() {
        if (confirm("Deseja encerrar a sessão de governança?")) {
            localStorage.removeItem('psa_session_active');
            location.reload();
        }
    }
};

// 3. GESTÃO DE INTERFACE E PERMISSÕES (DOM)
document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('psa_session_active'));
    
    if (session) {
        // Mostra elementos conforme nível
        document.getElementById('userLevelBadge').textContent = `Nível: ${session.nivel}`;
        document.getElementById('userLevelBadge').classList.remove('d-none');
        
        if (session.nivel === "Master") {
            document.getElementById('masterPanel').classList.remove('d-none');
            document.getElementById('adminTabLink')?.classList.remove('d-none');
            renderizarListaUsuarios();
        }
        
        if (session.nivel === "Editor" || session.nivel === "Master") {
            document.getElementById('adminOnlyUpload')?.classList.remove('d-none');
        }
    }

    // Carrega Personalizações (Logo e Cores)
    aplicarPersonalizacoes();
    renderizarWidgets();
});

// 4. GESTÃO DE USUÁRIOS (MASTER ONLY)
function cadastrarUsuario() {
    const nome = document.getElementById('uNome').value;
    const doc = document.getElementById('uDoc').value;
    const email = document.getElementById('uEmail').value;
    const tel = document.getElementById('uTel').value;
    const nivel = document.getElementById('uNivel').value;

    if (!nome || !doc || !email) return alert("Por favor, preencha os campos obrigatórios (*)");

    const users = JSON.parse(localStorage.getItem('psa_gov_users'));
    users.push({ nome, doc, email, tel, nivel, senha: "psa" + doc.substring(0,3) });
    
    localStorage.setItem('psa_gov_users', JSON.stringify(users));
    alert("✅ Usuário cadastrado. Senha padrão: psa + 3 primeiros dígitos do documento.");
    renderizarListaUsuarios();
}

function renderizarListaUsuarios() {
    const lista = document.getElementById('listaUsuariosAdmin');
    const users = JSON.parse(localStorage.getItem('psa_gov_users'));
    if (!lista) return;

    lista.innerHTML = users.map((u, index) => `
        <tr class="align-middle">
            <td><strong>${u.nome}</strong><br><small class="text-muted">${u.email}</small></td>
            <td>${u.doc}</td>
            <td><span class="badge ${u.nivel === 'Master' ? 'bg-danger' : 'bg-primary'}">${u.nivel}</span></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger" onclick="removerUsuario(${index})"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

function removerUsuario(index) {
    if (confirm("Excluir este acesso permanentemente?")) {
        const users = JSON.parse(localStorage.getItem('psa_gov_users'));
        users.splice(index, 1);
        localStorage.setItem('psa_gov_users', JSON.stringify(users));
        renderizarListaUsuarios();
    }
}

// 5. PERSONALIZAÇÃO: LOGO, CORES E WIDGETS
function handleLogoUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
        const logoBase64 = e.target.result;
        localStorage.setItem('psa_custom_logo', logoBase64);
        aplicarPersonalizacoes();
    };
    reader.readAsDataURL(file);
}

function aplicarPersonalizacoes() {
    const savedLogo = localStorage.getItem('psa_custom_logo');
    if (savedLogo) {
        document.getElementById('siteLogo').src = savedLogo;
        document.getElementById('siteLogo').classList.remove('d-none');
        document.getElementById('defaultIcon').classList.add('d-none');
    }

    const savedColor = localStorage.getItem('psa_theme_color');
    if (savedColor) {
        document.documentElement.style.setProperty('--primary', savedColor);
    }
}

function alterarCoresSite() {
    const cor = prompt("Insira o código HEX da nova cor master (Ex: #003366):", "#198754");
    if (cor && /^#[0-9A-F]{6}$/i.test(cor)) {
        localStorage.setItem('psa_theme_color', cor);
        location.reload();
    } else {
        alert("Código de cor inválido.");
    }
}

// 6. GESTÃO DE WIDGETS (EVENTOS E AVISOS)
function abrirModalEvento() {
    const novoEvento = prompt("Insira o texto do Anúncio/Evento:");
    if (novoEvento) {
        localStorage.setItem('psa_event_text', novoEvento);
        renderizarWidgets();
    }
}

function renderizarWidgets() {
    const evento = localStorage.getItem('psa_event_text');
    const badge = document.getElementById('eventPulse');
    const text = document.getElementById('eventText');

    if (evento && badge) {
        badge.classList.remove('d-none');
        text.textContent = evento;
    }
}

function confirmarLimpezaTotal() {
    if (confirm("⚠️ ATENÇÃO: Esta ação apagará todos os cadastros, logos e rascunhos de relatórios. Continuar?")) {
        localStorage.clear();
        location.reload();
    }
}
