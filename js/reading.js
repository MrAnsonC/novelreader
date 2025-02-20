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
    const languageSelector = document.getElementById('languageSelector');

    // State Variables
    let chapters = [];
    let currentChapterIndex = 0;
    let isInChapterListView = false;
    let languageData = {};
    let translations = {};
    let currentLanguage = localStorage.getItem('selectedLanguage') || 'zh_chs';
    document.getElementById('languageSelector').value = currentLanguage;

    // Retrieve saved settings from localStorage
    const savedFontSize = localStorage.getItem('fontSize');
    const savedTheme = localStorage.getItem('theme');
    const savedTextAlign = localStorage.getItem('textAlign');
    const savedTextStyle = localStorage.getItem('textStyle');
    const savedTextFamily = localStorage.getItem('textFamily');
    const savedLanguage = localStorage.getItem('language');

    // Set initial values from saved settings or defaults
    const initialFontSize = savedFontSize ? parseInt(savedFontSize) : 22;
    const initialTheme = savedTheme || 'white-black';
    const initialTextAlign = savedTextAlign || 'left';
    const initialTextStyle = savedTextStyle || 'normal';
    const initialTextFamily = savedTextFamily || 'sans-serif';
    currentLanguage = savedLanguage || 'zh_chs';

    console.log('Initial Language:', currentLanguage);

    // Function to apply encoding
    function applyEncoding() {
        // Add dragstart event listener
        contentDiv.addEventListener('dragstart', handleDragStart);

        // Add copy event listener
        document.addEventListener('copy', handleCopy);
    }

    function handleDragStart(event) {
        const selectedText = window.getSelection().toString();
        const encodedText = encodeTextRandomly(selectedText);
        event.dataTransfer.setData('text/plain', encodedText);
        event.preventDefault();
    }

    // Copy handler
    function handleCopy(event) {
        const selectedText = window.getSelection().toString();
        const encodedText = encodeTextRandomly(selectedText);
        event.clipboardData.setData('text/plain', encodedText);
        event.preventDefault();
    }

    // Apply saved settings
    updateFontSize(initialFontSize);
    updateTheme(initialTheme);
    updateTextAlign(initialTextAlign);
    updateTextStyle(initialTextStyle);
    updateTextFamily(initialTextFamily);
    languageSelector.value = currentLanguage;

    fontSizeSliderSidebar.value = initialFontSize;
    themeSelector.value = initialTheme;
    textAlignSelector.value = initialTextAlign;
    textStyleSelector.value = initialTextStyle;
    textFamilySelector.value = initialTextFamily;

    fetch('data/languages.json')
        .then(response => response.json())
        .then(data => {
            languageData = data;
            applyLanguage(currentLanguage, data);
        })
        .catch(error => {
            console.error('Error loading language data:', error);
        });

    languageSelector.addEventListener('change', () => {
        currentLanguage = languageSelector.value;
        localStorage.setItem('language', currentLanguage);
        applyLanguage(currentLanguage);
    });

    function applyLanguage(language) {
        const langData = languageData[language];
        if (langData) {
            document.title = langData.site_title;
            document.getElementById('site_title_text').textContent = langData.site_title_text;
            document.getElementById('backBtnSidebar').textContent = langData.backBtnSidebar;
            document.getElementById('closeMenu').textContent = langData.closeMenu;
            document.getElementById('prevChapterSidebar').textContent = langData.prevChapterSidebar;
            document.getElementById('chapterListSidebar').textContent = langData.chapterListSidebar;
            document.getElementById('nextChapterSidebar').textContent = langData.nextChapterSidebar;
            document.getElementById('fontSizeLabel').textContent = langData.fontSizeLabel;
            document.getElementById('themeSelectorLabel').textContent = langData.themeSelectorLabel;
            document.getElementById('whitebgd').textContent = langData.whiteBackground;
            document.getElementById('blackbgd').textContent = langData.blackBackground;
            document.getElementById('lbluebgd').textContent = langData.lblueBackground;
            document.getElementById('lyellowbgd').textContent = langData.lyellowBackground;
            
            //Text align
            document.getElementById('textAlignSelectorLabel').textContent = langData.textAlignSelectorLabel;
            document.getElementById('textAlignLeft').textContent = langData.textAlignL;
            document.getElementById('textAlignCentre').textContent = langData.textAlignC;
            document.getElementById('textAlignRight').textContent = langData.textAlignR;

            //Text style
            document.getElementById('textStyleSelectorLabel').textContent = langData.textStyleSelectorLabel;
            document.getElementById('textStylenormal').textContent = langData.textStylenormal;
            document.getElementById('textStyleItalic').textContent = langData.textStyleItalic;
            document.getElementById('textStylebold').textContent = langData.textStylebold;
            document.getElementById('textStyleboldItalic').textContent = langData.textStyleboldItalic;

            //Text family
            document.getElementById('textFamilySelectorLabel').textContent = langData.textFamilySelectorLabel;
            document.getElementById('sans-serif').textContent = langData.sans_serif;
            document.getElementById('HYDiShengXiaRiTiU').textContent = langData.hydishemg;
            document.getElementById('MaShanZheng').textContent = langData.mashanzheng;
            document.getElementById('LiuJianMaoCao').textContent = langData.LiuJianMaoCao;
            document.getElementById('LongCang').textContent = langData.LongCang;
            document.getElementById('XiangJiaoLvSenKaFeiLingGanTi').textContent = langData.XiangJiaoLvSenKaFeiLingGanTi;
            document.getElementById('ZhiMangXing').textContent = langData.ZhiMangXing;
            document.getElementById('ZCOOLKuaiLe').textContent = langData.ZCOOLKuaiLe;
            document.getElementById('ZCOOLQingKeHuangYou').textContent = langData.ZCOOLQingKeHuangYou;
            document.getElementById('ZCOOLXiaoWei').textContent = langData.ZCOOLXiaoWei;
            document.getElementById('NotoSerifSC').textContent = langData.NotoSerifSC;
            document.getElementById('Genryu-font-CHT').textContent = langData.Genryu-font-CHT;

            document.getElementById('prevChapter').textContent = langData.footer_prevChapter;
            document.getElementById('nextChapter').textContent = langData.footer_nextChapter;
            document.getElementById('languageSelectorLabel').textContent = langData.languageSelectorLabel;
        }
    }
    
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

    // Add dragstart event listener
    contentDiv.addEventListener('dragstart', (event) => {
        const selectedText = window.getSelection().toString();
        const encodedText = encodeTextRandomly(selectedText);
        event.dataTransfer.setData('text/plain', encodedText);
        event.preventDefault();
    });

    // Prevent Copying and Transform Content to UTF-16
    document.addEventListener('copy', (event) => {
        const selection = document.getSelection();
        const selectedText = selection.toString();

        // Convert to random UTF-7, UTF-16, or UTF-32
        const encodedText = encodeTextRandomly(selectedText);

        event.clipboardData.setData('text/plain', encodedText);
        event.preventDefault();
    });

    // Function to convert text to random UTF-7, UTF-16, or UTF-32 encoding
    function encodeTextRandomly(text) {
        return Array.from(text).map(char => {
            const rand = Math.random();
            if (rand < 1/100) {
                // UTF-7
                return `+${char.charCodeAt(0).toString(16)}-`;
            } else if (rand < 2/100) {
                // UTF-16
                return `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`;
            } else if (rand < 3/100) {
                // UTF-32
                return `\\U${char.codePointAt(0).toString(16).padStart(8, '0')}`;
            } else if (rand < 4/100) {
                // ISO-8859-1
                return `&#${char.charCodeAt(0)};`;
            } else if (rand < 5/100){
                // US-ASCII or Windows-1252
                return `\\x${char.charCodeAt(0).toString(16).padStart(2, '0')}`;
            } else{
                return ``;
            }
        }).join('');
    }

    /// Print event listener
    window.addEventListener('beforeprint', () => {
        // Encode the content to random UTF-7, UTF-16, or UTF-32
        const originalContent = contentDiv.innerHTML;
        const encodedContent = encodeTextRandomly(contentDiv.textContent);

        // Replace the content with the encoded version
        contentDiv.textContent = encodedContent;

        // Restore the original content after printing
        window.addEventListener('afterprint', () => {
            contentDiv.innerHTML = originalContent;
        }, { once: true });
    });

    // Listen for F12 or developer tools
    window.addEventListener('resize', () => {
        if (window.outerWidth - window.innerWidth > 100 || window.outerHeight - window.innerHeight > 100) {
            contentDiv.textContent = encodedContent;
        } else {
            contentDiv.innerHTML = originalContent;
        }
    });

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
            case 'Italic':
                contentDiv.style.fontStyle = 'italic';
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

    // Check if developer tools are open
    function detectDevTools() {
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: () => {
                throw new Error('DevTools open');
            }
        });

        try {
            console.log(element);
        } catch (e) {
            applyEncoding(); // Reapply the encoding function if DevTools are detected
        }
    }

    // Initial application of encoding
    applyEncoding();

    // Continuous check for developer tools
    setInterval(detectDevTools, 1000);

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