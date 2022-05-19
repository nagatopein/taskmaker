var buttonEl = document.getElementById("save-task");
var taskToDoEl = document.getElementById("task-to-do");

var createTaskHandler = function() {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.textContent = "This is a new task.";
    taskToDoEl.appendChild(listItemEl);
}

buttonEl.addEventListener("click", createTaskHandler);



/* STUFF WE DON'T NEED */

//  {
//     var listItemEl = document.createElement("li");
//     listItemEl.className = "task-item";
//     listItemEl.textContent = "This is a new task.";
//     taskToDoEl.appendChild(listItemEl);
// };