const content = {
  1: {
    text: "I began with what I could see. One person at a table. One person on a bench. One person walking home. In a city where people are almost always within reach of one another, I started noticing the spaces that formed around those who were by themselves. I photographed them because they looked alone. But that was all I could see."
  },

  3: {
    heading: "Being Alone",
    text: `Weinstein, Hansen & Nguyen’s Definitions
of Solitude in Everyday Life is particularly
useful. They interviewed adults aged
19–80 about what solitude actually
meant to them. Physical separation
mattered strongly to many participants,
but the researchers ultimately found that
solitude couldn’t be reduced to physical
separation alone.`,
    credit: `Weinstein, Hansen & Nguyen, 2023
Definitions of Solitude in Everyday Life`
  },

  6: {
    heading: "Alone, Together.",
    text: `The same research identifies public
solitude: being physically in the presence
of strangers while having little or no
interaction with them. Someone can sit
alone in a restaurant, travel alone on
public transportation, or occupy a park
surrounded by hundreds of people while
remaining essentially within their
own space.`
  },

  8: {
    heading: "On Stage?",
    text: `Sociologist Erving Goffman used
theatrical ideas to understand social
life: when we’re around other people,
we’re constantly presenting versions of
ourselves.
Later scholarship on solitude summarizes
Goffman’s conception of being alone as
being “off stage”—temporarily removed
from social expectations and demands.`
  },

  9: {
    heading: "Off stage in New York?",
    layout: "heading-only"
  },

  10: {
    text: `There is something strange about
photographing someone who is alone.
For a moment, they aren't.
The camera can record the distance
between one body and another, but not
what that distance meant.
A photograph can show someone alone.
It cannot tell us whether they feel
that way.`
  },

  13: {
    heading: "The Capacity to Be Alone",
    text: `Donald Winnicott’s essay The Capacity to Be Alone argues something paradoxical: our capacity to truly be alone develops through the early experience of being alone while someone trusted was present.`
  },

  14: {
    quote: `"being alone in the presence of someone."`,
    credit: `Winnicott, 1958 The Capacity to Be Alone`
  }
};
const gallery = document.querySelector("#gallery");
const preview = document.querySelector(".preview");
const previewImage = document.querySelector(".preview-image");

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

preview.querySelector(".preview-quote")?.remove();

const writing = document.createElement("div");
writing.className = "preview-writing";

writing.innerHTML = `
  <h2 class="preview-heading"></h2>
  <p class="preview-text"></p>
  <p class="preview-credit"></p>
  <blockquote class="preview-quote"></blockquote>
`;

preview.appendChild(writing);

const heading = writing.querySelector(".preview-heading");
const paragraph = writing.querySelector(".preview-text");
const credit = writing.querySelector(".preview-credit");
const quote = writing.querySelector(".preview-quote");

let cycleWidth = 0;
let ready = false;
let hideTimer;
let animationFrame;
let activeImage = null;

function createSequence(duplicate = false) {
  const sequence = document.createElement("div");
  sequence.className = "sequence";

  if (duplicate) {
    sequence.setAttribute("aria-hidden", "true");
  }

  for (let number = 1; number <= 16; number++) {
    const card = document.createElement("div");
    card.className = "photo-card";

    const image = document.createElement("img");
    image.className = "photo";
    image.src = `images/physical/${number}.jpg`;
    image.alt = `Physical photograph ${number}`;
    image.dataset.number = number;
    image.draggable = false;

   
    image.tabIndex = duplicate ? -1 : 0;

    image.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "touch") {
        showPreview(image);
      }
    });

    image.addEventListener("pointerleave", () => {
      if (document.activeElement !== image) {
        hidePreview();
      }
    });

    image.addEventListener("focus", () => showPreview(image));
    image.addEventListener("blur", hidePreview);

    card.appendChild(image);
    sequence.appendChild(card);
  }

  return sequence;
}


gallery.replaceChildren(
  createSequence(true),
  createSequence(),
  createSequence(true)
);



function setWriting(element, text) {
  element.textContent = text || "";
  element.hidden = !text;
}


