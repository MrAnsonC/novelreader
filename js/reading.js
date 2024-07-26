document.addEventListener('DOMContentLoaded', () => {
    // Element References
    const contentDiv = document.getElementById('content');
    const hamburger = document.getElementById('hamburger');
    const menu = document.getElementById('menu');
    const closeMenu = document.getElementById('closeMenu');
    const backBtnSidebar = document.getElementById('backBtnSidebar');
    const prevBtnSidebar = document.getElementById('prevChapterSidebar');
    const nextBtnSidebar = document.getElementById('nextChapterSidebar');
    const chapterListSidebar = document.getElementById('chapterListSidebar');
    const chapterList = document.getElementById('chapterList');
    const prevFooterBtn = document.getElementById('prevChapter');
    const nextFooterBtn = document.getElementById('nextChapter');
    const fontSizeSliderSidebar = document.getElementById('fontSizeSliderSidebar');
    const fontSizeValueSidebar = document.getElementById('fontSizeValueSidebar');
    const themeSelector = document.getElementById('themeSelector');
    const textAlignSelector = document.getElementById('textAlignSelector');

    // State Variables
    let chapters = [];
    let currentChapterIndex = 0;
    let isInChapterListView = false;

    // Retrieve saved settings from localStorage
    const savedFontSize = localStorage.getItem('fontSize');
    const savedTheme = localStorage.getItem('theme');
    const savedTextAlign = localStorage.getItem('textAlign');

    // Set initial values from saved settings or defaults
    const initialFontSize = savedFontSize ? parseInt(savedFontSize) : 22;
    const initialTheme = savedTheme || 'white-black';
    const initialTextAlign = savedTextAlign || 'left';

    // Apply saved settings
    updateFontSize(initialFontSize);
    updateTheme(initialTheme);
    updateTextAlign(initialTextAlign);

    fontSizeSliderSidebar.value = initialFontSize;
    themeSelector.value = initialTheme;
    textAlignSelector.value = initialTextAlign;

    // Event Listeners
    themeSelector.addEventListener('change', (e) => {
        updateTheme(e.target.value);
        localStorage.setItem('theme', e.target.value);
    });

    fontSizeSliderSidebar.addEventListener('input', (e) => {
        updateFontSize(e.target.value);
        localStorage.setItem('fontSize', e.target.value);
    });

    textAlignSelector.addEventListener('change', (e) => {
        updateTextAlign(e.target.value);
        localStorage.setItem('textAlign', e.target.value);
    });

    hamburger.addEventListener('click', () => {
        menu.classList.add('open');
        document.body.classList.add('menu-open');
    });

    closeMenu.addEventListener('click', () => {
        menu.classList.remove('open');
        document.body.classList.remove('menu-open');
    });

    backBtnSidebar.addEventListener('click', () => {
        if (isInChapterListView) {
            showMenuButtons(); // Go back to the menu
        } else {
            window.location.href = 'index.html'; // Navigate back to index.html
        }
    });

    prevBtnSidebar.addEventListener('click', () => {
        if (currentChapterIndex > 0) loadChapter(currentChapterIndex - 1);
    });

    nextBtnSidebar.addEventListener('click', () => {
        if (currentChapterIndex < chapters.length - 1) loadChapter(currentChapterIndex + 1);
    });

    chapterListSidebar.addEventListener('click', showChapterList);
    prevFooterBtn.addEventListener('click', () => {
        if (currentChapterIndex > 0) loadChapter(currentChapterIndex - 1);
    });

    nextFooterBtn.addEventListener('click', () => {
        if (currentChapterIndex < chapters.length - 1) loadChapter(currentChapterIndex + 1);
    });

    // Set menu styles
    menu.style.backgroundColor = '#333';
    menu.style.color = '#fff';

    // Utility Functions
    function updateFontSize(size) {
        contentDiv.style.fontSize = `${size}px`;
        fontSizeValueSidebar.textContent = size;
    }

    function updateTheme(theme) {
        switch (theme) {
            case 'white-black':
                document.body.style.backgroundColor = '#fff';
                document.body.style.color = '#000';
                break;
            case 'black-white':
                document.body.style.backgroundColor = '#000';
                document.body.style.color = '#fff';
                break;
            case 'lightblue-black':
                document.body.style.backgroundColor = '#add8e6';
                document.body.style.color = '#000';
                break;
            case 'lightyellow-black':
                document.body.style.backgroundColor = '#ffffe0';
                document.body.style.color = '#000';
                break;
            default:
                document.body.style.backgroundColor = '#fff';
                document.body.style.color = '#000';
                break;
        }
    }

    function updateTextAlign(alignment) {
        contentDiv.style.textAlign = alignment;
    }

    function loadChapter(index) {
        if (index < 0 || index >= chapters.length) return;

        const chapter = chapters[index];
        const [title, ...contentLines] = chapter.split('\n');

        if (title.startsWith('第')) {
            const chapterTitle = title.trim();
            const chapterContent = contentLines.join('\n').trim();

            const formattedContent = chapterContent
                .split('\n')
                .map(paragraph => `<p>${paragraph.trim()}</p>`)
                .join('');

            contentDiv.innerHTML = `
                <div class="chapter-title">${chapterTitle}</div>
                <div class="chapter-content">${formattedContent}</div>
            `;

            currentChapterIndex = index;
            localStorage.setItem('currentChapterIndex', currentChapterIndex);
            updateNavigationButtons();
            contentDiv.scrollIntoView({ behavior: 'instant' });

            // Save current chapter index for this book
            const fileName = new URLSearchParams(window.location.search).get('file');
            if (fileName) {
                localStorage.setItem(`chapterIndex_${fileName}`, currentChapterIndex);
            }
        } else {
            console.warn(`Unexpected chapter format: ${title}`);
        }
    }

    function updateNavigationButtons() {
        const atStart = currentChapterIndex === 0;
        const atEnd = currentChapterIndex === chapters.length - 1;

        prevFooterBtn.disabled = atStart;
        nextFooterBtn.disabled = atEnd;
        prevBtnSidebar.disabled = atStart;
        nextBtnSidebar.disabled = atEnd;
    }

    function populateChapterList() {
        chapterList.innerHTML = chapters.map((chapter, index) => {
            const [title] = chapter.split('\n');
            if (title.startsWith('第')) {
                return `<button class="chapter-item" data-index="${index}">${title.trim()}</button>`;
            }
            else if (title.startsWith('**')) {
                return `<button class="chapter-item special-chapter" disabled>${title.replace('**', '').trim()}</button>`;
            }
            return '';
        }).join('');
    
        chapterList.querySelectorAll('.chapter-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                if (!isNaN(index)) {
                    loadChapter(index);
                    menu.classList.remove('open');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    }    

    function showChapterList() {
        isInChapterListView = true;
        prevBtnSidebar.style.display = 'none';
        nextBtnSidebar.style.display = 'none';
        chapterListSidebar.style.display = 'none';
        chapterList.style.display = 'block';
        populateChapterList();
    }

    function showMenuButtons() {
        isInChapterListView = false;
        prevBtnSidebar.style.display = 'block';
        nextBtnSidebar.style.display = 'block';
        chapterListSidebar.style.display = 'block';
        chapterList.style.display = 'none';
    }

    // Initialize Chapter Loading
    const fileName = new URLSearchParams(window.location.search).get('file');
    if (fileName) {
        fetch(`data/txt/${fileName}`)
            .then(response => response.text())
            .then(text => {
                // Split text into chapters based on the chapter titles
                chapters = text.split(/\n(?=第[\d零一二三四五六七八九十点\.]+章)/).map(chapter => chapter.trim());
                const savedChapterIndex = localStorage.getItem(`chapterIndex_${fileName}`);
                if (savedChapterIndex) {
                    currentChapterIndex = parseInt(savedChapterIndex);
                } else {
                    currentChapterIndex = 0;
                }
                loadChapter(currentChapterIndex);
            })
            .catch(error => console.error('Error loading chapters:', error));
    } else {
        console.error('File name not specified in URL.');
    }
});
