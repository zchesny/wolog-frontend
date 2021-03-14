// test that we can get data from the backend
// const BACKEND_URL = 'http://localhost:3000';
// fetch(`${BACKEND_URL}/test`)
//   .then(response => response.json())
//   .then(parsedResponse => console.log(parsedResponse));

  // first real data 
const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const WORKOUTS_URL = `${BASE_URL}/workouts`
const TEAMS_URL = `${BASE_URL}/teams`
document.addEventListener("DOMContentLoaded", () => {
    renderUserForm(); 
    loadUsers(); 
})

function renderUserForm() {
    let addToy = false; 
    const addBtn = document.querySelector("#show-user-form-btn");
    const toyFormContainer = document.querySelector(".container");
    addBtn.addEventListener("click", () => {
      // hide & seek with the form
      addToy = !addToy;
      if (addToy) {
        toyFormContainer.style.display = "block";
      } else {
        toyFormContainer.style.display = "none";
      }
    })

    const registerBtn = document.querySelector("#new-user-btn"); 
    registerBtn.addEventListener('click', newUser); 
}

function newUser(event) {
    event.preventDefault(); 
    // gather form data
    const name = document.getElementById('user-name').value; 
    const password = document.getElementById('user-password').value; 
    const image = document.getElementById('user-image').value; 

    console.log('user data from form'); 
    console.log(name);
    console.log(password); 
    console.log(image); 

    // clear form
    // document.getElementById('user-name').value = ''; 
    // document.getElementById('user-password').value = ''; 
    // document.getElementById('user-image').value = ''; 

    let userData = {
      "user": {
        name, 
        password, 
        image
      }
    };

    console.log('user data json'); 
    console.log(userData); 

    let configObj = {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }, 
      body: JSON.stringify(userData)
    };

    console.log('config object'); 
    console.log(configObj); 

    return fetch(USERS_URL, configObj)
      .then(resp => resp.json())
      .then(json => renderCard(json));
      //.catch(error => alert(error.message));

}

function loadUsers() {
    fetch(USERS_URL)
    .then(resp => resp.json())
    .then(json => renderCards(json)); 
}

function renderCards(json) {
    json.forEach(user => {
        renderCard(user); 
    })
}

function renderCard(user) {
    const main = document.getElementsByTagName('main')[0]; 
    const user_id = user.id; 

    const card = document.createElement('div'); 
    card.className = 'card'; 
    card.dataset.id = user_id; 

    const userName = document.createElement('p'); 
    userName.innerText = user.name; 

    const viewWosBtn = document.createElement('button'); 
    viewWosBtn.dataset.id = user_id; 
    viewWosBtn.innerText = 'View Workouts'; 

    main.appendChild(card); 
    card.appendChild(userName); 
}