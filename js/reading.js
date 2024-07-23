document.addEventListener('DOMContentLoaded', () => {
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
    const fontSizeInputFooter = document.getElementById('fontSizeInputFooter');
    const fontSizeValueSidebar = document.getElementById('fontSizeValueSidebar');

    let chapters = [];
    let currentChapterIndex = 0;
    let isInChapterListView = false; // Track if we are in the chapter list view

    const updateFontSize = (size) => {
        contentDiv.style.fontSize = `${size}px`;
    };

    const defaultFontSize = 22;
    updateFontSize(defaultFontSize);
    fontSizeSliderSidebar.value = defaultFontSize;
    fontSizeInputFooter.value = defaultFontSize;
    fontSizeValueSidebar.textContent = defaultFontSize;

    fontSizeSliderSidebar.addEventListener('input', (e) => {
        const size = e.target.value;
        updateFontSize(size);
        fontSizeInputFooter.value = size;
        fontSizeValueSidebar.textContent = size;
    });

    fontSizeInputFooter.addEventListener('input', (e) => {
        let size = parseInt(e.target.value);
        size = Math.max(10, Math.min(size, 46)); // Clamp size between 10 and 46
        updateFontSize(size);
        fontSizeInputFooter.value = size;
        fontSizeSliderSidebar.value = size;
        fontSizeValueSidebar.textContent = size;
    });

    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('file');

    if (fileName) {
        const filePath = `data/txt/${fileName}`;

        fetch(filePath)
            .then(response => response.text())
            .then(text => {
                chapters = text.split(/\n(?=第\d+章 )/);
                loadChapter(currentChapterIndex);
                populateChapterList();
                updateNavigationButtons();
            })
            .catch(error => {
                console.error('Error loading novel content:', error);
            });

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
                updateNavigationButtons();
            }
        }

        function updateNavigationButtons() {
            prevFooterBtn.disabled = currentChapterIndex === 0;
            nextFooterBtn.disabled = currentChapterIndex === chapters.length - 1;
            prevBtnSidebar.disabled = currentChapterIndex === 0;
            nextBtnSidebar.disabled = currentChapterIndex === chapters.length - 1;
        }

        function populateChapterList() {
            chapterList.innerHTML = chapters.map((chapter, index) => {
                const [title] = chapter.split('\n');
                if (title.startsWith('第')) {
                    return `<button class="chapter-item" data-index="${index}">${title}</button>`;
                }
                return '';
            }).join('');

            chapterList.querySelectorAll('.chapter-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    loadChapter(parseInt(e.target.getAttribute('data-index')));
                    menu.classList.remove('open');
                    document.body.classList.remove('menu-open');
                });
            });
        }

        function showChapterList() {
            isInChapterListView = true;
            prevBtnSidebar.style.display = 'none';
            nextBtnSidebar.style.display = 'none';
            chapterListSidebar.style.display = 'none';
            chapterList.style.display = 'block';
        }

        function showMenuButtons() {
            isInChapterListView = false;
            prevBtnSidebar.style.display = 'block';
            nextBtnSidebar.style.display = 'block';
            chapterListSidebar.style.display = 'block';
            chapterList.style.display = 'none';
        }

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
            if (currentChapterIndex > 0) {
                loadChapter(currentChapterIndex - 1);
            }
        });

        nextBtnSidebar.addEventListener('click', () => {
            if (currentChapterIndex < chapters.length - 1) {
                loadChapter(currentChapterIndex + 1);
            }
        });

        chapterListSidebar.addEventListener('click', () => {
            showChapterList(); // Show chapter list
        });

        prevFooterBtn.addEventListener('click', () => {
            if (currentChapterIndex > 0) {
                loadChapter(currentChapterIndex - 1);
            }
        });

        nextFooterBtn.addEventListener('click', () => {
            if (currentChapterIndex < chapters.length - 1) {
                loadChapter(currentChapterIndex + 1);
            }
        });
    } else {
        contentDiv.innerHTML = '<p>Unable to load novel content.</p>';
    }
});
