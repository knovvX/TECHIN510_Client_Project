/**
 * 本地存储管理器 - 用于处理日记数据的保存和加载
 */

const LocalStorageManager = {
    // 本地存储的键名
    JOURNALS_KEY: 'journals',
    
    /**
     * 保存日记数据到本地存储
     * @param {Object} journalData - 包含日记信息的对象
     */
    saveJournal: function(journalData) {
        if (!journalData || !journalData.id) {
            console.error('无效的日记数据', journalData);
            return false;
        }
        
        try {
            // 获取现有日记
            let journals = this.getAllJournals();
            
            // 检查是否更新现有日记
            const existingIndex = journals.findIndex(j => j.id === journalData.id);
            if (existingIndex >= 0) {
                // 保留原始创建日期
                journalData.created = journals[existingIndex].created;
                // 更新现有日记
                journals[existingIndex] = journalData;
                console.log('更新现有日记:', journalData.id);
            } else {
                // 添加新日记
                journals.push(journalData);
                console.log('创建新日记:', journalData.id);
            }
            
            // 按日期排序（最新的在前）
            journals.sort((a, b) => new Date(b.created) - new Date(a.created));
            
            // 保存到localStorage
            localStorage.setItem(this.JOURNALS_KEY, JSON.stringify(journals));
            console.log('成功保存日记到本地存储');
            
            return true;
        } catch (error) {
            console.error('保存日记时出错:', error);
            return false;
        }
    },
    
    /**
     * 获取所有日记
     * @returns {Array} 日记对象数组
     */
    getAllJournals: function() {
        try {
            return JSON.parse(localStorage.getItem(this.JOURNALS_KEY) || '[]');
        } catch (error) {
            console.error('获取日记时出错:', error);
            return [];
        }
    },
    
    /**
     * 根据ID获取日记
     * @param {string} journalId - 日记ID
     * @returns {Object|null} 日记对象或null
     */
    getJournalById: function(journalId) {
        if (!journalId) return null;
        
        try {
            const journals = this.getAllJournals();
            return journals.find(j => j.id === journalId) || null;
        } catch (error) {
            console.error('根据ID获取日记时出错:', error);
            return null;
        }
    },
    
    /**
     * 删除日记
     * @param {string} journalId - 要删除的日记ID
     * @returns {boolean} 是否成功删除
     */
    deleteJournal: function(journalId) {
        if (!journalId) return false;
        
        try {
            let journals = this.getAllJournals();
            const initialLength = journals.length;
            
            // 过滤掉要删除的日记
            journals = journals.filter(j => j.id !== journalId);
            
            if (journals.length < initialLength) {
                // 保存更新后的列表
                localStorage.setItem(this.JOURNALS_KEY, JSON.stringify(journals));
                console.log('成功删除日记:', journalId);
                return true;
            } else {
                console.warn('未找到要删除的日记:', journalId);
                return false;
            }
        } catch (error) {
            console.error('删除日记时出错:', error);
            return false;
        }
    },
    
    /**
     * 将图像数据保存为PNG文件并下载
     * @param {string} imageData - Base64编码的图像数据
     * @param {string} filename - 文件名
     * @returns {boolean} 是否成功创建下载链接
     */
    saveImageToDisk: function(imageData, filename) {
        if (!imageData || !filename) {
            console.error('保存图像所需的参数无效');
            return false;
        }
        
        try {
            // 创建隐形下载链接
            const downloadLink = document.createElement('a');
            downloadLink.href = imageData;
            downloadLink.download = filename;
            downloadLink.style.display = 'none';
            
            // 添加到DOM, 点击, 然后移除
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            
            console.log('图像文件下载创建成功:', filename);
            return true;
        } catch (error) {
            console.error('创建图像文件下载时出错:', error);
            return false;
        }
    },
    
    /**
     * 用于同步访问IndexedDB的方法
     * 这是一个未来可能的扩展，目前仅作为参考
     */
    syncWithIndexedDB: function() {
        console.log('IndexedDB同步功能尚未实现');
    }
};

// 导出为全局变量
window.LocalStorageManager = LocalStorageManager; 