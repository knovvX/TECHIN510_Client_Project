// ====================== Editor Core Module ======================

// Create global namespace to avoid variable conflicts
window.EditorApp = {
    elements: {}, // Store DOM element references
    eventHandlers: {}, // Store event handlers
    state: {
        currentJournalId: null, // Store the current journal ID being edited
        lastSaveTime: null, // Track when the journal was last saved
        template: null // Store the current template
    }, // Store application state
    
    // Initialize application
    init: function() {
        this.clearCaches();
        
        // Check URL parameters to see if we're editing an existing journal
        this.checkForExistingJournal();
        
        this.initializeModules();
        this.cleanupDuplicateEventBindings();
        console.log('Editor application initialized');
    },
    
    // Check if we're editing an existing journal
    checkForExistingJournal: function() {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const journalId = urlParams.get('id');
        
        if (journalId) {
            console.log(`Editing existing journal: ${journalId}`);
            this.state.currentJournalId = journalId;
            
            // Load journal from localStorage
            this.loadJournalFromStorage(journalId);
        } else {
            console.log('Creating new journal');
        }
    },
    
    // Load journal from localStorage
    loadJournalFromStorage: function(journalId) {
        const journals = JSON.parse(localStorage.getItem('journals') || '[]');
        const journal = journals.find(j => j.id === journalId);
        
        if (!journal) {
            console.error(`Could not find journal with ID ${journalId}`);
            alert('Unable to load journal: The specified journal was not found');
            return;
        }
        
        // Set page title
        document.title = `Edit - ${journal.title}`;
        
        // We can't directly restore journal content since it's saved as an image
        // But we can set the journal title in the save dialog
        const titleInput = document.getElementById('journal-title');
        if (titleInput) {
            titleInput.value = journal.title;
        }
        
        // Show a notification to inform the user they're editing an existing journal
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = `Editing "${journal.title}"`;
        notification.style.position = 'fixed';
        notification.style.top = '10px';
        notification.style.right = '10px';
        notification.style.padding = '10px 15px';
        notification.style.backgroundColor = '#4a6fdc';
        notification.style.color = 'white';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        document.body.appendChild(notification);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    },
    
    // Clear caches
    clearCaches: function() {
        this.elements = {};
    },
    
    // Get DOM element
    getElement: function(selector) {
        if (!this.elements[selector]) {
            this.elements[selector] = document.querySelector(selector);
        }
        return this.elements[selector];
    },
    
    // Register event handler
    registerEventHandler: function(element, event, handler, key) {
        if (!this.eventHandlers[key]) {
            this.eventHandlers[key] = [];
        }
        this.eventHandlers[key].push({ element, event, handler });
        element.addEventListener(event, handler);
    },
    
    // Clear event handlers
    clearEventHandlers: function(key) {
        if (this.eventHandlers[key]) {
            this.eventHandlers[key].forEach(eh => {
                eh.element.removeEventListener(eh.event, eh.handler);
            });
            this.eventHandlers[key] = [];
        }
    },
    
    // Clean up possible duplicate event bindings
    cleanupDuplicateEventBindings: function() {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            const newButton = button.cloneNode(true);
            if (button.parentNode) {
                button.parentNode.replaceChild(newButton, button);
            }
        });
    },
    
    // Initialize all modules
    initializeModules: function() {
        // Initialize navigation buttons
        this.initButtons();
        
        // Initialize modal buttons
        this.initModalButtons();
        
        // Initialize canvas
        this.initCanvas();
        
        // Initialize properties panel
        this.initPropertiesPanel();
        
        // Initialize other features
        this.initOtherFeatures();
    },
    
    // Initialize navigation buttons
    initButtons: function() {
        console.log('Initializing navigation buttons');
        
        // Save button
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            // Remove any existing event listeners
            const newSaveBtn = saveBtn.cloneNode(true);
            saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
            
            newSaveBtn.addEventListener('click', function() {
                console.log('Save button clicked');
                // Show save modal
                const saveModal = document.getElementById('save-modal');
                if (saveModal) {
                    saveModal.classList.add('active');
                    
                    // Set up journal title input
                    const titleInput = saveModal.querySelector('#journal-title');
                    if (titleInput) {
                        if (!titleInput.value) {
                            const now = new Date();
                            titleInput.value = `Journal - ${now.toLocaleDateString()}`;
                        }
                    }
                    
                    // Set up confirm button
                    const confirmBtn = saveModal.querySelector('.confirm-btn');
                    if (confirmBtn) {
                        confirmBtn.onclick = function() {
                            // Get title from input
                            const title = titleInput ? titleInput.value : `Journal - ${new Date().toLocaleDateString()}`;
                            // Call saveCanvas function
                            saveCanvas(title);
                            saveModal.classList.remove('active');
                        };
                    }
                } else {
                    console.error('Save modal not found');
                    alert('Unable to save: Save modal not found');
                }
            });
        }
        
        // Preview button
        const previewBtn = document.getElementById('preview-btn');
        if (previewBtn) {
            // Remove any existing event listeners
            const newPreviewBtn = previewBtn.cloneNode(true);
            previewBtn.parentNode.replaceChild(newPreviewBtn, previewBtn);
            
            newPreviewBtn.addEventListener('click', function() {
                console.log('Preview button clicked');
                const previewModal = document.getElementById('preview-modal');
                if (previewModal) {
                    previewModal.classList.add('active');
                    
                    // Call previewCanvas function if it exists
                    previewCanvas();
                } else {
                    console.error('Preview modal not found');
                    alert('Unable to preview: Preview modal not found');
                }
            });
        }
        
        // Print button
        const printBtn = document.getElementById('print-btn');
        if (printBtn) {
            // Remove any existing event listeners
            const newPrintBtn = printBtn.cloneNode(true);
            printBtn.parentNode.replaceChild(newPrintBtn, printBtn);
            
            newPrintBtn.addEventListener('click', function() {
                console.log('Print button clicked');
                if (typeof printCanvas === 'function') {
                    printCanvas();
                } else {
                    console.error('Print function not found');
                    window.print(); // Fallback to browser print
                }
            });
        }
        
        // Return button
        const backBtn = document.getElementById('close-btn');
        if (backBtn) {
            // Remove any existing event listeners
            const newBackBtn = backBtn.cloneNode(true);
            backBtn.parentNode.replaceChild(newBackBtn, backBtn);
            
            newBackBtn.addEventListener('click', function() {
                console.log('Return button clicked');
                
                // 设置标记，避免beforeunload警告
                window.goingToJournalPage = true;
                
                // Check if content has been saved since last edit
                if (EditorApp.state.lastSaveTime) {
                    const timeSinceSave = new Date().getTime() - EditorApp.state.lastSaveTime;
                    if (timeSinceSave < 60000) { // If saved within the last minute
                        // Content was recently saved, redirect directly
                        window.location.href = 'journal.html';
                        return;
                    }
                }
                
                // Ask if user wants to save before returning
                const confirmDialog = confirm('Your journal has not been saved. Do you want to leave without saving? Changes will be lost.');
                if (confirmDialog) {
                    // User wants to save first - show save dialog
                    const saveModal = document.getElementById('save-modal');
                    if (saveModal) {
                        saveModal.classList.add('active');
                        
                        // Add special callback for 'save then return'
                        const confirmBtn = saveModal.querySelector('.confirm-btn');
                        if (confirmBtn) {
                            // Create a clone to remove existing listeners
                            const newConfirmBtn = confirmBtn.cloneNode(true);
                            confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
                            
                            newConfirmBtn.addEventListener('click', function() {
                                const titleInput = document.getElementById('journal-title');
                                const title = titleInput ? titleInput.value : `Journal - ${new Date().toLocaleDateString()}`;
                                
                                // 设置标记，避免beforeunload警告
                                window.goingToJournalPage = true;
                                
                                // Save and then redirect
                                if (typeof saveCanvas === 'function') {
                                    saveCanvas(title, function() {
                                        // This callback will be executed after save is complete
                                        window.location.href = 'journal.html';
                                    });
                                }
                                saveModal.classList.remove('active');
                            });
                        }
                    } else {
                        alert('Save dialog not found. Your changes may be lost.');
                        if (confirm('Return to journals page anyway? Unsaved changes will be lost.')) {
                            window.goingToJournalPage = true;
                            window.location.href = 'journal.html';
                        }
                    }
                } else if (confirm('Are you sure you want to return without saving? All changes will be lost.')) {
                    // User confirmed they want to abandon changes
                    window.goingToJournalPage = true;
                    window.location.href = 'journal.html';
                }
            });
        }
    },
    
    // Initialize modal buttons
    initModalButtons: function() {
        console.log('Initializing modal buttons');
        
        // Close modal buttons
        const closeButtons = document.querySelectorAll('.modal .cancel-btn');
        closeButtons.forEach(button => {
            // Remove any existing event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function() {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Close buttons with class close-btn
        document.querySelectorAll('.modal .close-btn, .modal .btn-close').forEach(button => {
            // Remove any existing event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            newButton.addEventListener('click', function() {
                // Find parent modal and remove active class
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            });
        });
        
        // Close modal when clicking on background
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                // Only close if clicking on the background (not the content)
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        });
        
        console.log('Modal buttons initialization completed');
    },
    
    // Initialize canvas
    initCanvas: function() {
        console.log('Initializing canvas...');
        if (typeof initCanvas === 'function') {
            initCanvas();
        }
        
        // Bind add element buttons
        this.initElementButtons();
        
        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Delete key - delete selected element
            if (e.key === 'Delete') {
                if (typeof deleteSelectedElement === 'function') {
                    deleteSelectedElement();
                }
            }
            
            // Ctrl+D duplicate selected element
            if (e.ctrlKey && e.key === 'd') {
                e.preventDefault();
                if (typeof duplicateSelectedElement === 'function') {
                    duplicateSelectedElement();
                }
            }
        });
    },
    
    // Initialize element buttons
    initElementButtons: function() {
        console.log('Initializing element buttons');
        
        // Text element
        const textItems = document.querySelectorAll('.component-item[data-type="text"]');
        textItems.forEach(item => {
            // Remove any existing event listeners
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            newItem.addEventListener('click', function() {
                if (typeof addTextToCanvas === 'function') {
                    addTextToCanvas();
                }
            });
        });
        
        // Note element
        const noteItems = document.querySelectorAll('.component-item[data-type="note"]');
        noteItems.forEach(item => {
            // Remove any existing event listeners
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            newItem.addEventListener('click', function() {
                if (typeof addNoteToCanvas === 'function') {
                    addNoteToCanvas();
                }
            });
        });
        
        // Polaroid element
        const polaroidItems = document.querySelectorAll('.component-item[data-type="polaroid"]');
        polaroidItems.forEach(item => {
            // Remove any existing event listeners
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            newItem.addEventListener('click', function() {
                if (typeof addPolaroidToCanvas === 'function') {
                    addPolaroidToCanvas();
                }
            });
        });
        
        // Tape element
        const tapeItems = document.querySelectorAll('.component-item[data-type="tape"]');
        tapeItems.forEach(item => {
            // Remove any existing event listeners
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            newItem.addEventListener('click', function() {
                if (typeof addTapeToCanvas === 'function') {
                    addTapeToCanvas();
                }
            });
        });
        
        // Frame element
        const frameItems = document.querySelectorAll('.component-item[data-type="frame"]');
        frameItems.forEach(item => {
            // Remove any existing event listeners
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            newItem.addEventListener('click', function() {
                if (typeof addFrameToCanvas === 'function') {
                    addFrameToCanvas();
                }
            });
        });
        
        // Sticker element - 这里是我们需要修改的部分
        const stickerItems = document.querySelectorAll('.component-item[data-type="sticker"]');
        stickerItems.forEach(item => {
            // 移除现有事件监听器
            const newItem = item.cloneNode(true);
            item.parentNode.replaceChild(newItem, item);
            
            // 添加新的事件监听器 - 切换到贴纸侧边栏
            newItem.addEventListener('click', function() {
                // 查找贴纸的侧边栏标签
                const stickerTab = document.querySelector('.sidebar-tabs .tab[data-tab="stickers"]');
                if (stickerTab) {
                    // 点击侧边栏标签，切换到贴纸界面
                    stickerTab.click();
                } else {
                    console.error('找不到贴纸侧边栏标签');
                }
            });
        });
    },
    
    // Initialize properties panel
    initPropertiesPanel: function() {
        console.log('Initializing properties panel...');
        if (typeof initPropertiesPanel === 'function') {
            initPropertiesPanel();
        }
        if (typeof initBackgroundSelector === 'function') {
            initBackgroundSelector();
        }
    },
    
    // Initialize other features
    initOtherFeatures: function() {
        console.log('Initializing other features');
        
        // Initialize tab switching
        const tabs = document.querySelectorAll('.sidebar-tabs .tab');
        tabs.forEach(tab => {
            // Remove any existing event listeners
            const newTab = tab.cloneNode(true);
            tab.parentNode.replaceChild(newTab, tab);
            
            newTab.addEventListener('click', function() {
                // Remove active state from all tabs
                tabs.forEach(t => t.classList.remove('active'));
                
                // Add active state to current tab
                this.classList.add('active');
                
                // Get target content
                const target = this.getAttribute('data-tab');
                
                // Hide all content
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                
                // Show target content
                const targetContent = document.getElementById(target + '-content');
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
                
                // 特殊处理装饰元素标签和贴纸标签
                if (target === 'decorative') {
                    // 如果点击装饰元素标签，切换到贴纸标签
                    const stickerTab = document.querySelector('.sidebar-tabs .tab[data-tab="stickers"]');
                    if (stickerTab && stickerTab !== this) {
                        // 延迟一下，让用户看到切换过程
                        setTimeout(() => {
                            stickerTab.click();
                        }, 100);
                    }
                }
            });
        });
        
        // Default to first tab
        if (tabs.length > 0) {
            tabs[0].click();
        }
        
        // Initialize file upload
        if (typeof initFileUpload === 'function') {
            initFileUpload();
        }
        
        // Initialize layer controls
        if (typeof initLayerControls === 'function') {
            initLayerControls();
        }
        
        // 装饰区域的贴纸按钮
        const decorativeStickerBtn = document.getElementById('decorative-sticker-btn');
        if (decorativeStickerBtn) {
            decorativeStickerBtn.addEventListener('click', function() {
                // 直接切换到贴纸标签
                const stickerTab = document.querySelector('.sidebar-tabs .tab[data-tab="stickers"]');
                if (stickerTab) {
                    stickerTab.click();
                }
            });
        }
    }
};

