import technologieDatamapper from '../datamappers/technologie-datamapper.js';

const technologieController = {
  async defaultTechnologies(req, res) {
    const result = await technologieDatamapper.getDefaultTechnologie();
    res
      .status(200)
      .json({ message: 'Récupération des technologies réussie', result });
  },
};

export default technologieController;
