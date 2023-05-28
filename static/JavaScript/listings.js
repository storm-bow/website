const next = document.querySelector("#next-page");
const prev = document.querySelector("#prev-page")
let urlParams = new URLSearchParams(window.location.search)
let index = urlParams.get("index")
next.onclick = function(){nextPage()}

let listingCounter = document.querySelectorAll(".listing-content").length;

function nextPage(){
    if(listingCounter>=9){
        index = Number(index) + 1
        console.log(index)
        let url = `/listings?index=${index}`
        window.location = url;
    }
}

prev.onclick = function(){prevPage()}

function prevPage(){
    if(index>=1){
        index = Number(index) - 1
        let url = `/listings?index=${index}`
        window.location = url;
    }

}
