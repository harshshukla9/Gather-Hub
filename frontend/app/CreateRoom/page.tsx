"use client"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FiCopy, FiCheck } from "react-icons/fi"

export default function Home() {
  const [roomCode, setRoomCode] = useState("")
  const [generatingRoom, setGeneratingRoom] = useState(false)
  const [copied, setCopied] = useState(false) // Copy success state
  const wsRef = useRef<WebSocket | null>(null)
  const router = useRouter()

  const generateRoomCode = () => {
    setGeneratingRoom(true)
    setCopied(false) // Reset copy state on new code generation
    setTimeout(() => {
      setRoomCode(Math.random().toString(36).substring(2, 8).toUpperCase())
      setGeneratingRoom(false)
    }, 500)
  }

  const joinRoom = () => {
    if (!roomCode) return
    wsRef.current?.send(
      JSON.stringify({
        type: "join",
        payload: { roomId: roomCode.trim() }, // Trim spaces
      }),
    )
    router.push(`/room/${roomCode.trim()}`)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000) // Reset after 2s
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")
    wsRef.current = ws
    return () => ws.close()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600"
      >
        Gather Hub
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex flex-col items-center justify-center space-y-6 p-10 bg-gradient-to-r from-blue-800/50 to-purple-800/50 rounded-lg shadow-2xl backdrop-blur-sm w-full max-w-md"
      >
        {/* Create Room Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateRoomCode}
          disabled={generatingRoom}
          className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-blue-500/50"
        >
          {generatingRoom ? "Generating..." : "Create Room"}
        </motion.button>

        {/* Room Code Input with Copy Button */}
        <div className="relative w-full flex items-center">
          <motion.input
            whileFocus={{ scale: 1.05 }}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())} // Allow manual input
            className="w-full px-4 py-3 bg-white/10 border border-blue-500/50 rounded-full text-center text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            placeholder="Enter or Paste Room Code"
          />
          {roomCode && (
            <button
              onClick={copyToClipboard}
              className="absolute right-3 bg-transparent p-2 rounded-full hover:bg-white/20 transition-all duration-300"
            >
              {copied ? (
                <FiCheck className="text-green-400 size-5" />
              ) : (
                <FiCopy className="text-white size-5" />
              )}
            </button>
          )}
        </div>

        {/* Join Room Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={joinRoom}
          disabled={!roomCode}
          className={`w-full px-6 py-3 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 ${
            roomCode
              ? "bg-gradient-to-r from-green-400 to-blue-500 text-white hover:shadow-green-500/50"
              : "bg-gray-600 text-gray-400 cursor-not-allowed"
          }`}
        >
          Join Room
        </motion.button>
      </motion.div>
    </div>
  )
}
