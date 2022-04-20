import { publish } from 'gh-pages';

publish(
 'build', // path to public directory
 {
  branch: 'gh-pages',
  repo: 'https://github.com/FreddieRa/TitleCityScapes.git', // Update to point to your repository
  user: {
   name: 'FreddieRa', // update to use your name
   email: 'Freddie.rawlins@mail.com' // Update to use your email
  },
  dotfiles: true
  },
  () => {
   console.log('Deploy Complete!');
  }
);