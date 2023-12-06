import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts']
  },
  resolve: {
    alias: {
        config: 'src/config',
        controllers: 'src/controllers',
        helpers: 'src/helpers',
        middleware: 'src/middlewares',
        routes: 'src/routes',
        scripts: 'src/scripts',
        types: 'src/types',
        utils: 'src/utils',
        index: 'src/index.ts'
    }
  }
})