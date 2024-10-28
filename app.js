let controller;
let slideScene;
let pageScene;
const mouse = document.querySelector('.cursor');
const mouseTxt = mouse.querySelector('span');
const burger = document.querySelector('.burger');

function animateSlides() {
  // Init Controller
  controller = new ScrollMagic.Controller();
  // Select some things
  const sliders = document.querySelectorAll('.slide');
  const nav = document.querySelector('.nav-header');
  // Loop over each slide
  sliders.forEach((slide, index, slides) => {
    const revealImg = slide.querySelector('.reveal-img');
    const img = slide.querySelector('img');
    const revealText = slide.querySelector('.reveal-text');

    // ------------------ GSAP Animation 1 ------------------ //
    const slideTl = gsap.timeline({
      defaults: { duration: 1, ease: 'power2.inOut' }
    });
    slideTl.fromTo(revealImg, { x: '0%' }, { x: '100%' }); // from 0% to 100% of the width
    slideTl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1'); // -=1 means 1 second before the end of the animation so that both animations can run at the same time
    slideTl.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.75');

    // ------------------ Create Scroll Scene 1 ------------------ //
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false // if we don't want the animation to reverse when we scroll up
    })
      .setTween(slideTl) // setTween is a method that takes a timeline as an argument and applies it to the scene so that the animation runs when the scene is triggered
      .addIndicators({
        colorStart: 'white',
        colorTrigger: 'white',
        name: 'slide'
      })
      .addTo(controller);

    // ------------------ GSAP Animation 2 ------------------ //
    const pageTl = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1];
    // When scrolling to the next slide, the current slide will move up & fade out, and the next slide will move up & fade in at the same time
    pageTl.fromTo(nextSlide, { y: '0%' }, { y: '50%' });
    pageTl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTl.fromTo(nextSlide, { y: '50%' }, { y: '0%' }, '-=0.5');

    // ------------------ Create Scroll Scene 2 ------------------ //
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: '100%',
      triggerHook: 0
    })
      .setPin(slide, { pushFollowers: false })
      .setTween(pageTl)
      .addIndicators({
        colorStart: 'white',
        colorTrigger: 'white',
        name: 'page',
        indent: 200
      })
      .addTo(controller);
  });
}

function cursor(e) {
  mouse.style.top = e.pageY + 'px';
  mouse.style.left = e.pageX + 'px';
}

function activeCursor(e) {
  const item = e.target;

  // If the item is a link, the cursor will be a pointer
  if (item.id === 'logo' || item.classList.contains('burger')) {
    mouse.classList.add('nav-active');
  } else {
    mouse.classList.remove('nav-active');
  }

  // If the item is an explore link, the cursor will be a circle
  if (item.classList.contains('explore')) {
    mouse.classList.add('explore-active');
    mouseTxt.innerText = 'Tap';
    gsap.to('.title-swipe', 1, { y: '0%' }); // animate the title-swipe element to move up
  } else {
    mouse.classList.remove('explore-active');
    mouseTxt.innerText = '';
    gsap.to('.title-swipe', 1, { y: '100%' }); // animate the title-swipe element to move down
  }
}

function navToggle(e) {
  if (!e.target.classList.contains('active')) {
    e.target.classList.add('active');
    // Animate the burger menu by rotating the lines and changing the background color of the logo and the nav-bar
    gsap.to('.line1', 0.5, { rotate: '45', y: 5, background: 'black' });
    gsap.to('.line2', 0.5, { rotate: '-45', y: -5, background: 'black' });
    gsap.to('#logo', 1, { color: 'black' });
    gsap.to('.nav-bar', 1, { clipPath: 'circle(2500px at 100% -10%)' }); // Expanding the clipPath to reveal the nav-bar as it already has a clipPath of `circle(50px at 100% -10%)` in the CSS
    document.body.classList.add('hide'); // to disable scrolling when the nav-bar is open
  } else {
    e.target.classList.remove('active');
    gsap.to('.line1', 0.5, { rotate: '0', y: 0, background: 'white' });
    gsap.to('.line2', 0.5, { rotate: '0', y: 0, background: 'white' });
    gsap.to('#logo', 1, { color: 'white' });
    gsap.to('.nav-bar', 1, { clipPath: 'circle(50px at 100% -10%)' });
    document.body.classList.remove('hide'); // to enable scrolling when the nav-bar is closed
  }
}

// Barba Page Transitions
const logo = document.querySelector('#logo');
barba.init({
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        animateSlides(); // run the animateSlides function when entering the home page
        logo.href = './index.html'; // change the href of the logo to the home page
      },
      beforeLeave() {
        // Destroy the scroll magic scenes when leaving the home page to prevent memory leaks
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      }
    },
    {
      namespace: 'fashion',
      beforeEnter() {
        logo.href = '../index.html'; // change the href of the logo to the home
        gsap.fromTo('.nav-header', 1, { y: '-100%' }, { y: '0%', ease: 'power2.inOut' }); // animate the nav-header to move down
      },
      beforeLeave() {
        slideScene.destroy();
        pageScene.destroy();
        controller.destroy();
      }
    }
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        // An animation
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo('.swipe', 0.75, { x: '-100%' }, { x: '0%', onComplete: done }, '-=0.5');
      },
      enter({ current, next }) {
        let done = this.async(); // to tell Barba that the animation is done in the old page and it can move to the new page
        // Scroll to the top on page load
        window.scrollTo(0, 0);
        // An animation
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        tl.fromTo('.swipe', 1, { x: '0%' }, { x: '100%', stagger: 0.25, onComplete: done });
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
      }
    }
  ]
});

// Event Listeners
window.addEventListener('mousemove', cursor);
window.addEventListener('mouseover', activeCursor);
burger.addEventListener('click', navToggle);
