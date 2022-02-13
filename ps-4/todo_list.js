var counter = 0;
addTask("Learn to wrap gifts", 1639944400000)
addTask("Buy milk")
clearInputElement(document.querySelector("#task_description_input"), document.querySelector("#duedate_input"), document.querySelector("#duetime_input"))

/**
 * This functions adds a new task.
 * 
 * @param {String} description The description of task 
 * @param {Timestamp} dueTime The time in milliseconds 
 */
function addTask(description, dueTime) {
    // should add new item to ul#tasklist in format 
    // <li>(description)<span class="due">due (due time, if specified)</span><button class="btn btn-sm btn-outline-danger done" type="button">Done</button></li>
    if(!description) {
        return
    }
    taskList = document.querySelector("#task_list")
    liTemplate = '<li id = "li_${id}">$(description)$<span class=\"due\">$due$</span><button id = "btn_done_${id}" class=\"btn btn-sm btn-outline-danger done\" type=\"button\">Done</button></li>'
    liStr = liTemplate.replaceAll('${id}', counter)
    counter += 1
    console.log("Adding description"+description)
    liStr = liStr.replace('$(description)$', description)
    if(dueTime) {
        var date = new Date(dueTime)
        liStr = liStr.replace('$due$', 'due ' + date.toDateString() + " " + date.toLocaleTimeString())
    } else {
        liStr = liStr.replace('$due$', '')
    }
    console.log(liStr)
    textNode = document.createTextNode(liStr)
    existingHtml = taskList.innerHTML
    taskList.innerHTML = existingHtml + liStr
}

/**
 * This function accesses the input element, adds task and then clears the input element
 */
function readAndAddTask() {
    descriptionElement = document.querySelector("#task_description_input")
    description = descriptionElement.value
    dueDateElement = document.querySelector("#duedate_input")
    dueTimeElement = document.querySelector("#duetime_input")
    timestamp = dateAndTimeToTimestamp(dueDateElement, dueTimeElement)
    console.log("Timestamp"+timestamp)
    addTask(description, timestamp)
    clearInputElement(document.querySelector("#task_description_input"), dueDateElement, dueTimeElement)
}

/**
 * This event listener is trigerred when the user clicks the add task button
 */
document.querySelector('#add_task').addEventListener('click', (e) => {
    readAndAddTask()
})

/**
 * This event listener is trigerred when the user presses the Enter key on the keyboard. It adds an event.
 */
document.querySelector('#task_description_input').addEventListener('keydown', (e) => {
    console.log("Keydown event")
    if(e.key == "Enter") {
        readAndAddTask()
    }
})

/**
 * This function clears values from all the input elements.
 * 
 * @param {Element} descriptionElement Text box where description of the task is entered
 * @param {Element} dateElement Date input element
 * @param {Element} timeElement Time input element
 */
function clearInputElement(descriptionElement, dateElement, timeElement) {
    descriptionElement.value = ""
    dateElement.value = ""
    timeElement.value = ""
}

/**
 * This function converts the date and time input by the user to a timestamp.
 * @param {Element} dateInputElement 
 * @param {Element} timeInputElement 
 * @returns 
 */
function dateAndTimeToTimestamp(dateInputElement, timeInputElement) {
    const dueDate = dateInputElement.valueAsNumber; // Returns the timestamp at midnight for the given date
    const dueTime = timeInputElement.valueAsNumber; // Returns the number of milliseconds from midnight to the time

    if(dueDate && dueTime) { // The user specified both a due date & due time
        //Add the timezone offset to account for the fact that timestamps are specified by UTC
        const timezoneOffset =  (new Date()).getTimezoneOffset() * 60 * 1000;
        return dueDate + dueTime + timezoneOffset;
    } else {
        // if the user did not specify both a due date and due time, return false
        return false;
    }
}

/**
 * This event listener removes a task when the done button is clicked.
 */
document.querySelector('#task_list').addEventListener("click", function(e) {
    clicked_elem_id = e.target.id
    if(clicked_elem_id.includes('btn_done')) {
        // done button is clicked
        // get id number
        const chars = clicked_elem_id.split('_')
        const counter_number = chars[2]
        const li_id = 'li_' + counter_number
        console.log("li ID is "+li_id)
        var elem = document.querySelector('#' + li_id)
        elem.remove()
    }
})