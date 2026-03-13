document.addEventListener('DOMContentLoaded', () => {
    // 1. Injetar Foto do GitHub no Header
    fetch('https://api.github.com/users/gustavormartins')
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('profile-img-container');
            // Usa a classe correta do CSS
            container.innerHTML = `<img src="${data.avatar_url}" class="profile-pic-header" alt="Gustavo Martins">`;
        });

    // 2. Carregar Projetos no Grid
    fetch('./json/projects.json')
        .then(res => res.json())
        .then(data => {
            const grid = document.getElementById('project-grid');
            // Mapeia os projetos para o formato de mini-card profissional
            grid.innerHTML = data.projects.map(p => `
                <div class="mini-project-card">
                    <h3>${p.title}</h3>
                    <p style="font-size: 0.9rem; margin-bottom: 15px;">${p.description}</p>
                    <div class="tech-stack">
                        ${p.tech.map(t => `<span>#${t}</span>`).join('')}
                    </div>
                    <a href="${p.link}" target="_blank" style="display: block; margin-top: 15px; color: var(--text-primary); text-decoration: none; font-weight: bold; font-size: 0.9rem;">Ver Projeto →</a>
                </div>
            `).join('');
        });
});
