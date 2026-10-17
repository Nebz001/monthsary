// All images live in public/images and must respect the Vite base path (/monthsary/ on GitHub Pages).
export const img = (file: string) => `${import.meta.env.BASE_URL}images/${file}`

// Every artwork file is a square 1254px canvas.
export const IMG_SIZE = 1254
