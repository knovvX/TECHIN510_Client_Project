// ====================== File Upload Handler ======================

// Initialize upload area functionality
function initUploadArea() {
    console.log('Initializing file upload area');

    // Get upload area and file input elements
    const uploadArea = document.querySelector('.upload-area');
    const fileInput = document.getElementById('file-upload');
    const uploadBtn = document.querySelector('.upload-btn');
    
    if (!uploadArea || !fileInput || !uploadBtn) {
        console.error('Upload area elements not found');
        return;
    }
    
    // Handle upload button click
    uploadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        fileInput.click();
    });
    
    // Handle file selection
    fileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            handleFiles(this.files);
        }
    });
    
    // Handle drag and drop events
    uploadArea.addEventListener('dragenter', preventDefault);
    uploadArea.addEventListener('dragover', preventDefault);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // Helper function - prevent default events
    function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('drag-over');
    }
    
    // Helper function - handle drag leave event
    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
    }
    
    // Helper function - handle drop event
    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('drag-over');
        
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }
}

// Process uploaded files
function handleFiles(files) {
    console.log(`Processing ${files.length} files`);
    
    // Get media grid and upload area
    const mediaGrid = document.querySelector('.media-grid');
    const uploadArea = document.querySelector('.upload-area');
    
    if (!mediaGrid) {
        console.error('Media grid element not found');
        return;
    }
    
    // Show loading state
    if (uploadArea) {
        uploadArea.innerHTML = '<div class="loading">Processing files...</div>';
    }
    
    // Process each file
    Array.from(files).forEach(file => {
        // Check file type
        if (!file.type.match('image.*')) {
            console.log(`Skipping non-image file: ${file.name}`);
            return;
        }
        
        // Create file reader
        const reader = new FileReader();
        
        // Handle load complete
        reader.onload = (function(theFile) {
            return function(e) {
                // Create media item
                const mediaItem = document.createElement('div');
                mediaItem.className = 'media-item';
                
                // Set media item content
                mediaItem.innerHTML = `
                    <div class="media-preview">
                        <img src="${e.target.result}" alt="${theFile.name}">
                    </div>
                    <div class="media-name">${theFile.name}</div>
                `;
                
                // Add click event - add to canvas
                mediaItem.addEventListener('click', function() {
                    addImageToCanvas(e.target.result);
                });
                
                // Add to media grid
                mediaGrid.appendChild(mediaItem);
                
                // Restore upload area
                if (uploadArea) {
                    uploadArea.innerHTML = `
                        <img src="images/upload-icon.svg" alt="Upload" class="upload-icon">
                        <p>Drop files here</p>
                        <p>or</p>
                        <button class="upload-btn">Browse Files</button>
                        <input type="file" id="file-upload" accept="image/*" multiple style="display: none;">
                    `;
                    
                    // Reinitialize upload area
                    initUploadArea();
                }
            };
        })(file);
        
        // Read file as data URL
        reader.readAsDataURL(file);
    });
}

// Initialize event bindings
window.addEventListener('DOMContentLoaded', function() {
    // Initialize file upload area
    initUploadArea();
    
    // Initialize media filters
    initMediaFilters();
});

// Initialize media filter functionality
function initMediaFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active state from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            
            // Add active state to current button
            this.classList.add('active');
            
            // Get filter type
            const filterType = this.getAttribute('data-filter');
            
            // Apply filter
            applyMediaFilter(filterType);
        });
    });
}

// Apply media filter
function applyMediaFilter(filterType) {
    const mediaItems = document.querySelectorAll('.media-item');
    if (!mediaItems.length) return;
    
    mediaItems.forEach(item => {
        if (filterType === 'all') {
            item.style.display = 'block';
        } else {
            // Show/hide based on media type
            const isMatchingType = item.classList.contains(filterType);
            item.style.display = isMatchingType ? 'block' : 'none';
        }
    });
} 