async function displayUtilities(){
    var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';

    headerTextChange("Informacje o stawkach");
    var utilitiesData = await getAllUtilities();
    displayUtilitiesData(utilitiesData, "content")
    const isAdmin = localStorage.getItem('admin');

    if(isAdmin==="true"){
        var allSpaceID =await getAllSpaceID();
        headerTextChange("Zarządzanie opłatami");
        var showUtilitiesFormButton = document.createElement("button");
        showUtilitiesFormButton.setAttribute("type", "button");
        showUtilitiesFormButton.textContent = "Dodaj opłate";
        showUtilitiesFormButton.onclick = function() {
            hideChangeRatesForm();
        };
        contentContainer.appendChild(showUtilitiesFormButton);

        var GenerateInvoiceButton = document.createElement("button");
        GenerateInvoiceButton.setAttribute("type", "button");
        GenerateInvoiceButton.textContent = "Generuj faktury dla obecnego miesiąca";
        GenerateInvoiceButton.onclick = function() {
            generateInvoiceForAllID(allSpaceID);
        };
        contentContainer.appendChild(GenerateInvoiceButton);
    }
    else{
        var generateListRaportButton = document.createElement("button");
        generateListRaportButton.setAttribute("type", "button");
        generateListRaportButton.textContent = "Generuj liste opłat w pdf";
        generateListRaportButton.onclick = function() {
            generateUtilitiesPDF();
        };
        contentContainer.appendChild(generateListRaportButton);

        const header = document.createElement("h2");
        header.classList.add("text-center");
        header.innerHTML = 'Faktury';
        contentContainer.appendChild(header);

        const spaceCheck = await getSpaceForOwenr(localStorage.getItem('id'));
        if(spaceCheck.message != "No spaces found for owner"){
            await generateDateSelection();

            document.getElementById('year').addEventListener('change',async function() {
                await generateInvoice(parseInt(document.getElementById('flat').value),document.getElementById('year').value, document.getElementById('month').value);
            });

            document.getElementById('month').addEventListener('change',async function() {
                await generateInvoice(parseInt(document.getElementById('flat').value),document.getElementById('year').value, document.getElementById('month').value);
            });

            const currentDate = new Date();
            document.getElementById('year').value = currentDate.getFullYear();
            document.getElementById('month').value = currentDate.getMonth() + 1; // Month is zero-based
            const defaultFlat = document.getElementById('flat').value;
            await generateInvoice(parseInt(defaultFlat),currentDate.getFullYear(), currentDate.getMonth() + 1);
        }
        else{
            const header2 = document.createElement("h2");
            header2.classList.add("text-center");
            header2.innerHTML = 'Nie posiadasz żadnego mieszkania';
            contentContainer.appendChild(header2);
        }
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
function displayChangeRatesForm(utilityid, utilityData, billBase) {
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
        nameInput.setAttribute("placeholder", "Wprowadź nazwę");
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
        var unitSelect = document.createElement("select");
        unitSelect.classList.add("form-select");
        unitSelect.setAttribute("id", "newUnit");
        var defaultOption = document.createElement("option");
        defaultOption.setAttribute("value", "");
        defaultOption.textContent = "Wybierz jednostkę";
        unitSelect.appendChild(defaultOption);
        if (Array.isArray(billBase)) {
            billBase.forEach(element => {
                var option = document.createElement("option");
                option.setAttribute("value", element.id);
                option.textContent = element.opis;
                unitSelect.appendChild(option);
            });
        } else {
            console.error("billBase nie jest tablicą.");
        }

        unitFormGroup.appendChild(unitLabel);
        unitFormGroup.appendChild(unitSelect);

        var submitButton = document.createElement("button");
        submitButton.classList.add("btn", "btn-primary", "buttonDecoration");
        submitButton.setAttribute("type", "button");
        submitButton.textContent = "Dodaj";
        submitButton.onclick = function () {
            validateRatesForm(toApiMethod, utilityid);
        };
        submitButton.style.marginTop = "1.5rem";
        submitButton.style.width = "100%";

        var toApiMethod = 'POST';

        if (utilityData) {
            nameInput.value = utilityData.name;
            priceInput.value = utilityData.price_per_unit;
            var selectedUnit = utilityData.unit || '';
            // Ustawienie wybranej jednostki w liście wyboru
            for (let i = 0; i < unitSelect.options.length; i++) {
                if (unitSelect.options[i].textContent === selectedUnit) {
                    unitSelect.selectedIndex = i;
                    break;
                }
            }
            toApiMethod = 'PUT';
            submitButton.textContent = "Edytuj";
        }

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
        removeButton.onclick = function () {
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
        displayChangeRatesForm(utilityid,utilityData,billBase)
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
        billing_basis_id: unitInput.value
    }
    if(unitInput.value === "1")
        dataToSend.unit = "m2"
    else
        dataToSend.unit = "person"
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
async function getInvoice(space_id,year,month){
    try {
        const response = await fetch(apiBaseUrl+'/invoice/'+space_id+'/'+year+'/'+month, {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData.message;
        }
    } catch (error) {
        printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas pobierania opłat: ' + error.message, "levelWarning");
        console.error('Wystąpił błąd podczas pobierania opłat:', error.message);
        throw error;
    }
}
async function generateDateSelection() {
    const dateSelection = document.getElementById("content");

    const dateSelectionDiv = document.createElement("div");
    dateSelectionDiv.classList.add("row");
    dateSelectionDiv.setAttribute('id',"dateSelection");


    const yearDiv = document.createElement("div");
    yearDiv.classList.add("col-md-4");
    yearDiv.innerHTML = `
        <label for="year">Wybierz rok:</label>
        <input type="number" id="year" class="form-control">
    `;
    dateSelectionDiv.appendChild(yearDiv);

    const monthDiv = document.createElement("div");
    monthDiv.classList.add("col-md-4");
    monthDiv.innerHTML = `
        <label for="month">Wybierz miesiąc:</label>
        <select id="month" class="form-select">
            <option value="1">Styczeń</option>
            <option value="2">Luty</option>
            <option value="3">Marzec</option>
            <option value="4">Kwiecień</option>
            <option value="5">Maj</option>
            <option value="6">Czerwiec</option>
            <option value="7">Lipiec</option>
            <option value="8">Sierpień</option>
            <option value="9">Wrzesień</option>
            <option value="10">Październik</option>
            <option value="11">Listopad</option>
            <option value="12">Grudzień</option>
        </select>
    `;

    dateSelectionDiv.appendChild(monthDiv);

    const flatDiv = document.createElement("div");
        flatDiv.classList.add("col-md-4");
        flatDiv.innerHTML = `
            <label for="flat">Wybierz mieszkanie:</label>
            <select id="flat" class="form-select">
            </select>
        `;
        dateSelectionDiv.appendChild(flatDiv);
        dateSelection.appendChild(dateSelectionDiv)

        const flatOptions = await getSpaceForOwenr(localStorage.getItem('id'))
        const flatSelect = document.getElementById('flat');
        flatOptions.message.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            flatSelect.appendChild(optionElement);
        });
        flatSelect.addEventListener('change', async function() {
            await generateInvoice(parseInt(parseInt(flatSelect.value),document.getElementById('year').value), parseInt(document.getElementById('month').value));
        });
}
async function generateInvoice(year, month, flat) {
    const content = document.getElementById("content");
    const oldInvoiceDiv = document.getElementById("invoiceDiv");
    if(oldInvoiceDiv)
        oldInvoiceDiv.remove();
    const invoiceDiv = document.createElement("div");
    invoiceDiv.setAttribute('id',"invoiceDiv");

    let total = 0;

    const table = document.createElement("table");
    table.classList.add("table");

    const invoices = await getInvoice(year, month,flat);
    if (invoices === "Invoice not found") {
        const noInvoiceRow = document.createElement("tr");
        noInvoiceRow.innerHTML = `
            <td colspan="4"><b>Nie znaleziono faktur na wybrany termin i mieszkanie.</b></td>
        `;
        table.appendChild(noInvoiceRow);
    } else {
        table.innerHTML = `
        <thead>
            <tr>
                <th>Nazwa</th>
                <th>Ilość</th>
                <th>Cena za jednostke</th>
                <th>Podstawa rozliczenia</th>
                <th>Suma</th>
            </tr>
        </thead>
        <tbody>
    `;
        invoices.forEach(item => {
            const subtotal = item.price;
            total += subtotal;

            table.innerHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.amount}</td>
                    <td>${item.price_per_unit} zł</td>
                    <td>${item.billing_basis}</td>
                    <td>${item.price} zł</td>
                </tr>
            `;
        });
        table.innerHTML += `
        </tbody>
        <tfoot>
            <tr>
                <td colspan="4"><b>Suma rachunku:</b></td>
                <td><b>${total} zł</b></td>
            </tr>
        </tfoot>
    `;
    }

    invoiceDiv.appendChild(table)
    content.appendChild(invoiceDiv);
}
async function getAllSpaceID(){
    try {
        const response = await fetch(apiBaseUrl+'/all_spaces_ids', {
            method: 'GET'
        });
        const responseData = await response.json();
        if (responseData.message) {
            return responseData.message;
        }
    } catch (error) {
        console.error('Wystąpił błąd podczas pobierania opłat:', error.message);
        throw error;
    }
}
async function generateInvoiceForAllID(ids){
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    for (const space_id of ids) {
        try {
            const response = await fetch(apiBaseUrl+'/new_random_invoice/'+space_id+'/'+year+'/'+month, {
                method: 'GET'
            });
            const responseData = await response.json();
            if (responseData.message==="Invoice for this space and month already exists") {
                printApiResponse("apiInfoResponse", 'Faktury dla obecnego miesiąca zostały już wygenerowane', "levelWarning");
            }
            else{
                printApiResponse("apiInfoResponse", 'Pomyślnie wygenerowano faktury dla osiedla', "levelSucces");
            }
        } catch (error) {
            printApiResponse("apiInfoResponse", 'Wystąpił błąd podczas generowania opłat: ' + error.message, "levelWarning");
            console.error('Wystąpił błąd podczas generowania opłat:', error.message);
            throw error;
        }
    }
}