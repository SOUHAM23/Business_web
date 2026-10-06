const sharp = require('sharp');
const path = require('path');

async function cropImages() {
  const rootDir = 'd:/projects/Business_web';
  const publicDir = 'd:/projects/Business_web/business-public-website/public';

  // Process profile_image1.png
  const img1Path = path.join(rootDir, 'profile_image1.png');
  const meta1 = await sharp(img1Path).metadata();
  console.log('img1 metadata:', meta1.width, meta1.height);
  
  // Crop top 55% of profile_image1 (head to waist belt)
  await sharp(img1Path)
    .extract({
      left: 0,
      top: 0,
      width: meta1.width,
      height: Math.floor(meta1.height * 0.55)
    })
    .toFile(path.join(publicDir, 'profile_image1.png'));
  console.log('Processed profile_image1.png at 55% waist height');

  // Process profile_image2.png
  const img2Path = path.join(rootDir, 'profile_image2.png');
  const meta2 = await sharp(img2Path).metadata();
  console.log('img2 metadata:', meta2.width, meta2.height);

  // Crop top 55% of profile_image2 (head to waist belt)
  await sharp(img2Path)
    .extract({
      left: 0,
      top: 0,
      width: meta2.width,
      height: Math.floor(meta2.height * 0.55)
    })
    .toFile(path.join(publicDir, 'profile_image2.png'));
  console.log('Processed profile_image2.png at 55% waist height');
}

cropImages().catch(console.error);