/**
 * Show specified modal
 * @param {string} modalId - ID of modal to show
 */
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
    } else {
        console.error(`Modal with ID ${modalId} not found`);
    }
}

// Initialize application on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM content loaded, initializing editor app');
    
    // Initialize EditorApp
    window.EditorApp.init();
    bindMainButtonEvents();
    
    // 添加页面离开提示
    window.addEventListener('beforeunload', function(e) {
        // 如果是跳转到journal.html，不显示提示
        if (window.goingToJournalPage) {
            return undefined;
        }
        
        // 检查是否有最近的保存记录
        if (!EditorApp.state.lastSaveTime) {
            // 显示提示
            const message = 'Your journal has not been saved. Do you want to leave without saving? Changes will be lost.';
            e.returnValue = message;
            return message;
        }
        
        // 如果保存时间超过5分钟，也显示提示
        const timeSinceSave = Date.now() - EditorApp.state.lastSaveTime;
        if (timeSinceSave > 5 * 60 * 1000) { // 5分钟
            const message = 'Your journal has not been saved for a while. Are you sure you want to leave? Recent changes may be lost.';
            e.returnValue = message;
            return message;
        }
        
        return undefined;
    });
});

// ==================== Canvas Save Functions ====================

// Save canvas as image
function saveCanvas(title, callback) {
    console.log('Saving canvas as image with title:', title);
    
    // Get canvas element - ensure we're selecting a stable element
    const scrapbook = document.querySelector('.scrapbook-page') || 
                      document.querySelector('#journal-canvas .scrapbook-page') || 
                      document.querySelector('.scrapbook-canvas') || 
                      document.querySelector('#journal-canvas');
    
    if (!scrapbook) {
        console.error('Could not find canvas element for saving');
        alert('Save failed: Could not find canvas element');
        return;
    }
    
    // Create a save indicator element
    const saveIndicator = document.createElement('div');
    saveIndicator.style.position = 'fixed';
    saveIndicator.style.top = '0';
    saveIndicator.style.left = '0';
    saveIndicator.style.width = '100%';
    saveIndicator.style.padding = '10px';
    saveIndicator.style.backgroundColor = '#4a90e2';
    saveIndicator.style.color = 'white';
    saveIndicator.style.textAlign = 'center';
    saveIndicator.style.zIndex = '9999';
    saveIndicator.textContent = 'Saving your journal...';
    document.body.appendChild(saveIndicator);
    
    // Create journal data
    const journalId = EditorApp.state.currentJournalId || 'journal_' + Date.now();
    const creationTime = Date.now();
    const journalData = {
        id: journalId,
        title: title || 'Untitled Journal',
        created: creationTime,
        lastModified: creationTime
    };
    
    // Save the current template settings to the journal data
    if (EditorApp.state && EditorApp.state.template) {
        journalData.template = EditorApp.state.template;
    }
    
    // Update save time to avoid unsaved warning
    EditorApp.state.lastSaveTime = Date.now();
    
    // Use html2canvas to create an image
    html2canvas(scrapbook, {
        allowTaint: true,
        useCORS: true,
        backgroundColor: null,
        onclone: function(clonedDoc) {
            // Make sure any hidden elements in the original are also hidden in the clone
            const hiddenElements = clonedDoc.querySelectorAll('.hide-in-image, .ui-resizable-handle, .ui-rotatable-handle');
            hiddenElements.forEach(el => {
                el.style.display = 'none';
            });
        }
    }).then(canvas => {
        // Convert canvas to an image that we can save
        const imgData = canvas.toDataURL('image/png');
        
        // Add the image data to journal data
        journalData.imageData = imgData;
        
        // Save to localStorage for retrieval by the journals page
        saveJournalToLocalStorage(journalData);
        
        // Create save preview (can be shown on the page if needed)
        const savePreview = document.getElementById('save-preview') || document.createElement('div');
        savePreview.style.display = 'block';
        savePreview.style.margin = '10px 0';
        
        // Create downloadable image
        const a = document.createElement('a');
        a.href = imgData;
        a.download = `${journalData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${journalData.id}.png`;
        
        // Trigger the download
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Update save indicator message
        saveIndicator.textContent = 'Printing your journal...';
        
        // Update current journal ID
        EditorApp.state.currentJournalId = journalData.id;
        
        // 设置标记，避免beforeunload警告
        window.goingToJournalPage = true;
        
        // Create a print window for the journal
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Print Journal: ${journalData.title}</title>
                <style>
                    body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                    img { max-width: 100%; max-height: 100vh; }
                    @media print {
                        body { height: auto; }
                    }
                </style>
            </head>
            <body>
                <img src="${imgData}" />
                <script>
                    // Automatically print after image loads
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.onafterprint = function() {
                                window.close();
                            };
                        }, 200);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
        
        // Remove save indicator after printing starts
        setTimeout(() => {
            document.body.removeChild(saveIndicator);
            
            // Update URL to reflect the journal ID being edited
            if (!window.location.search.includes('id=')) {
                const newUrl = window.location.pathname + '?id=' + journalData.id;
                window.history.replaceState({}, document.title, newUrl);
            }
            
            // Execute callback if provided
            if (typeof callback === 'function') {
                callback();
            }
            
            // Automatically redirect to journal page immediately
            window.location.href = 'journal.html?fromSave=true';
        }, 500);
        
    }).catch(error => {
        // Remove save indicator
        document.body.removeChild(saveIndicator);
        
        console.error('Error converting canvas to image:', error);
        alert('Save failed: Unable to convert canvas to image. Error: ' + error.message);
        
        // Don't execute callback since save failed
    });
}

