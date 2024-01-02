// Put your client side JS code here
window.onload = function() { //called when the window is loaded

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
        .then(categories => {
            console.log('Received categories', categories);

            // Fetch subcategories for each category using map
            let fetchSubcategories = categories.map(category => {
                let subUrl = new URL(`https://wiki-ads.onrender.com/categories/${category.id}/subcategories`);
                return fetch(subUrl, init)
                    .then(response => response.json())
                    .then(subObj => {
                        console.log('Received subcategories', subObj);
                        category.subcategories = subObj;
                        return category;
                    });
            });

            Promise.all(fetchSubcategories)//when all the subcategories are fetched
                .then(categoriesWithSubcategories => {
                    let content = templates.categoryScript(categoriesWithSubcategories);
                    let div = document.getElementById("categories");
                    div.innerHTML = content;
                });
        })
        .catch(error => {console.log(error)});
}