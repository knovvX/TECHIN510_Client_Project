// ====================== 属性面板和事件处理 ======================

// 初始化属性面板功能
function initPropertiesPanel() {
    // 旋转滑块事件
    const rotationSlider = document.getElementById('element-rotation');
    if (rotationSlider) {
        rotationSlider.addEventListener('input', function() {
            updateSelectedElementRotation(this.value);
            // 更新显示值
            document.getElementById('rotation-value').textContent = `${Math.round(this.value)}°`;
        });
    }
    
    // 缩放滑块事件
    const scaleSlider = document.getElementById('element-scale');
    if (scaleSlider) {
        scaleSlider.addEventListener('input', function() {
            updateSelectedElementScale(this.value / 100);
            // 更新显示值
            document.getElementById('scale-value').textContent = `${Math.round(this.value)}%`;
        });
    }
    
    // 文本属性事件
    initTextPropertiesEvents();
    
    // 便签属性事件
    initNotePropertiesEvents();
    
    // 初始化图层控制按钮
    initLayerControls();
    
    // 删除按钮事件
    const deleteBtn = document.getElementById('delete-element-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteSelectedElement);
    }
    
    // 复制按钮事件
    const duplicateBtn = document.getElementById('duplicate-element-btn');
    if (duplicateBtn) {
        duplicateBtn.addEventListener('click', duplicateSelectedElement);
    }
}

// 更新选中元素的旋转角度
function updateSelectedElementRotation(rotation) {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected) return;
    
    let transformX = 0;
    let transformY = 0;
    let scale = 1;
    
    const transform = selected.style.transform;
    if (transform) {
        const translateMatch = transform.match(/translate3d\(([^,]+),\s*([^,]+),/);
        if (translateMatch) {
            transformX = parseFloat(translateMatch[1]);
            transformY = parseFloat(translateMatch[2]);
        }
        
        const scaleMatch = transform.match(/scale\(([^)]+)\)/);
        if (scaleMatch) {
            scale = parseFloat(scaleMatch[1]);
        }
    }
    
    selected.style.transform = `translate3d(${transformX}px, ${transformY}px, 0) rotate(${rotation}deg) scale(${scale})`;
}

// 更新选中元素的缩放值
function updateSelectedElementScale(scale) {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected) return;
    
    let transformX = 0;
    let transformY = 0;
    let rotation = 0;
    
    const transform = selected.style.transform;
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
    }
    
    selected.style.transform = `translate3d(${transformX}px, ${transformY}px, 0) rotate(${rotation}deg) scale(${scale})`;
}

// 初始化文本属性事件
function initTextPropertiesEvents() {
    // 文本颜色事件
    const textColorBtns = document.querySelectorAll('.text-color-btn');
    textColorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            updateSelectedTextColor(color);
            
            // 更新按钮状态
            textColorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 文本字体事件
    const fontSelector = document.getElementById('text-font');
    if (fontSelector) {
        fontSelector.addEventListener('change', function() {
            updateSelectedTextFont(this.value);
        });
    }
    
    // 文本大小事件
    const fontSizeSelector = document.getElementById('text-size');
    if (fontSizeSelector) {
        fontSizeSelector.addEventListener('change', function() {
            updateSelectedTextSize(this.value);
        });
    }
    
    // 文本加粗事件
    const boldBtn = document.getElementById('text-bold');
    if (boldBtn) {
        boldBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            const isBold = this.classList.contains('active');
            updateSelectedTextBold(isBold);
        });
    }
    
    // 文本斜体事件
    const italicBtn = document.getElementById('text-italic');
    if (italicBtn) {
        italicBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            const isItalic = this.classList.contains('active');
            updateSelectedTextItalic(isItalic);
        });
    }
    
    // 文本对齐事件
    const alignBtns = document.querySelectorAll('.text-align-btn');
    alignBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const align = this.getAttribute('data-align');
            updateSelectedTextAlign(align);
            
            // 更新按钮状态
            alignBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// 更新选中的文本颜色
function updateSelectedTextColor(color) {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected || !selected.classList.contains('text-element')) return;
    
    const textContent = selected.querySelector('.text-content');
    if (textContent) {
        textContent.style.color = color;
    }
}

// 更新选中的文本字体
function updateSelectedTextFont(fontFamily) {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected || !selected.classList.contains('text-element')) return;
    
    const textContent = selected.querySelector('.text-content');
    if (textContent) {
        textContent.style.fontFamily = fontFamily;
    }
}

// 更新选中的文本大小
function updateSelectedTextSize(fontSize) {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected || !selected.classList.contains('text-element')) return;
    
    const textContent = selected.querySelector('.text-content');
    if (textContent) {
        textContent.style.fontSize = fontSize;
    }
}

