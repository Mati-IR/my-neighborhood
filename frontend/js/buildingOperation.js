function generateNewBuildingForm() {
    hideApiResponse("apiInfoResponse");

    var contentContainer = document.getElementById("content");
  
    var buildingForm = document.createElement("div");
    buildingForm.classList.add("content-container");
    buildingForm.id = "buildingForm";
  
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
    submitButton.onclick = validateForm; // assuming there's a validateForm function defined elsewhere
    form.appendChild(submitButton);
  
    buildingForm.appendChild(form);
    contentContainer.appendChild(buildingForm);
}

async function getAllBuildings() {
    try {
        const response = await fetch(apiBaseUrl+'/all_buildings', {
          method: 'GET'
        });
        const responseData = await response.json();
        return responseData; // Zwracanie danych budynków
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas wysyłania żądania: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
        throw error; // Rzucenie błędu dla obsługi wyżej
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
        var headers = ["ID", "Nazwa budynku", "Miasto", "Ulica", "Nr. budynku", "Kod pocztowy", "Liczba pięter",""];
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
        console.log(building_id);
        const response = await fetch(apiBaseUrl+'/building/'+building_id, {
          method: 'DELETE'
        });
        const responseData = await response.json();
        printApiResponse("apiInfoResponse", 'Usunięto budynek o id: ' + building_id, "levelSucces");
        generateBuildingPanel();
        console.log(responseData.message);
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
function validateForm() {
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
          printApiResponse("apiInfoResponse",('Błąd podczas dodawania budynku: ', responseData.message),"levelWarning")
          console.error('Błąd podczas dodawania budynku: ', responseData.message);
        }
      } catch (error) {
          printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
          console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
      }
}
