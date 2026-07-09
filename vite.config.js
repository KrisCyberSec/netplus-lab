import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to '/netplus-lab/' when hosting at username.github.io/netplus-lab/
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/netplus-lab/' : '/',
  plugins: [react()],
})