// Preview canvas
function previewCanvas() {
    console.log('Previewing canvas content...');
    
    // Get canvas element - try multiple possible selectors
    let scrapbook = document.querySelector('.scrapbook-page');
    if (!scrapbook) {
        scrapbook = document.querySelector('#journal-canvas .scrapbook-page');
    }
    if (!scrapbook) {
        scrapbook = document.querySelector('.scrapbook-canvas');
    }
    if (!scrapbook) {
        scrapbook = document.querySelector('#journal-canvas');
    }
    
    // Determine the correct preview container selector
    let previewContainer = document.querySelector('#preview-modal .preview-container');
    if (!previewContainer) {
        previewContainer = document.querySelector('#preview-modal #preview-content');
    }
    if (!previewContainer) {
        previewContainer = document.querySelector('.preview-content');
    }
    
    if (!scrapbook) {
        console.error('Could not find canvas element (tried multiple selectors)');
        if (previewContainer) {
            previewContainer.innerHTML = '<p>Unable to generate preview: Canvas element not found</p>';
        }
        return;
    }
    
    if (!previewContainer) {
        console.error('Could not find preview container (tried multiple selectors)');
        alert('Preview failed: Could not find preview container');
        return;
    }
    
    console.log('Found canvas element:', scrapbook);
    console.log('Found preview container:', previewContainer);
    
    // Use html2canvas to generate preview
    if (typeof html2canvas !== 'function') {
        console.error('html2canvas library not loaded');
        previewContainer.innerHTML = '<p>Unable to generate preview: html2canvas library required</p>';
        
        // Try to load html2canvas
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = function() {
            console.log('Dynamically loaded html2canvas library, retrying preview generation');
            previewCanvas();
        };
        document.head.appendChild(script);
        return;
    }
    
    // Clear preview container
    previewContainer.innerHTML = '<p>Generating preview...</p>';
    
    // Call html2canvas with more reliable config
    html2canvas(scrapbook, {
        allowTaint: true,
        useCORS: true,
        logging: true,
        backgroundColor: null
    }).then(canvas => {
        // Clear preview container and add generated image
        previewContainer.innerHTML = '';
        previewContainer.appendChild(canvas);
        
        // Set max width and height
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        canvas.style.margin = '0 auto';
        canvas.style.display = 'block';
        canvas.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
    }).catch(error => {
        console.error('Error generating preview:', error);
        previewContainer.innerHTML = '<p>Unable to generate preview: ' + error.message + '</p>';
    });
}

