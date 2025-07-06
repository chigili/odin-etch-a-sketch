// Grid configuration
let GRID_SIZE = 16;
const CONTAINER_SIZE = 640; // Fixed container size in pixels
const MAX_GRID_SIZE = 100; // Maximum allowed grid size

// Drawing modes
const MODES = {
  HOVER: "hover",
  CLICK: "click",
  RAINBOW: "rainbow",
  DARKENING: "darkening",
};

let currentMode = MODES.DARKENING; // Start with darkening mode
let isMouseDown = false;

/**
 * Creates a grid of the specified size
 * @param {number} size - The number of squares per side
 */
function createGrid(size = GRID_SIZE) {
  console.log(`Creating ${size}x${size} grid...`);

  const container = document.getElementById("grid-container");

  // Clear any existing content
  container.innerHTML = "";

  // Calculate square size based on container size
  const squareSize = CONTAINER_SIZE / size;

  // Create all squares
  const totalSquares = size * size;
  for (let i = 0; i < totalSquares; i++) {
    const square = createSquare(i, size, squareSize);
    container.appendChild(square);
  }

  // Update grid size display
  document.getElementById("grid-size").textContent = `${size}x${size}`;

  console.log(`Grid created successfully! Square size: ${squareSize}px`);
}

/**
 * Creates a single grid square element
 * @param {number} index - The square's position index
 * @param {number} gridSize - The size of the grid
 * @param {number} squareSize - The size of each square in pixels
 * @returns {HTMLElement} The created square element
 */
function createSquare(index, gridSize, squareSize) {
  const square = document.createElement("div");
  square.classList.add("grid-square");

  // Set square size dynamically
  square.style.width = `${squareSize}px`;
  square.style.height = `${squareSize}px`;

  // Calculate row and column for data attributes
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;

  // Add data attributes for tracking
  square.setAttribute("data-row", row);
  square.setAttribute("data-col", col);
  square.setAttribute("data-index", index);
  square.setAttribute("data-interactions", "0"); // Track interactions for darkening

  // Add event listeners based on current mode
  addSquareEventListeners(square);

  return square;
}

/**
 * Adds appropriate event listeners to a square based on current mode
 * @param {HTMLElement} square - The square element
 */
function addSquareEventListeners(square) {
  // Always add hover events for trail effect
  square.addEventListener("mouseenter", handleSquareHover);
  square.addEventListener("mouseleave", handleSquareLeave);

  // Add click events for click mode
  square.addEventListener("click", handleSquareClick);

  // Add mouse down/up for drag drawing
  square.addEventListener("mousedown", handleMouseDown);
  square.addEventListener("mouseup", handleMouseUp);
}

/**
 * Handles mouse hover over squares
 * @param {Event} event - The hover event
 */
function handleSquareHover(event) {
  const square = event.target;

  // Draw on hover for these modes
  if (
    currentMode === MODES.HOVER ||
    currentMode === MODES.RAINBOW ||
    currentMode === MODES.DARKENING ||
    (currentMode === MODES.CLICK && isMouseDown)
  ) {
    drawOnSquare(square);
  }
}

/**
 * Handles mouse leaving squares
 * @param {Event} event - The leave event
 */
function handleSquareLeave(event) {
  // Remove temporary hover effects if needed
  // (Not needed for persistent drawing modes)
}

/**
 * Handles click events on squares
 * @param {Event} event - The click event
 */
function handleSquareClick(event) {
  const square = event.target;

  // All modes respond to clicks
  drawOnSquare(square);
}

/**
 * Handles mouse down events
 * @param {Event} event - The mouse down event
 */
function handleMouseDown(event) {
  isMouseDown = true;
  if (currentMode === MODES.CLICK) {
    drawOnSquare(event.target);
  }
}

/**
 * Handles mouse up events
 */
function handleMouseUp() {
  isMouseDown = false;
}

/**
 * Draws on a square based on the current mode
 * @param {HTMLElement} square - The square to draw on
 */
function drawOnSquare(square) {
  console.log(`🎨 Drawing on square in mode: ${currentMode}`); // Debug log

  switch (currentMode) {
    case MODES.HOVER:
    case MODES.CLICK:
      // Clear any existing styles first
      square.style.removeProperty("box-shadow");
      square.style.removeProperty("border");

      // Force cyan background color with high specificity
      square.style.setProperty("background-color", "#00ffff", "important");
      square.style.setProperty(
        "box-shadow",
        "0 0 8px #00ffff, 0 0 12px rgba(0, 255, 255, 0.5)",
        "important"
      );
      console.log("🟦 Applied cyan color (#00ffff) to square");
      break;

    case MODES.RAINBOW:
      const rainbowColor = getRainbowColor();
      square.style.removeProperty("box-shadow");
      square.style.setProperty("background-color", rainbowColor, "important");
      square.style.setProperty(
        "box-shadow",
        `0 0 5px ${rainbowColor}`,
        "important"
      );
      console.log(`🌈 Applied rainbow color: ${rainbowColor}`);
      break;

    case MODES.DARKENING:
      applyDarkeningEffect(square);
      console.log("🌑 Applied darkening effect");
      break;

    default:
      console.log("❓ Unknown mode:", currentMode);
      square.style.setProperty("background-color", "#00ffff", "important"); // Fallback to cyan
  }
}

/**
 * Applies progressive darkening effect to a square
 * @param {HTMLElement} square - The square to darken
 */
