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
    apiInfoResponse.classList.add(messageLevel);
    apiInfoResponse.textContent = message;
}
  loadFromLocalStorage();
