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
        var headers = ["ID", "Nazwa budynku", "Miasto", "Ulica", "Nr. budynku", "Kod pocztowy", "Liczba pięter","",""];
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
            buildingRow.innerHTML = `
                <td>${building.id}</td>
                <td>${building.building_name}</td>
                <td>${building.city}</td>
                <td>${building.street}</td>
                <td>${building.building_number}</td>
                <td>${building.postal_code}</td>
                <td>${building.floors_amount}</td>
                <td><button class = "btn btn-light buttonDecoration" onclick="hideSpacesForm(${building.id})">Dodaj przestrzeń</button></td>
                <td><button class = "btn btn-light buttonDecoration" onclick="deleteBuildingById(${building.id})">Usuń</button></td>
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

        console.log(state)
        if(state==true){
            console.log(building_id);
            const response = await fetch(apiBaseUrl+'/building/'+building_id, {
              method: 'DELETE'
            });
            const responseData = await response.json();
            printApiResponse("apiInfoResponse", 'Usunięto budynek o id: ' + building_id, "levelSucces");
            generateBuildingPanel();
            console.log(responseData.message);
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
    console.log(buildingData);
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
          console.log('Budynek dodano pomyślnie:', responseData.message);
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
function generateNewSpaceForm(buildingId) {
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
  
    var inputSpaceType = document.createElement("input");
    inputSpaceType.setAttribute("type", "number");
    inputSpaceType.setAttribute("id", "createSpaceType");
    inputSpaceType.setAttribute("placeholder", "Typ przestrzeni");
    form.appendChild(inputSpaceType);
  
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
    console.log(spaceData)
    addSpace(spaceData);

    return true;
}
async function addSpace(spaceData){
    console.log(spaceData);
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
          console.log('Przestrzeń dodano pomyślnie:', responseData.message);
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