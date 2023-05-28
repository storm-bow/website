const filters = document.querySelector(".FiltersPopUp");
const filterShow = document.querySelector(".filter-show");
const filterHide = document.querySelector(".filter-hide");



filterShow.onclick = function(){filtersVisible()}

filterHide.onclick = function(){filtersInvisible()}


function filtersVisible(){
    filters.style.display="block";
    filterShow.style.display="none";
    filterHide.style.display="flex";
}

function filtersInvisible(){
    filters.style.display="none";
    filterShow.style.display="flex";
    filterHide.style.display="none";
}
