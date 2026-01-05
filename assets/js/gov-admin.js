const GOV_CONFIG = {
    master: "luanapessoa",
    pass: "psa2026-ifpe"
};

function gerenciarIdentidade(usuario) {
    // Cadastro Multinível: CPF/CNPJ, Email, Tel
    const novaPermissao = {
        nome: usuario.nome,
        documento: usuario.doc,
        nivel: usuario.permissao // Master, Editor, Consulta
    };
    
    if(novaPermissao.nivel === "Master") {
        document.getElementById('adminTools').classList.remove('d-none');
        document.getElementById('adminOnlyUpload').classList.remove('d-none');
    }
}

/**
 * Upload de Logo Profissional
 */
function triggerLogoUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = evt => {
            document.getElementById('siteLogo').src = evt.target.result;
            document.getElementById('siteLogo').classList.remove('d-none');
            document.getElementById('defaultLogo').classList.add('d-none');
            localStorage.setItem('psa_custom_logo', evt.target.result);
        };
        reader.readAsDataURL(file);
    };
    input.click();
}
