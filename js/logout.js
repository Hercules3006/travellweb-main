const LogOut = () => {
    let user = localStorage.getItem('user');
    if (user!=null) {
        postMethods("/clients/logout", {id:JSON.parse(user)._id}).then(rs => {
            localStorage.removeItem("user");
            window.location.href = "index.html";
        });
    }
}


