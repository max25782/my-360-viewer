/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      screens: {
        'ipad-mini': '768',
        'ipad-air': '820',
        'ipad-pro': '1024',
      },
    },
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['LeagueSpartan', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          spartan: ['LeagueSpartan', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        },
        fontWeight: {
          thin: '100',
          extralight: '200',
          light: '300',
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700',
          extrabold: '800',
          black: '900',
        },
      },
    },
    plugins: [],
  }
}
