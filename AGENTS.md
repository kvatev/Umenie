# Workspace Rules

## Git Workflow
- Always automatically commit changes to git with a descriptive, concise commit message in English after modifying or creating files.
- Automatically push changes to the remote branch (`origin main`) after committing, so the live deployment (e.g. Vercel) receives the update immediately.

## Media / Heavy Files
- NEVER commit original (raw, unconverted) videos or heavy source files to GitHub. Originals stay only in the local `Ymenie/` folder (gitignored) or elsewhere outside the repo.
- Only commit web-optimized, converted versions (e.g. compressed MP4 ~720p/30fps, WebP posters) placed in `public/`.
- Before committing media, check file sizes; anything that is not a converted/compressed version must not be added.
