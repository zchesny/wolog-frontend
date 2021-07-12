class Lineup{
    static all = []; 
    // todo: filter by roster type AHHHHHHHH!H!HH!H!

    constructor(lineupObj) {
        console.log('lineup constructor called');
        console.log(lineupObj);
        this.id = lineupObj.id; 
        this.name = lineupObj.name; 
        this.description = lineupObj.description; 
        this.capacity = lineupObj.capacity; 
        this.users = lineupObj.users; 
        this.user_lineups = lineupObj.user_lineups; 
        Lineup.all.push(this);
        this.renderCard(); 
        console.log('lineup constructor called and done');
    }

    renderCard() {
        const lineup_id = this.id; 
        const lineupContainer = document.getElementById('lineup-container');

        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('lineup');
        card.id = `lineup_id-${lineup_id}`;
        
        const name = document.createElement('h2');
        name.innerText = this.name; 
        const description = document.createElement('p');
        description.innerText = this.description; 
        const capacity = document.createElement('p');
        capacity.innerText = `Capacity: ${this.capacity}`;

        // Delete Button
        const delBtn = document.createElement('button');
        delBtn.id = `delbtn-lineup_id-${this.id}`;
        delBtn.innerText = 'Delete';
        delBtn.addEventListener('click', this.deleteLineup);

        // Edit Button 
        const editBtn = document.createElement('button');
        editBtn.id = `editbtn-lineup_id-${this.id}`;
        editBtn.innerText = 'Save';
        editBtn.addEventListener('click', this.editLineup);

        const table = document.createElement('table');
        table.className = 'card-table';
        table.id = `lineup-table-${this.id}`;
        this.fillTable(table);

        // append children 
        lineupContainer.appendChild(card);
        card.appendChild(name);
        card.appendChild(description);
        card.appendChild(capacity);
        card.appendChild(table);
        card.appendChild(delBtn);
        card.appendChild(editBtn);
    }

    fillTable(table) {
        if (this.capacity >= 10) {
            for (let i = 0; i < this.capacity; i += 2 ) {
                const row = document.createElement('tr');
                let leftPaddler = createPaddlerEntry(false,  `lineup_id-${this.id}-position-${i}`); 
                let rightPaddler = createPaddlerEntry(false, `lineup_id-${this.id}-position-${i+1}`); 
                if (this.user_lineups[i]) {
                    if (this.user_lineups[i].user_id) {
                        leftPaddler = createPaddlerEntry(this.user_lineups[i].user_id, this.id); 
                    }
                    if (this.user_lineups[i+1].user_id) {
                        rightPaddler = createPaddlerEntry(this.user_lineups[i+1].user_id, this.id); 
                    }    
                }
                
                row.appendChild(leftPaddler);
                row.appendChild(rightPaddler);
                table.appendChild(row); 
            }
        }
        else {
          for (let i = 0; i < this.capacity; i++) {
                const row = document.createElement('tr');
                let paddler = createPaddlerEntry(false,  `lineup_id-${this.id}-position-${i}`)
                if (this.user_lineups[i] && this.user_lineups[i].user_id) {
                    paddler = createPaddlerEntry(this.user_lineups[i].user_id, this.id); 
                }
                row.appendChild(paddler);
                table.appendChild(row); 
          }
        }
    }

    // find user_lineup id based on position in lineup 
    getUserLineupId(position) {
        const userLineup = this.user_lineups.filter(obj => obj.position == position)[0]; 
        console.log(`userLineup: ${userLineup}`);
        // JSON.stringify(result)
        console.log(`userLineup object json: ${JSON.stringify(userLineup)}`);
        console.log(`userLineup.id: ${userLineup.id}`);
        return userLineup.id; 
    }

    editLineup() {
        // event.preventDefault(); 
        

        // NOTES: renderBoatForm, eventFire from index.js
        // const submitBtn = document.querySelector(`#show-new-lineup-form-btn`);
        // const etype = "click";
        // eventFire(submitBtn, etype);
        // click the right type of capacity 
        // FIXME capacity
        const lineupId = `${this.id.split('-').slice(-1)[0]}`; 
        // FLAG
        const lineup = Lineup.findById(lineupId);
        console.log(`lineupId: ${lineupId}`)
        console.log(`lineup: ${lineup}`)

        
        // gather form data
        // const name = document.getElementById('lineup-name').value; 
        // const description = document.getElementById('lineup-description').value; 
        // const capacity = Lineup.checkCapacity(); 
        const user_lineups_attributes = Lineup.getUserLineupList(`lineup-table-${lineupId}`, true); 

        // todo: render roster fresh 
        User.renderCards(User.inRoster);

        let lineupData = {
            "lineup": {
                // name, 
                // description, 
                // capacity,
                user_lineups_attributes 
            }
        };
    
        console.log('lineup data json'); 
        console.log(lineupData); 
    
        let configObj = {
            method: "PUT", 
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }, 
            body: JSON.stringify(lineupData)
        };

    
        fetch(`${LINEUPS_URL}/${lineupId}`, configObj)
        .then(resp => resp.json())
        .then(json => console.log(json));

        console.log("i just sent the patch request");

        
        // const capacity = lineup.capacity; 
        // console.log(`capacity: ${capacity}`)
        // const capacityBtn = document.getElementById(capacity);
        // console.log(capacityBtn);
        // eventFire(capacityBtn, 'click');
        

        // fill in with items you will edit 
        // const form = document.querySelector('#new-lineup-form');
        
    }

    static updateLineup() {
        console.log(`this: ${this}`);
        console.log(`this.id: ${this.id}`);
        let configObj = {
            method: 'PATCH', 
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }
        const url = `${LINEUPS_URL}/${this.id.split('-').slice(-1)[0]}`
        fetch(url, configObj);
        location.reload(); 
    }

    deleteLineup() {
        let configObj = {
            method: 'DELETE', 
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        }
        const url = `${LINEUPS_URL}/${this.id.split('-').slice(-1)[0]}`
        fetch(url, configObj);
        location.reload(); 
    }

    static loadLineups() {
        fetch(LINEUPS_URL)
        .then(resp => resp.json())
        .then(json => json.forEach(lineupObj => {
            new Lineup(lineupObj);
        }))
    }

    static checkCapacity() {
        if (document.getElementById('20').checked) {
            return 20;
        }
        else if (document.getElementById('10').checked) {
            return 10; 
        }
        else if (document.getElementById('6').checked) {
            return 6; 
        }
        else if (document.getElementById('2').checked) {
            return 2; 
        }
        else if (document.getElementById('1').checked) {
            return 1; 
        }
    }

    static getExistingUserLineupList(lineupId) {
        console.log('getting existing lineup list');
        fetch(`${LINEUPS_URL}/${lineupId}`)
        .then(resp => resp.json())
        .then(json => json.forEach(lineupObj => {
            new Lineup(lineupObj);
        }))
    }

    

    // need to essentially replace an old user_lineups id with a new one 
    
    // update = True if the lineup already exists 
    static getUserLineupList(lineupTableId, update) {
        const lineupId = `${lineupTableId.split('-').slice(-1)[0]}`;
        console.log('get lineup list');
        const lineup = []; 
        console.log(`lineup table id for get userlineup list: ${lineupTableId}`);
        const roster = document.getElementById(lineupTableId);
        Array.prototype.forEach.call(roster.children, function(row) {
            const paddlerHolders = row.children;
            Array.prototype.forEach.call(paddlerHolders, function(paddlerHolder) {
                // not the right thing to get the child 
                const paddler = paddlerHolder.children[0]; 
                if (paddler) {
                    lineup.push(paddler.dataset.id)
                }
                else {
                    lineup.push(null);
                }
            })
        })
        // add position to it 
        const user_lineups = []; 
        if (update) {
            lineup.forEach(function(user_id, position) {
                console.log(`lineupId: ${lineupId}`);
                console.log(`WHAT IS THIS FOR UPDATE HERE: ${this}`);
                const userLineupId = this.getUserLineupId(position);
                console.log(`userLineupId: ${userLineupId}`);
                
                const info = {
                    'id': userLineupId, 
                    'user_id': user_id, 
                    'position': position
                }
                user_lineups.push(info);
            }, Lineup.findById(lineupId)) // fixme: thisArg
        }
        else {
            lineup.forEach(function(user_id, position) {
                const info = {
                    'user_id': user_id, 
                    'position': position
                }
                user_lineups.push(info);
            })
        }
        
        console.log('USERRRRR LINEUP');
        console.log(user_lineups);
        return user_lineups; 
    }
    
    static convertLineupToUserList(lineup) {
        const users = []; 
        lineup.forEach(function(userId) {
            users.push(User.findById(userId));
        })
        console.log('users');
        console.log(users);
        return users; 
    }

    static findById(lineupId) {
        return Lineup.all.find(lineup => lineup.id == lineupId);
    }

    // fixme: don't let user submit a lineup without a roster (empty is okay)
    static createLineup(event) {
        event.preventDefault(); 
        // gather form data
        const name = document.getElementById('lineup-name').value; 
        const description = document.getElementById('lineup-description').value; 
        const capacity = Lineup.checkCapacity(); 
        const user_lineups_attributes = Lineup.getUserLineupList('lineup-table-new'); 
 
        // clear form
        document.getElementById('lineup-name').value = ''; 
        document.getElementById('lineup-description').value = ''; 
        document.getElementById(capacity).checked = false;
        removeAllChildNodes(document.getElementById('lineup-table-new'));
        // todo: render roster fresh 
        User.renderCards(User.inRoster);

        let lineupData = {
            "lineup": {
                name, 
                description, 
                capacity,
                user_lineups_attributes 
            }
        };
    
        console.log('lineup data json'); 
        console.log(lineupData); 
    
        let configObj = {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }, 
            body: JSON.stringify(lineupData)
        };
    
        fetch(LINEUPS_URL, configObj)
        .then(resp => resp.json())
        .then(json => new Lineup(json))
        //.catch(error => alert(error.message));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const saveLineup = document.getElementById('new-lineup-btn');
    saveLineup.addEventListener('click', Lineup.createLineup); 
    Lineup.loadLineups();
})