// quitzZ App Landing Page Interactivity

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initGlobalImpactCounter();
  initCalculator();
  initCravingBreaker();
  initStatsCounter();
  initFaqAccordion();
});

/* -------------------------------------------------------------
 * 1. Mobile Navbar Toggle & Smooth Scroll
 * ----------------------------------------------------------- */
function initNavbar() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
      mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
      mobileMenu.classList.toggle('hidden');
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Smooth scroll offset adjustment for fixed navbar
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = 80;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* -------------------------------------------------------------
 * 2. Live Savings & Health Interactive ROI Engine Calculator
 * ----------------------------------------------------------- */
function initCalculator() {
  const sticksSlider = document.getElementById('calc-sticks');
  const sticksNum = document.getElementById('calc-sticks-num');
  const priceSlider = document.getElementById('calc-price');
  const priceNum = document.getElementById('calc-price-num');

  const stickPresets = document.querySelectorAll('.stick-preset');
  const pricePresets = document.querySelectorAll('.price-preset');

  const monthlySavingsEl = document.getElementById('calc-monthly-savings');
  const yearlySavingsEl = document.getElementById('calc-yearly-savings');
  const fiveYearSavingsEl = document.getElementById('calc-5yr-savings');
  const fiveYearInvestedEl = document.getElementById('calc-5yr-invested');
  const lifeRegainedEl = document.getElementById('calc-life-regained');
  const cigarettesAvoidedEl = document.getElementById('calc-cigs-avoided');
  const dailyCostNoteEl = document.getElementById('calc-daily-cost-note');

  const milestone6mEl = document.getElementById('milestone-6m');
  const milestone12mEl = document.getElementById('milestone-12m');
  const milestone3yEl = document.getElementById('milestone-3y');

  function calculate() {
    let sticks = parseInt(sticksSlider ? sticksSlider.value : (sticksNum ? sticksNum.value : 12), 10);
    if (isNaN(sticks) || sticks < 1) sticks = 1;

    let pricePerStick = parseFloat(priceSlider ? priceSlider.value : (priceNum ? priceNum.value : 18));
    if (isNaN(pricePerStick) || pricePerStick < 1) pricePerStick = 1;

    // Sync input controls
    if (sticksSlider && parseInt(sticksSlider.value, 10) !== sticks) sticksSlider.value = sticks;
    if (sticksNum && parseInt(sticksNum.value, 10) !== sticks) sticksNum.value = sticks;

    if (priceSlider && parseFloat(priceSlider.value) !== pricePerStick) priceSlider.value = pricePerStick;
    if (priceNum && parseFloat(priceNum.value) !== pricePerStick) priceNum.value = pricePerStick;

    // Financial math
    const dailyCost = sticks * pricePerStick;
    const monthlySavings = dailyCost * 30;
    const yearlySavings = dailyCost * 365;
    const fiveYearSavings = yearlySavings * 5;
    const sixMonthsSavings = dailyCost * 180;
    const threeYearsSavings = yearlySavings * 3;

    // 5-Year Investment compounding SIP formula (Monthly SIP at 12% p.a. -> 1% monthly r, n = 60)
    // FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    const monthlyRate = 0.01;
    const numMonths = 60;
    const sipFutureValue = monthlySavings * ((Math.pow(1 + monthlyRate, numMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    const sipLakhs = (sipFutureValue / 100000).toFixed(1);

    // Biological life math (~11 mins per cigarette)
    const minutesSavedPerYear = sticks * 365 * 11;
    const daysRegainedPerYear = (minutesSavedPerYear / (60 * 24)).toFixed(1);
    const cigsAvoidedYearly = (sticks * 365).toLocaleString('en-IN');

    // Update Output Cards in DOM
    if (monthlySavingsEl) monthlySavingsEl.textContent = '₹' + Math.round(monthlySavings).toLocaleString('en-IN');
    if (yearlySavingsEl) yearlySavingsEl.textContent = '₹' + Math.round(yearlySavings).toLocaleString('en-IN');
    if (fiveYearSavingsEl) fiveYearSavingsEl.textContent = '₹' + Math.round(fiveYearSavings).toLocaleString('en-IN');
    if (fiveYearInvestedEl) fiveYearInvestedEl.textContent = '₹' + sipLakhs + ' Lakhs';
    if (lifeRegainedEl) lifeRegainedEl.textContent = daysRegainedPerYear + ' Days';
    if (cigarettesAvoidedEl) cigarettesAvoidedEl.textContent = cigsAvoidedYearly + ' sticks';
    if (dailyCostNoteEl) dailyCostNoteEl.textContent = '₹' + Math.round(dailyCost).toLocaleString('en-IN');

    if (milestone6mEl) milestone6mEl.textContent = '₹' + Math.round(sixMonthsSavings).toLocaleString('en-IN');
    if (milestone12mEl) milestone12mEl.textContent = '₹' + Math.round(yearlySavings).toLocaleString('en-IN');
    if (milestone3yEl) milestone3yEl.textContent = '₹' + Math.round(threeYearsSavings).toLocaleString('en-IN');

    // Highlight matching preset chips
    stickPresets.forEach(btn => {
      const val = parseInt(btn.getAttribute('data-val'), 10);
      if (val === sticks) {
        btn.className = 'stick-preset text-[11px] px-2.5 py-1 rounded-lg bg-[#84CC16]/20 border border-[#84CC16]/40 text-[#84CC16] font-bold transition-colors';
      } else {
        btn.className = 'stick-preset text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-[#84CC16]/20 border border-neutral-800 text-neutral-300 hover:text-[#84CC16] transition-colors';
      }
    });

    pricePresets.forEach(btn => {
      const val = parseFloat(btn.getAttribute('data-val'));
      if (val === pricePerStick) {
        btn.className = 'price-preset text-[11px] px-2.5 py-1 rounded-lg bg-neutral-800 border border-neutral-600 text-white font-bold transition-colors';
      } else {
        btn.className = 'price-preset text-[11px] px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-white transition-colors';
      }
    });
  }

  // Event Listeners for Sticks (Slider + Manual Input)
  if (sticksSlider) {
    sticksSlider.addEventListener('input', () => {
      if (sticksNum) sticksNum.value = sticksSlider.value;
      calculate();
    });
  }
  if (sticksNum) {
    sticksNum.addEventListener('input', () => {
      if (sticksSlider) sticksSlider.value = sticksNum.value;
      calculate();
    });
  }

  // Event Listeners for Price (Slider + Manual Input)
  if (priceSlider) {
    priceSlider.addEventListener('input', () => {
      if (priceNum) priceNum.value = priceSlider.value;
      calculate();
    });
  }
  if (priceNum) {
    priceNum.addEventListener('input', () => {
      if (priceSlider) priceSlider.value = priceNum.value;
      calculate();
    });
  }

  // Preset Chips Listeners
  stickPresets.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      if (sticksSlider) sticksSlider.value = val;
      if (sticksNum) sticksNum.value = val;
      calculate();
    });
  });

  pricePresets.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      if (priceSlider) priceSlider.value = val;
      if (priceNum) priceNum.value = val;
      calculate();
    });
  });

  calculate(); // Run immediately on load
}

