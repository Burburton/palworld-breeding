import {
  loadJson,
  validateData,
  type ValidationResult,
} from "./validate-data.ts";

function format(result: ValidationResult): string {
  return [
    `Pals: ${result.pals}`,
    `Breeding rules: ${result.breedingRules}`,
    `Invalid parent IDs: ${result.invalidParentIds}`,
    `Invalid child IDs: ${result.invalidChildIds}`,
    `Duplicate rules: ${result.duplicateRules}`,
  ].join("\n");
}

async function main(): Promise<void> {
  const pals = loadJson<unknown>("public/data/pals.json");
  const breeding = loadJson<unknown>("public/data/breeding.json");
  const metadata = loadJson<unknown>("public/data/metadata.json");

  const result = validateData(pals, breeding, metadata);
  console.log(format(result));

  if (result.errors.length > 0) {
    console.error("\nValidation failed:");
    for (const error of result.errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log("Validation passed");
}

main();