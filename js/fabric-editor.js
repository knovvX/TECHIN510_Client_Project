/**
 * Fabric.js Editor - Core Script
 * 基于Fabric.js的多媒体日记编辑器
 */

// 全局变量
let canvas;  // Fabric.js画布实例
let categoryFiles = {}; // 贴纸分类和文件映射
let currentCategory = 'Fruits'; // 当前选中的贴纸分类
let hasUnsavedChanges = false; // 跟踪是否有未保存的更改
let lastSaveTime = null; // 最后保存时间

// 初始化编辑器
document.addEventListener('DOMContentLoaded', function() {
    // 初始化Fabric.js画布
    initFabricCanvas();
    
    // 加载贴纸分类和文件
    loadStickerCategories();
    
    // 绑定UI事件
    bindUIEvents();
    
    // 加载URL参数(如果编辑现有日记)
    loadFromUrlParams();
    
    // 离开页面前检查未保存内容
    window.addEventListener('beforeunload', beforeUnloadHandler);
    
    // 添加键盘事件监听器
    document.addEventListener('keydown', handleKeyboardEvents);
});

/**
 * 初始化Fabric.js画布
 */
function initFabricCanvas() {
    // Create Fabric canvas instance
    canvas = new fabric.Canvas('fabric-canvas', {
        backgroundColor: '#ffffff',
        preserveObjectStacking: true, // Maintain object stacking order
        stopContextMenu: true, // Disable right-click menu
        selection: true, // Allow multi-selection
        selectionColor: 'rgba(100, 100, 255, 0.3)', // Selection box color
        selectionBorderColor: '#0066ff', // Selection border color
        selectionLineWidth: 1 // Selection border width
    });
    
    // Set canvas size with portrait 4:3 ratio
    const containerWidth = document.querySelector('.editor-canvas-container').offsetWidth - 40;
    const containerHeight = document.querySelector('.editor-canvas-container').offsetHeight - 40;
    
    // Calculate dimensions for a 4:3 portrait ratio
    let canvasWidth, canvasHeight;
    
    // Start with height as the limiting dimension
    canvasHeight = Math.min(containerHeight, 800);
    canvasWidth = canvasHeight * 0.75; // 3:4 ratio (portrait)
    
    // If width exceeds container, recalculate
    if (canvasWidth > containerWidth) {
        canvasWidth = containerWidth;
        canvasHeight = canvasWidth * 4/3; // 4:3 ratio (portrait)
    }
    
    // Apply dimensions
    canvas.setWidth(canvasWidth);
    canvas.setHeight(canvasHeight);
    
    // Set this information to inputs in settings panel
    const widthInput = document.getElementById('canvas-width');
    const heightInput = document.getElementById('canvas-height');
    
    if (widthInput) widthInput.value = Math.round(canvasWidth);
    if (heightInput) heightInput.value = Math.round(canvasHeight);
    
    // Update canvas size and make responsive
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    // Set default options
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = '#0066ff';
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.borderColor = '#0066ff';
    fabric.Object.prototype.borderScaleFactor = 1;
    
    // Listen for object modification events
    canvas.on('object:modified', function() {
        hasUnsavedChanges = true;
        updateObjectProperties();
    });
    
    canvas.on('object:moving', function() {
        hasUnsavedChanges = true;
    });
    
    canvas.on('object:scaling', function() {
        hasUnsavedChanges = true;
    });
    
    canvas.on('object:rotating', function() {
        hasUnsavedChanges = true;
    });
    
    canvas.on('selection:created', updateObjectProperties);
    canvas.on('selection:updated', updateObjectProperties);
    canvas.on('selection:cleared', clearObjectProperties);
}

/**
 * 更新画布大小
 */
function updateCanvasSize() {
    const containerWidth = document.querySelector('.editor-canvas-container').offsetWidth - 40;
    const containerHeight = document.querySelector('.editor-canvas-container').offsetHeight - 40;
    
    // Calculate dimensions for a 4:3 portrait ratio
    let canvasWidth, canvasHeight;
    
    // Get current width and height from settings if available
    const widthInput = document.getElementById('canvas-width');
    const heightInput = document.getElementById('canvas-height');
    
    // If custom dimensions set, use those (maintaining the ratio)
    if (widthInput && heightInput && widthInput.value && heightInput.value) {
        canvasWidth = parseInt(widthInput.value, 10);
        canvasHeight = parseInt(heightInput.value, 10);
    } else {
        // Start with height as the limiting dimension
        canvasHeight = Math.min(containerHeight, 800);
        canvasWidth = canvasHeight * 0.75; // 3:4 ratio (portrait)
        
        // If width exceeds container, recalculate
        if (canvasWidth > containerWidth) {
            canvasWidth = containerWidth;
            canvasHeight = canvasWidth * 4/3; // 4:3 ratio (portrait)
        }
    }
    
    // Apply dimensions
    canvas.setWidth(canvasWidth);
    canvas.setHeight(canvasHeight);
    canvas.renderAll();
}

