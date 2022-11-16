const loginButton = document.getElementById('login-button')
const usernameInput = document.getElementById('username-input')
const passwordInput = document.getElementById('password-input')


loginButton.onclick = ()=>{
    console.log('clicking')
    fetch("/login",{
        method: "POST",
        cache: "no-cache",
        headers: [["Content-Type","application/json"]],
        body: JSON.stringify({
            username: usernameInput.value,
            password: passwordInput.value
        })
    }).then(response=>{
        response.json().then(json=>{
            if (json.status == "success"){
                console.log(json.token)
                setCookie('logintoken',json.token,3)
                setCookie('username',usernameInput.value,3)      
                window.location.assign("home.html")
            }else{
                alert(json.reason);
            }
        })
    })
}
