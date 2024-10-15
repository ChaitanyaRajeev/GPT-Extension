console.log("Content script starting...");

// Function to add the custom button at the top
function addCustomButton() {
  console.log("Attempting to add custom button...");
  
  if (!document.querySelector('.custom-button-container')) {
    console.log("Custom button container doesn't exist yet. Creating button...");
    
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'custom-button-container';

    const customButton = document.createElement('button');
    customButton.textContent = 'View Notes';
    customButton.className = 'custom-button';

    customButton.addEventListener('click', function() {
      console.log("Custom button clicked");
      showNotes();
    });

    buttonContainer.appendChild(customButton);
    document.body.appendChild(buttonContainer);
    
    console.log('Custom button added successfully');
  }
}

// Function to add custom icon next to a copy button
function addCustomIconToCopyButton(copyButton) {
  console.log("Adding custom icon to copy button", copyButton);
  
  if (copyButton.nextElementSibling && copyButton.nextElementSibling.classList.contains('custom-icon-container')) {
    console.log("Custom icon already exists");
    return;
  }

  const customIconContainer = document.createElement('div');
  customIconContainer.className = 'custom-icon-container';
  customIconContainer.style.position = 'relative';
  customIconContainer.style.display = 'inline-block';
  customIconContainer.style.verticalAlign = 'middle';

  const customIcon = document.createElement('span');
  customIcon.className = 'custom-icon';
  customIcon.innerHTML = '🚀';
  customIcon.style.fontSize = '20px';
  customIcon.style.marginLeft = '8px';
  customIcon.style.cursor = 'pointer';
  customIcon.style.display = 'inline-flex';
  customIcon.style.alignItems = 'center';

  const tooltip = document.createElement('div');
  tooltip.textContent = 'Save to Note';
  tooltip.style.visibility = 'hidden';
  tooltip.style.backgroundColor = 'rgba(0,0,0,0.8)';
  tooltip.style.color = '#fff';
  tooltip.style.textAlign = 'center';
  tooltip.style.borderRadius = '6px';
  tooltip.style.padding = '5px 10px';
  tooltip.style.position = 'absolute';
  tooltip.style.zIndex = '10000';
  tooltip.style.bottom = '125%';
  tooltip.style.left = '50%';
  tooltip.style.transform = 'translateX(-50%)';
  tooltip.style.whiteSpace = 'nowrap';
  tooltip.style.opacity = '0';
  tooltip.style.transition = 'opacity 0.3s';

  customIconContainer.appendChild(customIcon);
  customIconContainer.appendChild(tooltip);

  customIconContainer.addEventListener('mouseover', () => {
    tooltip.style.visibility = 'visible';
    tooltip.style.opacity = '1';
  });

  customIconContainer.addEventListener('mouseout', () => {
    tooltip.style.visibility = 'hidden';
    tooltip.style.opacity = '0';
  });

  customIcon.addEventListener('click', function() {
    console.log("Custom icon clicked");
    const textToSave = findTextToCopy(copyButton);
    if (textToSave) {
      saveNote(textToSave);
      customIcon.style.color = 'green';
      setTimeout(() => {
        customIcon.style.color = '';
      }, 1000);
    } else {
      console.log("No text found to save");
    }
  });

  copyButton.parentNode.insertBefore(customIconContainer, copyButton.nextSibling);
  console.log("Custom icon added successfully");
}

// Function to save a note
function saveNote(html) {
  const notes = JSON.parse(localStorage.getItem('chatgpt_notes') || '[]');
  const plainText = html.replace(/<[^>]*>/g, '');
  const title = generateTitle(plainText);
  const summary = generateSummary(plainText);
  const newNote = {
    id: Date.now(),
    html: html,
    title: title,
    summary: summary,
    date: new Date().toISOString()
  };
  notes.push(newNote);
  localStorage.setItem('chatgpt_notes', JSON.stringify(notes));
  console.log("Note saved successfully:", newNote);
}

function generateTitle(text) {
  const words = text.trim().split(/\s+/);
  return words.length > 5 ? words.slice(0, 5).join(' ') + '...' : words.join(' ');
}

function generateSummary(text) {
  const trimmedText = text.trim();
  return trimmedText.length > 100 ? trimmedText.substring(0, 100) + '...' : trimmedText;
}

