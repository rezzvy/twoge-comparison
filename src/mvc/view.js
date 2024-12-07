export default class View {
  constructor() {
    // Initialize canvas and zoomable elements
    this.canvasElement = document.querySelector(".canvas");
    this.zoomableElements = document.querySelectorAll(".zoomable");

    // Initialize slider-related elements
    this.sliderInputRangeElement = document.querySelector(".slider input");
    this.sliderInputRangeReplicaElement = document.querySelector(
      ".slider .input-range-replica"
    );
    this.sliderComparisonItemElement = document.querySelector(
      ".canvas .slider img:first-of-type"
    );

    // Initialize fade-related elements
    this.fadeInputRangeElement = document.querySelector("._fade input");
    this.fadeComparisonItemElement = document.querySelector(
      ".canvas ._fade img:first-of-type"
    );

    // Initialize control buttons
    this.zoomInButtonElement = document.getElementById("zoom-in-btn");
    this.zoomOutButtonElement = document.getElementById("zoom-out-btn");
    this.resetViewButton = document.getElementById("reset-view-btn");

    // Initialize image upload inputs and elements
    this.imageOneInputElement = document.getElementById("image1");
    this.imageTwoInputElement = document.getElementById("image2");
    this.imageOneElements = document.querySelectorAll(".image1");
    this.imageTwoElements = document.querySelectorAll(".image2");

    // Initialize comparison buttons and controls
    this.comparisonButtons = document.querySelectorAll("[data-comparison]");
    this.controls = document.querySelectorAll(".control");
  }

  checkInputFileElementStatus() {
    return this.imageOneInputElement.value && this.imageTwoInputElement.value;
  }

  // Sets cursor style for drag operations
  setOnDrag(element, boolean) {
    const pointer = boolean ? "grabbing" : "grab";
    element.style.cursor = pointer;
  }

  // Toggles active state for buttons
  toggleActiveButton(activeClass, notActiveClass, target) {
    const currentActive = target.parentElement.querySelector(`.${activeClass}`);

    if (currentActive && currentActive !== target) {
      currentActive.classList.replace(activeClass, notActiveClass);
    }

    target.classList.replace(notActiveClass, activeClass);
  }

  // Updates CSS property of a specific element
  setElementProperty(element, propertyName, propertyValue) {
    this[element].style.setProperty(propertyName, propertyValue);
  }

  // Enables or disables control buttons
  enableControls(boolean) {
    this.controls.forEach((control) => {
      boolean
        ? control.classList.remove("disable-event")
        : control.classList.add("disable-event");
    });
  }

  // Updates the source of images based on input
  setImageSource(number, source) {
    const images =
      number === "one" ? this.imageOneElements : this.imageTwoElements;

    images.forEach((image) => {
      image.src = source;
    });
  }

  // Updates the zoom level for canvas elements
  setCanvasZoomLevel(zoomLevel) {
    this.zoomableElements.forEach((element) => {
      element.style.setProperty("--zoom-level", zoomLevel);
    });
  }

  // Updates the state of the canvas
  updateCanvasState(previousState, currentState) {
    this.canvasElement.classList.replace(previousState, currentState);
  }

  // Updates position of items on the canvas
  setCanvasItemPosition(x, y) {
    this.zoomableElements.forEach((element) => {
      element.style.setProperty("--x", x + "px");
      element.style.setProperty("--y", y + "px");
    });
  }
}
