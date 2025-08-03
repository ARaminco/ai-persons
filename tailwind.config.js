/** @type {import('tailwindcss').Config} */
export default {
  // فعال کردن حالت تاریک بر اساس کلاس در تگ <html>
  darkMode: 'class',

  // مسیر صحیح فایل‌هایی که باید اسکن شوند
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],

  theme: {
    extend: {
      // تعریف فونت وزیرمتن برای استفاده در پروژه
      fontFamily: {
        vazir: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
