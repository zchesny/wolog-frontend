const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const WORKOUTS_URL = `${BASE_URL}/workouts`
const TEAMS_URL = `${BASE_URL}/teams`

class User {
    static all = []; 
    static inRoster = [];

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
        User.inRoster.push(this);
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

    static filterAttributes(user, attribute, value) {
        return user[attribute] == value; 
    }

    // when nothing is checked, we remove all filters for this category 
    // when we hit the corresponding 'clear-filter' button, we remove all filters for this category 
    static clearCategoryFilter() {

    }

    static filteredUsers(attribute, value) {
        const filteredUsers = User.inRoster.filter(user => User.filterAttributes(user, attribute, value)); 
        User.renderCards(filteredUsers);
        User.inRoster = filteredUsers; 
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
    // filterBtn.addEventListener("click", function () { User.filteredUsers('gender', 'male') });
    filterBtn.addEventListener("click", function () { 
        console.log(this.id)
        User.filteredUsers('gender', 'male');
    });
    const filterChecks = document.getElementsByClassName('filter'); 
    Array.prototype.forEach.call(filterChecks, function(el) {
        // Do stuff here
        // console.log('hello');
        // console.log(el);
        el.addEventListener('change', function() {
            if (this.checked) {
                const attribute = this.className.split(' ').pop();
                const value = this.id; 
                console.log('value here');
                console.log(value);
                User.filteredUsers(attribute, value);
            }
            
        });
        
    });



    const genderClear = document.getElementById('gender-clear');
    genderClear

})