(function () {
  "use strict";

  // ---------- typewriter (intro bio line) ----------
  // Adapted from pxpush/ux.html's typewriter demo, sped up for a full paragraph
  // instead of a short rotating tagline: types once, no delete/loop.
  var introEl = document.getElementById("introTyped");
  if (introEl) {
    var fullText = introEl.textContent;
    introEl.textContent = "";
    introEl.classList.add("is-typing");
    var i = 0;
    function typeTick() {
      i++;
      introEl.textContent = fullText.slice(0, i);
      if (i < fullText.length) {
        setTimeout(typeTick, 14);
      } else {
        setTimeout(function () {
          introEl.classList.remove("is-typing");
        }, 900);
      }
    }
    typeTick();
  }

  // ---------- text scramble / decode ----------
  // Adapted from pxpush/ux.html's "5. Text scramble / decode" demo.
  var SCR_CHARS = "!<>-_\\/[]{}=+*^?#@%&";

  function runScramble(el, onDone) {
    var text = el.textContent;
    var frame = 0;
    var timer = setInterval(function () {
      var out = "";
      for (var i = 0; i < text.length; i++) {
        if (text[i] === " ") {
          out += " ";
          continue;
        }
        if (frame >= i * 2 + 8) {
          out += text[i];
        } else {
          out += '<span class="scr">' + SCR_CHARS[Math.floor(Math.random() * SCR_CHARS.length)] + "</span>";
        }
      }
      el.innerHTML = out;
      frame++;
      if (frame > text.length * 2 + 10) {
        clearInterval(timer);
        el.textContent = text;
        if (onDone) onDone();
      }
    }, 28);
  }

  var headlineScrambles = document.querySelectorAll(".hero__headline .scramble");
  headlineScrambles.forEach(function (el, index) {
    setTimeout(function () {
      runScramble(el);
    }, index * 350);
  });
})();
