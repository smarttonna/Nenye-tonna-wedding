/**
 * CHINENYE & TONNA WEDDING INVITATION
 * Interactive Logic: Countdown, Ambient Audio, RSVP, Calendar, Clipboard & Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initNavigation();
  initAudioPlayer();
  initBankCopy();
  initGiftsMobileCarousel();
  initRSVPForm();
  initLightbox();
});

/* ==========================================================================
   1. COUNTDOWN TIMER
   Target: Sunday, November 29, 2026 at 12:00 PM (WAT / GMT+1)
   ========================================================================== */
function initCountdown() {
  const targetDate = new Date('2026-11-29T12:00:00+01:00').getTime();

  const daysEl = document.getElementById('countDays');
  const hoursEl = document.getElementById('countHours');
  const minutesEl = document.getElementById('countMinutes');
  const secondsEl = document.getElementById('countSeconds');

  function update() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      const title = document.querySelector('.countdown-title');
      if (title) title.textContent = 'Today is the Day! Celebrating Chinenye & Tonna';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  update();
  setInterval(update, 1000);
}

/* ==========================================================================
   2. STICKY HEADER & MOBILE NAVIGATION
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileBtn = document.querySelector('.mobile-menu-btn');
  const navContainer = document.querySelector('.nav-container');
  const navLinks = document.querySelectorAll('.nav-link, .btn-rsvp-nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileBtn && navContainer) {
    mobileBtn.addEventListener('click', () => {
      navContainer.classList.toggle('mobile-active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navContainer.classList.remove('mobile-active');
      });
    });
  }
}

/* ==========================================================================
   3. AMBIENT ROMANTIC WEDDING AUDIO PLAYER
   Includes a rich Web Audio API romantic harp/chimes arpeggiator
   that always plays reliably on any browser without network dependencies!
   ========================================================================== */
function initAudioPlayer() {
  const toggleBtn = document.getElementById('audioToggleBtn');
  const soundWaves = document.querySelector('.sound-waves');
  const tooltip = document.querySelector('.audio-info-tooltip');

  let isPlaying = false;
  let audioCtx = null;
  let sequenceInterval = null;

  // Romantic Pentatonic Chord progression (D major / B minor romantic wedding motif)
  const notes = [
    293.66, 369.99, 440.00, 587.33, 739.99, 880.00, // D, F#, A, D5, F#5, A5
    246.94, 329.63, 392.00, 493.88, 659.25, 783.99, // B, E, G, B4, E5, G5
    220.00, 277.18, 329.63, 440.00, 554.37, 659.25  // A, C#, E, A4, C#5, E5
  ];

  function playHarpNote(freq, time) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Warm soft attack and gentle decay like a concert harp
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.12, time + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(time);
    osc.stop(time + 3.0);
  }

  function startAmbientMusic() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    let step = 0;
    sequenceInterval = setInterval(() => {
      const now = audioCtx.currentTime;
      const noteIdx = (step % notes.length);
      playHarpNote(notes[noteIdx], now);
      
      // Add subtle harmony chime every 2 beats
      if (step % 2 === 0) {
        playHarpNote(notes[(noteIdx + 2) % notes.length], now + 0.15);
      }
      step++;
    }, 420);
  }

  function stopAmbientMusic() {
    if (sequenceInterval) {
      clearInterval(sequenceInterval);
      sequenceInterval = null;
    }
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isPlaying = !isPlaying;
      if (isPlaying) {
        startAmbientMusic();
        toggleBtn.classList.add('playing');
        if (soundWaves) soundWaves.style.display = 'flex';
        if (tooltip) tooltip.textContent = 'Ambient Music: Playing';
      } else {
        stopAmbientMusic();
        toggleBtn.classList.remove('playing');
        if (soundWaves) soundWaves.style.display = 'none';
        if (tooltip) tooltip.textContent = 'Play Romantic Music';
      }
    });
  }
}

