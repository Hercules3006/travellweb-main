let indexPage = 1;
let limitCard = 12;

let limitButton = 6;

let querySearch = ""
let allDestination
let destinationSearch = [];
let categoryId = 0
let allCategory = []

getMethods('/categories/list').then((res) => {
    allCategory = res
    loadCategory()
});

const loadCategory = () => {
    let xml = ''
    allCategory.forEach(element => {
        xml += `<button class='category-card ${"category"+element._id}  ${element._id == categoryId?'active':'nonActive'}' onclick="changeCategory(${element._id})"> ${element.name} </button>`;
    });
    document.querySelector(".destination-category").innerHTML = xml;
}

const changeCategory = (n)=>{
    console.log(n)
    categoryId = n
    loadCategory()
    filterDestination(querySearch, categoryId)
    console.log(destinationSearch)
    loadDestination(destinationSearch.slice((indexPage-1)*limitCard,indexPage*limitCard));
}

const user = window.localStorage.getItem('user');
if (user == null) {
    Notification.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này!", "Quay lại", "window.location.href='index.html'", "Login", "window.location.href='login.html'");
}
else {
    getMethods('/destinations/getByBookmark?id='+JSON.parse(user)._id).then((res) => {
        console.log(res)
        allDestination = res;
        filterDestination(querySearch,categoryId)
        loadDestination(destinationSearch.slice(0, limitCard));
    });
}

const loadDestination = (data) => {
    let xml = ""
    data.forEach((element,index) => {
        xml += `
                <a href="${"detail-destination.html?id=" + element._id}" class="destination-card" style="animation-delay: ${index*0.1}s" >
                    <div class="card-top">
                        <div class="card-bookmark">
                            <button onclick="AddBookmark(event, '${element._id}')" class="active">
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zM6 6a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6z"></path></svg>
                            </button>
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
                    ${(element.category==1||element.category==3)?`<div class="card-price"> ${convertMoney(element.price)} ${element.category==1?`<span> /ngày </span>`:`<span> /người </span>`} </div>`:""}
                </a>
            `
    });

    const EmptyContainer = document.querySelector(".destination .empty-container")
    if(xml == ""){
        if(querySearch =="") EmptyContainer.innerHTML = emptyBox("Trống!", "Có vẻ như bạn chưa thêm địa điểm nào vào bộ sưu tập", `<Button onclick="window.location.href='location.html'"> Khám phá ngay </button>`)
        else EmptyContainer.innerHTML = emptyBox("Không tìm thấy!", "Có vẻ như không có địa điểm nào phù hợp với yêu cầu của bạn")
    }
    else EmptyContainer.innerHTML = "";
    document.querySelector(".destination .container").innerHTML = xml;
    loadPagination();
}

const AddBookmark = (event, idDes) => {
    event.preventDefault();
    if(user === null){
        Notification.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này!","Close", "Notification.closeNotification()", "Login", "window.location.href='login.html'");
        return;
    }
    else{
        postMethods('/clients/updateBookmark', {id: JSON.parse(user)._id, idDestination: idDes}).then((res) => {
            if(res.status === 200){
                allDestination = allDestination.filter((ele)=> ele._id != idDes)
                filterDestination(querySearch, categoryId)
                loadDestination(destinationSearch.slice((indexPage-1)*limitCard,indexPage*limitCard));
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
    querySearch = value
    filterDestination(querySearch, categoryId)
    indexPage = 1;
    loadDestination(destinationSearch.slice(0, limitCard));
}

const onEnterSearch = (event) =>{
    if(event.key === 'Enter'){
        searchDestination();
    }
}

const filterDestination = (query, categoryId) => {
    if(query=="") destinationSearch = allDestination
    else{
        destinationSearch = allDestination.filter((element) => {
            return element.name.toLowerCase().includes(query.toLowerCase());
        });
    }
    destinationSearch = destinationSearch.filter((element)=>element.category==categoryId);
}

const emptyBox = (title, message, action = "")=>{
    return `
        <div class="empty-box">
            <div class="left">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M511.9 175c-9.1-75.6-78.4-132.4-158.3-158.7C390 55.7 416 116.9 416 192h28.1L327.5 321.5c-2.5-.6-4.8-1.5-7.5-1.5h-48V192h112C384 76.8 315.1 0 256 0S128 76.8 128 192h112v128h-48c-2.7 0-5 .9-7.5 1.5L67.9 192H96c0-75.1 26-136.3 62.4-175.7C78.5 42.7 9.2 99.5.1 175c-1.1 9.1 6.8 17 16 17h8.7l136.7 151.9c-.7 2.6-1.6 5.2-1.6 8.1v128c0 17.7 14.3 32 32 32h128c17.7 0 32-14.3 32-32V352c0-2.9-.9-5.4-1.6-8.1L487.1 192h8.7c9.3 0 17.2-7.8 16.1-17z"></path></svg>
            </div>
            <div class="right">
                <h1> ${title} </h1>
                <p> ${message} </p>
                ${action}
            </div>
        </div>
    `
}