const preview = document.createElement("div");
preview.className = "image-preview";
preview.setAttribute("aria-hidden", "true");

const previewImage = document.createElement("img");
previewImage.alt = "";

preview.appendChild(previewImage);
document.body.appendChild(preview);

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

let hideTimer;
let animationFrame;
let activeImage = null;


function showPreview(image) {
  if (!image.complete || image.naturalWidth === 0) return;

  if (window.frameBeforePreview) {
    window.frameBeforePreview(image, () => enlargePreview(image));
  } else {
    enlargePreview(image);
  }
}


function enlargePreview(image) {
  clearTimeout(hideTimer);
  cancelAnimationFrame(animationFrame);

  activeImage = image;

  const rect = image.getBoundingClientRect();

  preview.classList.remove("active");
  previewImage.style.transition = "none";
  previewImage.src = image.currentSrc || image.src;

  previewImage.style.left = `${rect.left}px`;
  previewImage.style.top = `${rect.top}px`;
  previewImage.style.width = `${rect.width}px`;
  previewImage.style.height = `${rect.height}px`;

  previewImage.style.transform =
    "translate(0px, 0px) scale(1)";

  preview.classList.add("visible");

 
  const padding = 25;

  const scale = Math.min(
    (window.innerWidth - padding * 2) / rect.width,
    (window.innerHeight - padding * 2) / rect.height
  );

  const finalLeft =
    (window.innerWidth - rect.width * scale) / 2;

  const finalTop =
    (window.innerHeight - rect.height * scale) / 2;

  const moveX = finalLeft - rect.left;
  const moveY = finalTop - rect.top;

 
  previewImage.getBoundingClientRect();

  animationFrame = requestAnimationFrame(() => {
    previewImage.style.transition = "";
    preview.classList.add("active");

    previewImage.style.transform =
      `translate(${moveX}px, ${moveY}px) scale(${scale})`;
  });
}


function hidePreview() {
  window.cancelFramedPreview?.();

  cancelAnimationFrame(animationFrame);
  clearTimeout(hideTimer);

  activeImage = null;
  preview.classList.remove("active");

  previewImage.style.transform =
    "translate(0px, 0px) scale(1)";

  hideTimer = setTimeout(() => {
    preview.classList.remove("visible");
  }, reducedMotion.matches ? 0 : 400);
}


function dismissPreview() {
  window.cancelFramedPreview?.();

  cancelAnimationFrame(animationFrame);
  clearTimeout(hideTimer);

  activeImage = null;
  preview.classList.remove("active", "visible");
}


document.querySelectorAll(".entry img").forEach((image) => {
  image.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "touch") return;
    showPreview(image);
  });

  image.addEventListener("pointerleave", hidePreview);
});


document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") hidePreview();
});

window.addEventListener("resize", dismissPreview);

window.addEventListener("scroll", dismissPreview, {
  passive: true
});

window.addEventListener("blur", dismissPreview);
const landingTitle = document.querySelector(
  "header a:not(.about-link)"
);

const titlePreview = document.createElement("div");
titlePreview.className = "title-preview";
titlePreview.setAttribute("aria-hidden", "true");

const titleImage = document.createElement("img");
titleImage.src = "images/title.jpg";
titleImage.alt = "";

titlePreview.appendChild(titleImage);
document.body.appendChild(titlePreview);

let titlePinned = false;

function openTitlePhoto() {
  dismissPreview();
  titlePreview.classList.add("open");
}

function closeTitlePhoto() {
  titlePinned = false;
  titlePreview.classList.remove("open");
}

let titleHoverBlocked = false;

landingTitle.addEventListener("pointerenter", (event) => {
  if (titleHoverBlocked) return;

  if (event.pointerType !== "touch") {
    openTitlePhoto();
  }
});

landingTitle.addEventListener("pointerleave", () => {
  titleHoverBlocked = false;
});

window.resetTitlePreview = function () {
  titleHoverBlocked = true;
  closeTitlePhoto();
};

landingTitle.addEventListener("pointerleave", () => {
  if (!titlePinned) {
    titlePreview.classList.remove("open");
  }
});

landingTitle.addEventListener("click", (event) => {
  event.preventDefault();

  titlePinned = !titlePinned;

  if (titlePinned) {
    openTitlePhoto();
  } else {
    closeTitlePhoto();
  }
});

document.addEventListener("click", (event) => {
  if (!landingTitle.contains(event.target)) {
    closeTitlePhoto();
  }
});

document.querySelectorAll(".entry img").forEach((image) => {
  image.addEventListener("pointerenter", closeTitlePhoto);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeTitlePhoto();
  }
});

window.addEventListener("blur", closeTitlePhoto);