import client from '../pg.client.js';

const technos = [
  {
    name: 'HTML',
    image:
      'https://i.postimg.cc/W1M4FJ5d/317755-badge-html-html5-achievement-award-icon.png',
  },
  {
    name: 'CSS',
    image:
      'https://i.postimg.cc/FzsPccbN/317756-badge-css-css3-achievement-award-icon.png',
  },
  {
    name: 'SASS',
    image: 'https://i.postimg.cc/gjZsbWWL/4375066-logo-sass-icon.png',
  },
  {
    name: 'Javascript',
    image: 'https://i.postimg.cc/G3g0Kh4q/4373213-js-logo-logos-icon.png',
  },
  {
    name: 'React',
    image: 'https://i.postimg.cc/JhydY1ZW/7423888-react-react-native-icon.png',
  },
  {
    name: 'NodeJS',
    image: 'https://i.postimg.cc/R0KfP8s0/4375017-js-logo-node-icon.png',
  },
  {
    name: 'NextJS',
    image: 'https://i.postimg.cc/P50kLgy2/9118036-nextjs-fill-icon.png',
  },
  {
    name: 'Redux',
    image: 'https://i.postimg.cc/T1st76ps/4691205-redux-icon.png',
  },
  { name: 'PostgreSQL', image: 'https://i.postimg.cc/xdVvgPPn/postgre.png' },
];

const newTechnos = [
  {
    name: 'PHP',
    image:
      'https://i.postimg.cc/0yng58z6/1012812-code-development-logo-php-icon.png',
  },
];

async function seedingTechno() {
  try {
    for (const techno of newTechnos) {
      await client.query('INSERT INTO techno (name, image) VALUES ($1, $2)', [
        techno.name,
        techno.image,
      ]);
      console.log(`techno ${techno.name} inserted`);
    }
  } catch (error) {
    console.log(error);
  } finally {
    await client.end();
  }
}

seedingTechno();
