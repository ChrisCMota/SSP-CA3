const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sName = document.querySelector('#m-name')
const sDescription = document.querySelector('#m-description')
const btnSave = document.querySelector('#btnSave')

let itens
let id

const backendUrl = "http://localhost:3000/courses/"

function getAll() {
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", backendUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function getById(id) {
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", backendUrl + id, false ); // false for synchronous request
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function add(name, description) {
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", backendUrl, false ); // false for synchronous request
    xmlHttp.send( { name, description } );
    return JSON.parse(xmlHttp.responseText);
}



function deleteById(id) {
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "DELETE", backendUrl + id, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}


function loadItens() {
    courses = getAll();
    tbody.innerHTML = ''
    
    for (course of courses) {
        insertItem(course );
    }
} 

loadItens();

function insertItem(item) {

    let tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${item.id}</td>
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td class="acao">
        <button onclick="editItem(${item.id})"><i class='bx bx-edit' ></i></button>
        </td>
        <td class="acao">
        <button onclick="deleteItem(${item.id})"><i class='bx bx-trash'></i></button>
        </td>
    `;
    tbody.appendChild(tr);
}

function deleteItem(index) {
    deleteById(index);
    loadItens();
}