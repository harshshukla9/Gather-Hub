import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    roomId: string;
}

let allSocket: User[] = [];

wss.on("connection", (socket) => {
    console.log("User connected");

    socket.on("message", (message) => {
        try {
            const parsedMessage = JSON.parse(message.toString());

            if (parsedMessage.type === "join") {
                // Remove user if they are already in a room
                allSocket = allSocket.filter(user => user.socket !== socket);

                // Add user to new room
                allSocket.push({
                    socket,
                    roomId: parsedMessage.payload.roomId
                });

                console.log(`User joined room: ${parsedMessage.payload.roomId}`);
            }

            if (parsedMessage.type === "chat") {
                let currentUser = allSocket.find(user => user.socket === socket);
                let currentUserRoom = currentUser ? currentUser.roomId : null;

                console.log(`Current user room: ${currentUserRoom}`);

                if (currentUserRoom) {
                    // Send message only to users in the same room
                    allSocket.forEach(user => {
                        if (user.roomId === currentUserRoom ) {
                            user.socket.send(JSON.stringify({
                                type: "chat",
                                message: parsedMessage.payload.message
                            }));
                        }
                    });
                }
            }
        } catch (e) {
            console.log("Error occurred:", e);
        }
    });

    socket.on("close", () => {
        allSocket = allSocket.filter(user => user.socket !== socket);
        console.log("User disconnected");
    });
});

console.log("WebSocket server running on ws://localhost:8080");
