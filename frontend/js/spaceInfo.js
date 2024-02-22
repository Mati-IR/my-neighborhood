async function spaceInfoDisplay(){
    var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';

    const isAdmin = localStorage.getItem('admin');
    const userId = localStorage.getItem('id');

    headerTextChange("Twoje mieszkanie");
    const spaceInfo = await getSpaceForOwenr(userId);
    const spaceCategories = await getSpaceCategories();
    const buildinginfo = await getAllBuildings();
    var spaceNumber=1
    if(spaceInfo.message != "No spaces found for owner"){
        for (const item of spaceInfo.message) {
            var header = document.createElement("h2");
            header.textContent = "Mieszkanie nr "+spaceNumber;
            header.classList.add("MenuHeader");
            contentContainer.appendChild(header)
            var spacedata = await getSpaceById(item);
            var occupantdata = await getOccupantById(item)
            await displaySpaceData(item,spacedata.message,spaceCategories,buildinginfo,occupantdata)
            spaceNumber+=1
        }
    }
    else{
        var header = document.createElement("h2");
            header.textContent = "Nie posiadasz żadnych mieszkań";
            header.classList.add("MenuHeader");
            contentContainer.appendChild(header)
    }
}
async function getSpaceForOwenr(owner_id){
    try {
        const response = await fetch(apiBaseUrl+'/spaces_of_owner/'+owner_id, {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData;
        } else {
            throw new Error("Brak danych o mieszkaniach w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania mieszkań: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania mieszkań:', error.message);
        throw error;
    }
}
async function getSpaceById(space_id){
    try {
        const response = await fetch(apiBaseUrl+'/get_space_by_id/'+space_id, {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData;
        } else {
            throw new Error("Brak danych o mieszkaniach w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania mieszkań: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania mieszkań:', error.message);
        throw error;
    }
}
async function getBuildingById(building_id){
    try {
        const response = await fetch(apiBaseUrl+'/building/'+building_id, {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData;
        } else {
            throw new Error("Brak danych o budynku w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania budynku: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania budynku:', error.message);
        throw error;
    }
}
async function displaySpaceData(item,spaceData, categories, buildings, occupantsData) {
    var contentContainer = document.getElementById("content");

    var div = document.createElement("div");
    var spaceType = categories.message.find(category => category.id === spaceData.space_type)?.name || "Nieznany";

    const buildingInfo = buildings.buildings.find(building => building.id === spaceData.building_id);
    const buildingAddress = `${buildingInfo.building_name}, ${buildingInfo.street} ${buildingInfo.building_number}, ${buildingInfo.postal_code} ${buildingInfo.city}`;

    var spaceDataHtml = `
        <table class="table">
            <tbody>
                <tr>
                    <th scope="row">Budynek:</th>
                    <td>${buildingAddress}</td>
                </tr>
                <tr>
                    <th scope="row">Piętro:</th>
                    <td>${spaceData.floor}</td>
                </tr>
                <tr>
                    <th scope="row">Numer przestrzeni:</th>
                    <td>${spaceData.space_number}</td>
                </tr>
                <tr>
                    <th scope="row">Powierzchnia:</th>
                    <td>${spaceData.area}</td>
                </tr>
                <tr>
                    <th scope="row">Typ przestrzeni:</th>
                    <td>${spaceType}</td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align:center;">
                        <button type="button" onclick='hideOcupantForm(${item})'>Dodaj mieszkańca</button>
                    </td>
                </tr>
            </tbody>
        </table>
    `;

    if (occupantsData.message === "No occupants found for space") {
        spaceDataHtml += `<p>Brak mieszkańców dla tej przestrzeni.</p>`;
    } else {
        spaceDataHtml += `
            <p>Mieszkańcy:</p>
            <ul>
        `;

        occupantsData.message.forEach(occupant => {
            spaceDataHtml += `
                <li>${occupant.name} ${occupant.surname}</li>
            `;
        });

        spaceDataHtml += `</ul>`;
    }

    div.innerHTML = spaceDataHtml;
    contentContainer.appendChild(div);
}
function hideOcupantForm(space_id){
    var inputForm= document.getElementById("inputForm");
    if(inputForm != null){
        inputForm.remove();
    }else{
        displayOccupantForm(space_id);
    }
}
async function getOccupantById(space_id){
    try {
        const response = await fetch(apiBaseUrl+'/occupant_for_space/'+space_id, {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData;
        } else {
            throw new Error("Brak danych o lokatorach w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania lokatorów: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania lokatorów:', error.message);
        throw error;
    }
}
function displayOccupantForm(space_id) {
    try {
        var container = document.getElementById("content");

        var inputForm = document.createElement("div");
        inputForm.classList.add("content-container");
        inputForm.id = "inputForm";

        var form = document.createElement("form");
        form.classList.add("row", "g-2");

        var nameFormGroup = document.createElement("div");
        nameFormGroup.classList.add("col-md-6");
        var nameLabel = document.createElement("label");
        nameLabel.classList.add("form-label");
        nameLabel.setAttribute("for", "newName");
        nameLabel.textContent = "Imię:";
        var nameInput = document.createElement("input");
        nameInput.classList.add("form-control");
        nameInput.setAttribute("type", "text");
        nameInput.setAttribute("id", "newName");
        nameInput.setAttribute("placeholder", "Wprowadź imię");
        nameFormGroup.appendChild(nameLabel);
        nameFormGroup.appendChild(nameInput);

        var surnameFormGroup = document.createElement("div");
        surnameFormGroup.classList.add("col-md-6");
        var surnameLabel = document.createElement("label");
        surnameLabel.classList.add("form-label");
        surnameLabel.setAttribute("for", "newSurname");
        surnameLabel.textContent = "Nazwisko:";
        var surnameInput = document.createElement("input");
        surnameInput.classList.add("form-control");
        surnameInput.setAttribute("type", "text");
        surnameInput.setAttribute("id", "newSurname");
        surnameInput.setAttribute("placeholder", "Wprowadź nazwisko");
        surnameFormGroup.appendChild(surnameLabel);
        surnameFormGroup.appendChild(surnameInput);

        var submitButton = document.createElement("button");
        submitButton.classList.add("btn", "btn-primary", "buttonDecoration");
        submitButton.setAttribute("type", "button");
        submitButton.textContent = "Dodaj";
        submitButton.onclick = function() {
            if (validateForm()) {
                var dataToSend = {
                    name: nameInput.value,
                    surname: surnameInput.value,
                    space_id: space_id
                }
                addOccupantToSpace(dataToSend);
            } else {
                printApiResponse("apiInfoResponse", 'Wypełnij wszystkie pola', "levelWarning");
            }
        };
        submitButton.style.marginTop = "1.5rem";
        submitButton.style.width = "100%";

        var header = document.createElement("h2");
        header.textContent = "Formularz dodania mieszkańca";
        header.classList.add("MenuHeader");

        form.appendChild(nameFormGroup);
        form.appendChild(surnameFormGroup);
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
        function validateForm() {
            if (nameInput.value.trim() === "" || surnameInput.value.trim() === "") {
                return false;
            }
            return true;
        }
    } catch (error) {
        console.error('Wystąpił błąd podczas wyświetlania formularza:', error.message);
    }
}
async function addOccupantToSpace(dataToSend){
    try {
        const response = await fetch(apiBaseUrl+'/assign_occupant_to_space', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
          printApiResponse("apiInfoResponse","Mieszkaniec został dodany pomyślnie.","levelSucces")
          spaceInfoDisplay();
        } else {
          printApiResponse("apiInfoResponse",('Błąd podczas dodawania mieszkańca: '+ responseData.message),"levelWarning")
          console.error('Błąd podczas dodawania mieszkańca: ', responseData.message);
        }
      } catch (error) {
          printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
          console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
      }
}
