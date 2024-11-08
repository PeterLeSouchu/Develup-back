import technologieDatamapper from '../../datamappers/technologie-datamapper.js';

const technologieController = {
  async defaultTechnologie(req, res) {
    const result = await technologieDatamapper.returnDefaultTechnologie();
    res
      .status(200)
      .json({ message: 'Récupération des technologies réussie', result });
  },
};

export default technologieController;
