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
    }

    renderCard() {
        //const main = document.getElementById('roster');
        const user_id = this.id; 
    
        const rosterTable = document.getElementById('roster-table');
        const tableRow = document.createElement('tr');
        const tableData = document.createElement('td');
    
        const card = document.createElement('div'); 
        card.className = 'card'; 
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

    }

    static loadUsers() {
        fetch(USERS_URL)
        .then(resp => resp.json())
        .then(json => json.forEach(userObj => {
            new User(userObj); 
        }))
    }

    static checkMale(gender) {
        return gender == 'male'; 
    }

    static filterUsers(key, value) {

    }

}
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    User.loadUsers();  
    console.log(User.all);
})