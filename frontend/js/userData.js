function displayUserData() {
    var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';

    headerTextChange("Informacje o użytkowniku");

    var div = document.createElement("div");
    var userDataHtml = `
        <table class="table">
            <tbody>
                <tr>
                    <th scope="row">Email:</th>
                    <td>${userData.email}</td>
                </tr>
                <tr>
                    <th scope="row">Pełna nazwa:</th>
                    <td>${userData.full_name}</td>
                </tr>
                <tr>
                    <th scope="row">Numer telefonu:</th>
                    <td>${userData.phone_number}</td>
                </tr>
    `;

    const isAdmin = localStorage.getItem('admin');
    if (isAdmin == "true") {
        userDataHtml += `
            <tr>
                <th scope="row">Wynagrodzenie:</th>
                <td>${userData.salary}</td>
            </tr>
        `;
    } else {
        userDataHtml += `
            <tr>
                <th scope="row">Adres:</th>
                <td>${userData.full_address}</td>
            </tr>
        `;
    }

    userDataHtml += `
            </tbody>
        </table>
    `;

    div.innerHTML = userDataHtml;
    contentContainer.appendChild(div);

    var showDataFormButton = document.createElement("button");
    showDataFormButton.setAttribute("type", "button");
    showDataFormButton.textContent = "Zmień dane";
    showDataFormButton.onclick = function() {
        hideUserDataForm(userData);
    };
    contentContainer.appendChild(showDataFormButton);

    var showPasswordFormButton = document.createElement("button");
    showPasswordFormButton.setAttribute("type", "button");
    showPasswordFormButton.textContent = "Zmień hasło";
    showPasswordFormButton.onclick = function() {
        hidePasswordForm();
    };
    contentContainer.appendChild(showPasswordFormButton);

}
const userData = {
    "email": "example@example.com",
    "full_name": "John Doe",
    "phone_number": "123-456-789",
    "salary": 50000,
    "full_address": "Polska"
};

