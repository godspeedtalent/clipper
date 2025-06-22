# Clipper

A simple local web app to browse randomly generated video clips from a directory. It analyzes each video, splits them into 30 second segments and stores the metadata in a local SQLite database.

## Usage
1. Place your video files inside the `videos/` directory.
2. Run the server with `node index.js`.
3. Open `http://localhost:3000` in your browser.

Watch clips and skip with the large button. The app records how long each clip was watched and adjusts the rating. Highly rated clips are more likely to play while poorly rated ones are skipped.

`ffmpeg` and `ffprobe` must be installed on your system for clip extraction.
