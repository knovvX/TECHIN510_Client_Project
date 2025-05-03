// ====================== Canvas Functions ======================

// Initialize canvas functionality
function initCanvas() {
    // Get canvas element
    const canvas = document.querySelector('.scrapbook-canvas');
    if (!canvas) return;
    
    // Clear canvas elements
    clearCanvas();
    
    // Initialize zoom and drag
    initCanvasZoom();
    
    // Initialize canvas click event - for deselecting
    canvas.addEventListener('click', (e) => {
        // If click on canvas background (not on canvas elements), deselect all
        if (e.target === canvas || e.target.classList.contains('scrapbook-elements')) {
            deselectAllElements();
        }
    });
    
    // Check URL parameters, if new journal, apply default background
    if (isNewJournal()) {
        applyDefaultBackground();
        
        // Clear any existing elements
        const elementsContainer = document.querySelector('.scrapbook-elements');
        if (elementsContainer) {
            elementsContainer.innerHTML = '';
        }
        
        // Reset journal title and description
        const titleInput = document.getElementById('journal-title');
        const descriptionTextarea = document.getElementById('journal-description');
        
        if (titleInput) titleInput.value = '';
        if (descriptionTextarea) descriptionTextarea.value = '';
    }
}

// Check if it's a new journal
function isNewJournal() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('new') === 'true';
}

// Apply default background to canvas
function applyDefaultBackground() {
    const background = document.querySelector('.scrapbook-background');
    if (background) {
        background.style.backgroundColor = '#FFFFFF';
        background.style.backgroundImage = 'none';
    }
}

// Clear canvas - remove all elements
function clearCanvas() {
    const elementsContainer = document.querySelector('.scrapbook-elements');
    if (elementsContainer) {
        elementsContainer.innerHTML = '';
    }
    
    const background = document.querySelector('.scrapbook-background');
    if (background) {
        background.style.backgroundColor = '#FFFFFF';
        background.style.backgroundImage = 'none';
    }
}

// Delete selected element
function deleteSelectedElement() {
    const selected = document.querySelector('.canvas-element.selected');
    if (selected) {
        selected.remove();
        
        // Hide all property panels
        hideAllPropertyPanels();
    }
}

// Hide all property panels
function hideAllPropertyPanels() {
    const textProperties = document.querySelector('.text-properties');
    const stickerProperties = document.querySelector('.sticker-properties');
    const noteProperties = document.querySelector('.note-properties');
    const doodleProperties = document.querySelector('.doodle-properties');
    
    if (textProperties) textProperties.style.display = 'none';
    if (stickerProperties) stickerProperties.style.display = 'none';
    if (noteProperties) noteProperties.style.display = 'none';
    if (doodleProperties) doodleProperties.style.display = 'none';
}

// Deselect all elements
function deselectAllElements() {
    document.querySelectorAll('.canvas-element').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Hide all property panels
    hideAllPropertyPanels();
}

// Initialize canvas zoom and drag functionality
function initCanvasZoom() {
    const canvasContainer = document.querySelector('.scrapbook-canvas-container');
    const canvas = document.querySelector('.scrapbook-canvas');
    if (!canvasContainer || !canvas) return;
    
    let scale = 1;
    const maxScale = 2;
    const minScale = 0.5;
    
    // Listen for mouse wheel events
    canvasContainer.addEventListener('wheel', (e) => {
        // Prevent default behavior
        e.preventDefault();
        
        // If Ctrl key is pressed, zoom
        if (e.ctrlKey) {
            // Get wheel direction
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            
            // Calculate new scale
            let newScale = scale + delta;
            
            // Limit scale range
            newScale = Math.min(Math.max(newScale, minScale), maxScale);
            
            // Apply new scale
            if (newScale !== scale) {
                scale = newScale;
                canvas.style.transform = `scale(${scale})`;
            }
        }
    });
    
    // Disable browser's pinch-to-zoom gestures
    document.addEventListener('gesturestart', (e) => {
        e.preventDefault();
    });
    
    document.addEventListener('gesturechange', (e) => {
        e.preventDefault();
    });
}

