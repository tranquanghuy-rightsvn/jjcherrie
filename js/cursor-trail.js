(function () {
  "use strict";

  var STEP = 40;
  var FADE_MS = 2000;

  var lastX = null;
  var lastY = null;

  function spawnAt(x, y) {
    var square = document.createElement("div");
    square.className = "work__cursorTrail";
    square.style.left = x + "px";
    square.style.top = y + "px";
    document.body.appendChild(square);

    requestAnimationFrame(function () {
      square.classList.add("work__cursorTrail--fade");
    });

    setTimeout(function () {
      square.remove();
    }, FADE_MS);
  }

  document.addEventListener("mousemove", function (e) {
    if (lastX === null) {
      lastX = e.clientX;
      lastY = e.clientY;
      spawnAt(lastX, lastY);
      return;
    }

    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    var dist = Math.sqrt(dx * dx + dy * dy);

    // Divides the jump into equal steps ending exactly at the cursor's new
    // position (t goes all the way to 1) — the old floor()-based version
    // left a leftover sliver near the tip of every jump uncovered, which
    // added up to visible gaps along the trail.
    var steps = Math.max(1, Math.round(dist / STEP));
    for (var i = 1; i <= steps; i++) {
      var t = i / steps;
      spawnAt(lastX + dx * t, lastY + dy * t);
    }
    lastX = e.clientX;
    lastY = e.clientY;
  });
})();
