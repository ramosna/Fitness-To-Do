// Server side JavaScript and DOM manipulation

const URL = '[Server URL goes here]'

// GET request
window.addEventListener('DOMContentLoaded', (event) => {
    // creating new request
    const request = new XMLHttpRequest()
    request.open("GET", URL, true);
    // listener for asynchronous event load
    request.addEventListener('load',() => {
        // if request is approved
        if(request.status >= 200 && request.status < 400){
        // setting object to variable 
        const object = JSON.parse(request.responseText);
        // build the table
        buildTable(object.rows)
        // if request was denied
        } else {
        console.log("Error in network request: " + request.statusText);
    }});
    // sending request
    request.send();
    event.preventDefault()
});

// post request
document.getElementById("addRow").addEventListener("submit", (event) => {
  // creating form submission object
  let formData = {name: null, reps: null, weight: null, date: null, unit: null}
  // adding form inputs to submission object
  formData.name = document.getElementById("name").value
  formData.reps = document.getElementById("reps").value
  formData.weight = document.getElementById("weight").value
  formData.date = document.getElementById("date").value
  if (document.getElementById("kilo").checked === true){
      formData.unit = "0"
  }else{
      formData.unit = "1"
  }
  // creating new request
  const request = new XMLHttpRequest()
  request.open("POST", URL, true);
  request.setRequestHeader('Content-Type', 'application/json');
  // listener for asynchronous event load
  request.addEventListener('load',() => {
      // if request is approved
      if(request.status >= 200 && request.status < 400){
      // setting object to variable 
      const object = JSON.parse(request.responseText);
      // build the table
      buildTable(object.rows)
      // if request was denied
      } else {
      console.log("Error in network request: " + request.statusText);
  }});
  // sending the request
  request.send(JSON.stringify(formData));
  event.preventDefault()
  // resetting the inputs for the form
  document.getElementById("addRow").reset()
})


document.getElementById("tbody").addEventListener("click", (event) => {
    // delete button handler
    // code modeled after youtuber WebDevSimplified video on event handlers
    if (event.target.name === "complete"){
      // delete button
      const button = event.target
      // class of row
      const row = button.parentElement.className
      // everything within class
      const rowCollection = document.getElementsByClassName(row)
      let idNum = null
      // finding id value to know which row to delete
      for (let index = 0; index < rowCollection.length; index++){
        let element = rowCollection[index]
        if (element.name === "id"){
          idNum = parseInt(element.value)
        }
      }
      // delete request
      let formData = {id: null}
      // adding form input to submission object
      formData.id = idNum
      // creating new request
      const request = new XMLHttpRequest()
      request.open("DELETE", URL, true);
      request.setRequestHeader('Content-Type', 'application/json');
      // listener for asynchronous event load
      request.addEventListener('load',() => {
          // if request is approved
          if(request.status >= 200 && request.status < 400){
          // setting object to variable 
          const object = JSON.parse(request.responseText);
          // building the table
          buildTable(object.rows)
          } else {
          console.log("Error in network request: " + request.statusText);
      }});
      // sending the request
      request.send(JSON.stringify(formData));
      event.preventDefault()
      
    }
    // allowing the inputs to edited/ change edit to done button
    if (event.target.name === "edit"){
      // edit button
      const button = event.target
      // finding parent
      const parent = button.parentElement
      // finding parent name
      const row = parent.className
      // collection of all class elements in row
      const rowCollection = document.getElementsByClassName(row)
      // finding the delete hidden button
      const dButton = parent.firstElementChild
      // hiding edit button and unhiding delete
      button.hidden = true
      dButton.hidden = false
      // undisabling the buttons to be edited
      for (let index = 0; index < rowCollection.length; index++){
        let element = rowCollection[index]
        element.disabled = false
      }
    }
    // submitting changes to roq
    if (event.target.name === "done"){
      // delete button
      const button = event.target
      // row class
      const row = button.parentElement.className
      // collection of class elements
      const rowCollection = document.getElementsByClassName(row)
      let formData = {name: null, reps: null, weight: null, unit: null, date: null, id: null}
     // finding id
      for (let index = 0; index < rowCollection.length; index++){
        let element = rowCollection[index]
        if (element.name === "id"){
          formData.id  = parseInt(element.value)
        }
      }
      // used to find the radial checks value
      const kiloID = "kilo" + formData.id
      // finding the rest of the values
      for (let index = 0; index < rowCollection.length; index++){
        let element = rowCollection[index]
        if (element.name === "name"){
          formData.name  = element.value
        }
        if (element.name === "reps"){
          formData.reps  = element.value
        }
        if (element.name === "weight"){
          formData.weight  = element.value
        }
        if (element.id === kiloID){
          if (element.checked === true){
            formData.unit = "0"
          }else{
            formData.unit = "1"
          }
        }
        if (element.name === "date"){
          formData.date  = element.value
        }
      }
      // creating new request
      const request = new XMLHttpRequest()
      request.open("PUT", URL, true);
      request.setRequestHeader('Content-Type', 'application/json');
      // listener for asynchronous event load
      request.addEventListener('load',() => {
        // if request is approved
        if(request.status >= 200 && request.status < 400){
        // setting object to variable 
        const object = JSON.parse(request.responseText);
        buildTable(object.rows)
        } else {
        console.log("Error in network request: " + request.statusText);
      }});
      request.send(JSON.stringify(formData));
      event.preventDefault()
    }
})

