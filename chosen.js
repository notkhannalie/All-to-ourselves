const content = {
  1: {
    text: `Somewhere along the way, being alone
stopped looking empty.
A table for one could be enough. A walk
could have nowhere to lead. Silence did
not always need to be filled.
Time moves differently when it belongs
only to you. You begin to notice things
that disappear in company—your
surroundings, your thoughts, yourself.
Maybe solitude is not the absence of
someone else.
Maybe it is the decision to stay
with yourself.`
  },

  4: {
    heading: "Choice Changes the Experience",
    text: `Autonomy Matters: Experiential and
Individual Differences in Chosen and
Unchosen Solitary Activities From
Three Experience Sampling Studies by
Dwight C. K. Tse, Jennifer C. Lay, and
Jeanne Nakamura. It was first published
online in 2021 and appeared in Social
Psychological and Personality Science
in 2022. Across three studies, 283
participants completed 8,769 surveys,
and unchosen solitary activities were
associated with the lowest-quality
momentary experiences.`
  },

  6: {
    heading: "The Capacity to be Alone ",
    text: `Donald Winnicott’s 1958 psychoanalytic
essay The Capacity to Be Alone proposes
that being comfortably alone is actually
an achievement rather than simply a
circumstance. He connects the adult
capacity for solitude to feeling secure
enough that another person's immediate
presence isn't necessary.`
  },

  8: {
    heading: "Letters to a Young Poet",
    text: `Rilke repeatedly encourages the young
poet Franz Xaver Kappus to accept
solitude rather than constantly trying to
escape it. His idea isn't that solitude is
always pleasant. It's that solitude can
be difficult and still valuable, because it
creates space for inner development.`,
    credit: "Rainer Maria Rilke, Letters to a Young Poet"
  },

  11: {
    heading: "Deliberate Withdrawal",
    text: `Henry David Thoreau moved to a small
cabin near Walden Pond in 1845 and lived
there for a little over two years. Walden
wasn't really an experiment in total
isolation—he visited people and received
visitors—but it was an experiment in
deliberate living, simplifying life enough to
examine it more closely.`
  },

  13: {
    text: `There are things we are taught to
do together.
Eat dinner. See a film. Travel somewhere
new. Sit at a bar. Spend a
Sunday afternoon.
Doing them alone can feel strangely
public, as if the empty seat beside us
needs an explanation.
But eventually, it stops feeling like
something is missing.
The empty seat is simply empty.`
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
`;

preview.appendChild(writing);

const heading = writing.querySelector(".preview-heading");
const paragraph = writing.querySelector(".preview-text");
const credit = writing.querySelector(".preview-credit");

let cycleWidth = 0;
let ready = false;
let hideTimer;
let animationFrame;


function createSequence(duplicate = false) {
  const sequence = document.createElement("div");
  sequence.className = "sequence";

  if (duplicate) {
    sequence.setAttribute("aria-hidden", "true");
  }

  for (let number = 1; number <= 14; number++) {
    const card = document.createElement("div");
    card.className = "photo-card";

    const image = document.createElement("img");
    image.className = "photo";
    image.src = `images/chosen/${number}.jpg`;
    image.alt = `Chosen photograph ${number}`;
    image.dataset.number = number;
    image.draggable = false;
    image.tabIndex = duplicate ? -1 : 0;

    image.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      showPreview(image);
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

  const number = Number(image.dataset.number);
  const item = content[number] || {};
  const rect = image.getBoundingClientRect();

  const hasText = Boolean(
    item.heading || item.text || item.credit
  );

  preview.classList.remove("active", "dark", "heading-only");
  preview.classList.toggle("has-text", hasText);

  setWriting(heading, item.heading);
  setWriting(paragraph, item.text);
  setWriting(credit, item.credit);

  previewImage.style.transition = "none";
  previewImage.src = image.currentSrc || image.src;

  previewImage.style.left = `${rect.left}px`;
  previewImage.style.top = `${rect.top}px`;
  previewImage.style.width = `${rect.width}px`;
  previewImage.style.height = `${rect.height}px`;

  previewImage.style.transform =
    "translate(0px, 0px) scale(1)";

  preview.classList.add("visible");

  const padding = 30;

  const areaWidth = hasText
    ? window.innerWidth / 2
    : window.innerWidth;

  const availableWidth = areaWidth - padding * 2;
  const availableHeight = window.innerHeight - padding * 2;

  const fitScale = Math.min(
    availableWidth / image.naturalWidth,
    availableHeight / image.naturalHeight
  );

  const finalWidth = image.naturalWidth * fitScale;
  const finalHeight = image.naturalHeight * fitScale;

  const finalLeft = (areaWidth - finalWidth) / 2;
  const finalTop = (window.innerHeight - finalHeight) / 2;

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

  preview.classList.remove("active");

  previewImage.style.transform =
    "translate(0px, 0px) scale(1)";

  hideTimer = setTimeout(() => {
    preview.classList.remove("visible");
  }, reducedMotion.matches ? 0 : 220);
}

function dismissPreview() {
  window.cancelFramedPreview?.();

  cancelAnimationFrame(animationFrame);
  clearTimeout(hideTimer);

  preview.classList.remove("active", "visible");
}


gallery.addEventListener(
  "wheel",
  (event) => {
    if (event.ctrlKey) return;

    event.preventDefault();
    dismissPreview();

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
  cycleWidth =
    gallery.children[0].getBoundingClientRect().width;

  gallery.scrollLeft = cycleWidth;
  ready = true;
});


window.addEventListener("resize", () => {
  dismissPreview();

  const oldWidth = cycleWidth;
  const oldPosition = gallery.scrollLeft;

  cycleWidth =
    gallery.children[0].getBoundingClientRect().width;

  if (ready && oldWidth) {
    gallery.scrollLeft =
      (oldPosition / oldWidth) * cycleWidth;
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
    dismissPreview();

    gallery.scrollLeft +=
      event.key === "ArrowRight" ? 300 : -300;
  }
});

window.addEventListener("blur", dismissPreview);