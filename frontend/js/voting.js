async function displayVotingSystem(){
    var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';
        headerTextChange("Zarządzanie głosowaniami");

    const userId = localStorage.getItem('id');
    const isAdmin = localStorage.getItem('admin');

    var voting = await getAllVotings(userId);
    const { activeVotings, endedVotings, inactiveVotings } = splitVotingsByStatus(voting);
    if(isAdmin==='true'){
        var showServicemanFormButton = document.createElement("button");
        showServicemanFormButton.setAttribute("type", "button");
        showServicemanFormButton.textContent = "Dodaj głosowanie";
        showServicemanFormButton.onclick = function() {
            hideVoteForm();
        };
        contentContainer.appendChild(showServicemanFormButton);

        var inactiveHeader = document.createElement("h2");
            inactiveHeader.classList.add("accountHeader");
            inactiveHeader.innerHTML = "Aktywne Nieaktywne"
            contentContainer.appendChild(inactiveHeader);
        var inactivecontainer = document.createElement("div");
            inactivecontainer.setAttribute("id", "inactiveVoting-container");
            inactivecontainer.classList.add("inactiveVoting-container");
            contentContainer.appendChild(inactivecontainer);
        generateVotingView(inactiveVotings,currentPage,"inactiveVoting-container");
    }
    var activeHeader = document.createElement("h2");
        activeHeader.classList.add("accountHeader");
        activeHeader.innerHTML = "Aktywne głosowania"
        contentContainer.appendChild(activeHeader);
    var container = document.createElement("div");
        container.setAttribute("id", "activeVoting-container");
        container.classList.add("activeVoting-container");
        contentContainer.appendChild(container);
    generateVotingView(activeVotings,currentPage,"activeVoting-container");
    
    var breakLine = document.createElement("br");
        contentContainer.appendChild(breakLine);
    var activeHeader = document.createElement("h2");
        activeHeader.classList.add("accountHeader");
        activeHeader.innerHTML = "Zakończone głosowania"
        contentContainer.appendChild(activeHeader);
    var container = document.createElement("div");
        container.setAttribute("id", "archiveVoting-container");
        container.classList.add("archiveVoting-container");
        contentContainer.appendChild(container);
    generateVotingView(endedVotings,currentPage,"archiveVoting-container");
}
function generateNewVotingForm() {
    hideApiResponse("apiInfoResponse");

    var contentContainer = document.getElementById("content");

    var dataForm = document.createElement("div");
    dataForm.classList.add("content-container");
    dataForm.id = "dataForm";

    var header = document.createElement("h2");
    header.textContent = "Formularz nowego głosowania";
    header.classList.add("MenuHeader");
    dataForm.appendChild(header);

    var form = document.createElement("form");

    var labelTitle = document.createElement("label");
    labelTitle.setAttribute("for", "dataTitle");
    labelTitle.textContent = "Tytuł:";

    var inputTitle = document.createElement("input");
    inputTitle.setAttribute("type", "text");
    inputTitle.setAttribute("id", "dataTitle");
    inputTitle.setAttribute("placeholder", "Tytuł");
    inputTitle.style.width = "100%";
    inputTitle.style.marginBottom = "15px";
    inputTitle.style.borderRadius = "5px";
    inputTitle.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.1)";

    var labelDescription = document.createElement("label");
    labelDescription.setAttribute("for", "dataDescription");
    labelDescription.textContent = "Opis:";

    var inputDescription = document.createElement("textarea");
    inputDescription.setAttribute("id", "dataDescription");
    inputDescription.setAttribute("placeholder", "Opis");
    inputDescription.setAttribute("rows", "4");
    inputDescription.style.width = "100%";
    inputDescription.style.marginBottom = "15px";
    inputDescription.style.borderRadius = "5px";
    inputDescription.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.1)";

    var labelStartDate = document.createElement("label");
    labelStartDate.setAttribute("for", "startDate");
    labelStartDate.textContent = "Data rozpoczęcia głosowania:";

    var inputStartDate = document.createElement("input");
    inputStartDate.setAttribute("type", "datetime-local");
    inputStartDate.setAttribute("id", "startDate");
    inputStartDate.style.width = "100%";
    inputStartDate.style.marginBottom = "15px";
    inputStartDate.style.borderRadius = "5px";
    inputStartDate.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.1)";

    var labelEndDate = document.createElement("label");
    labelEndDate.setAttribute("for", "endDate");
    labelEndDate.textContent = "Data zakończenia głosowania:";

    var inputEndDate = document.createElement("input");
    inputEndDate.setAttribute("type", "datetime-local");
    inputEndDate.setAttribute("id", "endDate");
    inputEndDate.style.width = "100%";
    inputEndDate.style.marginBottom = "15px";
    inputEndDate.style.borderRadius = "5px";
    inputEndDate.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.1)";

    var submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.textContent = "Dodaj głosowanie";
    submitButton.onclick = function() {
        validateVoteForm();
    };

    form.appendChild(labelTitle);
    form.appendChild(inputTitle);
    form.appendChild(labelDescription);
    form.appendChild(inputDescription);
    form.appendChild(labelStartDate);
    form.appendChild(inputStartDate);
    form.appendChild(labelEndDate);
    form.appendChild(inputEndDate);
    form.appendChild(submitButton);

    var removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.textContent = "Zamknij formularz";
    removeButton.onclick = function() {
        dataForm.remove();
    };
    removeButton.style.backgroundColor = "#cf4a4a";
    removeButton.style.color = "black";
    form.appendChild(removeButton);

    dataForm.appendChild(form);
    contentContainer.appendChild(dataForm);
    dataForm.scrollIntoView({ behavior: 'smooth' });
}
function hideVoteForm(){
    var voteForm= document.getElementById("dataForm");
    if(voteForm != null){
        voteForm.remove();
    }else{
        generateNewVotingForm();
    }
}
function validateVoteForm() {
    var title = document.getElementById("dataTitle").value.trim();
    var description = document.getElementById("dataDescription").value.trim();
    var startDate = document.getElementById("startDate").value.trim();
    var endDate = document.getElementById("endDate").value.trim();

    if (title === ""||description === ""||startDate === ""||endDate === "") {
        printApiResponse("apiInfoResponse","Proszę uzupełnić wszystkie pola","levelWarning")
        return;
    }

    var startDateObj = new Date(startDate);
    var endDateObj = new Date(endDate);

    if (startDateObj >= endDateObj) {
        printApiResponse("apiInfoResponse","Data rozpoczęcia głosowania musi być wcześniejsza niż data zakończenia głosowania.","levelWarning")
        return;
    }
    var dataToSend = {
        start_date: startDate,
        end_date: endDate,
        title: title,
        description: description,
        creator_id: localStorage.getItem('id')
    }

    postNewVoting(dataToSend);
}
function generateVotingView(data, page, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = "";
    if (!data || data.length === 0 || data.message === "Votings not found") {
        container.classList.add("d-flex", "justify-content-center");
        container.textContent = "Brak dostępnych głosowań.";
        return;
    }

    const startIndex = (page - 1) * announcementsPerPage;
    const endIndex = startIndex + announcementsPerPage;
    const displayedAnnouncements = data.votings.slice(startIndex, endIndex);

    const isAdmin = localStorage.getItem('admin');
    displayedAnnouncements.forEach(async announcement => {
        const announcementCard = document.createElement("div");
        announcementCard.classList.add("announcement-card");
        announcementCard.setAttribute("id", announcement.id);

        const titleElement = document.createElement("h2");
        titleElement.textContent = announcement.title;
        titleElement.classList.add("announcement-title");

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = announcement.description;
        descriptionElement.classList.add("announcement-description");

        const creationDate = new Date(announcement.start_date);
        const formattedDate = creationDate.toLocaleString(); // Zmiana formatu daty
        const dateElement = document.createElement("p");
        dateElement.textContent = `Utworzono dnia: ${formattedDate}`;
        dateElement.classList.add("creation-date");

        const remainingTimeElement = document.createElement("p");
        remainingTimeElement.classList.add("remaining-time");

        const endDate = new Date(announcement.end_date);
        function updateRemainingTime() {
            const currentTime = new Date();
            let timeDifference = Math.abs(endDate - currentTime);
            let prefix = "";

            if (endDate < currentTime) {
                prefix = "Czas na głosowanie minął";
                remainingTimeElement.textContent = `${prefix}`;
                const voteDiv = announcementCard.querySelector('.vote-options');
                if (voteDiv) {
                    voteDiv.remove();
                }
            } else {
                prefix = "Pozostały czas: ";
                const seconds = Math.floor(timeDifference / 1000) % 60;
                const minutes = Math.floor(timeDifference / (1000 * 60)) % 60;
                const hours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;
                const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            
                remainingTimeElement.textContent = `${prefix}${days} dni ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
            
        }

        updateRemainingTime();
        const updateInterval = setInterval(updateRemainingTime, 1000);

        announcementCard.appendChild(titleElement);
        announcementCard.appendChild(descriptionElement);
        announcementCard.appendChild(dateElement);
        announcementCard.appendChild(remainingTimeElement);

        if (announcementCard.querySelector('.remaining-time').textContent != "Czas na głosowanie minął"){
            if(isAdmin != 'true'){
                if(announcement.voted === false){
                    const voteDiv = document.createElement("div");
                    voteDiv.classList.add("vote-options", "radioDiv");

                    const voteYesInput = document.createElement("input");
                    voteYesInput.setAttribute("type", "radio");
                    voteYesInput.setAttribute("name", `vote-${announcement.id}`);
                    voteYesInput.setAttribute("value", "true");
                    voteYesInput.id = `vote-yes-${announcement.id}`;

                    const voteYesLabel = document.createElement("label");
                    voteYesLabel.setAttribute("for", `vote-yes-${announcement.id}`);
                    voteYesLabel.textContent = "Tak";

                    const voteNoInput = document.createElement("input");
                    voteNoInput.setAttribute("type", "radio");
                    voteNoInput.setAttribute("name", `vote-${announcement.id}`);
                    voteNoInput.setAttribute("value", "false");
                    voteNoInput.id = `vote-no-${announcement.id}`;

                    const voteNoLabel = document.createElement("label");
                    voteNoLabel.setAttribute("for", `vote-no-${announcement.id}`);
                    voteNoLabel.textContent = "Nie";

                    const voteButton = document.createElement("button");
                    voteButton.textContent = "Zagłosuj";
                    voteButton.classList.add("btn", "btn-primary", "buttonDecoration");
                    voteButton.addEventListener("click", () => {
                        const selectedValue = document.querySelector(`input[name=vote-${announcement.id}]:checked`).value;
                        var dataToSend = {
                            owner_id: localStorage.getItem('id'),
                            voting_id: announcement.id,
                            vote: selectedValue,
                            is_admin: localStorage.getItem('admin'),
                        }
                        postVote(dataToSend);
                    });

                    voteDiv.appendChild(voteYesInput);
                    voteDiv.appendChild(voteYesLabel);
                    voteDiv.appendChild(voteNoInput);
                    voteDiv.appendChild(voteNoLabel);
                    voteDiv.appendChild(voteButton);

                    announcementCard.appendChild(voteDiv);
                }else{
                    const voteDiv = document.createElement("div");
                    voteDiv.classList.add("vote-options", "radioDiv");
                    voteDiv.innerHTML="Głos został już oddany"
                    announcementCard.appendChild(voteDiv);
                }
            }
        }
        if(elementId === "archiveVoting-container"){
            var voteResult = await getVotingResult(announcement.id);
            if(voteResult.message === "Votes not found"){
                const voteResultDiv = document.createElement("p");
                    voteResultDiv.innerHTML="Nikt nie oddał głosu"
                    announcementCard.appendChild(voteResultDiv);
            }
            else{
                const voteResultDiv = document.createElement("div");
                const voteResultP = document.createElement("p");
                voteResultP.innerHTML="<b>Wynik</b>"
                voteResultDiv.appendChild(voteResultP)
                const totalVotes = voteResult.message.yes + voteResult.message.no;

                const yesPercentage = (voteResult.message.yes / totalVotes) * 100;
                const noPercentage = (voteResult.message.no / totalVotes) * 100;

                const yesBar = document.createElement("div");
                yesBar.style.width = `${yesPercentage}%`;
                yesBar.style.backgroundColor = 'green';
                yesBar.textContent = `${Math.round(yesPercentage)}%`;

                const noBar = document.createElement("div");
                noBar.style.width = `${noPercentage}%`;
                noBar.style.backgroundColor = 'red';
                noBar.textContent = `${Math.round(noPercentage)}%`;

                const voteResultText = document.createElement("p");
                voteResultText.textContent = `Głosy: Tak - ${voteResult.message.yes}, Nie - ${voteResult.message.no}`;

                voteResultDiv.appendChild(voteResultText);
                voteResultDiv.appendChild(yesBar);
                voteResultDiv.appendChild(noBar);

                announcementCard.appendChild(voteResultDiv);
            }
        }
        container.appendChild(announcementCard);
    });
    
    var pagination = document.createElement("div");
    pagination.setAttribute("id", "pagination" + elementId);
    pagination.classList.add("pagination");
    document.getElementById("content").appendChild(pagination);

    generateVotingPagination(data.votings.length, page, data, elementId);
}
function generateVotingPagination(totalAnnouncements, currentPage, data,elementId) {
    const totalPages = Math.ceil(totalAnnouncements / announcementsPerPage);
    const paginationContainer = document.getElementById("pagination"+elementId);
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
            generateVotingView(data, currentPage,elementId);
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
            generateVotingView(data, currentPage,elementId);
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
            generateVotingView(data, currentPage,elementId);
        }
    });
    paginationContainer.appendChild(nextButton);
}
async function getAllVotings(userId){
    try {
        const response = await fetch(apiBaseUrl+'/all_votings/'+userId, {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData;
        } else {
            throw new Error("Brak danych głosowania w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania głosowania: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania głosowania:', error.message);
        throw error;
    }
}
async function postNewVoting(dataToSend){
    try {
        const response = await fetch(apiBaseUrl+"/voting", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
            printApiResponse("apiInfoResponse","Pomyślnie dodano głosowanie.","levelSucces")
            displayVotingSystem();
          
        } else {
          printApiResponse("apiInfoResponse",responseData.message,"levelWarning")
          console.error('Błąd podczas dodawania opłaty: ', responseData.message);
        }
      } catch (error) {
          printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
          console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
      }
}
function splitVotingsByStatus(votingsData) {
    const currentDate = new Date();

    const activeVotings = [];
    const endedVotings = [];
    const inactiveVotings = [];

    votingsData.votings.forEach(voting => {
        const endDate = new Date(voting.end_date);

        if (voting.active) {
            activeVotings.push(voting);
        } else if (endDate < currentDate) {
            endedVotings.push(voting);
        } else {
            inactiveVotings.push(voting);
        }
    });

    return {
        activeVotings: { message: votingsData.message, votings: activeVotings },
        endedVotings: { message: votingsData.message, votings: endedVotings },
        inactiveVotings: { message: votingsData.message, votings: inactiveVotings }
    };
}
async function postVote(dataToSend){
    try {
        const response = await fetch(apiBaseUrl+"/vote", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
            printApiResponse("apiInfoResponse","Pomyślnie oddano głos.","levelSucces")
            displayVotingSystem();
          
        } else {
          printApiResponse("apiInfoResponse",responseData.message,"levelWarning")
          console.error('Błąd podczas dodawania głosu: ', responseData.message);
        }
      } catch (error) {
          printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
          console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
      }
}
async function getVotingResult(votingId){
    try {
        const response = await fetch(apiBaseUrl+'/voting_stats/'+votingId, {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData;
        } else {
            throw new Error("Brak danych głosowania w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania głosowania: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania głosowania:', error.message);
        throw error;
    }
}

