// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios.js";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";

// export const useAuthStore = create((set, get) => ({
//       authUser: null,
//       isSigningUp: false,
//       isLoggingIn: false,
//       isUpdatingProfile: false,
//       isCheckingAuth: true,
//       onlineUsers: [],
//       socket: null,

//       checkAuth: async () => {
//             try {
//                   const res = await axiosInstance.get("/auth/check");

//                   set({ authUser: res.data });
//                   get().connectSocket();
//             } catch (error) {
//                   console.log("Error in checkAuth:", error);
//                   set({ authUser: null });
//             } finally {
//                   set({ isCheckingAuth: false });
//             }
//       },

//       signup: async (data) => {
//             set({ isSigningUp: true });
//             try {
//                   const res = await axiosInstance.post("/auth/signup", data);
//                   set({ authUser: res.data });
//                   toast.success("Account created successfully");
//                   get().connectSocket();
//             } catch (error) {
//                   toast.error(error.response.data.message);
//             } finally {
//                   set({ isSigningUp: false });
//             }
//       },

//       login: async (data) => {
//             set({ isLoggingIn: true });
//             try {
//                   const res = await axiosInstance.post("/auth/login", data);
//                   set({ authUser: res.data });
//                   toast.success("Logged in successfully");

//                   get().connectSocket();
//             } catch (error) {
//                   toast.error(error.response.data.message);
//             } finally {
//                   set({ isLoggingIn: false });
//             }
//       },

//       logout: async () => {
//             try {
//                   await axiosInstance.post("/auth/logout");
//                   set({ authUser: null });
//                   toast.success("Logged out successfully");
//                   get().disconnectSocket();
//             } catch (error) {
//                   toast.error(error.response.data.message);
//             }
//       },

//       updateProfile: async (data) => {
//             set({ isUpdatingProfile: true });
//             try {
//                   const res = await axiosInstance.put("/auth/update-profile", data);
//                   set({ authUser: res.data });
//                   toast.success("Profile updated successfully");
//             } catch (error) {
//                   console.log("error in update profile:", error);
//                   toast.error(error.response.data.message);
//             } finally {
//                   set({ isUpdatingProfile: false });
//             }
//       },

//       connectSocket: () => {
//             const { authUser } = get();
//             if (!authUser || get().socket?.connected) return;

//             const socket = io(BASE_URL, {
//                   query: {
//                         userId: authUser._id,
//                   },
//             });
//             socket.connect();

//             set({ socket: socket });

//             socket.on("getOnlineUsers", (userIds) => {
//                   set({ onlineUsers: userIds });
//             });
//       },
//       disconnectSocket: () => {
//             if (get().socket?.connected) get().socket.disconnect();
//       },
// }));

// import { create } from "zustand";
// import { axiosInstance } from "../lib/axios.js";
// import toast from "react-hot-toast";
// import { io } from "socket.io-client";

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";

// export const useAuthStore = create((set, get) => ({
//       authUser: null,
//       isSigningUp: false,
//       isLoggingIn: false,
//       isUpdatingProfile: false,
//       isCheckingAuth: true,
//       onlineUsers: [],
//       socket: null,

//       checkAuth: async () => {
//             try {
//                   const res = await axiosInstance.get("/auth/check");
//                   set({ authUser: res.data });
//                   get().connectSocket();
//             } catch (error) {
//                   console.log("Error in checkAuth:", error);
//                   set({ authUser: null });
//             } finally {
//                   set({ isCheckingAuth: false });
//             }
//       },

//       signup: async (data) => {
//             set({ isSigningUp: true });
//             try {
//                   const res = await axiosInstance.post("/auth/signup", data);
//                   set({ authUser: res.data });
//                   toast.success("Account created successfully");
//                   get().connectSocket();
//             } catch (error) {
//                   toast.error(error.response.data.message);
//             } finally {
//                   set({ isSigningUp: false });
//             }
//       },

//       login: async (data) => {
//             set({ isLoggingIn: true });
//             try {
//                   const res = await axiosInstance.post("/auth/login", data);
//                   set({ authUser: res.data });
//                   toast.success("Logged in successfully");
//                   get().connectSocket();
//             } catch (error) {
//                   toast.error(error.response.data.message);
//             } finally {
//                   set({ isLoggingIn: false });
//             }
//       },

//       logout: async () => {
//             try {
//                   await axiosInstance.post("/auth/logout");
//                   set({ authUser: null });
//                   toast.success("Logged out successfully");
//                   get().disconnectSocket();
//             } catch (error) {
//                   toast.error(error.response.data.message);
//             }
//       },

//       updateProfile: async (data) => {
//             set({ isUpdatingProfile: true });
//             try {
//                   const res = await axiosInstance.put("/auth/update-profile", data);
//                   set({ authUser: res.data });
//                   toast.success("Profile updated successfully");
//             } catch (error) {
//                   console.log("error in update profile:", error);
//                   toast.error(error.response.data.message);
//             } finally {
//                   set({ isUpdatingProfile: false });
//             }
//       },

//       // ------------------ Socket Connection & Signaling --------------------

//       connectSocket: () => {
//             const { authUser } = get();
//             if (!authUser || get().socket?.connected) return;

//             const socket = io(BASE_URL, {
//                   query: {
//                         userId: authUser._id,
//                   },
//             });
//             socket.connect();

//             set({ socket: socket });

//             // Online users list
//             socket.on("getOnlineUsers", (userIds) => {
//                   set({ onlineUsers: userIds });
//             });

//             // ------------------ Signaling Event Handlers ---------------------

//             socket.on("incoming-call", ({ callerId, signalData }) => {
//                   // Handle incoming call (e.g., show UI)
//                   console.log("Incoming call from:", callerId);
//                   // You might want to save callerId and signalData in your state here
//             });

