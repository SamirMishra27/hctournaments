/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ['media.discordapp.net', 'cdn.discordapp.com']
    },
    experimental: {
        scrollRestoration: true
    }
}

module.exports = nextConfig
