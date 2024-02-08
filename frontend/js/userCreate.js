function generateNewUserRadio() {
    var contentContainer = document.getElementById("content");
    contentContainer.innerHTML = '';

    var apiInfoResponse = document.createElement("p");
    apiInfoResponse.setAttribute("id", "apiInfoResponse");
    contentContainer.appendChild(apiInfoResponse);

    var createHeader = document.createElement("p");
    createHeader.textContent = "Tworzenie nowego konta";
    createHeader.classList.add("accountHeader");
    contentContainer.appendChild(createHeader);

    var header = document.createElement("p");
    header.textContent = "Wybierz typ konta do utworzenia";
    header.setAttribute("id", "accountHeader");

    var radioDiv = document.createElement("div");
    radioDiv.classList.add("radioDiv");

    var form = document.createElement("form");
    form.setAttribute("id", "radioForm");
    form.appendChild(header);

    var radioAdmin = document.createElement("input");
    radioAdmin.setAttribute("type", "radio");
    radioAdmin.setAttribute("name", "userType");
    radioAdmin.setAttribute("value", "admin");
    radioAdmin.setAttribute("id", "adminRadio");
    radioAdmin.setAttribute("onclick", "generateNewUserForm()");
    var labelAdmin = document.createElement("label");
    labelAdmin.textContent = "Admin";
    labelAdmin.setAttribute("for", "adminRadio");
    radioDiv.appendChild(radioAdmin);
    radioDiv.appendChild(labelAdmin);

    var radioUser = document.createElement("input");
    radioUser.setAttribute("type", "radio");
    radioUser.setAttribute("name", "userType");
    radioUser.setAttribute("value", "user");
    radioUser.setAttribute("id", "userRadio");
    radioUser.setAttribute("onclick", "generateNewUserForm()");
    var labelUser = document.createElement("label");
    labelUser.textContent = "User";
    labelUser.setAttribute("for", "userRadio");
    radioDiv.appendChild(radioUser);
    radioDiv.appendChild(labelUser);

    form.appendChild(radioDiv);

    contentContainer.appendChild(form);

    var ImputForm = document.createElement("div");
    ImputForm.setAttribute("id", "ImputForm");
    contentContainer.appendChild(ImputForm);
}

function generateNewUserForm() {
    hideApiResponse("apiInfoResponse");

    var contentContainer = document.getElementById("ImputForm");
    contentContainer.innerHTML = '';
  
    var adminForm = document.createElement("div");
    adminForm.classList.add("content-container");
    adminForm.id = "adminForm";
  
    var form = document.createElement("form");
  
    var labelEmail = document.createElement("label");
    labelEmail.setAttribute("for", "createEmail");
    labelEmail.textContent = "Email:";
    form.appendChild(labelEmail);
  
    var inputEmail = document.createElement("input");
    inputEmail.setAttribute("type", "email");
    inputEmail.setAttribute("id", "createEmail");
    inputEmail.setAttribute("placeholder", "Email");
    form.appendChild(inputEmail);
  
    var labelPassword = document.createElement("label");
    labelPassword.setAttribute("for", "createPassword");
    labelPassword.textContent = "Password:";
    form.appendChild(labelPassword);
  
    var inputPassword = document.createElement("input");
    inputPassword.setAttribute("type", "password");
    inputPassword.setAttribute("id", "createPassword");
    inputPassword.setAttribute("placeholder", "Password");
    form.appendChild(inputPassword);
  
    var labelFullName = document.createElement("label");
    labelFullName.setAttribute("for", "createFullName");
    labelFullName.textContent = "Full Name:";
    form.appendChild(labelFullName);
  
    var inputFullName = document.createElement("input");
    inputFullName.setAttribute("type", "text");
    inputFullName.setAttribute("id", "createFullName");
    inputFullName.setAttribute("placeholder", "Full Name");
    form.appendChild(inputFullName);
  
    var labelPhoneNumber = document.createElement("label");
    labelPhoneNumber.setAttribute("for", "createPhoneNumber");
    labelPhoneNumber.textContent = "Phone Number:";
    form.appendChild(labelPhoneNumber);
  
    var inputPhoneNumber = document.createElement("input");
    inputPhoneNumber.setAttribute("type", "text");
    inputPhoneNumber.setAttribute("id", "createPhoneNumber");
    inputPhoneNumber.setAttribute("placeholder", "Phone Number");
    form.appendChild(inputPhoneNumber);
  
    var userType = document.querySelector('input[name="userType"]:checked');
    if(userType.value == "admin"){
        var labelSalary = document.createElement("label");
        labelSalary.setAttribute("for", "createSalary");
        labelSalary.textContent = "Salary:";
        form.appendChild(labelSalary);
    
        var inputSalary = document.createElement("input");
        inputSalary.setAttribute("type", "number");
        inputSalary.setAttribute("id", "createSalary");
        inputSalary.setAttribute("placeholder", "Salary");
        form.appendChild(inputSalary);
    }
    else if(userType.value == "user"){
        var labelFullAddress = document.createElement("label");
        labelFullAddress.setAttribute("for", "createFullAddress");
        labelFullAddress.textContent = "Full Address:";
        form.appendChild(labelFullAddress);
    
        var inputFullAddress = document.createElement("input");
        inputFullAddress.setAttribute("type", "text");
        inputFullAddress.setAttribute("id", "createFullAddress");
        inputFullAddress.setAttribute("placeholder", "Full Address");
        form.appendChild(inputFullAddress);
    }
    
    var submitButton = document.createElement("button");
    submitButton.setAttribute("type", "button");
    submitButton.textContent = "Submit";
    submitButton.onclick = validateForm;
    form.appendChild(submitButton);
  
    adminForm.appendChild(form);
    contentContainer.appendChild(adminForm);
}

