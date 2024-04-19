const user = window.localStorage.getItem('user');
let desStatus = 0;
let allOrder = [];

if (user == null) {
    Notification.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này!", "Quay lại", "window.location.href='index.html'", "Login", "window.location.href='login.html'");
}
else {
    getMethods('/orders/getByClientId?id='+JSON.parse(user)._id).then((res) => {
        allOrder = res;
        loadOrder(res);
    });
}

const changeStatus = (status) => {
    document.querySelector('.order-hero .order-status .active').classList.remove('active');
    document.querySelector('.order-hero .order-status .status-'+status).classList.add('active');
    desStatus = status;
    loadOrder(allOrder);
}

const loadOrder = (data) => {
    let xml = "";
    let timeNow = new Date().getTime()
    data.forEach((item) => {
        if(desStatus == -1){
            if(item.status != 1){
                let desEndTime = new Date(item.endDate).getTime();
                if(timeNow > desEndTime) xml += element(item)
            }
        }
        else if(item.status == desStatus) {
            xml += element(item)
        }
    });
    if(xml == ""){
        if(desStatus == 0) xml = emptyBox("Trống!", "Có vẻ như bạn chưa có đơn hàng nào", `<Button onclick="window.location.href='location.html'"> Khám phá ngay </button>`)
        if(desStatus == -1) xml = emptyBox("Trống!", "Có vẻ như bạn chưa hoàn thành đơn hàng nào", `<Button onclick="window.location.href='location.html'"> Khám phá ngay </button>`)
        if(desStatus == 1) xml = emptyBox("Tuyệt vời!", "Bạn chưa hủy đơn nào!")
    }
    document.querySelector('.order .container').innerHTML = xml;
}   

const element = (item) =>{
    return `<div class="order-item">
                <div class="left">
                    <img src="${item.idDestination.images[0]}"/>
                </div>
                <div class="right">
                    <div class="order-id">Mã đơn: ${item._id}</div>
                    <div class="order-info">
                        <div class="name"> ${item.idDestination.name} </div>
                        <div class="rate"> ${loadRate(item.idDestination.rate)} </div>
                        <div class="order-detail-item">
                            <span> Số lượng: </span>
                            <p> ${item.quantity} <p>
                        </div>
                        <div class="order-detail-item">
                            <span> Ngày đặt hàng: </span>
                            <p> ${new Date(item.createdAt).toLocaleString()} <p>
                        </div>
                        <div class="order-detail-item">
                            <span> Ngày nhận hàng: </span>
                            <p>${new Date(item.startDate).toLocaleString()}</p>
                        </div>
                        <div class="order-detail-item">
                            <span> Ngày nhận hàng: </span>
                            <p>${new Date(item.endDate).toLocaleString()}</p>
                        </div>
                        ${calculateTotal(item)}
                    </div>
                    <div class="action">
                        <button class="btn" onclick="window.location.href='detail-destination.html?id=${item.idDestination._id}'">  ${(desStatus==-1||desStatus==1)?"Đặt lại chuyến đi":"Xem địa điểm"}</button>
                        ${desStatus==0?`<button class="btn" onclick="comfirmCancelOrder('${item._id}')">Hủy đơn</button>`:""}
                    </div>
                </div>
            </div>`
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

const calculateTotal = (data) => {
    if(data.idDestination.category == 1) {
        let st = new Date(data.startDate).getTime();
        let et = new Date(data.endDate).getTime();
        let price = (et - st) / (1000 * 3600 * 24) * data.idDestination.price * data.quantity;
        return `<div class="order-detail-item">
                    <span>Tổng tiền</span>
                    <p> ${convertMoney(Math.round(price/1000) * 1000)} </p>
                </div>`
    }
    else {
        return `<div class="order-detail-item">
                    <span>Tổng tiền</span>
                    <p> ${convertMoney(Math.round(data.idDestination.price * data.quantity/1000)*1000)} </p>
                </div>`
    }
}

const comfirmCancelOrder = (id) => {
    Notification.warning("Hủy chuyến đi", "Bạn có chắc chắn muốn hủy chuyến đi này?", "Không", "Notification.closeNotification()", "Có", "cancelOrder('"+id+"')");
}

const cancelOrder = (id) => {
    console.log(id);
    postMethods('/orders/cancelOrder',{id:id}).then((res) => {
        if (res.status == 200) {
            Notification.success("Thông báo", "Hủy đơn thành công!", "Đóng", "Notification.closeNotification()");
            for(let i = 0; i< allOrder.length;i++){
                if(allOrder[i]._id == id){
                    allOrder[i].status = 1;
                    break;
                }
            }
            loadOrder(allOrder);
        }
        else {
            Notification.error("Thông báo", "Hủy đơn thất bại!", "Đóng", "Notification.closeNotification()");
        }
    });
}