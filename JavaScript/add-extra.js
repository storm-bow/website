 

function addExtra(){
    const extra = '<div class="form-row" id="extra1-row"><div class="form-group col-sm">\
    <label>Construction Year</label><input class="form-control" type="number" min="1900" max="2099" step="1" value="2016">\
    </div><div class="form-group col-sm"><label>Floor</label>\
    <input class="form-control" type="number" min="0" max="100" step="1" value="0">\
    </div><div class="form-group col-sm"><label>Number of Floors</label>\
    <input class="form-control" type="number" min="0" max="100" step="1" value="0">\
    </div></div><div class="form-row" id="extra2-row"><div class="form-group col-sm-4"><label>Bathrooms</label>\
    <input class="form-control" type="number" min="0" max="50" step="1" value="1"></div></div>'
    const propertyType = document.getElementById("property-type");
    const option = propertyType.value;
    if(option==="building"){
        document.getElementById('description-container').insertAdjacentHTML('beforebegin', extra);
    }
    else{
        document.getElementById("property-type").value = "land";
        document.getElementById("extra1-row").remove()
        document.getElementById("extra2-row").remove()
    }
}

















