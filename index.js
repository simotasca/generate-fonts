#!/usr/bin/env node

const fs = require("fs");
const { glob } = require("glob");
const { join } = require("path");

const fontsFolder = process.argv[2] || ".";
const outputFolder = process.argv[3] || ".";
const fontFaceBaseUrl = process.argv[4] || "/fonts";

glob(join(fontsFolder, "/**/*.{ttf,otf}"), { nodir: true }).then((matches) => {
  const fontFaces = matches.map(m => m.replace(fontsFolder, "")).map(match => {
    let fileFolder = match.slice(0, match.lastIndexOf("/"));
    fileFolder = fileFolder.slice(fileFolder.lastIndexOf("/") + 1);
    if (fileFolder.startsWith("/_")) return "";

    let fileName = match.slice(match.lastIndexOf("/") + 1);
    const extension = fileName.slice(fileName.lastIndexOf("."));
    fileName = fileName.replace(extension, "");

    let [family, stringWeight] = fileName.split("-");
    let italic = stringWeight.endsWith("Italic");
    stringWeight = stringWeight.replace("Italic", "") || "Regular";
    let weight = 400;

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
  src: url("${join(fontFaceBaseUrl, fileFolder, fileName + extension)}");
  font-weight: ${weight};
  font-style: ${italic ? "italic" : "normal"};
}`;

    console.log(`GENERATED: ${family} ${stringWeight} ${italic ? "Italic" : ""}`);


    return fontFace;
  });


  if (!fs.existsSync(outputFolder)) fs.mkdirSync(outputFolder, { recursive: true });

  let outputFile = join(outputFolder, "fonts.css");
  if (fs.existsSync(outputFile)) fs.rmSync(outputFile);
  fs.writeFileSync(outputFile, fontFaces.join(""));
});