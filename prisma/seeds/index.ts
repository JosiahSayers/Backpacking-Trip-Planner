import applyDevSeeds from "./dev";
import applyProductionSeeds from "./production";

await applyProductionSeeds();

if (Bun.env.NODE_ENV !== "production") {
  await applyDevSeeds();
}

process.exit(0);
