function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("show");
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
  
function loadFromLocalStorage(){
    const user = localStorage.getItem('user');
    const isAdmin = localStorage.getItem('admin');
    if(user==null){
        window.location.href = 'login.html';
    }
    var username = document.getElementById("username");
    username.textContent = user;
}

function printApiResponse(elementId,message,messageLevel){
    
    var apiInfoResponse = document.getElementById(elementId);
    apiInfoResponse.classList.add("apiInfoResponse");
    var classList = apiInfoResponse.classList;

    for (var i = 0; i < messageLevelClassArray.length; i++) {
        if (classList.contains(messageLevelClassArray[i])) {
            classList.remove(messageLevelClassArray[i]);
        }
    }
    classList.add(messageLevel);
    console.log(apiInfoResponse.classList);
    apiInfoResponse.textContent = message;
}
function hideApiResponse(elementId){
    var apiInfoResponse = document.getElementById(elementId);
    apiInfoResponse.classList.add("d-none");
}
loadFromLocalStorage();
