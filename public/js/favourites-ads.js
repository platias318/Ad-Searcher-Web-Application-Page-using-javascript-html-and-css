window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');
    const sessionId = urlParams.get('sessionId');
    var templates = {}  

    let favouritesListScript = document.getElementById("favouritesList");

    templates.favouritesListScript = Handlebars.compile(favouritesListScript.textContent);

    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');
    let init = {
        method: "GET",
        headers: myHeaders,
        mode: 'cors',
    }

    const url = new URL(`http://localhost:8080/favouritesList?username=${username}&sessionId=${sessionId}`);

    fetch(url, init)
        .then(response => response.json())
        .then(obj => {
            console.log('Received object', obj);
            let content = templates.favouritesListScript(obj);
            let div = document.getElementById("favAdsUserList");
            div.innerHTML = content;
            })
            .catch(error => {console.log(error)})
}