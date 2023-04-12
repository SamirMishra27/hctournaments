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
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
            },
            backgroundColor: {
                'red-orange': '#E14D2A',
                orange: '#FD841F',
                'soothing-blue': '#3E6D9C',
                'dark-blue': '#001253'
            },
            screens: {
                xs: '320px',
                // => @media (min-width: 320px) { ... }
                tall: { raw: '(min-height: 624px)' }
                // => @media (min-height: 800px) { ... }
            }
        }
    },
    plugins: []
}
