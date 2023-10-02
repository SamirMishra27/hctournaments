import { useCallback, useEffect } from 'react'

export default function useEscapeKey(handleClose: () => void) {
    const handleKeyUpEvent = useCallback(
        (event: globalThis.KeyboardEvent) => {
            if (event.code === 'Escape') handleClose()
        },
        [handleClose]
    )

    useEffect(() => {
        document.addEventListener('keyup', handleKeyUpEvent)

        return () => document.removeEventListener('keyup', handleKeyUpEvent)
    }, [handleKeyUpEvent])
}
