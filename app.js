let controller;
let slideScene;
let pageScene;

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

animateSlides();
