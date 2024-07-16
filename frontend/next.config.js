/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['media.discordapp.net', 'cdn.discordapp.com', 'res.cloudinary.com'],
        remotePatterns: [
            { protocol: 'https', hostname: '*.discordapp.net' },
            { protocol: 'https', hostname: '*.cloudinary.com' },
            { protocol: 'https', hostname: '*.tixte.net' }
        ]
    },
    experimental: {
        scrollRestoration: true,
        serverActions: true
    }
}

module.exports = nextConfig
