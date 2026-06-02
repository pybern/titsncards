import type { CardColor } from "@/lib/types";

export interface CharacterSeed {
  name: string;
  color: CardColor;
  attribute: string; // Slash / Strike / Ranged / Special / Wisdom
  crew: string;
  initials: string; // for procedural art emblem
}

// A roster of iconic One Piece characters used to build mock card products.
export const characters: CharacterSeed[] = [
  { name: "Monkey D. Luffy", color: "Red", attribute: "Strike", crew: "Straw Hat Pirates", initials: "ML" },
  { name: "Roronoa Zoro", color: "Green", attribute: "Slash", crew: "Straw Hat Pirates", initials: "RZ" },
  { name: "Nami", color: "Blue", attribute: "Special", crew: "Straw Hat Pirates", initials: "NA" },
  { name: "Usopp", color: "Yellow", attribute: "Ranged", crew: "Straw Hat Pirates", initials: "US" },
  { name: "Sanji", color: "Blue", attribute: "Strike", crew: "Straw Hat Pirates", initials: "SA" },
  { name: "Tony Tony Chopper", color: "Green", attribute: "Strike", crew: "Straw Hat Pirates", initials: "TC" },
  { name: "Nico Robin", color: "Purple", attribute: "Wisdom", crew: "Straw Hat Pirates", initials: "NR" },
  { name: "Franky", color: "Blue", attribute: "Strike", crew: "Straw Hat Pirates", initials: "FR" },
  { name: "Brook", color: "Green", attribute: "Slash", crew: "Straw Hat Pirates", initials: "BR" },
  { name: "Jinbe", color: "Blue", attribute: "Strike", crew: "Straw Hat Pirates", initials: "JI" },
  { name: "Portgas D. Ace", color: "Red", attribute: "Special", crew: "Whitebeard Pirates", initials: "PA" },
  { name: "Sabo", color: "Red", attribute: "Special", crew: "Revolutionary Army", initials: "SB" },
  { name: "Shanks", color: "Red", attribute: "Slash", crew: "Red Hair Pirates", initials: "SH" },
  { name: "Dracule Mihawk", color: "Black", attribute: "Slash", crew: "Seven Warlords", initials: "DM" },
  { name: "Donquixote Doflamingo", color: "Green", attribute: "Special", crew: "Donquixote Pirates", initials: "DD" },
  { name: "Charlotte Katakuri", color: "Yellow", attribute: "Strike", crew: "Big Mom Pirates", initials: "CK" },
  { name: "Kaido", color: "Purple", attribute: "Strike", crew: "Beasts Pirates", initials: "KA" },
  { name: "Charlotte Linlin", color: "Yellow", attribute: "Special", crew: "Big Mom Pirates", initials: "CL" },
  { name: "Trafalgar Law", color: "Green", attribute: "Slash", crew: "Heart Pirates", initials: "TL" },
  { name: "Eustass Kid", color: "Green", attribute: "Special", crew: "Kid Pirates", initials: "EK" },
  { name: "Yamato", color: "Yellow", attribute: "Strike", crew: "Straw Hat Allies", initials: "YA" },
  { name: "Gol D. Roger", color: "Black", attribute: "Slash", crew: "Roger Pirates", initials: "GR" },
  { name: "Silvers Rayleigh", color: "Blue", attribute: "Slash", crew: "Roger Pirates", initials: "SR" },
  { name: "Kuzan", color: "Black", attribute: "Special", crew: "Marines", initials: "KZ" },
  { name: "Marshall D. Teach", color: "Black", attribute: "Special", crew: "Blackbeard Pirates", initials: "MT" },
  { name: "Jewelry Bonney", color: "Green", attribute: "Special", crew: "Bonney Pirates", initials: "JB" },
  { name: "Enel", color: "Yellow", attribute: "Special", crew: "Sky Island", initials: "EN" },
  { name: "Boa Hancock", color: "Purple", attribute: "Special", crew: "Kuja Pirates", initials: "BH" },
  { name: "Crocodile", color: "Purple", attribute: "Special", crew: "Seven Warlords", initials: "CR" },
  { name: "Edward Newgate", color: "Red", attribute: "Strike", crew: "Whitebeard Pirates", initials: "EN" },
];

export function findCharacter(name: string): CharacterSeed | undefined {
  return characters.find((c) => c.name === name);
}
