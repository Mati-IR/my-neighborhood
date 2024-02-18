async function displayVotingSystem(){
    var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';
        headerTextChange("Zarządzanie głosowaniami");

    var showServicemanFormButton = document.createElement("button");
        showServicemanFormButton.setAttribute("type", "button");
        showServicemanFormButton.textContent = "Dodaj głosowanie";
        showServicemanFormButton.onclick = function() {
            hideVoteForm();
        };
        contentContainer.appendChild(showServicemanFormButton);

    var activeHeader = document.createElement("h2");
        activeHeader.classList.add("accountHeader");
        activeHeader.innerHTML = "Aktywne głosowania"
        contentContainer.appendChild(activeHeader);
    var container = document.createElement("div");
        container.setAttribute("id", "activeVoting-container");
        container.classList.add("activeVoting-container");
        contentContainer.appendChild(container);
    generateVotingView(sampleData,currentPage,"activeVoting-container");
    
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
    generateVotingView(sampleData,currentPage,"archiveVoting-container");
}
const sampleData = {
    news: [
        {
            id: 1,
            date: "2024-02-18T09:33:00",
            title: "Przykładowe ogłoszenie 1",
            description: "To jest przykładowe ogłoszenie numer 1.",
            creator_id: 123
        },
        {
            id: 2,
            date: "2024-02-18T12:32:00",
            title: "Przykładowe ogłoszenie 2",
            description: "To jest przykładowe ogłoszenie numer 2.",
            creator_id: 456
        },
        {
            id: 3,
            date: "2024-02-16T15:45:00",
            title: "Przykładowe ogłoszenie 3",
            description: "To jest przykładowe ogłoszenie numer 3.",
            creator_id: 789
        },
        {
            id: 4,
            date: "2024-02-15T10:20:00",
            title: "Przykładowe ogłoszenie 4",
            description: "To jest przykładowe ogłoszenie numer 4.",
            creator_id: 101112
        },
        {
            id: 5,
            date: "2024-02-14T16:00:00",
            title: "Przykładowe ogłoszenie 5",
            description: "To jest przykładowe ogłoszenie numer 5.",
            creator_id: 131415
        },
        // Można dodać więcej ogłoszeń według potrzeb
    ]
};
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
    var title = document.getElementById("dataTitle").value;
    var description = document.getElementById("dataDescription").value;
    var endDate = document.getElementById("endDate").value;

    displayVoteData(title, description, endDate);
}
function generateVotingView(data, page, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = "";
    if (!data || data.length === 0 || data.message === "No news found") {
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

        const creationDate = new Date(announcement.date);
        const formattedDate = creationDate.toLocaleString();
        const dateElement = document.createElement("p");
        dateElement.textContent = `Utworzono dnia: ${formattedDate}`;
        dateElement.classList.add("creation-date");

        const remainingTimeElement = document.createElement("p");
        remainingTimeElement.classList.add("remaining-time");

        function updateRemainingTime() {
            const currentTime = new Date();
            let timeDifference = Math.abs(creationDate - currentTime);
            let prefix = "";

            if (creationDate < currentTime) {
                prefix = "Czas na głosowanie minął";
                remainingTimeElement.textContent = `${prefix}`;
                const voteDiv = announcementCard.querySelector('.vote-options');
                    if (voteDiv) {
                        voteDiv.remove();
                    }
            } else {
                prefix = "Pozostało: ";
                const seconds = Math.floor(timeDifference / 1000) % 60;
                const minutes = Math.floor(timeDifference / (1000 * 60)) % 60;
                const hours = Math.floor(timeDifference / (1000 * 60 * 60)) % 24;

                remainingTimeElement.textContent = `${prefix}${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            }
        }

        updateRemainingTime();
        const updateInterval = setInterval(updateRemainingTime, 1000);

        announcementCard.appendChild(titleElement);
        announcementCard.appendChild(descriptionElement);
        announcementCard.appendChild(dateElement);
        announcementCard.appendChild(remainingTimeElement);

        // Dodajemy przyciski na końcu ogłoszenia
        /*if (isAdmin === 'true' && elementId === "activeVoting-container") {
            const editButton = document.createElement("button");
            editButton.classList.add("btn", "btn-light", "buttonDecoration");
            editButton.style.marginRight = "5px";
            editButton.innerHTML = '<i class="bi bi-pencil-fill"></i>';
            editButton.addEventListener("click", () => {
                var data = {
                    title: announcement.title,
                    description: announcement.description,
                    creator_id: announcement.creator_id
                };
                generateNewNewsForm(data, announcement.id);
            });

            announcementCard.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.classList.add("btn", "btn-light", "buttonDecoration");
            deleteButton.style.justifyContent = "center";
            deleteButton.innerHTML = '<i class="bi bi-trash-fill" style="color:#cf4a4a"></i>';
            deleteButton.addEventListener("click", () => {
                deleteNewsById(announcement.id);
            });

            announcementCard.appendChild(deleteButton);
        }*/

        // Dodajemy przyciski na końcu, jeśli czas minął
        if (announcementCard.querySelector('.remaining-time').textContent != "Czas na głosowanie minął"&&isAdmin!='true') {
            const voteDiv = document.createElement("div");
            voteDiv.classList.add("vote-options", "radioDiv"); // Dodajemy klasę radioDiv

            const voteYesInput = document.createElement("input");
            voteYesInput.setAttribute("type", "radio");
            voteYesInput.setAttribute("name", `vote-${announcement.id}`);
            voteYesInput.setAttribute("value", "yes");
            voteYesInput.id = `vote-yes-${announcement.id}`;

            const voteYesLabel = document.createElement("label");
            voteYesLabel.setAttribute("for", `vote-yes-${announcement.id}`);
            voteYesLabel.textContent = "Tak";

            const voteNoInput = document.createElement("input");
            voteNoInput.setAttribute("type", "radio");
            voteNoInput.setAttribute("name", `vote-${announcement.id}`);
            voteNoInput.setAttribute("value", "no");
            voteNoInput.id = `vote-no-${announcement.id}`;

            const voteNoLabel = document.createElement("label");
            voteNoLabel.setAttribute("for", `vote-no-${announcement.id}`);
            voteNoLabel.textContent = "Nie";

            const voteButton = document.createElement("button");
            voteButton.textContent = "Zagłosuj";
            voteButton.classList.add("btn", "btn-primary", "buttonDecoration");
            voteButton.addEventListener("click", () => {
                const selectedValue = document.querySelector(`input[name=vote-${announcement.id}]:checked`).value;
                // Tutaj można dodać logikę obsługi głosu
                console.log(`Głosowanie na ogłoszenie ${announcement.id}: ${selectedValue}`);
            });

            voteDiv.appendChild(voteYesInput);
            voteDiv.appendChild(voteYesLabel);
            voteDiv.appendChild(voteNoInput);
            voteDiv.appendChild(voteNoLabel);
            voteDiv.appendChild(voteButton);

            announcementCard.appendChild(voteDiv);
        }

        container.appendChild(announcementCard);
    });

    var pagination = document.createElement("div");
    pagination.setAttribute("id", "pagination" + elementId);
    pagination.classList.add("pagination");
    document.getElementById("content").appendChild(pagination);

    generateVotingPagination(data.news.length, page, data, elementId);
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
