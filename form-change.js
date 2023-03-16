const lButton = document.getElementById("l-button");
const rButton = document.getElementById("r-button");
const lButtonContainer = document.getElementById("l-button-container");
const rButtonContainer = document.getElementById("r-button-container");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

lButton.addEventListener("click", function onClick(){
    rButtonContainer.style.backgroundColor = 'rgba(169, 169, 169, 0.1)';
    rButton.style.backgroundColor = 'rgba(169, 169, 169, 0)';
    rButtonContainer.style.border = "none";
    rButtonContainer.style.borderBottom = "solid";
    lButtonContainer.style.border =  "none";
    lButtonContainer.style.borderRight = "solid";
    lButtonContainer.style.backgroundColor = "white";
    registerForm.style.display = "none";
    loginForm.style.display = "block";
});
rButton.addEventListener("click", function onClick(){
    lButtonContainer.style.backgroundColor = 'rgba(169, 169, 169, 0.1)';
    lButton.style.backgroundColor = 'rgba(169, 169, 169, 0)';
    lButtonContainer.style.border =  "none";
    lButtonContainer.style.borderBottom = "solid";
    rButtonContainer.style.backgroundColor = "white"
    rButtonContainer.style.border= "none";
    rButtonContainer.style.borderLeft = "solid";
    loginForm.style.display = "none";
    registerForm.style.display = "block";
});