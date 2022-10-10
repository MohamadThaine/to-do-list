import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import { getFirestore, collection, getDocs , addDoc , setDoc   } from 'https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js';
const firebaseConfig = {
  apiKey: "AIzaSyDddyG3XnPPaKDXr1xtO66llOs2DSVUyD4",
  authDomain: "to-do-list-c4037.firebaseapp.com",
  projectId: "to-do-list-c4037",
  storageBucket: "to-do-list-c4037.appspot.com",
  messagingSenderId: "512583339372",
  appId: "1:512583339372:web:95ceda490ccbd0cd993749",
  measurementId: "G-MW003GRGZD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log(db)

var tasksBody = document.getElementById('p0')
var tasksInputBox = document.getElementById('taskBox')
var Complatedtask = document.getElementById('complatedTasks')
var selectAllCheckBox = document.getElementById('selectAllCheckBox')
let editFirstClicked = false
var editingTask
let id = 0;
let isEditing = false
let isMenuOn = false
var prevMenu
let selectedTasks = 0
var deleteBT
window.onload = prepareDeleteBT()

function prepareDeleteBT(){
    deleteBT = document.createElement('button')
    deleteBT.classList.add('deleteTaskBT')
    deleteBT.innerHTML = "Delete Complated Tasks"
    deleteBT.onclick = deleteAllComplatedTasks
}

selectAllCheckBox.addEventListener('click' , () => {
    checkAllTasks(selectAllCheckBox)
})


function addTask(){
    if(tasksInputBox.value == ""){
        return
    }
    createTask(tasksInputBox.value)
    tasksInputBox.value = ""
}

function createTask(taskName){
    selectAllCheckBox.style.display = "block"
    var task = document.createElement('div')
    task.id = id
    task.setAttribute('name' , id + 'p0')
    task.classList.add('dragable')
    task.classList.add('task')
    var checkbox = document.createElement('input')
    checkbox.type = "checkbox";
    checkbox.addEventListener('click' , () => {
        if(task.classList.contains('selectedTask')){
            let taskPritorayId = task.getAttribute('name').slice(-2)
            task.classList.remove('selectedTask')
            checkbox.classList.remove('checked')
            document.getElementById(taskPritorayId).appendChild(task)
            selectedTasks = selectedTasks - 1
            deleteDeleteTaskBt()
        }
        else{
            task.classList.add('selectedTask')
            checkbox.classList.add('checked')
            console.log(Complatedtask)
            Complatedtask.appendChild(task)
            createDeleteTaskBT()
            selectedTasks = selectedTasks + 1
        }
    })
    task.appendChild(checkbox)
    var dragBT = document.createElement('button')
    dragBT.setAttribute("name" , id + "drag")
    dragBT.innerHTML = "drag"
    dragBT.addEventListener('mousedown' , () => {
        dragTask(dragBT)
    })
    dragBT.classList.add('hidden')
    dragBT.classList.add('dragBT')
    task.appendChild(dragBT)
    var taskNameP = document.createElement('p')
    taskNameP.classList.add('taskName')
    taskNameP.innerHTML = taskName
    task.appendChild(taskNameP)
    var editBT = document.createElement('button')
    editBT.setAttribute("name" , id + "edit")
    editBT.classList.add('toRight')
    editBT.onclick = function() { editName(editBT) }
    editBT.classList.add('hidden')
    task.appendChild(editBT)
    var menuBT = document.createElement('button')
    menuBT.setAttribute("name" , id + "menu")
    menuBT.onclick = function() { showMenu(menuBT) }
    menuBT.classList.add('hidden')
    menuBT.classList.add('menuStyle')
    task.appendChild(menuBT)
    var menuContener = document.createElement('div')
    menuContener.classList.add('menu')
    createMenu(menuContener)
    task.appendChild(menuContener)
    tasksBody.appendChild(task)
    id++
    addTasktoDB(id , taskNameP.innerHTML , 'p0')
}

function createMenu(Contener){
    var p = document.createElement('p')
    p.innerHTML = "Priority:"
    Contener.appendChild(p)
    for(let i = 1 ; i < 4 ; i++){
        createMenuButtons(i , Contener)
    }
    createMenuButtons(0 , Contener)
    var deleteBT = document.createElement('button')
    deleteBT.innerHTML = 'Delete'
    deleteBT.classList.add('deleteATaskBT')
    deleteBT.onclick = function() { deleteTask(deleteBT) }
    Contener.appendChild(deleteBT)
}

async function addTasktoDB(taskID , taskName , P){
    try {
        const docRef = await addDoc(collection(db, "tasks"), {
          id: taskID, 
          prioroty: P,
          task: taskName
        });
        console.log("Document written with ID: ", docRef.id);
      } catch (error) {
        console.error("Error adding document: ", error);
      }
}

function createMenuButtons(i , Contener){
    var pBT = document.createElement('button')
    pBT.classList.add("p" + i + "BT")
    pBT.setAttribute("name" , id + "p" + i + "BT")
    pBT.innerHTML = i
    pBT.onclick = function() { changePiratory(pBT) }
    Contener.appendChild(pBT)
}

function changePiratory(e){
    console.log(e.parentNode.parentNode.parentNode)
    if(e.parentNode.parentNode.parentNode.id == 'complatedTasks'){
        return
    }
   var newPritoryID = e.name.substring(e.name.indexOf('p') , 3)
   var taskID = e.name.substring(0 , 1)
   var newPritory = document.getElementById(newPritoryID)
   var task = document.getElementById(taskID)
   task.setAttribute('name' , id + newPritoryID)
   console.log(task.getAttribute('name'))
   newPritory.appendChild(task)
   var taskMenu = task.children[5]
   if(isMenuOn){
        taskMenu.classList.remove('showMenu')
        isMenuOn = false
    }
    e.classList.add('active')
}

function deleteTask(e){
    var parentDiv = e.parentNode;
    var task = parentDiv.parentNode;
    task.parentNode.removeChild(task)
    var allTasks = document.querySelectorAll('.task')
    if(allTasks.length == 0){
        selectAllCheckBox.style.display = 'none'
    }
}

document.getElementById("taskBox")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        addTask()
    }
});

