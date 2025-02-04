"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function RoomPage() {
  const { roomId } = useParams()
  const [messages, setMessages] = useState<string[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const wsRef = useRef<WebSocket | null>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!roomId) return

    const ws = new WebSocket("ws://localhost:8080")

    ws.onopen = () => {
      console.log(`Connected to WebSocket, joining room ${roomId}`)
      ws.send(JSON.stringify({ type: "join", payload: { roomId } }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === "chat") {
        setMessages((prev) => [...prev, data.message])
      }
    }

    ws.onclose = () => console.log("Disconnected from WebSocket")

    wsRef.current = ws

    return () => ws.close()
  }, [roomId])

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatContainerRef]) //Corrected dependency

  const sendMessage = () => {
    if (!inputMessage.trim()) return

    wsRef.current?.send(
      JSON.stringify({
        type: "chat",
        payload: { message: inputMessage, roomId },
      }),
    )

    setInputMessage("")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-4">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
      >
        Room: {roomId}
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-gradient-to-r from-blue-800/50 to-purple-800/50 p-6 rounded-lg shadow-2xl backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-center mb-4">Chat Messages</h2>

        <div
          ref={chatContainerRef}
          className="h-96 overflow-y-auto p-4 bg-blue-950/30 rounded-lg mb-4 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-blue-950"
        >
          <AnimatePresence>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-800/50 px-4 py-2 rounded-lg mb-2 shadow-md"
                >
                  {msg}
                </motion.div>
              ))
            ) : (
              <p className="text-blue-300 text-center">No messages yet...</p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex mt-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Enter your message..."
            className="flex-1 px-4 py-2 bg-blue-950/50 border border-blue-500/50 rounded-l-full text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={sendMessage}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-r-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            Send
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}