/* -------------------------------------------------------------
 * 3. 60-Second Craving Breaker Interactive Simulator
 * ----------------------------------------------------------- */
function initCravingBreaker() {
  const startBtn = document.getElementById('craving-start-btn');
  const resetBtn = document.getElementById('craving-reset-btn');
  const timerText = document.getElementById('craving-timer');
  const instructionText = document.getElementById('craving-instruction');
  const cycleSubtext = document.getElementById('craving-subtext');
  const circleVisual = document.getElementById('craving-circle');
  const rewardModal = document.getElementById('craving-reward');

  let countdown = 60;
  let timerInterval = null;
  let cycleInterval = null;
  let isRunning = false;

  function runBreathingCycle() {
    const phases = [
      { name: 'inhale', text: 'Breathe In Deeply...', sub: 'Fill your lungs with clean oxygen', css: 'breathing-inhale', duration: 4000 },
      { name: 'hold', text: 'Hold Your Breath...', sub: 'Feel your nervous system calm down', css: 'breathing-hold', duration: 4000 },
      { name: 'exhale', text: 'Slowly Exhale...', sub: 'Release tension and dissolve the craving', css: 'breathing-exhale', duration: 4000 }
    ];

    let phaseIndex = 0;

    function nextPhase() {
      if (!isRunning) return;
      const phase = phases[phaseIndex];

      if (instructionText) instructionText.textContent = phase.text;
      if (cycleSubtext) cycleSubtext.textContent = phase.sub;

      if (circleVisual) {
        circleVisual.className = 'breathing-circle-outer w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-[#84CC16]/40 flex flex-col items-center justify-center relative shadow-lg bg-neutral-950/80 ' + phase.css;
      }

      phaseIndex = (phaseIndex + 1) % phases.length;
      cycleInterval = setTimeout(nextPhase, phase.duration);
    }

    nextPhase();
  }

  function startSession() {
    if (isRunning) {
      pauseSession();
      return;
    }

    isRunning = true;
    if (startBtn) {
      startBtn.innerHTML = '<i data-lucide="pause" class="w-5 h-5 inline mr-1.5"></i> Pause';
    }
    if (window.lucide) lucide.createIcons();

    if (countdown === 60) {
      if (rewardModal) rewardModal.classList.add('hidden');
    }

    runBreathingCycle();

    timerInterval = setInterval(() => {
      countdown--;
      if (timerText) timerText.textContent = countdown + 's';

      if (countdown <= 0) {
        completeSession();
      }
    }, 1000);
  }

  function pauseSession() {
    isRunning = false;
    clearInterval(timerInterval);
    clearTimeout(cycleInterval);
    if (startBtn) {
      startBtn.innerHTML = '<i data-lucide="play" class="w-5 h-5 inline mr-1.5"></i> Resume';
    }
    if (instructionText) instructionText.textContent = 'Session Paused';
    if (cycleSubtext) cycleSubtext.textContent = 'Click resume to continue calming your mind';
    if (window.lucide) lucide.createIcons();
  }

  function resetSession() {
    isRunning = false;
    clearInterval(timerInterval);
    clearTimeout(cycleInterval);
    countdown = 60;
    if (timerText) timerText.textContent = '60s';
    if (instructionText) instructionText.textContent = 'Ready to crush the urge?';
    if (cycleSubtext) cycleSubtext.textContent = 'Click below to begin the 4-4-4 anti-craving cycle';
    if (startBtn) {
      startBtn.innerHTML = '<i data-lucide="wind" class="w-5 h-5 inline mr-1.5"></i> Start 60s Craving Reset';
      if (window.lucide) lucide.createIcons();
    }
    if (circleVisual) {
      circleVisual.className = 'breathing-circle-outer w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-[#84CC16]/40 flex flex-col items-center justify-center relative shadow-lg bg-neutral-950/80';
    }
    if (rewardModal) rewardModal.classList.add('hidden');
  }

  function completeSession() {
    resetSession();
    if (rewardModal) {
      rewardModal.classList.remove('hidden');
      rewardModal.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  if (startBtn) startBtn.addEventListener('click', startSession);
  if (resetBtn) resetBtn.addEventListener('click', resetSession);
}

/* -------------------------------------------------------------
 * 4. Animated Stats Counter (Intersection Observer)
 * ----------------------------------------------------------- */
function initStatsCounter() {
  const statElements = document.querySelectorAll('.counter-val');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statElements.forEach(el => {
          const target = parseInt(el.getAttribute('data-target'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          const prefix = el.getAttribute('data-prefix') || '';
          const duration = 1800;
          const frameDuration = 1000 / 60;
          const totalFrames = Math.round(duration / frameDuration);
          let frame = 0;

          const counter = setInterval(() => {
            frame++;
            const progress = frame / totalFrames;
            const currentVal = Math.round(target * (1 - Math.pow(1 - progress, 3)));
            el.textContent = prefix + currentVal.toLocaleString('en-IN') + suffix;

            if (frame >= totalFrames) {
              clearInterval(counter);
              el.textContent = prefix + target.toLocaleString('en-IN') + suffix;
            }
          }, frameDuration);
        });
      }
    });
  }, { threshold: 0.2 });

  const statsSection = document.getElementById('stats-section');
  if (statsSection) observer.observe(statsSection);
}



