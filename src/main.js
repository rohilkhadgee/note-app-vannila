//global query selectore
const noteContainer = document.querySelector('.note-container')
const modalContainer = document.querySelector('.modal-container')
const form = document.querySelector('form')
const titleInput = document.querySelector('#title')

//class: for creating a new note


class Note{
    constructor(title, body){
        this.title = title
        this.body = body
        this.id = Math.random()
    }
}



///LOCAL STORAGE////
// function : retrive notes from local storag
function getNotes(){
    let notes
    if(localStorage.getItem('noteApp.notes') === null){
        notes = []


    }else{
        notes = JSON.parse(localStorage.getItem('noteApp.notes'))
    }

    return(notes)
}



//function add a note to a local storage
function addNoteToLocalStorage(note){
    const notes = getNotes()
    notes.push(note)
    localStorage.setItem('noteApp.notes', JSON.stringify(notes))
}
//UI Updates

function removeNote(id){
    const notes = getNotes()
    notes.forEach((note, index)=> {
       if(note.id === id){
           notes.splice(index, 1)
       }
    })

    localStorage.setItem('noteApp.notes', JSON.stringify(notes))
}

// show notes on ui

function displayNote(){
    const notes = getNotes()
    notes.forEach(note => {
        addNoteToList(note)
    })
}
// fucntion show aler message 
function showAlertMessage(message, alertClass){
    const alertDiv = document.createElement('div')
    alertDiv.className = `message ${alertClass}`
    alertDiv.appendChild(document.createTextNode(message))
    form.insertAdjacentElement('beforebegin', alertDiv)
    titleInput.focus()
    setTimeout(()=> alertDiv.remove(), 2000)
}

// function: Create new note in UI
function addNoteToList(note){
    const newUINote = document.createElement('div')
    newUINote.classList.add('note')
    newUINote.innerHTML = `
     <span hidden>${note.id}</span>
        <h2 class="note__title">${note.title}</h2>
        <p class="note__body">${note.body}</p>
        <div class="note__btns">
            <button class="note__btn note__view">View Detail</button>
            <button class="note__btn note__delete">Delete Note</button>
        </div>
    
    `
    noteContainer.appendChild(newUINote)
}

// function: view note in modal

function activeNoteModal(title, body){
    const modalTitle = document.querySelector('.modal__title')
    const modalBody = document.querySelector('.modal__body')
    modalTitle.textContent = title
    modalBody.textContent = body
    modalContainer.classList.add('active')
}


// event : note Buttons 
noteContainer.addEventListener('click', (e) => {
    if(e.target.classList.contains('note__view')){
        const currentNote = e.target.closest('.note')
        
        const currentTitle = currentNote.querySelector('.note__title').textContent
        const currentBody = currentNote.querySelector('.note__body').textContent
        activeNoteModal(currentTitle, currentBody)
        
    }

    if(e.target.classList.contains('note__delete')){
        const currentNote = e.target.closest('.note')
        showAlertMessage('Your note was permantely deleted', 'remove-message')
        currentNote.remove()
        const id = currentNote.querySelector('span').textContent
        removeNote(Number(id))
    }
})

// Event: Note form Submit

form.addEventListener('submit', (e)=> {
    e.preventDefault()
    const noteInput = document.querySelector('#note')

    // validate inputs
    if(titleInput.value.length > 0  && noteInput.value.length > 0){
        const newNote = new Note(titleInput.value, noteInput.value)
            addNoteToList(newNote)
            addNoteToLocalStorage(newNote)
        titleInput.value = ''
        noteInput.value = ''
        showAlertMessage('Note successfully added', 'success-message')
        titleInput.focus()

    }else{
        showAlertMessage('PLease add both a title and a  note', 'alert-message')
    }
} )


// Event: clos Modal
const modalBtn = document.querySelector('.modal__btn').addEventListener('click', () => {
    modalContainer.classList.remove('active')
})


// displayu iotem when reloaded
document.addEventListener('DOMContentLoaded',displayNote)