import projectDatamapper from '../datamappers/project-datamapper.js';
import ApiError from '../errors/error.js';

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
    const result = await projectDatamapper.returnDefaultProjects();
    res
      .status(200)
      .json({ message: 'Récupération de projet(s) réussie', result });
  },
};

export default projectController;
