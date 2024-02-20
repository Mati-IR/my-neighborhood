function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("show");
}
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
async function loadFromLocalStorage(){
    var response = await makeRequest();
    const pagePath = window.location.pathname;
    if(response != null){
        const user = localStorage.getItem('user');
        const isAdmin = localStorage.getItem('admin');
        if(user==null){
            location.reload();
            window.location.href = 'login.html';
        }
        else{
            //var username = document.getElementById("username");
            if(pagePath == "/index.html"||pagePath=="/"){
                var message = "Witaj "+user;
                headerTextChange(message);
                generateSidebar(isAdmin);
                if(isAdmin!='true')
                    spaceInfoDisplay();
                else
                    countElementsWithStateOne();
            }
            else if(pagePath!="/index.html"){
                navigateToHomePage();
            }
            //username.textContent = user;
        }
    }
    else{
        if(pagePath!="/noconnection.html"){
            location.reload();
            window.location.href = 'noconnection.html';
        }
            
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
async function makeRequest() {
    const headers = {
        'accept': 'application/json'
    };

    try {
        const response = await fetch(apiBaseUrl+'/', {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Wystąpił błąd podczas wykonania żądania:', error);
    }
}
function documentation() {
    window.location.href = 'http://localhost:8000/docs#/';
}
loadFromLocalStorage();