/**
 * 绑定UI事件
 */
function bindUIEvents() {
    // 标签切换
    document.querySelectorAll('.sidebar-tabs .tab').forEach(tab => {
        tab.addEventListener('click', function() {
            // 移除所有标签的active类
            document.querySelectorAll('.sidebar-tabs .tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // 隐藏所有内容
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // 激活当前标签和内容
            this.classList.add('active');
            const tabContent = document.getElementById(`${this.getAttribute('data-tab')}-content`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });
    
    // 保存按钮
    document.getElementById('save-btn').addEventListener('click', function() {
        showSaveModal();
    });
    
    // 撤销按钮
    document.getElementById('undo-btn').addEventListener('click', function() {
        if (canvas._objects.length > 0) {
            canvas.remove(canvas._objects[canvas._objects.length - 1]);
            canvas.renderAll();
            hasUnsavedChanges = true;
        }
    });
    
    // 预览按钮
    document.getElementById('preview-btn').addEventListener('click', function() {
        showPreview();
    });
    
    // 打印按钮
    document.getElementById('print-btn').addEventListener('click', function() {
        printCanvas();
    });
    
    // 返回按钮
    document.getElementById('close-btn').addEventListener('click', function() {
        if (hasUnsavedChanges) {
            if (confirm('You have unsaved changes. Save before leaving?')) {
                showSaveModal();
            } else {
                window.location.href = 'journal.html';
            }
        } else {
            window.location.href = 'journal.html';
        }
    });
    
    // 添加基本形状
    document.getElementById('add-text-btn').addEventListener('click', addText);
    document.getElementById('add-rect-btn').addEventListener('click', addRectangle);
    document.getElementById('add-circle-btn').addEventListener('click', addCircle);
    document.getElementById('add-triangle-btn').addEventListener('click', addTriangle);
    
    // 添加装饰元素
    document.getElementById('add-polaroid-btn').addEventListener('click', addPolaroid);
    document.getElementById('add-note-btn').addEventListener('click', addStickyNote);
    document.getElementById('add-frame-btn').addEventListener('click', addFrame);
    
    // 画布设置
    document.getElementById('apply-canvas-settings').addEventListener('click', applyCanvasSettings);
    
    // 图层控制
    document.getElementById('bring-forward-btn').addEventListener('click', bringForward);
    document.getElementById('send-backward-btn').addEventListener('click', sendBackward);
    
    // 对齐控制
    document.getElementById('align-left-btn').addEventListener('click', alignLeft);
    document.getElementById('align-center-btn').addEventListener('click', alignCenter);
    document.getElementById('align-right-btn').addEventListener('click', alignRight);
    
    // 保存确认
    document.querySelector('#save-modal .confirm-btn').addEventListener('click', function() {
        const title = document.getElementById('journal-title').value;
        const description = document.getElementById('journal-description').value;
        
        document.getElementById('save-modal').classList.remove('active');
        saveCanvas(title, description);
    });
    
    // 保存取消
    document.querySelector('#save-modal .cancel-btn').addEventListener('click', function() {
        document.getElementById('save-modal').classList.remove('active');
    });
    
    // 预览关闭
    document.querySelector('#preview-modal .cancel-btn').addEventListener('click', function() {
        document.getElementById('preview-modal').classList.remove('active');
    });
    
    // 上传图片
    document.querySelector('.upload-btn').addEventListener('click', function() {
        document.getElementById('file-upload').click();
    });
    
    document.getElementById('file-upload').addEventListener('change', handleFileUpload);
    
    // 拖放上传区域
    const uploadArea = document.querySelector('.upload-area');
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', function() {
        this.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    });
    
    // 元素属性控制
    document.getElementById('element-opacity').addEventListener('input', function() {
        updateElementOpacity(this.value);
    });
    
    // 文本属性控制
    document.getElementById('text-font').addEventListener('change', updateTextFont);
    document.getElementById('text-size').addEventListener('change', updateTextSize);
    document.getElementById('text-color').addEventListener('input', updateTextColor);
    document.getElementById('bold-btn').addEventListener('click', toggleBold);
    document.getElementById('italic-btn').addEventListener('click', toggleItalic);
    document.getElementById('underline-btn').addEventListener('click', toggleUnderline);
    
    // 形状属性控制
    document.getElementById('shape-color').addEventListener('input', updateShapeColor);
    document.getElementById('shape-border-color').addEventListener('input', updateShapeBorderColor);
    document.getElementById('shape-border-width').addEventListener('input', updateShapeBorderWidth);
}

/**
 * 加载URL参数(编辑现有日记)
 */
function loadFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const journalId = urlParams.get('id');
    
    if (journalId) {
        try {
            const journal = LocalStorageManager.getJournalById(journalId);
            if (journal) {
                // 设置标题
                const titleInput = document.getElementById('journal-title');
                if (titleInput) {
                    titleInput.value = journal.title;
                }
                
                // TODO: 如果有现有图像，需要加载
                // 这需要一个单独的函数来处理
            }
        } catch (e) {
            console.error('Error loading journal:', e);
        }
    }
}

/**
 * 离开页面前检查
 */
function beforeUnloadHandler(e) {
    if (hasUnsavedChanges) {
        const message = 'You have unsaved changes. Are you sure you want to leave?';
        e.returnValue = message;
        return message;
    }
}

/**
 * 加载贴纸分类和文件
 */
function loadStickerCategories() {
    // 使用sticker-config.js中的配置
    if (typeof initCategoryFiles === 'function') {
        categoryFiles = initCategoryFiles();
        
        // 创建分类标签
        const categoryTabs = document.getElementById('category-tabs');
        if (categoryTabs) {
            categoryTabs.innerHTML = '';
            
            ALL_CATEGORIES.forEach(category => {
                const tab = document.createElement('div');
                tab.className = 'category-tab';
                tab.textContent = category;
                tab.dataset.category = category;
                
                if (category === currentCategory) {
                    tab.classList.add('active');
                }
                
                tab.addEventListener('click', function() {
                    // 更新当前分类
                    currentCategory = this.dataset.category;
                    
                    // 更新标签状态
                    document.querySelectorAll('.category-tab').forEach(t => {
                        t.classList.remove('active');
                    });
                    this.classList.add('active');
                    
                    // 加载该分类的贴纸
                    loadStickersForCategory(currentCategory);
                });
                
                categoryTabs.appendChild(tab);
            });
            
            // 加载默认分类的贴纸
            loadStickersForCategory(currentCategory);
        }
    } else {
        console.error('initCategoryFiles function not found. Make sure sticker-config.js is loaded.');
    }
}

/**
 * Load stickers for specific category
 */
function loadStickersForCategory(category) {
    const stickerPanel = document.getElementById('sticker-panel');
    if (!stickerPanel) return;
    
    stickerPanel.innerHTML = '';
    
    // Create category container
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'sticker-category';
    categoryDiv.innerHTML = `<h3>${category}</h3>`;
    
    // Create sticker grid
    const stickerGrid = document.createElement('div');
    stickerGrid.className = 'sticker-grid';
    
    // Add stickers
    if (categoryFiles[category] && categoryFiles[category].length > 0) {
        console.log(`Loading ${categoryFiles[category].length} stickers for category: ${category}`);
        
        categoryFiles[category].forEach(filename => {
            const stickerItem = document.createElement('div');
            stickerItem.className = 'sticker-item';
            
            // Use correct path for stickers: images/Food/[category]/[filename]
            const stickerPath = `${STICKERS_BASE_PATH}/${category}/${filename}`;
            // Encode path for display
            const encodedPath = encodeURI(stickerPath);
            
            console.log('Creating sticker with path:', stickerPath);
            console.log('Encoded path for display:', encodedPath);
            
            const img = document.createElement('img');
            img.src = encodedPath;
            img.alt = filename;
            img.dataset.path = stickerPath;
            
            img.addEventListener('load', function() {
                stickerItem.classList.add('loaded');
                console.log('Sticker image loaded successfully:', stickerPath);
            });
            
            img.addEventListener('error', function() {
                console.error('Failed to load sticker image:', stickerPath);
                stickerItem.innerHTML = 'Failed to load';
                stickerItem.classList.add('load-error');
            });
            
            stickerItem.appendChild(img);
            
            // Click to add sticker
            stickerItem.addEventListener('click', function() {
                console.log('Sticker clicked, adding to canvas:', stickerPath);
                addStickerToCanvas(stickerPath);
            });
            
            stickerGrid.appendChild(stickerItem);
        });
    } else {
        stickerGrid.innerHTML = '<div class="no-stickers">No stickers available for this category</div>';
    }
    
    categoryDiv.appendChild(stickerGrid);
    stickerPanel.appendChild(categoryDiv);
}

/**
 * Add sticker to canvas
 */
function addStickerToCanvas(stickerPath) {
    console.log('Adding sticker to canvas:', stickerPath);
    
    // Encode the URL to handle Chinese characters
    const encodedPath = encodeURI(stickerPath);
    console.log('Encoded sticker path:', encodedPath);
    
    // Create a new image element and add it to canvas when loaded
    const imgElement = new Image();
    imgElement.crossOrigin = 'anonymous';
    
    imgElement.onload = function() {
        console.log('Sticker loaded successfully via Image element:', imgElement.width, 'x', imgElement.height);
        
        // Create fabric image object from the loaded image
        const fabricImage = new fabric.Image(imgElement, {
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center'
        });
        
        // Adjust size, maintain aspect ratio
        const maxSize = 150;
        if (fabricImage.width > maxSize || fabricImage.height > maxSize) {
            if (fabricImage.width > fabricImage.height) {
                fabricImage.scaleToWidth(maxSize);
            } else {
                fabricImage.scaleToHeight(maxSize);
            }
        }
        
        // Add to canvas
        canvas.add(fabricImage);
        canvas.setActiveObject(fabricImage);
        canvas.renderAll();
        
        // Mark as having unsaved changes
        hasUnsavedChanges = true;
        console.log('Sticker added to canvas successfully');
    };
    
    imgElement.onerror = function() {
        console.error('Failed to load sticker image:', encodedPath);
        
        // Try alternative approach with direct URL
        fabric.Image.fromURL(encodedPath, function(img) {
            if (!img) {
                console.error('Both approaches failed to load the sticker');
                alert('Unable to load sticker image. Please check the path: ' + stickerPath);
                return;
            }
            
            // Adjust size, maintain aspect ratio
            const maxSize = 150;
            if (img.width > maxSize || img.height > maxSize) {
                if (img.width > img.height) {
                    img.scaleToWidth(maxSize);
                } else {
                    img.scaleToHeight(maxSize);
                }
            }
            
            // Place in canvas center
            img.set({
                left: canvas.width / 2,
                top: canvas.height / 2,
                originX: 'center',
                originY: 'center'
            });
            
            // Add to canvas
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
            
            // Mark as having unsaved changes
            hasUnsavedChanges = true;
            console.log('Sticker added to canvas with fallback method');
        }, { crossOrigin: 'anonymous' });
    };
    
    // Start loading the image
    imgElement.src = encodedPath;
}

/**
 * 处理文件上传
 */
function handleFileUpload(event) {
    if (event.target.files && event.target.files.length > 0) {
        handleFiles(event.target.files);
    }
}

/**
 * 处理上传的文件
 */
function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // 检查是否为图片
        if (!file.type.match('image.*')) {
            alert('Only image files are supported');
            continue;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // 添加到上传预览区域
            addToUploadedImages(e.target.result, file.name);
            
            // 也可以直接添加到画布
            // addImageToCanvas(e.target.result);
        };
        
        reader.readAsDataURL(file);
    }
}

