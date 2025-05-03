/**
 * 文件系统访问 - 用于保存和加载日记图像
 * 使用现代浏览器的File System Access API
 */

const FileSystemManager = {
    // 是否支持File System Access API
    isFileSystemAccessSupported: 'showSaveFilePicker' in window,
    
    /**
     * 保存图像数据到文件
     * @param {string} imageData - Base64编码的图像数据
     * @param {string} suggestedName - 建议的文件名
     * @returns {Promise<Object>} 包含文件句柄和路径的对象
     */
    async saveImageToFile(imageData, suggestedName) {
        if (!this.isFileSystemAccessSupported) {
            console.warn('此浏览器不支持File System Access API，将使用下载方式');
            // 退回到下载方式
            this.downloadImage(imageData, suggestedName);
            return { success: false, method: 'download', filename: suggestedName };
        }
        
        try {
            // 配置文件选择器选项
            const options = {
                suggestedName: suggestedName,
                types: [{
                    description: 'PNG 图像',
                    accept: { 'image/png': ['.png'] }
                }]
            };
            
            // 显示保存文件选择器
            const fileHandle = await window.showSaveFilePicker(options);
            
            // 获取可写入流
            const writable = await fileHandle.createWritable();
            
            // 将Base64数据转换为Blob
            const blob = this.dataURLtoBlob(imageData);
            
            // 写入文件
            await writable.write(blob);
            await writable.close();
            
            // 尝试获取文件路径（如果可能）
            let filePath = null;
            try {
                const file = await fileHandle.getFile();
                filePath = file.name;
            } catch (error) {
                console.warn('无法获取保存的文件路径:', error);
            }
            
            console.log('成功保存图像到用户选择的位置');
            return { 
                success: true, 
                method: 'fsapi', 
                fileHandle: fileHandle,
                path: filePath,
                filename: suggestedName
            };
        } catch (error) {
            console.error('使用File System Access API保存文件时出错:', error);
            
            // 如果用户取消或发生错误，尝试下载方式
            if (error.name !== 'AbortError') {
                console.log('尝试使用下载方式...');
                this.downloadImage(imageData, suggestedName);
                return { success: true, method: 'download', filename: suggestedName };
            }
            
            return { success: false, error: error.message };
        }
    },
    
    /**
     * 通过下载链接保存图像
     * @param {string} imageData - Base64编码的图像数据
     * @param {string} filename - 文件名
     */
    downloadImage(imageData, filename) {
        try {
            // 创建下载链接
            const downloadLink = document.createElement('a');
            downloadLink.href = imageData;
            downloadLink.download = filename;
            downloadLink.style.display = 'none';
            
            // 添加到DOM, 点击, 然后移除
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            console.log('已通过下载链接保存图像:', filename);
            return true;
        } catch (error) {
            console.error('创建下载链接时出错:', error);
            return false;
        }
    },
    
    /**
     * 加载本地图像文件并转换为Data URL
     * @param {FileSystemFileHandle} fileHandle - 文件句柄
     * @returns {Promise<string>} 图像的Data URL
     */
    async loadImageFromFile(fileHandle) {
        try {
            // 获取文件对象
            const file = await fileHandle.getFile();
            
            // 读取为Data URL
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error('读取文件失败'));
                
                reader.readAsDataURL(file);
            });
        } catch (error) {
            console.error('从文件加载图像时出错:', error);
            throw error;
        }
    },
    
    /**
     * 打开图像选择器
     * @returns {Promise<Object>} 包含选择的文件信息
     */
    async openImagePicker() {
        if (!this.isFileSystemAccessSupported) {
            console.warn('此浏览器不支持File System Access API');
            return { success: false, error: '不支持的浏览器功能' };
        }
        
        try {
            // 配置选择器选项
            const options = {
                types: [{
                    description: '图像文件',
                    accept: {
                        'image/*': ['.png', '.jpg', '.jpeg', '.gif']
                    }
                }],
                excludeAcceptAllOption: false,
                multiple: false
            };
            
            // 显示文件选择器
            const [fileHandle] = await window.showOpenFilePicker(options);
            const file = await fileHandle.getFile();
            
            // 读取为Data URL
            const dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
            
            return {
                success: true,
                fileHandle: fileHandle,
                name: file.name,
                type: file.type,
                size: file.size,
                dataUrl: dataUrl
            };
        } catch (error) {
            console.error('打开图像选择器时出错:', error);
            
            if (error.name === 'AbortError') {
                return { success: false, error: '用户取消了操作' };
            }
            
            return { success: false, error: error.message };
        }
    },
    
    /**
     * 将Data URL转换为Blob对象
     * @param {string} dataUrl - Base64编码的Data URL
     * @returns {Blob} 对应的Blob对象
     */
    dataURLtoBlob(dataUrl) {
        // 提取MIME类型和Base64数据
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        
        // 转换为字节数组
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        
        return new Blob([u8arr], { type: mime });
    }
};

// 导出为全局变量
window.FileSystemManager = FileSystemManager; 