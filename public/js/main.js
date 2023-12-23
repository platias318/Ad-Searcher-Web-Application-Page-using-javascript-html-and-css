// Put your client side JS code here
    
window.onload = function() {

    var templates = {}

    let categoryScript = document.getElementById("category-template");

    templates.categoryScript = Handlebars.compile(categoryScript.textContent);

    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    let init = {
        method: "GET",
        headers: myHeaders,
        mode: 'cors'
    }

    const url = new URL('https://wiki-ads.onrender.com/categories');

    fetch(url, init)
        .then(response => response.json())
        .then(obj => {
            console.log('Received object', obj);
            let content = templates.categoryScript(obj);
            let div = document.getElementById("categories");
            div.innerHTML = content;
        })
        .catch(error => {console.log(error)})
} // Removed the comma here