import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function Setting() {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center relative">
      {/* Animated icon */}
      <motion.div
        initial={{ rotate: -20, scale: 0 }}
        animate={{ rotate: 0, scale: 1.4 }}
        transition={{ type: "spring", stiffness: 160, damping: 10 }}
        className="text-6xl mb-4"
      >
        🛠️
      </motion.div>

      {/* Coming Soon Text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-3xl text-gray-700 font-semibold"
      >
        This feature is under construction!
      </motion.div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowModal(true)}
        className="mt-6 px-6 py-3 bg-teal-600 text-white rounded-full shadow-md hover:bg-teal-700 transition"
      >
        Notify Me When Ready
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
              <h2 className="text-xl font-semibold mb-4">🚀 Almost There!</h2>
              <p className="text-gray-600 mb-6">
                Drop your email and we’ll ping you when it’s live!
              </p>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border rounded mb-4"
              />
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
              >
                Submit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Setting
