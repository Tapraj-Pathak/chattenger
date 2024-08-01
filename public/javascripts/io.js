const socket = io();

// Define userId variable 
const userId = document.body.getAttribute('data-user-id');

// Load messages for the connected user
socket.emit("user connected", userId);

// Function to append message to chat window
function appendMessage(senderUsername, content) {
  const messageElement = document.createElement("li"); // Changed to <li> for better styling
  messageElement.textContent = `${senderUsername}: ${content}`;
  document.getElementById("messages").appendChild(messageElement);
  // Scroll the chat window to the bottom
  const messagesContainer = document.getElementById("messages");
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Event listener for chat messages
socket.on("chat message", (msg) => {
  appendMessage(msg.senderUsername, msg.content);
});

// Event listener for load messages
socket.on("load messages", (messages) => {
  messages.forEach((msg) => {
    appendMessage(msg.senderUsername, msg.content);
  });
});

// Event listener for errors
socket.on("error", (err) => {
  console.error("Socket error:", err);
});

// Event listener for disconnections
socket.on("disconnect", () => {
  console.log("Socket disconnected");
});

// Form submission event listener
const form = document.getElementById("form");
const input = document.getElementById("input");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", { senderId: userId, content: input.value });
    input.value = "";
  }
});
