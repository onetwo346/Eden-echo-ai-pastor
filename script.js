// DOM Elements
const introPage = document.getElementById('intro-page');
const mainPage = document.getElementById('main-page');
const enterButton = document.getElementById('enter-button');
const fetchVerseButton = document.getElementById('fetch-verse');
const bookInput = document.getElementById('book');
const chapterInput = document.getElementById('chapter');
const verseInput = document.getElementById('verse');
const verseText = document.getElementById('verse-text');
const verseContext = document.getElementById('verse-context');
const chatInput = document.getElementById('chat-input');
const sendChatButton = document.getElementById('send-chat');
const chatResponse = document.getElementById('chat-response');
const quotesFeed = document.getElementById('quotes-feed');
const devotionsContent = document.getElementById('devotions-content');
const oldTestamentList = document.getElementById('old-testament');
const newTestamentList = document.getElementById('new-testament');
const oldTestamentBooksGroup = document.getElementById('old-testament-books');
const newTestamentBooksGroup = document.getElementById('new-testament-books');

// Pop-up Elements
const chaptersPopup = document.getElementById('chapters-popup');
const popupBookTitle = document.getElementById('popup-book-title');
const chaptersList = document.getElementById('chapters-list');
const closePopupButton = document.getElementById('close-popup');

// Bible Data (Loaded from JSON)
let bibleData = null;

// Load Bible Data
async function loadBibleData() {
  const response = await fetch('bible.json'); // Ensure you have a bible.json file
  bibleData = await response.json();
}

// Populate Table of Contents
function populateTableOfContents() {
  bibleData.books.forEach(book => {
    const button = document.createElement('button');
    button.textContent = book.name;
    button.addEventListener('click', () => showChaptersPopup(book));
    if (book.testament === 'OT') {
      oldTestamentList.appendChild(button);
    } else {
      newTestamentList.appendChild(button);
    }
  });
}

// Show Chapters Pop-up with Full Book Content
function showChaptersPopup(book) {
  popupBookTitle.textContent = book.name;
  chaptersList.innerHTML = ''; // Clear previous content

  // Display all chapters and verses
  book.chapters.forEach((chapter, chapterIndex) => {
    const chapterDiv = document.createElement('div');
    chapterDiv.className = 'chapter-container';
    chapterDiv.innerHTML = `<h4>Chapter ${chapterIndex + 1}</h4>`;

    chapter.verses.forEach((verse, verseIndex) => {
      const verseParagraph = document.createElement('p');
      verseParagraph.textContent = `Verse ${verseIndex + 1}: ${verse}`;
      chapterDiv.appendChild(verseParagraph);
    });

    chaptersList.appendChild(chapterDiv);
  });

  chaptersPopup.style.display = 'flex'; // Show pop-up
}

// Close Pop-up
closePopupButton.addEventListener('click', () => {
  chaptersPopup.style.display = 'none';
});

// Switch to Main Page
enterButton.addEventListener('click', () => {
  introPage.style.display = 'none';
  mainPage.style.display = 'block';
});

// Fetch Bible Verse
function fetchBibleVerse() {
  const book = bibleData.books.find(b => b.name === bookInput.value);
  const chapter = parseInt(chapterInput.value);
  const verse = parseInt(verseInput.value);

  if (!book || !chapter || !verse) {
    alert('Please fill in all fields.');
    return;
  }

  const verseTextContent = book.chapters[chapter - 1]?.verses[verse - 1];
  if (verseTextContent) {
    verseText.textContent = verseTextContent;
    verseContext.textContent = `Context: ${book.name} ${chapter}:${verse}`;
  } else {
    verseText.textContent = 'Verse not found.';
    verseContext.textContent = '';
  }
}

// Send Chat Message (Mock AI)
function sendChatMessage() {
  const message = chatInput.value;
  if (!message) {
    alert('Please enter a question.');
    return;
  }
  chatResponse.innerHTML = `<strong>AI Pastor:</strong> Your question has been received. Please wait for a response.`;
  chatInput.value = '';
}

// Daily Quotes
const quotes = [
  "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. - John 3:16",
  "Trust in the Lord with all your heart and lean not on your own understanding. - Proverbs 3:5",
  "I can do all things through Christ who strengthens me. - Philippians 4:13",
];

function updateQuotesFeed() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quotesFeed.textContent = randomQuote;
}

// Daily Devotions
const devotions = [
  "Today's Devotion: Read John 3 and reflect on God's love for the world.",
  "Today's Devotion: Meditate on Proverbs 3:5-6 and trust in the Lord.",
  "Today's Devotion: Study Philippians 4:13 and find strength in Christ.",
];

function updateDevotions() {
  const randomDevotion = devotions[Math.floor(Math.random() * devotions.length)];
  devotionsContent.textContent = randomDevotion;
}

// Initialize
loadBibleData().then(() => {
  populateTableOfContents();
  updateQuotesFeed();
  updateDevotions();
});

// Event Listeners
fetchVerseButton.addEventListener('click', fetchBibleVerse);
sendChatButton.addEventListener('click', sendChatMessage);
