const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const WORKOUTS_URL = `${BASE_URL}/workouts`
const TEAMS_URL = `${BASE_URL}/teams`

class User {
    static all = []; 

    constructor(userObj) {
        this.id = userObj.id; 
        this.name = userObj.name; 
        this.gender = userObj.gender; 
        // this.role = userObj.role; 
        // this.image = userObj.image; 
        // this.side = userObj.side; 
        // this.weight = userObj.weight; 
        // this.ageClass = userObj.ageClass; 
        // this.timeTrial = userObj.timeTrial; 
        // this.status = userObj.status; 
        // this.notes = userObj.notes; 
        // this.contactInfo = userObj.contactInfo; 
        this.renderCard(); 
        User.all.push(this);
        console.log('pushing here')
        console.log(User.all.length);
    }

    renderCard() {
        //const main = document.getElementById('roster');
        const user_id = this.id; 
    
        const rosterTable = document.getElementById('roster-table');
        const tableRow = document.createElement('tr');
        const tableData = document.createElement('td');
    
        const card = document.createElement('div'); 
        if (this.gender == 'male') {
            card.className = 'card male'; 
        }
        else {
            card.className = 'card female'; 
        }
        
        card.id = `user_id-${user_id}`
        card.dataset.id = user_id; 
        card.setAttribute('draggable', true);
        card.setAttribute('ondragstart', 'drag(event)');
    
        const userName = document.createElement('p'); 
        userName.innerText = this.name; 
    
        const viewWosBtn = document.createElement('button'); 
        viewWosBtn.dataset.id = user_id; 
        viewWosBtn.innerText = 'View Workouts'; 
    
        rosterTable.appendChild(tableRow);
        tableRow.appendChild(tableData);
        tableData.appendChild(card);
    
        tableData.setAttribute('ondrop', 'drop(event)'); 
        tableData.setAttribute('ondragover', 'allowDrop(event)');
        // main.appendChild(card); 
        card.appendChild(userName); 
    }

    static renderCards(users) {
        // render only the cards in users 
        // delete users currently in roster table 
        const rosterTable = document.getElementById('roster-table');
        removeAllChildNodes(rosterTable); 
        users.forEach(user => {
            user.renderCard(); 
        })

    }

    static loadUsers() {
        fetch(USERS_URL)
        .then(resp => resp.json())
        .then(json => json.forEach(userObj => {
            new User(userObj); 
        }))
    }

    // static async fetchUsers() {
    //     const resp = await fetch(USERS_URL);
    //     const json = await resp.json();
    //     await json.forEach(userObj => {
    //         new User(userObj); 
    //     })
    // }

    // static convertJson(json) {
    //     console.log('json in covertjson');
    //     console.log(json)
    //     json.forEach(userObj => {
    //         new User(userObj); 
    //     })
    // }

    // static loadUsers() {
    //     let json = User.fetchUsers(); 
    //     console.log('json in load users');
    //     console.log(json);
    //     User.convertJson(json); 
    // }

    static checkMale(user) {
        return user.gender == 'male'; 
    }

    static filteredUsers() {
        let filteredUsers = User.all.
            filter(function(user) {return user.gender == "male"}); 
        console.log('filtered users here:');
        console.log(filteredUsers); 
        User.renderCards(filteredUsers);
        return filteredUsers; 
    }

}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    User.loadUsers();  
    const filterBtn = document.getElementById('filter-btn');
    filterBtn.addEventListener("click", User.filteredUsers);
})