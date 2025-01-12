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
        displayRandomNovels(novels); // Display random novels instead of all
    })
    .catch(error => console.error('Error loading data:', error));

    document.getElementById('languageSelector').addEventListener('change', (event) => {
        currentLanguage = event.target.value;
        localStorage.setItem('selectedLanguage', currentLanguage);
        applyTranslations(currentLanguage);
        displayRandomNovels(novels); // Re-render random novels when the language changes
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

    // Function to display 4 random novels
    function displayRandomNovels(novels) {
        const novelCardsContainer = document.getElementById('novel_card');
        novelCardsContainer.innerHTML = ''; // Clear any existing novels

        // Pick 4 random novels
        const randomNovels = getRandomNovels(novels, 4);

        randomNovels.forEach(novel => {
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
            novelCardsContainer.appendChild(card);
        });
    }

    // Function to get a random subset of novels
    function getRandomNovels(novels, count) {
        let shuffledNovels = shuffleArray(novels);
        return shuffledNovels.slice(0, count);
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

    document.getElementById('resetFilters').addEventListener('click', () => {
        displayRandomNovels(novels); // Display random novels after reset
    });
});
