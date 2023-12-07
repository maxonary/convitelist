import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
        'src/**/*.test.ts',
        '!src/tests'
      ]
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