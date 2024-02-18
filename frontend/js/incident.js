async function displayIncidentSystem(){
    var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';

    var showServicemanFormButton = document.createElement("button");
        showServicemanFormButton.setAttribute("type", "button");
        showServicemanFormButton.textContent = "Dodaj serwisanta";
        showServicemanFormButton.onclick = function() {
            hideServicemanForm();
        };
        contentContainer.appendChild(showServicemanFormButton);

    headerTextChange("Zarządzanie usterkami");
    var servicemanData = await getServicemen();
    console.log(servicemanData);
    displayServicemanData(servicemanData, "content");
}
/*var servicemanData = [
    {
        id: 1,
        full_name: "John Doe",
        specialties: "Software Development",
        company_id: "ABC123"
    },
    {
        id: 2,
        full_name: "Jane Smith",
        specialties: "Data Analysis",
        company_id: "XYZ456"
    },
    {
        id: 3,
        full_name: "Michael Johnson",
        specialties: "Project Management",
        company_id: "DEF789"
    }
];*/
async function displayServicemanData(data, containerId) {
    try {
        var container = document.getElementById(containerId);

        var tableHeader = document.createElement("h3");
        var text = document.createTextNode("Tabela serwisantów");
        tableHeader.appendChild(text);
        container.appendChild(tableHeader);

        var table = document.createElement("table");
        table.classList.add("table", "table-striped", "table-bordered", "table-hover");

        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");

        // Tworzenie nagłówków tabeli
        var headers = ["ID", "Pełna nazwa", "Specjalizacje","Edytuj","Zwolnij"];
        var headerRow = document.createElement("tr");
        headers.forEach(function(headerText) {
            var headerCell = document.createElement("th");
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        // Wypełnianie danych tabeli
        data.forEach(function(user) {
            var row = document.createElement("tr");

            // Dodaj komórki z danymi
            var idCell = document.createElement("td");
            idCell.textContent = user.id;
            row.appendChild(idCell);

            var fullNameCell = document.createElement("td");
            fullNameCell.textContent = user.full_name;
            row.appendChild(fullNameCell);

            var specialtiesCell = document.createElement("td");
            specialtiesCell.textContent = user.specialties;
            row.appendChild(specialtiesCell);

            var editButton = document.createElement("td");
            var button = document.createElement("button");
            button.classList.add("btn", "btn-light", "buttonDecoration");
            button.innerHTML = '<i class="bi bi-pencil-square"></i>';
            button.onclick = function() {
                hideServicemanForm(user.id,user);
            };
            editButton.appendChild(button);
            row.appendChild(editButton);

            var deleteButton = document.createElement("td");
            deleteButton.innerHTML = `
                <button class="btn btn-light buttonDecoration" onclick="deleteServicemanById(${user.id})"><i class="bi bi-trash-fill" style="color:#cf4a4a"></i></button>
            `;
            row.appendChild(deleteButton);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.appendChild(table);

    } catch (error) {
        printApiResponse("apiInfoResponse", 'Brak serwisantów w bazie', "levelWarning");
        console.error('Wystąpił błąd podczas wyświetlania danych:', error.message);
    }
}
function displayServicemanDataForm(userId, userData) {
    try {
        var container = document.getElementById("content");

        var inputForm = document.createElement("div");
        inputForm.classList.add("content-container");
        inputForm.id = "inputForm";

        var form = document.createElement("form");
        form.classList.add("row", "g-2");

        var fullNameFormGroup = document.createElement("div");
        fullNameFormGroup.classList.add("col-md-6");
        var fullNameLabel = document.createElement("label");
        fullNameLabel.classList.add("form-label");
        fullNameLabel.setAttribute("for", "newFullName");
        fullNameLabel.textContent = "Pełna nazwa:";
        var fullNameInput = document.createElement("input");
        fullNameInput.classList.add("form-control");
        fullNameInput.setAttribute("type", "text");
        fullNameInput.setAttribute("id", "newFullName");
        fullNameInput.setAttribute("placeholder", "Wprowadź pełną nazwę");
        fullNameFormGroup.appendChild(fullNameLabel);
        fullNameFormGroup.appendChild(fullNameInput);

        var specialtiesFormGroup = document.createElement("div");
        specialtiesFormGroup.classList.add("col-md-6");
        var specialtiesLabel = document.createElement("label");
        specialtiesLabel.classList.add("form-label");
        specialtiesLabel.setAttribute("for", "newSpecialties");
        specialtiesLabel.textContent = "Specjalizacje:";
        var specialtiesInput = document.createElement("input");
        specialtiesInput.classList.add("form-control");
        specialtiesInput.setAttribute("type", "text");
        specialtiesInput.setAttribute("id", "newSpecialties");
        specialtiesInput.setAttribute("placeholder", "Wprowadź specjalizacje");
        specialtiesFormGroup.appendChild(specialtiesLabel);
        specialtiesFormGroup.appendChild(specialtiesInput);
        
        var toApiMethod = 'POST';

        var submitButton = document.createElement("button");
        submitButton.classList.add("btn", "btn-primary", "buttonDecoration");
        submitButton.setAttribute("type", "button");
        submitButton.textContent = "Dodaj";
        submitButton.onclick = function() {
            validateServicemanDataForm(toApiMethod, userId);
        };
        submitButton.style.marginTop = "1.5rem";
        submitButton.style.width = "100%";

        var header = document.createElement("h2");
        header.textContent = "Formularz dodania serwisanta";
        header.classList.add("MenuHeader");
        

        if (userData) {
            fullNameInput.value = userData.full_name;
            specialtiesInput.value = userData.specialties;
            toApiMethod = 'PUT'; 
            submitButton.textContent = "Edytuj";
            header.textContent = "Formularz edycji serwisanta";
        }

        form.appendChild(fullNameFormGroup);
        form.appendChild(specialtiesFormGroup);
        form.appendChild(submitButton);

        inputForm.appendChild(header);

        var removeButton = document.createElement("button");
        removeButton.setAttribute("type", "button");
        removeButton.textContent = "Zamknij formularz";
        removeButton.onclick = function() {
            inputForm.remove();
        };
        removeButton.style.backgroundColor = "#cf4a4a";
        removeButton.style.color = "black";
        form.appendChild(removeButton);

        inputForm.appendChild(form);
        container.appendChild(inputForm);
        inputForm.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Wystąpił błąd podczas wyświetlania formularza:', error.message);
    }
}
function validateServicemanDataForm(toApiMethod, userId) {
    var fullNameInput = document.getElementById("newFullName");
    var specialtiesInput = document.getElementById("newSpecialties");

    var fullName = fullNameInput.value.trim();
    var specialties = specialtiesInput.value.trim();

    // Sprawdzamy, czy pole z pełną nazwą jest puste
    if (fullName === "" || specialties === "") {
        printApiResponse("apiInfoResponse","Uzupelnij wszystkie pola","levelWarning")
        return;
    }
    var dataToSend = {
        full_name: fullName,
        specialties: specialties,
        company_id: 1,
    }
    if(toApiMethod === 'PUT'){
        dataToSend.id = userId;
    }
    // Walidacja zakończona sukcesem - można wysłać dane do API lub wykonać inne akcje
    sendServicemanToApi(dataToSend,toApiMethod);
}
function hideServicemanForm(userid,userData){
    var ImputForm= document.getElementById("inputForm");
    if(ImputForm != null){
        ImputForm.remove();
    }else{
        displayServicemanDataForm(userid,userData)
    }
}
async function getServicemen(){
    try {
        const response = await fetch(apiBaseUrl+'/all_servicemen', {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData.message;
        } else {
            printApiResponse("apiInfoResponse", 'Brak serwisantów w bazie: ' + error.message, "levelWarning");
            throw new Error("Brak danych właścicieli w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania serwisantów: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania serwisantów:', error.message);
        throw error;
    }
}
async function sendServicemanToApi(dataToSend,toApiMetode){
    try {
        console.log(dataToSend)
        console.log(toApiMetode)
        const response = await fetch(apiBaseUrl+"/serviceman", {
          method: toApiMetode,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
            if(toApiMetode === 'POST')
                printApiResponse("apiInfoResponse","Pomyślnie dodano serwisanta.","levelSucces")
            else
                printApiResponse("apiInfoResponse","Pomyślnie zedytowano serwisanta.","levelSucces")
            displayIncidentSystem();
          
        } else {
          printApiResponse("apiInfoResponse",responseData.message,"levelWarning")
          console.error('Błąd podczas dodawania opłaty: ', responseData.message);
        }
      } catch (error) {
          printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
          console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
      }
}
async function deleteServicemanById(userid){
    try {

        printApiResponse("apiInfoResponse", " ","levelACHTUNG");
        var statePromise = new Promise((resolve, reject) => {
            var apiInfoResponse = document.getElementById("apiInfoResponse");
            apiInfoResponse.classList.add("apiInfoResponse");
            apiInfoResponse.classList.add("levelACHTUNG");
            apiInfoResponse.textContent = 'Czy napewno chcesz usunąć serwisanta?';
            
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
            const response = await fetch(apiBaseUrl+'/serviceman/'+userid, {
              method: 'DELETE'
            });
            const responseData = await response.json();
            printApiResponse("apiInfoResponse", 'Usunięto serwisanta o id: ' + userid, "levelSucces");
            displayIncidentSystem();
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas wysyłania żądania: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
        throw error;
    }
}