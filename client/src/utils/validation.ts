export const validateEmail = (email: string): string => {
  if (!email) return "Adresse email requise.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Format d'adresse email invalide.";
  return "";
};

export const validateUsername = (username: string): string => {
  if (!username) return "Nom d'utilisateur requis.";
  if (username.length < 4)
    return "Votre nom doit contenir au moins 4 caractères.";
  if (username.length > 20)
    return "Votre nom ne dois pas dépasser 20 caractères.";
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) return "Mot de passe requis.";
  if (password.length < 7)
    return "Le mot de passe doit contenir au moins 7 caractères.";
  if (!/\d/.test(password))
    return "Le mot de passe doit contenir au moins 1 chiffre.";
  if (!/[!@#$%^&*]/.test(password))
    return "Le mot de passe doit contenir au moins 1 caractère spécial.";
  if (!/[a-zA-Z]/.test(password))
    return "Le mot de passe doit contenir au moins 1 lettre.";
  return "";
};