// Function to show notes
function showNotes() {
  const notes = JSON.parse(localStorage.getItem('chatgpt_notes') || '[]');
  
  const notesContainer = document.createElement('div');
  Object.assign(notesContainer.style, {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'var(--surface-primary, #ffffff)',
    color: 'var(--text-primary, #000000)',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    zIndex: '10001',
    maxHeight: '80vh',
    overflowY: 'auto',
    width: '80%',
    maxWidth: '600px',
    fontFamily: 'var(--font-family-sans)'
  });

  const title = document.createElement('h2');
  title.textContent = 'Saved Notes';
  Object.assign(title.style, {
    marginBottom: '20px',
    fontSize: '1.5em',
    fontWeight: 'bold'
  });
  notesContainer.appendChild(title);

  // Define the createButton function within showNotes
  const createButton = (text, bgColor) => {
    const button = document.createElement('button');
    button.textContent = text;
    Object.assign(button.style, {
      padding: '5px 10px',
      backgroundColor: bgColor,
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.875em',
      transition: 'background-color 0.3s'
    });
    return button;
  };

  if (notes.length === 0) {
    const noNotes = document.createElement('p');
    noNotes.textContent = 'No notes saved yet.';
    notesContainer.appendChild(noNotes);
  } else {
    const notesList = document.createElement('ul');
    Object.assign(notesList.style, {
      listStyleType: 'none',
      padding: '0',
      margin: '0'
    });

    notes.forEach(note => {
      const listItem = document.createElement('li');
      Object.assign(listItem.style, {
        marginBottom: '10px',
        padding: '10px',
        backgroundColor: 'var(--surface-secondary, #f7f7f8)',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      });

      const noteInfo = document.createElement('div');
      noteInfo.style.flex = '1';

      const noteTitle = document.createElement('h3');
      noteTitle.textContent = note.title || generateTitle(note.html.replace(/<[^>]*>/g, ''));
      noteTitle.style.margin = '0 0 5px 0';
      noteTitle.style.fontSize = '1em';
      noteTitle.style.fontWeight = 'bold';
      noteInfo.appendChild(noteTitle);

      const noteSummary = document.createElement('p');
      noteSummary.textContent = note.summary || generateSummary(note.html.replace(/<[^>]*>/g, ''));
      noteSummary.style.margin = '0';
      noteSummary.style.fontSize = '0.9em';
      noteSummary.style.color = 'var(--text-secondary, #6e6e80)';
      noteInfo.appendChild(noteSummary);

      listItem.appendChild(noteInfo);

      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.gap = '5px';

      const viewButton = createButton('View', 'var(--success-primary, #10a37f)');
      viewButton.addEventListener('click', () => viewFullNote(note.id));
      viewButton.addEventListener('mouseover', () => viewButton.style.backgroundColor = 'var(--success-secondary, #1a7f64)');
      viewButton.addEventListener('mouseout', () => viewButton.style.backgroundColor = 'var(--success-primary, #10a37f)');
      buttonContainer.appendChild(viewButton);

      const deleteButton = createButton('Delete', 'var(--error-primary, #ef4146)');
      deleteButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this note?')) {
          deleteNote(note.id);
          notesContainer.remove();
          showNotes();
        }
      });
      deleteButton.addEventListener('mouseover', () => deleteButton.style.backgroundColor = 'var(--error-secondary, #c51f24)');
      deleteButton.addEventListener('mouseout', () => deleteButton.style.backgroundColor = 'var(--error-primary, #ef4146)');
      buttonContainer.appendChild(deleteButton);

      listItem.appendChild(buttonContainer);
      notesList.appendChild(listItem);
    });

    notesContainer.appendChild(notesList);
  }

  const closeButton = createButton('Close', 'var(--surface-tertiary, #ececf1)');
  closeButton.style.color = 'var(--text-primary, #000000)';
  closeButton.style.marginTop = '20px';
  closeButton.addEventListener('click', () => notesContainer.remove());
  closeButton.addEventListener('mouseover', () => closeButton.style.backgroundColor = 'var(--surface-quaternary, #d9d9e3)');
  closeButton.addEventListener('mouseout', () => closeButton.style.backgroundColor = 'var(--surface-tertiary, #ececf1)');

  notesContainer.appendChild(closeButton);
  document.body.appendChild(notesContainer);
}

// Function to view full note
function viewFullNote(id) {
  const notes = JSON.parse(localStorage.getItem('chatgpt_notes') || '[]');
  const note = notes.find(n => n.id === id);
  
  if (note) {
    const fullNoteContainer = document.createElement('div');
    Object.assign(fullNoteContainer.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'var(--surface-primary, #ffffff)',
      color: 'var(--text-primary, #000000)',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      zIndex: '10002',
      maxHeight: '80vh',
      overflowY: 'auto',
      width: '80%',
      maxWidth: '600px',
      fontFamily: 'var(--font-family-sans)'
    });

    const noteTitle = document.createElement('h3');
    noteTitle.textContent = note.title || generateTitle(note.html.replace(/<[^>]*>/g, ''));
    noteTitle.style.marginBottom = '10px';
    noteTitle.style.fontSize = '1.2em';
    noteTitle.style.fontWeight = 'bold';
    fullNoteContainer.appendChild(noteTitle);

    const noteContent = document.createElement('div');
    noteContent.innerHTML = note.html;
    noteContent.style.whiteSpace = 'pre-wrap';
    fullNoteContainer.appendChild(noteContent);

    // Add styles to preserve formatting
    const style = document.createElement('style');
    style.textContent = `
      .viewFullNote pre {
        background-color: var(--surface-secondary, #f7f7f8);
        border: 1px solid var(--border-primary, #e5e5e5);
        border-radius: 4px;
        padding: 10px;
        overflow-x: auto;
      }
      .viewFullNote code {
        font-family: var(--font-family-mono);
        background-color: var(--surface-secondary, #f7f7f8);
        padding: 2px 4px;
        border-radius: 3px;
      }
    `;
    fullNoteContainer.appendChild(style);
    fullNoteContainer.classList.add('viewFullNote');

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    Object.assign(closeButton.style, {
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: 'var(--surface-tertiary, #ececf1)',
      color: 'var(--text-primary, #000000)',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.875em',
      transition: 'background-color 0.3s'
    });
    closeButton.addEventListener('click', () => fullNoteContainer.remove());
    closeButton.addEventListener('mouseover', () => closeButton.style.backgroundColor = 'var(--surface-quaternary, #d9d9e3)');
    closeButton.addEventListener('mouseout', () => closeButton.style.backgroundColor = 'var(--surface-tertiary, #ececf1)');

    fullNoteContainer.appendChild(closeButton);
    document.body.appendChild(fullNoteContainer);
  }
}

