const songs = [
    { title: "Morning Glow", artist: "Luna Fields", album: "Soft Mornings", src: "audio/morning-glow.wav" },
    { title: "Quiet Evening", artist: "Mira Lane", album: "After Dusk", src: "audio/quiet-evening.wav" },
    { title: "Soft Horizon", artist: "Noah Bloom", album: "Open Skies", src: "audio/soft-horizon.wav" },
    { title: "City Lights", artist: "Avery Moon", album: "Night Drive", src: "audio/city-lights.wav" },
    { title: "Paper Sky", artist: "Elia Rose", album: "Soft Bloom", src: "audio/paper-sky.wav" },
    { title: "Slow Sunday", artist: "Milo Hart", album: "Easy Days", src: "audio/slow-sunday.wav" },
    { title: "Midnight Window", artist: "Sage Vale", album: "After Hours", src: "audio/midnight-window.wav" },
    { title: "Golden Hour", artist: "Iris Cove", album: "Warm Light", src: "audio/golden-hour.wav" },
    { title: "Little Dream", artist: "Nora June", album: "Daydreams", src: "audio/little-dream.wav" },
    { title: "Rainy Streets", artist: "Theo West", album: "Quiet City", src: "audio/rainy-streets.wav" }
];

const defaultCollections = {
    "After Dusk": [],
    "Soft Bloom": []
};

const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const playIcon = document.getElementById("playIcon");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const shuffleBtn = document.getElementById("shuffleBtn");
const repeatBtn = document.getElementById("repeatBtn");
const autoplayBtn = document.getElementById("autoplayBtn");
const progress = document.getElementById("progress");
const volume = document.getElementById("volume");
const muteBtn = document.getElementById("muteBtn");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");
const nowTitle = document.getElementById("nowTitle");
const nowArtist = document.getElementById("nowArtist");
const songList = document.getElementById("songList");
const heroPlay = document.getElementById("heroPlay");
const heroPlayIcon = document.getElementById("heroPlayIcon");
const heroPlayText = document.getElementById("heroPlayText");
const heartBtn = document.getElementById("heartBtn");
const nowCollectionBtn = document.getElementById("nowCollectionBtn");
const searchInput = document.getElementById("searchInput");
const toast = document.getElementById("toast");
const mobileMenu = document.getElementById("mobileMenu");
const closeMenu = document.getElementById("closeMenu");
const sidebar = document.getElementById("sidebar");
const mobileOverlay = document.getElementById("mobileOverlay");
const newCollectionBtn = document.getElementById("newCollectionBtn");
const libraryList = document.getElementById("libraryList");
const likedCount = document.getElementById("likedCount");
const listTitle = document.getElementById("listTitle");
const listKicker = document.getElementById("listKicker");
const emptyState = document.getElementById("emptyState");
const showAllBtn = document.getElementById("showAllBtn");

const collectionModal = document.getElementById("collectionModal");
const closeCollectionModal = document.getElementById("closeCollectionModal");
const collectionOptions = document.getElementById("collectionOptions");
const modalSongName = document.getElementById("modalSongName");
const newCollectionLink = document.getElementById("newCollectionLink");
const newCollectionForm = document.getElementById("newCollectionForm");
const collectionNameInput = document.getElementById("collectionNameInput");
const saveCollectionBtn = document.getElementById("saveCollectionBtn");

let currentIndex = 0;
let shuffle = false;
let repeat = false;
let autoplay = true;
let likedSongs = loadJSON("veluneLikedSongs", []);
let collections = loadJSON("veluneCollections", defaultCollections);
let activeCollection = null;
let collectionSongIndex = null;
let lastVolume = 0.8;

function loadJSON(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
}

