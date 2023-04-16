/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/app/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'page-primary': 'linear-gradient(170deg, #001253, #3E6D9C 40% 50%, #E14D2A)'
            },
            screens: {
                xs: '320px',
                // => @media (min-width: 320px) { ... }
                tall: { raw: '(min-height: 624px)' }
                // => @media (min-height: 800px) { ... }
            },
            colors: {
                'night-blue-primary': '#19376D',
                'night-blue-accent': '#0B2447',
                'soothing-blue': '#3E6D9C'
            }
        }
    },
    plugins: []
}
