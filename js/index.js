let carousel
let listImage
let thumbnail 
let userBookmark = []
let user = localStorage.getItem('user');
let allBlog = []

getMethods("/destinations/list").then(rs => {
    if(user !== null){
        getMethods('/clients/bookmark?id=' + JSON.parse(user)._id).then((res) => {
            userBookmark = res;
            handleLoad(rs)
        });
    }
    else handleLoad(rs)
});

const handleLoad = (data) =>{
    document.getElementsByClassName("hero-carousel")[0].innerHTML = loadHomeHero(data);
    carousel = document.querySelector(".hero-carousel");  
    listImage = document.querySelector(".hero-carousel .hero-list-image");
    thumbnail = document.querySelector(".hero-thumbnail");
}

const loadHomeHero = (data) => {
    xml = "<div class='hero-list-image'>"
    xml2 = "<div class='hero-thumbnail'>"
    temp = ""
    for(i=0; i < Math.min(10, data.length); i++){
        xml += `<div class='item'> 
            <div class="hero-image"> <img src="` + data[i].images[0] + `"/> </div>
            <div class="item-content"> 
                <h1>` + data[i].name + `</h1> 
                <p>` + data[i].address + `</p>
                <div class="hero-action">
                    <div id='${"bookmark-"+data[i]._id}'> ${loadBookMark(data[i]._id)} </div>
                    <a href="detail-destination.html?id=` + data[i]._id + `">Xem chi tiết</a>
                </div>
            </div>
        </div>`
        if(i==0){
            temp = `<div class='item'> 
                <img src="` + data[i].images[0] + `"/>
            </div>`
        }
        else{
            xml2 += `<div class='item'> 
                <img src="` + data[i].images[0] + `"/>
            </div>`
        }
    }
    xml += "</div>"
    xml2 += temp + "</div>"
    return xml + xml2 + "<div class='hero-arrows'> <button id='hero-prev' onclick='slideShow(1)'>&#10094;</button><button id='hero-next' onclick='slideShow(-1)'>&#10095;</button> </div>"
}

const timeRunning = 1000
let runTimeOut 
const timeAuto = 6000
let autoTimeOut

autoTimeOut = setTimeout(() => {
    slideShow(1);
}, timeAuto);
let click = false

const slideShow = (n) => {
    if(click) return
    click = true
    let itemShow = document.querySelectorAll(".hero-list-image .item");
    let itemThumbnail = document.querySelectorAll(".hero-thumbnail .item");
    if(n==1){
        carousel.classList.remove("next");
        carousel.classList.remove("prev");
        itemShow[1].querySelector(".hero-image").style.animation = "filterShow 1s forwards";
        listImage.appendChild(itemShow[0]);
        thumbnail.appendChild(itemThumbnail[0]);
        carousel.classList.add("next");
    }
    else{
        carousel.classList.remove("next");
        carousel.classList.remove("prev");
        const last = itemShow.length - 1
        itemShow[0].querySelector(".hero-image").style.animation = "filterShow 1s forwards reverse";
        itemShow[0].querySelector(".hero-image").style.filter = "";
        listImage.prepend(itemShow[last]);
        thumbnail.prepend(itemThumbnail[last]);
        carousel.classList.add("prev");
    }

    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        document.querySelectorAll(".hero-list-image .item")[0].querySelector(".hero-image").style.animation = "";
        carousel.classList.remove("next");
        carousel.classList.remove("prev");
        click = false
    }, timeRunning);

    clearTimeout(autoTimeOut);
    autoTimeOut = setTimeout(() => {
        slideShow(1);
    }, timeAuto);
}

const compareDate = (date1, date2) => {
    let d1 = new Date(date1).getTime()
    let d2 = new Date(date2).getTime()
    return d1 < d2;
}

getMethods("/blogs/list").then(rs => {
    for(let i = rs.length - 1; i >= Math.max(rs.length - 4, 0); i--){
        allBlog.push(rs[i]);  
    }
    document.querySelector(".blog .container").innerHTML = loadBlog(allBlog);
});

const loadBlog = (allBlog) => {
    let xml = ""
    allBlog.forEach(item => {
        xml +=`
            <a href="detail-blog.html?id=${item._id}" class="item">
                <div class="image">
                    <img src="${item.image}" />
                </div> 
                <div class="content">
                    <div class="author">
                        <img src="${item.author.image}"/>
                        <h3>${item.author.userName} </h3>
                        <p>${formatTime(item.createdAt)} </p>
                    </div>
                    <h1>${item.title}</h1>
                    <div class="action">
                        <div class="reaction" id="reaction-${item._id}">
                            ${LoadReactions(item._id, item.reactions)} 
                        </div>
                        <div class="comment">
                            <button> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M144 208c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm112 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zm112 0c-17.7 0-32 14.3-32 32s14.3 32 32 32 32-14.3 32-32-14.3-32-32-32zM256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29 7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160-93.3 160-208 160z"></path></svg> </button> <p>`+ item.comments.length +`</p>
                        </div>
                    </div>
                </div>
            </a>
        `
    });
    return xml;
}

const Test = (event, blogId) => {
    event.preventDefault();
    let con = document.querySelector(`#reaction-${blogId}`);
    console.log(con);
}

const LoadReactions = (blogId, reactions) => {
    let xml = `<button onclick="reactionsBlog(event,'${blogId}')"> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"></path></svg> </button>`;
    if(user!=null){
        let userId = String(JSON.parse(user)._id)
        if(reactions.includes(userId)) xml =`<button onclick="reactionsBlog(event,'${blogId}')"> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg> </button>`
    }
    return xml + `<p> ${reactions.length} </p>`
}

const reactionsBlog = (event, blogId) => {
    event.preventDefault();
    let user = localStorage.getItem('user');
    if (user == null) {
        Notification.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này!", "Quay lại", "window.location.href='index.html'", "Login", "window.location.href='login.html'");
    }
    else{
        let userId = JSON.parse(user)._id
        postMethods('/blogs/updateReaction',{userId: userId, id: blogId}).then(rs => {
            if (rs.status == 200) {
                for(let i=0;i<allBlog.length;i++){
                    if(allBlog[i]._id == blogId){
                        if(allBlog[i].reactions.includes(userId)) allBlog[i].reactions = allBlog[i].reactions.filter(reaction => reaction != userId)
                        else allBlog[i].reactions.push(userId)
                        document.querySelector(`#reaction-${blogId}`).innerHTML = LoadReactions(blogId, allBlog[i].reactions)
                        break
                    }
                }
            }
        });
    }
}

const loadBookMark = (id) => {
    let xml = `<button onclick="AddBookmark(event, '${id}')"> 
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M2 15.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v13.5zM8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"></path></svg>    
                </button>`

    if(userBookmark.includes(id)){
        xml = `<button onclick="AddBookmark(event, '${id}')" class="active">
                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m3.232 2.175 18.5 15.5a.75.75 0 1 1-.964 1.15L19 17.343v3.907a.75.75 0 0 1-1.218.585L12 17.21l-5.781 4.626A.75.75 0 0 1 5 21.253L4.947 5.569 2.268 3.325a.75.75 0 1 1 .964-1.15ZM7.421 2h9.829c.966 0 1.75.784 1.75 1.75v8.073a.75.75 0 0 1-1.232.575L6.94 3.325A.75.75 0 0 1 7.421 2Z"></path></svg>
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