function saveData() {
    localStorage.setItem("veluneLikedSongs", JSON.stringify(likedSongs));
    localStorage.setItem("veluneCollections", JSON.stringify(collections));
}

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, "0")}`;
}

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}

function closeMobileMenu() {
    sidebar.classList.remove("open");
    mobileOverlay.classList.remove("show");
    document.body.classList.remove("menu-open");
}

function openMobileMenu() {
    sidebar.classList.add("open");
    mobileOverlay.classList.add("show");
    document.body.classList.add("menu-open");
}

function loadSong(index, autoplay = false) {
    currentIndex = (index + songs.length) % songs.length;
    const song = songs[currentIndex];

    audio.pause();
    audio.src = song.src;
    audio.load();

    nowTitle.textContent = song.title;
    nowArtist.textContent = song.artist;
    progress.value = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";

    updateLikeButton();
    renderSongs(searchInput.value);
    updatePlayButton();

    if (autoplay) playSong();
}

async function playSong() {
    try {
        await audio.play();
    } catch (error) {
        console.error(error);
        showToast("This audio file could not be played.");
        updatePlayButton();
    }
}

function pauseSong() {
    audio.pause();
    updatePlayButton();
}

function togglePlay() {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
}

function nextSong(autoplay = true) {
    let nextIndex;

    if (shuffle) {
        do {
            nextIndex = Math.floor(Math.random() * songs.length);
        } while (songs.length > 1 && nextIndex === currentIndex);
    } else {
        nextIndex = currentIndex + 1;
    }

    loadSong(nextIndex, autoplay);
}

function previousSong() {
    if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
    }

    loadSong(currentIndex - 1, true);
}

function updatePlayButton() {
    const isPlaying = !audio.paused && !audio.ended;

    playIcon.textContent = isPlaying ? "Ⅱ" : "▶";
    playBtn.setAttribute("aria-label", isPlaying ? "Pause" : "Play");

    heroPlayIcon.textContent = isPlaying ? "Ⅱ" : "▶";
    heroPlayText.textContent = isPlaying ? "Pause" : "Play something";

    document.querySelectorAll(".song-row").forEach(row => {
        const index = Number(row.dataset.index);
        const action = row.querySelector(".song-action");
        if (!action) return;

        if (index === currentIndex && isPlaying) {
            action.textContent = "Ⅱ";
            action.setAttribute("aria-label", `Pause ${songs[index].title}`);
        } else {
            action.textContent = "▶";
            action.setAttribute("aria-label", `Play ${songs[index].title}`);
        }
    });
}

function isLiked(index) {
    return likedSongs.includes(index);
}

function toggleLike(index = currentIndex) {
    if (isLiked(index)) {
        likedSongs = likedSongs.filter(item => item !== index);
        showToast("Removed from liked songs");
    } else {
        likedSongs.push(index);
        showToast("Added to liked songs");
    }

    saveData();
    updateLikeButton();
    updateLikedCount();

    if (activeCollection === "Liked Songs") {
        renderSongs(searchInput.value);
    }
}

function updateLikeButton() {
    const liked = isLiked(currentIndex);
    heartBtn.classList.toggle("liked", liked);
    heartBtn.textContent = liked ? "♥" : "♡";
    heartBtn.setAttribute("aria-label", liked ? "Unlike song" : "Like song");
}

function updateLikedCount() {
    likedCount.textContent = `${likedSongs.length} ${likedSongs.length === 1 ? "song" : "songs"}`;
}

function songIsInCollection(songIndex, collectionName) {
    return Array.isArray(collections[collectionName]) &&
        collections[collectionName].includes(songIndex);
}

function addToCollection(collectionName, songIndex) {
    if (!collections[collectionName]) {
        collections[collectionName] = [];
    }

    if (songIsInCollection(songIndex, collectionName)) {
        showToast(`Already in ${collectionName}`);
        return;
    }

    collections[collectionName].push(songIndex);
    saveData();
    renderLibrary();
    showToast(`Added to ${collectionName}`);
}

function openCollectionModal(songIndex = currentIndex) {
    collectionSongIndex = songIndex;
    const song = songs[songIndex];

    modalSongName.textContent = `${song.title} · ${song.artist}`;
    renderCollectionOptions();

    newCollectionForm.hidden = true;
    collectionNameInput.value = "";
    collectionModal.hidden = false;

    requestAnimationFrame(() => {
        collectionModal.classList.add("show");
    });
}

function closeCollectionDialog() {
    collectionModal.classList.remove("show");

    setTimeout(() => {
        collectionModal.hidden = true;
        newCollectionForm.hidden = true;
    }, 180);
}

function renderCollectionOptions() {
    collectionOptions.innerHTML = "";

    const names = Object.keys(collections);

    if (!names.length) {
        collectionOptions.innerHTML = `<p class="no-collections">Create your first collection below.</p>`;
        return;
    }

    names.forEach(name => {
        const exists = songIsInCollection(collectionSongIndex, name);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "collection-option";
        button.disabled = exists;

        button.innerHTML = `
            <span class="collection-option-cover">${name.charAt(0).toUpperCase()}</span>
            <span>
                <strong>${name}</strong>
                <small>${exists ? "Already added" : `${collections[name].length} songs`}</small>
            </span>
            <span class="collection-check">${exists ? "✓" : "＋"}</span>
        `;

        button.addEventListener("click", () => {
            addToCollection(name, collectionSongIndex);
            closeCollectionDialog();
        });

        collectionOptions.appendChild(button);
    });
}

function createCollection() {
    const name = collectionNameInput.value.trim();

    if (!name) {
        showToast("Give your collection a name");
        collectionNameInput.focus();
        return;
    }

    if (name.toLowerCase() === "liked songs") {
        showToast("Liked Songs is reserved for your favorites");
        return;
    }

    const existingName = Object.keys(collections).find(
        collection => collection.toLowerCase() === name.toLowerCase()
    );

    if (existingName) {
        showToast("That collection already exists");
        return;
    }

    collections[name] = [];
    saveData();
    renderLibrary();

    if (collectionSongIndex !== null) {
        addToCollection(name, collectionSongIndex);
    } else {
        showToast(`Created ${name}`);
    }

    closeCollectionDialog();
}

function renderLibrary() {
    libraryList.innerHTML = "";

    const likedButton = document.createElement("button");
    likedButton.className = `library-item ${activeCollection === "Liked Songs" ? "active-library" : ""}`;
    likedButton.dataset.collection = "Liked Songs";
    likedButton.type = "button";
    likedButton.innerHTML = `
        <span class="library-cover liked">♡</span>
        <span>
            <strong>Liked Songs</strong>
            <small>${likedSongs.length} ${likedSongs.length === 1 ? "song" : "songs"}</small>
        </span>
    `;
    likedButton.addEventListener("click", () => selectCollection("Liked Songs"));
    libraryList.appendChild(likedButton);

    Object.keys(collections).forEach(name => {
        const button = document.createElement("button");
        button.className = `library-item ${activeCollection === name ? "active-library" : ""}`;
        button.dataset.collection = name;
        button.type = "button";

        const initials = name.charAt(0).toUpperCase();

        button.innerHTML = `
            <span class="library-cover custom">${initials}</span>
            <span>
                <strong>${name}</strong>
                <small>${collections[name].length} ${collections[name].length === 1 ? "song" : "songs"}</small>
            </span>
        `;

        button.addEventListener("click", () => selectCollection(name));
        libraryList.appendChild(button);
    });

    updateLikedCount();
}

function selectCollection(name) {
    activeCollection = name;
    searchInput.value = "";

    if (name === "Liked Songs") {
        listKicker.textContent = "YOUR FAVORITES";
        listTitle.textContent = "Liked songs";
    } else {
        listKicker.textContent = "YOUR COLLECTION";
        listTitle.textContent = name;
    }

    renderLibrary();
    renderSongs();
    closeMobileMenu();
}

function getVisibleSongs(filter = "") {
    let visibleIndexes;

    if (activeCollection === "Liked Songs") {
        visibleIndexes = likedSongs;
    } else if (activeCollection && collections[activeCollection]) {
        visibleIndexes = collections[activeCollection];
    } else {
        visibleIndexes = songs.map((_, index) => index);
    }

    const query = filter.toLowerCase().trim();

    return visibleIndexes.filter(index => {
        const song = songs[index];
        return !query ||
            song.title.toLowerCase().includes(query) ||
            song.artist.toLowerCase().includes(query) ||
            song.album.toLowerCase().includes(query);
    });
}

function renderSongs(filter = "") {
    songList.innerHTML = "";

    const visibleIndexes = getVisibleSongs(filter);

    emptyState.hidden = visibleIndexes.length !== 0;
    songList.hidden = visibleIndexes.length === 0;

    visibleIndexes.forEach(index => {
        const song = songs[index];
        const row = document.createElement("div");
        row.className = `song-row ${index === currentIndex ? "active" : ""}`;
        row.dataset.index = index;

        const coverClass = ["one", "two", "three"][index % 3];

        row.innerHTML = `
            <span class="song-number">${String(index + 1).padStart(2, "0")}</span>

            <div class="song-info">
                <div class="song-cover ${coverClass}">${song.title.charAt(0)}</div>
                <div class="song-copy">
                    <strong>${song.title}</strong>
                    <small>${song.artist}</small>
                </div>
            </div>

            <span class="song-album">${song.album}</span>

            <div class="song-row-actions">
                <button class="song-like ${isLiked(index) ? "liked" : ""}" type="button"
                    aria-label="${isLiked(index) ? "Unlike" : "Like"} ${song.title}">
                    ${isLiked(index) ? "♥" : "♡"}
                </button>

                <button class="song-add" type="button" aria-label="Add ${song.title} to a collection">＋</button>

                <button class="song-action" type="button" aria-label="Play ${song.title}">
                    ▶
                </button>
            </div>
        `;

        row.addEventListener("click", (event) => {
            if (event.target.closest(".song-like")) {
                toggleLike(index);
                renderSongs(searchInput.value);
                return;
            }

            if (event.target.closest(".song-add")) {
                openCollectionModal(index);
                return;
            }

            if (event.target.closest(".song-action")) {
                if (index === currentIndex) {
                    togglePlay();
                } else {
                    loadSong(index, true);
                }
                return;
            }

            if (index === currentIndex) {
                togglePlay();
            } else {
                loadSong(index, true);
            }
        });

        songList.appendChild(row);
    });

    updatePlayButton();
}

function updateProgress() {
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;

    progress.value = (audio.currentTime / audio.duration) * 100;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
}

function seek() {
    if (!audio.duration) return;
    audio.currentTime = (progress.value / 100) * audio.duration;
}

function updateVolume() {
    const value = Number(volume.value);

    audio.muted = false;
    audio.volume = value;

    if (value > 0) {
        lastVolume = value;
    }

    muteBtn.textContent = value === 0 ? "🔇" : "⌁";
}

function toggleMute() {
    if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = lastVolume || 0.8;
        volume.value = audio.volume;
        muteBtn.textContent = "⌁";
    } else {
        lastVolume = audio.volume;
        audio.muted = true;
        muteBtn.textContent = "🔇";
    }
}

playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", previousSong);
nextBtn.addEventListener("click", () => nextSong(true));

shuffleBtn.addEventListener("click", () => {
    shuffle = !shuffle;
    shuffleBtn.classList.toggle("active", shuffle);
    showToast(shuffle ? "Shuffle on" : "Shuffle off");
});

repeatBtn.addEventListener("click", () => {
    repeat = !repeat;
    repeatBtn.classList.toggle("active", repeat);
    showToast(repeat ? "Repeat on" : "Repeat off");
});

autoplayBtn.addEventListener("click", () => {
    autoplay = !autoplay;
    autoplayBtn.classList.toggle("active", autoplay);
    autoplayBtn.textContent = autoplay ? "AUTO" : "AUTO";
    autoplayBtn.setAttribute("aria-pressed", String(autoplay));
    showToast(autoplay ? "Autoplay on" : "Autoplay off");
});

progress.addEventListener("input", seek);
volume.addEventListener("input", updateVolume);
muteBtn.addEventListener("click", toggleMute);

heartBtn.addEventListener("click", () => toggleLike(currentIndex));
nowCollectionBtn.addEventListener("click", () => openCollectionModal(currentIndex));

heroPlay.addEventListener("click", togglePlay);

searchInput.addEventListener("input", () => {
    activeCollection = null;
    listKicker.textContent = "SEARCH RESULTS";
    listTitle.textContent = searchInput.value.trim() ? "Songs" : "Recently played";
    renderLibrary();
    renderSongs(searchInput.value);
});

mobileMenu.addEventListener("click", openMobileMenu);
closeMenu.addEventListener("click", closeMobileMenu);
mobileOverlay.addEventListener("click", closeMobileMenu);

document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeMobileMenu();
        closeCollectionDialog();
    }
});

newCollectionBtn.addEventListener("click", () => {
    collectionSongIndex = null;
    modalSongName.textContent = "Create a collection for your music";
    renderCollectionOptions();
    newCollectionForm.hidden = false;
    collectionModal.hidden = false;

    requestAnimationFrame(() => {
        collectionModal.classList.add("show");
        collectionNameInput.focus();
    });
});

newCollectionLink.addEventListener("click", () => {
    newCollectionForm.hidden = false;
    collectionNameInput.focus();
});

saveCollectionBtn.addEventListener("click", createCollection);

collectionNameInput.addEventListener("keydown", event => {
    if (event.key === "Enter") createCollection();
});

closeCollectionModal.addEventListener("click", closeCollectionDialog);

collectionModal.addEventListener("click", event => {
    if (event.target === collectionModal) closeCollectionDialog();
});

showAllBtn.addEventListener("click", () => {
    activeCollection = null;
    searchInput.value = "";
    listKicker.textContent = "YOUR PLAYLIST";
    listTitle.textContent = "Recently played";
    renderLibrary();
    renderSongs();
    document.querySelector(".songs-section").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll(".mood-card").forEach(card => {
    card.addEventListener("click", () => {
        activeCollection = null;
        loadSong(Number(card.dataset.song), true);
    });
});

document.querySelectorAll(".nav-item").forEach(item => {
    item.addEventListener("click", () => {
        document.querySelectorAll(".nav-item").forEach(nav => nav.classList.remove("active"));
        item.classList.add("active");

        const view = item.dataset.view;

        if (view === "search") {
            searchInput.focus();
            closeMobileMenu();
        } else if (view === "library") {
            selectCollection("Liked Songs");
        } else {
            activeCollection = null;
            listKicker.textContent = "YOUR PLAYLIST";
            listTitle.textContent = "Recently played";
            searchInput.value = "";
            renderLibrary();
            renderSongs();
            closeMobileMenu();
        }
    });
});

/* Swipe left to close the mobile sidebar. */
let touchStartX = 0;

sidebar.addEventListener("touchstart", event => {
    touchStartX = event.changedTouches[0].screenX;
}, { passive: true });

sidebar.addEventListener("touchend", event => {
    const touchEndX = event.changedTouches[0].screenX;

    if (touchStartX - touchEndX > 55) {
        closeMobileMenu();
    }
}, { passive: true });

/* Audio state */
audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("timeupdate", updateProgress);

audio.addEventListener("play", updatePlayButton);
audio.addEventListener("playing", updatePlayButton);
audio.addEventListener("pause", updatePlayButton);

audio.addEventListener("ended", () => {
    /*
     * Repeat has priority over autoplay.
     * If repeat is off and autoplay is on, move to another track.
     * If both are off, stop and show the play icon.
     */
    if (repeat) {
        audio.currentTime = 0;
        playSong();
        return;
    }

    if (autoplay) {
        nextSong(true);
        return;
    }

    progress.value = 100;
    currentTimeEl.textContent = formatTime(audio.duration);
    updatePlayButton();
});

audio.addEventListener("error", () => {
    showToast("Audio file could not be loaded.");
    updatePlayButton();
});

/* Initial state */
audio.volume = 0.8;
volume.value = 0.8;
autoplayBtn.classList.add("active");
autoplayBtn.setAttribute("aria-pressed", "true");
renderLibrary();
updateLikedCount();
loadSong(0, false);
