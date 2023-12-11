const { createCanvas, loadImage } = require("canvas");

const fs = require("fs");

exports.processImage = (data, width, height) => {
  return new Promise(async (resolve, reject) => {
    try {
      const canvas = createCanvas(width, height);
      const image = await loadImage(`public/assets/pass.png`);
      const ctx = canvas.getContext("2d");
      // const image = await loadImage(`uploads/resized/${file}`);

      ctx.drawImage(image, 0, 0, width, height);

      ctx.font = "semibold 56px AnekGujarati";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#CF2B39";
      ctx.fillText(data.name, 600, 1246);

      ctx.font = "bold 56px AnekGujarati";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#BD1221";
      ctx.fillText(data.passes, 620, 1370);

      ctx.font = "36px AnekGujarati";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "#f5f5f5";
      ctx.fillText(`${data.serial}`, 600, 1656);

      const buffer = canvas.toBuffer("image/png");
      resolve(buffer);
    } catch (error) {
      console.log("ERROR : ", error);
      reject(error);
    }
  });
};
