"use client";
import { useState, useEffect, useRef } from "react";
import { TextGenerateEffect } from "../ui/text-generate-effect";
import { IoSend } from "react-icons/io5";
import { quantum } from "ldrs";

export default function ChatComponent() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  quantum.register();

  const chatContainerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    setLoading(true);

    const currentMessage = message;
    const userMessage = { sender: "customer", message };
    setChatHistory((prevHistory) => [...prevHistory, userMessage]);
    setMessage("");

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMessage }),
      });

      const data = await res.json();
      const aiMessage = { sender: "ai", message: data.response };
      setChatHistory((prevHistory) => [...prevHistory, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="container">
      <div
        className="h-[70vh] absolute top-0 overflow-y-auto"
        ref={chatContainerRef}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {chatHistory?.map((chat, index) => (
              <div
                key={index}
                className={`transition-all flex duration-500 ${
                  chat?.sender === "customer" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    chat?.sender === "customer"
                      ? ""
                      : "bg-gray-300 w-[80%] text-xs font-medium"
                  }`}
                >
                  <TextGenerateEffect
                    words={chat.message}
                    filter={chat.sender === "ai"}
                    duration={1}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            className={`fixed flex justify-center w-full transition-all ${
              chatHistory?.length > 0 ? "bottom-16" : "bottom-1/2"
            }`}
          >
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-2 transition-all"
            >
              <input
                type="text"
                value={message}
                disabled={loading}
                onChange={(e) => setMessage(e.target.value)}
                className="w-[800px] p-3 border rounded-lg transition-all"
                placeholder="Write message to ChatBot"
              />
              <div>
                {loading ? (
                  <l-quantum size="45" speed="1.75" color="black"></l-quantum>
                ) : (
                  <button type="submit" className="glow-on-hover">
                    <IoSend size={22} />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
