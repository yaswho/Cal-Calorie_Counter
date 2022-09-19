var password = document.getElementById("password"), 
        confirm_password = document.getElementById("confirm_password");

function validatePassword(){
    if(password.value != confirm_password.value) {
            confirm_password.setCustomValidity("As senhas não coincidem.");
            document.getElementById("btn").disabled = true;
        } else {
            confirm_password.setCustomValidity('');
            document.getElementById("btn").disabled = false;
        }
    }

password.addEventListener('change', validatePassword)
confirm_password.addEventListener('change', validatePassword)