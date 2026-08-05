(function () {
  "use strict";

  var modal = document.getElementById("workModal");
  if (!modal) return;

  var gallery = modal.querySelector(".work__modalGallery");
  var closeBtn = modal.querySelector(".work__modalClose");

  var cards = Array.prototype.slice.call(document.querySelectorAll(".work__itemCard"));

  // One image list per work item, in card order — every asset in each
  // images/webcontent/work NN folder, used in full.
  // Each list leads with the same image already used as that work's card
  // thumbnail (its "subject" shot), then the rest of that work's assets.
  var WORK_IMAGES = [
    [
      // w01 2/5/6 only exist in the main images/work 01 folder, not
      // duplicated into webcontent — same pattern as work04/work05's
      // extra assets. p01.jpg dropped per request.
      // Explicit layout: w01_1 + w01_4 paired in one row, the rest each
      // get their own full-width row.
      "../images/webcontent%20/work%2001/thumb.png",
      [
        "../images/webcontent%20/work%2001/w01%201.png",
        "../images/webcontent%20/work%2001/w01%204.png"
      ],
      "../images/work%2001/w01%202.png",
      "../images/work%2001/w01%205.png",
      "../images/work%2001/w01%206.png",
      "../images/webcontent%20/work%2001/w01.png"
    ],
    [
      "../images/webcontent%20/work%2002/uxui1%20mk4.png",
      "../images/webcontent%20/work%2002/uxui1%20mk2.png",
      "../images/webcontent%20/work%2002/uxui1%20mk5.png"
    ],
    [
      "../images/webcontent%20/work%2003%20/applie%20mockup2.png",
      "../images/webcontent%20/work%2003%20/aiw.png",
      "../images/webcontent%20/work%2003%20/applie%20mockup1.png"
    ],
    [
      // webcontent/work04 only has the thumbnail — its other 2 assets only
      // exist in the main images/work04 folder, not duplicated there.
      "../images/webcontent%20/work04/thumb.png",
      "../images/work04/ad%20mockup1.png",
      "../images/work04/w04.png"
    ],
    [
      // work05's card thumbnail (images/work 05/thumb.png) isn't one of the
      // webcontent assets — pulled in from its real location just to lead
      // the gallery, same as the others do with their own thumb. Same for
      // "branding mockup 3.png" — only exists in images/work 05, not
      // duplicated into webcontent.
      // Explicit layout here (an array entry = a paired row) instead of
      // the auto full/pair/pair grouping other works use: 1-2-1-1, with
      // logo innn + branding mockup 3 as the pair.
      "../images/work%2005/thumb.png",
      [
        "../images/webcontent%20/work%2005/logo%20innn-02-02.png",
        "../images/work%2005/branding%20mockup%203.png"
      ],
      "../images/webcontent%20/work%2005/w02%201.png",
      "../images/webcontent%20/work%2005/w02%202.png"
    ],
    [
      "../images/webcontent%20/work%2006/thumb.png",
      "../images/webcontent%20/work%2006/559.jpg",
      "../images/webcontent%20/work%2006/Free_Iphone_13_Pro_Mockup_2.png",
      "../images/webcontent%20/work%2006/w06.png"
    ]
  ];

  function appendImg(parent, src, alt) {
    var el = document.createElement("img");
    el.className = "work__modalImg";
    el.src = src;
    el.alt = alt;
    parent.appendChild(el);
  }

  function appendRow(srcs, alt) {
    var row = document.createElement("div");
    row.className = "work__modalImgRow";
    srcs.forEach(function (src) {
      appendImg(row, src, alt);
    });
    gallery.appendChild(row);
  }

  // Turns a flat image list into groups (a string = a full-width row, an
  // array of 2 = a paired half-width row): full, pair, full, pair... with
  // a trailing remainder of exactly 2 paired up instead of split into two
  // full-width rows in a row.
  function autoGroup(images) {
    var groups = [];
    var i = 0;
    while (i < images.length) {
      var remaining = images.length - i;
      if (remaining === 2) {
        groups.push(images.slice(i, i + 2));
        i += 2;
        continue;
      }

      groups.push(images[i]);
      i += 1;

      if (images.length - i >= 2) {
        groups.push(images.slice(i, i + 2));
        i += 2;
      }
    }
    return groups;
  }

  function buildGallery(alt, items) {
    gallery.innerHTML = "";
    // A work's list is either plain image paths (auto-grouped into
    // full/pair/pair) or already has some explicit paired rows baked in
    // (an array entry) — in that case use it exactly as given.
    var isExplicit = items.some(function (item) {
      return Array.isArray(item);
    });
    var groups = isExplicit ? items : autoGroup(items);

    groups.forEach(function (group) {
      if (Array.isArray(group)) {
        appendRow(group, alt);
      } else {
        appendImg(gallery, group, alt);
      }
    });
  }

  function openModalFor(card) {
    var img = card.querySelector(".work__itemMedia img");
    var images = WORK_IMAGES[cards.indexOf(card)] || [img.src];

    buildGallery(img.alt, images);

    modal.classList.remove("is-closing");
    modal.hidden = false;
    document.documentElement.classList.add("work__bodyLocked");
    document.body.classList.add("work__bodyLocked");
  }

  function closeModal() {
    if (modal.hidden || modal.classList.contains("is-closing")) return;
    // Slides the paper back down first (work-modal-out, the reverse of the
    // opening animation) instead of hiding it instantly — the actual
    // `hidden` flip happens in the animationend handler below, once that
    // finishes.
    modal.classList.add("is-closing");
  }

  modal.addEventListener("animationend", function (e) {
    if (e.target !== modal || e.animationName !== "work-modal-out") return;
    modal.hidden = true;
    modal.classList.remove("is-closing");
    document.documentElement.classList.remove("work__bodyLocked");
    document.body.classList.remove("work__bodyLocked");
  });

  document.querySelectorAll(".work__itemMedia img").forEach(function (img) {
    img.addEventListener("click", function () {
      var card = img.closest(".work__itemCard");
      if (card) openModalFor(card);
    });
  });

  closeBtn.addEventListener("click", closeModal);

  document.addEventListener("click", function (e) {
    if (modal.hidden) return;
    if (modal.contains(e.target)) return;
    if (e.target.closest(".work__itemMedia img")) return;
    closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });
})();