function generateEditUserForm(userData) {
    hideApiResponse("apiInfoResponse");

    var contentContainer = document.getElementById("content");

    var ImputForm = document.createElement("div");
    ImputForm.classList.add("content-container");
    ImputForm.id = "ImputForm";

    var form = document.createElement("form");

    var labelEmail = document.createElement("label");
    labelEmail.setAttribute("for", "createEmail");
    labelEmail.textContent = "Email:";
    form.appendChild(labelEmail);

    var inputEmail = document.createElement("input");
    inputEmail.setAttribute("type", "email");
    inputEmail.setAttribute("id", "createEmail");
    inputEmail.setAttribute("placeholder", "Email");
    inputEmail.value = userData.email;
    form.appendChild(inputEmail);

    var labelFullName = document.createElement("label");
    labelFullName.setAttribute("for", "createFullName");
    labelFullName.textContent = "Pełna nazwa:";
    form.appendChild(labelFullName);

    var inputFullName = document.createElement("input");
    inputFullName.setAttribute("type", "text");
    inputFullName.setAttribute("id", "createFullName");
    inputFullName.setAttribute("placeholder", "Pełna nazwa");
    inputFullName.value = userData.full_name;
    form.appendChild(inputFullName);

    var labelPhoneNumber = document.createElement("label");
    labelPhoneNumber.setAttribute("for", "createPhoneNumber");
    labelPhoneNumber.textContent = "Numer telefonu:";
    form.appendChild(labelPhoneNumber);

    var inputPhoneNumber = document.createElement("input");
    inputPhoneNumber.setAttribute("type", "text");
    inputPhoneNumber.setAttribute("id", "createPhoneNumber");
    inputPhoneNumber.setAttribute("placeholder", "Numer telefonu");
    inputPhoneNumber.value = userData.phone_number;
    form.appendChild(inputPhoneNumber);

    const isAdmin = localStorage.getItem('admin');
    if(isAdmin == "true"){
        var labelSalary = document.createElement("label");
        labelSalary.setAttribute("for", "createSalary");
        labelSalary.textContent = "Wynagrodzenie:";
        form.appendChild(labelSalary);

        var inputSalary = document.createElement("input");
        inputSalary.setAttribute("type", "number");
        inputSalary.setAttribute("id", "createSalary");
        inputSalary.setAttribute("placeholder", "Wynagrodzenie");
        inputSalary.value = userData.salary;
        form.appendChild(inputSalary);
    }
    else if(isAdmin == "false"){
        var labelFullAddress = document.createElement("label");
        labelFullAddress.setAttribute("for", "createFullAddress");
        labelFullAddress.textContent = "Adres:";
        form.appendChild(labelFullAddress);

        var inputFullAddress = document.createElement("input");
        inputFullAddress.setAttribute("type", "text");
        inputFullAddress.setAttribute("id", "createFullAddress");
        inputFullAddress.setAttribute("placeholder", "Adres");
        inputFullAddress.value = userData.full_address;
        form.appendChild(inputFullAddress);
    }
    var header = document.createElement("h2");
        header.textContent = "Formularz zmian danych";
        header.classList.add("MenuHeader");
        ImputForm.appendChild(header);

    var submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.textContent = "Zmień dane";
    submitButton.onclick = validateUserDataForm;
    form.appendChild(submitButton);

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
    contentContainer.appendChild(ImputForm);
    ImputForm.scrollIntoView({ behavior: 'smooth' });
}
function validateUserDataForm() {
    var email = document.getElementById("createEmail").value;
    var fullName = document.getElementById("createFullName").value;
    var phoneNumber = document.getElementById("createPhoneNumber").value;

    if (email === ""||fullName === ""||phoneNumber === "") {
        printApiResponse("apiInfoResponse", "Uzupełnij wszystkie pola", "levelWarning");
        return false;
    }
    var phoneNumberPattern = /^\d+$/;
    if (!phoneNumberPattern.test(phoneNumber)) {
        printApiResponse("apiInfoResponse", "Numer telefonu może zawierać tylko cyfry", "levelWarning");
        return false;
    }
    if (phoneNumber.length !== 9) {
        printApiResponse("apiInfoResponse", "Numer telefonu musi mieć 9 cyfr", "levelWarning");
        return false;
    }

    var isAdmin = localStorage.getItem('admin');
    if (isAdmin === "true") {
        var salary = document.getElementById("createSalary").value;
        if (salary === "") {
            printApiResponse("apiInfoResponse", "Wynagrodzenie nie może być puste", "levelWarning");
            return false;
        } else if (isNaN(salary) || salary <= 0) {
            printApiResponse("apiInfoResponse", "Wynagrodzenie musi być liczbą większą od zera", "levelWarning");
            return false;
        }
    } else {
        var fullAddress = document.getElementById("createFullAddress").value;
        if (fullAddress === "") {
            printApiResponse("apiInfoResponse", "Adres nie może być pusty", "levelWarning");
            return false;
        }
    }
    return true;
}
function hideUserDataForm(userData){
    var ImputForm= document.getElementById("ImputForm");
    if(ImputForm != null){
        ImputForm.remove();
    }else{
        generateEditUserForm(userData)
    }
}
function hidePasswordForm(){
    var ImputForm= document.getElementById("PasswordForm");
    if(ImputForm != null){
        ImputForm.remove();
    }else{
        generateChangePasswordForm()
    }
}
function generateChangePasswordForm() {
    var contentContainer = document.getElementById("content");

    var PasswordForm = document.createElement("div");
    PasswordForm.classList.add("content-container");
    PasswordForm.id = "PasswordForm";

    var form = document.createElement("form");

    var labelCurrentPassword = document.createElement("label");
    labelCurrentPassword.setAttribute("for", "currentPassword");
    labelCurrentPassword.textContent = "Aktualne hasło:";
    form.appendChild(labelCurrentPassword);

    var inputCurrentPassword = document.createElement("input");
    inputCurrentPassword.setAttribute("type", "password");
    inputCurrentPassword.setAttribute("id", "currentPassword");
    inputCurrentPassword.setAttribute("placeholder", "Aktualne hasło");
    form.appendChild(inputCurrentPassword);

    var labelNewPassword = document.createElement("label");
    labelNewPassword.setAttribute("for", "newPassword");
    labelNewPassword.textContent = "Nowe hasło:";
    form.appendChild(labelNewPassword);

    var inputNewPassword = document.createElement("input");
    inputNewPassword.setAttribute("type", "password");
    inputNewPassword.setAttribute("id", "newPassword");
    inputNewPassword.setAttribute("placeholder", "Nowe hasło");
    form.appendChild(inputNewPassword);

    var labelConfirmPassword = document.createElement("label");
    labelConfirmPassword.setAttribute("for", "confirmPassword");
    labelConfirmPassword.textContent = "Potwierdź hasło:";
    form.appendChild(labelConfirmPassword);

    var inputConfirmPassword = document.createElement("input");
    inputConfirmPassword.setAttribute("type", "password");
    inputConfirmPassword.setAttribute("id", "confirmPassword");
    inputConfirmPassword.setAttribute("placeholder", "Potwierdź hasło");
    form.appendChild(inputConfirmPassword);

    var submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.textContent = "Zmień hasło";
    submitButton.onclick = validateChangePasswordForm;
    form.appendChild(submitButton);

    var header = document.createElement("h2");
        header.textContent = "Formularz zmiany hasła";
        header.classList.add("MenuHeader");
        PasswordForm.appendChild(header);

    var removeButton = document.createElement("button");
        removeButton.setAttribute("type", "button");
        removeButton.textContent = "Zamknij formularz";
        removeButton.onclick = function() {
            PasswordForm.remove();
        };
        removeButton.style.backgroundColor = "#cf4a4a";
        removeButton.style.color = "black";
        form.appendChild(removeButton);

    PasswordForm.appendChild(form);
    contentContainer.appendChild(PasswordForm);
    PasswordForm.scrollIntoView({ behavior: 'smooth' });
}
function validateChangePasswordForm() {
    var currentPassword = document.getElementById("currentPassword").value;
    var newPassword = document.getElementById("newPassword").value;
    var confirmPassword = document.getElementById("confirmPassword").value;

    if (currentPassword === ""||newPassword === ""||confirmPassword === "") {
        printApiResponse("apiInfoResponse", "Proszę podać aktualne hasło", "levelWarning");
        return false;
    }

    if (newPassword.length < 8) {
        printApiResponse("apiInfoResponse", "Nowe hasło musi zawierać co najmniej 8 znaków", "levelWarning");
        return false;
    }

    if (newPassword !== confirmPassword) {
        printApiResponse("apiInfoResponse", "Nowe hasło i potwierdzenie nowego hasła nie są identyczne", "levelWarning");
        return false;
    }

    return true;
}
