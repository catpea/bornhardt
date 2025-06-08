


// Create WebSocket connection.
let socket;
function connectWebSocket() {
  const startTime = new Date();
  socket = new WebSocket("ws://127.0.0.1:3000");

  // Connection opened
  socket.addEventListener("open", () => {
    socket.send(JSON.stringify({type: 'action', name: 'client-hello'}));
    console.log("WebSocket connection established.");
  });

  // Listen for messages
  socket.addEventListener("message", (event) => {
    console.log("Message from server: ", event.data);

    const action = JSON.parse(event.data);
    console.log('received action:', action);

    if(action.name == 'server-start') {
      const currentTime = new Date();
      let secondsDifference = (currentTime - startTime) / 1000;
      console.log(secondsDifference);
      if(secondsDifference > 3) location.reload()
    }

  });

  // Handle any errors that occur.
  socket.addEventListener("error", (event) => {
    console.error("WebSocket error: ", event.message);
  });

  // Handle WebSocket closure
  socket.addEventListener("close", (event) => {
    if (event.wasClean) {
      console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
    } else {
      console.log("WebSocket connection closed unexpectedly.", `Code: ${event.code}`);
      reconnectWebSocket();
    }
  });
}

function reconnectWebSocket() {
  setTimeout(() => {
    console.log("Attempting to re-establish the WebSocket connection.");
    connectWebSocket();
  }, 1000);
}

connectWebSocket();
