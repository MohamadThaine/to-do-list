import { initializeApp } from "https://www.gstatic.com/firebasejs/9.11.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  setDoc,
  query,
  orderBy,
  limit,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.11.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDddyG3XnPPaKDXr1xtO66llOs2DSVUyD4",
  authDomain: "to-do-list-c4037.firebaseapp.com",
  projectId: "to-do-list-c4037",
  storageBucket: "to-do-list-c4037.appspot.com",
  messagingSenderId: "512583339372",
  appId: "1:512583339372:web:95ceda490ccbd0cd993749",
  measurementId: "G-MW003GRGZD",
};
let lastID = 0;
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
var session = document.cookie;
var toDoListTitle = document.getElementById('title')
var tasksInputBox = document.getElementById("taskBox");
var Complatedtask = document.getElementById("complatedTasks");
var selectAllCheckBox = document.getElementById("selectAllCheckBox");
var addTaskBT = document.getElementById('addTaskBT')
var editingTask;
let isMenuOn = false;
let selectedTasks = 0;
var deleteBT;
window.onload = prepareDeleteBT();

addTaskBT.click = addTask

toDoListTitle.addEventListener('focusout' , () => {
  if(toDoListTitle.textContent != ''){
    updateTitleInDB(toDoListTitle.textContent , session)
  }
  else{
    alert('title can not be empty')
    getTitleFromDB(session)
  }
})

async function getTitleFromDB(userID){
  const q = query(collection(db, "titles"), where("UserID", "==", userID));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    toDoListTitle.textContent = doc.data().Title
  });
}

getTitleFromDB(session)

async function updateTitleInDB(title , userID){
  var docID
  const q = query(collection(db, "titles"), where("UserID", "==", userID));
  const querySnapshot = await getDocs(q);
  if(querySnapshot.size == 0)
  {
    const docRef = await addDoc(collection(db, "titles"), {
      Title: title,
      UserID: userID,
    })
    console.log("Document written with ID: ", docRef.id);
  }
  else{
    querySnapshot.forEach((doc) => {
      docID = doc.id;
    });
    const taskRef = doc(db, "titles", docID);
    await updateDoc(taskRef, {
      Title: title,
    });
  }
  toDoListTitle.textContent = title
}

function prepareDeleteBT() {
  deleteBT = document.createElement("button");
  deleteBT.classList.add("deleteTaskBT");
  deleteBT.innerHTML = "Delete Complated Tasks";
  deleteBT.onclick = deleteAllComplatedTasks;
  getTasks(session);
}

export async function getTasks(userID) {
  const q = query(collection(db, "tasks"), where("userID", "==", userID));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    createTask(
      doc.data().task,
      doc.data().id,
      doc.data().prioroty,
      doc.data().completed
    );
  });
  getLastIDAdded();
}

async function getLastIDAdded() {
  const taskRef = collection(db, "tasks");
  const q = query(taskRef, orderBy("id", "desc"), limit(1));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    lastID = doc.data().id;
  });
}

selectAllCheckBox.addEventListener("click", () => {
  checkAllTasks(selectAllCheckBox);
});

function addTask() {
  if (tasksInputBox.value == "") {
    return;
  }
  getLastIDAdded();
  createTask(tasksInputBox.value, lastID + 1, "p0", false);
  addTasktoDB(lastID + 1, tasksInputBox.value, "p0", session);
  tasksInputBox.value = "";
}

function createTask(taskName, id, prioroty, complated) {
  selectAllCheckBox.style.display = "block";
  var task = document.createElement("div");
  task.id = id;
  task.setAttribute("name", id + prioroty);
  task.classList.add("dragable");
  task.classList.add("task");
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.addEventListener("click", () => {
    if (task.classList.contains("selectedTask")) {
      let taskPritorayId = task.getAttribute("name").slice(-2);
      task.classList.remove("selectedTask");
      checkbox.classList.remove("checked");
      document.getElementById(taskPritorayId).appendChild(task);
      selectedTasks = selectedTasks - 1;
      updateTaskProgInDB(id, false);
      deleteDeleteTaskBt();
    } else {
      task.classList.add("selectedTask");
      checkbox.classList.add("checked");
      Complatedtask.appendChild(task);
      createDeleteTaskBT();
      updateTaskProgInDB(id, true);
      selectedTasks = selectedTasks + 1;
    }
  });
  task.appendChild(checkbox);
  var dragBT = document.createElement("button");
  dragBT.setAttribute("name", id + "drag");
  dragBT.innerHTML = "";
  dragBT.addEventListener("mousedown", () => {
    dragTask(dragBT);
  });
  dragBT.classList.add("hidden");
  dragBT.classList.add("dragBT");
  task.appendChild(dragBT);
  var taskNameP = document.createElement("p");
  taskNameP.classList.add("taskName");
  taskNameP.innerHTML = taskName;
  task.appendChild(taskNameP);
  var editBT = document.createElement("button");
  editBT.setAttribute("name", id + "edit");
  editBT.classList.add("toRight");
  editBT.onclick = function () {
    editName(editBT);
  };
  editBT.classList.add("hidden");
  task.appendChild(editBT);
  var menuBT = document.createElement("button");
  menuBT.setAttribute("name", id + "menu");
  menuBT.onclick = function () {
    showMenu(menuBT);
  };
  menuBT.classList.add("hidden");
  menuBT.classList.add("menuStyle");
  task.appendChild(menuBT);
  var menuContener = document.createElement("div");
  menuContener.classList.add("menu");
  createMenu(menuContener, id);
  task.appendChild(menuContener);
  if (complated) {
    var tasksBody = Complatedtask;
    checkbox.click();
  } else {
    var tasksBody = document.getElementById(prioroty);
  }
  tasksBody.appendChild(task);
}

