(function () {
  "use strict";

  // Adapted from pxpush/ux.html's "7.2 Sticky stacking cards" demo, with
  // two deliberate changes:
  //
  // 1. ux.html hardcodes each card's `top` as a fixed 18px step (its cards
  //    are a fixed 320px tall). Our cards vary in height (description
  //    length differs per project), so the stagger is computed here instead
  //    — each card's `top` is the previous card's `top` plus ~1/5 of the
  //    PREVIOUS card's own natural height. That's what keeps each covered
  //    card's meta+title (the top ~20% of it) peeking out above the card
  //    that stacks over it, instead of hiding it completely.
  //
  // 2. ux.html's shrink loop only compares cards 1..N-1 against the NEXT
  //    card's position, so the last card never has a "next" to shrink
  //    against — it just stays full-size on top of the whole shrunk pile
  //    for the rest of the scroll. Here the last card shrinks against the
  //    list's own bottom edge instead, so it eases away the same way the
  //    others do rather than permanently covering everything below it.

  var list = document.getElementById("workList");
  if (!list) return;

  var cards = Array.prototype.slice.call(list.querySelectorAll(".work__itemCard"));
  if (!cards.length) return;

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  var BASE_TOP = 280;
  var PEEK_RATIO = 0.2;

  function layoutStack() {
    var top = BASE_TOP;
    cards.forEach(function (card) {
      card.style.top = top + "px";
      // offsetHeight is the card's own laid-out height, unaffected by the
      // scale transform updateStack() applies — safe to measure even mid-scroll.
      top += card.offsetHeight * PEEK_RATIO;
    });
  }

  function updateStack() {
    var vh = window.innerHeight;
    var listBottom = list.getBoundingClientRect().bottom;

    cards.forEach(function (card, i) {
      var stickTop = parseFloat(card.style.top) || 0;
      var referenceTop = i < cards.length - 1 ? cards[i + 1].getBoundingClientRect().top : listBottom;
      var p = clamp(1 - (referenceTop - stickTop) / (vh - stickTop), 0, 1);
      card.style.transform = "scale(" + (1 - p * 0.05) + ")";
    });
  }

  layoutStack();
  updateStack();

  window.addEventListener("scroll", updateStack, { passive: true });

  var resizeTimer = null;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      layoutStack();
      updateStack();
    }, 150);
  });
})();
