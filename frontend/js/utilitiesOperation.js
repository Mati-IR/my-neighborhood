function displayUtilities(){
    var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';

    headerTextChange("Informacje o stawkach");
    displayUtilitiesData(utilitiesData, "content")

    var showUtilitiesFormButton = document.createElement("button");
    showUtilitiesFormButton.setAttribute("type", "button");
    showUtilitiesFormButton.textContent = "Dodaj opłate";
    showUtilitiesFormButton.onclick = function() {
        hideChangeRatesForm();
    };
    contentContainer.appendChild(showUtilitiesFormButton);
}
const utilitiesData = [
    {
        id: 1,
        name: "Electricity",
        price_per_unit: 0.15
    },
    {
        id: 2,
        name: "Water",
        price_per_unit: 1.20
    },
    {
        id: 3,
        name: "Gas",
        price_per_unit: 0.80
    }
];

async function displayUtilitiesData(data, containerId) {
    try {
        var container = document.getElementById(containerId);

        var table = document.createElement("table");
        table.classList.add("table", "table-striped", "table-bordered", "table-hover");

        var thead = document.createElement("thead");
        var tbody = document.createElement("tbody");

        // Tworzenie nagłówków tabeli
        var headers = ["ID", "Nazwa", "Cena za jednostke","Usuń","Edytuj"];
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

            var deleteButton = document.createElement("td");
            deleteButton.innerHTML=`
            <button class="btn btn-light buttonDecoration" onclick="deleteRateById(${utility.id})"><i class="bi bi-trash-fill" style="color:#cf4a4a"></i></button>
            `;
            row.appendChild(deleteButton);

            var editButton = document.createElement("td");
            var button = document.createElement("button");
            button.classList.add("btn", "btn-light", "buttonDecoration");
            button.innerHTML = '<i class="bi bi-pencil-square"></i>';

            button.onclick = function() {
                hideChangeRatesForm(utilitiesData[utility.id - 1]);
            };

            editButton.appendChild(button);
            row.appendChild(editButton);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    } catch (error) {
        console.error('Wystąpił błąd podczas wyświetlania danych:', error.message);
    }
}
function displayChangeRatesForm(utilityData) {
    try {
        console.log(utilityData)
        var container = document.getElementById("content");

        var ImputForm = document.createElement("div");
        ImputForm.classList.add("content-container");
        ImputForm.id = "ImputForm";

        var form = document.createElement("form");
        form.classList.add("row", "g-2");


        // Input dla nowej nazwy
        var nameFormGroup = document.createElement("div");
        nameFormGroup.classList.add("col-md-6");
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
        

        // Input dla nowej ceny jednostkowej
        var priceFormGroup = document.createElement("div");
        priceFormGroup.classList.add("col-md-6");
        var priceLabel = document.createElement("label");
        priceLabel.classList.add("form-label");
        priceLabel.setAttribute("for", "newPrice");
        priceLabel.textContent = "Cena:";
        var priceInput = document.createElement("input");
        priceInput.classList.add("form-control");
        priceInput.setAttribute("type", "number");
        priceInput.setAttribute("id", "newPrice");
        priceInput.setAttribute("step", "0.01");
        priceInput.setAttribute("placeholder", "Wprowadź cene za jednostke");
        priceFormGroup.appendChild(priceLabel);
        

        // Przycisk do zatwierdzania formularza
        var submitButton = document.createElement("button");
        submitButton.classList.add("btn", "btn-primary","buttonDecoration");
        submitButton.setAttribute("type", "button");
        submitButton.textContent = "Dodaj";
        submitButton.onclick = validateRatesForm;
        submitButton.style.marginTop = "1.5rem";
        submitButton.style.width = "100%";

        if(utilityData){
            nameInput.value = utilityData.name;
            priceInput.value = utilityData.price_per_unit
        }
        nameFormGroup.appendChild(nameInput);
        priceFormGroup.appendChild(priceInput);
        // Dodaj wszystkie elementy do formularza
        form.appendChild(nameFormGroup);
        form.appendChild(priceFormGroup);
        form.appendChild(submitButton);

        var header = document.createElement("h2");
        header.textContent = "Formularz dodania opłaty";
        header.classList.add("MenuHeader");
        ImputForm.appendChild(header);

        var removeButton = document.createElement("button");
        removeButton.setAttribute("type", "button");
        removeButton.textContent = "Zamknij formularz";
        removeButton.onclick = function() {
        ImputForm.remove();
        };
        removeButton.style.backgroundColor = "#cf4a4a";
        removeButton.style.color = "black";
        form.appendChild(removeButton);

        ImputForm.appendChild(form);
        container.appendChild(ImputForm);
    } catch (error) {
        console.error('Wystąpił błąd podczas wyświetlania formularza:', error.message);
    }
}
function hideChangeRatesForm(utilityData){
    var ImputForm= document.getElementById("ImputForm");
    if(ImputForm != null){
        ImputForm.remove();
    }else{
        displayChangeRatesForm(utilityData)
    }
}
async function deleteRateById(building_id){
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

        /*if(state==true){
            const response = await fetch(apiBaseUrl+'/building/'+building_id, {
              method: 'DELETE'
            });
            const responseData = await response.json();
            printApiResponse("apiInfoResponse", 'Usunięto budynek o id: ' + building_id, "levelSucces");
            generateBuildingPanel();
        }*/
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas wysyłania żądania: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
        throw error;
    }
}
function validateRatesForm() {
    var nameInput = document.getElementById("newName");
    var priceInput = document.getElementById("newPrice");

    var nameValue = nameInput.value.trim();
    var priceValue = priceInput.value.trim();

    if (nameValue === "") {
        printApiResponse("apiInfoResponse", "Nazwa nie może być pusta", "levelWarning");
        return;
    }

    if (priceValue === "" || isNaN(priceValue) || parseFloat(priceValue) <= 0) {
        printApiResponse("apiInfoResponse", "Cena musi być liczbą dodatnią", "levelWarning");
        return;
    }

    // Jeśli walidacja przeszła pomyślnie, możesz dodać kod do obsługi dodania opłaty
    //addRate(nameValue, parseFloat(priceValue));

    // Jeśli chcesz zamknąć formularz po dodaniu opłaty, odkomentuj poniższą linię
    // document.getElementById("ImputForm").remove();
}

