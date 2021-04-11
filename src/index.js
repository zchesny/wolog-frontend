// test that we can get data from the backend
// const BACKEND_URL = 'http://localhost:3000';
// fetch(`${BACKEND_URL}/test`)
//   .then(response => response.json())
//   .then(parsedResponse => console.log(parsedResponse));

  // first real data 
// const BASE_URL = "http://localhost:3000"
// const USERS_URL = `${BASE_URL}/users`
// const WORKOUTS_URL = `${BASE_URL}/workouts`
// const TEAMS_URL = `${BASE_URL}/teams`

// DOCUMENT FUNCTIONS ------------------------
document.addEventListener("DOMContentLoaded", () => {
    renderForm("new-user", newUser);
    renderForm("new-lineup");
})

function renderForm(formName, newFunction) {
  let addUser = false; 
  const addBtn = document.querySelector(`#show-${formName}-form-btn`);
  const formContainer = document.querySelector(`#${formName}-form-container`);
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addUser = !addUser;
    if (addUser) {
      formContainer.style.display = "block";
      console.log('newLineup clicked');
      User.filteredUsers('status', ['active']);
      User.renderCards(User.inRoster);
    } else {
      formContainer.style.display = "none";
    }
  })
  const submitBtn = document.querySelector(`#${formName}-btn`); 
  submitBtn.addEventListener('click', newFunction); 
  // maybe need to add event listener to selecting an item from the radio 
  if (formName == "new-lineup") {
    // render roster to right 
    renderRoster(); 
    // get value from radio 
    document.querySelectorAll('input[name="capacity"]').forEach((elem) => {
      elem.addEventListener("click", renderBoatForm);
    });
  }
}

function renderRoster() {
  rosterTable = document.getElementById('roster-table');
}

function renderBoatForm(event) {
  const count = event.target.value;
  console.log(count);
  let newLineup = document.getElementById('current-new-lineup');
  // future: add logic to just add the number of cells needed instead of creating a new table 
  if (newLineup) {
    newLineup.remove(); 
  }
  const form = document.querySelector('#new-lineup-form'); 
  const table = document.createElement('table'); 
  table.id = "current-new-lineup"
  form.appendChild(table);
  if (count >= 10) {
    for (let i = 0; i < count/2; i++) {
      const row = document.createElement('tr');
      let data = createPaddlerEntry(); 
      let data2 = createPaddlerEntry(); 
      row.appendChild(data);
      row.appendChild(data2);
      table.appendChild(row); 
    }
  }
  else {
    for (let i = 0; i < count; i++) {
      const row = document.createElement('tr');
      let data = createPaddlerEntry(); 
      row.appendChild(data);
      table.appendChild(row); 
    }
  }
}

function createPaddlerEntry() {
  let data = document.createElement('td');
  data.innerHTML = "paddler holder"; 
  data.setAttribute('ondrop', 'drop(event)'); 
  data.setAttribute('ondragover', 'allowDrop(event)');
  data.setAttribute('containsdrop', false);
  return data;
}

function allowDrop(event) {
  event.preventDefault(); 
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
  // find all the places that element has a parent 
  const userElement = document.getElementById(event.target.id);
  const originalContainer = userElement.parentElement; 
  originalContainer.setAttribute('containsdrop', false); 
}

function drop(event) {
  event.preventDefault();
  const dropTarget = event.target; 
  if (dropTarget.getAttribute('containsdrop') == 'false') {
    const data = event.dataTransfer.getData("text");
    event.target.appendChild(document.getElementById(data)); 
    dropTarget.setAttribute('containsdrop', true);
  } 
}

// USER FUNCTIONS --------------------------
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
  document.getElementById('user-name').value = ''; 
  document.getElementById('user-password').value = ''; 
  document.getElementById('user-image').value = ''; 

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