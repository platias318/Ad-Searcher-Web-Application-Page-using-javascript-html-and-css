// Put your client side JS code here
    
window.onload = function() {

    const urlParams = new URLSearchParams(window.location.search);

    // Get the 'category' parameter value
    const subcategoryId = urlParams.get('id');

    var templates = {}  

    let categoryDetailsScript = document.getElementById("subcategory-detail-template");

    templates.categoryDetailsScript = Handlebars.compile(categoryDetailsScript.textContent);

    let myHeaders = new Headers();
    myHeaders.append('Accept', 'application/json');

    let init = {
        method: "GET",
        headers: myHeaders,
        mode: 'cors'
    }

    const url = new URL(`https://wiki-ads.onrender.com/ads?subcategory=${subcategoryId}`);

    fetch(url, init)
        .then(response => response.json())
        .then(obj => {
            console.log('Received object', obj)
            obj.forEach(obj => {
                obj.features = obj.features.split(';');
            });
            let content = templates.categoryDetailsScript(obj);
            let div = document.getElementById("subcategory_details");
            div.innerHTML = content;
        })
        .catch(error => {console.log(error)})

}
