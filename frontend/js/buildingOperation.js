function generateNewBuildingForm() {
    hideApiResponse("apiInfoResponse");

    var contentContainer = document.getElementById("content");
  
    var buildingForm = document.createElement("div");
    buildingForm.classList.add("content-container");
    buildingForm.id = "buildingForm";
    
    var header = document.createElement("h2");
    header.textContent = "Formularz budynku";
    header.classList.add("MenuHeader");
    buildingForm.appendChild(header);

    var form = document.createElement("form");
  
    var labelBuildingName = document.createElement("label");
    labelBuildingName.setAttribute("for", "createBuildingName");
    labelBuildingName.textContent = "Nazwa budynku:";
    form.appendChild(labelBuildingName);
  
    var inputBuildingName = document.createElement("input");
    inputBuildingName.setAttribute("type", "text");
    inputBuildingName.setAttribute("id", "createBuildingName");
    inputBuildingName.setAttribute("placeholder", "Nazwa budynku");
    form.appendChild(inputBuildingName);
  
    var labelCity = document.createElement("label");
    labelCity.setAttribute("for", "createCity");
    labelCity.textContent = "Miasto:";
    form.appendChild(labelCity);
  
    var inputCity = document.createElement("input");
    inputCity.setAttribute("type", "text");
    inputCity.setAttribute("id", "createCity");
    inputCity.setAttribute("placeholder", "Miasto");
    form.appendChild(inputCity);
  
    var labelStreet = document.createElement("label");
    labelStreet.setAttribute("for", "createStreet");
    labelStreet.textContent = "Ulica:";
    form.appendChild(labelStreet);
  
    var inputStreet = document.createElement("input");
    inputStreet.setAttribute("type", "text");
    inputStreet.setAttribute("id", "createStreet");
    inputStreet.setAttribute("placeholder", "Ulica");
    form.appendChild(inputStreet);
  
    var labelBuildingNumber = document.createElement("label");
    labelBuildingNumber.setAttribute("for", "createBuildingNumber");
    labelBuildingNumber.textContent = "Nr. budynku:";
    form.appendChild(labelBuildingNumber);
  
    var inputBuildingNumber = document.createElement("input");
    inputBuildingNumber.setAttribute("type", "text");
    inputBuildingNumber.setAttribute("id", "createBuildingNumber");
    inputBuildingNumber.setAttribute("placeholder", "Nr. budynku");
    form.appendChild(inputBuildingNumber);
  
    var labelPostalCode = document.createElement("label");
    labelPostalCode.setAttribute("for", "createPostalCode");
    labelPostalCode.textContent = "Kod pocztowy:";
    form.appendChild(labelPostalCode);
  
    var inputPostalCode = document.createElement("input");
    inputPostalCode.setAttribute("type", "text");
    inputPostalCode.setAttribute("id", "createPostalCode");
    inputPostalCode.setAttribute("placeholder", "Kod pocztowy");
    form.appendChild(inputPostalCode);
  
    var labelFloorsAmount = document.createElement("label");
    labelFloorsAmount.setAttribute("for", "createFloorsAmount");
    labelFloorsAmount.textContent = "Liczba pięter:";
    form.appendChild(labelFloorsAmount);
  
    var inputFloorsAmount = document.createElement("input");
    inputFloorsAmount.setAttribute("type", "number");
    inputFloorsAmount.setAttribute("id", "createFloorsAmount");
    inputFloorsAmount.setAttribute("placeholder", "Liczba pięter");
    form.appendChild(inputFloorsAmount);
    
    var submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.textContent = "Dodaj";
    submitButton.onclick = validateBuildingForm;
    form.appendChild(submitButton);

    var removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.textContent = "Zamknij formularz";
    removeButton.onclick = function() {
        buildingForm.remove();
    };
    removeButton.style.backgroundColor = "#cf4a4a";
    removeButton.style.color = "black";
    form.appendChild(removeButton);
  
    buildingForm.appendChild(form);
    contentContainer.appendChild(buildingForm);
    buildingForm.scrollIntoView({ behavior: 'smooth' });
}
async function getAllBuildings() {
    try {
        const response = await fetch(apiBaseUrl+'/all_buildings', {
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
async function displayBuildings() {
    try {
        const buildingsData = await getAllBuildings(); // Oczekiwanie na dane budynków
        var contentContainer = document.getElementById("content");

        var table = document.createElement("table");
        table.classList.add("building-table");

        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");

        // Tworzenie nagłówków tabeli
        var headers = ["ID", "Nazwa budynku", "Miasto", "Ulica", "Nr. budynku", "Kod pocztowy", "Liczba pięter", "Dodaj", "Usuń", "Pokaż"];
        var headerRow = document.createElement("tr");
        headers.forEach(function(headerText) {
            var headerCell = document.createElement("th");
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Wypełnianie danych tabeli
        buildingsData.buildings.forEach(function(building) {
            var buildingRow = document.createElement("tr");
            buildingRow.dataset.buildingId = building.id;
            buildingRow.classList.add("building-row");

            buildingRow.innerHTML = `
                <td>${building.id}</td>
                <td>${building.building_name}</td>
                <td>${building.city}</td>
                <td>${building.street}</td>
                <td>${building.building_number}</td>
                <td>${building.postal_code}</td>
                <td>${building.floors_amount}</td>
                <td><button class="btn btn-light buttonDecoration" onclick="hideSpacesForm(${building.id})"><i class="bi bi-plus-circle"></i></button></td>
                <td><button class="btn btn-light buttonDecoration" onclick="deleteBuildingById(${building.id})"><i class="bi bi-trash-fill" style="color:#cf4a4a"></i></button></td>
                <td><button class="btn btn-light buttonDecoration" onclick="hideBuildingDetails(${building.id})"><i class="bi bi-caret-down-fill"></i></button></td>
            `;

            tbody.appendChild(buildingRow);
        });

        table.appendChild(tbody);
        contentContainer.appendChild(table);
    } catch (error) {
        console.error('Wystąpił błąd podczas wyświetlania budynków:', error.message);
    }
}
async function deleteBuildingById(building_id){
    try {
        printApiResponse("apiInfoResponse", " ","levelACHTUNG");
        var statePromise = new Promise((resolve, reject) => {
            var apiInfoResponse = document.getElementById("apiInfoResponse");
            apiInfoResponse.classList.add("apiInfoResponse");
            apiInfoResponse.classList.add("levelACHTUNG");
            apiInfoResponse.textContent = 'Czy napewno chcesz usunąć budynek?';
            
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
            const response = await fetch(apiBaseUrl+'/building/'+building_id, {
              method: 'DELETE'
            });
            const responseData = await response.json();
            printApiResponse("apiInfoResponse", 'Usunięto budynek o id: ' + building_id, "levelSucces");
            generateBuildingPanel();
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas wysyłania żądania: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
        throw error;
    }
}
function generateBuildingPanel(){
    var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';
    headerTextChange("Panel zarządzania budynkami")

    displayBuildings();

    var addButton = document.createElement("button");
    addButton.textContent = "Dodaj nowy budynek";
    addButton.className = "btn btn-light buttonDecoration";
    addButton.onclick = hideBuildingForm;

    contentContainer.appendChild(addButton);
}
function hideBuildingForm(){
    var buildingForm = document.getElementById("buildingForm");
    if(buildingForm != null){
        buildingForm.remove();
    }else{
        generateNewBuildingForm()
    }
}
function hideSpacesForm(building_id){
    var spacesForm = document.getElementById("spaceForm");
    if(spacesForm != null){
        spacesForm.remove();
    }else{
        generateNewSpaceForm(building_id);
    }
}
function hideBuildingDetails(building_id){
    var buildingDetailsRow = document.querySelector(`.building-details-row[data-building-details-id="${building_id}"]`);
    if(buildingDetailsRow != null){
        buildingDetailsRow.remove();
    }else{
        showBuildingDetails(building_id)
    }
}
function hideOwnerForm(spaceId){
    var ownerForm= document.getElementById("ownerForm");
    if(ownerForm != null){
        ownerForm.remove();
    }else{
        asignOwnerFormGenerate(spaceId)
    }
}
function hideOwnerDetails(spaceId){
    var ownerForm= document.getElementById("ownerForSpaceTable_"+spaceId);
    if(ownerForm != null){
        ownerForm.remove();
    }else{
        displayOwners(spaceId)
    }
}
function validateBuildingForm() {
    var buildingName = document.getElementById("createBuildingName").value;
    var city = document.getElementById("createCity").value;
    var street = document.getElementById("createStreet").value;
    var buildingNumber = document.getElementById("createBuildingNumber").value;
    var postalCode = document.getElementById("createPostalCode").value;
    var floorsAmount = document.getElementById("createFloorsAmount").value;

    // Proste sprawdzenie, czy pola nie są puste
    if (buildingName === "" || city === "" || street === "" || buildingNumber === "" || postalCode === "" || floorsAmount === "") {
        printApiResponse("apiInfoResponse","Proszę wypełnić wszystkie wymagane pola.","levelWarning")
        return false;
    }

    // Sprawdzenie, czy floorsAmount jest liczbą większą od 0
    if (isNaN(floorsAmount) || parseInt(floorsAmount) <= 0) {
        printApiResponse("apiInfoResponse","Liczba pięter musi być liczbą większą od zera!","levelWarning")
        return false;
    }

    var buildingData ={
        building_name: buildingName,
        city: city,
        street: street,
        building_number: buildingNumber,
        postal_code: postalCode,
        floors_amount: floorsAmount
    };
    addBuilding(buildingData);

    return true;
}
async function addBuilding(buildingData){
    try {
        const response = await fetch(apiBaseUrl+'/building', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(buildingData)
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
          printApiResponse("apiInfoResponse","Budynek dodano pomyślnie.","levelSucces")
          hideBuildingForm();
          generateBuildingPanel();
          
        } else {
          printApiResponse("apiInfoResponse",('Błąd podczas dodawania budynku: '+ responseData.message),"levelWarning")
          console.error('Błąd podczas dodawania budynku: ', responseData.message);
        }
      } catch (error) {
          printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
          console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
      }
}
async function generateNewSpaceForm(buildingId) {
    hideApiResponse("apiInfoResponse");

    var contentContainer = document.getElementById("content");
  
    var spaceForm = document.createElement("div");
    spaceForm.classList.add("content-container");
    spaceForm.id = "spaceForm";

    var header = document.createElement("h2");
    header.textContent = "Formularz przestrzeni";
    header.classList.add("MenuHeader");
    spaceForm.appendChild(header);
  
    var form = document.createElement("form");
  
    var labelSpaceNumber = document.createElement("label");
    labelSpaceNumber.setAttribute("for", "createSpaceNumber");
    labelSpaceNumber.textContent = "Numer przestrzeni:";
    form.appendChild(labelSpaceNumber);
  
    var inputSpaceNumber = document.createElement("input");
    inputSpaceNumber.setAttribute("type", "text");
    inputSpaceNumber.setAttribute("id", "createSpaceNumber");
    inputSpaceNumber.setAttribute("placeholder", "Numer przestrzeni");
    form.appendChild(inputSpaceNumber);
  
    var labelArea = document.createElement("label");
    labelArea.setAttribute("for", "createArea");
    labelArea.textContent = "Powierzchnia (m²):";
    form.appendChild(labelArea);
  
    var inputArea = document.createElement("input");
    inputArea.setAttribute("type", "number");
    inputArea.setAttribute("id", "createArea");
    inputArea.setAttribute("placeholder", "Powierzchnia (m²)");
    form.appendChild(inputArea);
  
    var labelSpaceType = document.createElement("label");
    labelSpaceType.setAttribute("for", "createSpaceType");
    labelSpaceType.textContent = "Typ przestrzeni:";
    form.appendChild(labelSpaceType);
  
    var selectSpaceType = document.createElement("select");
    selectSpaceType.setAttribute("id", "createSpaceType");

    // Pobierz kategorie przestrzeni
    const spaceCategories = await getSpaceCategories();

    // Utwórz opcje dla każdej kategorii przestrzeni
    spaceCategories.message.forEach(category => {
        var option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        selectSpaceType.appendChild(option);
    });

    form.appendChild(selectSpaceType);

    // Nowa linia dla pola "Piętro"
    form.appendChild(document.createElement("br"));
  
    var labelFloor = document.createElement("label");
    labelFloor.setAttribute("for", "createFloor");
    labelFloor.textContent = "Piętro:";
    form.appendChild(labelFloor);
  
    var inputFloor = document.createElement("input");
    inputFloor.setAttribute("type", "number");
    inputFloor.setAttribute("id", "createFloor");
    inputFloor.setAttribute("placeholder", "Piętro");
    form.appendChild(inputFloor);
  
    var labelBuildingId = document.createElement("label");
    labelBuildingId.setAttribute("for", "createBuildingId");
    labelBuildingId.textContent = "ID budynku:";
    form.appendChild(labelBuildingId);
  
    var inputBuildingId = document.createElement("input");
    inputBuildingId.setAttribute("type", "number");
    inputBuildingId.setAttribute("id", "createBuildingId");
    inputBuildingId.setAttribute("placeholder", "ID budynku");
    inputBuildingId.setAttribute("value", buildingId); // Ustawienie wartości ID budynku z argumentu funkcji
    inputBuildingId.setAttribute("readonly", true); // Zablokowanie możliwości zmiany wartości
    form.appendChild(inputBuildingId);
  
    var submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.textContent = "Dodaj";
    submitButton.onclick = function() {
        validateSpaceForm(buildingId);
    };
    form.appendChild(submitButton);

    var removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.textContent = "Zamknij formularz";
    removeButton.onclick = function() {
        spaceForm.remove();
    };
    removeButton.style.backgroundColor = "#cf4a4a";
    removeButton.style.color = "black";
    form.appendChild(removeButton);
  
    spaceForm.appendChild(form);
    contentContainer.appendChild(spaceForm);
    spaceForm.scrollIntoView({ behavior: 'smooth' });
}
function validateSpaceForm(buildingId) {
    var spaceNumber = document.getElementById("createSpaceNumber").value;
    var area = document.getElementById("createArea").value;
    var spaceType = document.getElementById("createSpaceType").value;
    var floor = document.getElementById("createFloor").value;
    
    // Sprawdzenie czy pola nie są puste
    if (spaceNumber === "" || area === "" || spaceType === "" || floor === "") {
        printApiResponse("apiInfoResponse","Wypełnij wszystkie pola formularza.","levelWarning");
        return false;
    }
    
    // Sprawdzenie, czy pole "Powierzchnia" jest liczbą większą od zera
    if (isNaN(area) || area <= 0) {
        printApiResponse("apiInfoResponse","Podaj poprawną wartość dla powierzchni.","levelWarning");
        return false;
    }
    
    // Sprawdzenie, czy pole "Typ przestrzeni" jest liczbą większą od zera
    if (isNaN(spaceType) || spaceType <= 0) {
        printApiResponse("apiInfoResponse","Podaj poprawny numer dla typu przestrzeni.","levelWarning");
        return false;
    }
    
    // Sprawdzenie, czy pole "Piętro" jest liczbą większą od zera
    if (isNaN(floor) || floor < 0) {
        printApiResponse("apiInfoResponse","Podaj poprawny numer dla piętra.","levelWarning");
        return false;
    }

    var spaceData ={
        space_number: spaceNumber,
        area: area,
        space_type: spaceType,
        floor: floor,
        building_id: buildingId
    };
    addSpace(spaceData);

    return true;
}
async function addSpace(spaceData){
    try {
        const response = await fetch(apiBaseUrl+'/create_space', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(spaceData)
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
          printApiResponse("apiInfoResponse","Przestrzeń dodano pomyślnie.","levelSucces")
          hideSpacesForm();
          generateBuildingPanel();
          
        } else {
          printApiResponse("apiInfoResponse",responseData.message,"levelWarning")
          console.error('Błąd podczas dodawania budynku: ', responseData.message);
        }
      } catch (error) {
          printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
          console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
      }
}
async function getBuildingsSpaces(building_id){
    try {
        const response = await fetch(apiBaseUrl+'/building_details/'+building_id, {
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
async function showBuildingDetails(buildingId) {
    addBuildingDetailsRow(buildingId);
    var buildingRow = document.querySelector(`.building-row[data-building-id="${buildingId}"]`);
    
    var detailsRow = buildingRow.nextElementSibling;
    
    var detailsContent = detailsRow.querySelector(".building-details");
    
    var buildingDetails = await getBuildingsSpaces(buildingId);
    
    var detailsTableHTML = await generateBuildingDetailsTable(buildingDetails);
    
    detailsContent.innerHTML = detailsTableHTML;
    
    detailsRow.style.display = "table-row";
}
async function generateBuildingDetailsTable(buildingDetails) {
    // Pobierz kategorie przestrzeni
    const spaceCategoriesResponse = await getSpaceCategories();
    const spaceCategories = new Map(spaceCategoriesResponse.message.map(category => [category.id, category.name]));

    // Sprawdź, czy buildingDetails jest puste
    if (!buildingDetails || Object.keys(buildingDetails).length === 0) {
        return '<p>Brak mieszkań w budynku.</p>';
    }

    let detailsHTML = '<div class="table-responsive"><table class="table table-bordered table-striped">';
    detailsHTML += '<thead><tr><th>Piętro</th><th>Numer</th><th>Metraż</th><th>Typ</th><th>Usuń</th><th>Dodaj właściciela</th><th>Pokaż</th></tr></thead>';
    detailsHTML += '<tbody>';

    buildingDetails.building_details.floors.forEach(floor => {
        floor.spaces.forEach(space => {
            const spaceTypeName = spaceCategories.get(space.space_type) || '';
            detailsHTML += `<tr><td>${floor.floor_number}</td><td>${space.space_number}</td><td>${space.area} m2</td><td>${spaceTypeName}</td>
            <td><button class="btn btn-light buttonDecoration" onclick="deleteSpaceById(${space.id})"><i class="bi bi-trash-fill" style="color:#cf4a4a"></i></button></td>
            <td><button class="btn btn-light buttonDecoration" onclick="hideOwnerForm(${space.id})"><i class="bi bi-person-fill-add"></i></button></td>
            <td><button class="btn btn-light buttonDecoration" onclick="hideOwnerDetails(${space.id})"><i class="bi bi-caret-down-fill"></i></button></td></tr>
            <tr id="ownerForSpace_`+space.id+`"></tr>`;
        });
    });

    detailsHTML += '</tbody>';
    detailsHTML += '</table></div>';

    return detailsHTML;
}
async function getSpaceCategories(){
    try {
        const response = await fetch(apiBaseUrl+'/get_space_categories', {
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
function addBuildingDetailsRow(buildingId) {
    var buildingRow = document.querySelector(`.building-row[data-building-id="${buildingId}"]`);

    if (buildingRow.nextElementSibling && buildingRow.nextElementSibling.classList.contains('building-details-row')) {
        return;
    }

    // Utwórz nowy wiersz szczegółów
    var detailsRow = document.createElement("tr");
    detailsRow.classList.add("building-details-row");
    detailsRow.setAttribute("data-building-details-id", buildingId);

    var detailsCell = document.createElement("td");
    detailsCell.setAttribute("colspan", headersBuildings.length);
    var detailsContent = document.createElement("div");
    detailsContent.classList.add("building-details");

    detailsCell.appendChild(detailsContent);
    detailsRow.appendChild(detailsCell);

    buildingRow.parentNode.insertBefore(detailsRow, buildingRow.nextSibling);
}
async function asignOwnerFormGenerate(spaceId){
    hideApiResponse("apiInfoResponse");

    var contentContainer = document.getElementById("content");

    var ownerForm = document.createElement("div");
    ownerForm.classList.add("content-container");
    ownerForm.id = "ownerForm";

    var header = document.createElement("h2");
    header.textContent = "Formularz przypisania właściciela";
    header.classList.add("MenuHeader");
    ownerForm.appendChild(header);

    var form = document.createElement("form");

    var labelSpaceId = document.createElement("label");
    labelSpaceId.setAttribute("for", "assignSpaceId");
    labelSpaceId.textContent = "ID przestrzeni:";
    form.appendChild(labelSpaceId);
    form.appendChild(document.createElement("br"));

    var inputSpaceId = document.createElement("input");
    inputSpaceId.setAttribute("type", "number");
    inputSpaceId.setAttribute("id", "assignSpaceId");
    inputSpaceId.setAttribute("value", spaceId);
    inputSpaceId.setAttribute("readonly", "readonly");
    inputSpaceId.classList.add("form-control");
    form.appendChild(inputSpaceId);
    form.appendChild(document.createElement("br"));

    var labelShare = document.createElement("label");
    labelShare.textContent = "Udział:";
    form.appendChild(labelShare);
    form.appendChild(document.createElement("br"));

    var inputShareContainer = document.createElement("div");
    inputShareContainer.classList.add("input-group");
    form.appendChild(inputShareContainer);

    var inputShare = document.createElement("input");
    inputShare.setAttribute("type", "range");
    inputShare.setAttribute("id", "assignShare");
    inputShare.classList.add("form-range", "form-range-custom");
    inputShare.setAttribute("min", "0");
    inputShare.setAttribute("max", "100");
    inputShare.setAttribute("step", "1");
    inputShare.setAttribute("value", "50");
    inputShareContainer.appendChild(inputShare);

    var shareValueContainer = document.createElement("span");
    shareValueContainer.classList.add("input-group-text")
    inputShareContainer.appendChild(shareValueContainer);

    var shareValue = document.createElement("span");
    shareValue.textContent = "50%";
    shareValueContainer.appendChild(shareValue);

    inputShare.addEventListener("input", function() {
        shareValue.textContent = this.value + "%";
    });

    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));

    var labelPurchaseDate = document.createElement("label");
    labelPurchaseDate.setAttribute("for", "assignPurchaseDate");
    labelPurchaseDate.textContent = "Data zakupu:";
    form.appendChild(labelPurchaseDate);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));

    var inputPurchaseDate = document.createElement("input");
    inputPurchaseDate.setAttribute("type", "datetime-local");
    inputPurchaseDate.setAttribute("id", "assignPurchaseDate");
    form.appendChild(inputPurchaseDate);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));

    var labelOwnerId = document.createElement("label");
    labelOwnerId.setAttribute("for", "assignOwnerId");
    labelOwnerId.textContent = "Wybierz właściciela:";
    form.appendChild(labelOwnerId);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));

    var selectOwner = document.createElement("select");
    selectOwner.setAttribute("id", "assignOwnerId");
    form.appendChild(selectOwner);
    form.appendChild(document.createElement("br"));
    form.appendChild(document.createElement("br"));
    try {
        const owners = await getAllOwners();
        owners.forEach(owner => {
            var option = document.createElement("option");
            option.value = owner.id;
            option.textContent = owner.full_name;
            selectOwner.appendChild(option);
        });
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania właścicieli: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania właścicieli:', error.message);
    }

    var submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.textContent = "Przypisz";
    submitButton.onclick = validateOwnerForm;
    form.appendChild(submitButton);

    var removeButton = document.createElement("button");
    removeButton.setAttribute("type", "button");
    removeButton.textContent = "Zamknij formularz";
    removeButton.onclick = function() {
        ownerForm.remove();
    };
    removeButton.style.backgroundColor = "#cf4a4a";
    removeButton.style.color = "black";
    form.appendChild(removeButton);

    ownerForm.appendChild(form);
    contentContainer.appendChild(ownerForm);
    ownerForm.scrollIntoView({ behavior: 'smooth' });
}
async function getAllOwners() {
    try {
        const response = await fetch(apiBaseUrl+'/get_all_owners', {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData.message;
        } else {
            throw new Error("Brak danych właścicieli w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania właścicieli: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania właścicieli:', error.message);
        throw error;
    }
}
function validateOwnerForm() {
    var spaceId = document.getElementById("assignSpaceId").value;
    var share = document.getElementById("assignShare").value;
    var purchaseDate = document.getElementById("assignPurchaseDate").value;
    var ownerId = document.getElementById("assignOwnerId").value;

    // Sprawdzenie, czy pola nie są puste
    if (!spaceId || !share || !purchaseDate || !ownerId) {
        printApiResponse("apiInfoResponse", 'Proszę wypełnić wszystkie pola formularza.', "levelWarning");
        return false;
    }
    var formattedPurchaseDate = new Date(purchaseDate);
    var year = formattedPurchaseDate.getFullYear();
    var month = String(formattedPurchaseDate.getMonth() + 1).padStart(2, '0');
    var day = String(formattedPurchaseDate.getDate()).padStart(2, '0');
    var hours = String(formattedPurchaseDate.getHours()).padStart(2, '0');
    var minutes = String(formattedPurchaseDate.getMinutes()).padStart(2, '0');
    var seconds = String(formattedPurchaseDate.getSeconds()).padStart(2, '0');
    var datetime = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds+'Z';
    var asignData ={
        space_id: spaceId,
        share: share/100,
        purchase_date: datetime,
        owner_id: ownerId
    };
    asignOwner(asignData);

    return true;
}
async function asignOwner(asignData){
    try {
        const response = await fetch(apiBaseUrl+'/assign_space_to_owner', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(asignData)
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
          printApiResponse("apiInfoResponse","Właściciel przypisany pomyślnie.","levelSucces")
          hideOwnerForm();
          generateBuildingPanel();
          
        } else {
          printApiResponse("apiInfoResponse",responseData.message,"levelWarning")
          console.error('Błąd podczas przypisywania właściciela: ', responseData.message);
        }
      } catch (error) {
          printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
          console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
      }
}
async function deleteSpaceById(space_id){
    try {
        printApiResponse("apiInfoResponse", " ","levelACHTUNG");
        var statePromise = new Promise((resolve, reject) => {
            var apiInfoResponse = document.getElementById("apiInfoResponse");
            apiInfoResponse.classList.add("apiInfoResponse");
            apiInfoResponse.classList.add("levelACHTUNG");
            apiInfoResponse.textContent = 'Czy napewno chcesz usunąć przestrzeń?';
            
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
            const response = await fetch(apiBaseUrl+'/delete_space/'+space_id, {
              method: 'DELETE'
            });
            const responseData = await response.json();
            printApiResponse("apiInfoResponse", 'Usunięto przestrzeń o id: ' + space_id, "levelSucces");
            generateBuildingPanel();
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas wysyłania żądania: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
        throw error;
    }
}
async function getOwnersOfSpace(space_id){
    try {
        const response = await fetch(apiBaseUrl+'/get_owners_of_space/'+space_id, {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData.message;
        } else {
            throw new Error("Brak danych właścicieli w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania właścicieli: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania właścicieli:', error.message);
        throw error;
    }
}
async function displayOwners(spaceId) {
    var ownerForSpace = document.getElementById("ownerForSpace_" + spaceId);
    var tableContainer = document.createElement("td");
    tableContainer.colSpan = 7;
    tableContainer.id = "ownerForSpaceTable_"+spaceId

    var innerTable = document.createElement("table");
    innerTable.classList.add("table", "table-bordered", "table-striped");

    var innerThead = document.createElement("thead");
    var innerHeaderRow = document.createElement("tr");
    var headers = ["ID", "Imię nazwisko", "Numer telefonu", "Adres","Udział","Data zakupu","Usuń"]; // Możesz dostosować nagłówki do potrzeb
    headers.forEach(function(headerText) {
        var th = document.createElement("th");
        th.textContent = headerText;
        innerHeaderRow.appendChild(th);
    });
    innerThead.appendChild(innerHeaderRow);
    innerTable.appendChild(innerThead);

    var innerTbody = document.createElement("tbody");

    var ownersData = await getOwnersOfSpace(spaceId)
    if(typeof ownersData === "string"){
        var row = document.createElement("tr");
        var noDataCell = document.createElement("td");
            noDataCell.textContent = "Brak danych o właścicielach";
            row.appendChild(noDataCell);
            innerTbody.appendChild(row);
    }
    else{
        var leftShare = 1;
        ownersData.forEach(function(owner) {
            var row = document.createElement("tr");

            var ownerIdCell = document.createElement("td");
            ownerIdCell.textContent = owner.id;
            row.appendChild(ownerIdCell);

            var fullNameCell = document.createElement("td");
            fullNameCell.textContent = owner.full_name;
            row.appendChild(fullNameCell);

            var phoneNumberCell = document.createElement("td");
            phoneNumberCell.textContent = owner.phone_number;
            row.appendChild(phoneNumberCell);

            var fullAddressCell = document.createElement("td");
            fullAddressCell.textContent = owner.full_address;
            row.appendChild(fullAddressCell);

            var shareCell = document.createElement("td");
            shareCell.textContent = owner.share*100+" %";
            leftShare = leftShare - owner.share;
            row.appendChild(shareCell);

            var purchaseDateCell = document.createElement("td");
            // Konwertuj datę na czytelny format
            var purchaseDate = new Date(owner.purchase_date);
            purchaseDateCell.textContent = purchaseDate.toLocaleString();
            row.appendChild(purchaseDateCell);

            var dataForRemove = {
                space_id : spaceId,
                owner_id : owner.id
            };
            var jsonDataForRemove = JSON.stringify(dataForRemove);
            var button = document.createElement("button");
                button.classList.add("btn", "btn-light", "buttonDecoration");
                button.setAttribute("onclick", `deleteUserFromSpace('${jsonDataForRemove}')`);
                var icon = document.createElement("i");
                icon.classList.add("bi", "bi-person-fill-dash");
                icon.style.color = "#cf4a4a";
                button.appendChild(icon);
                var cell = document.createElement("td");
                cell.appendChild(button);
                row.appendChild(cell)
            innerTbody.appendChild(row);
        });
        var row2 = document.createElement("tr");
        var empty1Cell = document.createElement("td");
        empty1Cell.textContent = " ";
        var empty2Cell = document.createElement("td");
        empty2Cell.textContent = " ";
        var empty3Cell = document.createElement("td");
        empty3Cell.textContent = " ";

        row2.appendChild(empty1Cell);
        row2.appendChild(empty2Cell);
        row2.appendChild(empty3Cell);
        var textCell = document.createElement("td");
        textCell.textContent = "Pozostałe udziały";
        var leftShareCell = document.createElement("td");
        leftShareCell.textContent = leftShare*100+" %";

        row2.appendChild(textCell);
        row2.appendChild(leftShareCell);
        innerTbody.appendChild(row2);
    }
    innerTable.appendChild(innerTbody);

    ownerForSpace.innerHTML = "";
    tableContainer.appendChild(innerTable)
    ownerForSpace.appendChild(tableContainer);
}
async function deleteUserFromSpace(dataForRemove){
    try {
        printApiResponse("apiInfoResponse", " ","levelACHTUNG");
        var statePromise = new Promise((resolve, reject) => {
            var apiInfoResponse = document.getElementById("apiInfoResponse");
            apiInfoResponse.classList.add("apiInfoResponse");
            apiInfoResponse.classList.add("levelACHTUNG");
            apiInfoResponse.textContent = 'Czy napewno chcesz usunąć właściciela?';
            
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
            const response = await fetch(apiBaseUrl+'/remove_owner_from_space', {
                method: 'DELETE',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataForRemove)
              });
            printApiResponse("apiInfoResponse", 'NASTĄPIŁA EKSMISJA', "levelSucces");
            generateBuildingPanel();
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas wysyłania żądania: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
        throw error;
    }
}







