import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.0/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider  } from "https://www.gstatic.com/firebasejs/9.12.0/firebase-auth.js";
import {getTasks} from "../indexScript.js"
const firebaseConfig = {
  apiKey: "AIzaSyDddyG3XnPPaKDXr1xtO66llOs2DSVUyD4",
  authDomain: "to-do-list-c4037.firebaseapp.com",
  databaseURL: "https://to-do-list-c4037-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "to-do-list-c4037",
  storageBucket: "to-do-list-c4037.appspot.com",
  messagingSenderId: "512583339372",
  appId: "1:512583339372:web:95ceda490ccbd0cd993749",
  measurementId: "G-MW003GRGZD"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

var loading = document.getElementById('loading')
var session = document.cookie
var loginCon = document.getElementById('login')
var tasksCon = document.getElementById('tasksElements')
var loginBT = document.getElementById('loginBT')
setTimeout(function () {
    removeLoading()
  }, 1000)
function removeLoading(){
    loading.remove()
    preparerPage()
}

function addLoading(){
    document.getElementById('bodyWrapper').style.display = 'none'
    document.body.appendChild(loading)
    setTimeout(function () {
        removeLoading()
      }, 1000)
}

function preparerPage(){
    
    let isLogedIn = checkSession()
    document.getElementById('bodyWrapper').style.display = 'block'
    if(isLogedIn){
        loginCon.style.display = 'none'
        tasksCon.style.display = 'block'
        document.getElementById('bodyWrapper').removeChild(loginCon)
    }
    else{
        loginBT.onclick = login
    }
}

function checkSession(){
    if(session == ''){
        return false
    }
    else{
        return true
    }
}

function login(){
    const auth = getAuth(app);
    signInWithPopup(auth, provider)
    .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    document.cookie = user.uid
    session = document.cookie;
    addLoading()
    getTasks(session)
    }).catch((error) => {
    console.log(error)
  });
}