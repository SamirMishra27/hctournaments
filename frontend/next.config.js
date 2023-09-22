/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['media.discordapp.net', 'cdn.discordapp.com'],
        remotePatterns: [{ protocol: 'https', hostname: '*.discordapp.net' }]
    },
    experimental: {
        scrollRestoration: true,
        serverActions: true
    }
}

module.exports = nextConfig