/**
 * Add to uploaded images preview area
 */
function addToUploadedImages(dataUrl, filename) {
    const uploadedImagesContainer = document.getElementById('uploaded-images');
    if (!uploadedImagesContainer) return;
    
    // Create a grid layout if not already set
    if (uploadedImagesContainer.style.display !== 'grid') {
        uploadedImagesContainer.style.display = 'grid';
        uploadedImagesContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(80px, 1fr))';
        uploadedImagesContainer.style.gap = '10px';
        uploadedImagesContainer.style.padding = '10px';
    }
    
    const imageItem = document.createElement('div');
    imageItem.className = 'uploaded-image-item';
    imageItem.style.position = 'relative';
    imageItem.style.cursor = 'pointer';
    imageItem.style.borderRadius = '4px';
    imageItem.style.overflow = 'hidden';
    imageItem.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    imageItem.style.transition = 'transform 0.2s ease';
    imageItem.style.height = '80px';
    
    // Add hover effect
    imageItem.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    imageItem.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
    
    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = filename;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    
    // Click preview image to add to canvas
    imageItem.addEventListener('click', function() {
        addImageToCanvas(dataUrl);
    });
    
    imageItem.appendChild(img);
    uploadedImagesContainer.appendChild(imageItem);
}

/**
 * Add image to canvas
 */