function editName(e){
    let bt = e.getAttribute("name")
    e.classList.add('save')
    var taskId = bt.substring(0,bt.indexOf('edit'))
    editingTask = document.getElementById(taskId)
    var taskName = editingTask.children[2]
    console.log(taskName.contentEditable)
    if(taskName.contentEditable == "true"){
        saveNewName(taskName ,e , true)
        return
    }
    console.log(e)
    taskName.contentEditable  = "true"
    selectText(taskName)
    taskName.addEventListener("keyup", function() { saveNewName(taskName , e) })
    taskName.addEventListener('focusout', () => { 
        setTimeout(() => {saveNewName(taskName , e , true)} , 100)
        })
}

function saveNewName(taskName ,bt , buttonclicked){
    if (buttonclicked || event.keyCode === 13) {
        if(taskName.textContent)
        {
            alert('name can not be empty')
            return
        }
        taskName.contentEditable  = "false"
        taskName.textContent = taskName.textContent.replace('\n' , "")
        bt.classList.remove('save')}
    taskName.removeEventListener("keyup", function() { saveNewName }) 
    taskName.removeEventListener('focusout', function() { saveNewName })
    console.log(bt)
}

function showMenu(e){
    let bt = e.getAttribute("name")
    var taskId = bt.substring(0,bt.indexOf('menu'))
    editingTask = document.getElementById(taskId)
    var taskMenu = editingTask.children[5]
    if(!isMenuOn){
        taskMenu.classList.add('showMenu')
        isMenuOn = true
    }
    else{
        taskMenu.classList.remove('showMenu')
        isMenuOn = false
    }
}

function selectText(node) {
    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    }
}

function createDeleteTaskBT(){
    if(selectedTasks != 0){
        console.log(selectedTasks)
        return
    }
    var contener = document.getElementById('firstTwoElements')
    contener.appendChild(deleteBT)
}

function deleteDeleteTaskBt(){
    if(selectedTasks != 0){
        console.log(selectedTasks)
        return
    }
    var contener = document.getElementById('firstTwoElements')
    contener.removeChild(deleteBT)
}

function deleteAllComplatedTasks(){
    var selectedTasksOb = document.querySelectorAll('.selectedTask');
    selectedTasksOb.forEach(task => {
        task.remove();
      });
    selectedTasks = 0
    selectAllCheckBox.click()
    selectAllCheckBox.style.display = 'none'
    deleteDeleteTaskBt()
}

function dragTask(e){
    var taskDiv = e.parentNode.parentNode
    var task = e.parentNode
    task.draggable = true
    getDragableElementsInContener(taskDiv)
    taskDiv.addEventListener('dragover' , handler =>{
        handler.preventDefault()
        const afterelemnt = dragel(taskDiv , handler.clientY)
        if(afterelemnt == null)
        {
            taskDiv.appendChild(task)
            task.draggable = false
        } 
        else{
            taskDiv.insertBefore(task , afterelemnt)
            task.draggable = false
        }
    }, true)
}
function dragel(taskDiv , y){
    var dragableel = [...taskDiv.querySelectorAll('.dragable:not(dragged)')]
    return dragableel.reduce((closest, child) => {
        var element = child.getBoundingClientRect()
        var offset = y - element.top - element.height / 2
        if(offset < 0 && offset > closest.offset){
            return {offset: offset , element : child}
        }
        else{
            return closest
        }
    } , {offset: Number.NEGATIVE_INFINITY}).element
}

function getDragableElementsInContener(Contener){
    const dragables = Contener.querySelectorAll('.dragable');
    dragables.forEach(dragable => {
    dragable.addEventListener('dragstart' , () => {
        dragable.classList.add('dragged')
    })
    dragable.addEventListener('dragend' , () => {
        dragable.classList.remove('dragged')
        Contener.dragover = null
        })
    })
}

function checkAllTasks(){
    var allTasks = document.querySelectorAll('.task')
    allTasks.forEach(task => {
        task.children[0].click();
    })
}
