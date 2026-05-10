const splitTextAvailable = typeof SplitText !== 'undefined';
if (splitTextAvailable) {
  gsap.registerPlugin(ScrollTrigger, SplitText);
} else {
  gsap.registerPlugin(ScrollTrigger);
  console.warn('hb-gsap-fx: SplitText not found — text split animations will be skipped. Get it at gsap.com/club');
}

const hbFXDefaults = {
  duration:       0.6,
  stagger:        0.05,
  delay:          0,
  ease:           'power2.out',
  start:          'top 90%',
  toggleActions:  'play none none reverse',
  blur:           '8',
  distance:       10,
  scaleUp:        0.6,
  scaleDown:      1.4,
  rotation:       -90,
  mobileBreakpoint: 768,
  pinStart:       'top top',
  pinEnd:         '+=100%',
};

const hbFXPresets = {
  'fade-in': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  'scale-up': {
    from: { scale: hbFXDefaults.scaleUp },
    to: { scale: 1 }
  },
  'scale-down': {
    from: { scale: hbFXDefaults.scaleDown },
    to: { scale: 1 }
  },
  'slide-in-left': {
    from: { x: -hbFXDefaults.distance },
    to: { x: 0 }
  },
  'slide-in-right': {
    from: { x: hbFXDefaults.distance },
    to: { x: 0 }
  },
  'slide-in-up': {
    from: { y: hbFXDefaults.distance },
    to: { y: 0 }
  },
  'slide-in-down': {
    from: { y: -hbFXDefaults.distance },
    to: { y: 0 }
  },
  'rotate': {
    from: { rotation: hbFXDefaults.rotation, opacity: 0 },
    to: { rotation: 0, opacity: 1 }
  },
  'blur-in': {
    from: { opacity: 0, filter: `blur(${hbFXDefaults.blur}px)` },
    to: { opacity: 1, filter: 'blur(0px)' }
  },
};

function isMobile() {
  return window.innerWidth <= hbFXDefaults.mobileBreakpoint;
}

function shouldRunStyle(el) {
  const styleStr = el.dataset.style || '';
  return !(isMobile() && styleStr.includes('mobile:off'));
}

function normalizeSplitTextWhitespace(el) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  textNodes.forEach(node => {
    node.nodeValue = node.nodeValue
      .replace(/\s*\n\s*/g, ' ')
      .replace(/\t+/g, ' ')
      .replace(/ {2,}/g, ' ');
  });
}

function revertSplitIfAny(el) {
  if (el && el._hbSplit && typeof el._hbSplit.revert === 'function') {
    try {
      el._hbSplit.revert();
    } catch (e) {
    }
    el._hbSplit = null;
  }
}

