'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

export default function MotionDialog(props: { children: ReactNode }) {
    const duration = 0.2
    const translateXY = 'translateX(-50%) translateY(-50%)'

    return (
        <>
            <motion.div
                className={
                    ' dialog-backdrop fixed w-full h-full backdrop-blur-sm bg-white/30 z-[90] ' +
                    'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-bright-navy/50'
                }
                transition={{ ease: 'backOut', duration: duration }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />
            <motion.div
                className=" motion-dialog fixed bg-full-white py-3 md:py-6 px-2 md:px-8 shadow-lg border rounded-lg z-[100] left-1/2 top-1/2 origin-top-left dark:bg-dark-navy dark:border-bright-navy w-11/12 xs:w-10/12 sm:w-auto"
                transition={{ ease: 'backOut', duration: duration }}
                initial={{ transform: 'scale(0.95)' + translateXY, opacity: 0 }}
                animate={{ transform: 'scale(1)' + translateXY, opacity: 1 }}
                exit={{ transform: 'scale(0.95)' + translateXY, opacity: 0 }}>
                {props.children}
            </motion.div>
        </>
    )
}
