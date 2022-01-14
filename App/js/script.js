
    getData = function () {
        var GET = {};
        var queryString = window.location.search.replace(/^\?/, '');
        queryString.split(/\&/).forEach(function (keyValuePair) {
            var paramName = keyValuePair.replace(/=.*$/, ""); // some decoding is probably necessary
            var paramValue = keyValuePair.replace(/^[^=]*\=/, ""); // some decoding is probably necessary
            GET[paramName] = paramValue;
        });
        
        var headers = new Headers();
        headers.append('x-hasura-admin-secret', 'myadminsecretkey');
        fetch("http://localhost:8080/api/rest/users/" + GET['uuid'], {
            headers: headers,
            method: 'GET'
        })
            .then(response => {
//Sucessful(200)andfailure(4xx)httpresponses
//arehandledhere
                if (response.status === 401) {//Errorishandledincatch
                    throw Error('Bad user name or password');
                }
                return response.json();
            })
            .then(response => {
                token = response['access_token'];
                var data = response.users[0];
                document.getElementById("login").innerHTML = 'Login: '.bold() + data['username'];
                document.getElementById("name").innerHTML = 'Nombre: '.bold() + data['name'];
                document.getElementById("surname").innerHTML = 'Apellido: '.bold() + data['surname'];
                document.getElementById("email").innerHTML = 'Email: '.bold() + data['email'];
                document.getElementById("phone").innerHTML = 'Teléfono: '.bold() + data['phone'];
                document.getElementById("vaccinated").innerHTML = 'Vacunado:'.bold() + (data['is_vaccinated'] === true ? 'SI' : 'NO');
                var datos = data['name'] + "," + data['surname'] + "," + data['uuid'];
                document.getElementById("qrcode").src = `https://api.qrserver.com/v1/create-qr-code/?size=` + window.screen.availWidth/10 + `x` + window.screen.availWidth/10 + `&data=${datos}`;

                fillTable(data['uuid']);
            })
            .catch(error => document.getElementById("error").innerHTML = error.message);


    }
    fillTable = function (uuid) {
        table = document.getElementById("access_table");
        var headers = new Headers();
        headers.append('x-hasura-admin-secret', 'myadminsecretkey');//Quizá es mejor pasarlos como variable?
        fetch("http://localhost:8080/api/rest/user_access_log/" + uuid, {
            headers: headers,
            method: 'GET'
        })
            .then(response => {

                if (response.status === 401) {//Errorishandledincatch
                    throw Error('Bad user name or password');
                }
                return response.json();
            })
            .then(response => {
                token = response['access_token'];
                var data = response.access_log;
                data.entries
                var length = 5;
                for (let i = data.length - 1; i >= 0; i--) {
                    insertInTable(data[i], table);
                    length--;
                    if (length === 0)
                        break;
                }


            })
            .catch(error => document.getElementById("error").innerHTML = error.message);
    }
    insertInTable = function (data, table) {
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var timestamp = data['timestamp'];
        var date = timestamp.split("T")[0];
        var time =timestamp.split("T")[1].split(".")[0];
        cell1.innerHTML = data['facility']['name'];

        cell2.innerHTML = date;
        cell3.innerHTML = time;

        cell4.innerHTML = data['temperature'];
        cell4.className="PC"
        cell5.innerHTML = data['type'];
        cell5.className="PC"


    }
    getData();



