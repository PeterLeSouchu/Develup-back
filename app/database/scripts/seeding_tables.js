import client from '../pg.client.js';

// Personnal data
// const technos = [
//   {
//     name: 'HTML',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732964860/317755_badge_html_html5_achievement_award_icon_wluxac.png',
//   },
//   {
//     name: 'CSS',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965194/317756_badge_css_css3_achievement_award_icon_ye5vjt.png',
//   },
//   {
//     name: 'SASS',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965229/4375066_logo_sass_icon_nrcrbb.png',
//   },
//   {
//     name: 'Javascript',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965252/652581_code_command_develop_javascript_language_icon_lr5uxm.png',
//   },
//   {
//     name: 'React',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965274/7423888_react_react_native_icon_i90j3w.png',
//   },
//   {
//     name: 'NodeJS',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965332/4375017_js_logo_node_icon_nojuvp.png',
//   },
//   {
//     name: 'NextJS',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965354/9118036_nextjs_fill_icon_svrclp.png',
//   },
//   {
//     name: 'Express',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732967751/expressjs_logo_icon_169185_ksjet5.png',
//   },
//   {
//     name: 'NestJS',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732967917/nestjs_dnyb2m.svg',
//   },
//   {
//     name: 'Redux',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965397/4691205_redux_icon_oiokbi.png',
//   },
//   {
//     name: 'PostgreSQL',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732967261/postgresql_q6gtyq.svg',
//   },
//   {
//     name: 'MySQL',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732967233/mysql-logo-pure_xgtzhm.svg',
//   },
//   {
//     name: 'MariaDB',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732967146/226022_ai8eiw.webp',
//   },
//   {
//     name: 'MongoDB',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732966608/mongodb-icon-1_kzht32.svg',
//   },
//   {
//     name: 'PHP',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965419/1012812_code_development_logo_php_icon_kz3qgt.png',
//   },
//   {
//     name: 'Rust',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732967073/8666426_rust_icon_fttvsc.png',
//   },
//   {
//     name: 'Java',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965458/4373217_java_logo_logos_icon_feympu.png',
//   },
//   {
//     name: 'Swift',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965512/4202060_swift_logo_social_social_media_icon_bfojxe.png',
//   },
//   {
//     name: 'Python',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965580/4375050_logo_python_icon_1_jxkge0.png',
//   },
//   {
//     name: 'Docker',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965616/2993785_docker_social_media_icon_zh6gqn.png',
//   },
//   {
//     name: 'Vue',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965649/9035136_logo_vue_icon_t2ym0k.png',
//   },
//   {
//     name: 'Angular',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965675/4373284_angular_logo_logos_icon_f8kri3.png',
//   },
//   {
//     name: 'Ruby',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965861/icons8-langage-de-programmation-ruby-480_sxcds5.png',
//   },
//   {
//     name: 'Ruby',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732965861/icons8-langage-de-programmation-ruby-480_sxcds5.png',
//   },
//   {
//     name: 'C++',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732966076/C_-Logo.wine_pkpfci.svg',
//   },
//   {
//     name: 'C#',
//     image:
//       'https://res.cloudinary.com/deacf8wk3/image/upload/v1732966139/c-sharp-c_wexsbg.svg',
//   },
// ];

// Fonction pour traiter les données de l'API

// Data from api
async function fetchAndTransformData() {
  try {
    const response = await fetch('https://api.svgl.app/');
    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération des données : ${response.status}`
      );
    }

    const data = await response.json();

    const transformedData = data.map((item) => {
      let image;

      if (typeof item.route === 'object' && item.route !== null) {
        const firstKey = Object.keys(item.route)[0];
        image = item.route[firstKey];
      } else {
        image = item.route;
      }

      return {
        name: item.title,
        image: image,
      };
    });

    console.log('Données transformées :', transformedData);
    return transformedData;
  } catch (error) {
    console.error('Erreur :', error);
  }
}

const technos = await fetchAndTransformData();

async function seedingTechno() {
  try {
    for (const techno of technos) {
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
