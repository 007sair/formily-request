import { defineConfig } from 'dumi';
import { resolve } from 'path';

export default defineConfig({
  themeConfig: {
    name: 'Formily Request',
    socialLinks: {
      github: 'https://github.com/007sair/formily-request',
    },
  },
  logo: false,
  alias: {
    '@site': resolve(__dirname, '.'),
  },
});
