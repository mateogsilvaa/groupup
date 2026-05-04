import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pngToIco from 'png-to-ico';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// SVG content
const svgContent = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'>
  <rect width='32' height='32' rx='8' fill='#01696f'/>
  <path d='M8 12h16M8 16h12M8 20h10' stroke='white' stroke-width='2.5' stroke-linecap='round'/>
</svg>`;

// Function to convert SVG to PNG
async function convertToPNG(size, filename) {
  try {
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .png()
      .toFile(filename);
    console.log(`✅ Created ${filename} (${size}x${size})`);
  } catch (error) {
    console.error(`❌ Error creating ${filename}:`, error);
  }
}

// Function to convert SVG to JPG
async function convertToJPG(size, filename) {
  try {
    await sharp(Buffer.from(svgContent))
      .resize(size, size)
      .jpeg({ quality: 90 })
      .toFile(filename);
    console.log(`✅ Created ${filename} (${size}x${size})`);
  } catch (error) {
    console.error(`❌ Error creating ${filename}:`, error);
  }
}

// Function to convert SVG to ICO
async function convertToICO(filename) {
  try {
    // Create multiple sizes for ICO
    const sizes = [16, 32, 48, 64, 128, 256];
    const pngFiles = [];
    
    // Create PNG files for each size
    for (const size of sizes) {
      const pngBuffer = await sharp(Buffer.from(svgContent))
        .resize(size, size)
        .png()
        .toBuffer();
      pngFiles.push(pngBuffer);
    }
    
    // Convert PNG buffers to ICO
    const icoBuffer = await pngToIco(pngFiles);
    fs.writeFileSync(filename, icoBuffer);
    console.log(`✅ Created ${filename}`);
  } catch (error) {
    console.error(`❌ Error creating ${filename}:`, error);
  }
}

// Generate all formats
async function generateIcons() {
  console.log('🎨 Generating icon files...');
  
  // PNG files (common sizes)
  await convertToPNG(16, 'icon-16.png');
  await convertToPNG(32, 'icon-32.png');
  await convertToPNG(64, 'icon-64.png');
  await convertToPNG(128, 'icon-128.png');
  await convertToPNG(256, 'icon-256.png');
  await convertToPNG(512, 'icon-512.png');
  
  // JPG files
  await convertToJPG(32, 'icon-32.jpg');
  await convertToJPG(64, 'icon-64.jpg');
  await convertToJPG(128, 'icon-128.jpg');
  await convertToJPG(256, 'icon-256.jpg');
  
  // ICO file
  await convertToICO('icon.ico');
  
  console.log('🎉 All icon files generated successfully!');
}

generateIcons().catch(console.error);
