(function () {
  "use strict";

  var modal = document.getElementById("workModal");
  if (!modal) return;

  var modalImg = modal.querySelector(".work__modalImg");
  var modalMeta = modal.querySelector(".work__modalMeta");
  var modalTitle = modal.querySelector(".work__modalTitle");
  var modalDesc = modal.querySelector(".work__modalDesc");
  var modalDocNo = modal.querySelector(".work__modalDocNo");
  var modalSubject = modal.querySelector(".work__modalSubject");
  var modalDate = modal.querySelector(".work__modalDate");
  var closeBtn = modal.querySelector(".work__modalClose");

  var cards = Array.prototype.slice.call(document.querySelectorAll(".work__itemCard"));

  function openModalFor(card) {
    var img = card.querySelector(".work__itemMedia img");
    var meta = card.querySelector(".work__itemMeta").textContent;
    var title = card.querySelector(".work__itemTitle").textContent;

    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalMeta.textContent = meta;
    modalTitle.textContent = title;
    modalDesc.textContent = card.querySelector(".work__itemDesc").textContent;

    modalDocNo.textContent = String(cards.indexOf(card) + 1).padStart(3, "0");
    modalSubject.textContent = title;
    modalDate.textContent = meta.split("/")[0].trim();

    modal.hidden = false;
    document.documentElement.classList.add("work__bodyLocked");
    document.body.classList.add("work__bodyLocked");
  }

  function closeModal() {
    modal.hidden = true;
    document.documentElement.classList.remove("work__bodyLocked");
    document.body.classList.remove("work__bodyLocked");
  }

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