/* -------------------------------------------------------------
 * 6. FAQ Accordion
 * ----------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const button = item.querySelector('.faq-btn');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (button && content) {
      button.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');
        
        // Close other open accordions
        document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
        document.querySelectorAll('.faq-icon').forEach(i => i.classList.remove('rotate-180'));

        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) icon.classList.add('rotate-180');
        }
      });
    }
  });
}

/* -------------------------------------------------------------
 * 7. Global Impact Live Real-Time Cigarettes Counter (175,000/sec)
 * ----------------------------------------------------------- */
function initGlobalImpactCounter() {
  const section = document.getElementById('global-impact');
  const counterEl = document.getElementById('live-global-counter');
  const smokersEl = document.getElementById('stat-smokers-val');
  const deathsEl = document.getElementById('stat-deaths-val');

  if (!section || !counterEl) return;

  let hasStarted = false;
  let startTime = null;

  function startCounter() {
    if (hasStarted) return;
    hasStarted = true;
    startTime = performance.now();

    // 1. Continuous live counter updating every 150ms at 175,000 cigarettes per second
    const ratePerSecond = 175000;
    
    setInterval(() => {
      const elapsedSeconds = (performance.now() - startTime) / 1000;
      const currentCount = Math.floor(elapsedSeconds * ratePerSecond);
      counterEl.textContent = currentCount.toLocaleString('en-US');
    }, 150);

    // 2. Smooth count-up animation for supporting stats
    if (smokersEl) {
      animateValue(smokersEl, 0, 1.1, 1800, (v) => v.toFixed(1) + ' Billion+');
    }
    if (deathsEl) {
      animateValue(deathsEl, 0, 8, 1800, (v) => Math.round(v) + ' Million+');
    }
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter();
      }
    });
  }, { threshold: 0.05 });

  observer.observe(section);

  // Fallback trigger if hero is already in viewport on load
  setTimeout(() => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom >= 0) {
      startCounter();
    }
  }, 100);
}

function animateValue(element, start, end, duration, formatter) {
  const frameDuration = 1000 / 60;
  const totalFrames = Math.round(duration / frameDuration);
  let frame = 0;

  const timer = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    // Ease-out cubic
    const current = start + (end - start) * (1 - Math.pow(1 - progress, 3));
    element.textContent = formatter(current);

    if (frame >= totalFrames) {
      clearInterval(timer);
      element.textContent = formatter(end);
    }
  }, frameDuration);
}
