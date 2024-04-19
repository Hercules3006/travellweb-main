let dataLocation = null;
getMethods('/locations/list').then((res) => {
    dataLocation = res;
    document.querySelector(".location .container").innerHTML = loadLocation(res)
});

const loadLocation = (data) => {
    let xml = "";
    data.forEach((element, index) => {
        xml += `
            <a href="destination.html?location=${element._id}&category=" class="location-card" style="animation-delay: ${index*0.1}s;">
                <div class="location-card-img" data-content="${element.name}">
                    <img src="${element.image}" alt="">
                </div>
                <div class="location-card-content">
                    <h3>${element.name}</h3>
                </div>
            </a>
            `
    });
    return xml;
}

const searchLocation = () => {
    let value = document.querySelector(".location-search").value;
    if(value === "") document.querySelector(".location .container").innerHTML = loadLocation(dataLocation);
    else{
        let result = dataLocation.filter((element) => {
            return element.name.toLowerCase().includes(value.toLowerCase());
        });
        document.querySelector(".location .container").innerHTML = loadLocation(result);
    }
}

const onEnterSearch = (event) =>{
    if(event.key === 'Enter'){
        searchLocation();
    }
}