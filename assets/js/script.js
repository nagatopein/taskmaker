var formEl = document.querySelector("#task-form");
var taskToDoEl = document.getElementById("task-to-do");

var createTaskHandler = function (event) {
    event.preventDefault();

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item"; // assign class name

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info"; // assign class name

    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskNameInput + "</h3 > <span class='task-type'>" + taskTypeInput + "</span>";
    listItemEl.appendChild(taskInfoEl);

    // add entire list item to list
    taskToDoEl.appendChild(listItemEl);
};

formEl.addEventListener("submit", createTaskHandler);



/* STUFF WE DON'T NEED */

//  {
//     var listItemEl = document.createElement("li");
//     listItemEl.className = "task-item";
//     listItemEl.textContent = "This is a new task.";
//     taskToDoEl.appendChild(listItemEl);
// };