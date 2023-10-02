import { useMemo, useState, useEffect } from 'react'
import { Theme } from '../types/constants'

export default function useDarkMode() {
    const [theme, setTheme] = useState<Theme>('light')

    const saveChanges = (theme: Theme) => {
        setTheme(theme)
        document.documentElement.classList.add(theme)
        localStorage.setItem('theme', theme)
    }

    const setDark = () => {
        document.documentElement.classList.remove(theme)
        saveChanges('dark')
    }

    const setLight = () => {
        document.documentElement.classList.remove(theme)
        saveChanges('light')
    }

    useEffect(() => {
        const _theme = document.documentElement.classList[0] as Theme
        setTheme(_theme)
    }, [])

    const callbacks = useMemo(
        () => ({
            on: () => setDark(),
            off: () => setLight(),
            toggle: () => (theme === 'dark' ? setLight() : setDark())
        }),
        [theme]
    )

    return [theme, callbacks] as const
}
