let indexPage = 1;
let limitCard = 12;

let limitButton = 6;

const params = getParams(window.location.href);
let locationId = params.location;
let categoryId = params.category;
locationId = locationId === undefined ? 0 : locationId;
categoryId = categoryId === '' ? '0' : categoryId;

const user = window.localStorage.getItem('user');
let userBookmark = [];
let allDestination
let destinationSearch = [];


getMethods('/categories/list').then((res) => {
    let xml = ''
    res.forEach(element => {
        xml += `<a href='destination.html?location=${locationId}&category=${element._id}' class='category-card `+(params.category==element._id?'active':'nonActive')+`'> ${element.name} </a>`;
    });
    document.querySelector(".destination-category").innerHTML = xml;
});

getMethods('/locations/getById?id=' + locationId).then((res) => {
    document.querySelector(".destination-hero .image").innerHTML = `
        <img src="${res.image}" alt="">
        <div class="content">
            <h1> ${res.name} </h1>
        </div>
    `;
});

getMethods('/destinations/getByLocationCategory?location='+locationId+'&category=' + categoryId).then((res) => {
    allDestination = res;
    destinationSearch = res;
    if(user !== null){
        getMethods('/clients/bookmark?id=' + JSON.parse(user)._id).then((res) => {
            userBookmark = res;
            loadDestination(allDestination.slice(0, limitCard));
        });
    }
    else loadDestination(allDestination.slice(0, limitCard));
});

const loadDestination = (data) => {
    let xml = ""
    data.forEach((element,index) => {
        xml += `
                <a href="${"detail-destination.html?id=" + element._id}" class="destination-card" style="animation-delay: ${index*0.1}s" >
                    <div class="card-top">
                        <div class="card-bookmark" id="bookmark-${element._id}">
                            ${loadBookMark(element._id)}
                        </div>
                        <div class="card-rate">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>
                            ${element.rate}
                        </div>
                    </div>
                    <div class="card-image">
                        <img src="${element.images[0]}" loading="lazy" alt="Malé, Maldives" class="img-cover">
                    </div>
    
                    <div class="card-content">
                        <h1>${element.name}</h1>
                        <p> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12 2C8.13 2 5 5.13 5 9c0 1.74.5 3.37 1.41 4.84.95 1.54 2.2 2.86 3.16 4.4.47.75.81 1.45 1.17 2.26.26.55.47 1.5 1.26 1.5s1-.95 1.25-1.5c.37-.81.7-1.51 1.17-2.26.96-1.53 2.21-2.85 3.16-4.4C18.5 12.37 19 10.74 19 9c0-3.87-3.13-7-7-7zm0 9.75a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"></path></svg> ${element.address}</p>
                    </div>
                    ${(categoryId==1||categoryId==3)?`<div class="card-price"> ${convertMoney(element.price)} ${categoryId==1?`<span> /ngày </span>`:`<span> /người </span>`} </div>`:""}
                </a>
            `
    });
    document.querySelector(".destination .container").innerHTML = xml;
    loadPagination();
}

const loadBookMark = (id) => {
    let xml = `<button onclick="AddBookmark(event, '${id}')"> 
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5V4.5z"></path></svg>
                </button>`

    if(userBookmark.includes(id)){
        xml = `<button onclick="AddBookmark(event, '${id}')" class="active">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zM6 6a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6z"></path></svg>
                </button>`
    }
    return xml;
}

const AddBookmark = (event, idDes) => {
    event.preventDefault();
    if(user === null){
        Notification.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này!","Close", "Notification.closeNotification()", "Login", "window.location.href='login.html'");
        return;
    }
    else{
        console.log(idDes);
        postMethods('/clients/updateBookmark', {id: JSON.parse(user)._id, idDestination: idDes}).then((res) => {
            if(res.status === 200){
                if(userBookmark.includes(idDes)) userBookmark = userBookmark.filter(item => item !== idDes);
                else userBookmark.push(idDes);
                document.querySelector("#bookmark-"+idDes).innerHTML = loadBookMark(idDes);
            }
        });
    }
}

const loadPagination = () => {
    let totalPage = Math.ceil(destinationSearch.length / limitCard);
    if(totalPage <= 1) return;
    let xml = "<button class='pre-page " + (indexPage<=1?'disabled':'unDisabled')+ "' onclick='changePage("+totalPage+",0,-1)' " + (indexPage<=1?'disabled':'') + "> <svg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 512 512' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><path d='M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z'></path></svg> </button>"
    xml += " <div class='button-container'>";
    for(let i=0; i < Math.min(limitButton, totalPage); i++){
        let x = i;
        if(indexPage > 1) x = i - 1
        if(indexPage + limitButton - 1 > totalPage) x = i - (Math.min(limitButton, totalPage) - (totalPage - indexPage + 1));
        if(limitButton < totalPage && ((i == 0 && indexPage > 1) || ((indexPage + i) === indexPage + limitButton - 1 && indexPage + i - 1< totalPage))){
            xml += `<button class='page' onclick='changePage(${totalPage}, ${indexPage+x},0)'>...</button>`;
        }
        else{
            if(x == 0) xml += `<button class='page active' onclick='changePage(${totalPage}, ${indexPage+x},0)'> ${indexPage + x} </button>`;
            else xml += `<button class='page' onclick='changePage(${totalPage}, ${indexPage+x},0)'> ${indexPage + x} </button>`;
        }
    }
    xml += "</div> <button class='next-page  " + (indexPage>=totalPage?'disabled':'unDisabled')+ "'  onclick='changePage("+totalPage+",0,1)' " + (indexPage>=totalPage?'disabled':'') + "> <svg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 512 512' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><path d='M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z'></path></svg> </button>";
    document.querySelector(".destination .pagination").innerHTML = xml;
}

const changePage = (totalPage, index, n) => {
    if(n == 1){
        if(indexPage + n > totalPage) indexPage = totalPage;
        else indexPage += n;
    }
    else if(n == -1){
        if(indexPage + n < 1) indexPage = 1;
        else indexPage += n;
    }
    else indexPage = index;
    loadDestination(destinationSearch.slice((indexPage-1)*limitCard, indexPage*limitCard));
}

const searchDestination = () => {
    let value = document.querySelector(".destination-search").value;
    if(value === "") destinationSearch = allDestination;
    else{
        destinationSearch = allDestination.filter((element) => {
            return element.name.toLowerCase().includes(value.toLowerCase());
        });
    }
    indexPage = 1;
    loadDestination(destinationSearch.slice(0, limitCard));
}

const onEnterSearch = (event) =>{
    if(event.key === 'Enter'){
        searchDestination();
    }
}