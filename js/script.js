document.addEventListener('DOMContentLoaded', () => {
    fetch('data/novel.json')
        .then(response => response.json())
        .then(novelData => {
            const novelCardsContainer = document.getElementById('novel_card');
            console.log('小说加载中:', novelData);

            novelData.forEach(novel => {
                const card = document.createElement('div');
                card.classList.add('novel-card');

                const image = novel.source.images || 'data/images/未知.jpg';
                const name = novel.name || '未知';
                const author = novel.author || '未知';
                const platform = novel.platform || '未知';
                const state = novel.state || '未知';

                card.innerHTML = `
                    <img src="${image}" alt="${novel.name}">
                    <div class="novel-info">
                        <h1>${name}</h1>
                        <div>
                            <strong>作者:</strong>
                            <h2>${author}</h2>
                        </div>
                        <div>
                            <strong>平台:</strong>
                            <h2>${platform}</h2>
                        </div>
                        <div>
                            <strong>状态:</strong>
                            <h2>${state}</h2>
                        </div>
                    </div>
                `;

                card.addEventListener('click', () => {
                    const filePath = novel.source.resources.split('/').pop();
                    if (filePath) {
                        window.location.href = `reading.html?file=${encodeURIComponent(filePath)}`;
                    } else {
                        console.error('File path is undefined.');
                    }
                });
                

                novelCardsContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error loading novel data:', error);
        });
});


const hamburger = document.getElementById('hamburger');
const filter = document.getElementById('filter');
const closeBtn = document.getElementById('closeBtn');

hamburger.addEventListener('click', () => {
    filter.style.transform = 'translateX(0)';
});

closeBtn.addEventListener('click', () => {
    filter.style.transform = 'translateX(-100%)';
});