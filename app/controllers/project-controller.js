import ApiError from '../errors/error.js';
import projectDatamapper from '../datamappers/project-datamapper.js';

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
    console.log('voici le projet deleted');
    console.log(projectDeleted);
    res.status(200).json({
      message: 'Suppression de projet réussie',
      result: projectDeleted,
    });
  },
  async createProject(req, res) {
    const techno = JSON.parse(req.body.techno);
    res.status(200).json({ message: 'tout est ok' });
  },
};

export default projectController;
