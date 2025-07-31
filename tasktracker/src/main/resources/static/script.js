const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

// Firestore references from index.html (exported via window)
const collectionRef = window.firebaseCollection;
const addDoc = window.addDoc;
const getDocs = window.getDocs;
const db = window.db;
import { doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Fetch all tasks from Firebase
async function fetchTasks() {
  const querySnapshot = await getDocs(collectionRef);
  taskList.innerHTML = "";

  querySnapshot.forEach((docSnap) => {
    const task = docSnap.data();
    const id = docSnap.id;

    const li = document.createElement("li");
    li.textContent = `${task.title} - ${task.description || ""} ${task.completed ? "✅" : ""} `;

    // Done/Undo button
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = task.completed ? "Undo" : "Done";
    toggleBtn.onclick = () => updateTaskStatus(id, !task.completed);
    toggleBtn.style.marginLeft = "10px";

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = () => deleteTask(id);
    deleteBtn.style.marginLeft = "5px";

    li.appendChild(toggleBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Add task to Firebase
taskForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if (!title) {
    alert("Please enter a task title.");
    return;
  }

  try {
    await addDoc(collectionRef, {
      title,
      description,
      completed: false,
      createdAt: new Date()
    });
    taskForm.reset();
    fetchTasks();
  } catch (err) {
    console.error("Error adding task:", err);
    alert("Something went wrong while adding the task.");
  }
});

// Update task status in Firebase
async function updateTaskStatus(id, completed) {
  const taskRef = doc(db, "tasks", id);
  try {
    await updateDoc(taskRef, { completed });
    fetchTasks();
  } catch (err) {
    console.error("Error updating task:", err);
  }
}

// Delete task from Firebase
async function deleteTask(id) {
  const taskRef = doc(db, "tasks", id);
  try {
    await deleteDoc(taskRef);
    fetchTasks();
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

// Initial load
fetchTasks();
