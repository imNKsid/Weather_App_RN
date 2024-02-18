import React from "react";
import AppNavigation from "./src/navigation/app-navigator";
import { NativeWindStyleSheet } from "nativewind";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const App = () => {
  return <AppNavigation />;
};

export default App;
