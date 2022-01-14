const inputs = document.querySelectorAll("#form_alta input");

const expr_reg = {
    nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/,
    email: /^\w+([.+-]?\w+)@\w+([.-]?\w+)(.\w{1,4})+$/,
    movil: /^\d{7,14}$/,
    login: /^[a-zA-Z0-9_-]{1,16}$/,
    password: /^.{1,21}$/
}


function show_err(ref, bool){
    if(bool)
        ref.innerHTML="";
    else
        ref.innerHTML="Campo erroneo";
}

const campos_validos = {
    nombre: false,
    apellidos: false,
    email: false,
    movil: false,
    login: false,
    password: false,
    password2: false
}

function notify_err(){
    if(campos_validos["nombre"] == false) document.getElementById('name').style.background = "#FF5D5D";
    if(campos_validos["apellidos"] == false) document.getElementById('surname').style.background = "#FF5D5D";
    if(campos_validos["email"] == false) document.getElementById('email').style.background = "#FF5D5D";
    if(campos_validos["movil"] == false) document.getElementById('telephone').style.background = "#FF5D5D";
    if(campos_validos["login"] == false) document.getElementById('uname').style.background = "#FF5D5D";
    if(campos_validos["password"] == false) document.getElementById('password').style.background = "#FF5D5D";
    if(campos_validos["password2"] == false) document.getElementById('password2').style.background = "#FF5D5D";
}

const validarInputs = (e) => {
    switch(e.target.name){
        case "name":
            campos_validos["nombre"] = expr_reg.nombre.test(e.target.value);
            show_err(document.getElementById("name_err"), expr_reg.nombre.test(e.target.value));
            document.getElementById('name').style.background = "#FFFFFF"
        break;
        case "surname":
            campos_validos["apellidos"] = expr_reg.nombre.test(e.target.value);
            show_err(document.getElementById("surname_err"), expr_reg.nombre.test(e.target.value));
            document.getElementById('surname').style.background = "#FFFFFF"
        break;
        case "email":
            campos_validos["email"] = expr_reg.email.test(e.target.value);
            show_err(document.getElementById("email_err"), expr_reg.email.test(e.target.value));
            document.getElementById('email').style.background = "#FFFFFF"
        break;
        case "telephone":
            campos_validos["movil"] = expr_reg.movil.test(e.target.value);
            show_err(document.getElementById("telephone_err"), expr_reg.movil.test(e.target.value));
            document.getElementById('telephone').style.background = "#FFFFFF"
        break;
        case "uname":
            campos_validos["login"] = expr_reg.login.test(e.target.value);
            show_err(document.getElementById("uname_err"), expr_reg.login.test(e.target.value));
            document.getElementById('uname').style.background = "#FFFFFF"
        break;
        case "password":
            campos_validos["password"] = expr_reg.password.test(e.target.value);
            show_err(document.getElementById("password_err"), expr_reg.password.test(e.target.value));
            campos_validos["password2"] = document.getElementById("password2").value === document.getElementById("password").value;
            show_err(document.getElementById("password2_err"),document.getElementById("password2").value === document.getElementById("password").value);
            document.getElementById('password').style.background = "#FFFFFF"
        break;
        case "password2":
            campos_validos["password2"] = document.getElementById("password2").value === document.getElementById("password").value;
            show_err(document.getElementById("password2_err"),document.getElementById("password2").value === document.getElementById("password").value);
            document.getElementById('password2').style.background = "#FFFFFF"
        break;
    }
}

inputs.forEach((input) => {
    input.addEventListener('keyup', validarInputs);
    input.addEventListener('blur', validarInputs);
})


onClicker = function () {
        var password = document.getElementById('password');
        var password2 = document.getElementById('password2');
        var name = document.getElementById('name');
        var surname = document.getElementById('surname');
        var email = document.getElementById('email');
        var telephone = document.getElementById('telephone');
        var vaccinated = document.getElementById('vaccinated');
        var username = document.getElementById('uname');
        if(campos_validos["nombre"] && campos_validos["apellidos"] 
        && campos_validos["email"] && campos_validos["movil"] 
        && campos_validos["login"] && campos_validos["password"] && campos_validos["password2"]){
            var formData = new FormData();
            formData.append("username", username.value);
            formData.append("password", password.value);
            formData.append("name", name.value);
            formData.append("surname", surname.value);
            formData.append("phone", telephone.value);
            formData.append("email", email.value);
            formData.append("is_vaccinated", (vaccinated.checked ? 'true' : 'false'));
    
            var headers = new Headers();
            headers.append('x-hasura-admin-secret', 'myadminsecretkey');
            fetch('http://localhost:8080/api/rest/user', {
                headers: headers,
                method: 'POST',
                body: formData
            })
                .then(response => {
    //Sucessful(200)andfailure(4xx)httpresponses
    //arehandledhere
                    if (response.status === 401) {//Errorishandledincatch
                        throw Error('Error');
                    }
                    if (response.status === 400) {//Errorishandledincatch
                        throw Error('El usuario ya existe');
                    }
                    return response.json();
                })
                .then(response => {
                    token = response['access_token'];
                    window.location = "index.html";
    
                })
                .catch(error => document.getElementById("error").innerHTML = error.message);
        }
        else notify_err();
    }


    
