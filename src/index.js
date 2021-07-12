const BASE_URL = "http://localhost:3000"
const USERS_URL = `${BASE_URL}/users`
const LINEUPS_URL = `${BASE_URL}/lineups`

// DOCUMENT FUNCTIONS ------------------------
document.addEventListener("DOMContentLoaded", () => {
    renderForm("new-lineup");
})

function renderForm(formName, newFunction) {
  let addUser = false; 
  const addBtn = document.querySelector(`#show-${formName}-form-btn`);
  const formContainer = document.querySelector(`#${formName}-form-container`);
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    console.log('form hide and seek here');
    addUser = !addUser;
    if (addUser) {
      formContainer.style.display = "block";
      User.resetAndRenderRoster();
      // User.filteredUsers('status', ['active']);
      // User.renderCards(User.inRoster);
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

function eventFire(el, etype) {
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

function renderRoster() {
  rosterTable = document.getElementById('roster-table');
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function renderBoatForm(event) {
  const capacity = event.target.value;
  let newLineup = document.getElementById('lineup-table-new');
  // todo: add logic to just add the number of cells needed instead of creating a new table 
  if (newLineup) {
    newLineup.remove(); 
  }
  const form = document.querySelector('#new-lineup-form'); 
  const table = document.createElement('table'); 
  table.id = "lineup-table-new"
  form.appendChild(table);
  if (capacity >= 10) {
    for (let i = 0; i < capacity/2; i++) {
      const row = document.createElement('tr');
      let data = createPaddlerEntry(); 
      let data2 = createPaddlerEntry(); 
      row.appendChild(data);
      row.appendChild(data2);
      table.appendChild(row); 
    }
  }
  else {
    for (let i = 0; i < capacity; i++) {
      const row = document.createElement('tr');
      let data = createPaddlerEntry(); 
      row.appendChild(data);
      table.appendChild(row); 
    }
  }
}

// FIXME: find lineup id
function createPaddlerEntry(user_id, data_id ) {
  let data = document.createElement('td');
  if (data_id) {
    data.id = data_id; 
  }
  data.innerHTML = "paddler holder"; 
  data.setAttribute('ondrop', 'drop(event)'); 
  data.setAttribute('ondragover', 'allowDrop(event)');
  data.setAttribute('containsdrop', false);
  if (user_id) {
    const user = User.findById(user_id);
    console.log(`lineup id check here ${data_id}`);
    const card = user.renderCard(true, data_id); 
    data.appendChild(card); 
  }
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