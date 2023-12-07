import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/tests/**/*.test.ts'],
    threads: false,
    setupFiles: ['src/tests/helpers/setup.ts']
  },
  resolve: {
    alias: {
        config: 'src/config',
        helpers: 'src/helpers',
        lib: '/src/lib'
    }
  }
})