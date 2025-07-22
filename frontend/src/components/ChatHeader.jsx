
import { X, Video } from "lucide-react"; // Added Video icon
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";
import VideoCall from "./VideoCall"; // Import your VideoCall component

const ChatHeader = () => {
      const { selectedUser, setSelectedUser } = useChatStore();
      const { onlineUsers } = useAuthStore();
      const [showVideoCall, setShowVideoCall] = useState(false);
      

      return (
            <div className="p-2.5 border-b border-base-300">
                  <div className="flex items-center justify-between">
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                              {/* Avatar */}
                              <div className="avatar">
                                    <div className="size-10 rounded-full relative">
                                          <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
                                    </div>
                              </div>

                              {/* User Name & Status */}
                              <div>
                                    <h3 className="font-medium">{selectedUser.fullName}</h3>
                                    <p className="text-sm text-base-content/70">
                                          {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
                                    </p>
                              </div>
                        </div>

                        {/* Buttons: Close & Video Call */}
                        <div className="flex items-center space-x-2">
                              {/* Video Call Button */}
                              <button
                                    className="btn btn-sm btn-circle btn-ghost"
                                    title="Start Video Call"
                                    
                                    onClick={() => {
                                          console.log("Video Call button clicked");
                                          setShowVideoCall(true)
                                    }}
                              >
                                    <Video className="w-4 h-4" />
                              </button>

                              {/* Close Button */}
                              <button onClick={() => setSelectedUser(null)} className="btn btn-sm btn-circle btn-ghost" title="Close">
                                    <X />
                              </button>
                        </div>
                  </div>

                  {/* Render the VideoCall overlay/modal */}
                  {showVideoCall && selectedUser && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
                              <div className="bg-white rounded-lg relative w-full max-w-3xl shadow-lg p-4">
                                    {/* Close button inside modal */}
                                    <button
                                          className="absolute top-2 right-2 btn btn-sm btn-error"
                                          onClick={() => {

                                                console.log("close clicked");
                                                setShowVideoCall(false)}}
                                    >
                                          Close
                                    </button>
                                    {/* Your VideoCall component with remoteUserId */}
                                    <VideoCall
                                          remoteUserId={selectedUser._id}
                                          onClose={() => setShowVideoCall(false)}
                                    />
                              </div>
                        </div>
                  )}
            </div>
      );
};

export default ChatHeader;