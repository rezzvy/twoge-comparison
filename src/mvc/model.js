export default class Model {
  constructor() {
    // Initialize state and data
    this.currentState = "not-ready";
    this.isDragging = false;
    this.zoomLevel = 1;

    // Initialize moveable data for drag operations
    this.moveableData = {
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
    };

    // Store image sources
    this.images = {
      one: "",
      two: "",
    };
  }

  // Getter for moveable element's X position
  get moveableXPos() {
    return this.moveableData.currentX;
  }

  // Getter for moveable element's Y position
  get moveableYPos() {
    return this.moveableData.currentY;
  }

  // Check if the device is touch-enabled
  isOnTouchDevice() {
    return "ontouchstart" in window;
  }

  // Update starting positions for drag
  updateMoveableDataStartXAndY(clientX, clientY) {
    this.moveableData.startX = clientX;
    this.moveableData.startY = clientY;
  }

  // Calculate new positions during drag
  calculateMoveableData(clientX, clientY) {
    this.moveableData.currentX += clientX - this.moveableData.startX;
    this.moveableData.currentY += clientY - this.moveableData.startY;

    this.moveableData.startX = clientX;
    this.moveableData.startY = clientY;
  }

  // Reset canvas state to default
  resetCanvas() {
    this.zoomLevel = 1;
    this.moveableData.startX = 0;
    this.moveableData.startY = 0;
    this.moveableData.currentX = 0;
    this.moveableData.currentY = 0;
  }

  // Update zoom level
  updateZoomLevel(command) {
    command === "+" ? (this.zoomLevel += 0.25) : (this.zoomLevel -= 0.25);
  }

  // Set the current state of the canvas
  setCanvasState(state) {
    this.currentState = state;
  }

  // Create image URL from file input
  createImageSource(file, number) {
    if (this.images[number] !== "") {
      URL.revokeObjectURL(this.images[number]);
    }

    this.images[number] = URL.createObjectURL(file);
  }
}