function animateHBGSAP(el) {
  if (!shouldRunStyle(el)) return;

  let targets = el;

  const classSplit = el.classList.contains('hb-split-chars') ? 'chars'
                    : el.classList.contains('hb-split-words') ? 'words'
                    : el.classList.contains('hb-split-lines') ? 'lines'
                    : null;

  const splitType = el.dataset.split || classSplit;

  if (splitType && ['chars', 'words', 'lines'].includes(splitType) && splitTextAvailable) {
    if (!el.querySelector('.char, .word, .line')) {
      normalizeSplitTextWhitespace(el);

      revertSplitIfAny(el);

      const split = new SplitText(el, {
        type: splitType,
        preserveWhitespace: true
      });

      el._hbSplit = split;

      targets = split[splitType];

      el.querySelectorAll('.hb-no-split .char, .hb-no-split .word, .hb-no-split .line').forEach(span => {
        const parent = span.parentNode;
        parent.replaceChild(document.createTextNode(span.textContent), span);
      });
    }
  }

  let fromVars = {};
  let toVars = [];

  let slideDistance = el.dataset.distance ? parseFloat(el.dataset.distance) : hbFXDefaults.distance;

  if (!slideDistance) {
    const distClass = Array.from(el.classList).find(cls =>
      cls.startsWith('hb-slide-distance-') &&
      !cls.startsWith('hb-slide-distance-x-') &&
      !cls.startsWith('hb-slide-distance-y-')
    );
    if (distClass) {
      slideDistance = parseFloat(distClass.replace('hb-slide-distance-', ''));
    }
  }

  let slideDistanceX = el.dataset.distanceX ? parseFloat(el.dataset.distanceX) : null;
  let slideDistanceY = el.dataset.distanceY ? parseFloat(el.dataset.distanceY) : null;

  if (slideDistanceX == null) {
    const distXClass = Array.from(el.classList).find(cls =>
      cls.startsWith('hb-slide-distance-x-')
    );
    if (distXClass) {
      slideDistanceX = parseFloat(distXClass.replace('hb-slide-distance-x-', ''));
    }
  }

  if (slideDistanceY == null) {
    const distYClass = Array.from(el.classList).find(cls =>
      cls.startsWith('hb-slide-distance-y-')
    );
    if (distYClass) {
      slideDistanceY = parseFloat(distYClass.replace('hb-slide-distance-y-', ''));
    }
  }

  let customScale = el.dataset.scale ? parseFloat(el.dataset.scale) : null;

  const effects = el.dataset.style
    ? el.dataset.style.split(' ')
    : Object.keys(hbFXPresets).filter(key =>
        el.classList.contains(`hb-${key}`)
      );

  effects.forEach(effect => {
    const key = effect.replace('hb-', '');
    const preset = hbFXPresets[key];

    if (preset) {
      const fromCopy = { ...preset.from };
      const toCopy = { ...preset.to };

      const isSlide =
        key.startsWith('slide-in-') ||
        key.startsWith('slide-');

      if (isSlide) {
        const isLeft  = /(^|-)left$/.test(key);
        const isRight = /(^|-)right$/.test(key);
        const isUp    = /(^|-)up$/.test(key);
        const isDown  = /(^|-)down$/.test(key);

        let axis = null;
        let isNegative = false;

        if (isLeft || isRight) {
          axis = 'x';
          isNegative = isLeft;
        } else if (isUp || isDown) {
          axis = 'y';
          isNegative = isDown;
        }

        if (axis) {
          const axisDist = axis === 'x'
            ? (slideDistanceX ?? slideDistance)
            : (slideDistanceY ?? slideDistance);

          if (axisDist != null && !isNaN(axisDist)) {
            fromCopy[axis] = isNegative ? -axisDist : axisDist;
            toCopy[axis] = 0;
          }
        }
      }

      if ((key === 'scale-up' || key === 'scale-down') && customScale != null && !isNaN(customScale)) {
        fromCopy.scale = customScale;
      }

      if (key === 'blur-in') {
        let blurAmount = el.dataset.blur || hbFXDefaults.blur;
        const blurClass = Array.from(el.classList).find(cls => cls.startsWith('hb-blur-'));
        if (blurClass) {
          blurAmount = blurClass.replace('hb-blur-', '');
        }
        fromCopy.filter = `blur(${blurAmount}px)`;
        toCopy.filter = 'blur(0px)';
      }

      Object.assign(fromVars, fromCopy);
      toVars.push(toCopy);
    }
  });

  const finalToVars = Object.assign({}, ...toVars);

  let ease = el.dataset.ease || hbFXDefaults.ease;
  const easeClass = Array.from(el.classList).find(cls =>
    cls.startsWith('hb-ease-')
  );
  if (easeClass) {
    ease = easeClass.replace('hb-ease-', '').replace(/-/g, '.');
  }

  const duration = el.dataset.duration ? parseFloat(el.dataset.duration) : hbFXDefaults.duration;
  const stagger = el.dataset.stagger ? parseFloat(el.dataset.stagger) : hbFXDefaults.stagger;
  const delay = el.dataset.delay ? parseFloat(el.dataset.delay) : hbFXDefaults.delay;

  gsap.set(targets, fromVars);

  gsap.to(targets, {
    ...finalToVars,
    scrollTrigger: {
      trigger: el,
      start: el.dataset.start || hbFXDefaults.start,
      toggleActions: el.dataset.toggle || hbFXDefaults.toggleActions
    },
    duration,
    stagger,
    delay,
    ease
  });
}

function initHBPin(root = document) {
  root.querySelectorAll('.hb-pin').forEach(el => {
    if (!el.dataset.hbPinned) {
      el.dataset.hbPinned = 'true';

      ScrollTrigger.create({
        trigger: el,
        start: el.dataset.pinStart || hbFXDefaults.pinStart,
        end: el.dataset.pinEnd || hbFXDefaults.pinEnd,
        pin: true,
        pinSpacing: false,
        scrub: el.dataset.pinScrub === 'true'
      });
    }
  });
}

function hasSplitType(el) {
  const classSplit = el.classList.contains('hb-split-chars') ? 'chars'
                   : el.classList.contains('hb-split-words') ? 'words'
                   : el.classList.contains('hb-split-lines') ? 'lines'
                   : null;
  const splitType = el.dataset.split || classSplit;
  return !!(splitType && ['chars', 'words', 'lines'].includes(splitType));
}

function initHBGSAPFX(root = document) {
  const splitEls = [];

  root.querySelectorAll('.hb-gsap-trigger').forEach(el => {
    if (!el.dataset.hbAnimated) {
      el.dataset.hbAnimated = 'true';
      if (hasSplitType(el)) {
        splitEls.push(el);
      } else {
        animateHBGSAP(el);
      }
    }
  });

  initHBPin(root);

  if (splitEls.length) {
    const fontsReady = (document.fonts && document.fonts.ready)
      ? document.fonts.ready
      : Promise.resolve();

    fontsReady.then(() => {
      splitEls.forEach(el => animateHBGSAP(el));
      ScrollTrigger.refresh();
    });
  }
}

function resetHBGSAPFX() {
  document.querySelectorAll('.hb-gsap-trigger').forEach(el => {
    revertSplitIfAny(el);
    delete el.dataset.hbAnimated;
  });

  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  initHBGSAPFX();
}

window.HBGSAPFX = {
  init: initHBGSAPFX,
  animate: animateHBGSAP,
  initPin: initHBPin,
  reset: resetHBGSAPFX
};

document.addEventListener('DOMContentLoaded', () => initHBGSAPFX());

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});

window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});
