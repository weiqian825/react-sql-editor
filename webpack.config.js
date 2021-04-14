import { defineConfig } from 'umi';

export default defineConfig({
  publicPath:
    process.env.NODE_ENV === 'production' ? '/react-sql-editor/' : '/',
  base: '/',
});
