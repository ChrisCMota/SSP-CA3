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
    xmlHttp.open( "GET", backendUrl, false );
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function getById(id) {
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", backendUrl + id, false );
    xmlHttp.send( null );
    return JSON.parse(xmlHttp.responseText);
}

function add(name, description) {
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "POST", backendUrl, false );
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(JSON.stringify({ name: name, description: description }));
    return JSON.parse(xmlHttp.responseText);
}



function deleteById(id) {
    
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "DELETE", backendUrl + id, false );
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

function updateById(name, description) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "PUT", backendUrl + id, false );
    xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlHttp.send(JSON.stringify({ name: name, description: description }));
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

function editItem(index) {

    openModal(true, index)
}

function openModal(edit = false, index = 0) {
    modal.classList.add('active')
  
    modal.onclick = e => {
      if (e.target.className.indexOf('modal-container') !== -1) {
        modal.classList.remove('active')
      }
    }
  
    if (edit) {
      course = getById(index);
      sName.value = course.name
      sDescription.value = course.description
      id = index
    } else {
      sName.value = ''
      sDescription.value = ''
    }
    
}

btnSave.onclick = e => {
  
    if (sName.value == '' || sDescription.value == '') {
      return;
    }
  
    e.preventDefault();
  
    if (id !== undefined) {
        console.log(sName.value);
        console.log(sDescription.value);
        updateById(sName.value, sDescription.value);
    } else {
      add( sName.value, sDescription.value);
    }

    modal.classList.remove('active');
    loadItens();
    id = undefined;
  }