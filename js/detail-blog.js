let params = getParams(window.location.href);
let detailBlog
const LoadData = async () => {
    if (params['id']) {
        await getMethods('/blogs/getDetailById?id='+ params['id']).then(detail => {
            detailBlog = detail;

            let user = localStorage.getItem('user');
            let deleteBlog = "";
            if(user!=null) deleteBlog = detail.author._id == JSON.parse(user)._id ? "<button class='btn-delete-comment' onclick='DeleteBlog()'> <svg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><path fill='none' d='M0 0h24v24H0V0z'></path><path d='M14.12 10.47 12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z'></path></svg> </button>" : "";
            let html = `
                        <div class="author-infor">
                            <div class="author-avatar">
                                <img src="${detail.author.image!=''?detail.author.image:'../image/defaultAvata.jpg'}" width="30" height="30" alt="Jony bristow">
                            </div>
                            <div>
                                <p class="author-name"> ${detail.author.userName} </p>  
                                <p class="author-role"> ${detail.author.role} </p>
                                <p class="create-time"> ${formatTime(detail.createdAt)} </p>
                            </div>
                    
                            <div class="reaction">
                                ${LoadReactions(detail.reactions, null)}
                                ${deleteBlog}
                            </div>
                        </div>
                        
                        <div class="blog-title"> ${detail.title} </div>
                        <div class="blog-content">
                            ${detail.content}
                        </div>
                    `
            
            document.getElementsByClassName('detailContent')[0].innerHTML = html;
            LoadComment(detail.comments);
        });
    }
}

const LoadReactions = (reactions, commentId) => {
    let xml = "";
    let icon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M458.4 64.3C400.6 15.7 311.3 23 256 79.3 200.7 23 111.4 15.6 53.6 64.3-21.6 127.6-10.6 230.8 43 285.5l175.4 178.7c10 10.2 23.4 15.9 37.6 15.9 14.3 0 27.6-5.6 37.6-15.8L469 285.6c53.5-54.7 64.7-157.9-10.6-221.3zm-23.6 187.5L259.4 430.5c-2.4 2.4-4.4 2.4-6.8 0L77.2 251.8c-36.5-37.2-43.9-107.6 7.3-150.7 38.9-32.7 98.9-27.8 136.5 10.5l35 35.7 35-35.7c37.8-38.5 97.8-43.2 136.5-10.6 51.1 43.1 43.5 113.9 7.3 150.8z"></path></svg>`;

    let user = localStorage.getItem('user');
    if(user!=null){
        let userId = String(JSON.parse(user)._id)
        if(reactions.includes(userId)) icon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"></path></svg>`
    }
    if(commentId == null) xml += `<button class="btn-reaction" onclick="handleReactionsBlog()"> ${icon} </button> <span>${reactions.length}</span> `
    else xml += `<button class="btn-reaction" onclick="handleReactionsComment('${commentId}')"> ${icon} </button> <span>${reactions.length}</span> `
    return xml;
}

const LoadComment = (comments) => {
    comments = comments.sort((a, b) => { return new Date(b.createdAt) - new Date(a.createdAt);});
    let user = localStorage.getItem('user');
    let userId = null;
    if (user != null) userId = JSON.parse(user)._id
    let xml = ""
    comments.forEach(comment => {
        xml+=   `<li class="comment-card" id="${String(comment._id)}">
                ${CommentXml(comment,true,userId)}
                <ul class="reply-list" id="reply-list-${comment._id}" >
                    ${comment.replys.map(reply => {
                        return `
                            <li class="reply-card" id="${reply._id}">
                                ${CommentXml(reply,false,userId)}
                            </li>
                        `
                    }).join('')}
                </ul>
            </li>
        `
    });
    document.getElementsByClassName('comment-list')[0].innerHTML = xml;
}

const CommentXml = (comment, showReply, userId) => {
    let reply = showReply?"<button class='btn-reply' onclick='LoadReplyForm(\"" + comment._id + "\")'> Reply </button>" : "";
    let deleteComment = comment.author._id == userId ? "<button class='btn-delete-comment' onclick='DeleteComment(\"" + comment._id + "\")'> <svg stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><path fill='none' d='M0 0h24v24H0V0z'></path><path d='M14.12 10.47 12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z'></path></svg> </button>" : "";

    return `
            <div class="author-infor">
                <div class="author-avatar">
                    <img src="${comment.author.image!=''?comment.author.image:'../image/defaultAvata.jpg'}" width="30" height="30" alt="Jony bristow">
                </div>
                <div>
                    <p class="author-name"> ${comment.author.userName} </p>  
                    <p class="create-time"> ${formatTime(comment.createdAt)} </p>
                </div>

                <div class="reaction">
                    ${LoadReactions(comment.reactions, comment._id)}
                </div>

                ${reply}
                ${deleteComment}
            </div>

            <div class="comment-content">
                ${comment.content}
            </div>
    `
}

