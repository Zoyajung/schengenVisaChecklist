'use client'

import {motion, useReducedMotion} from 'framer-motion'

export default function MotionReveal({children, className = '', delay = 0, ...props}) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      {...props}
      initial={prefersReducedMotion ? false : {opacity: 0, y: 22}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.18}}
      transition={{duration: 0.45, ease: 'easeOut', delay}}
    >
      {children}
    </motion.div>
  )
}
