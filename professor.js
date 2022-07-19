'use strict'

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_professor')) ?? []
const setLocalStorage = (dbProfessor) => localStorage.setItem("db_professor", JSON.stringify(dbProfessor))

const openModal = () => {
    document.getElementById('modal').classList.add('active')
    document.getElementById('valueComboBoxEscola')
}
const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}



// CRUD - create read update delete
const deleteProfessor = (index) => {
    const dbProfessor = readProfessor()
    dbProfessor.splice(index, 1)
    setLocalStorage(dbProfessor)
}

const updateProfessor = (index, professor) => {
    const dbProfessor = readProfessor()
    dbProfessor[index] = professor
    setLocalStorage(dbProfessor)
}

const readProfessor = () => getLocalStorage()

const createProfessor = (professor) => {
    const dbProfessor = getLocalStorage()
    dbProfessor.push (professor)
    setLocalStorage(dbProfessor)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o layout

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
    document.getElementById('nome').dataset.index = 'new'
}

const saveProfessor = () => {
    debugger
    if (isValidFields()) {
        const professor = {
            matricula: document.getElementById('matricula').value,
            nome: document.getElementById('nome').value,
            titulacao: document.getElementById('titulacao').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            escola: document.getElementById('escola').value,
            endereco: document.getElementById('endereco').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createProfessor(professor)
            updateTable()
            closeModal()
        } else {
            updateProfessor(index, professor)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (professor, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${professor.matricula}</td>
        <td>${professor.nome}</td>
        <td>${professor.titulacao}</td>
        <td>${professor.telefone}</td>
        <td>${professor.email}</td>
        <td>${professor.escola}</td>
        <td>${professor.endereco}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableProfessor>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableProfessor>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbProfessor = readProfessor()
    clearTable()
    dbProfessor.forEach(createRow)
}

const fillFields = (professor) => {
    document.getElementById('matricula').value = professor.matricula
    document.getElementById('nome').value = professor.nome
    document.getElementById('titulacao').value = professor.titulacao
    document.getElementById('telefone').value = professor.telefone
    document.getElementById('email').value = professor.email
    document.getElementById('escola').value = professor.escola
    document.getElementById('endereco').value = professor.endereco
    document.getElementById('nome').dataset.index = professor.index
}

const editProfessor = (index) => {
    const professor = readProfessor()[index]
    professor.index = index
    fillFields(professor)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editProfessor(index)
            console.log(index)
        } else {
            const professor = readProfessor()[index]
            const response = confirm(`Deseja realmente excluir a professor ${professor.nome}`)
            if (response) {
                deleteProfessor(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarProfessor')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveProfessor)

document.querySelector('#tableProfessor>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)

//Teste

const availableEscola = () => JSON.parse(localStorage.getItem('db_escola')) ?? []
const resul = JSON.stringify(availableEscola())
const escolaTeste = {
    nome: document.getElementById('nome').value
}

function testeEscola() {
    var escResul = [],
    keys = Object.keys(localStorage),
        i = keys.length;

    while ( i-- ) {
        escResul.push( localStorage.getItem(keys[i]) );
    }

    return escResul;
}

console.log(escola.nome)