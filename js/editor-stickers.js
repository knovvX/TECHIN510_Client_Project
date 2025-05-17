// ====================== 贴纸功能 ======================

// 根据分类加载贴纸
function loadStickersFromCategory(category) {
    const stickerGrid = document.querySelector('.sticker-grid');
    if (!stickerGrid) return;
    
    // 清空当前贴纸网格
    stickerGrid.innerHTML = '';
    
    // 创建分类标题
    const categoryTitle = document.createElement('div');
    categoryTitle.className = 'sticker-category-title';
    categoryTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
    stickerGrid.appendChild(categoryTitle);
    
    // 根据分类加载不同的贴纸列表
    let stickers = [];
    
    switch(category) {
        case 'desserts':
            stickers = [
                'images/stickers/desserts/cake.png',
                'images/stickers/desserts/cookie.png',
                'images/stickers/desserts/cupcake.png',
                'images/stickers/desserts/donut.png',
                'images/stickers/desserts/ice-cream.png',
                'images/stickers/desserts/macaron.png'
            ];
            break;
        case 'fruits':
            stickers = [
                'images/stickers/fruits/apple.png',
                'images/stickers/fruits/banana.png',
                'images/stickers/fruits/cherry.png',
                'images/stickers/fruits/orange.png',
                'images/stickers/fruits/strawberry.png',
                'images/stickers/fruits/watermelon.png'
            ];
            break;
        case 'drinks':
            stickers = [
                'images/stickers/drinks/coffee.png',
                'images/stickers/drinks/juice.png',
                'images/stickers/drinks/milkshake.png',
                'images/stickers/drinks/tea.png'
            ];
            break;
        case 'animals':
            stickers = [
                'images/stickers/animals/cat.png',
                'images/stickers/animals/dog.png',
                'images/stickers/animals/panda.png',
                'images/stickers/animals/rabbit.png'
            ];
            break;
        case 'nature':
            stickers = [
                'images/stickers/nature/cloud.png',
                'images/stickers/nature/flower.png',
                'images/stickers/nature/leaf.png',
                'images/stickers/nature/sun.png',
                'images/stickers/nature/tree.png'
            ];
            break;
        case 'symbols':
            stickers = [
                'images/stickers/symbols/heart.png',
                'images/stickers/symbols/music.png',
                'images/stickers/symbols/star.png'
            ];
            break;
        default:
            // 默认显示几个贴纸作为示例
            stickers = [
                'images/stickers/desserts/cake.png',
                'images/stickers/fruits/apple.png',
                'images/stickers/drinks/coffee.png'
            ];
    }
    
    // 创建贴纸项
    stickers.forEach(stickerUrl => {
        const stickerItem = document.createElement('div');
        stickerItem.className = 'sticker-item';
        
        const img = document.createElement('img');
        img.src = stickerUrl;
        img.alt = 'Sticker';
        
        // 处理图片加载错误
        img.onerror = function() {
            stickerItem.classList.add('load-error');
            stickerItem.textContent = '加载失败';
        };
        
        stickerItem.appendChild(img);
        stickerGrid.appendChild(stickerItem);
        
        // 点击贴纸添加到画布
        stickerItem.addEventListener('click', () => {
            addStickerToCanvas(stickerUrl);
        });
        
        // 添加拖拽功能
        stickerItem.draggable = true;
        stickerItem.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', stickerUrl);
        });
    });
}

// 初始化贴纸面板
function initStickersPanel() {
    // 绑定分类按钮事件
    const categoryButtons = document.querySelectorAll('.sticker-category-btn');
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active状态
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // 给当前按钮添加active状态
            button.classList.add('active');
            
            // 加载对应分类的贴纸
            const category = button.getAttribute('data-category');
            loadStickersFromCategory(category);
        });
    });
    
    // 默认加载第一个分类
    if (categoryButtons.length > 0) {
        categoryButtons[0].click();
    }
    
    // 初始化画布的拖放功能
    const canvas = document.querySelector('.scrapbook-canvas');
    if (canvas) {
        canvas.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        
        canvas.addEventListener('drop', (e) => {
            e.preventDefault();
            const stickerUrl = e.dataTransfer.getData('text/plain');
            if (stickerUrl && stickerUrl.includes('stickers')) {
                // 获取放置位置（相对于画布）
                const rect = canvas.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // 在放置位置添加贴纸
                addStickerToCanvas(stickerUrl, x, y);
            }
        });
    }
}

// 打开贴纸模态框
function openStickerModal() {
    const modal = document.getElementById('sticker-modal');
    if (modal) {
        modal.classList.add('active');
        
        // 默认加载第一个分类
        const firstCategory = modal.querySelector('.sticker-category-btn');
        if (firstCategory) {
            firstCategory.click();
        }
    }
}

// 关闭贴纸模态框
function closeStickerModal() {
    const modal = document.getElementById('sticker-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// ====================== 图层控制功能 ======================

// 上移图层 - 将选中元素上移一层
function moveElementForward() {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected) return;
    
    const parent = selected.parentNode;
    const nextSibling = selected.nextElementSibling;
    
    if (nextSibling) {
        parent.insertBefore(nextSibling, selected);
    }
}

// 下移图层 - 将选中元素下移一层
function moveElementBackward() {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected) return;
    
    const parent = selected.parentNode;
    const prevSibling = selected.previousElementSibling;
    
    if (prevSibling) {
        parent.insertBefore(selected, prevSibling);
    }
}

// 移至顶层 - 将选中元素移至最上层
function moveElementToFront() {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected) return;
    
    const parent = selected.parentNode;
    parent.appendChild(selected);
}

// 移至底层 - 将选中元素移至最下层
function moveElementToBack() {
    const selected = document.querySelector('.canvas-element.selected');
    if (!selected) return;
    
    const parent = selected.parentNode;
    const firstChild = parent.firstChild;
    
    if (firstChild) {
        parent.insertBefore(selected, firstChild);
    }
}

// 初始化图层控制功能
function initLayerControls() {
    // 绑定图层控制按钮事件
    const forwardBtn = document.getElementById('layer-forward-btn');
    const backwardBtn = document.getElementById('layer-backward-btn');
    const frontBtn = document.getElementById('layer-front-btn');
    const backBtn = document.getElementById('layer-back-btn');
    
    if (forwardBtn) {
        forwardBtn.addEventListener('click', moveElementForward);
    }
    
    if (backwardBtn) {
        backwardBtn.addEventListener('click', moveElementBackward);
    }
    
    if (frontBtn) {
        frontBtn.addEventListener('click', moveElementToFront);
    }
    
    if (backBtn) {
        backBtn.addEventListener('click', moveElementToBack);
    }
    
    // English version layer control buttons
    const upBtn = document.getElementById('layer-up-btn');
    const downBtn = document.getElementById('layer-down-btn');
    
    if (upBtn) {
        upBtn.addEventListener('click', moveElementForward);
    }
    
    if (downBtn) {
        downBtn.addEventListener('click', moveElementBackward);
    }
} 