
import { Decimal } from 'decimal.js';
import { EmbryoItemRarity } from './Embryo'; // Assuming EmbryoItemRarity is here

export interface CraftingIngredient {
  itemId: string; // ID of the EmbryoItem required
  quantity: number;
}

export type CraftingCategory = 'Equipamento' | 'Consumível' | 'Artefato'; // Consumable/Artifact for future expansion

// CraftingRecipe interface removed as it's obsolete.
