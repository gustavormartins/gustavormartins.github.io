const username = 'gustavormartins';

document.addEventListener('DOMContentLoaded', () => {
    getProfile();
    getRepos();
});

// 1. Pega Foto e Dados do Perfil
async function getProfile() {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const data = await response.json();
    
    document.getElementById('profile-wrapper').innerHTML = `
        <img src="${data.avatar_url}" alt="${data.name}" class="profile-img">
    `;
}

// 2. Pega os Repositórios (Ordenados por última atualização)
async function getRepos() {
    // Pega repositórios ordenados por update
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`);
    const repos = await response.json();
    
    const container = document.getElementById('repos-grid');
    container.innerHTML = ''; // Limpa o loading

    // Filtra repositórios forkados se quiser (opcional)
    // const myRepos = repos.filter(repo => !repo.fork); 

    repos.forEach(repo => {
        // Se não tiver descrição, coloca uma padrão
        const description = repo.description ? repo.description : "Projeto em desenvolvimento focado em tecnologia e infraestrutura.";
        
        // Define linguagem principal
        const lang = repo.language ? repo.language : "Dev";

        const card = `
            <div class="repo-card">
                <span class="repo-lang">${lang}</span>
                <h3>${repo.name}</h3>
                <p>${description}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <a href="${repo.html_url}" target="_blank" class="repo-link">VER CÓDIGO_ -></a>
                    <span style="color:#666; font-size:0.8rem;"><i class="fas fa-star" style="color:var(--blohsh-green)"></i> ${repo.stargazers_count}</span>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}
