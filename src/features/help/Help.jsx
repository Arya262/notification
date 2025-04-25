import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Help() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center relative">
      {/* Animated Help Emoji */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1.5 }}
        transition={{ type: "spring", stiffness: 160, damping: 10 }}
        className="text-6xl mb-4"
      >
        🤖
      </motion.div>

      {/* Help Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl text-gray-700 font-semibold"
      >
        Need Help? We’re here for you!
      </motion.div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition"
      >
        Contact Support
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.7 }}
              animate={{ scale: 1.1 }}
              exit={{ scale: 0.7 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-xl w-[90%] max-w-md text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-semibold mb-4">💬 Contact Support</h2>
              <p className="text-gray-600 mb-6">
                Tell us what’s going wrong or how we can help you:
              </p>
              <textarea
                placeholder="Type your message..."
                className="w-full p-3 border rounded mb-4 resize-none h-28"
              ></textarea>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Send
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Help