function addImageToCanvas(url) {
    console.log('Adding image to canvas:', url);
    
    // Create a new image element
    const imgElement = new Image();
    
    imgElement.onload = function() {
        console.log('Image loaded successfully:', imgElement.width, 'x', imgElement.height);
        
        // Create fabric image from the loaded image
        const fabricImage = new fabric.Image(imgElement, {
            left: canvas.width / 2,
            top: canvas.height / 2,
            originX: 'center',
            originY: 'center'
        });
        
        // Adjust size, maintain aspect ratio
        const maxSize = 200;
        if (fabricImage.width > maxSize || fabricImage.height > maxSize) {
            if (fabricImage.width > fabricImage.height) {
                fabricImage.scaleToWidth(maxSize);
            } else {
                fabricImage.scaleToHeight(maxSize);
            }
        }
        
        // Add to canvas
        canvas.add(fabricImage);
        canvas.setActiveObject(fabricImage);
        canvas.renderAll();
        
        // Mark as having unsaved changes
        hasUnsavedChanges = true;
        console.log('Image added to canvas successfully');
    };
    
    imgElement.onerror = function() {
        console.error('Failed to load image:', url);
        alert('Failed to load image. Please try again or use a different image.');
    };
    
    // Start loading the image
    imgElement.src = url;
}

