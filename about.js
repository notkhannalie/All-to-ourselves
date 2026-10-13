(() => {
  function setupAbout() {
    const header = document.querySelector("header");
    if (!header) return;

    header.querySelector(".about-link")?.remove();
    document.querySelector(".about-dialog")?.remove();

    const homeLink = header.querySelector("a");

    if (document.querySelector("#gallery") && homeLink) {
      homeLink.textContent = "Back";
      homeLink.href = "index.html";
    }

    const aboutLink = document.createElement("a");
    aboutLink.className = "about-link";
    aboutLink.href = "#about";
    aboutLink.textContent = "About";
    aboutLink.setAttribute("aria-haspopup", "dialog");

    header.appendChild(aboutLink);

    const dialog = document.createElement("dialog");
    dialog.className = "about-dialog";
    dialog.setAttribute("aria-labelledby", "about-heading");

    dialog.innerHTML = `
      <a
  class="about-close"
  href="#"
  aria-label="Back to previous page"
  autofocus
>
  Back
</a>

      <div class="about-layout">
        <img
          class="about-image"
          src="images/about.jpg"
          alt="About All to ourselves"
        >

        <div class="about-writing">
          
          <p>I invite you to explore three ways of being alone: physical, the state of being by yourself; disconnected, the feeling of loneliness; and chosen, the solitude we seek.</p>

          <p>Photographed in New York City, September 2026.</p>

          <p>Photography, design, and writing by Akshat Khanna.</p>
        </div>
      </div>
    `;

    document.body.appendChild(dialog);

    let pointer = null;
    let pointerParent = null;

    aboutLink.addEventListener("click", (event) => {
      event.preventDefault();

      window.cancelFramedPreview?.();

      document.querySelectorAll(
        ".image-preview, .preview, .title-preview"
      ).forEach((element) => {
        element.classList.remove("active", "visible", "open");
      });

      if (dialog.open) return;

      dialog.showModal();

      pointer = document.querySelector(".pointer-frame");

      if (pointer) {
        pointerParent = pointer.parentNode;
        dialog.appendChild(pointer);
      }
    });

    dialog.querySelector(".about-close").addEventListener(
  "click",
  (event) => {
    event.preventDefault();
    dialog.close();
  }
);

    dialog.addEventListener("close", () => {
        window.resetTitlePreview?.();
      if (pointer && pointerParent) {
        pointerParent.appendChild(pointer);
      }

      aboutLink.focus();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupAbout);
  } else {
    setupAbout();
  }
})();