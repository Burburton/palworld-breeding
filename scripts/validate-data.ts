import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type {
  BreedingRule,
  Pal,
} from "../src/types/pal.ts";

export interface ValidationResult {
  pals: number;
  breedingRules: number;
  invalidParentIds: number;
  invalidChildIds: number;
  duplicateRules: number;
  errors: string[];
}

export function normalizePair(a: string, b: string): string {
  return [a, b].sort().join("::");
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidPal(value: unknown): value is Pal {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const pal = value as Record<string, unknown>;
  if (typeof pal.id !== "number" || !Number.isFinite(pal.id)) {
    return false;
  }
  if (!isNonEmptyString(pal.key)) {
    return false;
  }
  if (!isNonEmptyString(pal.number)) {
    return false;
  }
  if (!isNonEmptyString(pal.nameZh)) {
    return false;
  }
  if (!isNonEmptyString(pal.nameEn)) {
    return false;
  }
  return true;
}

function isValidBreedingRule(value: unknown): value is BreedingRule {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const rule = value as Record<string, unknown>;
  return (
    isNonEmptyString(rule.parent1) &&
    isNonEmptyString(rule.parent2) &&
    isNonEmptyString(rule.child)
  );
}

export function validateData(
  pals: unknown,
  breeding: unknown,
  metadata: unknown
): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(pals)) {
    errors.push("pals.json must be an array");
  }
  if (!Array.isArray(breeding)) {
    errors.push("breeding.json must be an array");
  }
  if (typeof metadata !== "object" || metadata === null) {
    errors.push("metadata.json must be an object");
  }

  if (errors.length > 0) {
    return {
      pals: 0,
      breedingRules: 0,
      invalidParentIds: 0,
      invalidChildIds: 0,
      duplicateRules: 0,
      errors,
    };
  }

  const palsArray = pals as unknown[];
  const breedingArray = breeding as unknown[];

  palsArray.forEach((pal, index) => {
    if (!isValidPal(pal)) {
      errors.push(`pals[${index}] has invalid shape`);
    }
  });

  breedingArray.forEach((rule, index) => {
    if (!isValidBreedingRule(rule)) {
      errors.push(`breeding[${index}] has invalid shape`);
    }
  });

  const validPals = palsArray.filter((p): p is Pal => isValidPal(p));
  const validRules = breedingArray.filter((r): r is BreedingRule =>
    isValidBreedingRule(r)
  );

  const keySet = new Set<string>();
  const idSet = new Set<number>();
  for (const pal of validPals) {
    if (keySet.has(pal.key)) {
      errors.push(`Duplicate pal key: ${pal.key}`);
    }
    keySet.add(pal.key);

    if (idSet.has(pal.id)) {
      errors.push(`Duplicate pal id: ${pal.id}`);
    }
    idSet.add(pal.id);
  }

  let invalidParentIds = 0;
  let invalidChildIds = 0;
  for (const rule of validRules) {
    if (!keySet.has(rule.parent1)) {
      invalidParentIds += 1;
      errors.push(`breeding rule references unknown parent1: ${rule.parent1}`);
    }
    if (!keySet.has(rule.parent2)) {
      invalidParentIds += 1;
      errors.push(`breeding rule references unknown parent2: ${rule.parent2}`);
    }
    if (!keySet.has(rule.child)) {
      invalidChildIds += 1;
      errors.push(`breeding rule references unknown child: ${rule.child}`);
    }
  }

  const seenPairs = new Set<string>();
  let duplicateRules = 0;
  for (const rule of validRules) {
    const pair = normalizePair(rule.parent1, rule.parent2);
    if (seenPairs.has(pair)) {
      duplicateRules += 1;
      errors.push(
        `Duplicate breeding pair (A+B == B+A): ${rule.parent1} + ${rule.parent2}`
      );
    } else {
      seenPairs.add(pair);
    }
  }

  void metadata;

  return {
    pals: validPals.length,
    breedingRules: validRules.length,
    invalidParentIds,
    invalidChildIds,
    duplicateRules,
    errors,
  };
}

export function loadJson<T>(relativePath: string): T {
  const absolute = resolve(process.cwd(), relativePath);
  const raw = readFileSync(absolute, "utf-8");
  return JSON.parse(raw) as T;
}