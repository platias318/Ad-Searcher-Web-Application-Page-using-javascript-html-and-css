// Put your client side JS code here
let sessionId="";
let username="";
let password="";

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

    document.getElementById('login').addEventListener('submit', handleFormSubmit);


}

// Attach this function to the form's submit event
async function handleFormSubmit(event) {
    // Prevent the form from being submitted normally
    event.preventDefault();

    // Get the username and password from the form
    username = document.getElementById('usernameInput').value;
    password = document.getElementById('passwordInput').value;

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
                const form = document.getElementById('login');            
                sessionId = obj.sessionId;

                form.textContent="";

                console.log('Received session id:', sessionId);
                alert('Authentication successful! Form is now disabled.');
                console.log('User authenticated');
                } else {
                    console.log('Authentication failed');
                    alert('Authentication failed. Please try again.');
                }
        })
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.body.addEventListener('click', function(e) {
        if(e.target && e.target.nodeName == "BUTTON") {
            // Check if the clicked element is a button
            if(e.target.classList.contains('favourites')) {
                // Check if the button has the class 'favourites'
                console.log('Favourites button clicked');
                if(sessionId==""){//the user isnot authenticated and the sessionId is empty
                    alert('Please log in to add to favourites');
                }else{ // the user is authenticated
                    
                    let section = e.target.parentElement;
                    let title = section.querySelector('h2').innerText.split(':')[1];
                    let image = section.querySelector('img').src;
                    let description = section.querySelector('p').innerText.split(':')[1];
                    let id = e.target.id.replace('favourite', '');
                    let cost = section.querySelector('.cost').innerText.split(':')[1];

                    let myHeaders = new Headers();
                    myHeaders.append('Accept', 'application/json');
                    myHeaders.append('Content-Type', 'application/json');
                
                    let init = {
                        method: "POST",
                        headers: myHeaders,
                        mode: 'cors',
                        body: JSON.stringify({
                            id:id,
                            title:title,
                            description : description,
                            cost : cost,
                            image : image,
                            username: username,
                            sid : sessionId
                        })
                    }
                    const url = new URL('http://localhost:8080/favourites');

                    fetch(url, init)
                    .then(response => response.json())
                    .then(obj => {
                        if(obj.status === 200) {  //obj.status === 200  obj.message === 'User authenticated'
                            console.log("it was added to favourites succesfully");
                            document.getElementById(`favourite${id}`).disabled=true;

                            } else {
                                console.log('it wasnt added');
                                alert('Authentication failed. Please try again.');
                            }
                    })
                }

            }else{

                console.log('wasnt added for favourites');
            }
        }
    });
});


