const apiBaseUrl = 'http://localhost:8000';

document.addEventListener('DOMContentLoaded', function () {
    var loginForm = document.getElementById('loginForm');

    var errorElement = document.getElementById('errormessage');


    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        resetValidationMessages();

        var emailValue = document.getElementById('email').value;
        var passwordValue = document.getElementById('password').value;
        const hashedValue = sha256(passwordValue);
        

        var isValid = true;

        if (emailValue.trim() === '') {
            setValidationMessage('email', 'Email jest wymagany');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            setValidationMessage('email', 'Email jest niepoprawny');
            isValid = false;
        }

        if (passwordValue.trim() === '') {
            setValidationMessage('password', 'Hasło jest wymagane');
            isValid = false;
        } /*else if (passwordValue !== correctPassword) {
            setValidationMessage('password', 'Hasło jest niepoprawne');
            isValid = false;
        }*/

        if (isValid) {
            const url = apiBaseUrl + "/user/login/" + emailValue + "/" + hashedValue;
            //fetch(apiBaseUrl + "/user/login/" + {emailValue}+"/"+{hashedValue})
            fetch(url, {
                method: 'POST'
              })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("RESPONSE: ",data)
                // save login and id to local storage
                localStorage.setItem('login', emailValue);
                localStorage.setItem('id', data["id"]);
                errorElement.textContent = "";
                window.location.href = 'admin_panel.html'; // Redirect to index.html
            })
            .catch(error => {
                // Handle login errors
                // For demonstration purposes, we'll just show an alert
                console.log('Login failed: ' + error.message);
                errorElement.textContent = "Auroryzacja nie udana";
            });
        }
    });

    function isValidEmail(email) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function setValidationMessage(fieldId, message) {
        var field = document.getElementById(fieldId);
        field.classList.add('is-invalid');

        var feedbackElement = field.nextElementSibling;
        feedbackElement.textContent = message;
    }

    function resetValidationMessages() {
        var formFields = loginForm.querySelectorAll('.form-control');
        formFields.forEach(function (field) {
            field.classList.remove('is-invalid');

            var feedbackElement = field.nextElementSibling;
            feedbackElement.textContent = '';
        });
    }
    
});
