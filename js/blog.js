let allBlog 

let indexPage = 1;
let limitCard = 12; 

let limitButton = 6;

const compareDate = (date1, date2) => {
    let d1 = new Date(date1).getTime()
    let d2 = new Date(date2).getTime()
    return d1 < d2;
}

getMethods("/blogs/list").then(rs => {
    allBlog = rs.sort((a,b) => compareDate(a.createdAt, b.createdAt));
    loadBlog(allBlog.slice(0, limitCard));
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
    document.querySelector(".blog .container").innerHTML = xml;
    loadPagination();
}

let user = localStorage.getItem('user');
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

const loadPagination = () => {
    let totalPage = Math.ceil(allBlog.length / limitCard);
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
    document.querySelector(".blog .pagination").innerHTML = xml;
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
    loadBlog(allBlog.slice((indexPage-1)*limitCard, indexPage*limitCard));
}

const writeBlog = () => {
    let user = window.localStorage.getItem('user');
    if(user==null){
        Notification.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này!", "Đóng", "Notification.closeNotification()", "Login", "window.location.href='login.html'");
    }
    else{
        window.location.href = "writeBlog.html";
    }
}