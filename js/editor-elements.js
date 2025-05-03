// ==================== Canvas Element Handling ====================
// Add image to canvas
function addImageToCanvas(imageUrl, x = 50, y = 50) {
    const elementsContainer = document.querySelector('.scrapbook-elements');
    
    const imageElement = document.createElement('div');
    imageElement.className = 'canvas-element image-element';
    imageElement.style.left = `${x}px`;
    imageElement.style.top = `${y}px`;
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Canvas image';
    
    imageElement.appendChild(img);
    
    // Add resize handles
    addResizeHandles(imageElement);
    
    elementsContainer.appendChild(imageElement);
    
    // Make element directly manipulable
    makeElementDraggable(imageElement);
    makeElementResizable(imageElement);
    makeElementRotatable(imageElement);
    
    // Select the element
    selectElement(imageElement);
}

// Add sticker to canvas
function addStickerToCanvas(stickerUrl, x = 100, y = 100) {
    const elementsContainer = document.querySelector('.scrapbook-elements');
    
    const stickerElement = document.createElement('div');
    stickerElement.className = 'canvas-element sticker-element';
    stickerElement.style.left = `${x}px`;
    stickerElement.style.top = `${y}px`;
    
    const img = document.createElement('img');
    img.src = stickerUrl;
    img.alt = 'Sticker';
    
    stickerElement.appendChild(img);
    
    // Add resize handles
    addResizeHandles(stickerElement);
    
    elementsContainer.appendChild(stickerElement);
    
    // Close sticker modal
    document.getElementById('sticker-modal').classList.remove('active');
    
    // Make element directly manipulable
    makeElementDraggable(stickerElement);
    makeElementResizable(stickerElement);
    makeElementRotatable(stickerElement);
    
    // Select the element
    selectElement(stickerElement);
}

// Add text element to canvas
function addTextToCanvas(x = 150, y = 150) {
    const elementsContainer = document.querySelector('.scrapbook-elements');
    
    const textElement = document.createElement('div');
    textElement.className = 'canvas-element text-element';
    textElement.style.left = `${x}px`;
    textElement.style.top = `${y}px`;
    
    const textContent = document.createElement('div');
    textContent.contentEditable = true;
    textContent.className = 'text-content';
    textContent.innerHTML = 'Double click to edit text';
    
    textElement.appendChild(textContent);
    
    // Add resize handles
    addResizeHandles(textElement);
    
    elementsContainer.appendChild(textElement);
    
    // Make text element interactive
    makeElementDraggable(textElement);
    makeElementResizable(textElement);
    makeElementRotatable(textElement);

    // Select the element
    selectElement(textElement);
    
    // Double click to edit text
    textContent.addEventListener('dblclick', function() {
        this.focus();
    });
}

// Add note element to canvas
function addNoteToCanvas() {
    const elementsContainer = document.querySelector('.scrapbook-elements');
    
    const noteElement = document.createElement('div');
    noteElement.className = 'canvas-element note-element yellow'; // Default color
    noteElement.style.left = '200px';
    noteElement.style.top = '200px';
    
    const noteContent = document.createElement('div');
    noteContent.contentEditable = true;
    noteContent.className = 'note-content';
    noteContent.innerHTML = 'Double click to edit note content';
    
    noteElement.appendChild(noteContent);
    
    // Add resize handles
    addResizeHandles(noteElement);
    
    elementsContainer.appendChild(noteElement);
    
    // Make note element interactive
    makeElementDraggable(noteElement);
    makeElementResizable(noteElement);
    makeElementRotatable(noteElement);
    
    // Select the element
    selectElement(noteElement);
    
    // Double click to edit note
    noteContent.addEventListener('dblclick', function() {
        this.focus();
    });
}

