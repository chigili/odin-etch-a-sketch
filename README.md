A browser-based sketchpad that allows users to draw by hovering over a grid of squares, similar to a toy Etch-a-Sketch.

### Features

- **Dynamic Grid Generation**: Creates a 16x16 grid of square divs using JavaScript
- **Hover Drawing**: Mouse hover effects leave a pixelated trail across the grid
- **Customizable Grid Size**: Button to generate new grids with user-specified dimensions
- **Responsive Design**: Grid maintains consistent total size regardless of square count
- **Flexbox Layout**: Uses CSS Flexbox for grid positioning and alignment

### How to Use

1. **Drawing**: Move your mouse over the grid squares to create a drawing trail
2. **New Grid**: Click the button at the top to create a new grid
   - Enter a number between 1-100 for squares per side
   - The new grid will replace the existing one in the same space
3. **Reset**: Generate a new grid to clear your current drawing

### Technical Implementation

- **Grid Creation**: JavaScript dynamically generates div elements in a container
- **Event Handling**: Hover event listeners change square colors on mouse enter/leave
- **User Input**: Prompt dialog for custom grid sizes with input validation
- **DOM Manipulation**: Removes existing grid and creates new one based on user input
- **CSS Flexbox**: Ensures proper grid layout without using CSS Grid
- **Responsive Sizing**: Maintains 960px total width regardless of grid dimensions

### Technologies Used

- HTML5
- CSS3 (Flexbox)
- Vanilla JavaScript
- DOM Manipulation
- Event Listeners

### Getting Started

1. Clone the repository
2. Open `index.html` in your browser
3. Start drawing by hovering over the grid!

### Project Structure

```
etch-a-sketch/
├── index.html
├── style.css
└── script.js
```

This project demonstrates fundamental web development concepts including DOM manipulation, event handling, Flexbox layout, and user input validation.
