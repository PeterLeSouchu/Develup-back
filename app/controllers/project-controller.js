import ApiError from '../errors/error.js';
import projectDatamapper from '../datamappers/project-datamapper.js';
import technologieDatamapper from '../datamappers/technologie-datamapper.js';
import generateUniqueSlug from '../utils/generate-slug.js';

const projectController = {
  async searchProject(req, res) {
    const { technoNameSelected, inputRhythmValue } = req.body;

    if (technoNameSelected.length === 0) {
      const result = await projectDatamapper.searchProjectByRhythm(
        inputRhythmValue
      );
      return res.status(200).json({ message: 'Recherche réussie', result });
    }
    if (!inputRhythmValue) {
      const result = await projectDatamapper.searchProjectByTechno(
        technoNameSelected
      );
      return res.status(200).json({ message: 'Recherche réussie', result });
    }
    if (!inputRhythmValue && technoNameSelected.length === 0) {
      throw new ApiError('Veuillez sélectionner au moins 1 champ', 400);
    }

    const result = await projectDatamapper.searchProjectByTechnoAndRhythm(
      technoNameSelected,
      inputRhythmValue
    );
    res.status(200).json({ message: 'Recherche réussie', result });
  },
  async defaultProjects(req, res) {
    const result = await projectDatamapper.getDefaultProjects();
    res
      .status(200)
      .json({ message: 'Récupération de projet(s) réussie', result });
  },
  async personalProjects(req, res) {
    const userId = req.user.id;
    const result = await projectDatamapper.getPersonalProjects(userId);
    res.status(200).json({
      message: 'Récupération du/des projet(s) personnel(s) réussie',
      result,
    });
  },
  async detailsProject(req, res) {
    const projectSlug = req.params.slug;
    const result = await projectDatamapper.getDetailsProject(projectSlug);
    res
      .status(200)
      .json({ message: 'Récupération des données du projet réussie', result });
  },
  async deleteProject(req, res) {
    const projectId = req.params.id;
    const userId = req.user.id;

    const project = await projectDatamapper.findById(projectId);
    const isGoodUser = project.user_id === userId;

    if (!isGoodUser) {
      throw new ApiError(
        "Une erreur inattendue s'est produite, veuillez réessayer plus tard",
        403
      );
    }

    const projectDeleted = await projectDatamapper.deleteProject(projectId);

    res.status(200).json({
      message: 'Suppression de projet réussie',
      result: projectDeleted,
    });
  },
  async createProject(req, res) {
    const { title, rhythm, description } = req.body;
    const techno = JSON.parse(req.body.techno);
    const slug = await generateUniqueSlug(title, projectDatamapper);
    const userId = req.user.id;
    console.log(slug);

    const image =
      req.urlImage ||
      'https://res.cloudinary.com/deacf8wk3/image/upload/v1731715170/Tiny_programmers_on_big_laptop_writing_script_ffv69y.jpg';

    console.log('les const sont passées');

    const createdProject = await projectDatamapper.createProject(
      title,
      rhythm,
      description,
      image,
      slug,
      userId
    );
    console.log('voici le projet créé');
    console.log(createdProject);

    const projectId = createdProject.id;

    // make this after create project
    if (techno.length > 0) {
      for (const element of techno) {
        await technologieDatamapper.relateTechnoToProject(
          projectId,
          element.id
        );
      }
    }

    const project = await projectDatamapper.findById(projectId);

    res.status(200).json({ message: 'tout est ok', image, result: project });
  },
};

export default projectController;