// Print canvas
function printCanvas() {
    console.log('Printing canvas content...');
    
    // Get canvas element
    const scrapbook = document.querySelector('.scrapbook-container');
    
    if (!scrapbook) {
        console.error('Could not find canvas element');
        alert('Print failed: Could not find canvas element');
        return;
    }
    
    // Use html2canvas to generate the image to print
    if (typeof html2canvas !== 'function') {
        console.error('html2canvas library not loaded');
        alert('Print failed: html2canvas library required');
        return;
    }
    
    html2canvas(scrapbook).then(canvas => {
        // Create a new print window
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Print Journal</title>
                <style>
                    body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                    img { max-width: 100%; max-height: 100vh; }
                    @media print {
                        body { height: auto; }
                    }
                </style>
            </head>
            <body>
                <img src="${canvas.toDataURL('image/png')}" />
                <script>
                    // Automatically print after image loads
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            setTimeout(function() { window.close(); }, 500);
                        }, 200);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    }).catch(error => {
        console.error('Error preparing for print:', error);
        alert('Print failed: ' + error.message);
    });
}

// Save journal to local storage
function saveJournalToLocalStorage(journalData) {
    // Get existing journals list
    let journals = JSON.parse(localStorage.getItem('journals') || '[]');
    
    // Check if a journal with the same ID already exists (update)
    const existingIndex = journals.findIndex(j => j.id === journalData.id);
    
    if (existingIndex >= 0) {
        // Update existing journal
        journals[existingIndex] = journalData;
    } else {
        // Add new journal
        journals.push(journalData);
    }
    
    // Sort by creation date (newest first)
    journals.sort((a, b) => b.created - a.created);
    
    // Save to local storage
    localStorage.setItem('journals', JSON.stringify(journals));
    console.log(`Saved journal "${journalData.title}" to local storage`);
}

