// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// A smart contract to manage tasks
contract TaskContract {
    // Event to notify when a task is added
    event AddTask(address recipient, uint taskId);
    // Event to notify when a task is marked as deleted
    event DeleteTask(uint taskId, bool isDeleted);

    // Struct to define the properties of a task
    struct Task {
        uint id; // Unique identifier for the task
        string taskText; // The content or description of the task
        bool isDeleted; // A flag to indicate if the task is deleted
    }

    // An array to store all the tasks
    Task[] private tasks;

    // A mapping to keep track of the owner of each task using task ID
    mapping(uint256 => address) taskToOwner;

    // Function to add a new task to the contract
    function addTask(string memory taskText, bool isDeleted) external {
        // Generate a new task ID based on the current number of tasks
        uint taskId = tasks.length;
        // Create a new task and add it to the tasks array
        tasks.push(Task(taskId, taskText, isDeleted));
        // Map the task ID to the address of the sender (owner)
        taskToOwner[taskId] = msg.sender;
        // Emit the AddTask event to notify others about the new task
        emit AddTask(msg.sender, taskId);
    }

    // Function to get the tasks owned by the caller and not deleted
    function getMyTasks() external view returns (Task[] memory) {
        // Create a temporary array to store the tasks
        Task[] memory temporary = new Task[](tasks.length);
        // Counter to keep track of the number of tasks for the caller
        uint counter = 0;
        // Loop through all tasks and check ownership and deletion status
        for (uint i = 0; i < tasks.length; i++) {
            if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
                // If the task is owned by the caller and not deleted, add it to the temporary array
                temporary[counter] = tasks[i];
                counter++;
            }
        }

        // Create a new array with the exact number of tasks for the caller
        Task[] memory result = new Task[](counter);
        // Copy the tasks from the temporary array to the result array
        for (uint i = 0; i < counter; i++) {
            result[i] = temporary[i];
        }
        // Return the result array containing the tasks owned by the caller and not deleted
        return result;
    }

    // Function to mark a task as deleted (not actually deleting it)
    function deleteTask(uint taskId, bool isDeleted) external {
        // Check if the caller is the owner of the task
        if (taskToOwner[taskId] == msg.sender) {
            // Mark the task as deleted (set isDeleted flag)
            tasks[taskId].isDeleted = isDeleted;
            // Emit the DeleteTask event to notify others about the change
            emit DeleteTask(taskId, isDeleted);
        }
    }
}
