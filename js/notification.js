let notificationTimeOut = null;
const Notification = {
    closeNotification: () => {
        let element = document.querySelectorAll(".notification-container") 
        clearTimeout(notificationTimeOut);
        if(!element) return;
        for(let i=0; i<element.length; i++){
            element[i].classList.remove("active");
            setTimeout(()=>{element[i].classList.add("nonActive")}, 0);
            setTimeout(()=>{element[i].remove(), enableScroll()}, 300);
        }
    },
    getIcon: (type) => {
        if(type == "alert") return `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path><path d="M4 2C2.8 3.7 2 5.7 2 8"></path><path d="M22 8c0-2.3-.8-4.3-2-6"></path></svg>`;
        if(type == "warning") return `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`;
        if(type == "error") return `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>`;
        if(type == "success") return `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 48a208 208 0 1 1 0 416 208 208 0 1 1 0-416zm0 464A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L369 209z"></path></svg>`;
    },
    commonNotification: (type, title, message, titleLeft, actionLeft, titleRight = null, actionRight = null) => {
        if(document.querySelector(".notification-container")){
            Notification.closeNotification();
        }
        disableScroll();

        document.body.insertAdjacentHTML('beforeend', `
            <div class="notification-container active">
                <div class="notification-content">
                    <div class="notification-header ${type+'-header'}">
                        ${Notification.getIcon(type)}
                    </div>
                    <div class="notification-body">
                        <h1>${title}</h1>
                        <p>${message}</p>
                    </div>
                    <div class="notification-footer ${type+'-footer'}">
                        <button class="action" onclick=${actionLeft}>${titleLeft}</button>
                        ${actionRight!=null?`<button class="action" onclick=${actionRight}> ${titleRight} </button>`:""}
                    </div>
                </div>
            </div>
        `);
    },

    alert: (title, message, titleLeft, actionLeft, titleRight = null, actionRight = null) => {
        Notification.commonNotification("alert", title, message, titleLeft, actionLeft, titleRight, actionRight);
    },

    warning: (title, message, titleLeft, actionLeft, titleRight = null, actionRight = null) => {
        Notification.commonNotification("warning", title, message, titleLeft, actionLeft, titleRight, actionRight);
    },

    error: (title, message, titleLeft, actionLeft, titleRight = null, actionRight = null) => {
        Notification.commonNotification("error", title, message, titleLeft, actionLeft, titleRight, actionRight);   
    },

    success: (title, message, titleLeft, actionLeft, titleRight = null, actionRight = null, timeOut = true) => {
        Notification.commonNotification("success", title, message, titleLeft, actionLeft, titleRight, actionRight);
        if(timeOut) notificationTimeOut = setTimeout(()=>{Notification.closeNotification()}, 5000);
    }
}

function disableScroll() {
    scrollTop = document.documentElement.scrollTop;
    scrollLeft = document.documentElement.scrollLeft,

    window.onscroll = function () {
        window.scrollTo(scrollLeft, scrollTop);
    };
}

function enableScroll() {
    window.onscroll = function () { };
}