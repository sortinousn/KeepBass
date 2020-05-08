import React from "react";
import { Image } from "react-native-elements";

const AppLogo = () => (
  <Image
    source={require("../assets/basslogo.png")}
    style={{ width: 135, height: 130 }}
  />
);

export default AppLogo;