// Function to add custom icons to all copy buttons
function addCustomIconsToAllCopyButtons() {
  const copyButtons = document.querySelectorAll('button[data-testid="copy-turn-action-button"]');
  copyButtons.forEach(addCustomIconToCopyButton);
}

// Function to add styles
function addCustomStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .custom-button-container {
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
    }
    .custom-button {
      background-color: #10a37f;
      color: white;
      border: none;
      padding: 8px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    .custom-button:hover {
      background-color: #1a7f64;
    }
    .custom-icon {
      transition: transform 0.2s ease-in-out;
    }
    .custom-icon:hover {
      transform: scale(1.2);
    }
  `;
  document.head.appendChild(style);
}

// Function to initialize the extension
function initExtension() {
  console.log("Initializing extension...");
  migrateOldNotes();
  addCustomStyles();
  addCustomButton();
  addCustomIconsToAllCopyButtons();
  logDocumentStructure();
}

// Run the initialization
window.addEventListener('load', initExtension);

// Mutation Observer setup
const observer = new MutationObserver((mutations) => {
  console.log("Mutation observed");
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          console.log("New element added:", node);
          const copyButtons = node.querySelectorAll('button[data-testid="copy-turn-action-button"]');
          copyButtons.forEach(addCustomIconToCopyButton);
        }
      });
    }
  });
});

// Start observing the document body for changes
console.log("Starting observation");
observer.observe(document.body, { childList: true, subtree: true });

console.log("Content script finished loading");

function logDocumentStructure() {
    console.log("Document structure:");
    const body = document.body;
    function logElement(element, depth = 0) {
        console.log(`${'  '.repeat(depth)}${element.tagName.toLowerCase()}${element.id ? '#' + element.id : ''}${Array.from(element.classList).map(c => '.' + c).join('')}`);
        Array.from(element.children).forEach(child => logElement(child, depth + 1));
    }
    logElement(body);
}

// Initial call to add custom button
addCustomButton();

window.addEventListener('load', function() {
    setTimeout(addCustomButton, 3000);  // Increased delay to 3 seconds
});

// Function to find the text to copy
function findTextToCopy(copyButton) {
    console.log("Attempting to find text to copy...");
    
    let currentElement = copyButton;
    let depth = 0;
    const maxDepth = 10;
    
    while (currentElement && depth < maxDepth) {
        console.log(`Checking element:`, currentElement);
        
        if (currentElement.classList.contains('text-base') || currentElement.hasAttribute('data-message-author-role')) {
            console.log("Found message container:", currentElement);
            
            const textElements = currentElement.querySelectorAll('.markdown, .text-message-content, .whitespace-pre-wrap');
            if (textElements.length > 0) {
                const html = Array.from(textElements).map(el => el.innerHTML).join('\n');
                console.log("HTML found:", html);
                return html;
            }
            
            const html = currentElement.innerHTML
                .replace(/^ChatGPT/, '') // Remove "ChatGPT" prefix
                .replace(/🚀.*$/, ''); // Remove rocket emoji and anything after it
            console.log("Fallback: using filtered HTML from the message container:", html);
            return html;
        }
        
        currentElement = currentElement.parentElement;
        depth++;
    }
    
    console.log("No text found to copy");
    return null;
}

function deleteNote(id) {
  console.log("Attempting to delete note with id:", id);
  let notes = JSON.parse(localStorage.getItem('chatgpt_notes') || '[]');
  const initialLength = notes.length;
  notes = notes.filter(note => note.id !== id);
  if (notes.length < initialLength) {
    localStorage.setItem('chatgpt_notes', JSON.stringify(notes));
    console.log("Note deleted successfully:", id);
  } else {
    console.log("Note not found:", id);
  }
}

function migrateOldNotes() {
  const notes = JSON.parse(localStorage.getItem('chatgpt_notes') || '[]');
  const updatedNotes = notes.map(note => {
    if (!note.title || !note.summary) {
      const plainText = note.html.replace(/<[^>]*>/g, '');
      return {
        ...note,
        title: note.title || generateTitle(plainText),
        summary: note.summary || generateSummary(plainText)
      };
    }
    return note;
  });
  localStorage.setItem('chatgpt_notes', JSON.stringify(updatedNotes));
}
