
const arrowAnchor = document.querySelector("#change-section-anchor")

arrowAnchor.addEventListener('mouseover',()=>{
    const arrow = document.querySelector("#change-section-anchor")
    arrow.style.color = "#CDBE78"
})

arrowAnchor.addEventListener('mouseout',()=>{
    const arrow = document.querySelector("#change-section-anchor")
    arrow.style.color = `rgba(255,255,255,0.6)`;
})