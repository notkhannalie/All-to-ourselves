const content = {
  1: {
    text: `Loneliness is harder to photograph.
There is no empty chair that proves it. No distance that can measure it. Someone can spend the day surrounded by people and still feel completely separate from them.
Maybe loneliness has less to do with being alone than with wanting to be understood.
To be seen, but not known. To speak, but not feel heard. To be surrounded, but somehow remain elsewhere. 
Physical distance can be crossed.
This kind of distance is harder to name, it’s more of a feeling.`
  },

  4: {
    heading: "Evolved",
    text: `Psychologists distinguish social isolation from loneliness. Isolation can be objectively measured through things like the amount of social contact someone has; loneliness is subjective—the feeling that the connection you have doesn't match the connection you need or want.
Psychologist John Cacioppo, whose research focused heavily on loneliness and social connection. His work is useful because it treats loneliness not simply as sadness but as a psychological signal related to our need for social connection.
loneliness is a biological warning system akin to physical pain or hunger, signaling a threat to survival rather than a personal weakness.`
  },

  7: {
    text: `New York creates a weird contradiction: you can almost never be physically alone, yet you can feel completely anonymous.
There are always people around. Someone passing you on the sidewalk, sitting across from you on the train, living on the other side of a wall.
We share elevators, tables, platforms and streets with people whose names we will never know.`
  },

  9: {
    heading: "The Lonely City",
    text: `When Olivia Laing moved to New York City in her mid-thirties, she found herself inhabiting loneliness on a daily basis. Fascinated by this most shameful of experiences, she began to explore the lonely city by way of art.
Moving fluidly between works and lives – from Hopper’s Nighthawks to Warhol's Time Capsules, from Henry Darger's hoarding to David Wojnarowicz's AIDS activism – Laing conducts an electric, dazzling investigation into what it means to be alone.
Humane, provocative and moving, The Lonely City is a celebration of a strange state, adrift from the larger continent of human experience, but intrinsic to the very act of being alive.`,
    credit: "The Lonely City, Olivia Laing, 2016."
  },

  11: {
    heading: "Edward Hopper",
    text: `Edward Hopper was an American realist painter and printmaker, best known for his realistic paintings that capture the loneliness, isolation, and quiet melancholy of modern American life.
His figures are often not literally alone. In Nighthawks, for example, several people occupy the same diner—and yet the painting has become culturally associated with urban isolation.
Hopper himself sometimes grumbled that people overdid "the loneliness thing" and insisted he was just painting real life. Yet, his work captures the quiet and universal feeling of being alone in a crowded world.`
  },

  13: {
    text: `Some of the loneliest moments happen after seeing people. On the walk home. After a conversation that didn't go the way you wanted. After being surrounded by people you like and wondering why you still feel slightly outside of it all.
There is being by yourself.
And then there is feeling like you are.`
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
let activeImage = null;


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
    image.src = `images/disconnected/${number}.jpg`;
    image.alt = `Disconnected photograph ${number}`;
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

  activeImage = image;

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

  activeImage = null;
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

  activeImage = null;
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