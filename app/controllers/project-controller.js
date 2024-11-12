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
};

export default projectController;
