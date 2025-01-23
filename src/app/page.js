"use client";
import dynamic from "next/dynamic";
const LdrsComponent = dynamic(() => import("ldrs"), { ssr: false });
import { useState, useEffect, useRef } from "react";
import { IoSend, IoMic } from "react-icons/io5";
import Link from "next/link";
import Image from "next/image";
import { TextGenerateEffect } from "@/Components/Ui/TextGenerateEffect";

export default function Home() {
  const chatContainerRef = useRef(null);
  const recognition = useRef(null);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { quantum, mirage } = require("ldrs");
      quantum.register();
      mirage.register();
    }
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition.current = new SpeechRecognition();
      recognition.current.lang = "en-US";
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onstart = () => {
        setIsListening(true);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };

      recognition.current.onresult = (event) => {
        const transcript = event.results[event.resultIndex][0].transcript;
        setMessage(transcript);
      };
    } else {
      console.error("SpeechRecognition API is not supported in this browser.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    setLoading(true);
    setIsListening(false);

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

  const toggleVoiceInput = () => {
    if (recognition.current) {
      if (isListening) {
        recognition.current.stop();
      } else {
        recognition.current.start();
      }
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="md:container px-2 md:px-0">
      <div
        className="h-[75vh] w-[90%] absolute top-2 lg:top-4 overflow-y-auto"
        ref={chatContainerRef}
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            {chatHistory?.map((chat, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  chat?.sender === "customer" ? "text-end" : "text-start"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg ${
                    chat?.sender === "ai" &&
                    "bg-gray-200 w-[80%] text-sm font-medium"
                  }`}
                >
                  <div
                    className={`flex space-x-2 ${
                      chat?.sender === "customer"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    {chat?.sender === "ai" && (
                      <Image
                        src="/images/ai.png"
                        alt="Profile Icon"
                        width={50}
                        height={50}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <TextGenerateEffect
                      words={chat.message}
                      filter={chat.sender === "ai"}
                      duration={1}
                    />
                    {chat?.sender === "customer" && (
                      <Image
                        src="/images/human.jpg"
                        alt="Profile Icon"
                        width={50}
                        height={50}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isListening && (
            <div
              className={`fixed z-10 left-1/2 transform -translate-x-1/2 ${
                chatHistory?.length > 0
                  ? "bottom-28"
                  : "bottom-28 lg:bottom-2/3"
              }`}
            >
              <l-mirage size="120" speed="3.0" color="black"></l-mirage>
            </div>
          )}

          <div
            className={`fixed flex justify-center w-full transition-all ${
              chatHistory?.length > 0 ? "bottom-16" : "bottom-14 lg:bottom-1/2"
            }`}
          >
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-2 transition-all"
            >
              <div className="relative">
                <input
                  type="text"
                  value={message}
                  disabled={loading}
                  onChange={(e) => setMessage(e.target.value)}
                  className="lg:w-[800px] w-[280px] p-3 border rounded-lg transition-all relative"
                  placeholder="Write message to ChatBot"
                />
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  className="ml-2 text-2xl absolute right-4 top-1/2 transform -translate-y-1/2"
                >
                  <IoMic color={isListening ? "red" : "black"} />
                </button>
              </div>

              <div>
                {loading ? (
                  <l-quantum size="45" speed="1.75" color="black"></l-quantum>
                ) : (
                  <button type="submit" className="glow-on-hover">
                    <IoSend size={20} />
                  </button>
                )}
              </div>
            </form>
            <div className="fixed text-neutral-700 text-sm lg:text-base bottom-4 flex justify-center">
              <p>
                Develop by{" "}
                <Link
                  className="underline"
                  target="_blank"
                  href="https://mernshihab.xyz"
                >
                  @Shihab
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