// Add polaroid element to canvas
function addPolaroidToCanvas(x = 100, y = 100) {
    const elementsContainer = document.querySelector('.scrapbook-elements');
    
    const polaroidElement = document.createElement('div');
    polaroidElement.className = 'canvas-element polaroid-element';
    polaroidElement.style.left = `${x}px`;
    polaroidElement.style.top = `${y}px`;
    polaroidElement.style.width = '250px';
    polaroidElement.style.height = '300px';
    polaroidElement.style.backgroundColor = '#fff';
    polaroidElement.style.boxShadow = '0 0 15px rgba(0,0,0,0.1)';
    polaroidElement.style.padding = '15px 15px 50px 15px';
    
    const img = document.createElement('img');
    img.src = 'images/placeholder.jpg';
    img.alt = 'Polaroid';
    img.style.width = '100%';
    img.style.height = 'calc(100% - 35px)';
    img.style.objectFit = 'cover';
    
    const caption = document.createElement('div');
    caption.contentEditable = true;
    caption.className = 'polaroid-caption';
    caption.textContent = 'Add caption here';
    caption.style.marginTop = '15px';
    caption.style.textAlign = 'center';
    caption.style.fontFamily = 'cursive';
    
    polaroidElement.appendChild(img);
    polaroidElement.appendChild(caption);
    
    // Add resize handles
    addResizeHandles(polaroidElement);
    
    elementsContainer.appendChild(polaroidElement);
    
    // Make polaroid element interactive
    makeElementDraggable(polaroidElement);
    makeElementResizable(polaroidElement);
    makeElementRotatable(polaroidElement);
    
    // Select the element
    selectElement(polaroidElement);
}

// Add tape element to canvas
function addTapeToCanvas(x = 100, y = 100) {
    const elementsContainer = document.querySelector('.scrapbook-elements');
    
    const tapeElement = document.createElement('div');
    tapeElement.className = 'canvas-element tape-element';
    tapeElement.style.left = `${x}px`;
    tapeElement.style.top = `${y}px`;
    tapeElement.style.width = '150px';
    tapeElement.style.height = '40px';
    tapeElement.style.backgroundColor = 'rgba(173, 216, 230, 0.6)';
    tapeElement.style.borderRadius = '3px';
    
    // Add resize handles
    addResizeHandles(tapeElement);
    
    elementsContainer.appendChild(tapeElement);
    
    // Make tape element interactive
    makeElementDraggable(tapeElement);
    makeElementResizable(tapeElement);
    makeElementRotatable(tapeElement);
    
    // Select the element
    selectElement(tapeElement);
}

// Add frame element to canvas
function addFrameToCanvas(x = 100, y = 100) {
    const elementsContainer = document.querySelector('.scrapbook-elements');
    
    const frameElement = document.createElement('div');
    frameElement.className = 'canvas-element frame-element';
    frameElement.style.left = `${x}px`;
    frameElement.style.top = `${y}px`;
    frameElement.style.width = '250px';
    frameElement.style.height = '200px';
    frameElement.style.border = '15px solid #8b4513';
    frameElement.style.backgroundColor = '#f5f5f5';
    frameElement.style.boxShadow = '0 0 10px rgba(0,0,0,0.3)';
    
    // Add resize handles
    addResizeHandles(frameElement);
    
    elementsContainer.appendChild(frameElement);
    
    // Make frame element interactive
    makeElementDraggable(frameElement);
    makeElementResizable(frameElement);
    makeElementRotatable(frameElement);
    
    // Select the element
    selectElement(frameElement);
}

// Add resize handles to an element
function addResizeHandles(element) {
    // Create resize handles
    const positions = ['nw', 'ne', 'sw', 'se'];
    positions.forEach(pos => {
        const handle = document.createElement('div');
        handle.className = `resize-handle ${pos}`;
        element.appendChild(handle);
    });
    
    // Create rotation handle
    const rotationHandle = document.createElement('div');
    rotationHandle.className = 'rotation-handle';
    element.appendChild(rotationHandle);
}

// Select an element and update property panel
function selectElement(element) {
    // Remove selection from all elements
    document.querySelectorAll('.canvas-element').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to this element
    element.classList.add('selected');
    
    // Update property panel
    updatePropertyPanelForElement(element);
}

// Make element draggable functionality
function makeElementDraggable(element) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    
    // Clear previous event listeners if any
    const oldDragStart = element._dragStart;
    if (oldDragStart) {
        element.removeEventListener('mousedown', oldDragStart);
    }
    
    // Create new dragStart function and save reference
    function dragStart(e) {
        // Only drag if clicking on the element itself, image, or content
        if (e.target === element || e.target.tagName === 'IMG' || 
            e.target.classList.contains('text-content') || 
            e.target.classList.contains('note-content')) {
            e.preventDefault();
            e.stopPropagation();
            
            // Select this element
            selectElement(element);
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
                
            // Add temporary global event listeners
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
            
            isDragging = true;
        }
    }
    
    // Save function reference for later removal
    element._dragStart = dragStart;
    
    element.addEventListener('mousedown', dragStart);
    
    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        
        // Remove temporary event listeners
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', dragEnd);
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            
            xOffset = currentX;
            yOffset = currentY;
            
            // Update element position, preserving rotation and scale
            updateElementTransform(element, currentX, currentY);
        }
    }
}