function validateForm() {
    var userType = document.querySelector('input[name="userType"]:checked');
    var userTypeValue = userType.value;

    var email = document.getElementById("createEmail").value;
    var password = document.getElementById("createPassword").value;
    var fullName = document.getElementById("createFullName").value;
    var phoneNumber = document.getElementById("createPhoneNumber").value;

    if(userTypeValue == "user"){
        var fullAddress = document.getElementById("createFullAddress").value;
    }
    else if(userTypeValue == "admin"){
        var adminSalary = document.getElementById("createSalary").value;
    }
    
    // Sprawdzenie czy wszystkie pola są wypełnione
    if (email === "" || password === "" || fullName === "" || phoneNumber === "" 
        || fullAddress === "" && userTypeValue == "user" || adminSalary === "" && userTypeValue == "admin") {
            printApiResponse("apiInfoResponse","Proszę wypełnić wszystkie wymagane pola.","levelWarning")
            return false;
    }
  
    // Sprawdzenie poprawności formatu adresu email
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        printApiResponse("apiInfoResponse","Proszę podać poprawny adres email.","levelWarning")
        return false;
    }
  
    // Sprawdzenie poprawności numeru telefonu
    var phoneRegex = /^\d{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
        printApiResponse("apiInfoResponse","Proszę podać poprawny numer telefonu (9 cyfr).","levelWarning")
        return false;
    }
    
    if(userTypeValue == "admin"){
        var adminData = {
            email: email,
            password_hash: sha256(password),
            full_name: fullName,
            phone_number: phoneNumber,
            salary: adminSalary
        };
        registerAdmin(adminData);
    }
    else if(userTypeValue == "user"){
        var userData = {
            email: email,
            password_hash: sha256(password),
            full_name: fullName,
            phone_number: phoneNumber,
            full_address: fullAddress
        };
        registerOwner(userData);
    }

    return true;
  }
  
  
async function registerAdmin(adminData) {
    try {
      const response = await fetch(apiBaseUrl+'/register_admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        console.log('Administrator zarejestrowany pomyślnie:', responseData.message);
        printApiResponse("apiInfoResponse","Administrator zarejestrowany pomyślnie:","levelSucces")
        
      } else {
        printApiResponse("apiInfoResponse",('Błąd podczas rejestracji administratora:', responseData.message),"levelWarning")
        console.error('Błąd podczas rejestracji administratora:', responseData.message);
      }
    } catch (error) {
        printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
        console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
    }
  }
  
async function registerOwner(ownerData) {
    try {
        const response = await fetch(apiBaseUrl+'/register_owner', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(ownerData)
        });
    
        const responseData = await response.json();
        
        if (response.ok) {
            console.log('Właściciel zarejestrowany pomyślnie:', responseData.message);
            printApiResponse("apiInfoResponse","Właściciel zarejestrowany pomyślnie:","levelSucces")
            
          } else {
            printApiResponse("apiInfoResponse",('Błąd podczas rejestracji właściciela:', responseData.message),"levelWarning")
            console.error('Błąd podczas rejestracji właściciela:', responseData.message);
          }
    }catch (error) {
        printApiResponse("apiInfoResponse",('Wystąpił błąd podczas wysyłania żądania:', error.message),"levelWarning")
        console.error('Wystąpił błąd podczas wysyłania żądania:', error.message);
    }
}
  