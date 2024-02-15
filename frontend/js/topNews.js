function generateAnnouncementView(data, page) {
    const container = document.getElementById("announcement-container");
    container.innerHTML = "";
    if (!data || data.length === 0||data.message==="No news found") {
        container.classList.add("d-flex", "justify-content-center");
        container.textContent = "Brak dostępnych ogłoszeń.";
        return;
    }

    const startIndex = (page - 1) * announcementsPerPage;
    const endIndex = startIndex + announcementsPerPage;
    const displayedAnnouncements = data.news.slice(startIndex, endIndex);

    const isAdmin = localStorage.getItem('admin');

    displayedAnnouncements.forEach(announcement => {
        const announcementCard = document.createElement("div");
        announcementCard.classList.add("announcement-card");
        announcementCard.setAttribute("id", announcement.id);

        const titleElement = document.createElement("h2");
        titleElement.textContent = announcement.title;
        titleElement.classList.add("announcement-title");

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = announcement.description;
        descriptionElement.classList.add("announcement-description");

        const creatorInfo = document.createElement("p");
        creatorInfo.textContent = `ID twórcy: ${announcement.creator_id}`;
        creatorInfo.classList.add("creator-info");

        const creationDate = new Date(announcement.creation_date);
        const formattedDate = creationDate.toLocaleString();
        const dateElement = document.createElement("p");
        dateElement.textContent = `Utworzono dnia: ${formattedDate}`;
        dateElement.classList.add("creation-date");

        announcementCard.appendChild(titleElement);
        announcementCard.appendChild(descriptionElement);
        announcementCard.appendChild(creatorInfo);
        announcementCard.appendChild(dateElement);

        if (isAdmin === 'true') {
            const editButton = document.createElement("button");
            editButton.classList.add("btn", "btn-light", "buttonDecoration");
            editButton.style.marginRight = "5px";
            editButton.innerHTML = '<i class="bi bi-pencil-fill"></i>';
            editButton.addEventListener("click", () => {
                var data={
                    title: announcement.title,
                    description: announcement.description,
                    creator_id: announcement.creator_id
                };
                generateNewNewsForm(data,announcement.id);
            });

            announcementCard.appendChild(editButton);
            const deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-light", "buttonDecoration");
            deleteButton.style.justifyContent="center"
            deleteButton.innerHTML = '<i class="bi bi-trash-fill" style="color:#cf4a4a"></i>';
            deleteButton.addEventListener("click", () => {
                deleteNewsById(announcement.id);
            });
            announcementCard.appendChild(deleteButton);
        }

        container.appendChild(announcementCard);
    });

    var pagination = document.createElement("div");
    pagination.setAttribute("id", "pagination");
    pagination.classList.add("pagination");
    document.getElementById("content").appendChild(pagination);

    generatePagination(data.news.length, page,data);
}
function generatePagination(totalAnnouncements, currentPage,data) {
    const totalPages = Math.ceil(totalAnnouncements / announcementsPerPage);
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement("button");
    prevButton.textContent = "Poprzednia strona";
    prevButton.classList.add("pagination-button");
    prevButton.disabled = currentPage === 1;
    if (prevButton.disabled) {
        prevButton.classList.add("disabled");
    }
    prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            generateAnnouncementView(data, currentPage);
        }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("pagination-button");
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        pageButton.addEventListener("click", () => {
            currentPage = i;
            generateAnnouncementView(data, currentPage);
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "Następna strona";
    nextButton.classList.add("pagination-button");
    nextButton.disabled = currentPage === totalPages;
    if (nextButton.disabled) {
        nextButton.classList.add("disabled");
    }
    nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            generateAnnouncementView(data, currentPage);
        }
    });
    paginationContainer.appendChild(nextButton);
}
function generateNewNewsForm(data,newsId) {
    hideApiResponse("apiInfoResponse");

    var contentContainer = document.getElementById("content");
  
    var advertisementForm = document.createElement("div");
    advertisementForm.classList.add("content-container");
    advertisementForm.id = "advertisementForm";
    
    var header = document.createElement("h2");
    header.textContent = "Formularz ogłoszenia";
    header.classList.add("MenuHeader");
    advertisementForm.appendChild(header);

    var form = document.createElement("form");
  
    var labelTitle = document.createElement("label");
    labelTitle.setAttribute("for", "createTitle");
    labelTitle.textContent = "Tytuł ogłoszenia:";
    
  
    var inputTitle = document.createElement("input");
    inputTitle.setAttribute("type", "text");
    inputTitle.setAttribute("id", "createTitle");
    inputTitle.setAttribute("placeholder", "Tytuł ogłoszenia");
    inputTitle.style.width = "100%"; // Wysrodkuj pole tytułu
    inputTitle.style.marginBottom = "15px"; // Dodaj większy margines na dole pola
    inputTitle.style.borderRadius = "5px"; // Zaokrąglone rogi
    inputTitle.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.1)"; // Cień
    
  
    var labelDescription = document.createElement("label");
    labelDescription.setAttribute("for", "createDescription");
    labelDescription.textContent = "Opis ogłoszenia:";
    
  
    var inputDescription = document.createElement("textarea");
    inputDescription.setAttribute("id", "createDescription");
    inputDescription.setAttribute("placeholder", "Opis ogłoszenia");
    inputDescription.setAttribute("rows", "4");
    inputDescription.style.width = "100%"; // Wysrodkuj pole opisu
    inputDescription.style.marginBottom = "15px"; // Dodaj większy margines na dole pola
    inputDescription.style.borderRadius = "5px"; // Zaokrąglone rogi
    inputDescription.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.1)"; // Cień

    var toApiMetode = 'POST';
    if(data){
        inputTitle.value = data.title;
        inputDescription.value = data.description;
        toApiMetode ='PUT';
    }
    form.appendChild(labelTitle);
    form.appendChild(inputTitle);
    form.appendChild(labelDescription);
    form.appendChild(inputDescription);
  
    var submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.textContent = "Dodaj ogłoszenie";
    submitButton.onclick = function() {
        validateAdvertisementForm(toApiMetode,newsId);
    };
    form.appendChild(submitButton);

    var removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.textContent = "Zamknij formularz";
    removeButton.onclick = function() {
        advertisementForm.remove();
    };
    removeButton.style.backgroundColor = "#cf4a4a";
    removeButton.style.color = "black";
    form.appendChild(removeButton);
  
    advertisementForm.appendChild(form);
    contentContainer.appendChild(advertisementForm);
    advertisementForm.scrollIntoView({ behavior: 'smooth' });
    
}
async function displayNews(){
    var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';
        
    var container = document.createElement("div");
    container.setAttribute("id", "announcement-container");
    container.classList.add("announcement-container");
    contentContainer.appendChild(container);

    
    var news = await getAllNews();
    generateAnnouncementView(news,currentPage);
    const isAdmin = localStorage.getItem('admin');
    if(isAdmin === 'true'){
        headerTextChange("Zarządzanie ogłoszeniami");
        var buttonDiv = document.createElement("div");
            buttonDiv.classList.add("d-flex", "justify-content-center","p-2");
        var newNewsButton = document.createElement("button");
            newNewsButton.classList.add("btn", "btn-light", "buttonDecoration");
            newNewsButton.innerHTML = 'Dodaj nowe ogłoszenie';
            newNewsButton.addEventListener("click", () => {
                hideNewsForm()
            });
        buttonDiv.appendChild(newNewsButton);
        contentContainer.appendChild(buttonDiv);
    }
    else{
        headerTextChange("Ogłoszenia");
    }
}
function hideNewsForm(){
    var advertisementForm= document.getElementById("advertisementForm");
    if(advertisementForm != null){
        advertisementForm.remove();
    }else{
        generateNewNewsForm();
    }
}
function validateAdvertisementForm(toApiMetode,newsId) {
    var title = document.getElementById("createTitle").value.trim();
    var description = document.getElementById("createDescription").value.trim();
    var creatorId = localStorage.getItem('id');
    const currentDate = new Date();
    var creationDate = currentDate.toISOString();

    if (title === "") {
        printApiResponse("apiInfoResponse","Proszę wprowadzić tytuł ogłoszenia.","levelWarning");
        return false;
    }

    if (description === "") {
        printApiResponse("apiInfoResponse","Proszę wprowadzić opis ogłoszenia.","levelWarning");
        return false;
    }

    var dataToSend = {
        title: title,
        description: description,
        creation_date: creationDate,
        creator_id:creatorId
    }
    if(toApiMetode == "PUT"){
        dataToSend.id = newsId;
        addEditNews(dataToSend,'PUT')
    } 
    else
        addEditNews(dataToSend,'POST')

    return true;
}
async function addEditNews(dataToSend,toApiMetode){
    try {
        const response = await fetch(apiBaseUrl+'/news', {
          method: toApiMetode,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
            if(toApiMetode === 'POST')
                printApiResponse("apiInfoResponse","Pomyślnie dodano ogłoszenie.","levelSucces")
            else
                printApiResponse("apiInfoResponse","Pomyślnie zedytowano ogłoszenie.","levelSucces")
          hideNewsForm();
          displayNews();
          
        } else {
          printApiResponse("apiInfoResponse",responseData.message,"levelWarning")
          console.error('Błąd podczas dodawania ogłoszenia: ', responseData.message);
        }
      } catch (error) {
          printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
          console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
      }
}
async function getAllNews() {
    try {
        const response = await fetch(apiBaseUrl+'/all_news', {
          method: 'GET'
        });
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas wysyłania żądania: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
        throw error;
    }
}
async function deleteNewsById(newsId){
    try {
        printApiResponse("apiInfoResponse", " ","levelACHTUNG");
        var statePromise = new Promise((resolve, reject) => {
            var apiInfoResponse = document.getElementById("apiInfoResponse");
            apiInfoResponse.classList.add("apiInfoResponse");
            apiInfoResponse.classList.add("levelACHTUNG");
            apiInfoResponse.textContent = 'Czy napewno chcesz usunąć ogłoszenie?';
            
            var apiDiv = document.querySelector('.apiDiv');
            apiDiv.innerHTML = ``;
            var yesButton = document.createElement("button");
            yesButton.classList.add("btn","btn-light","achtungButtonYes");
            yesButton.textContent = "Tak";
            yesButton.onclick = function() {
                hideApiResponse("apiInfoResponse");
                noButton.remove();
                yesButton.remove();
                resolve(true);
            };
            apiDiv.appendChild(yesButton);

            var noButton = document.createElement("button");
            noButton.classList.add("btn","btn-light","achtungButtonNo");
            noButton.textContent = "Nie";
            noButton.onclick = function() {
                hideApiResponse("apiInfoResponse");
                noButton.remove();
                yesButton.remove();
                resolve(false);
            };
            apiDiv.appendChild(noButton);
        });

        var state = await statePromise;

        if(state==true){
            const response = await fetch(apiBaseUrl+'/news/'+newsId, {
              method: 'DELETE'
            });
            const responseData = await response.json();
            printApiResponse("apiInfoResponse", 'Usunięto ogłoszenie o id: ' + newsId, "levelSucces");
            displayNews();
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas wysyłania żądania: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
        throw error;
    }
}