// Make element resizable functionality
function makeElementResizable(element) {
    const handles = element.querySelectorAll('.resize-handle');
    
    handles.forEach(handle => {
        handle.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = element.offsetWidth;
            const startHeight = element.offsetHeight;
            const handleClass = this.className;
            
            // Store original position
            const rect = element.getBoundingClientRect();
            const originalLeft = rect.left;
            const originalTop = rect.top;
            const originalRight = rect.right;
            const originalBottom = rect.bottom;
            
            // Store original transform values
            let transformX = 0;
            let transformY = 0;
            let rotation = 0;
            let scale = 1;
            
            const transform = element.style.transform;
            if (transform) {
                const translateMatch = transform.match(/translate3d\(([^,]+),\s*([^,]+),/);
                if (translateMatch) {
                    transformX = parseFloat(translateMatch[1]);
                    transformY = parseFloat(translateMatch[2]);
                }
                
                const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
                if (rotateMatch) {
                    rotation = parseFloat(rotateMatch[1]);
                }
                
                const scaleMatch = transform.match(/scale\(([^)]+)\)/);
                if (scaleMatch) {
                    scale = parseFloat(scaleMatch[1]);
                }
            }
            
            // Convert rotation to radians
            const radians = rotation * (Math.PI / 180);
            const cos = Math.cos(radians);
            const sin = Math.sin(radians);
            
            const mouseMoveHandler = function(e) {
                e.preventDefault();
                
                // Calculate new dimensions
                let newWidth = startWidth;
                let newHeight = startHeight;
                let adjustX = 0;
                let adjustY = 0;
                
                // 拖动对角点时，固定对角的对应点
                if (handleClass.includes('se')) {  // 右下角 - 左上角固定
                    newWidth = startWidth + (e.clientX - startX);
                    newHeight = startHeight + (e.clientY - startY);
                    // 不需要调整位置，因为左上角是固定的
                } 
                else if (handleClass.includes('sw')) {  // 左下角 - 右上角固定
                    newWidth = startWidth - (e.clientX - startX);
                    newHeight = startHeight + (e.clientY - startY);
                    
                    if (rotation === 0) {
                        adjustX = e.clientX - startX;
                    } else {
                        adjustX = (e.clientX - startX) * cos;
                        adjustY = (e.clientX - startX) * sin;
                    }
                } 
                else if (handleClass.includes('ne')) {  // 右上角 - 左下角固定
                    newWidth = startWidth + (e.clientX - startX);
                    newHeight = startHeight - (e.clientY - startY);
                    
                    if (rotation === 0) {
                        adjustY = e.clientY - startY;
                    } else {
                        adjustX -= (e.clientY - startY) * sin;
                        adjustY += (e.clientY - startY) * cos;
                    }
                } 
                else if (handleClass.includes('nw')) {  // 左上角 - 右下角固定
                    newWidth = startWidth - (e.clientX - startX);
                    newHeight = startHeight - (e.clientY - startY);
                    
                    if (rotation === 0) {
                        adjustX = e.clientX - startX;
                        adjustY = e.clientY - startY;
                    } else {
                        // 处理旋转情况下的位置调整
                        const dx = e.clientX - startX;
                        const dy = e.clientY - startY;
                        adjustX = dx * cos - dy * sin;
                        adjustY = dx * sin + dy * cos;
                    }
                }
                
                // Apply minimum size
                newWidth = Math.max(newWidth, 20);
                newHeight = Math.max(newHeight, 20);
                
                // Update element size
                element.style.width = `${newWidth}px`;
                element.style.height = `${newHeight}px`;
                
                // 更新元素位置以保持固定的对角点
                let newTransformX = transformX + adjustX;
                let newTransformY = transformY + adjustY;
                
                // Update transform with new position
                element.style.transform = `translate3d(${newTransformX}px, ${newTransformY}px, 0) rotate(${rotation}deg) scale(${scale})`;
            };
            
            const mouseUpHandler = function() {
                document.removeEventListener('mousemove', mouseMoveHandler);
                document.removeEventListener('mouseup', mouseUpHandler);
            };
            
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        });
    });
}

