// pages/chat.js (or wherever)
"use client";
import ChatWindow from "@/components/chat/ChatWindow";
import Sidebar from "@/components/chat/Sidebar";
import { disconnectSocket, initializeSocket } from "@/utils/socket";
import { useEffect, useState } from "react";
import { useSelector, useStore } from "react-redux";

export default function Page() {
  const store = useStore();
  const { currentUser } = useSelector(state => state.user);
  const { selectedUser } = useSelector((state) => state.chat);
  // view = "sidebar" | "chat"
  const [view, setView] = useState(selectedUser ? "chat" : "sidebar");


  useEffect(() => {
    if (currentUser?._id) {
      const socket = initializeSocket(store);
      socket.emit("addUser", currentUser._id);
      return () => void disconnectSocket();
    }
  }, [currentUser?._id, store]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 ">
      {/* Back button only on <992px */}
      {view !== "sidebar"
        && < div className="lg:hidden mb-4">
          <button
            className="bg-[#074c77] text-white px-6 py-2 rounded-full hover:bg-cyan-600"
            onClick={() => setView("sidebar")}
          >
            ← Back
          </button>
        </div >}
      <div className="flex h-[85dvh] my-7 w-full max-w-full lg:max-w-[1450px] mx-auto overflow-hidden">
        {/* Sidebar: full width on <992px, hidden once a chat is selected */}
        <div
          className={`${view === "sidebar" ? "block" : "hidden"
            } lg:block w-full lg:w-1/4 bg-white lg:border-r-2`}
        >
          <Sidebar onSelectChat={() => setView("chat")} />
        </div>

        {/* Chat window: full width on <992px when in chat view, hidden otherwise */}
        <div
          className={`${view === "chat" ? "block" : "hidden"
            } lg:block flex-1 flex flex-col`}
        >

          <ChatWindow />
        </div>
      </div>
    </div>

  );
}