/* ==========================================================================
   4. BANK DETAILS ONE-CLICK CLIPBOARD COPY (DUAL ACCOUNTS)
   ========================================================================== */
function initBankCopy() {
  const copyButtons = document.querySelectorAll('.btn-copy-account');

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target') || 'accountNumberDigits';
      const targetName = btn.getAttribute('data-name') || 'Account';
      const accountEl = document.getElementById(targetId);

      if (accountEl) {
        const textToCopy = accountEl.textContent.trim().replace(/\s+/g, '');
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`✓ ${targetName}'s Account Number (${textToCopy}) Copied!`);
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span>Copied!</span>';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2200);
        }).catch(err => {
          showToast(`Account Number: ${textToCopy}`);
        });
      }
    });
  });
}

/* ==========================================================================
   5. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>${message}</span>`;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 3500);
}

/* ==========================================================================
   6. INTERACTIVE RSVP FORM & GOOGLE SHEETS INTEGRATION
   ========================================================================== */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyjRDZKqzFD7p1zDQG9EEU2bOBcFP0DftYEkHJ4n0BAuCyFvYILQtG6X03HHG9u6JMd/exec';

function initRSVPForm() {
  const form = document.getElementById('weddingRsvpForm');
  const successState = document.querySelector('.rsvp-success-state');
  const guestNameConfirm = document.getElementById('guestNameConfirm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('rsvpFullName').value.trim();
      const phone = document.getElementById('rsvpPhone').value.trim();
      const email = document.getElementById('rsvpEmail').value.trim();
      const attendance = document.querySelector('input[name="attendance"]:checked')?.value || 'Attending';
      const message = document.getElementById('rsvpMessage').value.trim();

      if (!fullName) {
        showToast('Please enter your full name');
        return;
      }

      const submitBtn = form.querySelector('.btn-submit-rsvp');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Submit RSVP Response';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Saving your RSVP...</span>';
      }

      // Save to localStorage as backup
      const rsvps = JSON.parse(localStorage.getItem('chinenye_tonna_rsvps') || '[]');
      rsvps.push({
        fullName,
        phone,
        email,
        attendance,
        message,
        date: new Date().toISOString()
      });
      localStorage.setItem('chinenye_tonna_rsvps', JSON.stringify(rsvps));

      // Build parameters for Google Apps Script Web App
      const params = new URLSearchParams();
      params.append('fullName', fullName);
      params.append('phone', phone);
      params.append('email', email);
      params.append('attendance', attendance);
      params.append('message', message);

      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        mode: 'no-cors'
      })
      .then(() => {
        finalizeRSVP(fullName);
      })
      .catch((err) => {
        console.warn('Network submission notice:', err);
        finalizeRSVP(fullName);
      });

      function finalizeRSVP(name) {
        launchConfetti();
        if (guestNameConfirm) guestNameConfirm.textContent = name;
        form.style.display = 'none';
        if (successState) successState.classList.add('active');
        showToast('✓ RSVP confirmed and saved to guestlist!');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }
      }
    });
  }
}

/* Confetti Particles on RSVP */
function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.id = 'confettiCanvas';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiColors = ['#CC7A8D', '#556B2F', '#D4AF37', '#FAF0F2', '#E4A6B3'];
  const particles = [];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 50,
      size: Math.random() * 8 + 4,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 3,
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 5
    });
  }

  let animationFrame;
  let startTime = Date.now();

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allFinished = true;

    particles.forEach(p => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
      ctx.restore();

      if (p.y < canvas.height + 50) {
        allFinished = false;
      }
    });

    if (!allFinished && Date.now() - startTime < 5000) {
      animationFrame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrame);
      canvas.remove();
    }
  }

  render();
}

/* ==========================================================================
   7. CALENDAR INTEGRATION (Google Calendar & .ics Download)
   ========================================================================== */
