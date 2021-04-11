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
        // todo: make roles an array to allow multiple roles 
        this.role = userObj.role; 
        // this.image = userObj.image; 
        // this.side = userObj.side; 
        // this.weight = userObj.weight; 
        // this.ageClass = userObj.ageClass; 
        // this.timeTrial = userObj.timeTrial; 
        this.status = userObj.status; 
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
        card.classList.add('card');
        if (this.gender == 'male') {
            card.classList.add('male');
        }
        else {
            card.classList.add('female');
        }

        if (this.status == 'active') {
            card.classList.add('active');
        }
        else {
            card.classList.add('inactive');
        }
        
        card.id = `user_id-${user_id}`
        card.dataset.id = user_id; 
        card.setAttribute('draggable', true);
        card.setAttribute('ondragstart', 'drag(event)');
    
        const userName = document.createElement('p'); 
        userName.innerText = `${this.name} [${this.role[0]}]`; 

        // put role in the card 
        const viewWosBtn = document.createElement('button'); 
        viewWosBtn.dataset.id = user_id; 
        viewWosBtn.innerText = 'View Workouts'; 
    
        rosterTable.appendChild(tableRow);
        tableRow.appendChild(tableData);
        tableData.appendChild(card);
    
        tableData.setAttribute('ondrop', 'drop(event)'); 
        tableData.setAttribute('ondragover', 'allowDrop(event)');
        tableData.setAttribute('containsdrop', true);
        // main.appendChild(card); 
        card.appendChild(userName); 
    }

    static findById(userId) {
        return User.all.filter(user => user.id == userId );
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

    static filterAttributes(user, attribute, values) {
        return values.includes(user[attribute]); 
    }

    static applyAllFilters() {
        // reset inRoster array 
        User.inRoster = User.all; 
        const filterCategories = ['gender', 'status', 'role']; 
        // const filterCategories = ['gender', 'status', 'role', 'age', 'weight', 'tt']; 
        // const filterCategories = document.getElementsByClassName('filter');
        filterCategories.forEach(function(category) {
            const filters = document.getElementsByClassName(category); 
            const count = filters.length; 
            // get number of checked boxes 
            const numChecked = $(`input.${category}:checked`).length;
            // if all are checked or none are checked, do nothing
            // else, apply the filters 
            const values = []; 
            if (numChecked > 0 && numChecked < count) {
                Array.prototype.forEach.call(filters, function(el) {
                    if (el.checked) {
                        const value = el.id; 
                        values.push(value);
                    }
                })
                User.filteredUsers(category, values);
            }
        })
        // dont show users already in the current roster
        User.renderCards(User.inRoster);
    }

    /*
    filter logic idea: 
    each time a checkbox state is changed, we go through and apply all filters 
    join values in the same category with "or"
    join values in different categories with "and"
    if nothing is checked in a particular category, do not apply filters for that category 
    */

    // when nothing is checked, we remove all filters for this category 
    // when we hit the corresponding 'clear-filter' button, we remove all filters for this category 
    static clearCategoryFilter() {

    }

    static filteredUsers(attribute, values) {
        const filteredUsers = User.inRoster.filter(user => User.filterAttributes(user, attribute, values)); 
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
    const filterChecks = document.getElementsByClassName('filter'); 
    Array.prototype.forEach.call(filterChecks, function(el) {
        el.addEventListener('change', User.applyAllFilters);
    });
    const activeFilter = document.getElementById('active');
    activeFilter.setAttribute('checked', true);

    const genderClear = document.getElementById('gender-clear');
    genderClear
})