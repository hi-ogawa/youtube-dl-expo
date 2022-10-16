import { app } from "electron";
import { initialize } from "./initialize";

async function main() {
  await app.whenReady();
  await initialize();
}

main();
