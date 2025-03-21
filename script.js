@@ -22,10 +22,7 @@ const newTestamentBooksGroup = document.getElementById('new-testament-books');
 const chaptersPopup = document.getElementById('chapters-popup');
 const popupBookTitle = document.getElementById('popup-book-title');
 const chaptersList = document.getElementById('chapters-list');
 const versesList = document.getElementById('verses-list');
 const versesGrid = document.getElementById('verses-grid');
 const closePopupButton = document.getElementById('close-popup');
 const backToChaptersButton = document.getElementById('back-to-chapters');
 
 // Bible Data (Loaded from JSON)
 let bibleData = null;
 @@ -50,52 +47,34 @@ function populateTableOfContents() {
   });
 }
 
 // Show Chapters Pop-up
 // Show Chapters Pop-up with Full Book Content
 function showChaptersPopup(book) {
   popupBookTitle.textContent = book.name;
   chaptersList.innerHTML = '';
   versesList.style.display = 'none';
   chaptersList.style.display = 'grid';
 
   book.chapters.forEach((chapter, index) => {
     const chapterButton = document.createElement('button');
     chapterButton.textContent = `Chapter ${index + 1}`;
     chapterButton.addEventListener('click', () => displayVerses(book, index + 1));
     chaptersList.appendChild(chapterButton);
   });
 
   chaptersPopup.style.display = 'flex';
 }
 
 // Display Verses
 function displayVerses(book, chapter) {
   versesGrid.innerHTML = '';
   book.chapters[chapter - 1].verses.forEach((verse, index) => {
     const verseButton = document.createElement('button');
     verseButton.textContent = `Verse ${index + 1}`;
     verseButton.addEventListener('click', () => {
       verseText.textContent = verse;
       verseContext.textContent = `Context: ${book.name} ${chapter}:${index + 1}`;
       chaptersPopup.style.display = 'none';
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
     versesGrid.appendChild(verseButton);
 
     chaptersList.appendChild(chapterDiv);
   });
 
   versesList.style.display = 'block';
   chaptersList.style.display = 'none';
   chaptersPopup.style.display = 'flex'; // Show pop-up
 }
 
 // Close Pop-up
 closePopupButton.addEventListener('click', () => {
   chaptersPopup.style.display = 'none';
 });
 
 // Back to Chapters
 backToChaptersButton.addEventListener('click', () => {
   versesList.style.display = 'none';
   chaptersList.style.display = 'grid';
 });
 
 // Switch to Main Page
 enterButton.addEventListener('click', () => {
   introPage.style.display = 'none';
