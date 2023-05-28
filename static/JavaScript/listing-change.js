const listingType = document.querySelector("#property-type")
listingType.addEventListener("change",(event)=>{
    if(event.target.value === "residential"){
        window.location.replace("/make-listing?type=residential");
    }
    if(event.target.value === "commercial"){
        window.location.replace("/make-listing?type=commercial");
    }
})

















