(function () {
  "use strict";

  // ---------- Lenis smooth/inertial scroll (the live site's biggest "feel" driver) ----------
  var lenis = null;
  if (window.Lenis) {
    lenis = new window.Lenis({
      duration: 1.2,
      easing: function (t) {
        return Math.min(1, 1.001 - Math.pow(2, -10 * t));
      },
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  function onScroll(cb) {
    if (lenis) lenis.on("scroll", cb);
    else window.addEventListener("scroll", cb, { passive: true });
  }

  // ---------- marquees ----------
  function buildMarquee(el, text, repeats) {
    if (!el) return;
    var unit = '<span><span class="sep">●</span> ' + text + "</span>";
    el.innerHTML = unit.repeat(repeats * 2);
  }

  buildMarquee(document.getElementById("heroMarquee"), "On–Demand Design Department", 4);
  buildMarquee(document.getElementById("introMarquee"), "PX PUSH", 6);
  buildMarquee(document.getElementById("packagesMarquee"), "Packages", 6);
  buildMarquee(document.getElementById("sprintMarquee"), "Brand Sprint", 5);

  // ---------- works showcase ----------
  var showcase = document.getElementById("worksShowcase");
  if (showcase) {
    var items = [];
    for (var i = 1; i <= 15; i++) items.push("images/work" + i + ".webp");
    for (var j = 1; j <= 15; j++) items.push("images/branding" + j + ".webp");
    showcase.innerHTML = items
      .map(function (src) {
        return '<div class="works__item" data-cursor="drag"><img src="' + src + '" alt="" loading="lazy" /></div>';
      })
      .join("");

    var isDown = false;
    var startX = 0;
    var startScroll = 0;
    showcase.addEventListener("mousedown", function (e) {
      isDown = true;
      showcase.classList.add("is-dragging");
      startX = e.pageX;
      startScroll = showcase.scrollLeft;
    });
    window.addEventListener("mouseup", function () {
      isDown = false;
      showcase.classList.remove("is-dragging");
    });
    window.addEventListener("mousemove", function (e) {
      if (!isDown) return;
      e.preventDefault();
      showcase.scrollLeft = startScroll - (e.pageX - startX);
    });
  }

  // ---------- header 3D mark: fade in once hero is scrolled past ----------
  var headerMark = document.getElementById("headerMark");
  var hero = document.getElementById("hero");
  if (headerMark && hero) {
    var io0 = new IntersectionObserver(
      function (entries) {
        headerMark.classList.toggle("is-visible", !entries[0].isIntersecting);
      },
      { rootMargin: "-80px 0px 0px 0px", threshold: 0 }
    );
    io0.observe(hero);
  }

  // ---------- mini video reveal ----------
  var miniVideo = document.getElementById("miniVideo");
  if (miniVideo) {
    var io1 = new IntersectionObserver(
      function (entries) {
        miniVideo.classList.toggle("is-visible", entries[0].isIntersecting);
      },
      { threshold: 0.3 }
    );
    io1.observe(document.getElementById("intro"));
  }

  // ---------- continuous scroll-progress opacity (replaces on/off snapping) ----------
  // Each element's opacity is driven by how far its center has travelled through
  // a band around the viewport middle, sampled every frame instead of toggled
  // by a single IntersectionObserver threshold, so it reads as a live reveal
  // instead of a hard on/off switch.
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function progressiveReveal(selector, opts) {
    var els = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!els.length) return;
    var bandStart = opts && opts.bandStart !== undefined ? opts.bandStart : 0.85;
    var bandEnd = opts && opts.bandEnd !== undefined ? opts.bandEnd : 0.4;
    var minOpacity = opts && opts.minOpacity !== undefined ? opts.minOpacity : 0.3;

    function update() {
      var vh = window.innerHeight;
      els.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        var center = rect.top + rect.height / 2;
        var ratio = center / vh; // 1 = just entering bottom, 0 = at top
        var t = clamp((bandStart - ratio) / (bandStart - bandEnd), 0, 1);
        var opacity = minOpacity + (1 - minOpacity) * t;
        el.style.opacity = String(opacity);
        el.classList.toggle("is-active", t > 0.5);
      });
    }

    onScroll(update);
    window.addEventListener("resize", update);
    update();
  }

  progressiveReveal(".reveal-text", { bandStart: 0.9, bandEnd: 0.45, minOpacity: 0.3 });
  progressiveReveal(".benefits__intro .word", { bandStart: 0.85, bandEnd: 0.5, minOpacity: 0.3 });
  progressiveReveal(".accordion__row", { bandStart: 0.95, bandEnd: 0.5, minOpacity: 0.35 });

  // ---------- pointer-parallax on the 3D placeholders (hero mark + pricing disk) ----------
  function addParallaxTilt(el, strength) {
    if (!el) return;
    var raf = null;
    document.addEventListener("mousemove", function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var dx = (e.clientX - cx) / window.innerWidth;
        var dy = (e.clientY - cy) / window.innerHeight;
        el.style.transform = "rotateY(" + dx * strength + "deg) rotateX(" + -dy * strength + "deg)";
        raf = null;
      });
    });
  }

  addParallaxTilt(document.querySelector(".hero__logo3d-mark"), 14);
  addParallaxTilt(document.querySelector(".pricing__disk"), 18);
  addParallaxTilt(document.querySelector(".header__mark"), 20);

  // ---------- custom cursor over interactive zones ----------
  var cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);
  var cursorLabel = document.createElement("span");
  cursor.appendChild(cursorLabel);

  var cx = 0,
    cy = 0,
    tx = 0,
    ty = 0;
  document.addEventListener("mousemove", function (e) {
    tx = e.clientX;
    ty = e.clientY;
  });
  (function tick() {
    cx += (tx - cx) * 0.2;
    cy += (ty - cy) * 0.2;
    cursor.style.transform = "translate(" + cx + "px," + cy + "px)";
    requestAnimationFrame(tick);
  })();

  document.querySelectorAll(".link-row a, .pkg__cta").forEach(function (el) {
    el.setAttribute("data-cursor", "view");
  });

  document.querySelectorAll("[data-cursor]").forEach(function (zone) {
    zone.addEventListener("mouseenter", function () {
      cursor.classList.add("is-active");
      cursorLabel.textContent = zone.getAttribute("data-cursor") === "drag" ? "DRAG" : "VIEW";
    });
    zone.addEventListener("mouseleave", function () {
      cursor.classList.remove("is-active");
    });
  });

  // ---------- mobile hamburger ----------
  var hamburger = document.querySelector(".hamburger");
  var nav = document.querySelector(".nav");
  if (hamburger && nav) {
    hamburger.addEventListener("click", function () {
      nav.classList.toggle("nav--open");
    });
  }
})();
