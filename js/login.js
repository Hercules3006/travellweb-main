const login = () => {
  const email = document.querySelector(".input-email").value;
  const password = document.querySelector(".input-password").value;
  if (email === "" || password === "") {
    Notification.warning("Thông báo", "Vui lòng điền đủ thông tin!", "Đóng", "Notification.closeNotification()");
    return;
  } 
  postMethods("/clients/login", {email: email,password: password}).then(rs => {
    if(rs.status == 200){
      saveToLocalStorage("user", rs.data);
      window.location.href = "index.html";
    }
    else Notification.error("Đăng nhập thất bại", rs.message, "Đóng", "Notification.closeNotification()");
  });
}

// save to local storage

const saveToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
}

// check is already login
const LoadUser = () => {
  let user = localStorage.getItem('user');
  if (user!=null) {
    user = JSON.parse(user);
    checkToken(user.token).then(rs => {
        if(rs.status == 200) window.location.href = "index.html"
    });
  }  
}

const checkToken = async (token) => {
  try {
      return await postMethods('/clients/loginByToken', {token: token})
  } 
  catch (error) {
      return { status: 500, message: "error"}
  }
}

LoadUser()