# Clipper

A simple local web app to browse randomly generated video clips from a directory. It analyzes each video, splits them into 30 second segments and stores the metadata in a local SQLite database.

## Usage
1. Install dependencies with `npm install`.
2. Place your video files inside the `videos/` directory (the folder will be created automatically on first run).
3. Start the server with `npm start`.
4. Open `http://localhost:3000` in your browser.

Watch clips and skip with the large button. You can also **ignore** clips which removes them from the database, give a **thumbs up** or **thumbs down** once per clip to heavily adjust its score, and **favorite** clips for later. The app records how long each clip was watched and adjusts the rating. Highly rated clips are more likely to play while poorly rated ones are skipped.

`ffmpeg` and `ffprobe` must be installed on your system for clip extraction.
