import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()],
    assetsInclude: ["**/*.glb"],
    optimizeDeps: {
        exclude: ['@studio-freight/lenis']
    }
})