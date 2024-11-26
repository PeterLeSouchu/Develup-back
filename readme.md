# Develup

## C'est quoi ?

**Develup** est une application web, conçue pour permettre aux developpeurs, et toute personne interresée par le métier de développeur, de collaborer sur des projets web.

L'application permet de poster des projets dans le but de trouver des personnes pour le réaliser à plusieurs, et, il permet aussi de facon réciproque d'en chercher. Un système de filtre par technologie (Java, React, Docker, Postgres .... ) et par rythme (1 à 2h/semaine, 2 à 3h/semaine ...) a été implenté, car chacun/chacune n'a pas le même temps a consacrer.

### Fonctionnalitées de l'application :

- Créer un compte utilisateur
- Se connecter
- Demander à réinitialiser son mot de passe (mot de passe oublié)
- Rechercher un projet selon ses technologies et son rythme
- Accéder au détails d'un projet
- Accéder à la page profil utilisateur
- Ajouter / Supprimer / modifier un projet
- Modifier son profil
- Modifier son mot de passe
- Supprimer son compte
- Communiquer en temps réel avec un utilisateur
- Changer de thème (clair / sombre)

## Pourquoi j'ai créé Develup ?

J'ai pour objectif de construire plusieurs projets qui ont du sens, destinés à enrichir mon portfolio et Develup est le premier que j'ai réalisé en totale autonomie.

## Comment fonctionne le back-end de l'application ?

Sur ce repo, vous trouverez toute la partie back réalisé en Node.js.

Pour cela j'ai mis en place un serveur stateless en Express avec une API Rest et une authentification via JWT.

Les routes utilisent des controllers qui utilisent eux même des datamappers avant de renvoyer une reponse JSON.

Pour la partie privée de mon application, donc les routes qui nécessitent une authentification, j'utilise un middleware JWT qui regarde si l'utilisateur est connecté en c'est à dire s'il possede un token, ensuite le middleware lit le token (est-il falsifié, est-il encore valable) et extrait l'id de l'utilisateur afin de le rendre accessible au reste de la requête. Pour les actions sensibles un token CSRF a été mis en place qui vérifie le token à la fois dans les headers de la requête mais aussi dans les cookies.

Concernant les champs, une vérification est faite à l'aide de JOI afin de respecter les standards de mon application mais aussi celle de ma base de données Postgres

La gestion d'erreur a été réalisée grâce à :

- Une classe personnalisée "ApiError" qui étend de la class "Error" par défaut et qui comprend un message d'erreur ainsi qu'un code status.
- Un middleware TryCatch qui englobe tous mes controllers afin de capturer l'erreur.
- Un middleware des gestion d'erreur qui réceptionne l'erreur du middleware TryCatch, regarde si l'erreur provient de ma class ApiError et si c'est le cas renvoie le message au front, sinon un message généraliste est envoyé, ce dans le but de ne pas afficher de message compromettant au client.

Pour la partie inscription, une authentification 2FA à été réalisée, avec l'envoie d'un code OTP par mail. Pour se faire j'ai utilisé redis et le jwt :

Lors de la validation du formulaire d'inscription, on stocke toutes ces infos dans redis, en faisant correspondre un id généré par uuid a ces infos. Cet identifiant uuid est stocké dans le jwt et envoyé au front. Suite à cela, une fois que le client valide le code OTP, on récupère l'id du jwt pour lire les données de Redis et enregistrer l'utilisateur (si le code OTP est bon). Cela permet de ne pas mettre de données sensibles dans le jwt.

Bien evidemment le mot de passe avant d'être inséré en base de données, et même avant d'être stocké dans Redis, est hashé grâce à Argon pour une meilleure sécurité.

Pour l'instant l'utilisation de Redis dans mon application se limite à cela, mais sera vouée à évoluer.

L'utilisateur lors de l'ajout / modification d'un projet ou de son profil peut ajouter une photo, et cette dernière est gérée avec Multer qui "traduit" les données au format "multipart/formdata", regarde si l'image correspond au bon type de fichier et ne dépasse pas une certaine taille, puis passe le relai à Cloudinary qui stocke l'image et génère une URL que l'on stocke en base de donnés.

Enfin une communication en temps réel est possible grâce au websoket (socket.io) afin de permettre au utilisateurs d"échanger en temps réel sur un projet. Chaque conversation relie un deux utilisateurs (l'auteur et celui interéssé) à un projet. Pour sécurisé cela, des qu'on arrive sur la page conversation on vient rendre au client toute les conversations qu'il possède grâçe à l'id de son jwt, et dès qu'il clique sur une conversation pour afficher les messages, on regarde si l'utilisateur en plus d'être connecté, est dans cette conversation, sinon on génère une erreur généraliste, cela garantie que seul ceux qui sont dans cette conversation ont accès aux messages de cette dernière.

Ce repos qui est en réalité un mono-repo contient toute la partie back en plus du front qui a été build, et servi statiquement dans le dossier public. Pour voir le code du repo front [cliquez-ici](https://github.com/PeterLeSouchu/Develup-front).

## Pour résumer :

Voici la liste des technologies utilisées sur la partie back de ce repo :

- Node.js (Express)
- [JOI](https://www.npmjs.com/package/joi) pour la validation des champs
- [Argon](https://www.npmjs.com/package/argon2) pour le hashage du mot de passe en base de données
- [Uuid](https://www.npmjs.com/package/uuid) pour générer un id solide en base de données et aussi pour la partie inscription avec Redis
- [Redis](https://www.npmjs.com/package/ioredis) pour l'inscription 2FA
- [Postgres](https://www.npmjs.com/package/pg) pour la base de données
- [Socket.io](https://www.npmjs.com/package/socket.io) pour la communication en temps réel
- [Json Web Token](https://www.npmjs.com/package/jsonwebtoken) pour l'authentification
- [Multer](https://www.npmjs.com/package/multer) pour lire et gérer les fichiers images
- [Cloudinary](https://www.npmjs.com/package/cloudinary) pour stocker l'image
- [CSRF-CSRF](https://www.npmjs.com/package/csrf-csrf), le package utilsé pour se prémunir des attaques CSRF
- [Nodemailer](https://www.npmjs.com/package/nodemailer) pour l'envoie de mail
- [OTP-generator](https://www.npmjs.com/package/otp-generator) pour générer un code OTP
- [Slugify](https://www.npmjs.com/package/slugify) pour générer un slug unique
