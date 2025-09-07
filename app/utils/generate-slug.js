import slugify from 'slugify';

// Fonction pour générer un slug unique
async function generateUniqueSlug(name, datamapper) {
  // Crée un slug de base à partir du nom du projet
  let baseSlug = slugify(name, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;

  // Boucle pour vérifier si le slug existe déjà
  while (await datamapper.findBySlug(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

export default generateUniqueSlug;