//             socket.on("call-accepted", ({ calleeId, signalData }) => {
//                   // Peer accepted your call
//                   console.log("Call accepted by:", calleeId);
//             });

//             socket.on("ice-candidate", ({ from, candidate }) => {
//                   // Add remote ICE candidate
//                   console.log("Received ICE from:", from);
//             });

//             socket.on("call-ended", ({ from }) => {
//                   // Handle call ending UI
//                   console.log("Call ended by:", from);
//             });
//       },

//       disconnectSocket: () => {
//             const { socket } = get();
//             if (socket?.connected) socket.disconnect();
//       },

//       // ----------- Signaling functions to emit events -----------

//       callUser: (calleeId, signalData) => {
//             const { socket } = get();
//             if (socket && socket.connected) {
//                   socket.emit("call-user", { calleeId, signalData });
//             }
//       },

//       answerCall: (callerId, signalData) => {
//             const { socket } = get();
//             if (socket && socket.connected) {
//                   socket.emit("call-accepted", { callerId, signalData });
//             }
//       },

//       sendIceCandidate: (targetId, candidate) => {
//             const { socket } = get();
//             if (socket && socket.connected) {
//                   socket.emit("ice-candidate", { targetId, candidate });
//             }
//       },

//       endCall: (targetId) => {
//             const { socket } = get();
//             if (socket && socket.connected) {
//                   socket.emit("end-call", { targetId });
//             }
//       },

//       // We can add more methods here related to call handling...
// }));


// 📁 useAuthStore.js
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:8000" : "/";

export const useAuthStore = create((set, get) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: true,
      onlineUsers: [],
      socket: null,
      incomingCall: null, // 🚀 Add this to track call info
      isCallModalOpen: false,

      // ----------------- Auth ------------------
      checkAuth: async () => {
            try {
                  const res = await axiosInstance.get("/auth/check");
                  set({ authUser: res.data });
                  get().connectSocket();
            } catch (error) {
                  console.log("Error in checkAuth:", error);
                  set({ authUser: null });
            } finally {
                  set({ isCheckingAuth: false });
            }
      },

      signup: async (data) => {
            set({ isSigningUp: true });
            try {
                  const res = await axiosInstance.post("/auth/signup", data);
                  set({ authUser: res.data });
                  toast.success("Account created successfully");
                  get().connectSocket();
            } catch (error) {
                  toast.error(error.response?.data?.message || "Signup failed");
            } finally {
                  set({ isSigningUp: false });
            }
      },

      login: async (data) => {
            set({ isLoggingIn: true });
            try {
                  const res = await axiosInstance.post("/auth/login", data);
                  set({ authUser: res.data });
                  toast.success("Logged in successfully");
                  get().connectSocket();
            } catch (error) {
                  toast.error(error.response?.data?.message || "Login failed");
            } finally {
                  set({ isLoggingIn: false });
            }
      },

      logout: async () => {
            try {
                  await axiosInstance.post("/auth/logout");
                  set({ authUser: null });
                  toast.success("Logged out successfully");
                  get().disconnectSocket();
            } catch (error) {
                  toast.error(error.response?.data?.message || "Logout failed");
            }
      },

      updateProfile: async (data) => {
            set({ isUpdatingProfile: true });
            try {
                  const res = await axiosInstance.put("/auth/update-profile", data);
                  set({ authUser: res.data });
                  toast.success("Profile updated successfully");
            } catch (error) {
                  console.log("error in update profile:", error);
                  toast.error(error.response?.data?.message || "Update failed");
            } finally {
                  set({ isUpdatingProfile: false });
            }
      },

      // ------------------ Socket --------------------

      connectSocket: () => {
            const { authUser, socket } = get();
            if (!authUser || socket?.connected) return;

            const newSocket = io(BASE_URL, {
                  query: { userId: authUser._id },
            });

            set({ socket: newSocket });

            newSocket.on("getOnlineUsers", (userIds) => {
                  set({ onlineUsers: userIds });
            });

            // Signaling handlers
            newSocket.on("incoming-call", ({ callerId, signalData }) => {
                  console.log("Incoming call from:", callerId);
                  set({ incomingCall: { callerId, signalData }, isCallModalOpen: true });
            });

            newSocket.on("call-accepted", ({ calleeId, signalData }) => {
                  console.log("Call accepted by:", calleeId);
            });

            newSocket.on("ice-candidate", ({ from, candidate }) => {
                  console.log("ICE candidate from:", from);
            });

            newSocket.on("call-ended", ({ from }) => {
                  console.log("Call ended by:", from);
                  set({ incomingCall: null, isCallModalOpen: false });
            });
      },

      disconnectSocket: () => {
            const { socket } = get();
            if (socket?.connected) socket.disconnect();
      },

      callUser: (calleeId, signalData) => {
            const { socket } = get();
            if (socket?.connected) {
                  socket.emit("call-user", { calleeId, signalData });
            }
      },

      answerCall: (callerId, signalData) => {
            const { socket } = get();
            if (socket?.connected) {
                  socket.emit("call-accepted", { callerId, signalData });
            }
      },

      sendIceCandidate: (targetId, candidate) => {
            const { socket } = get();
            if (socket?.connected) {
                  socket.emit("ice-candidate", { targetId, candidate });
            }
      },

      endCall: (targetId) => {
            const { socket } = get();
            if (socket?.connected) {
                  socket.emit("end-call", { targetId });
            }
      },

      setIncomingCall: (callData) => set({ incomingCall: callData }),
      setIsCallModalOpen: (flag) => set({ isCallModalOpen: flag }),
}));