// Save current canvas state
function saveCanvas() {
    // Get canvas content
    const canvas = document.querySelector('.scrapbook-canvas');
    const elementsContainer = document.querySelector('.scrapbook-elements');
    if (!canvas || !elementsContainer) return;
    
    // Create save object
    const saveData = {
        backgroundColor: canvas.style.backgroundColor || '#ffffff',
        elements: []
    };
    
    // Save all elements on canvas
    const elements = elementsContainer.querySelectorAll('.canvas-element');
    elements.forEach(element => {
        // Get element basic attributes
        const elData = {
            type: getElementType(element),
            style: {
                left: element.style.left,
                top: element.style.top,
                width: element.style.width,
                height: element.style.height,
                transform: element.style.transform,
                zIndex: element.style.zIndex
            }
        };
        
        // Save specific data based on element type
        if (element.classList.contains('image-element') || element.classList.contains('sticker-element')) {
            const img = element.querySelector('img');
            if (img) {
                elData.src = img.src;
            }
        } else if (element.classList.contains('text-element')) {
            const textContent = element.querySelector('.text-content');
            if (textContent) {
                elData.content = textContent.innerHTML;
                elData.style.color = textContent.style.color;
                elData.style.fontFamily = textContent.style.fontFamily;
                elData.style.fontSize = textContent.style.fontSize;
                elData.style.fontWeight = textContent.style.fontWeight;
            }
        } else if (element.classList.contains('note-element')) {
            const noteContent = element.querySelector('.note-content');
            if (noteContent) {
                elData.content = noteContent.innerHTML;
            }
            // Save note color
            if (element.classList.contains('yellow')) elData.color = 'yellow';
            else if (element.classList.contains('blue')) elData.color = 'blue';
            else if (element.classList.contains('green')) elData.color = 'green';
            else if (element.classList.contains('pink')) elData.color = 'pink';
        } else if (element.classList.contains('polaroid-element')) {
            const img = element.querySelector('img');
            const caption = element.querySelector('.polaroid-caption');
            if (img) elData.src = img.src;
            if (caption) elData.caption = caption.textContent;
        }
        
        saveData.elements.push(elData);
    });
    
    // Convert to JSON string
    const jsonData = JSON.stringify(saveData);
    
    // Use localStorage to save (for demonstration)
    localStorage.setItem('scrapbookData', jsonData);
    
    // Show save success
    alert('Journal saved!');
    
    return jsonData;
}

// Get element type
function getElementType(element) {
    if (element.classList.contains('image-element')) return 'image';
    if (element.classList.contains('sticker-element')) return 'sticker';
    if (element.classList.contains('text-element')) return 'text';
    if (element.classList.contains('note-element')) return 'note';
    if (element.classList.contains('polaroid-element')) return 'polaroid';
    if (element.classList.contains('tape-element')) return 'tape';
    if (element.classList.contains('frame-element')) return 'frame';
    return 'unknown';
}

// Load previously saved canvas state
function loadCanvas(jsonData) {
    // If no data provided, try loading from localStorage
    if (!jsonData) {
        jsonData = localStorage.getItem('scrapbookData');
        if (!jsonData) return false;
    }
    
    try {
        // Parse JSON data
        const saveData = JSON.parse(jsonData);
        
        // Clear current canvas
        clearCanvas();
        
        // Set background color
        const canvas = document.querySelector('.scrapbook-canvas');
        if (canvas && saveData.backgroundColor) {
            canvas.style.backgroundColor = saveData.backgroundColor;
        }
        
        // Recreate all elements
        if (saveData.elements && Array.isArray(saveData.elements)) {
            saveData.elements.forEach(elData => {
                recreateElement(elData);
            });
        }
        
        return true;
    } catch (error) {
        console.error('Failed to load canvas data:', error);
        return false;
    }
}

