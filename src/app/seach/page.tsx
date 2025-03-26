"use client";

import Link from "next/link";
import {
  BiDockLeft,
  BiEdit,
  BiSearch,
  BiDotsHorizontalRounded,
  BiSend,
  BiMenu,
  BiLoader,
  BiDockRight,
} from "react-icons/bi";
import { RiOpenaiFill } from "react-icons/ri";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import { addMessage, setLoading } from "../../redux/chatSlice";

export default function SearchPage() {
  const [mounted, setMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [input, setInput] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const messages = useSelector((state: RootState) => state.chat.messages);
  const isLoading = useSelector((state: RootState) => state.chat.isLoading);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      dispatch(setLoading(true));
      dispatch(addMessage({ text: input, sender: "user" }));
      setInput("");

      setTimeout(() => {
        dispatch(addMessage({ text: "Tôi có thể giúp gì cho bạn?", sender: "bot" }));
        dispatch(setLoading(false));
      }, 2000);
    }
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-black relative overflow-hidden">
      {/* SIDEBAR trên desktop */}
      <div
        className={`bg-gray-900 text-white transition-all duration-300 overflow-hidden 
          ${isSidebarOpen ? "w-64 p-4" : "w-0 p-0"} 
          hidden md:block
        `}
      >
        <div className="flex items-center mb-6">
          <BiDockLeft
            className="h-6 w-6 cursor-pointer"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
          <BiSearch className="h-6 w-6 ml-auto" />
          <BiEdit className="ms-3 h-6 w-6" />
        </div>

        {isSidebarOpen && (
          <>
            <div className="flex items-center mb-6">
              <RiOpenaiFill className="h-6 w-6 rounded-full border border-gray-600 p-1" />
              <h1 className="ms-3 text-base font-semibold">ChatGPT</h1>
            
            </div>
          </>
        )}
      </div>
 {/* SIDEBAR trên điện thoại */}
<div
  className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-transform duration-300 z-50
    ${isSidebarOpen ? "translate-x-0 w-2/3" : "-translate-x-full w-0"} 
    md:hidden`}
>
  <div className="flex items-center p-4">
    <BiDockLeft
      className="h-6 w-6 cursor-pointer"
      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    />
    <BiSearch className="h-6 w-6 ml-auto" />
    <BiEdit className="ms-3 h-6 w-6" />
  </div>

  {isSidebarOpen && (
    <div className="p-4">
      <div className="flex items-center mb-6">
        <RiOpenaiFill className="h-6 w-6 rounded-full border border-gray-600 p-1" />
        <h1 className="ms-3 text-base font-semibold">ChatGPT</h1>
      </div>
    </div>
  )}
</div>


      {/* MAIN CHAT AREA */}
      <div className="flex-1 flex flex-col bg-gray-800 p-4 w-full">
      {!isSidebarOpen && (
          <>
          <BiDockRight
            className="h-6 w-6 cursor-pointer text-gray-200"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          />
        
          </>
        )}
        <h2 className="text-white text-lg font-semibold text-center mb-4">
          Tôi có thể giúp gì cho bạn?
        </h2>

        {/* Chat Box */}
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 rounded-lg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <span
                className={`px-4 py-2 rounded-lg text-white ${
                  msg.sender === "user" ? "bg-gray-500" : "bg-gray-700"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="flex items-center bg-gray-900 p-2 rounded-lg mt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi bất kỳ điều gì..."
            className="flex-1 bg-transparent text-white p-2 outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || input.trim() === ""}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center justify-center
                       transition-all duration-300 hover:bg-gray-600 disabled:opacity-50
                       disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <BiLoader className="h-5 w-5 animate-spin" />
            ) : (
              <BiSend className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
