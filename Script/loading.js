var loading = document.getElementById('loading')
var session = document.cookie;
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
    addLoading()
}



