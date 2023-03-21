const lButton = document.getElementById("l-button");
const rButton = document.getElementById("r-button");
const lButtonContainer = document.getElementById("l-button-container");
const rButtonContainer = document.getElementById("r-button-container");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
/*
lButton.addEventListener("click", function onClick(){
    rButtonContainer.style.backgroundColor = 'rgba(169, 169, 169, 0.1)';
    rButton.style.backgroundColor = 'rgba(169, 169, 169, 0)';
    rButtonContainer.style.border = "none";
    rButtonContainer.style.borderBottom = "solid";
    lButtonContainer.style.backgroundColor = "white";
    lButtonContainer.style.border =  "none";
    lButtonContainer.style.borderRight = "solid";
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
*/
function changeForm(pressedButton) {
    let otherButton;
    let pressedButtonContainer;
    let otherButtonContainer;
    if(pressedButton===lButton){
        otherButton = rButton;
        pressedButtonContainer = lButtonContainer;
        otherButtonContainer = rButtonContainer;
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    }
    else{
        otherButton = lButton;
        pressedButtonContainer = rButtonContainer;
        otherButtonContainer = lButtonContainer;
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    }
    otherButtonContainer.style.backgroundColor = 'rgba(169, 169, 169, 0.1)';
    otherButton.style.backgroundColor = 'rgba(169, 169, 169, 0)';
    otherButtonContainer.style.border =  "none";
    otherButtonContainer.style.borderBottom = "solid";
    pressedButtonContainer.style.backgroundColor = "white"
    pressedButtonContainer.style.border= "none";
    if(pressedButton===lButton){
        pressedButtonContainer.style.borderRight = "solid";
    }
    else{
        pressedButtonContainer.style.borderLeft = "solid";
    }
}

rButton.addEventListener("click", function onClick(){changeForm(rButton)});
lButton.addEventListener("click", function onClick(){changeForm(lButton)});