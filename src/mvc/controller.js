export default class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    // Detect if the device supports touch
    this.isTouchDevice = this.model.isOnTouchDevice();

    // Define event names based on device type
    this.moveableEventName = {
      startEvent: this.isTouchDevice ? "touchstart" : "mousedown",
      moveEvent: this.isTouchDevice ? "touchmove" : "mousemove",
      endEvent: this.isTouchDevice ? "touchend" : "mouseup",
    };
  }

  // Initialize the application
  init() {
    this.view.enableControls(false);

    // Event listeners for slider input
    this.view.sliderInputRangeElement.addEventListener("input", (e) => {
      const value = e.target.value;

      this.view.setElementProperty(
        "sliderInputRangeReplicaElement",
        "--width",
        value + "%"
      );

      this.view.setElementProperty(
        "sliderComparisonItemElement",
        "--width",
        100 - value + "%"
      );
    });

    // Event listeners for image input changes
    this.view.imageOneInputElement.addEventListener("change", (e) => {
      if (!e.target.files) return;

      this.imageInputHandler(e, "one");
    });

    this.view.imageTwoInputElement.addEventListener("change", (e) => {
      if (!e.target.files) return;

      this.imageInputHandler(e, "two");
    });

    // Event listeners for zoom controls
    this.view.zoomInButtonElement.addEventListener("click", () => {
      this.model.updateZoomLevel("+");
      this.view.setCanvasZoomLevel(this.model.zoomLevel);
    });

    this.view.zoomOutButtonElement.addEventListener("click", () => {
      if (this.model.zoomLevel === 0.5) return;

      this.model.updateZoomLevel("-");
      this.view.setCanvasZoomLevel(this.model.zoomLevel);
    });

    // Reset canvas view on button click
    this.view.resetViewButton.addEventListener("click", () => {
      this.resetCanvas();
    });

    // Event listener for fade input
    this.view.fadeInputRangeElement.addEventListener("input", (e) => {
      this.view.setElementProperty(
        "fadeComparisonItemElement",
        "--opacity",
        e.target.value
      );
    });

    // Drag functionality for zoomable elements
    this.view.zoomableElements.forEach((element) => {
      element.addEventListener("dragstart", (e) => e.preventDefault());

      element.addEventListener(this.moveableEventName.startEvent, (e) => {
        if (e.target.tagName === "INPUT") return;

        this.model.isDragging = true;
        const clientX = this.isTouchDevice ? e.touches[0].clientX : e.clientX;
        const clientY = this.isTouchDevice ? e.touches[0].clientY : e.clientY;

        this.view.setOnDrag(element, true);
        this.model.updateMoveableDataStartXAndY(clientX, clientY);
        e.preventDefault();
      });

      document.addEventListener(this.moveableEventName.moveEvent, (e) => {
        if (this.model.isDragging) {
          e.preventDefault();

          const clientX = this.isTouchDevice ? e.touches[0].clientX : e.clientX;
          const clientY = this.isTouchDevice ? e.touches[0].clientY : e.clientY;

          this.model.calculateMoveableData(clientX, clientY);
          this.view.setCanvasItemPosition(
            this.model.moveableXPos,
            this.model.moveableYPos
          );
        }
      });

      document.addEventListener(this.moveableEventName.endEvent, () => {
        this.model.isDragging = false;
        this.view.setOnDrag(element, false);
      });
    });

    // Event listeners for comparison buttons
    this.view.comparisonButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        this.view.toggleActiveButton(
          "btn-dark",
          "btn-outline-dark",
          e.currentTarget
        );

        this.view.updateCanvasState(
          this.model.currentState,
          e.currentTarget.dataset.comparison
        );
        this.model.setCanvasState(e.currentTarget.dataset.comparison);
        this.resetCanvas();
      });
    });
  }

  // Resets canvas state and properties
  resetCanvas() {
    this.model.resetCanvas();
    this.view.setCanvasZoomLevel(this.model.zoomLevel);
    this.view.setCanvasItemPosition(
      this.model.moveableXPos,
      this.model.moveableYPos
    );
  }

  // Handles image input changes
  imageInputHandler(event, number) {
    const file = event.target.files[0];

    if (file) {
      this.model.createImageSource(file, number);
      this.view.setImageSource(number, this.model.images[number]);
    }

    if (this.view.checkInputFileElementStatus()) {
      this.view.enableControls(true);
      this.view.updateCanvasState(this.model.currentState, "slider-view");
      this.model.setCanvasState("slider-view");
    }
  }
}
