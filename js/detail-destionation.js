const params = getParams(window.location.href);
let destinationId = params.id;
let detailDestination;
const user = window.localStorage.getItem('user');
let userBookmark = [];

getMethods('/destinations/getById?id=' + destinationId).then((res) => {
    detailDestination = res;
    console.log(res);
    document.querySelector('.detail-destination-hero').innerHTML = `
        <div class="detail-destination-hero__image">
            <img src="${res.images[0]}" alt="">
        </div>
        <div class="detail-destination-hero__content">
            <h1 class="detail-destination-hero__title">${res.name}</h1>
            <button onclick="showBooking()">Book now</button>
        </div>
    `;

    let xml = "";
    res.images.forEach((image) => {
        xml += `<div class="item"> <img src="${image}" alt=""> </div>`;
    });
    document.querySelector('.detail-destination .image-slide .thumbnail').innerHTML = xml;

    if(user !== null){
        getMethods('/clients/bookmark?id=' + JSON.parse(user)._id).then((bookMark) => {
            userBookmark = bookMark;
            loadContent(res);
        });
    }
    else loadContent(res);
});

const loadContent = (data) => {
    document.querySelector('.detail-destination .content').innerHTML = `
        <div class="top">
            <div class="rate">
                ${loadRate(data.rate)} <span>${data.rate}/5 </span>
            </div>
            ${loadBookMark(data)}
        </div>

        <div class="info">
            <div class="title"> ${data.name} </div>
            <div class="address">
                <span><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 32C167.67 32 96 96.51 96 176c0 128 160 304 160 304s160-176 160-304c0-79.49-71.67-144-160-144zm0 224a64 64 0 1 1 64-64 64.07 64.07 0 0 1-64 64z"></path></svg> ${data.address}</span>
            </div>
           
            ${data.category == 1 || data.category == 3 ? 
                `<div class="price">
                    <p>${convertMoney(data.price)} ${data.category==1?`<span> /ngày </span>`:`<span> /người </span>`}</p>
                </div>
                `
                : ""
            }
        </div>

        <div class="description-container">
            <span> Mô tả </span>
            <div class="description limit">${data.description}</div>
            <button class="read-more" onclick="readMore()"> Read more </button>
        </div>
    `;
}

const changeSlide = (n) => {
    let thumbnail = document.querySelector('.detail-destination .image-slide .thumbnail');
    let thumbnailItem = document.querySelectorAll('.detail-destination .image-slide .thumbnail .item');
    if(n == -1) {
        thumbnail.appendChild(thumbnailItem[0]);
    }
    else {
        thumbnail.insertBefore(thumbnailItem[thumbnailItem.length - 1], thumbnailItem[0]);
    }
}

const readMore = () => {    
    let description = document.querySelector('.detail-destination .description')
    description.classList.toggle('limit');
    document.querySelector(".read-more").innerHTML = description.classList.contains('limit') ? "Read more" : "Read less";
}

const loadRate = (rate) => {
    let xml = "";
    for (let i = 0; i < 5; i++) {
        if (i < rate) {
            xml += `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path></svg>`;
        }
        else {
            xml += `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M528.1 171.5L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6zM388.6 312.3l23.7 138.4L288 385.4l-124.3 65.3 23.7-138.4-100.6-98 139-20.2 62.2-126 62.2 126 139 20.2-100.6 98z"></path></svg>`;
        }
    }
    return xml;
}

const loadBookMark = (data) => {
    let xml = `<button onclick="AddBookmark('${data._id}')"> 
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zm6.5-11a.5.5 0 0 0-1 0V6H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V7H10a.5.5 0 0 0 0-1H8.5V4.5z"></path></svg>
                </button>`

    if(userBookmark.includes(data._id)){
        xml = `<button onclick="AddBookmark('${data._id}')" class="active">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M2 15.5V2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.74.439L8 13.069l-5.26 2.87A.5.5 0 0 1 2 15.5zM6 6a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1H6z"></path></svg>
                </button>`
    }
    return xml;
}

const AddBookmark = (idDes) => {
    if(user === null){
        Notification.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này!","Close", "Notification.closeNotification()", "Login", "window.location.href='login.html'");
        return;
    }
    else{
        postMethods('/clients/updateBookmark', {id: JSON.parse(user)._id, idDestination: idDes}).then((res) => {
            if(res.status === 200){
                if(userBookmark.includes(idDes)) userBookmark = userBookmark.filter(item => item !== idDes);
                else userBookmark.push(idDes);
                loadContent(detailDestination);
            }
        });
    }
}


const closeBooking = () => {
    let element = document.querySelectorAll(".Booking-Container") 
    if(!element) return;
    for(let i=0; i<element.length; i++){
        element[i].classList.remove("active");
        setTimeout(()=>{element[i].classList.add("nonActive")}, 0);
        setTimeout(()=>{element[i].remove()}, 300);
    }
}

const showBooking = () => {
    if(user === null){
        Notification.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này!","Close", "Notification.closeNotification()", "Login", "window.location.href='login.html'");
        return;
    }
    document.body.insertAdjacentHTML('beforeend', `
        <div class="Booking-Container active">
            <div class="Booking-Content">
                <div class="Booking-Header">
                    <h2>Đặt Tour</h2>
                    <button onclick="closeBooking()"> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg> </button>
                </div>
                <div class="Booking-Body">
                    <div class="Booking-Form-Group">
                        <label for="date">Ngày khởi hành</label>
                        <input type="datetime-local" id="startDate" name="date" required>
                    </div>
                    <div class="Booking-Form-Group">
                        <label for="date"> Ngày kết thúc </label>
                        <input type="datetime-local" id="endDate" name="date" required>
                    </div>
                    <div class="Booking-Form-Group">
                        <label for="quantity">Số người</label>
                        <input type="number" id="quantity" name="quantity" required>
                    </div>
                    <div class="Booking-Form-Group">
                        <label for="note">Ghi chú</label>
                        <textarea name="note" id="note" cols="30" rows="10"></textarea>
                    </div>
                    <button onclick="handleBooking()">Đặt Ngay</button>
                </div>
            </div>
        </div>
    `);
}

const handleBooking = () => {
    let startDate = document.querySelector("#startDate").value;
    let endDate = document.querySelector("#endDate").value;
    let quantity = document.querySelector("#quantity").value;
    let note = document.querySelector("#note").value;
    let id = JSON.parse(user)._id;
    let idDes = detailDestination._id;

    postMethods('/orders/create', {idDestination: idDes, idClient: id, startDate: startDate, endDate: endDate, quantity: quantity, note: note}).then((res) => {
        if(res.status === 200){
            Notification.success("Thông báo", "Đặt tour thành công", "Close", "Notification.closeNotification()");
        }
        else{
            Notification.error("Thất bại", res.message , "Close", "Notification.closeNotification()");
        }
    });
}

