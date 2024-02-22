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
            login(emailValue, hashedValue)
            .then(response => {
                if(response.message=="Credentials incorrect"){
                    errorElement.textContent = "Auroryzacja nie udana";
                }
                else{
                    localStorage.setItem('user', response.user);
                    localStorage.setItem('admin', response.is_admin);
                    localStorage.setItem('id', response.user_id);
                    window.location.href = 'index.html';
                }
            })
            .catch(error => {
                console.error('Wystąpił błąd:', error);
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

    async function login(email, password) {
        const url = apiBaseUrl + '/login';
    
        const requestData = {
            email: email,
            password_hash: password
        };
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Wystąpił błąd podczas wysyłania żądania:', error);
            return { error: 'Wystąpił błąd podczas wysyłania żądania' };
        }
    }
});
