// ====================== Sticker Handler Module ======================

// Dependencies: sticker-config.js

// Sticker category file mapping (will be populated during initialization)
let CATEGORY_FILES = {};

// Check if configuration is loaded
function checkConfigLoaded() {
    if (typeof STICKERS_BASE_PATH === 'undefined' || 
        typeof STICKER_CATEGORIES === 'undefined' || 
        typeof ALL_CATEGORIES === 'undefined' ||
        typeof initCategoryFiles === 'undefined') {
        console.error('Sticker configuration not loaded. Make sure sticker-config.js is included before sticker-handler.js');
        return false;
    }
    return true;
}

// Get actual files in a category
function getCategoryFiles(category) {
    // If we already have predefined file list, return it
    if (CATEGORY_FILES[category] && CATEGORY_FILES[category].length > 0) {
        return CATEGORY_FILES[category];
    }
    
    console.warn(`No predefined sticker files for: ${category}, will attempt to load from folder`);
    return [];
}

// Initialize sticker modal
function initStickerModal() {
    console.log('Initializing sticker modal');
    
    // Bind modal close buttons
    const closeButtons = document.querySelectorAll('#sticker-modal .close-btn, #sticker-modal .btn-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('sticker-modal').classList.remove('active');
        });
    });
    
    // Add styles to sticker categories to make them scrollable
    const categoriesContainer = document.querySelector('.sticker-categories');
    if (categoriesContainer) {
        categoriesContainer.style.cssText = 'display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 15px; max-height: 100px; overflow-y: auto; padding: 5px;';
        
        // Clear existing category buttons
        categoriesContainer.innerHTML = '';
        
        // Add all category buttons
        ALL_CATEGORIES.forEach((category, index) => {
            // Create category button
            const categoryBtn = document.createElement('button');
            categoryBtn.className = 'category-btn' + (index === 0 ? ' active' : '');
            categoryBtn.setAttribute('data-category', category);
            categoryBtn.textContent = STICKER_CATEGORIES[category] || category;
    
            // Click event to change category
            categoryBtn.addEventListener('click', () => {
                // Remove active class from all buttons
                document.querySelectorAll('.category-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                categoryBtn.classList.add('active');
                
                // Load stickers for this category
                loadStickersFromCategory(category);
            });
            
            // Add to container
            categoriesContainer.appendChild(categoryBtn);
        });
    }
    
    // Load stickers for first category
    if (ALL_CATEGORIES.length > 0) {
        loadStickersFromCategory(ALL_CATEGORIES[0]);
    }
}

