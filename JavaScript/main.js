const arrowAnchor = document.querySelector("#change-section-anchor")

arrowAnchor.addEventListener('mouseover',()=>{
    const arrow = document.querySelector("#change-section-anchor")
    arrow.style.color = "#CDBE78"
})

arrowAnchor.addEventListener('mouseout',()=>{
    const arrow = document.querySelector("#change-section-anchor")
    arrow.style.color = `rgba(255,255,255,0.6)`;
})

const section1 = document.querySelector("#section1");

section1.addEventListener('mousemove',(e) => {
    const vh = window.innerHeight;
    const y = e.clientY;
    if(100*y/vh>= 60){
        arrowAnchor.style.setProperty("display","block","important")
    }
    else{
        arrowAnchor.style.setProperty("display","none","important")

    }
})
