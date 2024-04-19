const signUp = ()=>{
    let name = document.querySelector("#name").value;
    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;
    let confirmPassword = document.querySelector("#comfirm-password").value;

    const namePattern = /^[a-zA-Z]/;
    const emailPattern = /^[a-zA-Z0-9]+@+[a-zA-Z0-9]+.+[A-z]/;
    const passwordPattern = /^[a-zA-Z0-9]{6,}$/;

    if(name == "" || email == "" || password == "" || confirmPassword == ""){
        Notification.warning("Thông báo", "Vui lòng điền đủ thông tin!", "Đóng", "Notification.closeNotification()");
        return;
    }

    if(!namePattern.test(name)){
        Notification.warning("Thông báo", "Tên chỉ được chứa chữ cái!", "Đóng", "Notification.closeNotification()");
        return;
    }

    if(!emailPattern.test(email)){
        Notification.warning("Thông báo", "Email không hợp lệ!", "Đóng", "Notification.closeNotification()");
        return;
    }

    // if(!passwordPattern.test(password)){
    //     Notification.warning("Thông báo", "Mật khẩu phải lớn hơn 6 ký tự!", "Đóng", "Notification.closeNotification()");
    //     return;
    // }

    if(password != confirmPassword){
        Notification.warning("Thông báo", "Mật khẩu không khớp!", "Đóng", "Notification.closeNotification()");
        return;
    }

    postMethods("/clients/register", {userName:name, email:email, password: password}).then(rs => {
        if(rs.status == 200){
            localStorage.setItem('user', JSON.stringify(rs.data));
            showVerifyEmail()
        }
        else Notification.error("Đăng ký thất bại", rs.message, "Đóng", "Notification.closeNotification()");
    });
  
}

// check is already login

let user = localStorage.getItem('user');
if (user!=null) {
    postMethods('/clients/loginByToken', {token: JSON.parse(user).token}).then(rs => {
        if(rs.status == 200) window.location.href = "index.html"
        else localStorage.removeItem('user');
    });
}  

const showVerifyEmail = ()=>{
    document.querySelector(".right").classList.add("active");
    countDown();
}

const showSignin = ()=>{
    document.querySelector(".right").classList.remove("active");
}

const handleInputOtp = (event, n) => {
    let otp = event.key;
    let digit = ["0","1","2","3","4","5","6","7","8","9"]
    if(otp == "Enter") verifyEmail();
    if(!digit.includes(otp) && otp != "Backspace") event.preventDefault();
    else{
        let inputs = document.querySelectorAll(".otp-container input");
        if(otp == "Backspace"){
            if(event.target.value.length == 0) n = n-1;
            if(n>=0){
                inputs[n].focus();
                inputs[n].value = "";
            }
        }
        else{
            if(event.target.value.length == 1){
                event.preventDefault();
                if(n<5){
                    inputs[n+1].focus();
                    inputs[n+1].value = Number(otp);
                }
            }
        }
    }
}

const focusInput = (n) =>{
    let inputs = document.querySelectorAll(".otp-container input");
    inputs[n].focus();
}

const verifyEmail = () => {
    let inputs = document.querySelectorAll(".otp-container input");
    let otp = "";
    for(let i = 0; i < inputs.length; i++){
        otp += inputs[i].value;
    }
    otp = otp.trim();
    if(otp.length < 6){
        Notification.warning("Thông báo", "Vui lòng nhập đủ mã OTP!", "Đóng", "Notification.closeNotification()");
        return;
    }
    let user = localStorage.getItem('user');
    if(user == null){
        Notification.error("Xác thực thất bại", "Vui lòng đăng ký trước khi xác thực!", "Đóng", "Notification.closeNotification()");
        return;
    }
    postMethods("/clients/verifyEmail", {id: JSON.parse(user)._id, token: otp}).then(rs => {
        if(rs.status == 200){
            Notification.alert("Xác thực thành công", "Đăng ký thành công!", "Đóng", "Notification.closeNotification()", "Đăng nhập", "window.location.href='login.html'");
        }
        else Notification.error("Xác thực thất bại", rs.message, "Đóng", "Notification.closeNotification()");
    });
}

const resendOtp = () => {
    let user = localStorage.getItem('user');
    if(user == null){
        Notification.error("Xác thực thất bại", "Vui lòng đăng ký trước khi xác thực!", "Đóng", "Notification.closeNotification()");
        return;
    }
    postMethods("/clients/recreateOTP", {id: JSON.parse(user)._id}).then(rs => {
        if(rs.status == 200) {
            Notification.success("Thông báo", "Gửi lại mã OTP thành công!", "Đóng", "Notification.closeNotification()");
            countDown();
        }
        else Notification.error("Gửi lại mã OTP thất bại", rs.message, "Đóng", "Notification.closeNotification()");
    });
}

let timeOut
const timeRemain = document.querySelector(".time-remain");
const countDown = () => {
    clearInterval(timeOut);
    let time = 120;
    timeRemain.innerHTML = time;
    timeOut = setInterval(() => {
        time -= 1;
        timeRemain.innerHTML = time;
        console.log(time);
        if(time == 0){
            clearInterval(timeOut);
        }
    }, 1000);
}