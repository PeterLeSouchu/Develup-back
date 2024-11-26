# 🌟 Projet Develup

**Develup est une application web réalisée dans le cadre de mon portfolio, qui permet de faire collaborer des développeurs sur des projets web. Les utilisateur pourront poster des projets, rechercher des projets selon des technologies et un rythme de travail, et communiquer en temps réel.**

**Ce repo contient le code back-end de Develup et est dédié à la partie technique de ses fonctionnalités, si vous souhaitez voir la partie technique front-end [cliquez-ici](https://github.com/PeterLeSouchu/Develup-front)**

**Si vous souhaitez en savoir plus sur le projet, connaitre les fonctionnalités générales, voir à quoi il ressemble ou bien le tester [cliquez-ici](https://github.com/PeterLeSouchu/Develup-front)**

## 🛠️ Fonctionnement du back-end :

### ⚙️ 1. Architecture

- Mise en place d'un serveur stateless Node.js en Express avec une API REST CRUD.
- Les routes API utilisent des middlewares pour effectuer les vérifications, puis s'appuient sur des controllers qui gèrent la logique métier, interagissent avec des data mappers pour accéder à la base de données et renvoient une réponse au format JSON.

### 🔒 2. Sécurité

- Utilisation d'un Json Web Token dans les cookie pour géeer la session utilisateur.
- Mise en place d'un middleware JWT qui vérifie la présence de ce dernier,sa validité et sa date d'expiration avant de le lire et d'extraire l'id de l'utilisateur afin de le rendre accessible au reste de la requete.
- Utilisation d'un CSRF token en complément du JWT pour les actions les plus sensibles.
- Mise en place d'un middleware CSRF avec une double vérification du token, à la fois dans les headers de la requête et dans les cookies.
- Requêtes SQL préparées pour se prémunir des injections SQL.
- Schéma de validation de formulaire avec JOI.
- Hashage du mot de passe avec Argon2.
- Utilisation de uuid pour générer des id complexes.
- Paramètres CORS stricte.
- Inscription par 2FA avec envoi d'un code OTP par mail.
- Vérification intra-controller de l'utilisateur pour certaines actions sensibles ( _Par exmple quand un utilisateur supprime un projet on va utiliser l'id retoruné par le JWT pour voir si l'utilisateur qui souhaite supprimer le projet en est l'auteur_ ).

### ❌ 3. Gestion d'erreurs

- Utilisation d'une classe personnalisée "ApiError" qui étend de la class "Error" par défaut et qui comprend un message d'erreur ainsi qu'un code status.
- Mise en place d'un middleware TryCatch qui englobe tous mes controllers afin de capturer l'erreur.
- Mise en place d'un middleware de gestion d'erreurs qui réceptionne l'erreur du middleware TryCatch ou des autres middleware, regarde si l'erreur provient de ma class ApiError et si c'est le cas renvoie le message au front, sinon un message généraliste est envoyé, ce dans le but de ne pas afficher de message compromettant au client.

### 🖼️ 4. Gestion d'images

- Utilisation de multer pour lire les données au format multipart/form-data et vérifie la validité de l'image selon une taille maximale et certains types de fichier
- Utilisation de cloudinary pour stocker l'image et générer une URL qui sera stocké dans ma base de données

### 💬 5. Web Socket

- Utilisation de Socket.io pour mettre en place un tchat en temp réel.
- Chaque conversation relie deux utilisateurs (l'auteur et celui interéssé) à un projet.
- Pour sécurisé cela, des qu'on arrive sur la page conversation on vient rendre au client toute les conversations qu'il possède grâçe à l'id de son jwt, et dès qu'il clique sur une conversation pour afficher les messages, on regarde si l'utilisateur en plus d'être connecté, est dans cette conversation, sinon on génère une erreur généraliste, cela garantie que seul ceux qui sont dans cette conversation ont accès aux messages de cette dernière.

### 🗄️ 6. Bases de données

- Utilisation d'une base de données relationnelle Postgres sous cette forme
- Script de seeding pour stocker le nom et l'image associé à une technologie / langage
- Utilisation d'une base de données en mémoire Redis pour l'inscription par 2FA ( _Lors de la validation du formulaire d'inscription, on stocke temporairement toutes ces infos dans Redis, en faisant correspondre un id généré par uuid à ces infos. Cet identifiant uuid est stocké dans le jwt et envoyé au front. Suite à cela, une fois que le client valide le code OTP, on récupère l'id du jwt pour lire les données de Redis et enregistrer l'utilisateur._ )

### ⚙️ 7. Technologies utilisées

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

### ⬇️ 8. Points à ajouter ou améliorer :

- Utilisation plus prononcé de redis pour soulager la base de données et avoir une meilleure fluidité
- Mettre en place une pagination sur la page d'accueil
- Se prémunir des attaques par force brute avec un captcha pour la connnexion
- Migrer en TypeScript
