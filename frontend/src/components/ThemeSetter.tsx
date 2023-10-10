'use client'

import { useEffect } from 'react'
import { Theme } from '@/types/constants'

export default function ThemeSetter() {
    useEffect(() => {
        let theme: Theme | null = localStorage.getItem('theme') as Theme

        if (!theme) {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                theme = 'dark'
                localStorage.setItem('theme', 'dark')
            } else {
                theme = 'light'
                localStorage.setItem('theme', 'light')
            }
        }

        document.documentElement.classList.add(theme)
    })

    return null
}
