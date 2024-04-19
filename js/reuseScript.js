const serverUrl = "https://backend-travell.onrender.com"

const getMethods = async(url) => {
    const response = await fetch(
        serverUrl + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    );
    const res = await response.json();
    return res.data;
}

const postMethods = async(url, data) => {
    if (data == null) {
        const response = await fetch(
            serverUrl + url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
        return await response.json();
    } else {
        const response = await fetch(
            serverUrl + url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(data)
            }
        );
        return await response.json();
    }
}

const putMethods = async(url, data) => {
    if (data == null) {
        const response = await fetch(
            serverUrl + url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            }
        );
        return await response.json();
    } else {
        const response = await fetch(
            serverUrl + url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(data)
            }
        );
        return await response.json();
    }
}

const deleteMethods = async(url) => {
    const response = await fetch(
        serverUrl + url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
    );
    return await response.json();
}

function getParams(url) {
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
    var obj = {};
    if (queryString) {
        queryString = queryString.split('#')[0];
        var arr = queryString.split('&');
        for (var i = 0; i < arr.length; i++) {
            var a = arr[i].split('=');
            var paramName = a[0];
            var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();
            if (paramName.match(/\[(\d+)?\]$/)) {
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];
                if (paramName.match(/\[\d+\]$/)) {
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    obj[key].push(paramValue);
                }
            } else {
                if (!obj[paramName]) {
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    obj[paramName].push(paramValue);
                }
            }
        }
    }
    return obj;
}

const formatTime = (time) => {
    let minusTime = new Date().getTime() - new Date(time).getTime();
    if (minusTime / 1000 < 60) {
        return Math.floor(minusTime / 1000) + ' seconds ago';
    }
    if (minusTime / 60000 < 60) {
        return Math.floor(minusTime / 60000) + ' minutes ago';
    }
    if (minusTime / 3600000 < 24) {
        return Math.floor(minusTime / 3600000) + ' hours ago';
    }
    if (minusTime / 86400000 < 7) {
        return Math.floor(minusTime / 86400000) + ' days ago';
    }
    return new Date(time).toLocaleDateString();
}

/* show go top btn when scroll window to 500px */

const writeBlogBtn = document.getElementsByClassName('writeBlog')[0];
const footer = document.getElementsByClassName('footer')[0];

const goTopBtn = document.querySelector("[data-go-top]");
const headerBg = document.querySelector(".header");
window.addEventListener("scroll", function() {
    if (window.scrollY >= 500) goTopBtn.classList.add("active")
    else goTopBtn.classList.remove("active");

    if (window.scrollY >= 50) headerBg.classList.add("header-background")
    else headerBg.classList.remove("header-background");
});

const goToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

const convertMoney = (money) => {
    return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
}