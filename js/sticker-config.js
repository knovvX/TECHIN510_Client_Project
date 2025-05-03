// ====================== Sticker Configuration Module ======================

// Base path for sticker directory
const STICKERS_BASE_PATH = 'images/Food';

// Sticker category mapping (folder name to display name)
const STICKER_CATEGORIES = {
    'Asian Cuisine': 'Asian Cuisine',
    'Baking': 'Baking',
    'Brunch': 'Brunch',
    'Cheese': 'Cheese',
    'Chinese Cuisine': 'Chinese Cuisine',
    'Convenience Food': 'Convenience Food',
    'Desserts': 'Desserts',
    'Dips': 'Dips',
    'Drinks': 'Drinks',
    'Fruits': 'Fruits',
    'Japanese Culture': 'Japanese Culture',
    'Meat': 'Meat',
    'Snacks': 'Snacks',
    'Vegetables': 'Vegetables',
    'Western Cuisine': 'Western Cuisine'
};

// All available categories
const ALL_CATEGORIES = [
    'Asian Cuisine', 'Baking', 'Brunch', 'Cheese', 'Chinese Cuisine',
    'Convenience Food', 'Desserts', 'Dips', 'Drinks', 'Fruits',
    'Japanese Culture', 'Meat', 'Snacks', 'Vegetables', 'Western Cuisine'
];

