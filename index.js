#!/usr/bin/env node

const fs = require("fs");
const { glob } = require("glob");
const { join } = require("path");

const fontsFolder = join(process.cwd(), "fonts");
const fontFaceBaseUrl = "/fonts";

glob(join(fontsFolder, "/**/*"), { nodir: true }).then((matches) => {
  const fontFaces = matches.map(m => m.replace(fontsFolder, "")).map(match => {
    const fileFolder = match.slice(0, match.lastIndexOf("/"));
    if (fileFolder.startsWith("/_")) return "";

    let fileName = match.slice(match.lastIndexOf("/") + 1);
    const extension = fileName.slice(fileName.lastIndexOf("."));
    fileName = fileName.replace(extension, "");

    let [family, weight] = fileName.split("-");
    let italic = weight.endsWith("Italic");
    weight = weight.replace("Italic", "") || "Regular";

    switch (weight) {
      case "Thin":
        weight = 100;
        break;
      case "ExtraLight":
        weight = 200;
        break;
      case "Light":
        weight = 300;
        break;
      case "Regular":
        weight = 400;
        break;
      case "Medium":
        weight = 500;
        break;
      case "SemiBold":
        weight = 600;
        break;
      case "Bold":
        weight = 700;
        break;
      case "ExtraBold":
        weight = 800;
        break;
      case "Black":
        weight = 900;
        break;
    }

    const fontFace = `
      @font-face {
        font-family: "${family}";
        src: url("${fontFaceBaseUrl + fileFolder}/${fileName + extension}");
        font-weight: ${weight};
        font-style: ${italic ? "italic" : "normal"};
      }`;

    return fontFace;
  });

  if (fs.existsSync("./fonts.css")) fs.rmSync("./fonts.css");
  fs.writeFileSync("./fonts.css", fontFaces.join(""));
});