window.addToGoogleCalendar = function() {
  const title = encodeURIComponent("Chinenye & Tonna's Wedding");
  const details = encodeURIComponent("The Holy Matrimony of Chinenye & Tonna. The Families of Amazu & Igwegbe invite you. Strictly By Invitation. Kindly Note: No Kids Please. Colour of the Day: Rose Pink & Deep Olive.");
  const location = encodeURIComponent("Abuja, Nigeria");
  // November 29, 2026, 12:00 PM WAT is 11:00 AM UTC
  const startTime = "20261129T110000Z";
  const endTime = "20261129T180000Z";

  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;
  window.open(url, '_blank');
};

window.downloadICSFile = function() {
  const icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Chinenye and Tonna Wedding//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
SUMMARY:Chinenye & Tonna's Wedding
DESCRIPTION:The Holy Matrimony of Chinenye & Tonna. The Families of Amazu & Igwegbe invite you. Strictly By Invitation. Kindly Note: No Kids Please. Colour of the Day: Rose Pink & Deep Olive.
LOCATION:Abuja, Nigeria
DTSTART:20261129T110000Z
DTEND:20261129T180000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'Chinenye_Tonna_Wedding.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  showToast('Calendar invite downloaded!');
};

/* ==========================================================================
   8. LIGHTBOX MODAL FOR PHYSICAL CARD PREVIEW
   ========================================================================== */
function initLightbox() {
  const trigger = document.getElementById('openCardModalBtn');
  const triggerAlt = document.getElementById('openCardModalBtn2');
  const modal = document.getElementById('cardModalLightbox');
  const closeBtn = document.getElementById('closeModalBtn');

  function openModal() {
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (trigger) trigger.addEventListener('click', openModal);
  if (triggerAlt) triggerAlt.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ==========================================================================
   9. MOBILE GIFTS HORIZONTAL SWIPE & TABS
   Handles seamless horizontal switching between Bride & Groom accounts
   ========================================================================== */
function initGiftsMobileCarousel() {
  const container = document.getElementById('giftsContainer');
  const cardBride = document.getElementById('cardBride');
  const cardGroom = document.getElementById('cardGroom');
  const tabBride = document.getElementById('tabBride');
  const tabGroom = document.getElementById('tabGroom');
  const dotBride = document.getElementById('dotBride');
  const dotGroom = document.getElementById('dotGroom');

  if (!container || !cardBride || !cardGroom) return;

  function setActive(account) {
    if (account === 'bride') {
      if (tabBride) tabBride.classList.add('active');
      if (tabGroom) tabGroom.classList.remove('active');
      if (dotBride) dotBride.classList.add('active');
      if (dotGroom) dotGroom.classList.remove('active');
      cardBride.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    } else {
      if (tabGroom) tabGroom.classList.add('active');
      if (tabBride) tabBride.classList.remove('active');
      if (dotGroom) dotGroom.classList.add('active');
      if (dotBride) dotBride.classList.remove('active');
      cardGroom.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }

  if (tabBride) {
    tabBride.addEventListener('click', (e) => {
      e.preventDefault();
      setActive('bride');
    });
  }

  if (tabGroom) {
    tabGroom.addEventListener('click', (e) => {
      e.preventDefault();
      setActive('groom');
    });
  }

  // Detect user touch scroll/swipe on mobile and update active tabs and indicator dots
  let scrollTimeout = null;
  container.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = cardBride.offsetWidth;
      if (scrollLeft > cardWidth / 2) {
        if (tabGroom) tabGroom.classList.add('active');
        if (tabBride) tabBride.classList.remove('active');
        if (dotGroom) dotGroom.classList.add('active');
        if (dotBride) dotBride.classList.remove('active');
      } else {
        if (tabBride) tabBride.classList.add('active');
        if (tabGroom) tabGroom.classList.remove('active');
        if (dotBride) dotBride.classList.add('active');
        if (dotGroom) dotGroom.classList.remove('active');
      }
    }, 50);
  }, { passive: true });
}