// Initialize sticker selection buttons
function initStickerModalButtons() {
    // Bind sticker category buttons
    const categoryButtons = document.querySelectorAll('.category-button');
    categoryButtons.forEach(button => {
        const category = button.getAttribute('data-category');
        if (category) {
            button.addEventListener('click', function() {
                // Show sticker modal
                const modal = document.getElementById('sticker-modal');
                if (modal) {
                    modal.classList.add('active');
                    
                    // Load stickers for this category
                    loadStickersFromCategory(category);
                    
                    // Select this category button
                    document.querySelectorAll('.category-btn').forEach(btn => {
                        btn.classList.remove('active');
                        if (btn.getAttribute('data-category') === category) {
                            btn.classList.add('active');
                        }
                    });
                }
            });
        }
    });
    
    // Initialize modal close buttons
    const closeButtons = document.querySelectorAll('#sticker-modal .close-btn, #sticker-modal .btn-close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = document.getElementById('sticker-modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Initialize sidebar sticker functionality
function initSidebarStickers() {
    console.log('Initializing sidebar stickers');
    
    // Create sticker tab
    const tabsContainer = document.querySelector('.sidebar-tabs');
    if (tabsContainer) {
        // Check if sticker tab already exists
        let stickerTab = document.querySelector('.sidebar-tabs .tab[data-tab="stickers"]');
        
        // If it doesn't exist, create it
        if (!stickerTab) {
            stickerTab = document.createElement('div');
            stickerTab.className = 'tab';
            stickerTab.setAttribute('data-tab', 'stickers');
            stickerTab.textContent = 'Stickers';
            tabsContainer.appendChild(stickerTab);
        }
        
        // Add click event
        stickerTab.addEventListener('click', function() {
            // Remove active state from all tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active state to current tab
            this.classList.add('active');
            
            // Hide all content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            // If sticker content area doesn't exist, create it
            let stickersContent = document.getElementById('stickers-content');
            if (!stickersContent) {
                stickersContent = createStickersContent();
            }
            
            // Show sticker content
            stickersContent.style.display = 'block';
            
            // Default load fruit category
            loadSidebarStickers('Fruits');
        });
        
        // Create sticker content area
        createStickersContent();
    }
    
    console.log('Sidebar stickers initialization completed');
}

// Create sticker content area
function createStickersContent() {
    console.log('Creating stickers content area');
    
    // Create content container
    const stickersContent = document.createElement('div');
    stickersContent.className = 'tab-content';
    stickersContent.id = 'stickers-content';
    stickersContent.style.display = 'none';
    
    // Create category selector
    const categorySelector = document.createElement('div');
    categorySelector.className = 'sticker-category-selector';
    categorySelector.style.cssText = 'display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px;';
    
    // Add all category buttons
    ALL_CATEGORIES.forEach((category, index) => {
        const categoryBtn = document.createElement('button');
        categoryBtn.className = 'sidebar-category-btn';
        categoryBtn.setAttribute('data-category', category);
        categoryBtn.textContent = STICKER_CATEGORIES[category] || category;
        categoryBtn.style.cssText = 'padding: 5px 8px; font-size: 12px; border: 1px solid #ddd; border-radius: 4px; background: #f5f5f5; cursor: pointer;';
        
        if (index === 0) {
            categoryBtn.style.background = '#0066ff';
            categoryBtn.style.color = 'white';
            categoryBtn.classList.add('active');
        }
        
        categoryBtn.addEventListener('click', function() {
            // Remove active state from all buttons
            document.querySelectorAll('.sidebar-category-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = '#f5f5f5';
                btn.style.color = 'black';
            });
            
            // Add active state to current button
            this.classList.add('active');
            this.style.background = '#0066ff';
            this.style.color = 'white';
            
            // Load stickers for this category
            loadSidebarStickers(this.getAttribute('data-category'));
        });
        
        categorySelector.appendChild(categoryBtn);
    });
    
    // Create and add sticker grid
    const stickersGrid = document.createElement('div');
    stickersGrid.className = 'sidebar-stickers-grid';
    stickersGrid.id = 'sidebar-stickers-grid';
    stickersGrid.style.cssText = 'display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; height: 600px; padding: 5px;';
    
    // Add elements to content area
    stickersContent.appendChild(categorySelector);
    stickersContent.appendChild(stickersGrid);
    
    // Add to editor sidebar
    const sidebarContainer = document.querySelector('.editor-sidebar');
    if (sidebarContainer) {
        sidebarContainer.appendChild(stickersContent);
    }
    
    return stickersContent;
}

// Load sidebar stickers
function loadSidebarStickers(category) {
    console.log(`Loading sidebar stickers for category: ${category}`);
    
    // Get sidebar stickers grid
    const stickersGrid = document.getElementById('sidebar-stickers-grid');
    if (!stickersGrid) {
        console.error('Cannot find sidebar stickers grid: #sidebar-stickers-grid');
        return;
    }
    
    // Clear grid
    stickersGrid.innerHTML = '';
    
    // Get category files - or use correct path to try to load directly
    const files = getCategoryFiles(category);
    
    // Show loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.textContent = 'Loading stickers...';
    loadingMsg.style.gridColumn = '1 / -1';
    loadingMsg.style.textAlign = 'center';
    loadingMsg.style.padding = '20px';
    stickersGrid.appendChild(loadingMsg);
    
    // Delay execution, let loading message show up
    setTimeout(() => {
        // Clear grid, prepare to add stickers
        stickersGrid.innerHTML = '';
        
        if (files.length === 0) {
            console.log(`Attempting to load directly from folder: ${category}`);
            
            // If there are no predefined files, try to load directly using display name
            const genericFiles = [];
            for (let i = 1; i <= 15; i++) {
                genericFiles.push(`food${i}.png`);
            }
            
            // Add generic stickers to grid
            addStickersToSidebarGrid(stickersGrid, category, genericFiles);
            
        } else {
            // Add predefined stickers to grid
            addStickersToSidebarGrid(stickersGrid, category, files);
        }
    }, 100);
}

// Load stickers from specified category
function loadStickersFromCategory(category) {
    console.log(`Loading stickers from category: ${category}`);
    
    // Get sticker grid
    const stickerGrid = document.getElementById('sticker-grid-modal');
    if (!stickerGrid) {
        console.error('Cannot find sticker grid: #sticker-grid-modal');
        return;
    }
    
    // Clear grid
    stickerGrid.innerHTML = '';
    
    // Adjust grid style, increase height and remove scrollbar
    stickerGrid.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; height: 500px; padding: 10px;';
    
    // Show loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.className = 'loading-message';
    loadingMsg.textContent = 'Loading stickers...';
    loadingMsg.style.padding = '20px';
    loadingMsg.style.textAlign = 'center';
    loadingMsg.style.width = '100%';
    stickerGrid.appendChild(loadingMsg);
    
    // Get category files
    const files = getCategoryFiles(category);
    console.log(`Found ${files.length} sticker files`);
    
    // Delay execution, let loading message show up
    setTimeout(() => {
        // Clear grid, prepare to add stickers
        stickerGrid.innerHTML = '';
        
        if (files.length === 0) {
            console.log(`Attempting to load directly from folder: ${category}`);
            
            // If there are no predefined files, try to load directly using display name
            const genericFiles = [];
            for (let i = 1; i <= 15; i++) {
                genericFiles.push(`food${i}.png`);
            }
            
            // Add stickers to grid
            addStickersToModalGrid(stickerGrid, category, genericFiles);
            
        } else {
            // Add stickers to grid
            addStickersToModalGrid(stickerGrid, category, files);
        }
    }, 100);
}

// Add stickers to sidebar grid
function addStickersToSidebarGrid(stickersGrid, category, files) {
    // Add stickers to grid
    files.forEach(file => {
        // Create sticker container
        const stickerItem = document.createElement('div');
        stickerItem.className = 'sidebar-sticker-item';
        stickerItem.style.cssText = 'aspect-ratio: 1; border: 1px solid #eee; border-radius: 4px; overflow: hidden; position: relative; cursor: grab; background: white;';
        
        // Create sticker image
        const stickerImg = document.createElement('img');
        const imagePath = `${STICKERS_BASE_PATH}/${category}/${file}`;
        stickerImg.alt = file.replace('.png', '');
        stickerImg.style.cssText = 'width: 100%; height: 100%; object-fit: contain; padding: 2px;';
        stickerImg.draggable = true;
        
        // First use image placeholder, then try to load actual image
        stickerImg.src = 'images/3151 placeholder.jpg';
        
        // Try to load actual image
        const actualImage = new Image();
        actualImage.onload = function() {
            stickerImg.src = imagePath;
        };
        actualImage.onerror = function() {
            console.error(`Failed to load sticker: ${imagePath}`);
            // Keep placeholder image
            stickerItem.classList.add('load-error');
            stickerItem.title = 'Cannot load sticker image';
        };
        actualImage.src = imagePath;
        
        // Add drag functionality
        stickerImg.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', imagePath);
            e.dataTransfer.effectAllowed = 'copy';
        });
        
        // Add click functionality
        stickerItem.addEventListener('click', function() {
            addStickerToCanvas(imagePath);
        });
        
        // Add image to sticker item
        stickerItem.appendChild(stickerImg);
        
        // Add sticker item to grid
        stickersGrid.appendChild(stickerItem);
    });
    
    // If no stickers were added, show prompt information
    if (stickersGrid.children.length === 0) {
        const noStickers = document.createElement('div');
        noStickers.textContent = 'No available stickers';
        noStickers.style.gridColumn = '1 / -1';
        noStickers.style.textAlign = 'center';
        noStickers.style.padding = '20px';
        stickersGrid.appendChild(noStickers);
    }
}