function applyDarkeningEffect(square) {
  let interactions = parseInt(square.getAttribute("data-interactions") || "0");
  interactions++;

  // Limit to 10 interactions for full black
  if (interactions > 10) interactions = 10;

  square.setAttribute("data-interactions", interactions);

  // Calculate darkness (10% per interaction)
  const darkness = interactions * 0.1;

  // Start with light green and progressively darken it
  let baseColor = square.getAttribute("data-base-color");
  if (!baseColor) {
    // Light green base color
    baseColor = "144,238,144"; // Light green RGB
    square.setAttribute("data-base-color", baseColor);
  }

  // Apply darkening to the light green base color
  const [r, g, b] = baseColor.split(",").map(Number);
  const darkenedR = Math.floor(r * (1 - darkness));
  const darkenedG = Math.floor(g * (1 - darkness));
  const darkenedB = Math.floor(b * (1 - darkness));

  // Use setProperty with important to override CSS
  const darkenedColor = `rgb(${darkenedR}, ${darkenedG}, ${darkenedB})`;
  square.style.setProperty("background-color", darkenedColor, "important");
  square.style.setProperty(
    "box-shadow",
    `0 0 5px ${darkenedColor}`,
    "important"
  );

  console.log(
    `🌱 Applied darkening: interaction ${interactions}, color: ${darkenedColor}`
  );
}

/**
 * Returns a random rainbow color (ROYGBIV spectrum)
 * @returns {string} A random rainbow color
 */
function getRainbowColor() {
  const rainbowColors = [
    "#FF0000", // Red
    "#FF7F00", // Orange
    "#FFFF00", // Yellow
    "#00FF00", // Green
    "#0000FF", // Blue
    "#4B0082", // Indigo
    "#9400D3", // Violet
  ];
  return rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
}

/**
 * Returns a random RGB color
 * @returns {string} A random RGB color string
 */
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Resets all squares to their default state
 */
function resetGrid() {
  const squares = document.querySelectorAll(".grid-square");
  squares.forEach((square) => {
    square.style.backgroundColor = "#000"; // Make sure it's black, not white
    square.setAttribute("data-interactions", "0");
    square.removeAttribute("data-base-color");
    square.classList.remove("hovered", "drawn", "darkening");
  });
  console.log("Grid reset!");
}

/**
 * Prompts user for new grid size and creates new grid
 */
function createNewGrid() {
  const userInput = prompt(
    `Enter the number of squares per side for the new grid (1-${MAX_GRID_SIZE}):`,
    GRID_SIZE.toString()
  );

  if (userInput === null) return; // User canceled

  const newSize = parseInt(userInput);

  // Validate input
  if (isNaN(newSize) || newSize < 1 || newSize > MAX_GRID_SIZE) {
    alert(`Please enter a valid number between 1 and ${MAX_GRID_SIZE}.`);
    return;
  }

  // Update grid size and create new grid
  GRID_SIZE = newSize;
  createGrid(newSize);

  console.log(`New grid created: ${newSize}x${newSize}`);
}

/**
 * Toggles between different drawing modes
 */
function toggleMode() {
  // Cycle through modes in order
  switch (currentMode) {
    case MODES.DARKENING:
      currentMode = MODES.HOVER;
      break;
    case MODES.HOVER:
      currentMode = MODES.CLICK;
      break;
    case MODES.CLICK:
      currentMode = MODES.RAINBOW;
      break;
    case MODES.RAINBOW:
      currentMode = MODES.DARKENING;
      break;
    default:
      currentMode = MODES.DARKENING;
  }

  // Update UI
  const modeDisplay = document.getElementById("current-mode");
  const toggleButton = document.getElementById("toggle-mode-btn");
  const instructionsElement = document.getElementById("mode-instructions");

  const modeNames = {
    [MODES.HOVER]: "Hover",
    [MODES.CLICK]: "Click & Drag",
    [MODES.RAINBOW]: "Rainbow",
    [MODES.DARKENING]: "Progressive Darkening",
  };

  const modeInstructions = {
    [MODES.HOVER]: "Hover over squares to draw!",
    [MODES.CLICK]: "Click and drag to draw!",
    [MODES.RAINBOW]: "Hover over squares for rainbow colors!",
    [MODES.DARKENING]:
      "Hover over squares to draw! Each square darkens by 10% with each interaction.",
  };

  // Update all UI elements
  if (modeDisplay) {
    modeDisplay.textContent = modeNames[currentMode];
  }

  if (toggleButton) {
    toggleButton.textContent = `Toggle Mode: ${modeNames[currentMode]}`;
  }

  if (instructionsElement) {
    instructionsElement.textContent = modeInstructions[currentMode];
    console.log(`Instructions updated to: ${modeInstructions[currentMode]}`);
  } else {
    console.error("Instructions element not found!");
  }

  console.log(`Mode changed to: ${modeNames[currentMode]}`);
}

// Event listeners for buttons
document.addEventListener("DOMContentLoaded", function () {
  // Create initial grid
  createGrid();

  // Button event listeners
  document
    .getElementById("new-grid-btn")
    .addEventListener("click", createNewGrid);
  document.getElementById("reset-btn").addEventListener("click", resetGrid);
  document
    .getElementById("toggle-mode-btn")
    .addEventListener("click", toggleMode);

  // Global mouse event listeners for drag functionality
  document.addEventListener("mouseup", handleMouseUp);

  // Update initial mode display and instructions
  const instructionsElement = document.getElementById("mode-instructions");
  if (instructionsElement) {
    instructionsElement.textContent =
      "Hover over squares to draw! Each square darkens by 10% with each interaction.";
  }
  document.getElementById("current-mode").textContent = "Progressive Darkening";

  console.log(
    "Initial setup complete, instructions element found:",
    instructionsElement
  );
});

// Keyboard shortcuts
document.addEventListener("keydown", function (event) {
  switch (event.key.toLowerCase()) {
    case "r":
      resetGrid();
      break;
    case "n":
      createNewGrid();
      break;
    case "m":
      toggleMode();
      break;
  }
});
