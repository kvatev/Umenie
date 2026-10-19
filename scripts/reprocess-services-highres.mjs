import fs from "fs";
import path from "path";
import sharp from "sharp";

const YMENIE_ROOT = path.resolve("Ymenie/Услуги");
const PUBLIC_SERVICES = path.resolve("public/images/services");

// Natural alphanumeric sorter so IMG_6939, IMG_6943, etc. sort properly
const naturalSort = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

async function convertImage(srcPath, destPath, options = {}) {
  const { width = 1600, height = 1600, quality = 87 } = options;
  if (!fs.existsSync(srcPath)) {
    console.warn(`[WARN] Source missing: ${srcPath}`);
    return false;
  }
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  try {
    const info = await sharp(srcPath)
      .rotate() // respect EXIF rotation
      .resize({
        width,
        height,
        fit: "inside",
        withoutEnlargement: true,
        kernel: sharp.kernel.lanczos3,
      })
      .webp({ quality })
      .toFile(destPath);

    console.log(`[OK] ${path.relative(process.cwd(), destPath)} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`);
    return true;
  } catch (err) {
    console.error(`[ERR] Failed converting ${srcPath}:`, err.message);
    return false;
  }
}

async function run() {
  console.log("=== Starting High-Fidelity Service & Slider Image Re-Conversion ===");

  // 1. Уроци и Курсове
  console.log("\n--- 1. Уроци и Курсове ---");
  await convertImage(
    path.join(YMENIE_ROOT, "Уроци и Курсове/Снимки за страницата/САЙТ Снимки.png"),
    path.join(PUBLIC_SERVICES, "urotsi-i-kursove/page/page-1.webp")
  );
  await convertImage(
    path.join(YMENIE_ROOT, "Уроци и Курсове/Снимки за страницата/САЙТ Снимки (1).png"),
    path.join(PUBLIC_SERVICES, "urotsi-i-kursove/page/page-2.webp")
  );

  // 2. Учебна занималня
  console.log("\n--- 2. Учебна занималня ---");
  await convertImage(
    path.join(YMENIE_ROOT, "Учебна занималня/Снимки за страницата/САЙТ Снимки (2).png"),
    path.join(PUBLIC_SERVICES, "uchebna-zanimalnya/page/page-1.webp")
  );
  await convertImage(
    path.join(YMENIE_ROOT, "Учебна занималня/Снимки за страницата/САЙТ Снимки (3).png"),
    path.join(PUBLIC_SERVICES, "uchebna-zanimalnya/page/page-2.webp")
  );

  // 3. Шах
  console.log("\n--- 3. Шах ---");
  await convertImage(
    path.join(YMENIE_ROOT, "ШАХ/Снимки за страницата/Шах 1.png"),
    path.join(PUBLIC_SERVICES, "shah/page/page-1.webp")
  );
  await convertImage(
    path.join(YMENIE_ROOT, "ШАХ/Снимки за страницата/Шах 2.png"),
    path.join(PUBLIC_SERVICES, "shah/page/page-2.webp")
  );
  const shahSliderFiles = fs
    .readdirSync(path.join(YMENIE_ROOT, "ШАХ/Снимки за слайдер"))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort(naturalSort);
  for (let i = 0; i < shahSliderFiles.length; i++) {
    await convertImage(
      path.join(YMENIE_ROOT, "ШАХ/Снимки за слайдер", shahSliderFiles[i]),
      path.join(PUBLIC_SERVICES, `shah/slider/slide-${i + 1}.webp`)
    );
  }

  // 4. Читателски клуб „Лигериа“
  console.log("\n--- 4. Читателски клуб ---");
  const chitatelskiPage1 = path.join(YMENIE_ROOT, "Читателски клуб _Лигериа_/Снимка за страницата/Лигериа 1.jpg");
  const chitatelskiPage2 = path.join(YMENIE_ROOT, "Читателски клуб _Лигериа_/Снимка за страницата/Лигериа 2.png");
  await convertImage(chitatelskiPage1, path.join(PUBLIC_SERVICES, "chitatelski-klub-ligeria/page/page-1.webp"));
  await convertImage(chitatelskiPage2, path.join(PUBLIC_SERVICES, "chitatelski-klub-ligeria/page/page-2.webp"));
  await convertImage(chitatelskiPage1, path.join(PUBLIC_SERVICES, "chitatelski-klub/page/page-1.webp"));
  await convertImage(chitatelskiPage2, path.join(PUBLIC_SERVICES, "chitatelski-klub/page/page-2.webp"));

  const chitatelskiSliderFiles = fs
    .readdirSync(path.join(YMENIE_ROOT, "Читателски клуб _Лигериа_/Снимки за слайдер"))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort(naturalSort);
  for (let i = 0; i < chitatelskiSliderFiles.length; i++) {
    const src = path.join(YMENIE_ROOT, "Читателски клуб _Лигериа_/Снимки за слайдер", chitatelskiSliderFiles[i]);
    await convertImage(src, path.join(PUBLIC_SERVICES, `chitatelski-klub-ligeria/slider/slide-${i + 1}.webp`));
    await convertImage(src, path.join(PUBLIC_SERVICES, `chitatelski-klub/slider/slide-${i + 1}.webp`));
  }

  // 5. Арт занимания
  console.log("\n--- 5. Арт занимания ---");
  await convertImage(
    path.join(YMENIE_ROOT, "АРТ ЗАНИМАНИЯ/Снимки за страницата/Снимки за уебсайта 343х457 (1).png"),
    path.join(PUBLIC_SERVICES, "art-zanimaniya/page/page-1.webp")
  );
  await convertImage(
    path.join(YMENIE_ROOT, "АРТ ЗАНИМАНИЯ/Снимки за страницата/САЙТ Десктоп (2).png"),
    path.join(PUBLIC_SERVICES, "art-zanimaniya/page/page-2.webp")
  );
  const artSliderFiles = fs
    .readdirSync(path.join(YMENIE_ROOT, "АРТ ЗАНИМАНИЯ/Снимки за слайдер"))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort(naturalSort);
  for (let i = 0; i < artSliderFiles.length; i++) {
    await convertImage(
      path.join(YMENIE_ROOT, "АРТ ЗАНИМАНИЯ/Снимки за слайдер", artSliderFiles[i]),
      path.join(PUBLIC_SERVICES, `art-zanimaniya/slider/slide-${i + 1}.webp`)
    );
  }

  // 6. Плетиво
  console.log("\n--- 6. Плетиво ---");
  await convertImage(
    path.join(YMENIE_ROOT, "ПЛЕТИВО/Снимки и видеа за страницата/плетиво 1.png"),
    path.join(PUBLIC_SERVICES, "pletivo/page/page-1.webp")
  );
  await convertImage(
    path.join(YMENIE_ROOT, "ПЛЕТИВО/Снимки и видеа за страницата/плетиво 2.png"),
    path.join(PUBLIC_SERVICES, "pletivo/page/page-2.webp")
  );
  await convertImage(
    path.join(YMENIE_ROOT, "ПЛЕТИВО/Снимки и видеа за страницата/плетиво 3.png"),
    path.join(PUBLIC_SERVICES, "pletivo/page/page-3.webp")
  );
  const pletivoSliderFiles = fs
    .readdirSync(path.join(YMENIE_ROOT, "ПЛЕТИВО/Снимки за слайдер"))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort(naturalSort);
  for (let i = 0; i < pletivoSliderFiles.length; i++) {
    await convertImage(
      path.join(YMENIE_ROOT, "ПЛЕТИВО/Снимки за слайдер", pletivoSliderFiles[i]),
      path.join(PUBLIC_SERVICES, `pletivo/slider/slide-${i + 1}.webp`)
    );
  }

  console.log("\n=== Re-Conversion Completed Successfully ===");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
