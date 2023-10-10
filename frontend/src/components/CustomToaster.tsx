'use client'

import { Toaster } from 'sonner'
import { seconds } from '@/utils'

export default function CustomToaster() {
    return (
        <Toaster // I love this library
            richColors
            expand
            visibleToasts={1}
            position="bottom-right"
            toastOptions={{
                duration: seconds(5),
                className: ' bg-white dark:bg-bright-navy font-inter'
            }}
        />
    )
}
