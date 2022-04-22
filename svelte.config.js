import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://github.com/sveltejs/svelte-preprocess
  // for more information about preprocessors
//   preprocess: preprocess(),

  kit: {
    adapter: adapter({split: false}),

    // hydrate the <div id="svelte"> element in src/app.html
    vite: {
      optimizeDeps: {
        exclude: ['three']
      },
      ssr: {
        noExternal: ['three', 'chart.js', 'd3', 'c3']
      }
    }
  },
};

export default config;