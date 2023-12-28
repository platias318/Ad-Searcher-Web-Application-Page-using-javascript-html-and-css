/* JS files that defines modules for basic application entities,
e.g. carts, users etc
*/

class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    sid=null;
}

// UserDAO.js
class UserDAO {
    constructor() {
      this.users = [];
    }
  
    save(user) {
        this.users.push(user);
    }
  
    findBySid(sid) {
        return this.users.find(user => user.sid === sid) || null;
    } 

    find(username, password) {
        return this.users.find(user => user.username === username && user.password === password) || null;
    }
    findByUsername(username){
        return this.users.find(user => user.username === username) || null;
    }
  
    // findBy(key, value) {
    //   return this.users.find(user => user[key] === value);
    // }
  
    delete(user) {
      const index = this.users.findIndex(u => u.username === user.username);
      if (index !== -1) {
        this.users.splice(index, 1);
      }
    }
  }
//Αd 
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

// AdDAO.js
class FavouritesDAO {
    constructor() {
      this.favAds = new Map();
    }
  
    save(username, ad) {
        if (!this.favAds.has(username)) { // if the user hasn't been initialized in the map, initialize him 
          this.favAds.set(username, [ad]);
          return true;
        } else { // if the user has already been initialized in the map
          const userAds = this.favAds.get(username);
          if (userAds.some(AD => AD.id === ad.id)) { // if the ad is already in, don't put it 
            console.log("the ad is already in the list from an earlier session");
            return false;
          } else {
            userAds.push(ad); // if the ad wasn't in, add it now in the list
            return true;
          }
        }
      }
    
      findById(username) {
        return this.favAds.get(username);
      }
    }
  
module.exports = { User, UserDAO, Ad, FavouritesDAO };
