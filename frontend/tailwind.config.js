/** @type {import('tailwindcss').Config} */
import { screens, fontFamily } from 'tailwindcss/defaultTheme'

module.exports = {
    daisyui: {
        themes: ['light']
    },
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx}',
        './src/components/**/*.{js,ts,jsx,tsx}',
        './src/app/**/*.{js,ts,jsx,tsx}'
    ],
    theme: {
        fontFamily: {
            inter: 'Inter, Grotesk Schibsted, Segoe UI, Tahoma, Geneva, Open Sans, Helvetica Neue, Verdana, sans-serif',
            ...fontFamily
        },
        screens: {
            xs: '320px',
            // => @media (min-width: 320px) { ... }
            ...screens
        },
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'page-primary': 'linear-gradient(170deg, #001253, #3E6D9C 40% 50%, #E14D2A)'
            },
            screens: {
                tall: { raw: '(min-height: 624px)' }
                // => @media (min-height: 800px) { ... }
            },
            colors: {
                'night-blue-primary': '#19376D',
                'night-blue-accent': '#0B2447',
                'soothing-blue': '#3E6D9C',
                // 'orange-gold': '#ffa600',
                // Old theme pallet

                'dark-blue': '#0b2447',
                'night-blue': '#19376d',
                'orange-gold': '#F79327',
                'full-white': '#ffffff',
                'dim-white': '#f5f5f5',
                'dark-navy': '#213555',
                'bright-navy': '#4F709C'
            },
            skew: {
                8: '8deg'
            },
            fontSize: {
                10: '0.625rem',
                8: '0.5rem',
                6: '0.375rem',
                4: '0.25rem',
                2: '0.125rem'
            },
            boxShadow: {
                btn: '0 0 0 1px rgba(0,0,0,0.08, transparent)'
            }
        }
    },
    plugins: [require('daisyui')]
}
