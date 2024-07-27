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
    const textStyleSelector = document.getElementById('textStyleSelector');
    const textFamilySelector = document.getElementById('textFamilySelector');

    // State Variables
    let chapters = [];
    let currentChapterIndex = 0;
    let isInChapterListView = false;

    // Retrieve saved settings from localStorage
    const savedFontSize = localStorage.getItem('fontSize');
    const savedTheme = localStorage.getItem('theme');
    const savedTextAlign = localStorage.getItem('textAlign');
    const savedTextStyle = localStorage.getItem('textStyle');
    const savedTextFamily = localStorage.getItem('textFamily');

    // Set initial values from saved settings or defaults
    const initialFontSize = savedFontSize ? parseInt(savedFontSize) : 22;
    const initialTheme = savedTheme || 'white-black';
    const initialTextAlign = savedTextAlign || 'left';
    const initialTextStyle = savedTextStyle || 'normal';
    const initialTextFamily = savedTextFamily || 'sans-serif';

    // Apply saved settings
    updateFontSize(initialFontSize);
    updateTheme(initialTheme);
    updateTextAlign(initialTextAlign);
    updateTextStyle(initialTextStyle);
    updateTextFamily(initialTextFamily);

    fontSizeSliderSidebar.value = initialFontSize;
    themeSelector.value = initialTheme;
    textAlignSelector.value = initialTextAlign;
    textStyleSelector.value = initialTextStyle;
    textFamilySelector.value = initialTextFamily;

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

    textFamilySelector.addEventListener('change', (e) => {
        updateTextFamily(e.target.value);
        localStorage.setItem('textFamily', e.target.value);
    });

    document.addEventListener('DOMContentLoaded', () => {
        const loadingDiv = document.getElementById('loading');
    
        // Show loading GIF initially
        loadingDiv.style.display = 'block';
    
        // Create a temporary element to trigger font loading
        const testElement = document.createElement('span');
        testElement.style.fontFamily = 'CustomFontName1'; // Replace with your custom font
        testElement.style.visibility = 'hidden';
        document.body.appendChild(testElement);
    
        // Check if the font has loaded
        function checkFontLoaded() {
            const fontLoaded = window.getComputedStyle(testElement).fontFamily.includes('CustomFontName1'); // Replace with your custom font
            if (fontLoaded) {
                loadingDiv.style.display = 'none';
                document.body.removeChild(testElement);
            } else {
                requestAnimationFrame(checkFontLoaded); // Check again in the next frame
            }
        }
    
        checkFontLoaded();
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

    textStyleSelector.addEventListener('change', (e) => {
        updateTextStyle(e.target.value);
        localStorage.setItem('textStyle', e.target.value);
    });

    // Set menu styles
    menu.style.backgroundColor = '#333';
    menu.style.color = '#fff';

    // Utility Functions
    function updateFontSize(size) {
        contentDiv.style.fontSize = `${size}px`;
        fontSizeValueSidebar.textContent = size;
    }

    function updateTextFamily(family) {
        contentDiv.style.fontFamily = family;
    }

    // Function to update backgrond color
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

    // Function to update the text style
    function updateTextStyle(style) {
        switch (style) {
            case 'normal':
                contentDiv.style.fontStyle = 'normal';
                contentDiv.style.fontWeight = 'normal';
                break;
            case 'bold':
                contentDiv.style.fontStyle = 'normal';
                contentDiv.style.fontWeight = 'bold';
                break;
            case 'boldItalic':
                contentDiv.style.fontStyle = 'italic';
                contentDiv.style.fontWeight = 'bold';
                break;
            default:
                contentDiv.style.fontStyle = 'normal';
                contentDiv.style.fontWeight = 'normal';
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
        chapterList.innerHTML = '';

        const rangeSize = chapters.length <= 500 ? 50 : 200;
        const totalRanges = Math.ceil(chapters.length / rangeSize);

        for (let rangeIndex = 0; rangeIndex < totalRanges; rangeIndex++) {
            const rangeStart = rangeIndex * rangeSize;
            const rangeEnd = Math.min(rangeStart + rangeSize, chapters.length);
            
            const rangeButton = document.createElement('button');
            rangeButton.classList.add('dropdown');
            rangeButton.textContent = `第${rangeStart + 1}-${rangeEnd}章`;

            const dropdownContent = document.createElement('div');
            dropdownContent.classList.add('dropdown-content');

            for (let chapterIndex = rangeStart; chapterIndex < rangeEnd; chapterIndex++) {
                const chapterTitle = chapters[chapterIndex].split('\n')[0].trim();
                const chapterButton = document.createElement('button');
                chapterButton.classList.add('chapter-item');
                chapterButton.textContent = chapterTitle;
                chapterButton.addEventListener('click', () => {
                    loadChapter(chapterIndex);
                    showMenuButtons()
                    closeMenu.click();
                });
                dropdownContent.appendChild(chapterButton);
            }

            rangeButton.addEventListener('click', () => {
                dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
            });

            chapterList.appendChild(rangeButton);
            chapterList.appendChild(dropdownContent);
        }
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
                chapters = text.split(/\n(?=第[\d零一二三四五六七八九十百千点\.]+章)/).map(chapter => chapter.trim());
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
