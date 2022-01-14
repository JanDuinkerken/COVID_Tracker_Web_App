    function checkform() {
        var username = document.getElementById('login');
        var password = document.getElementById('password');
        var headers = new Headers();
        headers.append('x-hasura-admin-secret', 'myadminsecretkey');
        fetch('http://localhost:8080/api/rest/login?username=' + username.value + '&password=' + password.value, {
            headers: headers,
            method: 'POST'
        })
            .then(response => {
//Sucessful(200)andfailure(4xx)httpresponses
//arehandledhere
                if (response.status === 401) {//Errorishandledincatch
                    throw Error('There was an error');

                }
                return response.json();
            })
            .then(response => {
                    token = response['access_token'];
                    if (response.users.length === 0) {
                        throw Error('El nombre de usuario o la contraseña son erroneos');
                    } else
                        document.location.href = "profile.html?uuid=" + response.users[0].uuid;
                }
            )
            .catch(error => document.getElementById("error").innerHTML = error.message);

    }


