// src/utils/stringUtils.ts

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()                           // Convierte a minúsculas ("Toy story" -> "toy story")
    .normalize('NFD')                        // Separa letras de acentos
    .replace(/[\u0300-\u036f]/g, '')         // Elimina acentos ("película" -> "pelicula")
    .replace(/[^a-z0-0\s]/g, '')             // Elimina caracteres especiales o signos
    .replace(/\s+/g, ' ')                    // Reemplaza múltiples espacios por uno solo
    .trim();                                 // Elimina espacios extras al inicio/final
}