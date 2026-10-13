const desktopPointer = window.matchMedia(
  "(hover: hover) and (pointer: fine)"
);

const reducedPointerMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

let previewDelay;
let pendingPhoto = null;



window.cancelFramedPreview = function () {
  clearTimeout(previewDelay);
  pendingPhoto = null;
};

window.frameBeforePreview = function (image, openPreview) {
  window.cancelFramedPreview();

  if (!desktopPointer.matches || reducedPointerMotion.matches) {
    openPreview();
    return;
  }

  pendingPhoto = image;

  
  previewDelay = setTimeout(() => {
    const stillOnImage =
      image.matches(":hover") ||
      document.activeElement === image;

    if (pendingPhoto === image && stillOnImage) {
      pendingPhoto = null;
      openPreview();
    }
  }, 280);
};

if (desktopPointer.matches) {
  const frame = document.createElement("div");
  frame.className = "pointer-frame";
  frame.setAttribute("aria-hidden", "true");

  frame.innerHTML = `
    <span class="top-left"></span>
    <span class="top-right"></span>
    <span class="bottom-left"></span>
    <span class="bottom-right"></span>
  `;

  document.body.appendChild(frame);

  let mouseX = 0;
  let mouseY = 0;
  let pointerVisible = false;
  let firstMove = true;

  let x = 0;
  let y = 0;
  let width = 30;
  let height = 30;
  let previousTime = 0;

  document.addEventListener("pointermove", (event) => {
    if (event.pointerType === "touch") return;

    mouseX = event.clientX;
    mouseY = event.clientY;

    if (firstMove) {
      x = mouseX - 15;
      y = mouseY - 15;
      firstMove = false;
    }

    pointerVisible = true;

    frame.classList.add("visible");
    document.documentElement.classList.add("custom-pointer");
  });

  function hidePointer() {
    pointerVisible = false;
    firstMove = true;

    frame.classList.remove("visible");
    document.documentElement.classList.remove("custom-pointer");

    window.cancelFramedPreview();
  }

  document.documentElement.addEventListener(
    "pointerleave",
    hidePointer
  );

  window.addEventListener("blur", hidePointer);

  
  document.addEventListener(
    "pointerout",
    (event) => {
      if (
        pendingPhoto &&
        event.target === pendingPhoto &&
        event.relatedTarget !== pendingPhoto
      ) {
        window.cancelFramedPreview();
      }
    },
    true
  );

  
  document.addEventListener(
    "scroll",
    () => window.cancelFramedPreview(),
    true
  );

  window.addEventListener(
    "resize",
    () => window.cancelFramedPreview()
  );

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      window.cancelFramedPreview();
    }
  });

  function animate(time) {
    const elapsed = previousTime
      ? Math.min(time - previousTime, 50)
      : 16;

    previousTime = time;

    if (pointerVisible) {
      let targetX = mouseX - 15;
      let targetY = mouseY - 15;
      let targetWidth = 30;
      let targetHeight = 30;
      let followingEnlargement = false;

      
      const underneath = document.elementFromPoint(mouseX, mouseY);

      const target = underneath?.closest(
  "header a, .about-close, .entry img, .photo"
);

      if (target) {
        const isPhoto = target.matches(".entry img, .photo");

        const enlargedPhoto = isPhoto
          ? document.querySelector(
              ".preview.active .preview-image, " +
              ".image-preview.active img"
            )
          : null;

        const elementToFrame = enlargedPhoto || target;
        const rect = elementToFrame.getBoundingClientRect();

        const gap = isPhoto ? 7 : 9;

        targetX = rect.left - gap;
        targetY = rect.top - gap;
        targetWidth = rect.width + gap * 2;
        targetHeight = rect.height + gap * 2;

        followingEnlargement = Boolean(enlargedPhoto);
      }


      const easing =
        reducedPointerMotion.matches || followingEnlargement
          ? 1
          : 1 - Math.exp(-elapsed / 18);

      x += (targetX - x) * easing;
      y += (targetY - y) * easing;
      width += (targetWidth - width) * easing;
      height += (targetHeight - height) * easing;

      frame.style.transform = `translate(${x}px, ${y}px)`;
      frame.style.width = `${width}px`;
      frame.style.height = `${height}px`;
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}