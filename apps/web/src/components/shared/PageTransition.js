'use client'

import {motion, useReducedMotion} from 'framer-motion'

export default function PageTransition({children}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={prefersReducedMotion ? false : {opacity: 0, y: 10}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.28, ease: 'easeOut'}}
    >
      {children}
    </motion.div>
  )
}