/**
 * 添加文本
 */
function addText() {
    const text = new fabric.Textbox('Edit this text', {
        left: canvas.width / 2,
        top: canvas.height / 2,
        fontFamily: 'Poppins',
        fontSize: 20,
        fill: '#000000',
        originX: 'center',
        originY: 'center',
        width: 200,
        textAlign: 'center'
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 添加矩形
 */
function addRectangle() {
    const rect = new fabric.Rect({
        left: canvas.width / 2,
        top: canvas.height / 2,
        width: 100,
        height: 100,
        fill: '#f8f8f8',
        stroke: '#000000',
        strokeWidth: 1,
        originX: 'center',
        originY: 'center',
        rx: 0,
        ry: 0
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 添加圆形
 */
function addCircle() {
    const circle = new fabric.Circle({
        left: canvas.width / 2,
        top: canvas.height / 2,
        radius: 50,
        fill: '#f8f8f8',
        stroke: '#000000',
        strokeWidth: 1,
        originX: 'center',
        originY: 'center'
    });
    
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 添加三角形
 */
function addTriangle() {
    const triangle = new fabric.Triangle({
        left: canvas.width / 2,
        top: canvas.height / 2,
        width: 100,
        height: 100,
        fill: '#f8f8f8',
        stroke: '#000000',
        strokeWidth: 1,
        originX: 'center',
        originY: 'center'
    });
    
    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 添加便签
 */
function addStickyNote() {
    const note = new fabric.Rect({
        left: canvas.width / 2,
        top: canvas.height / 2,
        width: 150,
        height: 150,
        fill: '#fffacd', // 浅黄色
        strokeWidth: 0,
        originX: 'center',
        originY: 'center',
        rx: 10,
        ry: 10,
        shadow: new fabric.Shadow({
            color: 'rgba(0,0,0,0.3)',
            blur: 5,
            offsetX: 3,
            offsetY: 3
        }),
        angle: -2 // 略微倾斜
    });
    
    const text = new fabric.Textbox('Write your note here', {
        left: 0,
        top: 0,
        fontFamily: 'Poppins',
        fontSize: 16,
        fill: '#333333',
        width: 130,
        textAlign: 'left'
    });
    
    // 组合便签和文本
    const group = new fabric.Group([note, text], {
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center'
    });
    
    canvas.add(group);
    canvas.setActiveObject(group);
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 添加相框
 */
function addFrame() {
    const outerRect = new fabric.Rect({
        width: 220,
        height: 220,
        fill: '#8b4513', // 棕色框
        originX: 'center',
        originY: 'center'
    });
    
    const innerRect = new fabric.Rect({
        width: 200,
        height: 200,
        fill: '#f5f5f5', // 内部浅灰色
        originX: 'center',
        originY: 'center'
    });
    
    // 组合外框和内框
    const frame = new fabric.Group([outerRect, innerRect], {
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
        shadow: new fabric.Shadow({
            color: 'rgba(0,0,0,0.3)',
            blur: 10,
            offsetX: 5,
            offsetY: 5
        })
    });
    
    canvas.add(frame);
    canvas.setActiveObject(frame);
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 添加拍立得
 */
function addPolaroid() {
    // 拍立得背景框
    const background = new fabric.Rect({
        width: 240,
        height: 280,
        fill: '#ffffff',
        originX: 'center',
        originY: 'center',
        shadow: new fabric.Shadow({
            color: 'rgba(0,0,0,0.3)',
            blur: 10,
            offsetX: 5,
            offsetY: 5
        })
    });
    
    // 拍立得照片区域
    const photoArea = new fabric.Rect({
        width: 220,
        height: 220,
        fill: '#f0f0f0', // 浅灰色
        originX: 'center',
        originY: 'top',
        top: -110
    });
    
    // 添加文本
    const caption = new fabric.Textbox('Add caption here', {
        width: 220,
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'Poppins',
        fill: '#333333',
        originX: 'center',
        originY: 'top',
        top: 125
    });
    
    // 组合为拍立得
    const polaroid = new fabric.Group([background, photoArea, caption], {
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: 'center',
        originY: 'center',
        angle: 3 // 轻微倾斜
    });
    
    canvas.add(polaroid);
    canvas.setActiveObject(polaroid);
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 更新对象属性
 */
function updateObjectProperties() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    // 更新不透明度值
    document.getElementById('element-opacity').value = activeObject.opacity * 100;
    document.getElementById('opacity-value').textContent = `${Math.round(activeObject.opacity * 100)}%`;
    
    // 隐藏所有属性面板
    document.querySelectorAll('.property-section').forEach(section => {
        section.style.display = 'none';
    });
    
    // 显示适合的属性面板
    if (activeObject.type === 'textbox' || activeObject.type === 'text') {
        // 文本属性
        document.querySelector('.text-properties').style.display = 'block';
        
        // 更新文本属性值
        document.getElementById('text-font').value = activeObject.fontFamily;
        document.getElementById('text-size').value = activeObject.fontSize;
        document.getElementById('text-color').value = activeObject.fill;
        
        // 更新文本样式按钮状态
        document.getElementById('bold-btn').classList.toggle('active', activeObject.fontWeight === 'bold');
        document.getElementById('italic-btn').classList.toggle('active', activeObject.fontStyle === 'italic');
        document.getElementById('underline-btn').classList.toggle('active', activeObject.underline === true);
    }
    else if (activeObject.type === 'rect' || activeObject.type === 'circle' || activeObject.type === 'triangle') {
        // 形状属性
        document.querySelector('.shape-properties').style.display = 'block';
        
        // 更新形状属性值
        document.getElementById('shape-color').value = activeObject.fill;
        document.getElementById('shape-border-color').value = activeObject.stroke;
        document.getElementById('shape-border-width').value = activeObject.strokeWidth;
        document.getElementById('border-width-value').textContent = `${activeObject.strokeWidth}px`;
    }
}

/**
 * 清除对象属性
 */
function clearObjectProperties() {
    // 隐藏所有属性面板
    document.querySelectorAll('.property-section').forEach(section => {
        section.style.display = 'none';
    });
}

/**
 * 更新元素不透明度
 */
function updateElementOpacity(value) {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    activeObject.set('opacity', value / 100);
    canvas.renderAll();
    
    document.getElementById('opacity-value').textContent = `${value}%`;
    
    hasUnsavedChanges = true;
}

/**
 * 更新文本字体
 */
function updateTextFont() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject || (activeObject.type !== 'textbox' && activeObject.type !== 'text')) return;
    
    activeObject.set('fontFamily', this.value);
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 更新文本大小
 */
function updateTextSize() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject || (activeObject.type !== 'textbox' && activeObject.type !== 'text')) return;
    
    activeObject.set('fontSize', parseInt(this.value, 10));
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 更新文本颜色
 */
function updateTextColor() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject || (activeObject.type !== 'textbox' && activeObject.type !== 'text')) return;
    
    activeObject.set('fill', this.value);
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 切换文本粗体
 */
function toggleBold() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject || (activeObject.type !== 'textbox' && activeObject.type !== 'text')) return;
    
    const isBold = activeObject.fontWeight === 'bold';
    activeObject.set('fontWeight', isBold ? 'normal' : 'bold');
    
    this.classList.toggle('active');
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 切换文本斜体
 */
function toggleItalic() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject || (activeObject.type !== 'textbox' && activeObject.type !== 'text')) return;
    
    const isItalic = activeObject.fontStyle === 'italic';
    activeObject.set('fontStyle', isItalic ? 'normal' : 'italic');
    
    this.classList.toggle('active');
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 切换文本下划线
 */
function toggleUnderline() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject || (activeObject.type !== 'textbox' && activeObject.type !== 'text')) return;
    
    activeObject.set('underline', !activeObject.underline);
    
    this.classList.toggle('active');
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 更新形状填充颜色
 */
function updateShapeColor() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    activeObject.set('fill', this.value);
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 更新形状边框颜色
 */
function updateShapeBorderColor() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    activeObject.set('stroke', this.value);
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 更新形状边框宽度
 */
function updateShapeBorderWidth() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    activeObject.set('strokeWidth', parseInt(this.value, 10));
    document.getElementById('border-width-value').textContent = `${this.value}px`;
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 将对象移到前面
 */
function bringForward() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    canvas.bringForward(activeObject);
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 将对象移到后面
 */
function sendBackward() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    canvas.sendBackward(activeObject);
    canvas.renderAll();
    
    hasUnsavedChanges = true;
}

/**
 * 左对齐
 */
function alignLeft() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    activeObject.set({
        left: 0 + activeObject.getScaledWidth() / 2,
        originX: 'center'
    });
    
    canvas.renderAll();
    hasUnsavedChanges = true;
}

/**
 * 中心对齐
 */
function alignCenter() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    activeObject.set({
        left: canvas.width / 2,
        originX: 'center'
    });
    
    canvas.renderAll();
    hasUnsavedChanges = true;
}

/**
 * 右对齐
 */
function alignRight() {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    activeObject.set({
        left: canvas.width - activeObject.getScaledWidth() / 2,
        originX: 'center'
    });
    
    canvas.renderAll();
    hasUnsavedChanges = true;
}

/**
 * 应用画布设置
 */
function applyCanvasSettings() {
    const width = parseInt(document.getElementById('canvas-width').value, 10);
    const height = parseInt(document.getElementById('canvas-height').value, 10);
    const backgroundColor = document.getElementById('canvas-background-color').value;
    
    // 设置画布大小
    canvas.setWidth(width);
    canvas.setHeight(height);
    
    // 设置背景颜色
    canvas.setBackgroundColor(backgroundColor, canvas.renderAll.bind(canvas));
    
    hasUnsavedChanges = true;
}

/**
 * 显示保存弹窗
 */
function showSaveModal() {
    // 获取弹窗
    const saveModal = document.getElementById('save-modal');
    if (!saveModal) {
        console.error('Save modal not found');
        alert('Unable to show save dialog');
        return;
    }
    
    // 格式化当前日期
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-');
    
    // 设置默认标题
    const titleInput = saveModal.querySelector('#journal-title');
    if (titleInput && !titleInput.value) {
        titleInput.value = `Journal - ${dateStr}`;
    }
    
    // 显示弹窗
    saveModal.classList.add('active');
}

/**
 * 保存画布为图片并保存日记
 */
function saveCanvas(title, description) {
    // 显示保存指示器
    const saveIndicator = document.getElementById('save-indicator');
    const saveStatusText = document.getElementById('save-status-text');
    
    saveIndicator.style.display = 'block';
    saveStatusText.textContent = 'Saving your journal...';
    
    // 检查是否已登录Google
    const isLoggedIn = localStorage.getItem('is_logged_in') === 'true';
    
    // 显示存储位置
    const storageLocation = isLoggedIn ? 'Google Drive' : 'Local Storage';
    saveStatusText.textContent = `Saving your journal to ${storageLocation}...`;
    
    // 格式化当前日期
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).replace(/\//g, '-');
    
    // 使用提供的标题，或者默认标题
    const finalTitle = title || `Journal - ${dateStr}`;
    
    // 获取URL参数中的ID，或生成新ID
    const urlParams = new URLSearchParams(window.location.search);
    const journalId = urlParams.get('id') || 'journal_' + now.getTime();
    
    try {
        // 将画布保存为PNG
        const imgData = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2 // 提高分辨率
        });
        
        // 创建日记数据
        const journalData = {
            id: journalId,
            title: finalTitle,
            date: now.toISOString(),
            created: now.getTime(),
            lastEdited: now.getTime(),
            fileName: `${finalTitle.replace(/[^a-z0-9]/gi, '_')}_${dateStr}.png`,
            imageData: imgData,
            // 预设存储方法，将由LocalStorageManager根据登录状态决定
            storageMethod: isLoggedIn ? 'google_drive' : 'local_storage'
        };
        
        // 添加描述（如果提供）
        if (description && description.trim()) {
            journalData.description = description.trim();
        }
        
        // 更新保存指示器
        saveStatusText.textContent = `Processing journal image (${Math.round(imgData.length / 1024)} KB)...`;
        
        // 保存到存储系统
        LocalStorageManager.saveJournal(journalData).then(success => {
            if (success) {
                console.log('Journal saved successfully');
                hasUnsavedChanges = false;
                lastSaveTime = now.getTime();
                
                // 更新保存指示器，显示存储位置
                saveIndicator.style.backgroundColor = '#4CAF50';
                saveStatusText.textContent = `Journal saved successfully to ${storageLocation}! Returning to journal list...`;
                
                // 尝试下载图像
                try {
                    LocalStorageManager.saveImageToDisk(imgData, journalData.fileName);
                } catch (e) {
                    console.warn('Failed to download image, but journal was saved:', e);
                }
                
                // 延迟后重定向
                setTimeout(() => {
                    window.location.href = 'journal.html?fromSave=true&id=' + journalId;
                }, 1500);
            } else {
                saveIndicator.style.display = 'none';
                alert('Save failed: Could not store journal data');
            }
        }).catch(error => {
            saveIndicator.style.display = 'none';
            console.error('Save failed:', error);
            alert('Save failed: ' + error.message);
        });
    } catch (error) {
        saveIndicator.style.display = 'none';
        console.error('Save failed:', error);
        alert('Save failed: ' + error.message);
    }
}

