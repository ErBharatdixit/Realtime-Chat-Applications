
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

const VideoCall = ({ remoteUserId, onClose }) => {
      const localVideoRef = useRef(null);
      const remoteVideoRef = useRef(null);
      const { socket, callUser, answerCall, sendIceCandidate, endCall } = useAuthStore();

      const [peerConnection, setPeerConnection] = useState(null);
      const [localStream, setLocalStream] = useState(null);

      // Ask for camera/mic on mount
      useEffect(() => {
            console.log("📞 VideoCall component mounted with remoteUserId:", remoteUserId);

            const getMedia = async () => {
                  try {
                        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                        if (localVideoRef.current) {
                              localVideoRef.current.srcObject = stream;
                        }
                        setLocalStream(stream);
                        console.log(" Access granted to camera/microphone");
                        startCall(stream);
                  } catch (err) {
                        console.error("❌ Error accessing media devices:", err);
                  }
            };

            getMedia();
      }, [remoteUserId]);

      //  Start the call (create peer connection)
      const startCall = (stream) => {
            const pc = new RTCPeerConnection();

            // Add local tracks
            stream.getTracks().forEach((track) => pc.addTrack(track, stream));

            // Handle remote tracks
            pc.ontrack = (event) => {
                  if (remoteVideoRef.current) {
                        remoteVideoRef.current.srcObject = event.streams[0];
                  }
            };

            // Send ICE candidates
            pc.onicecandidate = (event) => {
                  if (event.candidate) {
                        socket.emit("ice-candidate", {
                              to: remoteUserId,
                              candidate: event.candidate,
                        });
                  }
            };

            setPeerConnection(pc);
            callUser(remoteUserId, pc); // Trigger offer creation

            console.log("📞 Call started with peer connection");
      };

      //  Handle incoming ICE
      useEffect(() => {
            console.log("📡 Setting up socket listeners");

            socket.on("ice-candidate", ({ candidate }) => {
                  if (peerConnection && candidate) {
                        peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
                  }
            });

            socket.on("call-ended", () => {
                  console.log("📴 Call ended by remote user");
                  cleanUp();
            });

            return () => {
                  console.log("🔚 Cleaning up VideoCall component");
                  socket.off("ice-candidate");
                  socket.off("call-ended");
            };
      }, [peerConnection, socket]);

      //  End call & clean
      const cleanUp = () => {
            if (peerConnection) {
                  peerConnection.close();
            }

            if (localStream) {
                  localStream.getTracks().forEach((track) => track.stop());
            }

            setPeerConnection(null);
            setLocalStream(null);
      };

      const handleHangUp = () => {
            socket.emit("end-call", { to: remoteUserId });
            cleanUp();
            onClose(); // Now manually trigger close
      };

      return (
            <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                        <video ref={localVideoRef} autoPlay muted className="rounded w-64 border" />
                        <video ref={remoteVideoRef} autoPlay className="rounded w-64 border" />
                  </div>

                  <button onClick={handleHangUp} className="btn btn-error">
                        End Call
                  </button>
            </div>
      );
};

export default VideoCall;







