import registerRootComponent from "expo/build/launch/registerRootComponent";
import { App } from "./app";

function main() {
  registerRootComponent(App);
}

main();
