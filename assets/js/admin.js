/**
 * assets/js/admin.js - Gestão de Governança
 */
let usuariosDB = JSON.parse(localStorage.getItem('psa_users_registry')) || [];

function gerenciarPermissoes() {
    const novoUser = {
        nome: document.getElementById('uNome').value,
        documento: document.getElementById('uDoc').value, // CPF ou CNPJ
        email: document.getElementById('uEmail').value,
        telefone: document.getElementById('uTel').value,
        permissao: document.getElementById('uNivel').value // Master, Editor, Consulta
    };

    if (!validarDoc(novoUser.documento)) return alert("Documento Inválido.");

    usuariosDB.push(novoUser);
    localStorage.setItem('psa_users_registry', JSON.stringify(usuariosDB));
    renderizarTabelaUsuarios();
}

function renderizarTabelaUsuarios() {
    const lista = document.getElementById('listaUsersAdmin');
    lista.innerHTML = usuariosDB.map(u => `
        <tr>
            <td>${u.nome}</td>
            <td>${u.permissao}</td>
            <td>
                <button class="btn btn-xxs btn-danger" onclick="removerUser('${u.documento}')">Excluir</button>
            </td>
        </tr>
    `).join('');
}
