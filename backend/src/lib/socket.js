

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
      pingTimeout: 60000,
      cors: {
            origin: ["http://localhost:5173"],
      },
});

// Map to keep track of connected users, mapping userId to socketId
const userSocketMap = {};

// Existing connection handler
io.on("connection", (socket) => {
      console.log("A user connected:", socket.id);

      const userId = socket.handshake.query.userId;
      if (userId) {
            userSocketMap[userId] = socket.id;
      }

      // Notify all clients of online users
      io.emit("getOnlineUsers", Object.keys(userSocketMap));

      // Handle user registration (recommended for clarity)
      socket.on("register-user", ({ userId }) => {
            userSocketMap[userId] = socket.id;
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
      });

      // ----------- Video/Audio Call Signaling Events -----------

      // Initiate a call
      socket.on("call-user", ({ calleeId, signalData }) => {
            const calleeSocketId = userSocketMap[calleeId];
            if (calleeSocketId) {
                  io.to(calleeSocketId).emit("incoming-call", {
                        callerId: socket.handshake.query.userId,
                        signalData,
                  });
            }
      });

      
      socket.on("call-accepted", ({ callerId, calleeId, signalData }) => {
            const callerSocketId = userSocketMap[callerId];
            if (callerSocketId) {
                  io.to(callerSocketId).emit("call-accepted", {
                        calleeId,
                        signalData,
                  });
            }
      });

      // Exchange ICE candidates
      socket.on("ice-candidate", ({ targetId, candidate }) => {
            const targetSocketId = userSocketMap[targetId];
            if (targetSocketId) {
                  io.to(targetSocketId).emit("ice-candidate", {
                        from: socket.handshake.query.userId,
                        candidate,
                  });
            }
      });

      // End or cancel call
      socket.on("end-call", ({ targetId }) => {
            const targetSocketId = userSocketMap[targetId];
            if (targetSocketId) {
                  io.to(targetSocketId).emit("call-ended", {
                        from: socket.handshake.query.userId,
                  });
            }
      });

      // Handle disconnect
      socket.on("disconnect", () => {
            console.log("A user disconnected:", socket.id);
            // Remove user from map
            for (const [user, sockId] of Object.entries(userSocketMap)) {
                  if (sockId === socket.id) {
                        delete userSocketMap[user];
                        break;
                  }
            }
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
      });
});

export { io, app, server };