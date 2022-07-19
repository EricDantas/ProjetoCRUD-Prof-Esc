'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}


const getLocalStorage = () => JSON.parse(localStorage.getItem('db_escola')) ?? []
const setLocalStorage = (dbEscola) => localStorage.setItem("db_escola", JSON.stringify(dbEscola))

// CRUD - create read update delete
const deleteEscola = (index) => {
    const dbEscola = readEscola()
    dbEscola.splice(index, 1)
    setLocalStorage(dbEscola)
}

const updateEscola = (index, escola) => {
    const dbEscola = readEscola()
    dbEscola[index] = escola
    setLocalStorage(dbEscola)
}

const readEscola = () => getLocalStorage()

const createEscola = (escola) => {
    const dbEscola = getLocalStorage()
    dbEscola.push (escola)
    setLocalStorage(dbEscola)
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

const saveEscola = () => {
    debugger
    if (isValidFields()) {
        const escola = {
            nome: document.getElementById('nome').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            endereco: document.getElementById('endereco').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createEscola(escola)
            updateTable()
            closeModal()
        } else {
            updateEscola(index, escola)
            updateTable()
            closeModal()
        }
    }
}

const createRow = (escola, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${escola.nome}</td>
        <td>${escola.telefone}</td>
        <td>${escola.email}</td>
        <td>${escola.endereco}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}" >Excluir</button>
        </td>
    `
    document.querySelector('#tableEscola>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableEscola>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbEscola = readEscola()
    clearTable()
    dbEscola.forEach(createRow)
}

const fillFields = (escola) => {
    document.getElementById('nome').value = escola.nome
    document.getElementById('telefone').value = escola.telefone
    document.getElementById('email').value = escola.email
    document.getElementById('endereco').value = escola.endereco
    document.getElementById('nome').dataset.index = escola.index
}

const editEscola = (index) => {
    const escola = readEscola()[index]
    escola.index = index
    fillFields(escola)
    openModal()
}

const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editEscola(index)
        } else {
            const escola = readEscola()[index]
            const response = confirm(`Deseja realmente excluir a escola ${escola.nome}`)
            if (response) {
                deleteEscola(index)
                updateTable()
            }
        }
    }
}

updateTable()

// Eventos
document.getElementById('cadastrarEscola')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveEscola)

document.querySelector('#tableEscola>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)