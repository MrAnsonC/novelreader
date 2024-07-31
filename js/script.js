document.addEventListener('DOMContentLoaded', () => {
    let novels = [];
    let currentPage = 1;
    const novelsPerPage = 10;

    fetch('data/novel.json')
        .then(response => response.json())
        .then(novelData => {
            novels = shuffleArray(novelData); // Randomize novels
            setupPagination(novels);
            displayNovels(novels, currentPage);
        })
        .catch(error => console.error('Error loading novel data:', error));

        fetch('data/language/index.json')
        .then(response => response.json())
        .then(data => {
            translations = data;
            applyTranslations('zh_chs');
        })
        .catch(error => console.error('Error loading translations:', error));

    document.getElementById('languageSelector').addEventListener('change', (event) => {
        applyTranslations(event.target.value);
    });

    function applyTranslations(language) {
        document.getElementById('site_title').textContent = translations[language].site_title;
        document.getElementById('site_title_text').textContent = translations[language].site_title;
        document.getElementById('search_novels').textContent = translations[language].search_novels;
        document.getElementById('closeBtn').textContent = translations[language].close;
        document.getElementById('search_label').textContent = translations[language].search;
        document.getElementById('search').placeholder = translations[language].enter_novel_name;
        document.getElementById('sort_label').textContent = translations[language].sort;
        document.getElementById('sort').options[0].textContent = translations[language].word_high_to_low;
        document.getElementById('sort').options[1].textContent = translations[language].word_low_to_high;
        document.getElementById('platform_label').textContent = translations[language].platform;
        document.getElementById('platform').options[0].textContent = translations[language].all;
        document.getElementById('platform').options[1].textContent = translations[language].tomato;
        document.getElementById('platform').options[2].textContent = translations[language].feilu;
        document.getElementById('platform').options[3].textContent = translations[language].qq_reading;
        document.getElementById('platform').options[4].textContent = translations[language].other;
        document.getElementById('state_label').textContent = translations[language].state;
        document.getElementById('state').options[0].textContent = translations[language].all;
        document.getElementById('state').options[1].textContent = translations[language].completed;
        document.getElementById('state').options[2].textContent = translations[language].ongoing;
        document.getElementById('state').options[3].textContent = translations[language].discontinued;
        document.getElementById('state').options[4].textContent = translations[language].other;
        document.getElementById('filterResults').textContent = translations[language].find_novels;
        document.getElementById('resetFilters').textContent = translations[language].reset;
        document.getElementById('prevPage').textContent = translations[language].previous_page;
        document.getElementById('nextPage').textContent = translations[language].next_page;
        document.getElementById('created_by').textContent = translations[language].created_by;
        document.getElementById('language_Selector').textContent = translations[language].languageSelector;
    }

    function setupPagination(novels) {
        const totalPages = Math.ceil(novels.length / novelsPerPage);
        const rangeDropdown = document.getElementById('rangeDropdown');
        const contentDiv = document.getElementById('headering'); 
        rangeDropdown.innerHTML = ''; // Clear previous options

        for (let i = 1; i <= totalPages; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `第${(i)}页 / 第${totalPages}页`;
            rangeDropdown.appendChild(option);
        }

        rangeDropdown.addEventListener('change', () => {
            currentPage = parseInt(rangeDropdown.value);
            displayNovels(novels, currentPage);
            contentDiv.scrollIntoView({ behavior: 'instant' });
        });

        document.getElementById('prevPage').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                rangeDropdown.value = currentPage;
                displayNovels(novels, currentPage);
                contentDiv.scrollIntoView({ behavior: 'instant' });
            }
        });

        document.getElementById('nextPage').addEventListener('click', () => {
            const totalPages = Math.ceil(novels.length / novelsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                rangeDropdown.value = currentPage;
                displayNovels(novels, currentPage);
                contentDiv.scrollIntoView({ behavior: 'instant' });
            }
        });
    }

    document.getElementById('filterResults').addEventListener('click', () => {
        const searchValue = document.getElementById('search').value.toLowerCase();
        const sortValue = document.getElementById('sort').value;
        const platformValue = document.getElementById('platform').value;
        const stateValue = document.getElementById('state').value;
    
        let filteredNovels = novels.filter(novel => {
            const matchesSearch = novel.name.toLowerCase().includes(searchValue) || searchValue === "";
            const matchesPlatform = platformValue === "all" || 
                (platformValue === "起点/QQ阅读" ? (novel.platform === "起点" || novel.platform === "QQ阅读") : novel.platform === platformValue) ||
                (platformValue === "其他" ? !["番茄", "飞卢小说", "起点", "QQ阅读"].includes(novel.platform)
                     : novel.platform === platformValue);
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
    
            displayNovels(updatedNovels, currentPage);
            document.getElementById('filter').style.transform = 'translateX(-100%)';
        });
    });

    document.getElementById('resetFilters').addEventListener('click', () => {
        document.getElementById('search').value = '';
        document.getElementById('sort').value = 'word_high_to_low';
        document.getElementById('platform').value = 'all';
        document.getElementById('state').value = 'all';
        displayNovels(novels, currentPage); // Display all novels after reset
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

    function displayNovels(novels, page) {
        const novelCardsContainer = document.getElementById('novel_card');
        novelCardsContainer.innerHTML = '';

        const startIndex = (page - 1) * novelsPerPage;
        const endIndex = Math.min(startIndex + novelsPerPage, novels.length);
        const novelsToDisplay = novels.slice(startIndex, endIndex);
    
        novelsToDisplay.forEach(novel => {
            const card = document.createElement('div');
            card.classList.add('novel-card');
    
            const image = novel.source.images || 'data/images/unknown.jpg';
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
                        card.querySelector('.word-count').textContent = formattedWordCount;
                        novel.wordCount = wordCount;
                    })
                    .catch(error => {
                        console.error('Error loading text file:', error);
                        card.querySelector('.word-count').textContent = '加载错误';
                    });
            } else {
                card.querySelector('.word-count').textContent = '数据缺失';
            }
    
            card.addEventListener('click', () => {
                const pathParts = novel.source.resources.split('/');
                let relevantPath = pathParts.slice(-1).join('/');

                const keywords = ['已完结', '连载中', '被封杀', '断更'];

                if (keywords.some(keyword => novel.source.resources.includes(keyword))) {
                    relevantPath = pathParts.slice(-2).join('/');
                }

                if (relevantPath) {
                    window.location.href = `reading.html?file=${encodeURIComponent(relevantPath)}`;
                } else {
                    console.error('File path is undefined.');
                }
            });
    
            novelCardsContainer.appendChild(card);
        });
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function calculateWordCount(text) {
        const trimmedText = text.replace(/\s+/g, '');
        return trimmedText.length;
    }
});
