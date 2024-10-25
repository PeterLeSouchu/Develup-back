import argon2 from 'argon2';

export async function hashPassword(password) {
  try {
    const hash = await argon2.hash(password);
    return hash;
  } catch (err) {
    console.error('Erreur lors du hachage du mot de passe :', err);
  }
}

export async function verifyPassword(password, hash) {
  try {
    const isMatch = await argon2.verify(hash, password);
    return isMatch;
  } catch (err) {
    console.error('Erreur lors de la vérification du mot de passe :', err);
  }
}