// Add stickers to modal grid
function addStickersToModalGrid(stickerGrid, category, files) {
    // Add stickers to grid
    files.forEach(file => {
        // Create sticker item
        const stickerItem = document.createElement('div');
        stickerItem.className = 'sticker-item';
        
        // Create sticker image
        const imagePath = `${STICKERS_BASE_PATH}/${category}/${file}`;
        const stickerImage = document.createElement('img');
        stickerImage.alt = file.replace('.png', '');
        stickerImage.loading = 'lazy'; // Lazy load
        
        // First use image placeholder, then try to load actual image
        stickerImage.src = 'images/3151 placeholder.jpg';
        
        // Try to load actual image
        const actualImage = new Image();
        actualImage.onload = function() {
            stickerImage.src = imagePath;
        };
        actualImage.onerror = function() {
            console.error(`Failed to load sticker: ${imagePath}`);
            // Keep placeholder image
            stickerItem.classList.add('load-error');
            stickerItem.title = 'Cannot load sticker image';
        };
        actualImage.src = imagePath;
        
        // Add click event - Add to canvas
        stickerItem.addEventListener('click', function() {
            addStickerToCanvas(imagePath);
            // Close modal
            document.getElementById('sticker-modal').classList.remove('active');
        });
        
        // Add drag functionality
        stickerImage.draggable = true;
        stickerImage.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', imagePath);
            e.dataTransfer.effectAllowed = 'copy';
        });
        
        // Add image to sticker item
        stickerItem.appendChild(stickerImage);
        
        // Add sticker item to grid
        stickerGrid.appendChild(stickerItem);
    });
    
    // If no stickers were added, show prompt information
    if (stickerGrid.children.length === 0) {
        const noStickers = document.createElement('div');
        noStickers.className = 'no-stickers-message';
        noStickers.textContent = `No available stickers: ${STICKER_CATEGORIES[category] || category}`;
        noStickers.style.padding = '20px';
        noStickers.style.textAlign = 'center';
        noStickers.style.width = '100%';
        stickerGrid.appendChild(noStickers);
    }
}