function showPreview(image) {
  if (window.frameBeforePreview) {
    window.frameBeforePreview(image, () => enlargePreview(image));
  } else {
    enlargePreview(image);
  }
}
function enlargePreview(image) {
  if (!image.complete || !image.naturalWidth) return;

  clearTimeout(hideTimer);
  cancelAnimationFrame(animationFrame);

  activeImage = image;

  const number = Number(image.dataset.number);
  const item = content[number] || {};
  const rect = image.getBoundingClientRect();

  const headingOnly = item.layout === "heading-only";
  const hasText = Boolean(
    item.heading || item.text || item.quote || item.credit
  );

  preview.classList.remove("active");
  preview.classList.toggle("has-text", hasText);
  preview.classList.toggle("heading-only", headingOnly);
  preview.classList.toggle("dark", number === 14);

  setWriting(heading, item.heading);
  setWriting(paragraph, item.text);
  setWriting(credit, item.credit);
  setWriting(quote, item.quote);

  previewImage.style.transition = "none";
  previewImage.src = image.currentSrc || image.src;

  previewImage.style.left = `${rect.left}px`;
  previewImage.style.top = `${rect.top}px`;
  previewImage.style.width = `${rect.width}px`;
  previewImage.style.height = `${rect.height}px`;
  previewImage.style.transform = "translate(0px, 0px) scale(1)";

  preview.classList.add("visible");

  const padding = 30;
  const split = hasText && !headingOnly;

  const areaWidth = split
    ? window.innerWidth / 2
    : window.innerWidth;

  
  const topSpace = headingOnly
    ? Math.max(120, writing.getBoundingClientRect().bottom + 25)
    : padding;

  const availableWidth = areaWidth - padding * 2;
  const availableHeight = window.innerHeight - topSpace - padding;

  

  const finalScale = Math.min(
    availableWidth / image.naturalWidth,
    availableHeight / image.naturalHeight
  );

  const finalWidth = image.naturalWidth * finalScale;
  const finalHeight = image.naturalHeight * finalScale;

  const finalLeft = (areaWidth - finalWidth) / 2;
  const finalTop =
    topSpace + (availableHeight - finalHeight) / 2;

  const moveX = finalLeft - rect.left;
  const moveY = finalTop - rect.top;

  const scaleX = finalWidth / rect.width;
  const scaleY = finalHeight / rect.height;

  previewImage.getBoundingClientRect();

  animationFrame = requestAnimationFrame(() => {
    previewImage.style.transition = "";
    preview.classList.add("active");

    previewImage.style.transform =
      `translate(${moveX}px, ${moveY}px) ` +
      `scale(${scaleX}, ${scaleY})`;
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
  }, reducedMotion.matches ? 0 : 600);
}

function dismissPreview() {
    window.cancelFramedPreview?.();
  cancelAnimationFrame(animationFrame);
  clearTimeout(hideTimer);
  activeImage = null;
  preview.classList.remove("active", "visible");
}


gallery.addEventListener(
  "wheel",
  (event) => {
    
    if (event.ctrlKey) return;

    event.preventDefault();

    const movement =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    const unit =
      event.deltaMode === 1
        ? 16
        : event.deltaMode === 2
          ? gallery.clientWidth
          : 1;

    gallery.scrollLeft += movement * unit;
  },
  { passive: false }
);


gallery.addEventListener(
  "scroll",
  () => {
    dismissPreview();

    if (!ready || !cycleWidth) return;

    if (gallery.scrollLeft >= cycleWidth * 2) {
      gallery.scrollLeft -= cycleWidth;
    } else if (gallery.scrollLeft < cycleWidth) {
      gallery.scrollLeft += cycleWidth;
    }
  },
  { passive: true }
);

window.addEventListener("load", () => {
  cycleWidth = gallery.children[0].getBoundingClientRect().width;
  gallery.scrollLeft = cycleWidth;
  ready = true;

  
  const hovered = gallery.querySelector(".photo:hover");
  if (hovered) {
    requestAnimationFrame(() => showPreview(hovered));
  }
});

window.addEventListener("resize", () => {
  dismissPreview();

  const oldWidth = cycleWidth;
  const oldPosition = gallery.scrollLeft;

  cycleWidth = gallery.children[0].getBoundingClientRect().width;

  if (ready && oldWidth) {
    gallery.scrollLeft = (oldPosition / oldWidth) * cycleWidth;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hidePreview();
  }

  if (
    event.key === "ArrowRight" ||
    event.key === "ArrowLeft"
  ) {
    event.preventDefault();

    gallery.scrollLeft +=
      event.key === "ArrowRight" ? 300 : -300;
  }
});