async function displayIncidentSystem(){
    var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';

    headerTextChange("Zarządzanie usterkami");
    displayServicemanData(servicemanData, "content");
}
var servicemanData = [
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
];
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

        var showServicemanFormButton = document.createElement("button");
        showServicemanFormButton.setAttribute("type", "button");
        showServicemanFormButton.textContent = "Dodaj serwisanta";
        showServicemanFormButton.onclick = function() {
            hideServicemanForm();
        };
        container.appendChild(showServicemanFormButton);

    } catch (error) {
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
            validateUserDataForm(toApiMethod, userId);
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
    } catch (error) {
        console.error('Wystąpił błąd podczas wyświetlania formularza:', error.message);
    }
}
function hideServicemanForm(userid,userData){
    var ImputForm= document.getElementById("inputForm");
    if(ImputForm != null){
        ImputForm.remove();
    }else{
        displayServicemanDataForm(userid,userData)
    }
}