import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import glsl from 'vite-plugin-glsl';

export default defineConfig({
    plugins: [tsconfigPaths(), glsl()],
    assetsInclude: ["**/*.glb"],
    optimizeDeps: {
        exclude: ['@studio-freight/lenis']
    }
})