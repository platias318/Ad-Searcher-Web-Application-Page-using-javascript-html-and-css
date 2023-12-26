// Put your client side JS code here

window.onload = function() {

    const urlParams = new URLSearchParams(window.location.search);

    // Get the 'category' parameter value
    const categoryId = urlParams.get('id');

    var templates = {}  

    let categoryDetailsScript = document.getElementById("category-detail-template");

    templates.categoryDetailsScript = Handlebars.compile(categoryDetailsScript.textContent);

    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    let init = {
        method: "GET",
        headers: myHeaders,
        mode: 'cors'
    }

    const url = new URL(`https://wiki-ads.onrender.com/ads?category=${categoryId}`);

    fetch(url, init)
        .then(response => response.json())
        .then(obj => {
            console.log('Received object', obj)
        let content = templates.categoryDetailsScript(obj);
        let div = document.getElementById("category_details");
        div.innerHTML = content;
        })
        .catch(error => {console.log(error)})

    document.getElementById("login").addEventListener('submit', function() {
    // Call the loginUser function
    let username = document.getElementById('usernameInput').value;
    let password = document.getElementById('passwordInput').value;
    loginUser(username,password); /// put the inputs
});


}

async function loginUser(username, password) {

    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    let init = {
        method: "POST",
        headers: myHeaders,
        mode: 'cors',
        body: JSON.stringify({
            username: username,
            password: password
        })
    }

    const url = new URL('http://localhost:8080/login');

    fetch(url, init)
        .then(response => response.json())
        .then(obj => {
            if(obj.status=== 200) {
                console.log('User authenticated');
            } else {
                console.log('Authentication failed');
            }
        })
}
