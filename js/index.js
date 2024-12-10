document.addEventListener('DOMContentLoaded', () => { 
    let novels = [];
    let translations = {}; // Initialize translations

    // Load the saved language or set default language
    let currentLanguage = localStorage.getItem('selectedLanguage') || 'zh_chs';
    document.getElementById('languageSelector').value = currentLanguage;

    // Fetch both novel data and translations together
    Promise.all([
        fetch('data/novel.json').then(response => response.json()),
        fetch('data/languages.json').then(response => response.json())
    ])
    .then(([novelData, translationData]) => {
        novels = shuffleArray(novelData); // Randomize novels
        translations = translationData;

        // Apply translations and set up the page
        applyTranslations(currentLanguage);
        displayNovels(novels); // Display all novels without pagination
    })
    .catch(error => console.error('Error loading data:', error));

    document.getElementById('languageSelector').addEventListener('change', (event) => {
        currentLanguage = event.target.value;
        localStorage.setItem('selectedLanguage', currentLanguage);
        applyTranslations(currentLanguage);
        displayNovels(novels); // Re-render all novels when the language changes
    });

    // Function to apply translations based on the selected language
    function applyTranslations(language) {
        if (translations[language]) {
            document.getElementById('site_title').textContent = translations[language].site_title || 'Default Title';
            document.getElementById('site_title_text').textContent = translations[language].site_title || 'Default Title';
            document.getElementById('search_novels').textContent = translations[language].search_novels || 'Search Novels';
            document.getElementById('closeBtn').textContent = translations[language].close || 'Close';
            document.getElementById('search_label').textContent = translations[language].search || 'Search';
            document.getElementById('search').placeholder = translations[language].enter_novel_name || 'Enter novel name';
            document.getElementById('sort_label').textContent = translations[language].sort || 'Sort';
            document.getElementById('sort').options[0].textContent = translations[language].word_high_to_low || 'Word count (high to low)';
            document.getElementById('sort').options[1].textContent = translations[language].word_low_to_high || 'Word count (low to high)';
            document.getElementById('platform_label').textContent = translations[language].platform || 'Platform';
            document.getElementById('platform').options[0].textContent = translations[language].all || 'All';
            document.getElementById('platform').options[1].textContent = translations[language].fanqie || 'Tomato';
            document.getElementById('platform').options[2].textContent = translations[language].huaben || 'Huaben';
            document.getElementById('platform').options[3].textContent = translations[language].feilu || 'Feilu';
            document.getElementById('platform').options[4].textContent = translations[language].qq_reading || 'QQ Reading';
            document.getElementById('platform').options[5].textContent = translations[language].other || 'Other';
            document.getElementById('status_label').textContent = translations[language].status || 'Status';
            document.getElementById('status').options[0].textContent = translations[language].all || 'All';
            document.getElementById('status').options[1].textContent = translations[language].completed || 'Completed';
            document.getElementById('status').options[2].textContent = translations[language].ongoing || 'Ongoing';
            document.getElementById('status').options[3].textContent = translations[language].discontinued || 'Discontinued';
            document.getElementById('status').options[4].textContent = translations[language].other || 'Other';
            document.getElementById('filterResults').textContent = translations[language].find_novels || 'Find Novels';
            document.getElementById('resetFilters').textContent = translations[language].reset || 'Reset';
            document.getElementById('created_by').textContent = translations[language].created_by || 'Created by';
            document.getElementById('language_Selector').textContent = translations[language].languageSelector || 'Language Selector';
        } else {
            console.warn('Translations not found for language:', language);
        }
    }

    // Function to display all novels (without pagination)
    function displayNovels(novels) {
        const novelCardsContainer = document.getElementById('novel_card');
        novelCardsContainer.innerHTML = ''; // Clear any existing novels

        novels.forEach(novel => {
            const card = document.createElement('div');
            card.classList.add('novel-card');

            const image = novel.source.images || 'data/images/unknown.jpg';
            const name = novel.name || '未知';
            const author = novel.author || '未知';
            const platform = novel.platform || '未知';
            const status = novel.status || '未知';

            card.innerHTML = `
                <div class="novel-image-container">
                    <img src="${image}" alt="${name}">
                </div>
                <div class="novel-info">
                    <h1>${name}</h1>
                    <div>
                        <strong>${translations[currentLanguage].author}:</strong> <h2>${author}</h2>
                    </div>
                    <div>
                        <strong>${translations[currentLanguage].platform}:</strong> <h2>${platform}</h2>
                    </div>
                    <div>
                        <strong>${translations[currentLanguage].status}:</strong> <h2>${status}</h2>
                    </div>
                    <div>
                        <strong>${translations[currentLanguage].word_count}:</strong> <h2 class="word-count">${translations[currentLanguage].calculating}</h2>
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
                        card.querySelector('.word-count').textContent = 'Load Error';
                    });
            } else {
                card.querySelector('.word-count').textContent = 'Data Missing';
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

    // Function to shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Function to calculate word count
    function calculateWordCount(text) {
        const trimmedText = text.replace(/\s+/g, '');
        return trimmedText.length;
    }

    // Event listeners for filter and reset buttons
    document.getElementById('filterResults').addEventListener('click', () => {
        const searchValue = document.getElementById('search').value.toLowerCase();
        const sortValue = document.getElementById('sort').value;
        const platformValue = document.getElementById('platform').value;
        const statusValue = document.getElementById('status').value;

        let filteredNovels = novels.filter(novel => {
            const matchesSearch = novel.name.toLowerCase().includes(searchValue) || searchValue === "";
            const matchesPlatform = platformValue === "all" || 
                (platformValue === "fanqie" ? (novel.platform === "番茄") : novel.platform === platformValue) ||
                (platformValue === "huaben" ? (novel.platform === "话本") : novel.platform === platformValue) ||
                (platformValue === "feilu/shuqi" ? (novel.platform === "飞卢小说" || novel.platform === "书旗") : novel.platform === platformValue) ||
                (platformValue === "qidian/qq_reading" ? (novel.platform === "起点" || novel.platform === "QQ阅读") : novel.platform === platformValue) ||
                (platformValue === "other" ? !["番茄", "话本", "飞卢小说", "起点", "QQ阅读", "书旗"].includes(novel.platform) : novel.platform === platformValue);
            const matchesState = statusValue === "all" ||
                (statusValue === "completed" ? (novel.status === "已完结") : novel.status === statusValue) ||
                (statusValue === "ongoing" ? (novel.status === "连载中") : novel.status === statusValue) ||
                (statusValue === "discontinued" ? (novel.status === "断更" || novel.status === "被封杀") : novel.status === statusValue) ||
                (statusValue === "other" ? !["已完结", "连载中", "断更", "被封杀"].includes(novel.status) : novel.status === statusValue);
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
        document.getElementById('status').value = 'all';
        displayNovels(novels); // Display all novels after reset
    });

    // Event listeners for hamburger menu
    const hamburger = document.getElementById('hamburger');
    const filter = document.getElementById('filter');
    const closeBtn = document.getElementById('closeBtn');

    hamburger.addEventListener('click', () => {
        filter.style.transform = 'translateX(0)';
    });

    closeBtn.addEventListener('click', () => {
        filter.style.transform = 'translateX(-100%)';
    });
});
