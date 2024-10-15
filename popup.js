document.addEventListener('DOMContentLoaded', function() {
    const notesList = document.getElementById('notesList');
    const noteContent = document.getElementById('noteContent');

    function displayNotes() {
        const notes = JSON.parse(localStorage.getItem('chatgpt_notes') || '[]');
        notesList.innerHTML = '';
        notes.reverse().forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note-item';
            noteElement.textContent = note.text.substring(0, 50) + '...';
            noteElement.addEventListener('click', () => displayNoteContent(note));
            notesList.appendChild(noteElement);
        });
    }

    function displayNoteContent(note) {
        noteContent.textContent = note.text;
    }

    displayNotes();
});
