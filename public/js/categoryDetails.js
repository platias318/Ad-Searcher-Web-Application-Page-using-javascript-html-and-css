//This is the client side javascript code of the html page "category.html"
let sessionId="";
let username="";
let password="";

window.onload = function() {//when the window is loaded

    const urlParams = new URLSearchParams(window.location.search);

    // Get the 'category' parameter value
    const categoryId = urlParams.get('id');

    var templates = {}  
    //the templates on the html file
    let categoryDetailsScript = document.getElementById("category-detail-template");
    let subcategoriesFilterScript = document.getElementById("subcategories-filter-template")

    templates.categoryDetailsScript = Handlebars.compile(categoryDetailsScript.textContent);
    templates.subcategoriesFilterScript = Handlebars.compile(subcategoriesFilterScript.textContent);

    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    let init = {
        method: "GET",
        headers: myHeaders,
        mode: 'cors'
    }

    const url = new URL(`https://wiki-ads.onrender.com/ads?category=${categoryId}`); // the url of the wikiAds server, with the specified id as a parameter

    fetch(url, init)//get the current category based on the id
        .then(response => response.json())
        .then(obj => {
        let content = templates.categoryDetailsScript(obj);
        let div = document.getElementById("category_details");
        div.innerHTML = content;
        })
        .catch(error => {console.log(error)})

    document.getElementById('login').addEventListener('submit', handleFormSubmit); //ads the function handleFormSubmit to be enabled when the user presses submit

    let subUrl = new URL(`https://wiki-ads.onrender.com/categories/${categoryId}/subcategories`); // the url to get the subcategories for the current category

    fetch(subUrl, init)// for the current category , get the subcategories for the bonus 1 
        .then(response => response.json())
        .then(subObj => {
            let content = templates.subcategoriesFilterScript(subObj);
            let div = document.getElementById("subcategories-filter");
            div.innerHTML = content;

            // Add event listener to the form
            let form = div.querySelector('form');
            form.addEventListener('change', function(event) {
                let subcategoryId = event.target.getAttribute('data-subcategory-id');
                filterAds(subcategoryId);
            });
        })
        .catch(error => {console.log(error)})
    }

    function filterAds(subcategoryId) {//filters the data based on what the user pressed in the radius buttons
        let ads = document.querySelectorAll('.property-info');
        ads.forEach(function(ad) {
            if (ad.getAttribute('data-subcategory-id') === subcategoryId || subcategoryId === 'all') {
                ad.style.display = 'block';
            } else {
                ad.style.display = 'none';
            }
        });
    }

async function handleFormSubmit(event) { //handles the sumbit request from the user
    // Prevent the form from being submitted normally
    event.preventDefault();

    // Get the username and password from the form
    username = document.getElementById('usernameInput').value;
    password = document.getElementById('passwordInput').value;

    loginUser(username, password);//call this function 
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

    const url = new URL('http://localhost:8080/login');//the url in the server side code we created

    fetch(url, init)
        .then(response => response.json())
        .then(obj => {
            if(obj.status === 200) {  //obj.status === 200  obj.message === 'User authenticated'
                const form = document.getElementById('login');            
                sessionId = obj.sessionId;

                form.textContent=""; // removes the form when the user is authenticated

                // Show the button of the favourites list
                const button = document.getElementById('favList');
                const a = document.getElementById('favListLink');
                button.style.display = 'block';
                a.href = `favourites-ads.html?username=${username}&sessionId=${sessionId}`;//put the right link in the fav list
            
                alert('Authentication successful! Form is now disabled.');
                } else {
                    alert('Authentication failed. Please try again.');
                }
        })
}

document.addEventListener('DOMContentLoaded', (event) => { //event listener to all the buttons that are used to add an AD to the favourites
    document.body.addEventListener('click', function(e) {
        if(e.target && e.target.nodeName == "BUTTON") {
            // Check if the clicked element is a button
            if(e.target.classList.contains('favourites')) {
                // Check if the button has the class 'favourites'
                if(sessionId==""){//the user isnt authenticated and the sessionId is empty
                    alert('Please log in to add to favourites');
                }else{ // the user is authenticated
                    //use DOM API to get each element of the ad
                    let section = e.target.parentElement;
                    let title = section.querySelector('h2').innerText.split(':')[1];
                    let image = section.querySelector('img').src;
                    let description = section.querySelector('p').innerText.split(':')[1];
                    let id = e.target.id.replace('favourite', '');
                    let cost = section.querySelector('.cost').innerText.split(':')[1];

                    console.log(section, title, image, description, id, cost);

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
                    const url = new URL('http://localhost:8080/favourites');//add to the favourites list

                    fetch(url, init)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(obj => {
                        if(obj.status === 200) {
                            console.log("it was added to favourites succesfully");
                            document.getElementById(`favourite${id}`).disabled=true;
                        } else if(obj.status===401) {
                            console.log('it wasnt added');
                            alert('Authentication failed. Please try again.');
                        }
                    })
                    .catch((error) => {
                        console.error('There has been a problem with your fetch operation:', error);
                    });
                }
            }else{
                console.log('wasnt added for favourites');
            }
        }
    });
});


