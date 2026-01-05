/**
 * gov-admin.js - Gestão Central de Governança
 */
const MASTER_AUTH = { user: "luanapessoa", pass: "psa2026-ifpe" };

// Banco de Dados Local de Usuários e Widgets
let govDB = {
    usuarios: JSON.parse(localStorage.getItem('psa_gov_users')) || [],
    widgets: JSON.parse(localStorage.getItem('psa_gov_widgets')) || { evento: "Seminário Ipojuca 2026", logo: "" }
};

function abrirLogin() {
    document.getElementById('loginContent').innerHTML = `
        <div class="modal-header bg-dark text-white"><h5>Acesso Seguro PSAH-PE</h5></div>
        <div class="modal-body">
            <input type="text" id="u" class="form-control mb-2" placeholder="Usuário">
            <input type="password" id="p" class="form-control mb-3" placeholder="Chave de Acesso">
            <button class="btn btn-success w-100" onclick="GOV_ADMIN.autenticar()">Entrar</button>
        </div>`;
    new bootstrap.Modal(document.getElementById('loginModal')).show();
}

const GOV_ADMIN = {
    autenticar() {
        const u = document.getElementById('u').value;
        const p = document.getElementById('p').value;

        if (u === MASTER_AUTH.user && p === MASTER_AUTH.pass) {
            localStorage.setItem('psa_session', 'MASTER');
            this.ativarModo('Master');
        } else {
            // Verifica na base de cadastrados
            const found = govDB.usuarios.find(user => user.nome === u && user.senha === p);
            if (found) {
                localStorage.setItem('psa_session', found.permissao);
                this.ativarModo(found.permissao);
            } else { alert("Acesso Negado."); }
        }
    },

    ativarModo(nivel) {
        alert(`Nível de Acesso: ${nivel} ativado.`);
        if (nivel === 'Master') {
            document.getElementById('adminTools').classList.remove('d-none');
            document.getElementById('adminUploadZone').classList.remove('d-none');
        }
        location.reload();
    },

    // Cadastro de Usuários (Master, Editor, Consulta)
    cadastrarUsuario(dados) {
        if (localStorage.getItem('psa_session') !== 'MASTER') return;
        govDB.usuarios.push({
            nome: dados.nome,
            doc: dados.doc, // CPF/CNPJ
            email: dados.email,
            permissao: dados.nivel,
            senha: "mudar123" // Senha padrão inicial
        });
        localStorage.setItem('psa_gov_users', JSON.stringify(govDB.usuarios));
    }
};

// Gerenciamento de Identidade Visual
function triggerLogoUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = e => {
        const reader = new FileReader();
        reader.onload = evt => {
            document.getElementById('siteLogo').src = evt.target.result;
            localStorage.setItem('psa_gov_logo', evt.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    };
    input.click();
}
