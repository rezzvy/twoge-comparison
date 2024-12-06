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
    el.style.transform = `scale(${level})`;
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
  });
});

imageOneInputElement.addEventListener("change", (e) => {
  const file = e.target.files[0];
  imageOneElements.forEach((img) => {
    img.src = URL.createObjectURL(file);
  });

  if (inputtedImages === 2) return;
  if (file) inputtedImages++;
  checkInput();
});

imageTwoInputElement.addEventListener("change", (e) => {
  const file = e.target.files[0];
  imageTwoElements.forEach((img) => {
    img.src = URL.createObjectURL(file);
  });

  if (inputtedImages === 2) return;
  if (file) inputtedImages++;
  checkInput();
});

enableControls(false);