// Event delegation for main buttons
function bindMainButtonEvents() {
    document.addEventListener('click', function(e) {
        // Save button
        if (e.target && e.target.id === 'save-btn') {
            const saveModal = document.getElementById('save-modal');
            if (saveModal) {
                saveModal.classList.add('active');
            }
        }
        // Preview button
        if (e.target && e.target.id === 'preview-btn') {
            const previewModal = document.getElementById('preview-modal');
            if (previewModal) {
                previewModal.classList.add('active');
                if (typeof previewCanvas === 'function') previewCanvas();
            }
        }
        // Print button
        if (e.target && e.target.id === 'print-btn') {
            if (typeof printCanvas === 'function') printCanvas();
        }
        // Return button
        if (e.target && e.target.id === 'close-btn') {
            // This is now handled by the initButtons function
            // We'll leave the handler here as a fallback, but with improved logic
            window.goingToJournalPage = true; // 设置标记，避免beforeunload警告
            if (!EditorApp.state.lastSaveTime) {
                if (confirm('Your journal has not been saved. Do you want to leave without saving? Changes will be lost.')) {
                    window.location.href = 'journal.html';
                }
            } else {
                window.location.href = 'journal.html';
            }
        }
        // Save modal confirm button
        if (e.target && e.target.classList.contains('confirm-btn') && e.target.closest('#save-modal')) {
            const titleInput = document.getElementById('journal-title');
            const title = titleInput ? titleInput.value : `Journal - ${new Date().toLocaleDateString()}`;
            
            // 设置标记，避免beforeunload警告
            window.goingToJournalPage = true;
            
            if (typeof saveCanvas === 'function') saveCanvas(title);
            const saveModal = document.getElementById('save-modal');
            if (saveModal) saveModal.classList.remove('active');
        }
        // Save modal cancel/close button
        if (e.target && (e.target.classList.contains('cancel-btn') || e.target.classList.contains('close-btn')) && e.target.closest('#save-modal')) {
            const saveModal = document.getElementById('save-modal');
            if (saveModal) saveModal.classList.remove('active');
        }
        // Preview modal close button
        if (e.target && (e.target.classList.contains('cancel-btn') || e.target.classList.contains('close-btn')) && e.target.closest('#preview-modal')) {
            const previewModal = document.getElementById('preview-modal');
            if (previewModal) previewModal.classList.remove('active');
        }
    });
} 