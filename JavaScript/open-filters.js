const filters = document.querySelector(".FiltersPopUp");
const rArrow = document.querySelector(".rArrow");
const lArrow = document.querySelector(".lArrow");
const opa = document.querySelector(".row");
var box = document.querySelectorAll('.property-listing');


// Add an event listener to each div element
box.forEach(function(div, index) {
  div.addEventListener('click', function() {
    var newWindow = window.open('listed-item.html');
    newWindow.moveTo((window.screen.width - 400) / 2, (window.screen.height - 300) / 2);
    console.log('Clicked div with index ' + index);
  });
});



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




