let highestZ = 1;

class Paper {
  constructor() {
    this.holdingPaper = false;
    this.mouseTouchX = 0;
    this.mouseTouchY = 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;
    this.velX = 0;
    this.velY = 0;
    this.rotation = Math.random() * 30 - 15;
    this.currentPaperX = 0;
    this.currentPaperY = 0;
    this.rotating = false;
  }

  init(paper) {
    document.addEventListener('mousemove', (e) => {
      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      this.handlePaperTransform(paper);
    });

    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });

    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      this.mouseTouchX = e.touches[0].clientX;
      this.mouseTouchY = e.touches[0].clientY;
      this.prevMouseX = this.mouseTouchX;
      this.prevMouseY = this.mouseTouchY;
    });

    document.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    document.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    document.addEventListener('touchmove', (e) => {
      e.preventDefault();

      if (!this.rotating) {
        this.mouseX = e.touches[0].clientX;
        this.mouseY = e.touches[0].clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      this.handlePaperTransform(paper);
    });
  }

  handlePaperTransform(paper) {
    const dirX = this.mouseX - this.mouseTouchX;
    const dirY = this.mouseY - this.mouseTouchY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
    const dirNormalizedX = dirX / dirLength;
    const dirNormalizedY = dirY / dirLength;

    const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
    let degrees = (180 * angle) / Math.PI;
    degrees = (360 + Math.round(degrees)) % 360;
    if (this.rotating) {
      this.rotation = degrees;
    }

    if (this.holdingPaper) {
      if (!this.rotating) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      }
      this.prevMouseX = this.mouseX;
      this.prevMouseY = this.mouseY;

      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    }
  }
}

const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

document.addEventListener('DOMContentLoaded', () => {
    const envelope = document.querySelector('.envelope');
    const scroll = document.querySelector('.scroll');
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    let isOpen = false;
    let isMusicPlaying = false;

    // Music control with error handling
    function handleMusic() {
        try {
            if (isMusicPlaying) {
                bgMusic.pause();
                musicToggle.classList.remove('playing');
            } else {
                const playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        musicToggle.classList.add('playing');
                    }).catch(error => {
                        console.log("Playback failed:", error);
                        alert("Please click the music button to start the music");
                    });
                }
            }
            isMusicPlaying = !isMusicPlaying;
        } catch (error) {
            console.log("Music error:", error);
        }
    }

    // Music control
    musicToggle.addEventListener('click', handleMusic);

    // Add floating hearts to the background
    function createFloatingHearts() {
        const container = document.querySelector('.container');
        for (let i = 0; i < 15; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.position = 'absolute';
            heart.style.fontSize = Math.random() * 20 + 10 + 'px';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = Math.random() * 100 + '%';
            heart.style.opacity = Math.random() * 0.5 + 0.3;
            heart.style.animation = `float ${Math.random() * 3 + 2}s ease-in-out infinite`;
            heart.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(heart);
        }
    }

    // Handle envelope opening
    function openEnvelope() {
        if (!isOpen) {
            envelope.classList.add('open');
            isOpen = true;
            
            // Start playing music when envelope is opened
            if (!isMusicPlaying) {
                const playPromise = bgMusic.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => {
                        musicToggle.classList.add('playing');
                        isMusicPlaying = true;
                    }).catch(error => {
                        console.log("Auto-play failed:", error);
                        // Don't show alert here as it's auto-play
                    });
                }
            }
            
            // Add sparkle effect
            const sparkles = document.createElement('div');
            sparkles.className = 'sparkles';
            envelope.appendChild(sparkles);
            
            // Create sparkle elements
            for (let i = 0; i < 20; i++) {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.left = Math.random() * 100 + '%';
                sparkle.style.top = Math.random() * 100 + '%';
                sparkle.style.animationDelay = Math.random() * 0.5 + 's';
                sparkles.appendChild(sparkle);
            }
        }
    }

    // Add click event listener to the envelope
    envelope.addEventListener('click', openEnvelope);

    // Initialize floating hearts
    createFloatingHearts();

    // Handle scroll indicator visibility
    scroll.addEventListener('scroll', () => {
        const scrollTop = scroll.scrollTop;
        const scrollHeight = scroll.scrollHeight - scroll.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        // Hide scroll indicator when scrolled down
        if (scrollPercentage > 10) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '0.7';
        }
        
        // Add subtle parallax effect to the letter content
        const letter = document.querySelector('.letter');
        letter.style.transform = `translateY(${scrollPercentage * 0.1}px)`;
    });
});