const LoadReplyForm = (commentId) => {
    if(document.getElementById("reply-for-"+commentId) != null) return;
    document.getElementById("reply-list-"+commentId).innerHTML += `
        <div class="form-comment form-reply" id="reply-for-${commentId}" onclick="CommentLineFocus('${commentId}')">
            <div class="comment-line" id="comment-line-${commentId}" contenteditable="true" placeholder="Trả lời ..."></div>
            <div class="btn-group"> 
                <button class="btn btn-delete-reply" onclick="RemoveReplyForm('${commentId}')"> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0V0z"></path><path d="M14.12 10.47 12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"></path></svg> </button>
                <button class="btn btn-send-reply" onclick="SendComment('comment-line-${commentId}','${commentId}')"> <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg></button>
            </div>
        </div>
    `
}

const RemoveReplyForm = (commentId) => {
    document.getElementById("reply-for-"+commentId).remove();
}

const CommentLineFocus = (id) => {
    document.getElementById("comment-line-"+id).focus();
}

const DeleteBlog = async () => {
    Notification.warning("Thông báo", "Bạn có chắc chắn muốn xóa bài viết này?", "Hủy", "Notification.closeNotification()", "Xóa", "handleDeleteBlog()");
}

const handleDeleteBlog = () => {  
    deleteMethods('/blogs/delete?id='+params['id']).then(res => {
        if (res.status == 200) window.location.href = "blog.html";
        else Notification.error("Thông báo", "Xóa thất bại!", "Đóng", "Notification.closeNotification()");
    });
}

const DeleteComment = (commentId) => {
    Notification.warning("Thông báo", "Bạn có chắc chắn muốn xóa bình luận này?", "Hủy", "Notification.closeNotification()", "Xóa", "handleDeleteComment('"+commentId+"')");
}

const handleDeleteComment = (commentId) => {
    deleteMethods('/comments/delete?id='+commentId).then(res => {
        if (res.status == 200) location.reload();
        else Notification.error("Thông báo", "Xóa thất bại!", "Đóng", "Notification.closeNotification()");
    });
}

const SendComment = async (objId, replyId) => {
    let user = localStorage.getItem('user');
    if (user != null) {
        let comment = document.getElementById(objId).innerHTML;
        if(comment == ''){
            Notification.warning("Thông báo", "Vui lòng không để trống!", "Đóng", "Notification.closeNotification()");
            return;
        }
        postMethods('/comments/create',{ authorId: JSON.parse(user)._id, blogId: params['id'], replyId: replyId, content: comment }).then(res => {
            if (res.status == 200) location.reload();
            else Notification.error("Thông báo", "Bình luận thất bại!", "Đóng", "Notification.closeNotification()");
        });
    }
    else Notification.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này!", "Quay lại", "window.location.href='index.html'", "Login", "window.location.href='login.html'");
}

const handleReactionsBlog = () => {
    let user = localStorage.getItem('user');
    if (user != null) {
        postMethods('/blogs/updateReaction',{id: params['id'], userId: JSON.parse(user)._id}).then(rs => {
            if(rs.status == 200){
                location.reload();
            }
        });
    }
    else Notification.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này!", "Quay lại", "window.location.href='index.html'", "Login", "window.location.href='login.html'"); 
}

const handleReactionsComment = (commentId) => {
    let user = localStorage.getItem('user');
    if (user != null) {
        postMethods('/comments/updateReaction',{userId:JSON.parse(user)._id, id: commentId}).then(rs => {
            if (rs.status == 200) {
                location.reload();
            }
        });
    }
    else Notification.alert("Thông báo", "Bạn cần đăng nhập để thực hiện hành động này!", "Quay lại", "window.location.href='index.html'", "Login", "window.location.href='login.html'");
}


document.getElementsByClassName("form-comment")[0].addEventListener('click', () => {
    document.getElementsByClassName("comment-line")[0].focus();
});

document.getElementsByClassName("btn-comment")[0].addEventListener('click', () => {
    SendComment("main-comment-line",null);
});

LoadData();