function createMenu(Contener, id) {
  var p = document.createElement("p");
  p.innerHTML = "Priority:";
  Contener.appendChild(p);
  for (let i = 1; i < 4; i++) {
    createMenuButtons(i, Contener, id);
  }
  createMenuButtons(0, Contener, id);
  var deleteBT = document.createElement("button");
  deleteBT.innerHTML = "Delete";
  deleteBT.classList.add("deleteATaskBT");
  deleteBT.onclick = function () {
    deleteTask(deleteBT);
  };
  Contener.appendChild(deleteBT);
}

function createMenuButtons(i, Contener, id) {
  var pBT = document.createElement("button");
  pBT.classList.add("p" + i + "BT");
  pBT.setAttribute("name", id + "p" + i + "BT");
  pBT.innerHTML = i;
  pBT.onclick = function () {
    changePiratory(pBT);
  };
  Contener.appendChild(pBT);
}

async function addTasktoDB(taskID, taskName, P, userId) {
  try {
    const docRef = await addDoc(collection(db, "tasks"), {
      id: taskID,
      prioroty: P,
      task: taskName,
      completed: false,
      userID: userId,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

async function updateTaskProgInDB(taskID, complated) {
  var docID;
  const q = query(collection(db, "tasks"), where("id", "==", parseInt(taskID)));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    docID = doc.id;
  });
  const taskRef = doc(db, "tasks", docID);
  await updateDoc(taskRef, {
    completed: complated,
  });
}

function changePiratory(e) {
  if (e.parentNode.parentNode.parentNode.id == "complatedTasks") {
    return;
  }
  var newPritoryID = e.name.substring(
    e.name.indexOf("p"),
    e.name.indexOf("p") + 2
  );
  var taskID = e.parentNode.parentNode.id;
  var newPritory = document.getElementById(newPritoryID);
  var task = document.getElementById(taskID);
  changePiratoryBTstyle(e, task);
  task.setAttribute("name", taskID + newPritoryID);
  newPritory.appendChild(task);
  var taskMenu = task.children[5];
  if (isMenuOn) {
    taskMenu.classList.remove("showMenu");
    isMenuOn = false;
  }
  changePiratoryInDB(taskID, newPritoryID);
}

async function changePiratoryInDB(taskID, newPritoryID) {
  var docID;
  const q = query(collection(db, "tasks"), where("id", "==", parseInt(taskID)));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    docID = doc.id;
    console.log(doc.id);
  });
  const taskRef = doc(db, "tasks", docID);
  await updateDoc(taskRef, {
    prioroty: newPritoryID,
  });
}

function changePiratoryBTstyle(newBT, task) {
  var oldPriraty = task.parentNode.id;
  console.log(oldPriraty);
  var oldBTName = task.children[5].querySelectorAll("." + oldPriraty + "BT");
  oldBTName[0].classList.remove("active");
  newBT.classList.add("active");
}

function deleteTask(e) {
  var parentDiv = e.parentNode;
  var task = parentDiv.parentNode;
  task.parentNode.removeChild(task);
  var allTasks = document.querySelectorAll(".task");
  if (allTasks.length == 0) {
    selectAllCheckBox.style.display = "none";
  }
  deleteTaskInDB(task);
}

async function deleteTaskInDB(task) {
  var docID;
  const q = query(
    collection(db, "tasks"),
    where("id", "==", parseInt(task.id))
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    docID = doc.id;
  });
  await deleteDoc(doc(db, "tasks", docID));
  getLastIDAdded();
}

