async function displayIncidentSystem(){
    var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';

    const isAdmin = localStorage.getItem('admin');
    const userId = localStorage.getItem('id');

    var category = await getIncidentCategory();
    var state = await getState();

    headerTextChange("Zarządzanie usterkami");
    
    if(isAdmin==='true'){
        var showServicemanFormButton = document.createElement("button");
        showServicemanFormButton.setAttribute("type", "button");
        showServicemanFormButton.textContent = "Dodaj serwisanta";
        showServicemanFormButton.onclick = function() {
            hideServicemanForm();
        };
        contentContainer.appendChild(showServicemanFormButton);
        var servicemanData = await getServicemen();
        displayServicemanData(servicemanData, "content");
        var allIncident = await getAllIncident();
        console.log(allIncident)
        const [state1, state2To5, state6] = segregateByState(allIncident.message);
        var ownerData = await getAllOwners();
        await generateIncidentTable(state1, category.message, state.message,"Zgłoszenia do obsłużenia",ownerData,servicemanData);
        await generateIncidentTable(state2To5, category.message, state.message,"Aktywne zgłoszenia",ownerData,servicemanData);
        await generateIncidentTable(state6, category.message, state.message,"Zamknięte zgłoszenia",ownerData,servicemanData);
    }else{
        var showIncidentFormButton = document.createElement("button");
        showIncidentFormButton.setAttribute("type", "button");
        showIncidentFormButton.textContent = "Zgłoś usterke";
        showIncidentFormButton.onclick = function() {
            hideIncidentForm(category.message);
        };
        contentContainer.appendChild(showIncidentFormButton);
        var userIncident = await getIncidentForUser(userId);
        const [state1, state2To5, state6] = segregateByState(userIncident.message);
        var merged = state1.concat(state2To5);
        await generateIncidentTable(merged, category.message, state.message,"Twoje aktywne zgłoszenia");
        await generateIncidentTable(state6, category.message, state.message,"Twoje zamknięte zgłoszenia");
    }
}
function segregateByState(data) {
    const state1Array = [];
    const state2To5Array = [];
    const state6Array = [];

    data.forEach(item => {
        if (item.state === 1) {
            state1Array.push(item);
        } else if (item.state >= 2 && item.state <= 5) {
            state2To5Array.push(item);
        } else if (item.state === 6) {
            state6Array.push(item);
        }
    });

    return [state1Array, state2To5Array, state6Array];
}
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

        var headers = ["ID", "Pełna nazwa", "Specjalizacje","Edytuj","Zwolnij"];
        var headerRow = document.createElement("tr");
        headers.forEach(function(headerText) {
            var headerCell = document.createElement("th");
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        data.forEach(function(user) {
            var row = document.createElement("tr");

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
function hideIncidentForm(userid,categories){
    var dataForm= document.getElementById("dataForm");
    if(dataForm != null){
        dataForm.remove();
    }else{
        generateNewIncidentForm(userid,categories)
    }
}
function hideAssignForm(incidentId,servicemenList){
    var AssignForm= document.getElementById("AssignForm");
    if(AssignForm != null){
        AssignForm.remove();
    }else{
        displayAssignServicemanForm(incidentId,servicemenList)
    }
}
function hideStateChangeForm(incidentId,state){
    var stateForm= document.getElementById("stateForm");
    if(stateForm != null){
        stateForm.remove();
    }else{
        displayStateChangeForm(incidentId,state)
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
async function getState(){
    try {
        const response = await fetch(apiBaseUrl+'/all_incident_states', {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData;
        } else {
            throw new Error("Brak danych o stanach w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania stanów: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania stanów:', error.message);
        throw error;
    }
}
async function getIncidentCategory(){
    try {
        const response = await fetch(apiBaseUrl+'/all_incident_categories', {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData;
        } else {
            throw new Error("Brak danych o kategoriach w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania kategorii: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania kategorii:', error.message);
        throw error;
    }
}
async function generateIncidentTable(incidents, category, state, headerText, userData, servicemanData) {
    if (incidents.length > 0) {
        const isAdmin = localStorage.getItem('admin');
        const tableWrapper = document.createElement('div');
        tableWrapper.classList.add('table-responsive');

        var tableHeader = document.createElement("h3");
        var text = document.createTextNode(headerText);
        tableHeader.appendChild(text);
        tableWrapper.appendChild(tableHeader);

        const table = document.createElement('table');
        table.classList.add('table', 'table-striped');

        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headerRow = document.createElement('tr');
        ['ID', 'Tytuł', 'Kategoria', 'Data zgłoszenia', 'Stan', 'Szczegóły'].forEach(columnName => {
            const th = document.createElement('th');
            th.textContent = columnName;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        for await (const incident of incidents) {
            const mainRow = document.createElement('tr');
            ['id', 'title', 'category_id', 'creation_date', 'state'].forEach(key => {
                const cell = document.createElement('td');
                if (key === 'category_id') {
                    cell.textContent = category.find(c => c.id === incident[key])?.name || 'Unknown';
                } else if (key === 'state') {
                    cell.textContent = state.find(s => s.id === incident[key])?.name || 'Unknown';
                } else if (key === 'creation_date') {
                    const date = new Date(incident[key]);
                    const formattedDate = `${padZero(date.getDate())}-${padZero(date.getMonth() + 1)}-${date.getFullYear()} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
                    cell.textContent = formattedDate;
                } else {
                    cell.textContent = incident[key] || 'N/A';
                }
                mainRow.appendChild(cell);
            });

            const detailsCell = document.createElement('td');
            const detailsButton = document.createElement('button');
            detailsButton.classList.add('btn', 'btn-light', 'buttonDecoration');
            detailsButton.innerHTML = '<i class="bi bi-caret-down-fill"></i>';
            detailsButton.addEventListener('click', function () {
                toggleDetails(incident.id);
            });
            detailsCell.appendChild(detailsButton);
            mainRow.appendChild(detailsCell);

            tbody.appendChild(mainRow);

            const detailsRow = document.createElement('tr');
            detailsRow.classList.add('details-row', `details-${incident.id}`, 'hidden');
            const detailsCellContent = document.createElement('td');
            detailsCellContent.setAttribute('colspan', '6');
            const detailsContent = document.createElement('div');
            detailsContent.classList.add('details-content');

            if (isAdmin === 'true' && userData) {
                const ownerData = userData.find(user => user.id === incident.owner_id);
                if (ownerData) {
                    const detailsHeader = document.createElement('h4');
                    detailsHeader.textContent = 'Szczegóły zgłoszenia';
                    detailsContent.appendChild(detailsHeader);

                    detailsContent.innerHTML += `
                    <p><strong>Opis:</strong> ${incident.description || 'N/A'}</p>
                    <p><strong>Lokalizacja:</strong> ${incident.location || 'N/A'}</p>
                    `;
                    const ownerHeader = document.createElement('h4');
                    ownerHeader.textContent = 'Dane Zgłaszającego';
                    detailsContent.appendChild(ownerHeader);

                    detailsContent.innerHTML += `
                        <p><strong>Imię nazwisko:</strong> ${ownerData.full_name}</p>
                        <p><strong>Numer telefonu:</strong> ${ownerData.phone_number}</p>
                        <p><strong>Email:</strong> ${ownerData.email}</p>
                        <p><strong>Adres:</strong> ${ownerData.full_address}</p>
                    `;

                    const staff = await getIncidentStaff(incident.id);
                    const staffHeader = document.createElement('h4');
                    staffHeader.textContent = 'Załoga incydentu';
                    detailsContent.appendChild(staffHeader);

                    if (staff.message.length === 0 || staff.message === "Incident staff not found") {
                        const memberInfo = document.createElement('p');
                        memberInfo.textContent += "Brak przypisanej załogi";
                        detailsContent.appendChild(memberInfo);
                    } else {
                        // Tabela wyświetlająca załogę incydentu
                        const staffTable = document.createElement('table');
                        staffTable.classList.add('table', 'table-striped');
                        const staffThead = document.createElement('thead');
                        const staffHeaderRow = document.createElement('tr');
                        ['Imię i nazwisko', 'Specjalizacja'].forEach(columnName => {
                            const th = document.createElement('th');
                            th.textContent = columnName;
                            staffHeaderRow.appendChild(th);
                        });
                        staffThead.appendChild(staffHeaderRow);
                        const staffTbody = document.createElement('tbody');
                        staff.message.forEach(member => {
                            const memberRow = document.createElement('tr');
                            const nameCell = document.createElement('td');
                            nameCell.textContent = member.full_name;
                            const specialtyCell = document.createElement('td');
                            specialtyCell.textContent = member.specialties;
                            memberRow.appendChild(nameCell);
                            memberRow.appendChild(specialtyCell);
                            staffTbody.appendChild(memberRow);
                        });
                        staffTable.appendChild(staffThead);
                        staffTable.appendChild(staffTbody);
                        detailsContent.appendChild(staffTable);
                    }
                    const changeStateButton = document.createElement('button');
                    changeStateButton.classList.add('btn', 'btn-primary');
                    changeStateButton.textContent = 'Zmiana Stanu';
                    changeStateButton.addEventListener('click', function () {
                        hideStateChangeForm(incident.id, state)
                    });
                    detailsContent.appendChild(changeStateButton);

                    const addLogButton = document.createElement('button');
                    addLogButton.classList.add('btn', 'btn-success');
                    addLogButton.textContent = 'Dodanie Zalogi';
                    addLogButton.addEventListener('click', function () {
                        hideAssignForm(incident.id, servicemanData);
                    });
                    detailsContent.appendChild(addLogButton);
                } else {
                    detailsContent.textContent = "Owner data not found";
                }
            } else {
                const detailsHeader = document.createElement('h4');
                detailsHeader.textContent = 'Szczegóły zgłoszenia';
                detailsContent.appendChild(detailsHeader);

                detailsContent.innerHTML += `
                    <p><strong>Opis:</strong> ${incident.description || 'N/A'}</p>
                    <p><strong>Lokalizacja:</strong> ${incident.location || 'N/A'}</p>
                `;

                const staff = await getIncidentStaff(incident.id);
                const staffHeader = document.createElement('h4');
                staffHeader.textContent = 'Załoga incydentu';
                detailsContent.appendChild(staffHeader);

                if (staff.message.length === 0 || staff.message === "Incident staff not found") {
                    const memberInfo = document.createElement('p');
                    memberInfo.textContent += "Brak przypisanej załogi";
                    detailsContent.appendChild(memberInfo);
                } else {
                    // Tabela wyświetlająca załogę incydentu
                    const staffTable = document.createElement('table');
                    staffTable.classList.add('table', 'table-striped');
                    const staffThead = document.createElement('thead');
                    const staffHeaderRow = document.createElement('tr');
                    ['Imię i nazwisko', 'Specjalizacja'].forEach(columnName => {
                        const th = document.createElement('th');
                        th.textContent = columnName;
                        staffHeaderRow.appendChild(th);
                    });
                    staffThead.appendChild(staffHeaderRow);
                    const staffTbody = document.createElement('tbody');
                    staff.message.forEach(member => {
                        const memberRow = document.createElement('tr');
                        const nameCell = document.createElement('td');
                        nameCell.textContent = member.full_name;
                        const specialtyCell = document.createElement('td');
                        specialtyCell.textContent = member.specialties;
                        memberRow.appendChild(nameCell);
                        memberRow.appendChild(specialtyCell);
                        staffTbody.appendChild(memberRow);
                    });
                    staffTable.appendChild(staffThead);
                    staffTable.appendChild(staffTbody);
                    detailsContent.appendChild(staffTable);
                }
            }
            detailsCellContent.appendChild(detailsContent);
            detailsRow.appendChild(detailsCellContent);
            tbody.appendChild(detailsRow);
        }

        table.appendChild(thead);
        table.appendChild(tbody);
        tableWrapper.appendChild(table);

        const contentElement = document.getElementById('content');
        contentElement.appendChild(tableWrapper);
    }
}
function toggleDetails(incidentId) {
    const detailsRow = document.querySelector(`.details-${incidentId}`);
    detailsRow.classList.toggle('hidden');
    detailsRow.scrollIntoView({ behavior: 'smooth' });
}
function padZero(num) {
    return num < 10 ? '0' + num : num;
}
function generateNewIncidentForm(categories) {
    hideApiResponse("apiInfoResponse");

    var contentContainer = document.getElementById("content");

    var dataForm = document.createElement("div");
    dataForm.classList.add("content-container");
    dataForm.id = "dataForm";

    var header = document.createElement("h2");
    header.textContent = "Formularz zgłaszania usterki";
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

    var labelCategory = document.createElement("label");
    labelCategory.textContent = "Kategoria:";
    labelCategory.style.display = "block";
    labelCategory.style.marginTop = "15px";

    var selectCategory = document.createElement("select");
    selectCategory.setAttribute("id", "dataCategory");
    selectCategory.style.width = "100%";
    selectCategory.style.marginBottom = "15px";
    selectCategory.style.borderRadius = "5px";
    selectCategory.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.1)";

    categories.forEach(function(category) {
        var option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        selectCategory.appendChild(option);
    });

    var labelLocation = document.createElement("label");
    labelLocation.setAttribute("for", "dataLocation");
    labelLocation.textContent = "Lokalizacja:";

    var inputLocation = document.createElement("input");
    inputLocation.setAttribute("type", "text");
    inputLocation.setAttribute("id", "dataLocation");
    inputLocation.setAttribute("placeholder", "Lokalizacja");
    inputLocation.style.width = "100%";
    inputLocation.style.marginBottom = "15px";
    inputLocation.style.borderRadius = "5px";
    inputLocation.style.boxShadow = "0 0 5px rgba(0, 0, 0, 0.1)";

    var submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.textContent = "Wyślij zgłoszenie";
    submitButton.onclick = function() {
        validateIncidentForm();
    };

    form.appendChild(labelTitle);
    form.appendChild(inputTitle);
    form.appendChild(labelDescription);
    form.appendChild(inputDescription);
    form.appendChild(labelCategory);
    form.appendChild(selectCategory);
    form.appendChild(labelLocation);
    form.appendChild(inputLocation);
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
function validateIncidentForm() {
    var title = document.getElementById("dataTitle").value.trim();
    var description = document.getElementById("dataDescription").value.trim();
    var location = document.getElementById("dataLocation").value.trim();
    var category = document.getElementById("dataCategory").value.trim();
    const userId = localStorage.getItem('id');

    if (title === "" || location === "" || description === "") {
        printApiResponse("apiInfoResponse", 'Uzupełnij wszystkie pola', "levelWarning");
        return;
    }
    var dataToSend = {
        category_id: category,
        title: title,
        description: description,
        location: location,
        owner_id: userId
    }
    sendIncidentToApi(dataToSend)
}
async function sendIncidentToApi(dataToSend){
    try {
        const response = await fetch(apiBaseUrl+"/incident", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
            printApiResponse("apiInfoResponse","Pomyślnie dodano zgłoszenie.","levelSucces")
            displayIncidentSystem();
        } else {
          printApiResponse("apiInfoResponse",responseData.message,"levelWarning")
          console.error('Błąd podczas dodawania zgłoszenia: ', responseData.message);
        }
      } catch (error) {
          printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
          console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
      }
}
async function getIncidentForUser(userId){
    try {
        const response = await fetch(apiBaseUrl+'/incident_for_user/'+userId, {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData;
        } else {
            throw new Error("Brak danych o incydentach w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania incydentów: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania incydentów:', error.message);
        throw error;
    }
}
async function getIncidentStaff(incidentId){
    try {
        const response = await fetch(apiBaseUrl+'/incident_staff/'+incidentId, {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData;
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania zalogi: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania załogi:', error.message);
        throw error;
    }
}
async function getAllIncident(){
    try {
        const response = await fetch(apiBaseUrl+'/all_incidents', {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData;
        } else {
            throw new Error("Brak danych o incydentach w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania incydentów: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania incydentów:', error.message);
        throw error;
    }
}
async function getAssignStaff(incidentId,servicemanId){
    try {
        const response = await fetch(apiBaseUrl+'/assign_serviceman/'+incidentId+'/'+servicemanId, {
            method: 'POST'
        });
        const responseData = await response.json();
        printApiResponse("apiInfoResponse", 'Dodano zaloge do incydentu', "levelSucces");
        displayIncidentSystem();
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas dodawania załogi: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas dodawania załogi:', error.message);
        throw error;
    }
}
function displayAssignServicemanForm(serviceRequestId, servicemenList) {
    try {
        var container = document.getElementById("content");

        var inputForm = document.createElement("div");
        inputForm.classList.add("content-container");
        inputForm.id = "AssignForm";

        var form = document.createElement("form");
        form.classList.add("row", "g-2");

        var requestIdInputFormGroup = document.createElement("div");
        requestIdInputFormGroup.classList.add("col-md-6");
        var requestIdInputLabel = document.createElement("label");
        requestIdInputLabel.classList.add("form-label");
        requestIdInputLabel.setAttribute("for", "serviceRequestId");
        requestIdInputLabel.textContent = "ID zgłoszenia:";
        var requestIdInput = document.createElement("input");
        requestIdInput.classList.add("form-control");
        requestIdInput.setAttribute("type", "text");
        requestIdInput.setAttribute("id", "serviceRequestId");
        requestIdInput.setAttribute("value", serviceRequestId);
        requestIdInput.disabled = true;
        requestIdInputFormGroup.appendChild(requestIdInputLabel);
        requestIdInputFormGroup.appendChild(requestIdInput);

        var servicemanSelectFormGroup = document.createElement("div");
        servicemanSelectFormGroup.classList.add("col-md-6");
        var servicemanSelectLabel = document.createElement("label");
        servicemanSelectLabel.classList.add("form-label");
        servicemanSelectLabel.setAttribute("for", "servicemanSelect");
        servicemanSelectLabel.textContent = "Wybierz serwisanta:";
        var servicemanSelect = document.createElement("select");
        servicemanSelect.classList.add("form-select");
        servicemanSelect.setAttribute("id", "servicemanSelect");

        servicemenList.forEach(function(serviceman) {
            var option = document.createElement("option");
            option.value = serviceman.id;
            option.textContent = serviceman.full_name;
            servicemanSelect.appendChild(option);
        });

        servicemanSelectFormGroup.appendChild(servicemanSelectLabel);
        servicemanSelectFormGroup.appendChild(servicemanSelect);

        var submitButton = document.createElement("button");
        submitButton.classList.add("btn", "btn-primary", "buttonDecoration");
        submitButton.setAttribute("type", "button");
        submitButton.textContent = "Dodaj";
        submitButton.onclick = function() {
            getAssignStaff(serviceRequestId,servicemanSelect.value)
        };
        submitButton.style.marginTop = "1.5rem";
        submitButton.style.width = "100%";

        var header = document.createElement("h2");
        header.textContent = "Formularz dodania serwisanta do zgłoszenia";
        header.classList.add("MenuHeader");

        form.appendChild(requestIdInputFormGroup);
        form.appendChild(servicemanSelectFormGroup);
        form.appendChild(submitButton);

        inputForm.appendChild(header);

        var removeButton = document.createElement("button");
        removeButton.setAttribute("type", "button");
        removeButton.textContent = "Zamknij formularz";
        removeButton.onclick = function() {
            AssignForm.remove();
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
function displayStateChangeForm(serviceRequestId, state) {
    try {
        var container = document.getElementById("content");

        var inputForm = document.createElement("div");
        inputForm.classList.add("content-container");
        inputForm.id = "stateForm";

        var form = document.createElement("form");
        form.classList.add("row", "g-2");

        var requestIdInputFormGroup = document.createElement("div");
        requestIdInputFormGroup.classList.add("col-md-6");
        var requestIdInputLabel = document.createElement("label");
        requestIdInputLabel.classList.add("form-label");
        requestIdInputLabel.setAttribute("for", "serviceRequestId");
        requestIdInputLabel.textContent = "ID zgłoszenia:";
        var requestIdInput = document.createElement("input");
        requestIdInput.classList.add("form-control");
        requestIdInput.setAttribute("type", "text");
        requestIdInput.setAttribute("id", "serviceRequestId");
        requestIdInput.setAttribute("value", serviceRequestId);
        requestIdInput.disabled = true;
        requestIdInputFormGroup.appendChild(requestIdInputLabel);
        requestIdInputFormGroup.appendChild(requestIdInput);

        var servicemanSelectFormGroup = document.createElement("div");
        servicemanSelectFormGroup.classList.add("col-md-6");
        var servicemanSelectLabel = document.createElement("label");
        servicemanSelectLabel.classList.add("form-label");
        servicemanSelectLabel.setAttribute("for", "servicemanSelect");
        servicemanSelectLabel.textContent = "Wybierz serwisanta:";
        var servicemanSelect = document.createElement("select");
        servicemanSelect.classList.add("form-select");
        servicemanSelect.setAttribute("id", "servicemanSelect");

        state.forEach(function(state) {
            var option = document.createElement("option");
            option.value = state.id;
            option.textContent = state.name;
            servicemanSelect.appendChild(option);
        });

        servicemanSelectFormGroup.appendChild(servicemanSelectLabel);
        servicemanSelectFormGroup.appendChild(servicemanSelect);

        var submitButton = document.createElement("button");
        submitButton.classList.add("btn", "btn-primary", "buttonDecoration");
        submitButton.setAttribute("type", "button");
        submitButton.textContent = "Dodaj";
        submitButton.onclick = function() {
            var dataToSend = {
                id: serviceRequestId,
                state: servicemanSelect.value
            }
            sendChangeStateToApi(dataToSend)
        };
        submitButton.style.marginTop = "1.5rem";
        submitButton.style.width = "100%";

        var header = document.createElement("h2");
        header.textContent = "Formularz zmiany stanu zgłoszenia";
        header.classList.add("MenuHeader");

        form.appendChild(requestIdInputFormGroup);
        form.appendChild(servicemanSelectFormGroup);
        form.appendChild(submitButton);

        inputForm.appendChild(header);

        var removeButton = document.createElement("button");
        removeButton.setAttribute("type", "button");
        removeButton.textContent = "Zamknij formularz";
        removeButton.onclick = function() {
            stateForm.remove();
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
async function sendChangeStateToApi(dataToSend){
    try {
        const response = await fetch(apiBaseUrl+"/incident", {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
            printApiResponse("apiInfoResponse","Pomyślnie dodano zgłoszenie.","levelSucces")
            displayIncidentSystem();
        } else {
          printApiResponse("apiInfoResponse",responseData.message,"levelWarning")
          console.error('Błąd podczas dodawania zgłoszenia: ', responseData.message);
        }
      } catch (error) {
          printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
          console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
      }
}
async function countElementsWithStateOne() {
    var data = await getAllIncident();
    const elementsWithStateOne = data.message.filter(item => item.state === 1);
    const count = elementsWithStateOne.length;
    const resultElement = document.createElement('div');
    if(count>0){
        resultElement.innerText = `Masz zgłoszenia do obsłużenia`;
        resultElement.style.textAlign = 'center';
        resultElement.style.color = 'red';
        resultElement.style.fontSize = '24px';
    }
    else{
        resultElement.innerText = `Nie masz żadnych zgłoszeń do obsłużenia`;
        resultElement.style.textAlign = 'center';
        resultElement.style.color = 'black';
        resultElement.style.fontSize = '24px';
    }
    const contentElement = document.getElementById('content');
    contentElement.appendChild(resultElement);
}