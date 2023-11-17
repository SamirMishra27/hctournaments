'use client'

import { motion } from 'framer-motion'
import { CSSProperties } from 'react'
import heroImage from '@assets/hero-image.webp'

export default function HomePage() {
    const heroText = 'Taking Cricket Tournaments'
    const heroSubText = 'to the next level'
    const DELAY = 0.15

    function Span({ word, delay }: { word: string; delay: number }) {
        return (
            <span
                style={{ '--delay': `${delay}s` } as CSSProperties}
                className=" inline-block text-appear opacity-0 translate-y-4">
                {word}&nbsp;
            </span>
        )
    }

    return (
        <main className=" w-full flex flex-col items-center justify-start bg-dim-white min-h-content dark:bg-gray-800 transition">
            <section
                className=" hero flex flex-col items-center justify-evenly h-[36rem]"
                style={{ backgroundImage: `url('${heroImage.src}')` }}>
                <div className=" hero-content flex-col">
                    <motion.div
                        className=" absolute w-2/3 aspect-square md:w-[34rem] lg:w-[36rem] left-4 md:left-10 lg:left-20 blur-2xl z-0"
                        style={{
                            background: 'radial-gradient(#F6FDC3, hsl(0deg 0% 100% / 0%))',
                            borderRadius: '50%'
                        }}
                        initial={{
                            scale: 0.7,
                            opacity: 0
                        }}
                        animate={{
                            scale: 1,
                            opacity: 0.6
                        }}
                        transition={{
                            duration: 1,
                            ease: 'easeIn'
                        }}
                    />
                    <motion.div
                        className=" absolute w-1/2 aspect-square md:w-[26rem] lg:w-[28rem] right-6 md:right-12 lg:right-24 top-32 blur-2xl z-0"
                        style={{
                            background: 'radial-gradient(#A6F6FF, hsl(0deg 0% 100% / 0%))',
                            borderRadius: '50%'
                        }}
                        initial={{
                            scale: 0.7,
                            opacity: 0
                        }}
                        animate={{
                            scale: 1,
                            opacity: 0.6
                        }}
                        transition={{
                            duration: 1,
                            ease: 'easeIn'
                        }}
                    />
                    <div className=" text-black font-extrabold text-center px-3 md:px-2 z-10">
                        <h1 className=" text-2xl xs:text-4xl sm:text-5xl md:text-6xl">
                            {heroText.split(' ').map((word, index) => (
                                <Span
                                    word={word}
                                    delay={index * DELAY}
                                    key={`${word}-${index}-1`}
                                />
                            ))}
                        </h1>
                        <h1 className=" text-2xl sm:text-4xl -tracking-normal sm:tracking-widest font-medium md:font-extrabold">
                            {heroSubText.split(' ').map((word, index) => (
                                <Span
                                    word={word}
                                    delay={index * DELAY + DELAY * 3}
                                    key={`${word}-${index}-2`}
                                />
                            ))}
                        </h1>
                    </div>
                    <p className=" text-black/90 max-w-lg text-justify sm:text-center text-lg px-6 md:px-0 mt-8 z-10 inline-block text-appear opacity-0 translate-y-4 [--delay:1s]">
                        See all the latest updates, schedule and results of official
                        <b> HandCricket Tournaments</b> at one place and stay up-to-date with what
                        is happening!
                    </p>
                </div>
            </section>
        </main>
    )
}
