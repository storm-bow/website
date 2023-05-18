const telephone = document.querySelector("#telephone");

telephone.onclick = function(){telephoneVisible()}

function telephoneVisible(){
    telephone.style.display = "none";
    document.getElementById("help").innerHTML ="☏2102222222";
}