document.getElementById("taskBox").addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    addTask();
  }
});

function editName(e) {
  let bt = e.getAttribute("name");
  e.classList.add("save");
  var taskId = bt.substring(0, bt.indexOf("edit"));
  editingTask = document.getElementById(taskId);
  var taskName = editingTask.children[2];
  if (taskName.contentEditable == "true") {
    saveNewName(taskName, e, true, taskId);
    return;
  }
  taskName.contentEditable = "true";
  selectText(taskName);
  taskName.addEventListener("keyup", function () {
    saveNewName(taskName, e, false, taskId);
  });
  taskName.addEventListener("focusout", () => {
    setTimeout(() => {
      saveNewName(taskName, e, true, taskId);
    }, 100);
  });
}

function saveNewName(taskName, bt, buttonclicked, taskId) {
  if (buttonclicked || (event.keyCode === 13 && taskName.textContent != "")) {
    taskName.contentEditable = "false";
    taskName.textContent = taskName.textContent.replace("\n", "");
    bt.classList.remove("save");
    saveNewNameInDB(taskName.textContent, taskId);
  } else {
    return;
  }
  taskName.removeEventListener("keyup", function () {
    saveNewName;
  });
  taskName.removeEventListener("focusout", function () {
    saveNewName;
  });
}

async function saveNewNameInDB(newName, taskId) {
  var docID;
  const q = query(collection(db, "tasks"), where("id", "==", parseInt(taskId)));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    docID = doc.id;
  });
  const taskRef = doc(db, "tasks", docID);
  await updateDoc(taskRef, {
    task: newName,
  });
}

function showMenu(e) {
  let bt = e.getAttribute("name");
  var taskId = bt.substring(0, bt.indexOf("menu"));
  editingTask = document.getElementById(taskId);
  var taskMenu = editingTask.children[5];
  if (!isMenuOn) {
    taskMenu.classList.add("showMenu");
    isMenuOn = true;
    document.addEventListener('mousedown' , function handler() {
      setTimeout(() => {
        if(isMenuOn)
        {
          taskMenu.classList.remove("showMenu");
          isMenuOn = false;
        }
      }, 120);
    } , {once: true})
  } else {
    taskMenu.classList.remove("showMenu");
    isMenuOn = false;
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

function createDeleteTaskBT() {
  if (selectedTasks != 0) {
    return;
  }
  var contener = document.getElementById("firstTwoElements");
  contener.appendChild(deleteBT);
}

function deleteDeleteTaskBt() {
  if (selectedTasks != 0) {
    return;
  }
  var contener = document.getElementById("firstTwoElements");
  contener.removeChild(deleteBT);
}

function deleteAllComplatedTasks() {
  var selectedTasksOb = document.querySelectorAll(".selectedTask");
  selectedTasksOb.forEach((task) => {
    task.remove();
    deleteTaskInDB(task);
  });
  selectedTasks = 0;
  selectAllCheckBox.click();
  selectAllCheckBox.style.display = "none";
  deleteDeleteTaskBt();
}

function dragTask(e) {
  var taskDiv = e.parentNode.parentNode;
  var task = e.parentNode;
  task.draggable = true;
  getDragableElementsInContener(taskDiv);
  taskDiv.addEventListener(
    "dragover",
    (handler) => {
      handler.preventDefault();
      const afterelemnt = dragel(taskDiv, handler.clientY);
      if (afterelemnt == null) {
        taskDiv.appendChild(task);
        task.draggable = false;
      } else {
        taskDiv.insertBefore(task, afterelemnt);
        task.draggable = false;
      }
    },
    true
  );
}
function dragel(taskDiv, y) {
  var dragableel = [...taskDiv.querySelectorAll(".dragable:not(dragged)")];
  return dragableel.reduce(
    (closest, child) => {
      var element = child.getBoundingClientRect();
      var offset = y - element.top - element.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function getDragableElementsInContener(Contener) {
  const dragables = Contener.querySelectorAll(".dragable");
  dragables.forEach((dragable) => {
    dragable.addEventListener("dragstart", () => {
      dragable.classList.add("dragged");
    });
    dragable.addEventListener("dragend", () => {
      dragable.classList.remove("dragged");
      Contener.dragover = null;
    });
  });
}
let checking = false;
function checkAllTasks() {
  checking = !checking;
  var allTasks = document.querySelectorAll(".task");
  allTasks.forEach((task) => {
    if (checking) {
      if (!task.classList.contains("selectedTask")) {
        task.children[0].click();
      }
    } else {
      if (task.classList.contains("selectedTask")) {
        task.children[0].click();
      }
    }
  });
}