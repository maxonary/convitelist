import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts']
  },
  resolve: {
    alias: {
        controllers: 'src/controllers',
        helpers: 'src/helpers',
        middleware: 'src/middlewares',
        scripts: 'src/scripts',
        utils: 'src/utils',
    }
  }
})