// Recreate element based on saved data
function recreateElement(elData) {
    if (!elData || !elData.type) return;
    
    switch (elData.type) {
        case 'image':
            if (elData.src) {
                addImageToCanvas(elData.src);
            }
            break;
        case 'sticker':
            if (elData.src) {
                addStickerToCanvas(elData.src);
            }
            break;
        case 'text':
            const textElement = addTextToCanvas();
            if (elData.content && textElement) {
                const textContent = textElement.querySelector('.text-content');
                if (textContent) {
                    textContent.innerHTML = elData.content;
                    
                    // Apply styles
                    if (elData.style.color) textContent.style.color = elData.style.color;
                    if (elData.style.fontFamily) textContent.style.fontFamily = elData.style.fontFamily;
                    if (elData.style.fontSize) textContent.style.fontSize = elData.style.fontSize;
                    if (elData.style.fontWeight) textContent.style.fontWeight = elData.style.fontWeight;
                }
            }
            break;
        case 'note':
            const noteElement = addNoteToCanvas();
            if (elData.content && noteElement) {
                const noteContent = noteElement.querySelector('.note-content');
                if (noteContent) {
                    noteContent.innerHTML = elData.content;
                }
                
                // Set note color
                if (elData.color) {
                    noteElement.className = `canvas-element note-element ${elData.color}`;
                }
            }
            break;
        case 'polaroid':
            const polaroidElement = addPolaroidToCanvas();
            if (polaroidElement) {
                if (elData.src) {
                    const img = polaroidElement.querySelector('img');
                    if (img) img.src = elData.src;
                }
                if (elData.caption) {
                    const caption = polaroidElement.querySelector('.polaroid-caption');
                    if (caption) caption.textContent = elData.caption;
                }
            }
            break;
        case 'tape':
            addTapeToCanvas();
            break;
        case 'frame':
            addFrameToCanvas();
            break;
    }
    
    // Get recently added element
    const elements = document.querySelectorAll('.canvas-element');
    const element = elements[elements.length - 1];
    if (!element) return;
    
    // Apply position and size
    if (elData.style) {
        if (elData.style.left) element.style.left = elData.style.left;
        if (elData.style.top) element.style.top = elData.style.top;
        if (elData.style.width) element.style.width = elData.style.width;
        if (elData.style.height) element.style.height = elData.style.height;
        if (elData.style.transform) element.style.transform = elData.style.transform;
        if (elData.style.zIndex) element.style.zIndex = elData.style.zIndex;
    }
}

// Print current canvas
function printCanvas() {
    // Create a new print window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow pop-up windows to print your journal');
        return;
    }
    
    // Get canvas element
    const canvas = document.querySelector('.scrapbook-canvas');
    if (!canvas) return;
    
    // Create print content
    printWindow.document.write(`
        <html>
        <head>
            <title>My Journal Print Page</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                }
                .print-container {
                    width: 100%;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    box-sizing: border-box;
                }
                .canvas-clone {
                    width: 100%;
                    height: auto;
                    aspect-ratio: 1 / 1;
                    position: relative;
                    background-color: ${canvas.style.backgroundColor || '#ffffff'};
                    overflow: hidden;
                }
                .element-clone {
                    position: absolute;
                }
                img {
                    max-width: 100%;
                    height: auto;
                }
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="print-container">
                <div class="no-print" style="margin-bottom: 20px; text-align: center;">
                    <button onclick="window.print()">Print</button>
                    <button onclick="window.close()">Close</button>
                </div>
                <div class="canvas-clone">
                    ${canvas.innerHTML}
                </div>
            </div>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Preview canvas (for modal display)
function previewCanvas() {
    const previewModal = document.getElementById('preview-modal');
    const previewContainer = document.querySelector('.preview-container');
    if (!previewModal || !previewContainer) return;
    
    // Get canvas element
    const canvas = document.querySelector('.scrapbook-canvas');
    if (!canvas) return;
    
    // Clear preview container
    previewContainer.innerHTML = '';
    
    // Create canvas clone
    const canvasClone = document.createElement('div');
    canvasClone.className = 'canvas-clone';
    canvasClone.style.backgroundColor = canvas.style.backgroundColor || '#ffffff';
    
    // Clone all elements
    const elements = canvas.querySelectorAll('.canvas-element');
    elements.forEach(element => {
        const clone = element.cloneNode(true);
        
        // Remove interactive controls
        clone.querySelectorAll('.resize-handle, .rotation-handle').forEach(handle => {
            handle.remove();
        });
        
        // Remove selected state
        clone.classList.remove('selected');
        
        canvasClone.appendChild(clone);
    });
    
    // Add to preview container
    previewContainer.appendChild(canvasClone);
    
    // Show preview modal
    previewModal.classList.add('active');
} 