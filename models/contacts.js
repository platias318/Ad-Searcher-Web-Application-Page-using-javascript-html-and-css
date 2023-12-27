/* JS files that defines modules for basic application entities,
e.g. carts, users etc
*/

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}



class Ad {
    constructor(id, title, description, cost, image, username, sid) {
        this.id=id;
        this.title=title;
        this.description = description;
        this.cost = cost;
        this.image = image;
        this.username = username;
        this.sid = sid;
    }
}

module.exports = {User,Ad}