// Initialize canvas drop area
function initCanvasDrop() {
    console.log('Initializing canvas drop area');
    
    // Get canvas element container
    const elementsContainer = document.querySelector('.scrapbook-elements');
    if (!elementsContainer) {
        console.error('Cannot find canvas elements container');
        return;
    }
    
    // Add drag and drop handling
    document.querySelector('.scrapbook-page').addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });
    
    document.querySelector('.scrapbook-page').addEventListener('drop', function(e) {
        e.preventDefault();
        
        // Get dragged data
        const stickerSrc = e.dataTransfer.getData('text/plain');
        if (stickerSrc && stickerSrc.includes(STICKERS_BASE_PATH)) {
            // Calculate placement position
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Add sticker to specified position
            addStickerToCanvas(stickerSrc, x, y);
        }
    });
    
    console.log('Canvas drop area initialization completed');
}

// Add sticker to canvas
function addStickerToCanvas(stickerSrc, x, y) {
    console.log(`Adding sticker to canvas: ${stickerSrc}`);
    
    // Create image element
    const img = new Image();
    
    img.onload = function() {
        // Create canvas element container
        const elementsContainer = document.querySelector('.scrapbook-elements');
        if (!elementsContainer) {
            console.error('Cannot find canvas elements container');
            return;
        }
        
        // Create sticker element
        const stickerElement = document.createElement('div');
        stickerElement.className = 'canvas-element sticker-element';
        stickerElement.style.position = 'absolute';
        
        // If coordinates are provided, use them, otherwise use central position
        if (x !== undefined && y !== undefined) {
            stickerElement.style.left = `${x}px`;
            stickerElement.style.top = `${y}px`;
            stickerElement.style.transform = 'translate(-50%, -50%)';
        } else {
            stickerElement.style.left = '50%';
            stickerElement.style.top = '50%';
            stickerElement.style.transform = 'translate(-50%, -50%)';
        }
        
        stickerElement.style.zIndex = '10';
        
        // Create sticker image
        const stickerImg = document.createElement('img');
        stickerImg.src = stickerSrc;
        stickerImg.style.width = '100px';
        stickerImg.style.height = 'auto';
        stickerElement.appendChild(stickerImg);
        
        // Add sticker element to canvas
        elementsContainer.appendChild(stickerElement);
        
        // Apply interactivity
        if (typeof makeElementDraggable === 'function') {
            makeElementDraggable(stickerElement);
        }
        if (typeof makeElementResizable === 'function') {
            makeElementResizable(stickerElement);
        }
        if (typeof makeElementRotatable === 'function') {
            makeElementRotatable(stickerElement);
        }
        if (typeof selectElement === 'function') {
            selectElement(stickerElement);
        }
        
        console.log('Sticker added to canvas successfully');
    };
    
    img.onerror = function() {
        console.error(`Failed to load sticker image: ${stickerSrc}`);
        alert('Cannot load sticker image');
    };
    
    img.src = stickerSrc;
}

// Initialize
window.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing sticker handler module...');
    
    // Check if configuration is loaded
    if (!checkConfigLoaded()) {
        alert('Sticker configuration could not be loaded. Some features may not work correctly.');
        return;
    }
    
    // Initialize category files
    CATEGORY_FILES = initCategoryFiles();
    
    // Initialize sticker modal
    initStickerModal();
    
    // Initialize sidebar stickers
    initSidebarStickers();
    
    // Initialize canvas drop
    initCanvasDrop();
    
    // Initialize sticker modal buttons
    initStickerModalButtons();
    
    console.log('Sticker handler module initialized successfully');
}); 