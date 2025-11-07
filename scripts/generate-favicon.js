import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { writeFileSync, existsSync, copyFileSync, mkdirSync } from 'fs';
import { createCanvas, loadImage } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateFavicon() {
  try {
    // Load the source image
    const image = await loadImage(join(__dirname, '../public/key-logo.png'));
    
    // Create a canvas for the favicon (16x16 is the standard favicon size)
    const size = 64; // Using larger size for better quality
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Draw the image on the canvas (scaled to fit)
    ctx.drawImage(image, 0, 0, size, size);
    
    // Ensure public directory exists
    const publicDir = join(__dirname, '../public');
    if (!existsSync(publicDir)) {
      mkdirSync(publicDir, { recursive: true });
    }
    
    // Convert canvas to ICO format (using a simple PNG as ICO)
    const icoPath = join(publicDir, 'favicon.ico');
    const buffer = canvas.toBuffer('image/png');
    
    // Write the favicon file
    writeFileSync(icoPath, buffer);
    console.log(`✅ Favicon created at: ${icoPath}`);
    
    // Copy to dist folder if it exists
    const distPath = join(__dirname, '../dist');
    if (existsSync(distPath)) {
      const distIcoPath = join(distPath, 'favicon.ico');
      copyFileSync(icoPath, distIcoPath);
      console.log(`✅ Favicon copied to: ${distIcoPath}`);
    }
    
    console.log('\n🎉 Favicon generation complete!');
  } catch (error) {
    console.error('❌ Error generating favicon:', error);
    process.exit(1);
  }
}

generateFavicon();
