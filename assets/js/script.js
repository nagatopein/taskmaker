var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.getElementById("task-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var taskFormHandler = function (event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");

    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
    // no data attribute, so create object as normal and pass to createTaskEl function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskEl(taskDataObj);
    }
};

var createTaskEl = function (taskDataObj) {
    // console.log(taskDataObj);
    // console.log(taskDataObj.status);
    // create list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item"; // assign class name

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    // create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info"; // assign class name
    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3 > <span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    // add entire list item to list
    tasksToDoEl.appendChild(listItemEl);

    // increase task counter for next unique id
    taskIdCounter++;

    saveTasks();
};

var createTaskActions = function (taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn"; // 2 class names
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //  create status select dropdown
    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // appent to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function (event) {
    // get target element from event
    var targetEl = event.target;

    // edit button was clicked
    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    else if (targetEl.matches(".delete-btn")) {
        // get the element's task id
        var taskId = event.target.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var editTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    // console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    // console.log(taskType);

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function (taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    // debugger;
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    // debugger;

    alert("Task Updated!");

    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";

    saveTasks();
}

var taskStatusChangeHandler = function (event) {
    // get the tas item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();

};

var deleteTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create new array to hold updated list of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        // if tasks[i].id doen't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
};

var tasks = [];
var emptyArr = [];

var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function () {
    // load tasks from local storage
    var savedTasks = (localStorage.getItem("tasks")); // wrap in JSON.parse
    // console.log(tasks);

    if (!savedTasks) {
        return false;
    }

    savedTasks = JSON.parse(savedTasks);
    // console.log(tasks);

    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task object into the createTaskEl() function
        createTaskEl(savedTasks[i]);
    }
};


pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);


loadTasks();


/* STUFF WE DON'T NEED */

//  {
//     var listItemEl = document.createElement("li");
//     listItemEl.className = "task-item";
//     listItemEl.textContent = "This is a new task.";
//     tasksToDoEl.appendChild(listItemEl);
// };


/* FROM loadTasks() */


// for (var i = 0; i < tasks.length; i++) {
//     if (tasks[i].id = taskIdCounter);
//     // console.log(tasks[i]);
//     // console.log(tasks[i].id);

//     var listItemEl = document.createElement("li");
//     listItemEl.className = "task-item";
//     listItemEl.setAttribute("data-task-id", (tasks[i].id));
//     // console.log(listItemEl);

//     var taskInfoEl = document.createElement("div");
//     taskInfoEl.className = "task-info";
//     taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
//     console.log(taskInfoEl);

//     listItemEl.appendChild(taskInfoEl);

//     var taskActionsEl = createTaskActions(tasks[i].id);

//     listItemEl.appendChild(taskActionsEl);
//     console.log(listItemEl);

//     if (tasks[i].status === "to do") {
//         listItemEl.querySelector("select[name='status-change']").selectedIndex = 0
//         tasksToDoEl.appendChild(listItemEl);
//     }
//     else if (tasks[i].status === "in progress") {
//         listItemEl.querySelector("select[name='status-change']").selectedIndex = 1
//         tasksInProgressEl.appendChild(listItemEl);
//     }
//     else if (tasks[i].status === "complete") {
//         listItemEl.querySelector("select[name='status-change']").selectedIndex = 2
//         tasksCompletedEl.appendChild(listItemEl);
//     }

//     taskIdCounter++;


//     console.log(listItemEl);



// };
    // if (console.log(tasks[i])) {
    //     tasks[i].id = taskIdCounter;
    //     console.log(tasks[i]);
    // }

    // var listItemEl = document.createElement("li");
    // listItemEl.className = "task-item";
    // listItemEl.setAttribute("data-task-id", (tasks[i].id));
    // console.log(listItemEl);



    // // debugger;
    // for (var i = 0; i < loadedTasks.length; i++) {
    //     if (console.log(loadedTasks[i]));
    // };
    // // debugger;

    // loadedTasks[i].id = taskIdCounter;
    // console.log(loadedTasks[i]);

    // convert tasks from string back into obj array
    // display tasks in appropriate columns

    // tasks = localStorage.getItem("tasks");

    // if (!tasks) {
    //     tasks = [];
    //     return false;
    // }

    // tasks = JSON.parse(tasks)