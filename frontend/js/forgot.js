document.addEventListener('DOMContentLoaded', function () {
    var loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();

        resetValidationMessages();

        var emailValue = document.getElementById('email').value;
        var feedbackElement = document.getElementById('feedback');

        var isValid = true;

        if (emailValue.trim() === '') {
            setValidationMessage('email', 'Adres email jest wymagany');
            isValid = false;
        } else if (!isValidEmail(emailValue)) {
            setValidationMessage('email', 'Adres email jest niepoprawny');
            isValid = false;
        }

        if (isValid) {
            // Jeśli dane nie są poprawne, wyświetl komunikat w elemencie o id "feedback"
            feedbackElement.textContent = 'Na podany email wysłano link do resetu hasła';
            loginForm.reset();
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

        // Zresetuj także komunikat w elemencie o id "feedback"
        document.getElementById('feedback').textContent = '';
    }
});