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
      "../images/webcontent%20/work%2001/thumb.png",
      "../images/webcontent%20/work%2001/p01.jpg",
      "../images/webcontent%20/work%2001/w01%201.png",
      "../images/webcontent%20/work%2001/w01%204.png",
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
      // the gallery, same as the others do with their own thumb.
      "../images/work%2005/thumb.png",
      "../images/webcontent%20/work%2005/logo%20innn-02-02.png",
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

  function buildGallery(alt, images) {
    gallery.innerHTML = "";
    var i = 0;
    while (i < images.length) {
      var remaining = images.length - i;
      if (remaining === 2) {
        // Exactly 2 images left with no room for a "full" ahead of them —
        // pair them up instead of stranding one as a second full-width
        // image right after the previous one (looks like a mistake).
        appendRow(images.slice(i, i + 2), alt);
        i += 2;
        continue;
      }

      appendImg(gallery, images[i], alt);
      i += 1;

      if (images.length - i >= 2) {
        appendRow(images.slice(i, i + 2), alt);
        i += 2;
      }
    }
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
