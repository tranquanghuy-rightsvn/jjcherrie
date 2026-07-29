(function () {
  "use strict";

  // The active pill can't just keep its per-role view-transition-name (e.g.
  // "nav-about") on every subpage, because that name sits at the exact same
  // docked-row slot on About/Work/Contact alike — matching it browser-side
  // would only ever cross-fade the color in place, never slide. But it also
  // can't just always switch to one shared "nav-current" name, because Home
  // has no such name at all (its 3 buttons are always green, no "current"
  // concept), so the shared name would arrive/leave unmatched there and
  // lose the fly-from-Home effect. Same element, two different desired
  // partners depending on which page is on the other end of the navigation
  // — CSS can't express that (view-transition-name is a single static
  // value), so this picks the right one at the moment it matters:
  //   - on load, based on where we just came FROM (document.referrer)
  //   - on click, based on where we're headed TO (the link being clicked)

  function isSubpagePath(pathname) {
    return /\/(about|work|contact)\/?(?:[?#]|$)/.test(pathname);
  }

  function currentButton() {
    return document.querySelector(".hero__nav .hero__navBtn:not(.hero__navBtn--plain)");
  }

  function useSharedNameOnLoad() {
    var ref = document.referrer;
    if (!ref) return;
    var refPath;
    try {
      refPath = new URL(ref).pathname;
    } catch (e) {
      return;
    }
    if (!isSubpagePath(refPath)) return;
    var el = currentButton();
    if (el) el.style.viewTransitionName = "nav-current";
  }

  if ("onpagereveal" in window) {
    window.addEventListener("pagereveal", useSharedNameOnLoad);
  } else {
    useSharedNameOnLoad();
  }

  document.querySelectorAll(".hero__nav a.hero__navBtn").forEach(function (link) {
    link.addEventListener("click", function () {
      var destPath;
      try {
        destPath = new URL(link.href, location.href).pathname;
      } catch (e) {
        return;
      }
      if (!isSubpagePath(destPath)) return;
      var el = currentButton();
      if (el) el.style.viewTransitionName = "nav-current";
    });
  });
})();
