(function () {
  "use strict";

  var hint = document.getElementById("workScrollHint");
  var target = document.querySelector(".work__listSection");
  if (!hint || !target) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        hint.classList.toggle("is-hidden", entry.isIntersecting);
      });
    },
    // Shrinks the root's bottom edge by 24px so "intersecting" only fires
    // once the list section has genuinely scrolled up into view, instead
    // of right when it's sitting exactly flush with the viewport's bottom
    // edge (0px of real overlap) — right at that boundary, browsers can
    // flip isIntersecting to true from rounding alone, hiding the hint
    // before the user has scrolled at all.
    { rootMargin: "0px 0px -24px 0px" }
  );

  observer.observe(target);
})();
