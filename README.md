# Clipper

A Next.js based web app to browse randomly generated video clips from a directory or the web. Local videos are analyzed and split into 30 second segments while web clips can be added directly. All metadata is stored in a local SQLite database.

## Usage
1. Install dependencies with `npm install`.
2. Configure the video directory from the **Settings** page or by editing `config.json`. The default location is `videos/` inside the project.
3. Run the development server with `npm run dev` and open `http://localhost:3000` in your browser.
4. For production build run `npm run build` followed by `npm start`.

Web clips can be added programmatically via `lib/videoManager.js` using `addWebVideo(url)`.

Watch clips and skip with the large button. The app records how long each clip was watched and adjusts the rating. Highly rated clips are more likely to play while poorly rated ones are skipped.

`ffmpeg` and `ffprobe` must be installed on your system for clip extraction.
