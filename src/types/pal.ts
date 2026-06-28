export interface Pal {
  id: number;
  key: string;
  number: string;
  nameZh: string;
  nameEn: string;
  image?: string;
}

export interface BreedingRule {
  parent1: string;
  parent2: string;
  child: string;
}

export interface BreedingCombination {
  parent1: string;
  parent2: string;
}

export interface DataMetadata {
  gameVersion: string;
  dataVersion: string;
  lastUpdated: string;
  sourceDescription: string;
}

export interface DataSnapshot {
  pals: Pal[];
  breeding: BreedingRule[];
  metadata: DataMetadata;
}