// Make element rotatable functionality
function makeElementRotatable(element) {
    const rotationHandle = element.querySelector('.rotation-handle');
    
    rotationHandle.addEventListener('mousedown', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        // Store original transform values
        let transformX = 0;
        let transformY = 0;
        let currentRotation = 0;
        let scale = 1;
        
        const transform = element.style.transform;
        if (transform) {
            const translateMatch = transform.match(/translate3d\(([^,]+),\s*([^,]+),/);
            if (translateMatch) {
                transformX = parseFloat(translateMatch[1]);
                transformY = parseFloat(translateMatch[2]);
            }
            
            const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
            if (rotateMatch) {
                currentRotation = parseFloat(rotateMatch[1]);
            }
            
            const scaleMatch = transform.match(/scale\(([^)]+)\)/);
            if (scaleMatch) {
                scale = parseFloat(scaleMatch[1]);
            }
        }
        
        // Get element position and dimensions
        const elementRect = element.getBoundingClientRect();
        const centerX = elementRect.left + elementRect.width / 2;
        const centerY = elementRect.top + elementRect.height / 2;
        
        // Calculate initial angle
        const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        
        const mouseMoveHandler = function(e) {
            e.preventDefault();
            
            // Calculate new angle
            const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
            let newRotation = currentRotation + (angle - startAngle);
            
            // Normalize rotation angle
            if (newRotation > 180) newRotation -= 360;
            if (newRotation < -180) newRotation += 360;
            
            // Limit rotation to slider range
            if (newRotation > 30) newRotation = 30;
            if (newRotation < -30) newRotation = -30;
            
            // Update rotation slider value
            const rotationSlider = document.getElementById('element-rotation');
            if (rotationSlider) {
                rotationSlider.value = newRotation;
                document.getElementById('rotation-value').textContent = `${Math.round(newRotation)}°`;
            }
            
            // Update element transform preserving position and scale
            element.style.transform = `translate3d(${transformX}px, ${transformY}px, 0) rotate(${newRotation}deg) scale(${scale})`;
        };
        
        const mouseUpHandler = function() {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };
        
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });
}

// Update element transform preserving rotation and scale
function updateElementTransform(element, x, y) {
    let rotation = 0;
    let scale = 1;
    
    const transform = element.style.transform;
    if (transform) {
        const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
        if (rotateMatch) {
            rotation = parseFloat(rotateMatch[1]);
        }
        
        const scaleMatch = transform.match(/scale\(([^)]+)\)/);
        if (scaleMatch) {
            scale = parseFloat(scaleMatch[1]);
        }
    }
    
    // Apply the transform with new position values
    element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rotation}deg) scale(${scale})`;
}

// Update property panel values for selected element
function updatePropertyPanelForElement(element) {
    console.log('Updating property panel for element:', element);
    
    // If no selected element, return
    if (!element || !element.classList.contains('selected')) {
        return;
    }
    
    // Extract rotation value
    let rotation = 0;
    let scale = 1;
    const transform = element.style.transform;
    if (transform) {
        const rotateMatch = transform.match(/rotate\(([^)]+)deg\)/);
        if (rotateMatch) {
            rotation = parseFloat(rotateMatch[1]);
        }
        
        const scaleMatch = transform.match(/scale\(([^)]+)\)/);
        if (scaleMatch) {
            scale = parseFloat(scaleMatch[1]);
        }
    }
    
    // Update rotation slider
    const rotationSlider = document.getElementById('element-rotation');
    if (rotationSlider) {
        rotationSlider.value = rotation;
        document.getElementById('rotation-value').textContent = `${Math.round(rotation)}°`;
    }
    
    // Update scale slider
    const scaleSlider = document.getElementById('element-scale');
    if (scaleSlider) {
        scaleSlider.value = scale * 100;
        document.getElementById('scale-value').textContent = `${Math.round(scale * 100)}%`;
    }
    
    // Show/hide property sections based on element type
    const textProperties = document.querySelector('.text-properties');
    const stickerProperties = document.querySelector('.sticker-properties');
    const noteProperties = document.querySelector('.note-properties');
    const doodleProperties = document.querySelector('.doodle-properties');
    
    // Hide all specific property panels by default
    if (textProperties) textProperties.style.display = 'none';
    if (stickerProperties) stickerProperties.style.display = 'none';
    if (noteProperties) noteProperties.style.display = 'none';
    if (doodleProperties) doodleProperties.style.display = 'none';
    
    // Show appropriate property panel based on element type
    if (element.classList.contains('text-element') && textProperties) {
        textProperties.style.display = 'block';
    } else if ((element.classList.contains('sticker-element') || element.classList.contains('image-element')) && stickerProperties) {
        stickerProperties.style.display = 'block';
    } else if (element.classList.contains('note-element') && noteProperties) {
        noteProperties.style.display = 'block';
    }
} 