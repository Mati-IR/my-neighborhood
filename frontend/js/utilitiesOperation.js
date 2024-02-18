async function displayUtilities(){
    var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';

    headerTextChange("Informacje o stawkach");
    var utilitiesData = await getAllUtilities();
    displayUtilitiesData(utilitiesData, "content")
    const isAdmin = localStorage.getItem('admin');

    if(isAdmin==="true"){
        var showUtilitiesFormButton = document.createElement("button");
        showUtilitiesFormButton.setAttribute("type", "button");
        showUtilitiesFormButton.textContent = "Dodaj opłate";
        showUtilitiesFormButton.onclick = function() {
            hideChangeRatesForm();
        };
        contentContainer.appendChild(showUtilitiesFormButton);
    }
}
async function displayUtilitiesData(data, containerId) {
    try {
        var container = document.getElementById(containerId);

        var table = document.createElement("table");
        table.classList.add("table", "table-striped", "table-bordered", "table-hover");

        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");

        // Tworzenie nagłówków tabeli
        var headers;
        const isAdmin = localStorage.getItem('admin');
        if(isAdmin==="true")
            headers = ["ID", "Nazwa", "Cena za jednostkę", "Jednostka", "Usuń", "Edytuj"];
        else
            headers = ["ID", "Nazwa", "Cena za jednostkę", "Jednostka"];

        var headerRow = document.createElement("tr");
        headers.forEach(function(headerText) {
            var headerCell = document.createElement("th");
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        // Wypełnianie danych tabeli
        data.forEach(function(utility) {
            var row = document.createElement("tr");

            // Dodaj komórki z danymi
            var idCell = document.createElement("td");
            idCell.textContent = utility.id;
            row.appendChild(idCell);

            var nameCell = document.createElement("td");
            nameCell.textContent = utility.name;
            row.appendChild(nameCell);

            var priceCell = document.createElement("td");
            priceCell.textContent = utility.price_per_unit.toFixed(2); // Zaokrąglenie do dwóch miejsc po przecinku
            row.appendChild(priceCell);

            var unitCell = document.createElement("td");
            unitCell.textContent = utility.unit;
            row.appendChild(unitCell);
            if(isAdmin==="true"){
                var deleteButton = document.createElement("td");
                deleteButton.innerHTML = `
                    <button class="btn btn-light buttonDecoration" onclick="deleteRateById(${utility.id})"><i class="bi bi-trash-fill" style="color:#cf4a4a"></i></button>
                `;
                row.appendChild(deleteButton);

                var editButton = document.createElement("td");
                var button = document.createElement("button");
                button.classList.add("btn", "btn-light", "buttonDecoration");
                button.innerHTML = '<i class="bi bi-pencil-square"></i>';

                button.onclick = function() {
                    hideChangeRatesForm(utility.id,utility);
                };

                editButton.appendChild(button);
                row.appendChild(editButton);
            }

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    } catch (error) {
        console.error('Wystąpił błąd podczas wyświetlania danych:', error.message);
    }
}
function displayChangeRatesForm(utilityid,utilityData) {
    try {
        var container = document.getElementById("content");

        var inputForm = document.createElement("div");
        inputForm.classList.add("content-container");
        inputForm.id = "inputForm";

        var form = document.createElement("form");
        form.classList.add("row", "g-2");

        var nameFormGroup = document.createElement("div");
        nameFormGroup.classList.add("col-md-4");
        var nameLabel = document.createElement("label");
        nameLabel.classList.add("form-label");
        nameLabel.setAttribute("for", "newName");
        nameLabel.textContent = "Nazwa:";
        var nameInput = document.createElement("input");
        nameInput.classList.add("form-control");
        nameInput.setAttribute("type", "text");
        nameInput.setAttribute("id", "newName");
        nameInput.setAttribute("placeholder", "Wprowadź nazwe");
        nameFormGroup.appendChild(nameLabel);
        nameFormGroup.appendChild(nameInput);

        var priceFormGroup = document.createElement("div");
        priceFormGroup.classList.add("col-md-4");
        var priceLabel = document.createElement("label");
        priceLabel.classList.add("form-label");
        priceLabel.setAttribute("for", "newPrice");
        priceLabel.textContent = "Cena:";
        var priceInput = document.createElement("input");
        priceInput.classList.add("form-control");
        priceInput.setAttribute("type", "number");
        priceInput.setAttribute("id", "newPrice");
        priceInput.setAttribute("step", "0.01");
        priceInput.setAttribute("placeholder", "Wprowadź cenę za jednostkę");
        priceFormGroup.appendChild(priceLabel);
        priceFormGroup.appendChild(priceInput);

        var unitFormGroup = document.createElement("div");
        unitFormGroup.classList.add("col-md-4");
        var unitLabel = document.createElement("label");
        unitLabel.classList.add("form-label");
        unitLabel.setAttribute("for", "newUnit");
        unitLabel.textContent = "Jednostka:";
        var unitInput = document.createElement("input");
        unitInput.classList.add("form-control");
        unitInput.setAttribute("type", "text");
        unitInput.setAttribute("id", "newUnit");
        unitInput.setAttribute("placeholder", "Wprowadź jednostkę");
        
        
        var toApiMetode = 'POST';

        var submitButton = document.createElement("button");
        submitButton.classList.add("btn", "btn-primary", "buttonDecoration");
        submitButton.setAttribute("type", "button");
        submitButton.textContent = "Dodaj";
        submitButton.onclick = function() {
            validateRatesForm(toApiMetode,utilityid);
        };
        submitButton.style.marginTop = "1.5rem";
        submitButton.style.width = "100%";

        
        if (utilityData) {
            nameInput.value = utilityData.name;
            priceInput.value = utilityData.price_per_unit;
            unitInput.value = utilityData.unit || '';
            var toApiMetode = 'PUT'; 
            submitButton.textContent = "Edytuj";
        }

        unitFormGroup.appendChild(unitLabel);
        unitFormGroup.appendChild(unitInput);
        form.appendChild(nameFormGroup);
        form.appendChild(priceFormGroup);
        form.appendChild(unitFormGroup);
        form.appendChild(submitButton);

        var header = document.createElement("h2");
        header.textContent = "Formularz dodania opłaty";
        header.classList.add("MenuHeader");
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
function hideChangeRatesForm(utilityid,utilityData){
    var ImputForm= document.getElementById("inputForm");
    if(ImputForm != null){
        ImputForm.remove();
    }else{
        displayChangeRatesForm(utilityid,utilityData)
    }
}
async function deleteRateById(utility_id){
    try {

        printApiResponse("apiInfoResponse", " ","levelACHTUNG");
        var statePromise = new Promise((resolve, reject) => {
            var apiInfoResponse = document.getElementById("apiInfoResponse");
            apiInfoResponse.classList.add("apiInfoResponse");
            apiInfoResponse.classList.add("levelACHTUNG");
            apiInfoResponse.textContent = 'Czy napewno chcesz usunąć opłate?';
            
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
            const response = await fetch(apiBaseUrl+'/utility/'+utility_id, {
              method: 'DELETE'
            });
            const responseData = await response.json();
            printApiResponse("apiInfoResponse", 'Usunięto opłate o id: ' + utility_id, "levelSucces");
            displayUtilities();
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas wysyłania żądania: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
        throw error;
    }
}
function validateRatesForm(toApiMetode,utilityid) {
    var nameInput = document.getElementById("newName");
    var priceInput = document.getElementById("newPrice");
    var unitInput = document.getElementById("newUnit");

    var nameValue = nameInput.value.trim();
    var priceValue = priceInput.value.trim();
    var unitValue = unitInput.value.trim();

    if (nameValue === "") {
        printApiResponse("apiInfoResponse", "Nazwa nie może być pusta", "levelWarning");
        return;
    }

    if (priceValue === "" || isNaN(priceValue) || parseFloat(priceValue) <= 0) {
        printApiResponse("apiInfoResponse", "Cena musi być liczbą dodatnią", "levelWarning");
        return;
    }

    if (unitValue === "") {
        printApiResponse("apiInfoResponse", "Jednostka nie może być pusta", "levelWarning");
        return;
    }
    var dataToSend = {
        name: nameInput.value,
        price_per_unit: priceInput.value,
        unit: unitInput.value
    }
    if(toApiMetode == 'PUT'){
        dataToSend.id = utilityid;
        addEditUtilities(dataToSend,'PUT','/update_utility')
    } 
    else{
        addEditUtilities(dataToSend,'POST','/create_utility')
    }
        
}
async function getAllUtilities() {
    try {
        const response = await fetch(apiBaseUrl+'/all_utilities', {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.utilities) {
            return responseData.utilities;
        } else {
            throw new Error("Brak danych o opłatach w odpowiedzi z serwera.");
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania opłat: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania opłat:', error.message);
        throw error;
    }
}
async function addEditUtilities(dataToSend,toApiMetode,ApiMetode){
    try {
        const response = await fetch(apiBaseUrl+ApiMetode, {
          method: toApiMetode,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
    
        const responseData = await response.json();
    
        if (response.ok) {
            if(toApiMetode === 'POST')
                printApiResponse("apiInfoResponse","Pomyślnie dodano opłate.","levelSucces")
            else
                printApiResponse("apiInfoResponse","Pomyślnie zedytowano opłate.","levelSucces")
            displayUtilities();
          
        } else {
          printApiResponse("apiInfoResponse",responseData.message,"levelWarning")
          console.error('Błąd podczas dodawania opłaty: ', responseData.message);
        }
      } catch (error) {
          printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
          console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
      }
}