// function for building the table
function buildTable(arr){
const rowArr = []
// build each row
for (let num = 0; num < arr.length; num++){
     rowArr.push(buildRow(arr[num]))
   }
   // clear current displayed table
   tbody = document.getElementById("tbody")
   tbody.innerHTML = ''
   // create new table
   for (let index = 0; index < rowArr.length; index++){
     tbody.append(rowArr[index])
   }
 }

 // function to build each row
function buildRow(obj){
  // getting values for the elements from object
  const id = obj.id
  const name = obj.name
  const reps = obj.reps
  const weight = obj.weight
  const unit = obj.unit
  const date = obj.date.slice(0,10)
  // building the dom elements
  const cellID = buildCell("hidden", "id", id, id)
  const cellName = buildCell("text", "name", name, id)
  cellName.style = "width:  8.33%"
  const cellReps = buildCell("text", "reps", reps, id)
  const cellWeight = buildCell("text", "weight", weight, id)
  const cellRadio = buildRadio(unit, id)
  const cellDate = buildCell("date", "date", date, id)
  cellDate.className = 'col-md-2'
  const row = document.createElement("tr")
  const cellB = document.createElement("td")
  cellB.className = "row" + id
  const editButton = buildButton("Edit")
  const completeButton = buildButton("Complete")
  const doneButton = buildButton("Done")
  doneButton.hidden = true
  // appeding dom elements
  cellB.append(doneButton)
  cellB.append(editButton)
  cellB.append(' ')
  cellB.append(completeButton)
  row.append(cellName)
  row.append(cellReps)
  row.append(cellWeight)
  row.append(cellRadio)
  row.append(cellDate)
  row.append(cellB)
  row.append(cellID)
  return row
}

// building each td cell
function buildCell(type, name, value, id){
  const cell = document.createElement("td")
  const input = document.createElement("input")
  input.type = type
  input.name = name
  input.value = value
  input.disabled = true
  input.className = "row" + id
  cell.append(input)
  return cell
}

// build a radial button
function buildRadio(value, id){
  const cell = document.createElement("td")
  const kilo = document.createElement("input")
  const lbs = document.createElement("input")
  const labelK = document.createElement("label")
  const labelL = document.createElement("label")
  const form = document.createElement("form")
  const div = document.createElement('div')
  div.className = 'form-check col-md-2'
  kilo.type = "radio"
  kilo.name = "unit"
  kilo.id = "kilo" + id
  kilo.className = `row${id} form-check-input`
  kilo.id = "kilo" + id
  kilo.disabled = true
  
  lbs.type = "radio"
  lbs.name = "unit"
  lbs.className = `row${id} form-check-input`
  lbs.id = 'lbs' + id
  lbs.disabled = true
  if (value === 0){
    kilo.checked = true
  } else {
    lbs.checked = true
  }
  labelK.textContent = "Kilos"
  labelK.htmlFor = kilo.id
  labelK.className = 'form-check-label'
  labelL.className = 'form-check-label'
  labelL.textContent = "Lbs"
  labelL.htmlFor = lbs.id
  form.append(lbs)
  form.append(labelL)
  form.append(kilo)
  form.append(labelK)
  div.append(form)
  cell.append(div)
  return cell
}

// build a button
function buildButton(type){
  let styleClass = 'btn btn-primary btn-sm'
  if (type === 'Complete'){
    styleClass = 'btn btn-primary btn-sm'
  } else if (type === 'Done') {
    styleClass = 'btn btn-secondary btn-sm'
  } else {
    styleClass = 'btn btn-secondary btn-sm'
  }
  const button = document.createElement("button")
  button.textContent = type
  button.className = styleClass
  button.name = type.toLowerCase()
  return button
}