// 更新选中的文本加粗
function updateSelectedTextBold(isBold) {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected || !selected.classList.contains('text-element')) return;
    
    const textContent = selected.querySelector('.text-content');
    if (textContent) {
        textContent.style.fontWeight = isBold ? 'bold' : 'normal';
    }
}

// 更新选中的文本斜体
function updateSelectedTextItalic(isItalic) {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected || !selected.classList.contains('text-element')) return;
    
    const textContent = selected.querySelector('.text-content');
    if (textContent) {
        textContent.style.fontStyle = isItalic ? 'italic' : 'normal';
    }
}

// 更新选中的文本对齐方式
function updateSelectedTextAlign(align) {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected || !selected.classList.contains('text-element')) return;
    
    const textContent = selected.querySelector('.text-content');
    if (textContent) {
        textContent.style.textAlign = align;
    }
}

// 初始化便签属性事件
function initNotePropertiesEvents() {
    // 便签颜色事件
    const noteColorBtns = document.querySelectorAll('.note-color-btn');
    noteColorBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const color = this.getAttribute('data-color');
            updateSelectedNoteColor(color);
            
            // 更新按钮状态
            noteColorBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// 更新选中的便签颜色
function updateSelectedNoteColor(color) {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected || !selected.classList.contains('note-element')) return;
    
    // 移除所有颜色类
    selected.classList.remove('yellow', 'blue', 'green', 'pink');
    
    // 添加选择的颜色类
    selected.classList.add(color);
}

// 复制选中的元素
function duplicateSelectedElement() {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected) return;
    
    // 克隆元素
    const clone = selected.cloneNode(true);
    
    // 调整克隆元素的位置，略微偏移
    const left = parseInt(clone.style.left) + 20;
    const top = parseInt(clone.style.top) + 20;
    clone.style.left = `${left}px`;
    clone.style.top = `${top}px`;
    
    // 添加到容器
    const elementsContainer = document.querySelector('.scrapbook-elements');
    if (elementsContainer) {
        elementsContainer.appendChild(clone);
    }
    
    // 确保克隆的元素也具有交互功能
    makeElementDraggable(clone);
    makeElementResizable(clone);
    makeElementRotatable(clone);
    
    // 处理特殊元素的事件
    if (clone.classList.contains('text-element')) {
        const textContent = clone.querySelector('.text-content');
        if (textContent) {
            textContent.addEventListener('dblclick', function() {
                this.focus();
            });
        }
    } else if (clone.classList.contains('note-element')) {
        const noteContent = clone.querySelector('.note-content');
        if (noteContent) {
            noteContent.addEventListener('dblclick', function() {
                this.focus();
            });
        }
    }
    
    // 选择新复制的元素
    selectElement(clone);
}

// 初始化背景选择功能
function initBackgroundSelector() {
    const backgroundBtns = document.querySelectorAll('.bg-option');
    backgroundBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const bgType = this.getAttribute('data-type');
            const bgValue = this.getAttribute('data-value');
            
            applyCanvasBackground(bgType, bgValue);
            
            // 更新按钮状态
            backgroundBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// 应用画布背景
function applyCanvasBackground(type, value) {
    const canvas = document.querySelector('.scrapbook-canvas');
    if (!canvas) return;
    
    // 重置所有背景属性
    canvas.style.backgroundColor = '';
    canvas.style.backgroundImage = '';
    canvas.style.backgroundSize = '';
    canvas.style.backgroundRepeat = '';
    
    if (type === 'color') {
        canvas.style.backgroundColor = value;
    } else if (type === 'pattern') {
        canvas.style.backgroundImage = `url(${value})`;
        canvas.style.backgroundSize = 'auto';
        canvas.style.backgroundRepeat = 'repeat';
    } else if (type === 'image') {
        canvas.style.backgroundImage = `url(${value})`;
        canvas.style.backgroundSize = 'cover';
        canvas.style.backgroundRepeat = 'no-repeat';
    }
}

// 初始化文件上传功能
function initFileUpload() {
    const imageUpload = document.getElementById('image-upload');
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    addImageToCanvas(e.target.result);
                    
                    // 重置文件输入
                    imageUpload.value = '';
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
    
    // 拖放上传
    const canvas = document.querySelector('.scrapbook-canvas');
    if (canvas) {
        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            
            if (e.dataTransfer.files.length > 0) {
                const file = e.dataTransfer.files[0];
                
                // 检查文件类型
                if (file.type.match('image.*')) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        // 获取放置位置（相对于画布）
                        const rect = canvas.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        
                        addImageToCanvas(e.target.result, x, y);
                    };
                    
                    reader.readAsDataURL(file);
                }
            }
        });
    }
} 