/**
 * 显示预览
 */
function showPreview() {
    // 获取预览模态窗口
    const previewModal = document.getElementById('preview-modal');
    const previewContent = document.getElementById('preview-content');
    
    if (!previewModal || !previewContent) {
        console.error('Preview modal or content not found');
        return;
    }
    
    try {
        // 生成预览图片
        const previewImg = new Image();
        previewImg.src = canvas.toDataURL({
            format: 'png',
            quality: 1
        });
        
        // 清空预览内容并添加新图片
        previewContent.innerHTML = '';
        previewContent.appendChild(previewImg);
        
        // 显示预览模态窗口
        previewModal.classList.add('active');
    } catch (error) {
        console.error('Failed to generate preview:', error);
        alert('Unable to generate preview: ' + error.message);
    }
}

/**
 * 打印画布
 */
function printCanvas() {
    try {
        // 创建一个新窗口，用于打印
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow pop-ups to print your journal');
            return;
        }
        
        // 获取画布数据
        const imgData = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2
        });
        
        // 写入HTML到新窗口
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Print Journal</title>
                <style>
                    body {
                        margin: 0;
                        padding: 20px;
                        text-align: center;
                        font-family: 'Poppins', sans-serif;
                    }
                    img {
                        max-width: 100%;
                        max-height: 90vh;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    }
                    h1 {
                        margin-bottom: 20px;
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <h1>Your Journal</h1>
                <img src="${imgData}" alt="Journal Image">
                <script>
                    // 自动打印并关闭窗口
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 500);
                    };
                </script>
            </body>
            </html>
        `);
        
        printWindow.document.close();
    } catch (error) {
        console.error('Print failed:', error);
        alert('Unable to print: ' + error.message);
    }
}

/**
 * 处理键盘事件
 * @param {KeyboardEvent} e - 键盘事件对象
 */
function handleKeyboardEvents(e) {
    // 确保不是在输入框中按下删除键
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
    }
    
    // 删除键(Delete)或退格键(Backspace)
    if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObject = canvas.getActiveObject();
        if (activeObject) {
            // 如果有选中对象，删除它
            canvas.remove(activeObject);
            canvas.renderAll();
            hasUnsavedChanges = true;
            
            // 清除属性面板
            clearObjectProperties();
            
            // 显示删除提示
            showDeleteNotification();
        }
    }
}

/**
 * 显示删除提示
 */
function showDeleteNotification() {
    // 创建一个临时提示元素
    const notification = document.createElement('div');
    notification.textContent = '已删除所选元素';
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '9999';
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.3s ease';
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 显示
    setTimeout(() => {
        notification.style.opacity = '1';
    }, 10);
    
    // 2秒后移除
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
} 