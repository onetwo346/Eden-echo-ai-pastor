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
const versesList = document.getElementById('verses-list');
const versesGrid = document.getElementById('verses-grid');
const closePopupButton = document.getElementById('close-popup');
const backToChaptersButton = document.getElementById('back-to-chapters');

// Bible Books (Old and New Testament)
const oldTestamentBooks = [
  "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth", "1 Samuel", "2 Samuel",
  "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra", "Nehemiah", "Esther", "Job", "Psalms", "Proverbs",
  "Ecclesiastes", "Song of Solomon", "Isaiah", "Jeremiah", "Lamentations", "Ezekiel", "Daniel", "Hosea", "Joel",
  "Amos", "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah", "Malachi"
];

const newTestamentBooks = [
  "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians", "Galatians", "Ephesians",
  "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon",
  "Hebrews", "James", "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
];

// Populate Table of Contents
function populateTableOfContents() {
  oldTestamentBooks.forEach(book => {
    const button = document.createElement('button');
    button.textContent = book;
    button.addEventListener('click', () => showChaptersPopup(book));
    oldTestamentList.appendChild(button);
  });

  newTestamentBooks.forEach(book => {
    const button = document.createElement('button');
    button.textContent = book;
    button.addEventListener('click', () => showChaptersPopup(book));
    newTestamentList.appendChild(button);
  });
}

// Populate Book Select Options
function populateBookSelect() {
  oldTestamentBooks.forEach(book => {
    const option = document.createElement('option');
    option.value = book;
    option.textContent = book;
    oldTestamentBooksGroup.appendChild(option);
  });

  newTestamentBooks.forEach(book => {
    const option = document.createElement('option');
    option.value = book;
    option.textContent = book;
    newTestamentBooksGroup.appendChild(option);
  });
}

// Function to fetch chapters for a book
async function fetchChapters(book) {
  try {
    const response = await fetch(`https://bible-api.com/${book}`);
    const data = await response.json();
    return Array.from(new Set(data.verses.map(verse => verse.chapter))); // Get unique chapters
  } catch (error) {
    console.error('Failed to fetch chapters:', error);
    return [];
  }
}

// Function to fetch verses for a chapter
async function fetchVerses(book, chapter) {
  try {
    const response = await fetch(`https://bible-api.com/${book}+${chapter}`);
    const data = await response.json();
    return data.verses;
  } catch (error) {
    console.error('Failed to fetch verses:', error);
    return [];
  }
}

// Function to display chapters in the pop-up
async function showChaptersPopup(book) {
  popupBookTitle.textContent = book;
  chaptersList.innerHTML = ''; // Clear previous content
  versesList.style.display = 'none'; // Hide verses list
  chaptersList.style.display = 'grid'; // Show chapters list

  const chapters = await fetchChapters(book);
  chapters.forEach(chapter => {
    const chapterButton = document.createElement('button');
    chapterButton.textContent = `Chapter ${chapter}`;
    chapterButton.addEventListener('click', async () => {
      const verses = await fetchVerses(book, chapter);
      displayVerses(verses);
    });
    chaptersList.appendChild(chapterButton);
  });

  chaptersPopup.style.display = 'flex'; // Show pop-up
}

// Function to display verses in the pop-up
function displayVerses(verses) {
  versesGrid.innerHTML = ''; // Clear previous content
  verses.forEach(verse => {
    const verseButton = document.createElement('button');
    verseButton.textContent = `Verse ${verse.verse}`;
    verseButton.addEventListener('click', () => {
      verseText.textContent = verse.text;
      verseContext.textContent = `Context: ${verse.book_name} ${verse.chapter}:${verse.verse}`;
      chaptersPopup.style.display = 'none'; // Close pop-up after selection
    });
    versesGrid.appendChild(verseButton);
  });

  versesList.style.display = 'block'; // Show verses list
  chaptersList.style.display = 'none'; // Hide chapters list
}

// Close pop-up when close button is clicked
closePopupButton.addEventListener('click', () => {
  chaptersPopup.style.display = 'none';
});

// Back to chapters list
backToChaptersButton.addEventListener('click', () => {
  versesList.style.display = 'none';
  chaptersList.style.display = 'grid';
});

// Switch to Main Page
enterButton.addEventListener('click', () => {
  introPage.style.display = 'none';
  mainPage.style.display = 'block';
});

// Fetch Bible Verse
async function fetchBibleVerse() {
  const book = bookInput.value;
  const chapter = chapterInput.value;
  const verse = verseInput.value;

  if (!book || !chapter || !verse) {
    alert('Please fill in all fields.');
    return;
  }

  try {
    const response = await fetch(`https://bible-api.com/${book}+${chapter}:${verse}`);
    const data = await response.json();
    verseText.textContent = data.text;
    verseContext.textContent = `Context: ${data.reference}`;
  } catch (error) {
    verseText.textContent = 'Failed to fetch Bible verse.';
    verseContext.textContent = '';
  }
}

// Send Chat Message to AI Pastor
async function sendChatMessage() {
  const message = chatInput.value;

  if (!message) {
    alert('Please enter a question.');
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    chatResponse.innerHTML = `<strong>AI Pastor:</strong> ${data.reply}`;
  } catch (error) {
    chatResponse.textContent = 'Failed to get AI response.';
  }
}

// Daily Quotes Feed
const quotes = [
  "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life. - John 3:16",
  "Trust in the Lord with all your heart and lean not on your own understanding. - Proverbs 3:5",
  "I can do all things through Christ who strengthens me. - Philippians 4:13",
];

function updateQuotesFeed() {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quotesFeed.textContent = randomQuote;
}

// Update quotes every 5 seconds
setInterval(updateQuotesFeed, 5000);
updateQuotesFeed();

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

updateDevotions();

// Event Listeners
fetchVerseButton.addEventListener('click', fetchBibleVerse);
sendChatButton.addEventListener('click', sendChatMessage);

// Initialize Table of Contents and Book Select
populateTableOfContents();
populateBookSelect();