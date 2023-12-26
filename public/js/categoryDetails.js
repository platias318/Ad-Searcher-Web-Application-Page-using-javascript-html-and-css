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

    // document.getElementById("login").addEventListener('submit', function() {
    // // Call the loginUser function
    // let username = document.getElementById('usernameInput').value;
    // let password = document.getElementById('passwordInput').value;
    // loginUser(username,password); /// put the inputs
//});
    document.getElementById('login').addEventListener('submit', handleFormSubmit);


}

// Attach this function to the form's submit event
async function handleFormSubmit(event) {
    // Prevent the form from being submitted normally
    event.preventDefault();

    // Get the username and password from the form
    const username = document.getElementById('usernameInput').value;
    const password = document.getElementById('passwordInput').value;

    // Call your loginUser function
    loginUser(username, password);
}

async function loginUser(username, password) {
    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');
    myHeaders.append('Content-Type', 'application/json');

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
    console.log(username);
    console.log(password);

    fetch(url, init)
        .then(response => response.json())
        .then(obj => {
            if(obj.status === 200) {  //obj.status === 200  obj.message === 'User authenticated'
                console.log('User authenticated');
                // Display a success message on the page
                document.getElementById('message').textContent = 'User authenticated';
            } else {
                console.log('Authentication failed');
                // Display an error message on the page
                document.getElementById('message').textContent = 'Authentication failed';
            }
        })
}

