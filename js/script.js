document.addEventListener('DOMContentLoaded', () => {
    let novels = [];
    let isSearchClicked = false;
    let isFirstIn = true;

    fetch('data/novel.json')
        .then(response => response.json())
        .then(novelData => {
            novels = novelData;
            displayNovels(novels);
        })
        .catch(error => console.error('Error loading novel data:', error));

        document.getElementById('filterResults').addEventListener('click', () => {
            const searchValue = document.getElementById('search').value.toLowerCase();
            const sortValue = document.getElementById('sort').value;
            const platformValue = document.getElementById('platform').value;
            const stateValue = document.getElementById('state').value;
        
            let filteredNovels = novels.filter(novel => {
                const matchesSearch = novel.name.toLowerCase().includes(searchValue) || searchValue === "";
                const matchesPlatform = platformValue === "all" || (platformValue === "其他" 
                    ? !["番茄", "飞卢小说", "起点", "QQ阅读"].includes(novel.platform) 
                    : novel.platform === platformValue);
                const matchesState = stateValue === "all" || 
                    (stateValue === "断更/被封杀" ? (novel.state === "断更" || novel.state === "被封杀") : novel.state === stateValue) || 
                    (stateValue === "其他" ? !["已完结", "连载中", "断更", "被封杀"].includes(novel.state) 
                    : novel.state === stateValue);
        
                return matchesSearch && matchesPlatform && matchesState;
            });
        
            // Sorting
            if (sortValue === 'word_high_to_low') {
                filteredNovels.sort((a, b) => (b.wordCount || 0) - (a.wordCount || 0));
            } else if (sortValue === 'word_low_to_high') {
                filteredNovels.sort((a, b) => (a.wordCount || 0) - (b.wordCount || 0));
            }
        
            displayNovels(filteredNovels);
            document.getElementById('filter').style.transform = 'translateX(-100%)';
        });
        

        document.getElementById('filterResults').addEventListener('click', () => {
            isSearchClicked = true;

            const searchValue = document.getElementById('search').value.toLowerCase();
            const sortValue = document.getElementById('sort').value;
            const platformValue = document.getElementById('platform').value;
            const stateValue = document.getElementById('state').value;
        
            let filteredNovels = novels.filter(novel => {
                const matchesSearch = novel.name.toLowerCase().includes(searchValue) || searchValue === "";
                const matchesPlatform = platformValue === "all" || (platformValue === "其他"
                    ? !["番茄", "飞卢小说", "起点", "QQ阅读"].includes(novel.platform) : novel.platform === platformValue);
                const matchesState = stateValue === "all" ||
                    (stateValue === "断更/被封杀" ? (novel.state === "断更" || novel.state === "被封杀") : novel.state === stateValue) ||
                    (stateValue === "其他" ? !["已完结", "连载中", "断更", "被封杀"].includes(novel.state) 
                        : novel.state === stateValue);
                return matchesSearch && matchesPlatform && matchesState;
            });
        
            // Wait for all word counts to be updated before sorting
            const wordCountPromises = filteredNovels.map(novel => {
                if (novel.source.resources) {
                    return fetch(novel.source.resources)
                        .then(response => response.text())
                        .then(text => {
                            novel.wordCount = calculateWordCount(text);
                            return novel;
                        });
                } else {
                    novel.wordCount = 0; // Default value if resources are missing
                    return Promise.resolve(novel);
                }
            });
        
            Promise.all(wordCountPromises).then(updatedNovels => {
                if (sortValue === 'word_high_to_low') {
                    updatedNovels.sort((a, b) => b.wordCount - a.wordCount);
                } else if (sortValue === 'word_low_to_high') {
                    updatedNovels.sort((a, b) => a.wordCount - b.wordCount);
                }
        
                displayNovels(updatedNovels);
                document.getElementById('filter').style.transform = 'translateX(-100%)';
            });
        });

        document.getElementById('resetFilters').addEventListener('click', () => {
            document.getElementById('search').value = '';
            document.getElementById('sort').value = 'word_high_to_low';
            document.getElementById('platform').value = 'all';
            document.getElementById('state').value = 'all';
            isSearchClicked = false;
            displayNovels(novels); // Display all novels after reset
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

    function displayNovels(novels) {
        if (!isSearchClicked) {
            shuffleArray(novels);
        }

        const novelCardsContainer = document.getElementById('novel_card');
        novelCardsContainer.innerHTML = '';
    
        novels.forEach(novel => {
            const card = document.createElement('div');
            card.classList.add('novel-card');
    
            const image = novel.source.images || 'data/images/未知.jpg';
            const name = novel.name || '未知';
            const author = novel.author || '未知';
            const platform = novel.platform || '未知';
            const state = novel.state || '未知';
    
            card.innerHTML = `
                <div class="novel-image-container">
                    <img src="${image}" alt="${name}">
                </div>
                <div class="novel-info">
                    <h1>${name}</h1>
                    <div>
                        <strong>作者:</strong> <h2>${author}</h2>
                    </div>
                    <div>
                        <strong>平台:</strong> <h2>${platform}</h2>
                    </div>
                    <div>
                        <strong>状态:</strong> <h2>${state}</h2>
                    </div>
                    <div>
                        <strong>字数:</strong> <h2 class="word-count">计算中...</h2>
                    </div>
                </div>
            `;
    
            if (novel.source.resources) {
                fetch(novel.source.resources)
                    .then(response => response.text())
                    .then(text => {
                        const wordCount = calculateWordCount(text);
                        const formattedWordCount = wordCount.toLocaleString(); // Format with commas
                        const randomDelay = Math.floor(Math.random() * (2000 - 100 + 1)) + 100;
                        if (isFirstIn){
                            setTimeout(() => {
                                card.querySelector('.word-count').textContent = formattedWordCount;
                                novel.wordCount = wordCount;
                                isFirstIn = false;
                            }, randomDelay);
                        }else{
                            card.querySelector('.word-count').textContent = formattedWordCount;
                            novel.wordCount = wordCount;
                        }
                        novel.wordCount = wordCount; // Store word count in novel object
                    })
                    .catch(error => {
                        console.error('Error loading text file:', error);
                        card.querySelector('.word-count').textContent = '加载错误';
                    });
            } else {
                card.querySelector('.word-count').textContent = '数据缺失';
            }
    
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
    }
    

    function calculateWordCount(text) {
        const trimmedText = text.replace(/\s+/g, '');
        return trimmedText.length;
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }
    
});
