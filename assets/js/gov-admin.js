/**
 * gov-admin.js - Controle Central v7.0
 */
const MASTER_KEY = { user: "luanapessoa", pass: "psa2026-ifpe" };
let userDB = JSON.parse(localStorage.getItem('psa_users_v7')) || [];

function abrirPortal() {
    document.getElementById('loginContent').innerHTML = `
        <div class="modal-body p-5 text-center">
            <i class="fas fa-shield-alt fa-5x text-warning mb-4"></i>
            <h4 class="fw-bold mb-4">Acesso Soberano Luana Pessoa</h4>
            <input type="text" id="mUser" class="form-control mb-2" placeholder="Usuário">
            <input type="password" id="mPass" class="form-control mb-4" placeholder="Chave de Acesso">
            <button class="btn btn-primary btn-lg w-100 shadow fw-bold" onclick="GOV_ADMIN.login()">AUTENTICAR NO PORTAL</button>
        </div>`;
    new bootstrap.Modal(document.getElementById('loginModal')).show();
}

const GOV_ADMIN = {
    login() {
        const u = document.getElementById('mUser').value;
        const p = document.getElementById('mPass').value;
        if(u === MASTER_KEY.user && p === MASTER_KEY.pass) {
            localStorage.setItem('psa_session_master', 'true');
            this.ativarMaster();
        } else { alert("Acesso negado: Chave Master incorreta."); }
    },

    ativarMaster() {
        document.getElementById('masterPanel').classList.remove('d-none');
        document.getElementById('govTab').classList.remove('d-none');
        document.getElementById('sessionBadge').classList.remove('d-none');
        bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
        this.renderUsers();
        alert("Bem-vinda, Luana. Sistema de Governança 100% Ativado.");
    },

    uploadLogo(e) {
        const reader = new FileReader();
        reader.onload = evt => { 
            document.getElementById('brandingLogo').src = evt.target.result; 
            document.getElementById('brandingLogo').classList.remove('d-none'); 
            document.getElementById('mainIcon').classList.add('d-none'); 
            localStorage.setItem('psa_logo_data', evt.target.result);
        };
        reader.readAsDataURL(e.target.files[0]);
    },

    customizarCores() { 
        const c = prompt("Cor Master (HEX):", "#198754"); 
        if(c) document.documentElement.style.setProperty('--primary', c); 
    },

    setEvento() { 
        const e = prompt("Texto do Aviso Acadêmico:"); 
        if(e) { 
            document.getElementById('eventWidget').classList.remove('d-none'); 
            document.getElementById('eventTxt').textContent = e; 
        } 
    },

    saveUser() {
        const n = document.getElementById('uNome').value;
        const d = document.getElementById('uDoc').value;
        const e = document.getElementById('uEmail').value;
        const nv = document.getElementById('uNivel').value;
        if(!n || !d) return alert("Erro: Nome e CPF/CNPJ obrigatórios.");
        userDB.push({nome: n, doc: d, email: e, nivel: nv, status: 'Ativo'});
        localStorage.setItem('psa_users_v7', JSON.stringify(userDB));
        this.renderUsers();
        alert("Utilizador Registado com Sucesso.");
    },

    renderUsers() {
        document.getElementById('userTable').innerHTML = userDB.map((u, i) => `
            <tr>
                <td class="fw-bold">${u.nome}</td>
                <td><span class="badge ${u.nivel === 'Master' ? 'bg-danger' : 'bg-primary'}">${u.nivel}</span></td>
                <td>${u.doc}</td>
                <td>${u.email}</td>
                <td><button class="btn btn-xxs btn-danger" onclick="GOV_ADMIN.removeUser(${i})">Excluir</button></td>
            </tr>`).join('');
    },

    removeUser(i) {
        if(confirm("Remover este acesso?")) { userDB.splice(i, 1); localStorage.setItem('psa_users_v7', JSON.stringify(userDB)); this.renderUsers(); }
    },

    resetSystem() { if(confirm("⚠️ WIPE TOTAL: Apagar todos os utilizadores e logos?")) { localStorage.clear(); location.reload(); } }
};
