// DOM Elements
const DOM = {
  pages: {
    introPage: document.getElementById('intro-page'),
    mainPage: document.getElementById('main-page'),
  },
  buttons: {
    enterButton: document.getElementById('enter-button'),
    fetchVerseButton: document.getElementById('fetch-verse'),
    sendChatButton: document.getElementById('send-chat'),
    closePopupButton: document.getElementById('close-popup'),
  },
  inputs: {
    bookInput: document.getElementById('book'),
    chapterInput: document.getElementById('chapter'),
    verseInput: document.getElementById('verse'),
    chatInput: document.getElementById('chat-input'),
  },
  displays: {
    verseText: document.getElementById('verse-text'),
    verseContext: document.getElementById('verse-context'),
    chatResponse: document.getElementById('chat-response'),
    quotesFeed: document.getElementById('quotes-feed'),
    devotionsContent: document.getElementById('devotions-content'),
  },
  toc: {
    oldTestamentList: document.getElementById('old-testament'),
    newTestamentList: document.getElementById('new-testament'),
  },
  popup: {
    chaptersPopup: document.getElementById('chapters-popup'),
    popupBookTitle: document.getElementById('popup-book-title'),
    chaptersList: document.getElementById('chapters-list'),
  },
};

// Bible API Configuration
const BibleAPI = {
  key: 'YOUR_BIBLE_API_KEY_HERE', // Replace with your api.bible key
  baseUrl: 'https://api.scripture.api.bible/v1',
  bibleId: 'de4e12af7f28f599-01', // ESV Bible ID (example)
  async fetchBooks() {
    const response = await fetch(`${this.baseUrl}/bibles/${this.bibleId}/books`, {
      headers: { 'api-key': this.key },
    });
    if (!response.ok) throw new Error('Failed to fetch books');
    const data = await response.json();
    return data.data;
  },
  async fetchChapters(bookId) {
    const response = await fetch(`${this.baseUrl}/bibles/${this.bibleId}/books/${bookId}/chapters`, {
      headers: { 'api-key': this.key },
    });
    if (!response.ok) throw new Error('Failed to fetch chapters');
    const data = await response.json();
    return data.data;
  },
  async fetchVerse(book, chapter, verse) {
    const verseId = `${book}.${chapter}.${verse}`; // e.g., "GEN.1.1"
    const response = await fetch(`${this.baseUrl}/bibles/${this.bibleId}/verses/${verseId}`, {
      headers: { 'api-key': this.key },
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data.content;
  },
};

// UI Manager
const UI = {
  showPage(page) {
    Object.values(DOM.pages).forEach(p => (p.style.display = 'none'));
    page.style.display = 'block';
  },
  async populateTOC() {
    const books = await BibleAPI.fetchBooks();
    books.forEach(book => {
      const button = document.createElement('button');
      button.textContent = book.name;
      button.dataset.bookId = book.id;
      button.addEventListener('click', () => this.showChaptersPopup(book));
      const targetList = book.id.startsWith('O') ? DOM.toc.oldTestamentList : DOM.toc.newTestamentList; // Rough OT/NT split
      targetList.appendChild(button);
    });
  },
  async showChaptersPopup(book) {
    DOM.popup.popupBookTitle.textContent = book.name;
    DOM.popup.chaptersList.innerHTML = '<p>Loading chapters...</p>';
    DOM.popup.chaptersPopup.style.display = 'flex';

    const chapters = await BibleAPI.fetchChapters(book.id);
    DOM.popup.chaptersList.innerHTML = '';
    chapters.forEach(chapter => {
      const chapterDiv = document.createElement('div');
      chapterDiv.className = 'chapter-container';
      chapterDiv.innerHTML = `<h4>${chapter.number}</h4>`;
      chapterDiv.addEventListener('click', () => this.fetchChapterVerses(book.id, chapter.number));
      DOM.popup.chaptersList.appendChild(chapterDiv);
    });
  },
  async fetchChapterVerses(bookId, chapterNum) {
    const verses = await fetch(`${BibleAPI.baseUrl}/bibles/${BibleAPI.bibleId}/chapters/${bookId}.${chapterNum}`, {
      headers: { 'api-key': BibleAPI.key },
    }).then(res => res.json());
    DOM.popup.chaptersList.innerHTML = `<h4>${chapterNum}</h4>`;
    const content = verses.data.content;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    doc.querySelectorAll('p').forEach(p => {
      DOM.popup.chaptersList.appendChild(p);
    });
  },
  closePopup() {
    DOM.popup.chaptersPopup.style.display = 'none';
  },
  displayVerse(text, context) {
    DOM.displays.verseText.innerHTML = text || 'Verse not found.';
    DOM.displays.verseContext.textContent = context || '';
  },
};

// Chat Module (Contextual Mock AI)
const Chat = {
  async sendMessage(message) {
    if (!message.trim()) {
      alert('Please enter a question.');
      return;
    }
    DOM.displays.chatResponse.innerHTML = `<strong>AI Pastor:</strong> Thinking...`;
    const response = await this.generateResponse(message);
    DOM.displays.chatResponse.innerHTML = `<strong>AI Pastor:</strong> ${response}`;
    DOM.inputs.chatInput.value = '';
  },
  async generateResponse(message) {
    // Mock contextual response based on message content
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('verse') || lowerMsg.includes('chapter')) {
      return 'Try looking up a specific verse or chapter using the search tool above!';
    } else if (lowerMsg.includes('god') || lowerMsg.includes('love')) {
      const verse = await BibleAPI.fetchVerse('JHN', 3, 16); // John 3:16
      return `Here’s a thought: "${verse}" - How does that speak to your question?`;
    }
    return `Reflect on this: "${message}" - How might Scripture guide you here?`;
  },
};

// Daily Content Module
const DailyContent = {
  quotes: ['John 3:16', 'Proverbs 3:5', 'Philippians 4:13'],
  devotions: ['Reflect on John 3.', 'Meditate on Proverbs 3:5-6.', 'Study Philippians 4:13.'],
  async update() {
    const quoteRef = this.quotes[Math.floor(Math.random() * this.quotes.length)];
    const [book, chapter, verse] = quoteRef.match(/(\w+)\s(\d+):(\d+)/).slice(1);
    const quoteText = await BibleAPI.fetchVerse(book, chapter, verse);
    DOM.displays.quotesFeed.innerHTML = `${quoteText} - ${quoteRef}`;
    DOM.displays.devotionsContent.textContent = this.devotions[Math.floor(Math.random() * this.devotions.length)];
  },
};

// Event Handlers
const Handlers = {
  enter() {
    UI.showPage(DOM.pages.mainPage);
  },
  async fetchVerse() {
    const book = DOM.inputs.bookInput.value.trim();
    const chapter = parseInt(DOM.inputs.chapterInput.value);
    const verse = parseInt(DOM.inputs.verseInput.value);
    if (!book || isNaN(chapter) || isNaN(verse)) {
      alert('Please fill in all fields correctly.');
      return;
    }
    const verseText = await BibleAPI.fetchVerse(book, chapter, verse);
    UI.displayVerse(verseText, verseText ? `${book} ${chapter}:${verse}` : '');
  },
  sendChat() {
    Chat.sendMessage(DOM.inputs.chatInput.value);
  },
};

// Autocomplete for Book Input
async function setupAutocomplete() {
  const books = await BibleAPI.fetchBooks();
  DOM.inputs.bookInput.addEventListener('input', (e) => {
    const value = e.target.value.toLowerCase();
    const suggestions = books.filter(b => b.name.toLowerCase().startsWith(value));
    // Add datalist or custom dropdown here if desired
    console.log(suggestions.map(b => b.name)); // Placeholder for UI
  });
}

// Initialization
async function init() {
  await UI.populateTOC();
  await DailyContent.update();
  setupAutocomplete();
  DOM.buttons.enterButton.addEventListener('click', Handlers.enter);
  DOM.buttons.fetchVerseButton.addEventListener('click', Handlers.fetchVerse);
  DOM.buttons.sendChatButton.addEventListener('click', Handlers.sendChat);
  DOM.buttons.closePopupButton.addEventListener('click', UI.closePopup);
}

init();
