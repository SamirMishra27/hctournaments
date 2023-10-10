import { ReactNode } from 'react'
import { Metadata } from 'next'
import '@/styles/globals.css'

import ThemeSetter from '@/components/ThemeSetter'
import HomeImage from '@assets/home-image.jpg'

// Default Meta Data
const OG_TITLE = 'hctournaments | Hand Cricket'
const OG_SITE_NAME = 'hctournaments'
const OG_DESCRIPTION = 'HandCricket Tournaments at one place'
const OG_IMAGE = HomeImage.src

export const metadata: Metadata = {
    title: OG_TITLE,
    description: OG_DESCRIPTION,

    applicationName: OG_SITE_NAME,
    openGraph: {
        siteName: OG_SITE_NAME,
        description: OG_DESCRIPTION,
        images: OG_IMAGE
    },
    twitter: {
        title: OG_TITLE,
        description: OG_DESCRIPTION,
        card: 'summary_large_image',
        images: OG_IMAGE
    }
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <ThemeSetter />
            <body>{children}</body>
        </html>
    )
}
