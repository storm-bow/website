let filters = document.querySelector(".hidden");
let rArrow = document.querySelector("#r-a");
let lArrow = document.querySelector("#la");

rArrow.onclick = function(){filtersVisible()}

lArrow.onclick = function(){filtersInvisible()}
    

function filtersVisible(){
    filters.style.display="block";
    rArrow.style.display="none";
    lArrow.style.display="block";
}

function filtersInvisible(){
    filters.style.display="none";
    rArrow.style.display="block";
    lArrow.style.display="none";
}




