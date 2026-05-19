import React, { useState, useRef } from "react";
import {
  Mic,
  PanelLeft,
  Square,
  SendHorizontal,
  Trophy,
  Music2,
  Code2,
  Image as ImageIcon
} from "lucide-react";
import QuickActionSidebar from "./QuickActionSidebar";

const ChatCard = () => {
  const [messages, setMessages] = useState([
    {
      text: "Hello! How can I help you?",
      user: false
    }
  ]);

  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const addMessage = (text, isUser = true, isAudio = false) => {
    setMessages((prev) => [
      ...prev,
      { text, user: isUser, audio: isAudio }
    ]);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    addMessage(input, true);
    setInput("");

    setTimeout(() => {
      addMessage("This is a demo response.", false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const handleRecord = async () => {
    if (!recording) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: "audio/webm"
        });

        const url = URL.createObjectURL(blob);
        addMessage(url, true, true);
      };

      mediaRecorder.start();
      setRecording(true);
    } else {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-dvh bg-neutral text-white overflow-y-auto">

      {/* LEFT SIDEBAR */}
      <aside
        className="
          order-3 sm:order-1
          w-full sm:w-20
          min-h-[120px] sm:min-h-dvh
          border-t sm:border-t-0 sm:border-r
          border-primary bg-neutral mt-8
        "
      >
        <div className="flex sm:flex-col items-center justify-center sm:justify-start gap-4 py-4 mt-5">
          <button className="btn btn-ghost btn-circle text-info">
            <PanelLeft size={22} />
          </button>
        </div>
      </aside>

      {/* MAIN CHAT SECTION */}
      <main className="order-1 sm:order-2 flex-1 flex flex-col min-h-dvh sm:min-h-dvh">

        {/* CENTER AREA */}
        <div
          className={`flex-1 overflow-y-auto px-1 sm:px-4 ${messages.length === 1
              ? "flex flex-col justify-center"
              : "py-6"
            }`}
        >
          <div className="max-w-3xl mx-auto w-full space-y-6">

            {/* EMPTY STATE */}
            {messages.length === 1 && (
              <div className="flex flex-col items-center mb-6">
                <h1 className="text-3xl sm:text-5xl font-semibold text-center text-info mb-10">
                  Ready when you are.
                </h1>
              </div>
            )}

            {/* MESSAGES */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.user ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[75%] px-4 py-3 mt-10 rounded-2xl text-sm ${msg.user
                      ? "bg-secondary text-zinc-900"
                      : "bg-info text-black"
                    }`}
                >
                  {msg.audio ? (
                    <audio controls className="max-w-full">
                      <source src={msg.text} type="audio/webm" />
                    </audio>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="w-full px-3 sm:px-4 pb-8 mb-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center bg-secondary border border-info rounded-full px-4 py-2">

              <input
                type="text"
                placeholder="Ask anything"
                className="flex-1 bg-transparent outline-none px-2 text-black min-w-0"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />

              <button
                onClick={handleRecord}
                className={`btn btn-circle btn-sm ${recording
                    ? "bg-red-500 text-white"
                    : "bg-info text-zinc"
                  }`}
              >
                {recording ? <Square size={16} /> : <Mic size={18} />}
              </button>

              <button
                onClick={sendMessage}
                className="btn btn-circle btn-sm ml-2 bg-info text-zinc"
              >
                <SendHorizontal size={16} />
              </button>

            </div>
          </div>
        </div>
      </main>

      {/* RIGHT SIDEBAR */}
      <aside
        className="
          order-2 sm:order-3
          w-full sm:w-72
          border-t sm:border-t-0 sm:border-l
          border-primary bg-neutral mt-8
        "
      >
        <QuickActionSidebar></QuickActionSidebar>
      </aside>
    </div>
  );
};

export default ChatCard;