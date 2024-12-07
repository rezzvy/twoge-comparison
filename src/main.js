const canvasElement = document.querySelector(".canvas");

const sliderInputRangeElement = document.querySelector(".slider input");
const sliderInputRangeReplicaElement = document.querySelector(
  ".slider .input-range-replica"
);
const sliderComparisonItemElement = document.querySelector(
  ".canvas .slider img:first-of-type"
);

const fadeInputRangeElement = document.querySelector("._fade input");
const fadeComparisonItemElement = document.querySelector(
  ".canvas ._fade img:first-of-type"
);

const zoomInButtonElement = document.getElementById("zoom-in-btn");
const zoomOutButtonElement = document.getElementById("zoom-out-btn");

const comparisonButtons = document.querySelectorAll("[data-comparison]");

const zoomableElements = document.querySelectorAll(".zoomable");

const imageOneInputElement = document.getElementById("image1");
const imageTwoInputElement = document.getElementById("image2");

const imageOneElements = document.querySelectorAll(".image1");
const imageTwoElements = document.querySelectorAll(".image2");

const controls = document.querySelectorAll(".control");

const resetViewButton = document.getElementById("reset-view-btn");

let renderComparison = "slider-view";
let inputtedImages = 0;

function enableControls(bool) {
  controls.forEach((control) => {
    bool
      ? control.classList.remove("disable-event")
      : control.classList.add("disable-event");
  });
}

function checkInput() {
  if (inputtedImages === 2) {
    canvasElement.classList.replace("not-ready", "slider-view");
    enableControls(true);
  }
}

function zoom(level) {
  zoomableElements.forEach((el) => {
    el.style.setProperty("--zoom-level", level);
  });
}

sliderInputRangeElement.addEventListener("input", (e) => {
  const val = e.target.value;

  sliderInputRangeReplicaElement.style.setProperty("--width", val + "%");
  sliderComparisonItemElement.style.setProperty("--width", 100 - val + "%");
});

fadeInputRangeElement.addEventListener("input", (e) => {
  fadeComparisonItemElement.style.setProperty("--opacity", e.target.value);
});

let val = 1;
zoomInButtonElement.addEventListener("click", (e) => {
  val += 0.25;

  zoom(val);
});

zoomOutButtonElement.addEventListener("click", (e) => {
  if (val === 0.5) {
    return;
  } else {
    val -= 0.25;
  }

  zoom(val);
});

comparisonButtons.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const currentActive =
      e.currentTarget.parentElement.querySelector(".btn-dark");

    if (currentActive && currentActive !== e.currentTarget) {
      currentActive.classList.replace("btn-dark", "btn-outline-dark");
    }

    e.currentTarget.classList.replace("btn-outline-dark", "btn-dark");

    canvasElement.classList.replace(
      renderComparison,
      e.currentTarget.dataset.comparison
    );

    renderComparison = e.currentTarget.dataset.comparison;

    zoomableElements.forEach((element) => {
      element.style.setProperty("--x", "0");
      element.style.setProperty("--y", "0");
      element.style.setProperty("--zoom-level", "1");
    });

    val = 1;
    startX = 0;
    startY = 0;
    currentX = 0;
    currentY = 0;
  });
});

imageOneInputElement.addEventListener("change", (e) => {
  if (!e.target.files.length) return;

  const file = e.target.files[0];
  imageOneElements.forEach((img) => {
    img.src = URL.createObjectURL(file);
  });

  if (inputtedImages === 2) return;
  if (file) inputtedImages++;
  checkInput();
});

imageTwoInputElement.addEventListener("change", (e) => {
  if (!e.target.files.length) return;

  const file = e.target.files[0];
  imageTwoElements.forEach((img) => {
    if (img.src) {
      URL.revokeObjectURL(img.src);
    }
    img.src = URL.createObjectURL(file);
  });

  if (inputtedImages === 2) return;
  if (file) inputtedImages++;
  checkInput();
});

enableControls(false);

let isDragging = false;
let startX, startY;
let currentX = 0,
  currentY = 0;

const isTouchDevice = "ontouchstart" in window;
const startEvent = isTouchDevice ? "touchstart" : "mousedown";
const moveEvent = isTouchDevice ? "touchmove" : "mousemove";
const endEvent = isTouchDevice ? "touchend" : "mouseup";

zoomableElements.forEach((element) => {
  element.addEventListener("dragstart", (e) => e.preventDefault());

  element.addEventListener(startEvent, (e) => {
    if (e.target.tagName === "INPUT") return;

    isDragging = true;
    startX = isTouchDevice ? e.touches[0].clientX : e.clientX;
    startY = isTouchDevice ? e.touches[0].clientY : e.clientY;
    element.style.cursor = "grabbing";

    e.preventDefault();
  });

  document.addEventListener(moveEvent, (e) => {
    if (isDragging) {
      e.preventDefault();
      const deltaX =
        (isTouchDevice ? e.touches[0].clientX : e.clientX) - startX;
      const deltaY =
        (isTouchDevice ? e.touches[0].clientY : e.clientY) - startY;

      currentX += deltaX;
      currentY += deltaY;

      element.style.setProperty("--x", currentX + "px");
      element.style.setProperty("--y", currentY + "px");

      startX = isTouchDevice ? e.touches[0].clientX : e.clientX;
      startY = isTouchDevice ? e.touches[0].clientY : e.clientY;
    }
  });

  document.addEventListener(endEvent, () => {
    isDragging = false;
    element.style.cursor = "grab";
  });
});

resetViewButton.addEventListener("click", (e) => {
  zoomableElements.forEach((element) => {
    element.style.setProperty("--x", "0");
    element.style.setProperty("--y", "0");
    element.style.setProperty("--zoom-level", "1");
  });

  val = 1;
  startX = 0;
  startY = 0;
  currentX = 0;
  currentY = 0;
});
