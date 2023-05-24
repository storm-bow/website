const filters = document.querySelector(".FiltersPopUp");
const filterShow = document.querySelector(".filter-show");
const filterHide = document.querySelector(".filter-hide");
const opa = document.querySelector(".row");
var box = document.querySelectorAll('.property-listing');

/*
// Add an event listener to each div element
box.forEach(function(div, index) {
  div.addEventListener('click', function() {
    var newWindow = window.open('listed-item.html');
    newWindow.moveTo((window.screen.width - 400) / 2, (window.screen.height - 300) / 2);
    console.log('Clicked div with index ' + index);
  });
});
*/


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
