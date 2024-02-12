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
    else{
        var username = document.getElementById("username");
        var message = "Witaj "+user;
        headerTextChange(message);
        username.textContent = user;
    }
}

function printApiResponse(elementId, message, messageLevel) {
    var apiInfoResponse = document.getElementById(elementId);
    apiInfoResponse.classList.add("apiInfoResponse");
    var classList = apiInfoResponse.classList;

    for (var i = 0; i < messageLevelClassArray.length; i++) {
        if (classList.contains(messageLevelClassArray[i])) {
            classList.remove(messageLevelClassArray[i]);
        }
    }

    classList.add(messageLevel);
    apiInfoResponse.textContent = message;

    var sound = new Audio('../resources/mp3/' + messageLevel + '.mp3');
    sound.play();
    window.scrollTo({ top: 0, behavior: 'auto' });
}

function hideApiResponse(elementId){
    var apiInfoResponse = document.getElementById(elementId);
    if(apiInfoResponse!=null){
        apiInfoResponse.classList.add("d-none");
    }
}
function clearDivContent(element_id) {
    var contentContainer = document.getElementById(element_id);
    contentContainer.innerHTML = '';
}
function headerTextChange(message){
    var Header = document.getElementById("MenuHeader");
    Header.textContent = message;
}
function navigateToHomePage() {
    window.location.href = homepageUrl;
}
loadFromLocalStorage();
