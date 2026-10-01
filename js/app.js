/* ============================================
   TO MY SISTER - INTERACTIVE EXPERIENCE
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // HERO SECTION
    // ============================================
    const enterBtn = document.getElementById('enterBtn');
    const hero = document.getElementById('hero');
    const mainContent = document.getElementById('mainContent');
    const musicPlayer = document.getElementById('musicPlayer');
    const secretBtn = document.getElementById('secretBtn');

    enterBtn.addEventListener('click', () => {
        hero.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        hero.style.opacity = '0';
        hero.style.transform = 'scale(1.05)';
        
        setTimeout(() => {
            hero.classList.add('hidden');
            mainContent.classList.remove('hidden');
            musicPlayer.classList.remove('hidden');
            secretBtn.classList.remove('hidden');
            
            // Trigger scroll reveal for visible elements
            setTimeout(initScrollReveal, 100);
        }, 800);
    });

    // ============================================
    // FLOATING PARTICLES
    // ============================================
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 20;
        const symbols = ['♥', '✦', '✧', '⋆', '♡', '·'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('span');
            particle.classList.add('particle');
            particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            particle.style.left = Math.random() * 100 + '%';
            particle.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.color = Math.random() > 0.5 ? 'var(--pink)' : 'var(--lavender)';
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // ============================================
    // MUSIC PLAYER
    // ============================================
    const audio = new Audio();
    audio.volume = 0.7;

    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volumeSlider = document.getElementById('volumeSlider');
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const playlist = document.getElementById('playlist');
    const playlistToggle = document.getElementById('playlistToggle');
    const closePlaylist = document.getElementById('closePlaylist');
    const visualizer = document.getElementById('visualizer');

    let currentSongIndex = 0;
    let isPlaying = false;

    // Load song
    function loadSong(index) {
        const item = playlistItems[index];
        if (!item) return;
        
        const src = item.dataset.src;
        const title = item.dataset.title;
        const artist = item.dataset.artist;

        audio.src = src;
        songTitle.textContent = title;
        songArtist.textContent = artist;

        // Update active state
        playlistItems.forEach(item => item.classList.remove('active'));
        item.classList.add('active');
    }

    // Play song
    function playSong() {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                playPauseBtn.textContent = '⏸';
                visualizer.classList.add('playing');
            }).catch(error => {
                console.log('Audio playback failed:', error);
                // Show a subtle message that audio files need to be added
                songTitle.textContent = 'Add music files';
                songArtist.textContent = 'Place MP3s in /assets/music/';
            });
        }
    }

    // Pause song
    function pauseSong() {
        audio.pause();
        isPlaying = false;
        playPauseBtn.textContent = '▶';
        visualizer.classList.remove('playing');
    }

    // Toggle play/pause
    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    // Previous song
    prevBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + playlistItems.length) % playlistItems.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    });

    // Next song
    nextBtn.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % playlistItems.length;
        loadSong(currentSongIndex);
        if (isPlaying) playSong();
    });

    // Playlist item click
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(currentSongIndex);
            playSong();
        });
    });

    // Toggle playlist
    playlistToggle.addEventListener('click', () => {
        playlist.classList.toggle('hidden');
    });

    closePlaylist.addEventListener('click', () => {
        playlist.classList.add('hidden');
    });

    // Update progress
    audio.addEventListener('timeupdate', () => {
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
    });

    // Update duration
    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    // Song ended - play next
    audio.addEventListener('ended', () => {
        currentSongIndex = (currentSongIndex + 1) % playlistItems.length;
        loadSong(currentSongIndex);
        playSong();
    });

    // Click on progress bar
    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    // Volume control
    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });

    // Format time
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Load first song
    loadSong(0);

    // ============================================
    // GALLERY LIGHTBOX
    // ============================================
    const memoryCards = document.querySelectorAll('.memory-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightboxContent');
    const closeLightbox = document.getElementById('closeLightbox');

    memoryCards.forEach(card => {
        card.addEventListener('click', () => {
            const emoji = card.dataset.emoji;
            const caption = card.dataset.caption;
            
            // Show emoji and caption in lightbox
            lightboxContent.innerHTML = `
                <div class="lightbox-emoji">${emoji}</div>
                <p class="lightbox-caption-text">${caption}</p>
            `;
            
            lightbox.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        });
    });

    closeLightbox.addEventListener('click', () => {
        lightbox.classList.add('hidden');
        document.body.style.overflow = '';
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    // ============================================
    // TIMELINE SCROLL ANIMATION
    // ============================================
    function initScrollReveal() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const revealElements = document.querySelectorAll('.love-card, .gallery-item, .facts-card, .letter-card, .final-title, .final-subtitle, .play-song-btn');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        timelineItems.forEach(item => observer.observe(item));
        revealElements.forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    }

    // ============================================
    // RANDOM FACTS
    // ============================================
    const facts = [
        "SHARARATI LADKIIII SUDHAR KE RAHUNGA TUJHEEE",
        "Shararat is her middle name.",
        "cute but mischievous.",
        "She has a PhD in teasing.",
        "She can find the most random things funny.",
        "Her laugh is contagious.",
        "Her text messages are either 3 words or 3 paragraphs.",
        "She will defend you to anyone, then roast you five minutes later.",
        "She can make you laugh even when you're mad at her."
    ];

    const factText = document.getElementById('factText');
    const factBtn = document.getElementById('factBtn');

    factBtn.addEventListener('click', () => {
        factText.style.opacity = '0';
        factText.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            const randomFact = facts[Math.floor(Math.random() * facts.length)];
            factText.textContent = randomFact;
            factText.style.opacity = '1';
            factText.style.transform = 'translateY(0)';
        }, 300);
    });

    // ============================================
    // READ AGAIN BUTTON
    // ============================================
    const readAgainBtn = document.getElementById('readAgainBtn');
    const letterBody = document.querySelector('.letter-body');

    readAgainBtn.addEventListener('click', () => {
        letterBody.style.opacity = '0';
        letterBody.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            letterBody.style.opacity = '1';
            letterBody.style.transform = 'translateY(0)';
        }, 400);
    });

    // ============================================
    // SECRET BUTTON
    // ============================================
    const secretModal = document.getElementById('secretModal');

    secretBtn.addEventListener('click', () => {
        secretModal.classList.remove('hidden');
        
        // Create floating hearts
        createSecretHearts();
    });

    secretModal.addEventListener('click', (e) => {
        if (e.target === secretModal) {
            secretModal.classList.add('hidden');
        }
    });

    function createSecretHearts() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const heart = document.createElement('span');
                heart.textContent = '♥';
                heart.style.position = 'fixed';
                heart.style.left = Math.random() * 100 + 'vw';
                heart.style.top = '100vh';
                heart.style.fontSize = (Math.random() * 2 + 1) + 'rem';
                heart.style.color = 'var(--pink)';
                heart.style.zIndex = '3001';
                heart.style.pointerEvents = 'none';
                heart.style.animation = `floatUp ${Math.random() * 3 + 2}s ease-out forwards`;
                document.body.appendChild(heart);

                setTimeout(() => heart.remove(), 5000);
            }, i * 200);
        }
    }

    // Add float up animation dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUp {
            0% { transform: translateY(0) rotate(0deg); opacity: 1; }
            100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // PLAY SONG BUTTON (FINAL SECTION)
    // ============================================
    const playSongBtn = document.getElementById('playSongBtn');

    playSongBtn.addEventListener('click', () => {
        if (!isPlaying) {
            playSong();
        }
        
        // Smooth scroll to music player
        musicPlayer.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Highlight the player briefly
        musicPlayer.style.boxShadow = '0 0 0 4px var(--pink), 0 12px 40px rgba(139, 109, 99, 0.18)';
        setTimeout(() => {
            musicPlayer.style.boxShadow = 'var(--shadow-strong)';
        }, 2000);
    });

    // ============================================
    // FOOTER YEAR
    // ============================================
    const footerYear = document.querySelector('.footer-year');
    if (footerYear) {
        footerYear.textContent = `© ${new Date().getFullYear()}`;
    }

    // ============================================
    // KEYBOARD SHORTCUTS
    // ============================================
    document.addEventListener('keydown', (e) => {
        // Space to toggle play/pause (when not in input)
        if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
            if (isPlaying) {
                pauseSong();
            } else {
                playSong();
            }
        }
        
        // Escape to close lightbox/secret modal
        if (e.code === 'Escape') {
            lightbox.classList.add('hidden');
            secretModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ============================================
    // INITIAL SETUP
    // ============================================
    // Hide elements that should start hidden
    secretBtn.classList.add('hidden');
    
    // Add transition styles to fact text
    factText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    letterBody.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
});