// Initialize category file mapping
function initCategoryFiles() {
    console.log('Initializing category files dynamically');
    
    // Initialize known category file mappings
    const categoryFiles = {};
    
    // Files for Asian Cuisine category
    categoryFiles['Asian Cuisine'] = [
        '冬阴功.png', '咖喱饭.png', '椰汁糕.png', '泡菜.png', '泡菜汤.png',
        '炒年糕.png', '炒粉.png', '石锅拌饭.png', '绿咖喱.png', '芒果糯米饭.png',
        '菠萝炒饭.png', '越南春卷.png', '青木瓜沙拉.png', '韩国烤肉.png', '鱼饼.png'
    ];
    
    // Files for Baking category
    categoryFiles['Baking'] = [
        '华夫饼.png', '可颂.png', '吐司.png', '夹心面包.png', '夹心饼干.png',
        '奶油小方.png', '奶油蛋糕.png', '姜饼人.png', '巧克力蛋糕.png', '曲奇.png',
        '曲奇2.png', '曲奇3.png', '松饼.png', '法棍.png', '海绵蛋糕.png',
        '瑞士卷.png', '碱水包.png', '芝士蛋糕.png', '草莓瑞士卷.png', '蛋挞.png'
    ];
    
    // Files for Brunch category
    categoryFiles['Brunch'] = [
        '三文鱼开放三明治.png', '三明治1.png', '三明治2.png', '三明治3.png', '厚蛋吐司.png',
        '奥姆雷特.png', '帕尼尼.png', '早餐盘1.png', '沙拉.png', '沙拉2.png',
        '火腿蛋三明治.png', '芝士开放三明治.png', '蛋香可颂.png', '贝果.png', '鸡蛋全麦.png',
        '鸡蛋吐司.png'
    ];
    
    // Files for Chinese Cuisine category
    categoryFiles['Chinese Cuisine'] = [
        '东坡肉.png', '冷锅串串.png', '火锅.png', '炒饭.png', '烤串.png',
        '烤鸭.png', '煎饼果子.png', '盒饭便当.png', '米饭.png', '粥.png',
        '麻婆豆腐.png'
    ];
    
    // Files for Convenience Food category
    categoryFiles['Convenience Food'] = [
        'taco.png', '卷饼.png', '夹心派.png', '汉堡.png', '泡面.png', 
        '炸鸡.png', '热狗.png', '瓜子.png', '百奇.png', '花生.png',
        '薯条.png', '薯片.png', '虾片.png', '话梅.png', '零食.png'
    ];
    
    // Files for Desserts category
    categoryFiles['Desserts'] = [
        '三层下午茶.png', '冰淇淋.png', '巧克力.png', '巧克力2.png', '巧克力3.png',
        '抹茶冰淇淋.png', '杯子蛋糕.png', '杯子蛋糕2.png', '甜甜圈1.png', '甜甜圈2.png',
        '甜筒.png', '糖果1.png', '糖果2.png', '糖果3.png', '雪糕.png', '雪顶饮料.png'
    ];
    
    // Files for Fruits category
    categoryFiles['Fruits'] = [
        '苹果.png', '香蕉.png', '橙子.png', '草莓.png', '葡萄.png', 
        '西瓜.png', '菠萝.png', '桃子.png', '柚子.png', '柠檬.png', 
        '梨.png', '樱桃1.png', '樱桃2.png', '橘子.png', '水蜜桃.png', 
        '牛油果.png', '猕猴桃.png', '芒果.png', '椰子.png', '蓝莓.png', '哈密瓜.png'
    ];
    
    // Files for Japanese Culture category
    categoryFiles['Japanese Culture'] = [
        '三文鱼.png', '三角饭团.png', '冷豆腐.png', '味增汤.png', '天妇罗.png',
        '寿司.png', '寿喜烧.png', '手卷.png', '日式拉面.png', '椒盐毛豆.png',
        '秋刀鱼.png', '章鱼小丸子.png', '纳豆.png', '花见団子.png', '草莓大福.png',
        '鲷鱼烧.png'
    ];
    
    // Files for Meat category
    categoryFiles['Meat'] = [
        '培根.png', '牛排.png', '猪肉.png', '章鱼.png', '肉片.png', 
        '肉片2.png', '虾.png', '螃蟹.png', '香肠.png', '鱼.png', 
        '鱼块.png', '鸡胸肉.png', '鸡翅.png', '鸡腿.png', '龙虾.png', '扇贝.png'
    ];
    
    // Files for Western Cuisine category
    categoryFiles['Western Cuisine'] = [
        '西餐-千层面.png', '西餐-巴西烧烤.png', '西餐-德式香肠.png', '西餐-炸鱼薯条.png',
        '西餐-烤鸡.png', '西餐-牛排餐.png', '西餐-生蚝盘.png', '西餐-番茄意面.png',
        '西餐-羊排.png', '西餐-芝士冷盘.png', '西餐-蘑菇奶油通心粉.png'
    ];
    
    // Files for Cheese category
    categoryFiles['Cheese'] = [
        '养乐多.png', '奶油.png', '奶油朵.png', '奶酪.png', '布丁.png',
        '水果酸奶.png', '牛奶.png', '牛奶2.png', '牛奶麦片.png', '草莓牛奶.png',
        '草莓酸奶.png', '酸奶.png', '酸奶2.png', '鸡蛋1.png', '鸡蛋2.png', '黄油.png'
    ];
    
    // Files for Drinks category
    categoryFiles['Drinks'] = [
        '伏特加.png', '可乐.png', '咖啡.png', '啤酒.png', '威士忌.png',
        '柠檬水.png', '气泡水.png', '矿泉水.png', '芬达.png', '茶.png',
        '酒.png', '金酒.png', '雪碧.png', '龙舌兰.png'
    ];
    
    // Files for Dips category
    categoryFiles['Dips'] = [
        '巧克力酱.png', '果酱1.png', '果酱2.png', '果酱3.png', '番茄酱.png',
        '盐.png', '老干妈.png', '蜂蜜.png', '辣椒酱.png', '酱汁1.png',
        '酱汁2.png', '酱汁3.png', '酱汁4.png', '酱油.png', '黄芥末.png', '黑胡椒.png'
    ];
    
    // Files for Snacks category
    categoryFiles['Snacks'] = [
        '包子1.png', '包子2.png', '包子3.png', '小笼包.png', '月饼.png',
        '水饺.png', '汤圆.png', '烧麦1.png', '烧麦2.png', '粽子.png',
        '肉夹馍.png', '荷叶糯米鸡.png', '蒸排骨.png', '虾饺.png', '韭菜盒子.png'
    ];
    
    // Files for Vegetables category
    categoryFiles['Vegetables'] = [
        '串枝番茄.png', '南瓜.png', '图层 22.png', '土豆.png', '小红萝卜.png',
        '玉米.png', '甜椒1.png', '甜椒2.png', '番茄1.png', '番茄2.png',
        '番茄3.png', '白萝卜.png', '紫薯.png', '绿叶菜1.png', '绿叶菜2.png',
        '绿叶菜3.png', '胡萝卜.png', '茄子.png', '蘑菇.png', '西蓝花.png',
        '豌豆.png', '辣椒.png', '香菇.png', '黄瓜.png'
    ];
    
    // For other undefined categories, we'll try to dynamically load files when used
    ALL_CATEGORIES.forEach(category => {
        if (!categoryFiles[category]) {
            categoryFiles[category] = [];
        }
    });
    
    return categoryFiles;
} 