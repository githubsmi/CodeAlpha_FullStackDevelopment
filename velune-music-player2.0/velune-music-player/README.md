# Velune - Music Player

Velune is a simple music player project I made using HTML, CSS, and JavaScript. I wanted it to have the basic features of a music streaming app while keeping the design simple, modern, and a little different.

The project has a dark interface with soft colors, a sidebar for navigation, a music player at the bottom, and different sections for songs and collections.

## Features

- Play and pause songs
- Previous and next song buttons
- Autoplay for playing the next song automatically
- Shuffle and repeat options
- Progress bar for controlling the song
- Volume and mute controls
- 10 demo songs
- Search songs by title, artist, or album
- Like and unlike songs
- Liked Songs collection
- Add songs to collections
- Create new collections
- View collections from the sidebar
- Mobile-friendly menu
- Close the mobile menu by clicking outside, pressing Escape, or swiping
- Animated album artwork
- Saves liked songs and collections using LocalStorage

## Project Structure

```text
velune-music-player/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── audio/
    ├── morning-glow.wav
    ├── quiet-evening.wav
    ├── soft-horizon.wav
    ├── city-lights.wav
    ├── paper-sky.wav
    ├── slow-sunday.wav
    ├── midnight-window.wav
    ├── golden-hour.wav
    ├── little-dream.wav
    └── rainy-streets.wav
```

## How to Run

There is no complicated setup for this project.

1. Download or extract the project folder.
2. Make sure the `audio` folder is in the same folder as `index.html`.
3. Open `index.html` in a browser.
4. Click on a song or press the play button to start listening.

That's it. The project runs directly in the browser.

## Technologies Used

I used:

- **HTML5** for the structure of the website
- **CSS3** for the design, layout, animations, and responsive styling
- **JavaScript** for the music player functionality
- **HTML5 Audio API** for playing the songs
- **LocalStorage** for saving liked songs and collections

## Collections

The player allows songs to be organized into collections.

I can click the **＋** button next to a song and choose an existing collection or create a new one.

There is also a **Liked Songs** section where songs that I like are saved automatically.

The collections and liked songs are stored using LocalStorage, so they are still there when the page is refreshed in the same browser.

## Mobile Menu

The sidebar is also designed to work on smaller screens.

On mobile, I can open the menu using the menu button. The menu can be closed by:

- Clicking outside the sidebar
- Clicking the **×** button
- Pressing the **Escape** key
- Swiping the sidebar to the left

The sidebar can also be scrolled if there are more collection items than can fit on the screen.

## Music Player

The bottom music player includes the main controls for listening to songs.

It has:

- Play / pause
- Previous
- Next
- Shuffle
- Repeat
- Autoplay
- Progress control
- Volume control
- Mute
- Like button
- Add to collection

When **Autoplay** is enabled, the next song starts automatically when the current song finishes.

## Demo Audio

The project includes **10 small demo audio files** so that the music player can be tested without adding external music.

The audio files are only included as sample tracks for this project.

## What I Learned

While making this project, I practiced working with HTML, CSS, and JavaScript together instead of keeping them as separate concepts.

I also got more practice with things like:

- Handling button clicks with JavaScript
- Working with the HTML Audio API
- Updating the interface while a song is playing
- Creating responsive layouts
- Using LocalStorage
- Creating and managing collections
- Adding mobile interactions
- Making a UI feel more interactive with CSS animations

Overall, this project helped me understand how the frontend of a basic music player works.
