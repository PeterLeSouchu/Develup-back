import ApiError from '../errors/error.js';
import projectDatamapper from '../datamappers/project-datamapper.js';
import technologieDatamapper from '../datamappers/technologie-datamapper.js';
import generateUniqueSlug from '../utils/generate-slug.js';
import cloudinary from '../upload/cloudinary-config.js';
import conversationDatamapper from '../datamappers/conversation-datamapper.js';

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
  async detailsProjectBySlug(req, res) {
    const projectSlug = req.params.slug;
    const resultDatamapper = await projectDatamapper.getDetailsProjectBySlug(
      projectSlug
    );

    const userId = req.user.id;
    const userIdProject = resultDatamapper.user_id;
    const projectId = resultDatamapper.id;

    // Here we send infos to front in order to know if it's the user who create the project, and in fornt if this condition is true we write 'realised by you' instead our pseudo
    const ownProject = userId === userIdProject;

    // in the detail project page, we send an info to checkgit add . if conversation is already open, and here we return the id conversation in order to redirect in fornt when user click on contact user
    const isAlreadyConversation =
      await conversationDatamapper.checkConversationExist(projectId, userId);

    let conversationId = null;
    if (isAlreadyConversation) {
      conversationId = isAlreadyConversation.id;
    }

    const result = {
      ...resultDatamapper,
      ownProject,
      isAlreadyConversation: conversationId,
    };

    res
      .status(200)
      .json({ message: 'Récupération des données du projet réussie', result });
  },
  async detailsProjectById(req, res) {
    const projectId = req.params.id;
    const result = await projectDatamapper.getDetailsProjectById(projectId);
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

    const imageId = projectDeleted.image_id;

    if (imageId) {
      await cloudinary.uploader.destroy(imageId);
    }

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
    // Image and imageId can be undefined but it's not a problem
    const image = req.urlImage;
    const imageId = req.imageId;
    const createdProject = await projectDatamapper.createProject(
      title,
      rhythm,
      description,
      image,
      imageId,
      slug,
      userId
    );

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
  async editProject(req, res) {
    const projectSlug = req.params.slug;

    const { title, rhythm, description } = req.body;
    const technos = req.body.techno ? JSON.parse(req.body.techno) : undefined;
    const image = req.urlImage;
    const imageId = req.imageId;
    const isImageDeleted = req.deletedImage;

    const oldProject = await projectDatamapper.findBySlug(projectSlug);
    const projectId = oldProject.id;
    const userId = req.user.id;

    const isGoodUser = oldProject.user_id === userId;

    if (!isGoodUser) {
      throw new ApiError(
        "Une erreur inattendue s'est produite, veuillez réessayer plus tard",
        403
      );
    }

    if (title) {
      const newProjectSlug = await generateUniqueSlug(title, projectDatamapper);

      await projectDatamapper.editTitleProject(
        title,
        newProjectSlug,
        projectId
      );
    }

    if (rhythm) {
      await projectDatamapper.editRhythmProject(rhythm, projectId);
    }

    if (description) {
      await projectDatamapper.editDescriptionProject(description, projectId);
    }

    if (image && imageId) {
      // here we insert new image and imageId in our DB and we delete  older image in cloudinary

      await projectDatamapper.editImageProject(image, imageId, projectId);

      if (oldProject.image_id) {
        await cloudinary.uploader.destroy(oldProject.image_id);
      }
    }

    if (isImageDeleted) {
      await projectDatamapper.editImageProject(undefined, undefined, projectId);
      if (oldProject.image_id) {
        await cloudinary.uploader.destroy(oldProject.image_id);
      }
    }

    if (technos) {
      const oldTechno = await technologieDatamapper.getAllTechnoFromProject(
        projectId
      );

      const newTechnoId = technos.map((tech) => tech.id);
      const oldTechnoId = oldTechno.map((tech) => tech.id);

      const technoToAdd = technos.filter(
        (newTech) => !oldTechnoId.includes(newTech.id)
      );
      const technoToRemove = oldTechno.filter(
        (tech) => !newTechnoId.includes(tech.id)
      );

      for (const techno of technoToAdd) {
        await technologieDatamapper.relateTechnoToProject(projectId, techno.id);
      }
      for (const techno of technoToRemove) {
        await technologieDatamapper.deleteTechnoToProject(projectId, techno.id);
      }
    }

    const editedProject = await projectDatamapper.findById(oldProject.id);
    return res.status(200).json({ message: 'all ok', result: editedProject });
  },
};

export default projectController;
