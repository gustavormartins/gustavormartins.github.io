document.addEventListener('DOMContentLoaded', () => {
    fetch('./json/projects.json')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('project-container');
            data.projects.forEach(project => {
                const card = `
                    <div class="project-card">
                        <h3>${project.title}</h3>
                        <p>${project.description}</p>
                        <div class="tech-tags">
                            ${project.tech.map(t => `<span>${t}</span>`).join('')}
                        </div>
                        <a href="${project.link}" target="_blank">Ver Missão →</a>
                    </div>
                `;
                container.innerHTML += card;
            });
        })
        .catch(error => console.error('Erro ao carregar os dados estelares:', error));
});
// Busca a foto e dados do perfil
fetch('https://api.github.com/users/gustavormartins')
    .then(res => res.json())
    .then(data => {
        const header = document.querySelector('header .container');
        // Insere a foto antes do H1
        const img = document.createElement('img');
        img.src = data.avatar_url;
        img.alt = "Foto de Perfil";
        img.className = "profile-pic";
        header.prepend(img);

img.className = "profile-pic neon-flicker";

document.addEventListener('DOMContentLoaded', () => {
    // Busca foto do perfil via API do GitHub
    fetch('https://api.github.com/users/gustavormartins')
        .then(res => res.json())
        .then(data => {
            const profileArea = document.getElementById('profile-area');
            profileArea.innerHTML = `<img src="${data.avatar_url}" class="profile-pic neon-flicker" alt="Gustavo Martins">`;
        });

    // Carrega projetos do JSON
    fetch('./json/projects.json')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('project-container');
            container.innerHTML = data.projects.map(p => `
                <div class="project-card floating-card">
                    <h3 style="color: var(--neon-blue); margin-bottom: 10px;">${p.title}</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 15px;">${p.description}</p>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        ${p.tech.map(t => `<span style="font-size: 0.7rem; border: 1px solid var(--border-color); padding: 2px 8px;">${t}</span>`).join('')}
                    </div>
                </div>
            `).join('');
        });
    });
