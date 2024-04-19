const userInfor = document.getElementsByClassName('user-infor')[0];
const logoutButton = document.getElementsByClassName('logout-button')[0];
const loginButton = document.getElementsByClassName('login-button')[0];
const signupButton = document.getElementsByClassName('signup-button')[0];

const LoadUser = () => {
    let user = localStorage.getItem('user');
    if (user!=null) {
        user = JSON.parse(user);
        checkToken(user.token).then(rs => {
            if(rs.status == 200){
                loginButton.style.display = 'none';
                signupButton.style.display = 'none';
                userInfor.style.display = 'flex';
                logoutButton.style.display = 'block';
                if(user.image != "") userInfor.innerHTML = "<img src="+ user.image +">" + user.userName;
                else userInfor.innerHTML = "<img src='https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg'>" + user.userName;
            }
            else{
                userInfor.style.display = 'none';
                logoutButton.style.display = 'none';
                localStorage.removeItem("user");
            }
        });
    }   
    else{

        userInfor.style.display = 'none';
        logoutButton.style.display = 'none';
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