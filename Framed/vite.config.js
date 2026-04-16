import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import commandBridge from './src/bridge/viteCommandBridge.js'

export default defineConfig({
  plugins: [react(), commandBridge()],
})
