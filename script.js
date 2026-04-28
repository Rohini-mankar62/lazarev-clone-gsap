// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/**
 * 1. LOCOMOTIVE SCROLL SETUP
 */
const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true,
  tablet: { smooth: true },
  smartphone: { smooth: true }
});

// Update ScrollTrigger when Locomotive scrolls
locoScroll.on("scroll", ScrollTrigger.update);

// Link ScrollTrigger to Locomotive Scroll container
ScrollTrigger.scrollerProxy("#main", {
  scrollTop(value) {
    return arguments.length
      ? locoScroll.scrollTo(value, 0, 0)
      : locoScroll.scroll.instance.scroll.y;
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };
  },
  // Handles pinType for Locomotive
  pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
});

// Refresh Locomotive after ScrollTrigger refreshes
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
ScrollTrigger.refresh();

/**
 * 2. ANIMATION FUNCTIONS
 */

function navAnimation() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  nav.addEventListener("mouseenter", function () {
    let tl = gsap.timeline();
    tl.to("#nav-button", { height: "21vh", duration: 0.3 })
      .to(".nav-part2 h5", { display: "block" }, "<")
      .from(".nav-part2 h5 span", {
        y: 25,
        stagger: { amount: 0.6 }
      });
  });

  nav.addEventListener("mouseleave", function () {
    let tl = gsap.timeline();
    tl.to(".nav-part2 h5 span", { y: 25, stagger: { amount: 0.2 } })
      .to(".nav-part2 h5", { display: "none", duration: 0.1 })
      .to("#nav-button", { height: 0, duration: 0.2 });
  });
}

function page2Animation() {
  const rightElems = document.querySelectorAll(".right-elem");
  rightElems.forEach(function (elem) {
    elem.addEventListener("mouseenter", function () {
      gsap.to(elem.childNodes[3], { opacity: 1, scale: 1 });
    });
    elem.addEventListener("mouseleave", function () {
      gsap.to(elem.childNodes[3], { opacity: 0, scale: 0 });
    });
    elem.addEventListener("mousemove", function (dets) {
      gsap.to(elem.childNodes[3], {
        x: dets.x - elem.getBoundingClientRect().x - 90,
        y: dets.y - elem.getBoundingClientRect().y - 215
      });
    });
  });
}

function videoControl() {
  const video = document.getElementById("myVideo");
  const overlay = document.getElementById("overlay");
  if (!video) return;

  video.addEventListener("click", function () {
    if (video.paused) { 
      video.play(); 
    } else { 
      video.pause(); 
    }
    gsap.to(video, { scale: 1, opacity: 1, borderRadius: "30px", duration: 0.5 });
  });

  video.onended = () => { if (overlay) overlay.style.display = "flex"; };
}

function sectionVideoHover() {
  const selections = document.querySelectorAll(".sec-right");
  selections.forEach(function (elem) {
    const video = elem.querySelector("video");
    if (!video) return;
    elem.addEventListener("mouseenter", () => { 
      video.style.opacity = 1; 
      video.play(); 
    });
    elem.addEventListener("mouseleave", () => { 
      video.style.opacity = 0; 
      video.pause(); 
      video.currentTime = 0; 
    });
  });
}

function page6Animations() {
  gsap.from("#btm6-part2 h4", {
    x: -100,
    opacity: 0,
    stagger: 0.2,
    scrollTrigger: {
      trigger: "#btm6-part2",
      scroller: "#main",
      start: "top 80%",
      end: "top 20%",
      scrub: true
    }
  });
}

/**
 * 3. INITIALIZE & ENTRY LOADING ANIMATION
 */
function init() {
  // Call all behavior functions
  navAnimation();
  page2Animation();
  videoControl();
  sectionVideoHover();
  page6Animations();

  // Master Entry Timeline
  var tl = gsap.timeline();

  // Step 1: Initial fade-in of Page 1
  tl.from("#page1", {
    opacity: 0,
    duration: 0.3,
    delay: 0.2
  })
  // Step 2: The "Opening" expansion with correct ease and timing
  .from("#page1", {
    transform: "scaleX(0.7) scaleY(0.2) translateY(80%)",
    borderRadius: "100px",
    duration: 2,
    ease: "expo.out" // Must be a string
  })
  // Step 3: Navbar appears smoothly during the expansion
  .from("nav", {
    opacity: 0,
    duration: 0.5
  }, "-=1.5") // Overlaps by 1.5s for fluid motion
  // Step 4: Staggered entrance for headings and paragraphs
  .from("#page1 h1, #page1 p, #page1 div", {
    opacity: 0,
    stagger: 0.2,
    duration: 0.5
  }, "-=1");
}

// Start everything when the window is fully loaded
window.addEventListener("load", init);