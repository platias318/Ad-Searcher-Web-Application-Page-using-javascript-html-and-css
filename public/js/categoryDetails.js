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

}