import projectDatamapper from '../../datamappers/project-datamapper.js';
import ApiError from '../../errors/error.js';

const projectController = {
  async searchProject(req, res) {
    const { technoNameSelected, rhythm } = req.body;

    if (technoNameSelected.length === 0) {
      const result = await projectDatamapper.searchProjectByRhythm(rhythm);
      return res.status(200).json({ message: 'Recherche réussie', result });
    }
    if (!rhythm) {
      const result = await projectDatamapper.searchProjectByTechno(
        technoNameSelected
      );
      return res.status(200).json({ message: 'Recherche réussie', result });
    }

    const result = await projectDatamapper.searchProjectByTechnoAndRhythm(
      technoNameSelected,
      rhythm
    );
    console.log(result);
    res.status(200).json({ message: 'Recherche réussie', result });
  },
  async defaultProject(req, res) {
    const result = await projectDatamapper.returnDefaultProjects();
    res
      .status(200)
      .json({ message: 'Récupération de projet(s) réussie', result });
  },
};

export default projectController;
