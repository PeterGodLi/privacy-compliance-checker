// 应用数据
const appDatabase = {
    all: [
        '微信', '抖音', 'QQ', '支付宝', '淘宝', '京东', '美团', '饿了么', '滴滴出行', '高德地图',
        '百度地图', '网易云音乐', 'QQ音乐', '酷狗音乐', '爱奇艺', '腾讯视频', '优酷', '哔哩哔哩',
        '知乎', '微博', '小红书', '今日头条', '快手', '拼多多', '唯品会', '苏宁易购', '携程',
        '去哪儿', '马蜂窝', '12306', '中国银行', '工商银行', '建设银行', '农业银行', '招商银行',
        '交通银行', '浦发银行', '民生银行', '光大银行', '中信银行', '平安银行', '华夏银行',
        '广发银行', '兴业银行', '邮储银行', '钉钉', '企业微信', '腾讯会议', 'ZOOM', 'WPS Office',
        'Microsoft Office', 'Adobe Photoshop', 'Adobe Illustrator', 'Sketch', 'Figma', 'Chrome',
        'Safari', 'Firefox', 'Edge', 'Opera', 'QQ浏览器', 'UC浏览器', '360浏览器', '搜狗浏览器',
        'Steam', 'Epic Games', '腾讯游戏', '网易游戏', '王者荣耀', '和平精英', '原神', '英雄联盟',
        'DOTA2', 'CS:GO', 'Valorant', 'Overwatch', 'Apex Legends', 'Fortnite', 'PUBG', 'Minecraft',
        'Roblox', 'Among Us', 'Fall Guys', 'Rocket League', 'FIFA', 'NBA 2K', 'Call of Duty',
        'Battlefield', 'Grand Theft Auto', 'Red Dead Redemption', 'The Witcher', 'Cyberpunk 2077',
        'Assassin\'s Creed', 'Far Cry', 'Watch Dogs', 'Tom Clancy\'s', 'Ubisoft Connect', 'Origin',
        'Battle.net', 'GOG Galaxy', 'Discord', 'Telegram', 'WhatsApp', 'Line', 'Skype', 'Slack'
    ],
    ios: ['Safari', 'App Store', 'iTunes', 'iMessage', 'FaceTime', 'Photos', 'Camera', 'Maps', 'Weather', 'Clock'],
    macos: ['Safari', 'Finder', 'Mail', 'Calendar', 'Photos', 'iTunes', 'QuickTime', 'TextEdit', 'Preview', 'Terminal'],
    android: ['Chrome', 'Gmail', 'Google Maps', 'YouTube', 'Google Play', 'Google Photos', 'Google Drive', 'Google Docs', 'Google Sheets', 'Google Slides'],
    windows: ['Microsoft Edge', 'Windows Media Player', 'Paint', 'Notepad', 'Calculator', 'Windows Store', 'Xbox', 'Skype', 'OneDrive', 'Outlook'],
    harmonyos: ['华为浏览器', '华为应用市场', '华为音乐', '华为视频', '华为钱包', '华为健康', '华为天气', '华为日历', '华为相机', '华为图库']
};

// 隐私条款URL数据库
const privacyUrls = {
    '微信': 'https://weixin.qq.com/cgi-bin/readtemplate?t=weixin_agreement&s=privacy',
    '抖音': 'https://www.douyin.com/draft/douyin_agreement/douyin_agreement_privacy.html',
    'QQ': 'https://ti.qq.com/agreement/qqface.html',
    '支付宝': 'https://render.alipay.com/p/c/k2cx0tg8',
    '淘宝': 'https://terms.alicdn.com/legal-agreement/terms/suit_bu1_taobao/suit_bu1_taobao202103191654_53871.html',
    '京东': 'https://about.jd.com/privacy/',
    '美团': 'https://rules-center.meituan.com/rules-detail/4',
    '饿了么': 'https://h5.ele.me/restapi/eus/agreements/privacy',
    '滴滴出行': 'https://www.didiglobal.com/science/privacy',
    '高德地图': 'https://terms.alicdn.com/legal-agreement/terms/suit_bu1_ali_group/suit_bu1_ali_group202009141558_99053.html'
};

// DOM 元素
let elements = {};

// 上传的文件
let uploadedFiles = [];

// 应用检测器
let appDetector = null;

// 信息收集分析器
let infoCollectionAnalyzer = null;

// LLM分析器
let llmAnalyzer = null;
let llmConfigManager = null;

// 本地检测到的应用
let localApps = [];

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    updateCurrentTime();
    loadPresetAppList();
    initializeAppDetector();
    initializeInfoCollectionAnalyzer();
    initializeLLMAnalyzer();
    updateLLMStatus();
    initializePlatformBadges();
});

// 初始化DOM元素引用
function initializeElements() {
    elements = {
        platformSelect: document.getElementById('platformSelect'),
        appName: document.getElementById('appName'),
        localAppSelect: document.getElementById('localAppSelect'),
        presetAppSelect: document.getElementById('presetAppSelect'),
        presetAppCount: document.getElementById('presetAppCount'),
        localAppCount: document.getElementById('localAppCount'),
        localCount: document.getElementById('localCount'),
        noLocalApps: document.getElementById('noLocalApps'),
        privacyUrl: document.getElementById('privacyUrl'),
        selectFileBtn: document.getElementById('selectFileBtn'),
        scanLocalAppsBtn: document.getElementById('scanLocalAppsBtn'),
        autoGetConfigBtn: document.getElementById('autoGetConfigBtn'),
        fileInput: document.getElementById('fileInput'),
        fileList: document.getElementById('fileList'),
        analyzeBtn: document.getElementById('analyzeBtn'),
        resetBtn: document.getElementById('resetBtn'),
        infoCollectionSection: document.getElementById('infoCollectionSection'),
        infoCollectionResults: document.getElementById('infoCollectionResults'),
        resultsSection: document.getElementById('resultsSection'),
        analysisResults: document.getElementById('analysisResults'),
        loadingOverlay: document.getElementById('loadingOverlay'),
        currentTime: document.getElementById('currentTime')
    };
}

// 设置事件监听器
function setupEventListeners() {
    // 平台选择变化
    elements.platformSelect.addEventListener('change', handlePlatformChange);
    
    // 应用名称输入
    elements.appName.addEventListener('input', handleAppNameInput);
    
    // 本地应用选择
    elements.localAppSelect.addEventListener('change', handleLocalAppSelect);
    
    // 预置应用选择
    elements.presetAppSelect.addEventListener('change', handlePresetAppSelect);
    
    // 文件选择
    elements.selectFileBtn.addEventListener('click', () => elements.fileInput.click());
    elements.fileInput.addEventListener('change', handleFileSelect);
    
    // 移除自动获取功能
    
    // 扫描本地应用
    elements.scanLocalAppsBtn.addEventListener('click', handleScanLocalApps);
    
    // 自动获取配置文件
    elements.autoGetConfigBtn.addEventListener('click', handleAutoGetConfig);
    
    // 分析按钮
    elements.analyzeBtn.addEventListener('click', handleAnalyze);
    
    // 重置按钮
    elements.resetBtn.addEventListener('click', handleReset);
    
    // 文件拖拽
    setupFileDragDrop();
}

// 更新当前时间
function updateCurrentTime() {
    const now = new Date();
    const timeString = now.getFullYear() + '/' + 
                      String(now.getMonth() + 1).padStart(2, '0') + '/' + 
                      String(now.getDate()).padStart(2, '0') + ' ' +
                      String(now.getHours()).padStart(2, '0') + ':' +
                      String(now.getMinutes()).padStart(2, '0') + ':' +
                      String(now.getSeconds()).padStart(2, '0');
    elements.currentTime.textContent = timeString;
    
    // 每秒更新一次
    setTimeout(updateCurrentTime, 1000);
}

// 初始化平台徽章
function initializePlatformBadges() {
    // 确保"全部平台"按钮默认激活
    const allBadge = document.querySelector('.platform-badges .badge[data-platform="all"]');
    if (allBadge && !allBadge.classList.contains('active')) {
        allBadge.classList.add('active');
    }
}

// 平台选择函数（通过平台按钮触发）
function selectPlatform(platform) {
    // 更新按钮激活状态
    document.querySelectorAll('.platform-badges .badge').forEach(badge => {
        badge.classList.remove('active');
    });
    document.querySelector(`.platform-badges .badge[data-platform="${platform}"]`).classList.add('active');
    
    // 更新下拉列表选项
    elements.platformSelect.value = platform;
    
    // 触发平台选择变化处理
    handlePlatformChange();
}

// 处理平台选择变化
function handlePlatformChange() {
    const selectedPlatform = elements.platformSelect.value;
    loadPresetAppList(selectedPlatform);
    updateFileUploadHints(selectedPlatform);
}

// 加载预置应用列表
function loadPresetAppList(platform = 'all') {
    const apps = platform === 'all' ? appDatabase.all : 
                 [...appDatabase.all, ...(appDatabase[platform] || [])];
    
    // 去重并排序
    const uniqueApps = [...new Set(apps)].sort();
    
    // 清空现有选项
    elements.presetAppSelect.innerHTML = '<option value="">-- 选择预置应用 --</option>';
    
    // 添加应用选项
    uniqueApps.forEach(app => {
        const option = document.createElement('option');
        option.value = app;
        option.textContent = app;
        elements.presetAppSelect.appendChild(option);
    });
    
    // 更新应用数量
    elements.presetAppCount.textContent = uniqueApps.length;
}

// 处理应用名称输入
function handleAppNameInput() {
    const appName = elements.appName.value.trim();
    if (appName) {
        // 清空应用选择
        elements.appSelect.value = '';
        // 自动填充隐私条款URL
        fillPrivacyUrl(appName);
    }
}

// 处理本地应用选择
async function handleLocalAppSelect() {
    const selectedApp = elements.localAppSelect.value;
    if (selectedApp) {
        // 清空预置应用选择
        elements.presetAppSelect.value = '';
        
        // 填充应用名称
        elements.appName.value = selectedApp;
        
        // 自动填充隐私条款URL
        await fillPrivacyUrl(selectedApp);
        
        // 显示获取配置文件按钮
        elements.autoGetConfigBtn.style.display = 'inline-flex';
        
        showNotification(`已选择本地应用: ${selectedApp}`, 'success');
    } else {
        elements.autoGetConfigBtn.style.display = 'none';
    }
}

// 处理预置应用选择
async function handlePresetAppSelect() {
    const selectedApp = elements.presetAppSelect.value;
    if (selectedApp) {
        // 清空本地应用选择
        elements.localAppSelect.value = '';
        
        // 填充应用名称
        elements.appName.value = selectedApp;
        
        // 自动填充隐私条款URL
        await fillPrivacyUrl(selectedApp);
        
        // 隐藏获取配置文件按钮
        elements.autoGetConfigBtn.style.display = 'none';
        
        showNotification(`已选择预置应用: ${selectedApp}`, 'info');
    }
}

// 自动填充隐私条款URL
async function fillPrivacyUrl(appName) {
    // 首先尝试从静态数据库获取
    if (privacyUrls[appName]) {
        elements.privacyUrl.value = privacyUrls[appName];
        return;
    }
    
    // 如果应用检测器可用，尝试从检测器获取
    if (appDetector) {
        try {
            const url = await appDetector.getAppPrivacyUrl(appName);
            if (url) {
                elements.privacyUrl.value = url;
                showNotification(`已自动获取 ${appName} 的隐私条款链接`, 'success');
            }
        } catch (error) {
            console.warn('获取隐私条款URL失败:', error);
        }
    }
}

// 更新文件上传提示
function updateFileUploadHints(platform) {
    const hints = {
        all: 'Info.plist, AndroidManifest.xml, AppxManifest.xml, config.json',
        ios: 'Info.plist',
        macos: 'Info.plist',
        android: 'AndroidManifest.xml',
        windows: 'AppxManifest.xml',
        harmonyos: 'config.json'
    };
    
    // 这里可以更新UI中的文件类型提示
    console.log(`当前平台支持的文件类型: ${hints[platform] || hints.all}`);
}

// 处理文件选择
function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => addFile(file));
    updateFileList();
}

// 处理自动获取配置文件
async function handleAutoGetConfig() {
    const selectedApp = elements.localAppSelect.value;
    const platform = elements.platformSelect.value;
    
    if (!selectedApp) {
        showNotification('请先选择一个本地应用', 'warning');
        return;
    }
    
    try {
        elements.autoGetConfigBtn.disabled = true;
        elements.autoGetConfigBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 获取中...';
        
        showNotification('正在获取应用配置文件...', 'info');
        
        // 获取配置文件内容
        const configContent = await getLocalAppConfig(selectedApp, platform);
        
        if (configContent) {
            // 创建虚拟文件
            const fileName = getConfigFileName(platform);
            const blob = new Blob([configContent], { type: 'text/xml' });
            const file = new File([blob], fileName, { type: 'text/xml' });
            
            // 添加到文件列表
            addFile(file);
            updateFileList();
            
            showNotification(`成功获取 ${selectedApp} 的配置文件`, 'success');
        } else {
            showNotification('无法获取配置文件，请手动上传', 'warning');
        }
        
    } catch (error) {
        console.error('获取配置文件失败:', error);
        showNotification('获取配置文件失败: ' + error.message, 'error');
    } finally {
        elements.autoGetConfigBtn.disabled = false;
        elements.autoGetConfigBtn.innerHTML = '<i class="fas fa-download"></i> 获取配置文件';
    }
}

// 获取本地应用配置文件内容
async function getLocalAppConfig(appName, platform) {
    // 模拟获取配置文件内容
    // 在实际项目中，这里需要调用系统API或使用Electron等方式
    
    const configTemplates = {
        ios: generateiOSConfig(appName),
        macos: generateMacOSConfig(appName),
        android: generateAndroidConfig(appName),
        windows: generateWindowsConfig(appName),
        harmonyos: generateHarmonyOSConfig(appName)
    };
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return configTemplates[platform] || configTemplates.android;
}

// 获取配置文件名
function getConfigFileName(platform) {
    const fileNames = {
        ios: 'Info.plist',
        macos: 'Info.plist',
        android: 'AndroidManifest.xml',
        windows: 'AppxManifest.xml',
        harmonyos: 'config.json'
    };
    return fileNames[platform] || 'config.xml';
}

// 生成iOS配置文件模板
function generateiOSConfig(appName) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleDisplayName</key>
    <string>${appName}</string>
    <key>CFBundleName</key>
    <string>${appName}</string>
    <key>CFBundleIdentifier</key>
    <string>com.example.${appName.toLowerCase().replace(/\s+/g, '')}</string>
    <key>NSCameraUsageDescription</key>
    <string>此应用需要访问相机以拍摄照片和录制视频</string>
    <key>NSMicrophoneUsageDescription</key>
    <string>此应用需要访问麦克风以录制音频</string>
    <key>NSLocationWhenInUseUsageDescription</key>
    <string>此应用需要访问您的位置信息以提供基于位置的服务</string>
    <key>NSPhotoLibraryUsageDescription</key>
    <string>此应用需要访问相册以选择和保存照片</string>
    <key>NSContactsUsageDescription</key>
    <string>此应用需要访问通讯录以便您与朋友分享内容</string>
</dict>
</plist>`;
}

// 生成macOS配置文件模板
function generateMacOSConfig(appName) {
    return generateiOSConfig(appName); // macOS使用相同的Info.plist格式
}

// 生成Android配置文件模板
function generateAndroidConfig(appName) {
    return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.${appName.toLowerCase().replace(/\s+/g, '')}"
    android:versionCode="1"
    android:versionName="1.0">

    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:label="${appName}"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
    </application>
</manifest>`;
}

// 生成Windows配置文件模板
function generateWindowsConfig(appName) {
    return `<?xml version="1.0" encoding="utf-8"?>
<Package xmlns="http://schemas.microsoft.com/appx/manifest/foundation/windows10">
  <Identity Name="com.example.${appName.replace(/\s+/g, '')}"
            Publisher="CN=Example Publisher"
            Version="1.0.0.0" />

  <Properties>
    <DisplayName>${appName}</DisplayName>
    <PublisherDisplayName>Example Publisher</PublisherDisplayName>
  </Properties>

  <Applications>
    <Application Id="App" Executable="${appName}.exe" EntryPoint="${appName}.App">
      <uap:VisualElements DisplayName="${appName}" Description="${appName} Application" />
    </Application>
  </Applications>

  <Capabilities>
    <Capability Name="internetClient" />
    <DeviceCapability Name="webcam" />
    <DeviceCapability Name="microphone" />
    <DeviceCapability Name="location" />
  </Capabilities>
</Package>`;
}

// 生成鸿蒙OS配置文件模板
function generateHarmonyOSConfig(appName) {
    return `{
  "app": {
    "bundleName": "com.example.${appName.toLowerCase().replace(/\s+/g, '')}",
    "vendor": "example",
    "version": {
      "code": 1,
      "name": "1.0.0"
    },
    "apiVersion": {
      "compatible": 8,
      "target": 9
    }
  },
  "deviceConfig": {},
  "module": {
    "package": "com.example.${appName.toLowerCase().replace(/\s+/g, '')}",
    "name": ".MainAbility",
    "mainAbility": ".MainAbility",
    "deviceType": [
      "phone",
      "tablet"
    ],
    "distro": {
      "deliveryWithInstall": true,
      "moduleName": "entry",
      "moduleType": "entry"
    },
    "abilities": [
      {
        "skills": [
          {
            "entities": [
              "entity.system.home"
            ],
            "actions": [
              "action.system.home"
            ]
          }
        ],
        "orientation": "unspecified",
        "name": ".MainAbility",
        "icon": "$media:icon",
        "description": "$string:mainability_description",
        "label": "${appName}",
        "type": "page",
        "launchType": "standard"
      }
    ],
    "reqPermissions": [
      {
        "name": "ohos.permission.CAMERA",
        "reason": "需要使用相机功能"
      },
      {
        "name": "ohos.permission.MICROPHONE",
        "reason": "需要使用麦克风功能"
      },
      {
        "name": "ohos.permission.LOCATION",
        "reason": "需要获取位置信息"
      },
      {
        "name": "ohos.permission.READ_MEDIA",
        "reason": "需要读取媒体文件"
      },
      {
        "name": "ohos.permission.INTERNET",
        "reason": "需要网络访问权限"
      }
    ]
  }
}`;
}

// 添加文件
function addFile(file) {
    // 检查文件类型
    const allowedTypes = ['.plist', '.xml', '.json'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
        showNotification('不支持的文件类型，请选择 .plist、.xml 或 .json 文件', 'error');
        return;
    }
    
    // 检查是否已存在同名文件
    const existingIndex = uploadedFiles.findIndex(f => f.name === file.name);
    if (existingIndex !== -1) {
        uploadedFiles[existingIndex] = file;
        showNotification('文件已更新', 'success');
    } else {
        uploadedFiles.push(file);
        showNotification('文件添加成功', 'success');
    }
}

// 更新文件列表显示
function updateFileList() {
    if (uploadedFiles.length === 0) {
        elements.fileList.innerHTML = `
            <div style="text-align: center; color: #999;">
                <i class="fas fa-cloud-upload-alt" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                <p>拖拽文件到此处或点击"选择文件"按钮</p>
                <p style="font-size: 0.9rem; margin-top: 5px;">支持 .plist、.xml 和 .json 文件</p>
            </div>
        `;
        elements.fileList.classList.remove('has-files');
    } else {
        elements.fileList.innerHTML = '';
        elements.fileList.classList.add('has-files');
        
        uploadedFiles.forEach((file, index) => {
            const fileItem = createFileItem(file, index);
            elements.fileList.appendChild(fileItem);
        });
    }
}

// 创建文件项
function createFileItem(file, index) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item';
    
    const fileType = file.name.split('.').pop().toLowerCase();
    const iconClass = fileType === 'plist' ? 'fab fa-apple' : 'fab fa-android';
    
    fileItem.innerHTML = `
        <div class="file-icon">
            <i class="${iconClass}"></i>
        </div>
        <div class="file-info">
            <div class="file-name">${file.name}</div>
            <div class="file-size">${formatFileSize(file.size)}</div>
        </div>
        <div class="file-remove" onclick="removeFile(${index})">
            <i class="fas fa-times"></i>
        </div>
    `;
    
    return fileItem;
}

// 移除文件
function removeFile(index) {
    uploadedFiles.splice(index, 1);
    updateFileList();
    showNotification('文件已移除', 'info');
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 设置文件拖拽
function setupFileDragDrop() {
    elements.fileList.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.fileList.style.borderColor = '#667eea';
        elements.fileList.style.backgroundColor = '#f0f2ff';
    });
    
    elements.fileList.addEventListener('dragleave', (e) => {
        e.preventDefault();
        elements.fileList.style.borderColor = '#e1e5e9';
        elements.fileList.style.backgroundColor = '';
    });
    
    elements.fileList.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.fileList.style.borderColor = '#e1e5e9';
        elements.fileList.style.backgroundColor = '';
        
        const files = Array.from(e.dataTransfer.files);
        files.forEach(file => addFile(file));
        updateFileList();
    });
}

// 自动获取功能已移除，简化上传流程

// 处理分析
function handleAnalyze() {
    const appName = elements.appName.value.trim();
    const privacyUrl = elements.privacyUrl.value.trim();
    
    if (!appName) {
        showNotification('请输入应用名称', 'warning');
        return;
    }
    
    if (uploadedFiles.length === 0) {
        showNotification('请上传至少一个配置文件', 'warning');
        return;
    }
    
    // 开始分析
    performAnalysis(appName, privacyUrl, uploadedFiles);
}

// 执行分析（增强版）
async function performAnalysis(appName, privacyUrl, files) {
    showLoading(true);
    
    try {
        // 使用增强版解析器
        const useEnhanced = typeof ConfigParserEnhanced !== 'undefined';
        const configParser = useEnhanced ? new ConfigParserEnhanced() : new ConfigParser();
        const permissionAnalyzer = useEnhanced ? new PermissionAnalyzerEnhanced() : new PermissionAnalyzer();
        
        console.log(`🔧 使用${useEnhanced ? '增强版' : '标准'}解析器`);
        
        // 解析配置文件
        const configResults = [];
        const parseErrors = [];
        
        for (const file of files) {
            try {
                showNotification(`正在解析 ${file.name}...`, 'info');
                const result = await configParser.parseFile(file);
                configResults.push(result);
                console.log(`✅ 解析文件 ${file.name} 成功:`, result);
                
                // 显示解析成功信息
                if (result.qualityScore) {
                    showNotification(`${file.name} 解析完成 (质量分数: ${result.qualityScore}/100)`, 'success');
                }
            } catch (error) {
                console.error(`❌ 解析文件 ${file.name} 失败:`, error);
                parseErrors.push({ file: file.name, error: error.message });
                showNotification(`解析 ${file.name} 失败: ${error.message}`, 'error');
            }
        }
        
        if (configResults.length === 0) {
            throw new Error('没有成功解析的配置文件，请检查文件格式是否正确');
        }
        
        // 显示解析统计
        if (useEnhanced && configParser.getStats) {
            const stats = configParser.getStats();
            console.log('📊 解析统计:', stats);
        }
        
        // 生成配置文件详情（用于展示）
        let configDetails = [];
        if (useEnhanced && configParser.generateConfigDetails) {
            configDetails = configParser.generateConfigDetails(configResults);
        } else {
            // 标准方式生成
            configResults.forEach(result => {
                (result.permissions || []).forEach(permission => {
                    configDetails.push({
                        permission: permission.key,
                        infoTypeName: permission.name,
                        infoType: permission.type,
                        description: permission.description || '',
                        scenarios: inferScenarios(permission.type),
                        platform: result.platform,
                        fileType: result.type
                    });
                });
            });
        }
        
        console.log('📋 配置文件详情:', configDetails);
        
        // 合并所有配置文件的权限
        const allPermissions = [];
        configResults.forEach(result => {
            allPermissions.push(...result.permissions);
        });
        
        // 获取隐私条款内容
        let privacyText = '';
        if (privacyUrl) {
            try {
                showNotification('正在获取隐私条款...', 'info');
                privacyText = await fetchPrivacyPolicy(privacyUrl);
                showNotification('隐私条款获取成功', 'success');
            } catch (error) {
                console.warn('获取隐私条款失败:', error);
                showNotification('无法获取隐私条款，将使用模拟数据进行分析', 'warning');
                privacyText = generateMockPrivacyText(appName);
            }
        } else {
            privacyText = generateMockPrivacyText(appName);
        }
        
        // 执行合规性分析
        const analysisResults = permissionAnalyzer.analyzeCompliance(allPermissions, privacyText);
        const complianceReport = permissionAnalyzer.generateComplianceReport(analysisResults);
        
        // 执行信息收集清单分析
        let infoCollectionReport = null;
        const analyzer = llmAnalyzer || infoCollectionAnalyzer; // 优先使用LLM分析器
        
        if (analyzer) {
            try {
                showNotification('正在使用' + (llmAnalyzer ? '大模型' : '规则引擎') + '进行深度分析...', 'info');
                
                // 分析隐私条款中的信息收集
                let privacyCollections = [];
                if (llmAnalyzer) {
                    privacyCollections = await llmAnalyzer.analyzePrivacyPolicy(privacyText);
                } else {
                    privacyCollections = infoCollectionAnalyzer.analyzePrivacyPolicy(privacyText);
                }
                
                // 分析配置文件中的信息收集
                let configCollections = [];
                for (const configResult of configResults) {
                    let collections = [];
                    if (llmAnalyzer) {
                        collections = await llmAnalyzer.analyzeConfigFile(configResult, getPlatformKey(configResult.platform));
                    } else {
                        collections = infoCollectionAnalyzer.analyzeConfigFile(configResult, getPlatformKey(configResult.platform));
                    }
                    configCollections.push(...collections);
                }
                
                // 合并分析结果
                const mergedCollections = infoCollectionAnalyzer.mergeAnalysisResults(privacyCollections, configCollections);
                infoCollectionReport = infoCollectionAnalyzer.generateCollectionReport(mergedCollections, privacyCollections, configCollections);
                
                // 将配置文件详情添加到报告中
                infoCollectionReport.configDetails = configDetails;
                
                console.log('信息收集清单分析完成:', infoCollectionReport);
            } catch (error) {
                console.error('信息收集清单分析失败:', error);
                showNotification('分析过程出现问题，部分结果可能不准确', 'warning');
            }
        } else {
            // 没有分析器时，也要设置configDetails
            infoCollectionReport = {
                configDetails: configDetails,
                summary: { totalTypes: 0, consistent: 0, privacyOnly: 0, configOnly: configDetails.length },
                collections: [],
                recommendations: []
            };
        }
        
        // 生成最终结果
        const results = {
            appName,
            privacyUrl,
            files: files.map(f => f.name),
            configResults,
            privacyText: privacyText.substring(0, 500) + '...', // 只显示前500字符
            infoCollectionReport,
            ...complianceReport
        };
        
        showLoading(false);
        
        // 显示信息收集清单
        if (infoCollectionReport) {
            displayInfoCollectionResults(infoCollectionReport);
            elements.infoCollectionSection.style.display = 'block';
        }
        
        // 显示合规分析结果
        displayAnalysisResults(results);
        elements.resultsSection.style.display = 'block';
        
        // 滚动到结果区域
        if (infoCollectionReport) {
            elements.infoCollectionSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            elements.resultsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        showNotification('分析完成！', 'success');
        
    } catch (error) {
        showLoading(false);
        console.error('分析过程出错:', error);
        showNotification(`分析失败: ${error.message}`, 'error');
    }
}

// 获取隐私条款内容
async function fetchPrivacyPolicy(url) {
    try {
        // 由于浏览器的CORS限制，这里使用模拟数据
        // 在实际项目中，需要通过后端代理或使用专门的API来获取网页内容
        console.log(`尝试获取隐私条款: ${url}`);
        
        // 模拟网络请求延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 返回模拟的隐私条款内容
        return generateMockPrivacyText();
    } catch (error) {
        throw new Error(`获取隐私条款失败: ${error.message}`);
    }
}

// 生成模拟隐私条款文本
function generateMockPrivacyText(appName = '应用') {
    return `
${appName}隐私政策

我们非常重视您的隐私保护。本隐私政策说明了我们如何收集、使用和保护您的个人信息。

1. 信息收集
我们可能会收集以下类型的信息：
- 相机权限：用于拍照和录制视频功能
- 麦克风权限：用于录音和语音通话功能
- 存储权限：用于保存和读取文件
- 网络权限：用于数据传输和在线服务

2. 信息使用
我们收集的信息将用于：
- 提供核心应用功能
- 改善用户体验
- 技术支持和客户服务

3. 信息保护
我们采用行业标准的安全措施来保护您的个人信息，包括：
- 数据加密传输
- 访问权限控制
- 定期安全审计

4. 第三方服务
我们可能会使用第三方服务来提供某些功能，这些服务有自己的隐私政策。

5. 联系我们
如果您对本隐私政策有任何疑问，请通过以下方式联系我们：
邮箱：privacy@example.com
电话：400-123-4567

本隐私政策最后更新于：2025年11月25日
    `.trim();
}

// 显示分析结果
function displayAnalysisResults(results) {
    const { appName, summary, permissions, recommendations, configResults, privacyUrl, files } = results;
    
    elements.analysisResults.innerHTML = `
        <div class="analysis-header">
            <h4><i class="fas fa-mobile-alt"></i> ${appName} - 隐私合规分析报告</h4>
            <div class="analysis-time">分析时间: ${new Date().toLocaleString()}</div>
        </div>
        
        <!-- 差异说明卡片 -->
        <div class="difference-explanation-card">
            <div class="explanation-header">
                <i class="fas fa-info-circle"></i>
                <h5>双向合规检查说明</h5>
                <div class="explanation-toggle" onclick="toggleExplanation()">
                    <i class="fas fa-chevron-up" id="explanationToggleIcon"></i>
                </div>
            </div>
            <div class="explanation-content" id="explanationContent">
                <div class="explanation-item">
                    <div class="explanation-icon compliant">✅</div>
                    <div class="explanation-text">
                        <strong>匹配项（完全合规）</strong><br>
                        隐私条款与配置文件完全一致的权限，符合合规要求
                    </div>
                </div>
                <div class="explanation-item">
                    <div class="explanation-icon missing">⚠️</div>
                    <div class="explanation-text">
                        <strong>缺失项（功能性问题）</strong><br>
                        隐私条款中提及但配置文件未声明的权限，可能导致功能无法正常使用
                    </div>
                </div>
                <div class="explanation-item">
                    <div class="explanation-icon violation">❌</div>
                    <div class="explanation-text">
                        <strong>超出项（严重合规违规）</strong><br>
                        配置文件中声明但隐私条款未告知的权限，存在严重合规风险
                    </div>
                </div>
            </div>
        </div>
        
        <div class="basic-info">
            <h5><i class="fas fa-info-circle"></i> 基本信息</h5>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">隐私条款链接:</div>
                    <div class="info-value">
                        ${privacyUrl ? `<a href="${privacyUrl}" target="_blank" class="privacy-link">${privacyUrl}</a>` : '未提供'}
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-label">配置文件:</div>
                    <div class="info-value">
                        ${files && files.length > 0 ? files.map(file => `<span class="file-tag">${file}</span>`).join(' ') : '无'}
                    </div>
                </div>
                <div class="info-item">
                    <div class="info-label">解析结果:</div>
                    <div class="info-value">
                        ${configResults ? configResults.map(r => `<span class="platform-tag">${r.type} (${r.platform})</span>`).join(' ') : '无'}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="compliance-summary">
            <div class="summary-card">
                <div class="summary-item compliant">
                    <div class="summary-icon">✅</div>
                    <div class="summary-number">${summary.compliant}</div>
                    <div class="summary-label">完全合规</div>
                    <div class="summary-desc">配置与条款一致</div>
                </div>
                <div class="summary-item config-only">
                    <div class="summary-icon">❌</div>
                    <div class="summary-number">${summary.configOnly}</div>
                    <div class="summary-label">超出项</div>
                    <div class="summary-desc">高风险合规违规</div>
                </div>
                <div class="summary-item privacy-only">
                    <div class="summary-icon">⚠️</div>
                    <div class="summary-number">${summary.privacyOnly}</div>
                    <div class="summary-label">缺失项</div>
                    <div class="summary-desc">功能性问题</div>
                </div>
                <div class="summary-item rate">
                    <div class="summary-icon">📊</div>
                    <div class="summary-number">${summary.complianceRate}%</div>
                    <div class="summary-label">合规率</div>
                    <div class="summary-desc">${getComplianceLevel(summary.complianceRate)}</div>
                </div>
            </div>
        </div>
        
        <div class="permissions-detail">
            <h5><i class="fas fa-list"></i> 权限详情分析</h5>
            ${generateEnhancedPermissionCategories(permissions)}
        </div>
        
        <div class="recommendations">
            <h5><i class="fas fa-lightbulb"></i> 智能建议系统</h5>
            <div class="recommendation-cards">
                ${generateEnhancedRecommendations(recommendations, permissions)}
            </div>
        </div>
        
        <div class="export-actions">
            <button class="btn btn-primary" onclick="exportReport()">
                <i class="fas fa-download"></i> 导出报告
            </button>
            <button class="btn btn-success" onclick="shareReport()">
                <i class="fas fa-share"></i> 分享报告
            </button>
        </div>
    `;
    
    // 添加结果样式
    addEnhancedResultStyles();
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        compliant: '完全合规',
        config_only: '仅配置声明',
        privacy_only: '仅隐私提及'
    };
    return statusMap[status] || status;
}

// 生成增强型权限分类展示
function generateEnhancedPermissionCategories(permissions) {
    const categories = {
        compliant: permissions.filter(p => p.status === 'compliant'),
        config_only: permissions.filter(p => p.status === 'config_only'),
        privacy_only: permissions.filter(p => p.status === 'privacy_only')
    };
    
    let html = '';
    
    // 完全合规权限
    if (categories.compliant.length > 0) {
        html += `
            <div class="permission-category compliant enhanced">
                <div class="category-header">
                    <div class="category-icon">✅</div>
                    <div class="category-info">
                        <h6>完全合规权限 (${categories.compliant.length})</h6>
                        <span class="category-desc">配置文件与隐私条款完全一致</span>
                    </div>
                    <div class="category-badge success">合规</div>
                </div>
                <div class="permissions-table enhanced">
                    ${categories.compliant.map(permission => `
                        <div class="permission-row compliant enhanced" data-permission="${permission.name}">
                            <div class="permission-main">
                                <div class="permission-name">
                                    <i class="fas fa-shield-check permission-icon"></i>
                                    ${permission.name}
                                </div>
                                <div class="permission-description">${getPermissionDescription(permission.name)}</div>
                            </div>
                            <div class="permission-status">
                                <span class="status-badge compliant enhanced">
                                    <i class="fas fa-check-circle"></i>
                                    完全合规
                                </span>
                            </div>
                            <div class="permission-details enhanced">
                                <div class="detail-item success">
                                    <i class="fas fa-file-code"></i>
                                    配置文件: 已声明
                                </div>
                                <div class="detail-item success">
                                    <i class="fas fa-file-contract"></i>
                                    隐私条款: 已说明
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // 超出项（严重合规违规）
    if (categories.config_only.length > 0) {
        html += `
            <div class="permission-category config-only enhanced violation">
                <div class="category-header">
                    <div class="category-icon">❌</div>
                    <div class="category-info">
                        <h6>超出项 - 严重合规违规 (${categories.config_only.length})</h6>
                        <span class="category-desc">配置文件中声明但隐私条款未告知，存在严重合规风险</span>
                    </div>
                    <div class="category-badge danger">高风险</div>
                </div>
                <div class="permissions-table enhanced">
                    ${categories.config_only.map(permission => `
                        <div class="permission-row config-only enhanced violation" data-permission="${permission.name}">
                            <div class="permission-main">
                                <div class="permission-name">
                                    <i class="fas fa-exclamation-triangle permission-icon"></i>
                                    ${permission.name}
                                </div>
                                <div class="permission-description">${getPermissionDescription(permission.name)}</div>
                                <div class="risk-assessment">
                                    <i class="fas fa-warning"></i>
                                    <strong>风险评估:</strong> ${getRiskAssessment(permission.name, 'config_only')}
                                </div>
                            </div>
                            <div class="permission-status">
                                <span class="status-badge config-only enhanced">
                                    <i class="fas fa-exclamation-circle"></i>
                                    未告知用户
                                </span>
                            </div>
                            <div class="permission-details enhanced">
                                <div class="detail-item success">
                                    <i class="fas fa-file-code"></i>
                                    配置文件: 已声明
                                </div>
                                <div class="detail-item danger">
                                    <i class="fas fa-file-contract"></i>
                                    隐私条款: 未说明
                                </div>
                                <div class="fix-suggestion">
                                    <i class="fas fa-tools"></i>
                                    <strong>修复建议:</strong> ${getFixSuggestion(permission.name, 'config_only')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    // 缺失项（功能性问题）
    if (categories.privacy_only.length > 0) {
        html += `
            <div class="permission-category privacy-only enhanced missing">
                <div class="category-header">
                    <div class="category-icon">⚠️</div>
                    <div class="category-info">
                        <h6>缺失项 - 功能性问题 (${categories.privacy_only.length})</h6>
                        <span class="category-desc">隐私条款中提及但配置文件未声明，可能导致功能无法正常使用</span>
                    </div>
                    <div class="category-badge warning">中风险</div>
                </div>
                <div class="permissions-table enhanced">
                    ${categories.privacy_only.map(permission => `
                        <div class="permission-row privacy-only enhanced missing" data-permission="${permission.name}">
                            <div class="permission-main">
                                <div class="permission-name">
                                    <i class="fas fa-info-circle permission-icon"></i>
                                    ${permission.name}
                                </div>
                                <div class="permission-description">${getPermissionDescription(permission.name)}</div>
                                <div class="risk-assessment">
                                    <i class="fas fa-info"></i>
                                    <strong>影响评估:</strong> ${getRiskAssessment(permission.name, 'privacy_only')}
                                </div>
                            </div>
                            <div class="permission-status">
                                <span class="status-badge privacy-only enhanced">
                                    <i class="fas fa-question-circle"></i>
                                    未实际使用
                                </span>
                            </div>
                            <div class="permission-details enhanced">
                                <div class="detail-item danger">
                                    <i class="fas fa-file-code"></i>
                                    配置文件: 未声明
                                </div>
                                <div class="detail-item success">
                                    <i class="fas fa-file-contract"></i>
                                    隐私条款: 已说明
                                </div>
                                <div class="fix-suggestion">
                                    <i class="fas fa-tools"></i>
                                    <strong>修复建议:</strong> ${getFixSuggestion(permission.name, 'privacy_only')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    return html;
}

// 获取建议图标
function getRecommendationIcon(type) {
    const iconMap = {
        success: 'check-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle',
        error: 'exclamation-circle'
    };
    return iconMap[type] || 'info-circle';
}

// 获取优先级文本
function getPriorityText(priority) {
    const priorityMap = {
        high: '高优先级',
        medium: '中优先级',
        low: '低优先级'
    };
    return priorityMap[priority] || priority;
}

// 添加增强型结果样式
function addEnhancedResultStyles() {
    if (document.getElementById('enhanced-result-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'enhanced-result-styles';
    style.textContent = `
        /* 差异说明卡片 */
        .difference-explanation-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 25px;
            color: white;
            box-shadow: 0 3px 12px rgba(102, 126, 234, 0.15);
            position: relative;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .explanation-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
            padding-bottom: 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            cursor: pointer;
            user-select: none;
        }
        
        .explanation-header:hover {
            opacity: 0.9;
        }
        
        .explanation-header i {
            font-size: 1.3rem;
            color: #ffd700;
        }
        
        .explanation-header h5 {
            margin: 0;
            font-size: 1.2rem;
            font-weight: 600;
            flex: 1;
        }
        
        .explanation-toggle {
            padding: 5px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
        }
        
        .explanation-toggle:hover {
            background: rgba(255, 255, 255, 0.3);
        }
        
        .explanation-toggle i {
            font-size: 1rem;
            color: white;
            transition: transform 0.3s ease;
        }
        
        .explanation-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            transition: all 0.3s ease;
            overflow: hidden;
        }
        
        .explanation-content.collapsed {
            max-height: 0;
            opacity: 0;
            margin-top: -20px;
        }
        
        .explanation-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 12px;
            background: rgba(255, 255, 255, 0.12);
            border-radius: 8px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            transition: all 0.2s ease;
        }
        
        .explanation-item:hover {
            background: rgba(255, 255, 255, 0.18);
            transform: translateY(-1px);
        }
        
        .explanation-icon {
            font-size: 1.3rem;
            flex-shrink: 0;
            margin-top: 2px;
        }
        
        .explanation-text {
            line-height: 1.5;
            font-size: 0.95rem;
        }
        
        .explanation-text strong {
            display: block;
            margin-bottom: 4px;
            font-size: 1rem;
            font-weight: 600;
        }
        
        /* 增强型汇总卡片 */
        .summary-card {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .summary-item {
            text-align: center;
            padding: 25px 20px;
            border-radius: 16px;
            background: #f8f9fa;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .summary-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .summary-item.compliant {
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
            color: #155724;
            border: 2px solid #28a745;
        }
        
        .summary-item.config-only {
            background: linear-gradient(135deg, #f8d7da, #f5c6cb);
            color: #721c24;
            border: 2px solid #dc3545;
            animation: pulse-danger 2s infinite;
        }
        
        .summary-item.privacy-only {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            color: #856404;
            border: 2px solid #ffc107;
        }
        
        .summary-item.rate {
            background: linear-gradient(135deg, #d1ecf1, #bee5eb);
            color: #0c5460;
            border: 2px solid #17a2b8;
        }
        
        .summary-icon {
            font-size: 2rem;
            margin-bottom: 10px;
            display: block;
        }
        
        .summary-number {
            font-size: 2.5rem;
            font-weight: bold;
            margin-bottom: 8px;
            display: block;
        }
        
        .summary-label {
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .summary-desc {
            font-size: 0.85rem;
            opacity: 0.8;
            font-weight: normal;
        }
        
        @keyframes pulse-danger {
            0%, 100% { box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); }
            50% { box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
        }
        
        /* 增强型权限分类 */
        .permission-category.enhanced {
            margin-bottom: 30px;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border: 2px solid transparent;
        }
        
        .permission-category.enhanced.violation {
            border-color: #dc3545;
            animation: glow-danger 3s ease-in-out infinite alternate;
        }
        
        .permission-category.enhanced.missing {
            border-color: #ffc107;
        }
        
        @keyframes glow-danger {
            from { box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2); }
            to { box-shadow: 0 4px 25px rgba(220, 53, 69, 0.4); }
        }
        
        .category-header {
            padding: 20px 25px;
            display: flex;
            align-items: center;
            gap: 15px;
            font-weight: 600;
            position: relative;
        }
        
        .category-icon {
            font-size: 1.8rem;
            flex-shrink: 0;
        }
        
        .category-info {
            flex: 1;
        }
        
        .category-info h6 {
            margin: 0 0 5px 0;
            font-size: 1.2rem;
        }
        
        .category-desc {
            font-size: 0.9rem;
            opacity: 0.8;
            font-weight: normal;
            line-height: 1.4;
        }
        
        .category-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .category-badge.success {
            background: #28a745;
            color: white;
        }
        
        .category-badge.danger {
            background: #dc3545;
            color: white;
            animation: pulse 2s infinite;
        }
        
        .category-badge.warning {
            background: #ffc107;
            color: #212529;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        /* 增强型权限行 */
        .permissions-table.enhanced {
            background: white;
        }
        
        .permission-row.enhanced {
            display: grid;
            grid-template-columns: 2fr 1fr 1.5fr;
            gap: 20px;
            padding: 20px 25px;
            border-bottom: 1px solid #e9ecef;
            align-items: flex-start;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .permission-row.enhanced:hover {
            background: rgba(102, 126, 234, 0.05);
            transform: translateX(5px);
        }
        
        .permission-row.enhanced.violation {
            background: rgba(248, 215, 218, 0.2);
            border-left: 4px solid #dc3545;
        }
        
        .permission-row.enhanced.missing {
            background: rgba(255, 243, 205, 0.2);
            border-left: 4px solid #ffc107;
        }
        
        .permission-main {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .permission-name {
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 600;
            color: #333;
            font-size: 1.1rem;
        }
        
        .permission-icon {
            font-size: 1.2rem;
            color: #667eea;
        }
        
        .permission-description {
            font-size: 0.9rem;
            color: #666;
            line-height: 1.5;
            margin-left: 32px;
        }
        
        .risk-assessment {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-left: 32px;
            padding: 10px;
            background: rgba(220, 53, 69, 0.1);
            border-radius: 8px;
            font-size: 0.85rem;
            color: #721c24;
            border-left: 3px solid #dc3545;
        }
        
        .risk-assessment i {
            margin-top: 2px;
            flex-shrink: 0;
        }
        
        .status-badge.enhanced {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 25px;
            font-size: 0.9rem;
            font-weight: 600;
            white-space: nowrap;
        }
        
        .status-badge.compliant.enhanced {
            background: #d4edda;
            color: #155724;
            border: 1px solid #28a745;
        }
        
        .status-badge.config-only.enhanced {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #dc3545;
            animation: shake 0.5s ease-in-out infinite alternate;
        }
        
        .status-badge.privacy-only.enhanced {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffc107;
        }
        
        @keyframes shake {
            0% { transform: translateX(0); }
            100% { transform: translateX(2px); }
        }
        
        .permission-details.enhanced {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .detail-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.85rem;
            padding: 6px 10px;
            border-radius: 6px;
        }
        
        .detail-item.success {
            background: rgba(40, 167, 69, 0.1);
            color: #155724;
            border-left: 3px solid #28a745;
        }
        
        .detail-item.danger {
            background: rgba(220, 53, 69, 0.1);
            color: #721c24;
            border-left: 3px solid #dc3545;
        }
        
        .fix-suggestion {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-top: 10px;
            padding: 10px;
            background: rgba(23, 162, 184, 0.1);
            border-radius: 8px;
            font-size: 0.85rem;
            color: #0c5460;
            border-left: 3px solid #17a2b8;
        }
        
        .fix-suggestion i {
            margin-top: 2px;
            flex-shrink: 0;
        }
        
        /* 响应式设计 */
        @media (max-width: 768px) {
            .difference-explanation-card {
                padding: 20px;
                margin-bottom: 25px;
            }
            
            .explanation-content {
                grid-template-columns: 1fr;
                gap: 12px;
            }
            
            .explanation-item {
                padding: 12px;
            }
            
            .explanation-header h5 {
                font-size: 1.1rem;
            }
            
            .explanation-text {
                font-size: 0.9rem;
            }
            
            .permission-row.enhanced {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .permission-details.enhanced {
                margin-top: 10px;
            }
        }
        
        @media (max-width: 480px) {
            .difference-explanation-card {
                padding: 15px;
                border-radius: 12px;
            }
            
            .explanation-header {
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
                text-align: left;
            }
            
            .explanation-item {
                flex-direction: column;
                gap: 8px;
                text-align: center;
            }
            
            .explanation-icon {
                align-self: center;
            }
        }
    `;
    document.head.appendChild(style);
}

// 处理重置
function handleReset() {
    // 重置表单
    elements.platformSelect.value = 'all';
    elements.appName.value = '';
    elements.localAppSelect.value = '';
    elements.presetAppSelect.value = '';
    elements.privacyUrl.value = '';
    
    // 清空文件
    uploadedFiles = [];
    updateFileList();
    
    // 隐藏结果区域
    elements.infoCollectionSection.style.display = 'none';
    elements.resultsSection.style.display = 'none';
    
    // 隐藏获取配置文件按钮
    elements.autoGetConfigBtn.style.display = 'none';
    
    // 重置本地应用状态
    localApps = [];
    updateLocalAppList();
    
    // 重新加载预置应用列表
    loadPresetAppList();
    
    showNotification('已重置所有设置', 'info');
}

// 显示/隐藏加载状态
function showLoading(show) {
    elements.loadingOverlay.style.display = show ? 'flex' : 'none';
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1001;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        animation: slideIn 0.3s ease;
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // 添加动画样式
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// 获取通知图标
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// 获取通知颜色
function getNotificationColor(type) {
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    return colors[type] || '#17a2b8';
}

// 导出报告
function exportReport() {
    showNotification('报告导出功能正在开发中...', 'info');
}

// 分享报告
function shareReport() {
    showNotification('报告分享功能正在开发中...', 'info');
}

// 初始化应用检测器
function initializeAppDetector() {
    try {
        appDetector = new AppDetector();
        console.log('应用检测器初始化成功');
    } catch (error) {
        console.error('应用检测器初始化失败:', error);
    }
}

// 初始化信息收集分析器
function initializeInfoCollectionAnalyzer() {
    try {
        infoCollectionAnalyzer = new InfoCollectionAnalyzer();
        console.log('信息收集分析器初始化成功');
    } catch (error) {
        console.error('信息收集分析器初始化失败:', error);
    }
}

// 初始化LLM分析器
function initializeLLMAnalyzer() {
    try {
        llmConfigManager = new LLMConfigManager();
        const config = llmConfigManager.getConfig();
        llmAnalyzer = new LLMPrivacyAnalyzer(config);
        console.log('LLM分析器初始化成功', {
            provider: config.provider,
            hasApiKey: !!config.apiKey
        });
    } catch (error) {
        console.error('LLM分析器初始化失败:', error);
        // 如果LLM初始化失败，使用fallback
        llmAnalyzer = null;
    }
}

// 更新LLM状态显示
function updateLLMStatus() {
    const statusElement = document.getElementById('llmStatus');
    const statusText = document.getElementById('llmStatusText');
    
    if (!statusElement || !statusText) return;
    
    try {
        const config = llmConfigManager ? llmConfigManager.getConfig() : null;
        
        if (config && config.provider !== 'none' && config.apiKey) {
            statusElement.classList.add('active');
            statusElement.classList.remove('inactive');
            statusText.textContent = `已配置 (${getProviderName(config.provider)})`;
        } else {
            statusElement.classList.add('inactive');
            statusElement.classList.remove('active');
            statusText.textContent = '未配置';
        }
    } catch (error) {
        console.error('更新LLM状态失败:', error);
        statusElement.classList.add('inactive');
        statusElement.classList.remove('active');
        statusText.textContent = '未配置';
    }
}

// 获取提供商名称
function getProviderName(provider) {
    const names = {
        openai: 'OpenAI',
        azure: 'Azure',
        zhipu: '智谱AI',
        none: '未配置'
    };
    return names[provider] || provider;
}

// 处理扫描本地应用
async function handleScanLocalApps() {
    if (!appDetector) {
        showNotification('应用检测器未初始化', 'error');
        return;
    }

    try {
        // 显示扫描状态
        elements.scanLocalAppsBtn.disabled = true;
        elements.scanLocalAppsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 扫描中...';
        
        showNotification('正在扫描本地已安装的应用...', 'info');
        
        // 执行扫描
        localApps = await appDetector.detectInstalledApps();
        
        // 更新本地应用列表
        updateLocalAppList();
        
        // 显示扫描结果通过updateLocalAppList处理
        
        showNotification(`扫描完成！检测到 ${localApps.length} 个本地应用`, 'success');
        
    } catch (error) {
        console.error('扫描本地应用失败:', error);
        showNotification('扫描本地应用失败: ' + error.message, 'error');
    } finally {
        // 恢复按钮状态
        elements.scanLocalAppsBtn.disabled = false;
        elements.scanLocalAppsBtn.innerHTML = '<i class="fas fa-search"></i> 扫描本地应用';
    }
}

// 更新本地应用列表
function updateLocalAppList() {
    // 清空现有选项
    elements.localAppSelect.innerHTML = '<option value="">-- 选择本地应用 --</option>';
    
    if (localApps.length > 0) {
        localApps.forEach(app => {
            const option = document.createElement('option');
            option.value = app.name;
            option.textContent = `${app.name} (${app.platform})`;
            option.dataset.isLocal = 'true';
            option.dataset.appPath = app.path;
            elements.localAppSelect.appendChild(option);
        });
        
        // 显示本地应用统计
        elements.localAppCount.style.display = 'inline';
        elements.noLocalApps.style.display = 'none';
        elements.localCount.textContent = localApps.length;
    } else {
        // 显示提示信息
        elements.localAppCount.style.display = 'none';
        elements.noLocalApps.style.display = 'inline';
    }
}

// 获取平台键
function getPlatformKey(platformName) {
    const platformMap = {
        'iOS': 'ios',
        'macOS': 'ios', // macOS使用相同的权限模式
        'Android': 'android',
        'Windows': 'windows',
        '鸿蒙OS': 'harmonyos'
    };
    return platformMap[platformName] || 'android';
}

// 推断权限使用场景（辅助函数）
function inferScenarios(permissionType) {
    const scenarioMap = {
        camera: ['拍照录像', '扫码', '视频通话'],
        microphone: ['语音消息', '语音通话', '语音识别'],
        location: ['位置分享', '地图导航', '附近推荐'],
        contacts: ['添加好友', '通讯录同步'],
        photos: ['图片分享', '头像设置', '相册访问'],
        storage: ['文件保存', '数据备份', '离线缓存'],
        phone: ['拨打电话', '获取设备信息'],
        sms: ['短信验证', '消息发送'],
        calendar: ['日程提醒', '活动创建'],
        network: ['数据同步', '内容加载', '在线服务'],
        bluetooth: ['设备连接', '数据传输'],
        health: ['健康监测', '运动记录'],
        biometric: ['指纹登录', '面容识别', '安全验证'],
        tracking: ['广告追踪', '数据分析'],
        media: ['音乐播放', '媒体访问'],
        motion: ['运动记录', '健身追踪'],
        reminders: ['提醒管理', '待办事项'],
        speech: ['语音识别', '听写输入']
    };
    
    return scenarioMap[permissionType] || ['功能使用'];
}

// 显示信息收集清单结果
function displayInfoCollectionResults(report) {
    const { summary, collections, recommendations, privacyDetails, configDetails } = report;
    
    elements.infoCollectionResults.innerHTML = `
        <div class="collection-summary">
            <h5><i class="fas fa-chart-pie"></i> 信息收集概览</h5>
            <div class="summary-grid">
                <div class="summary-stat">
                    <div class="stat-number">${summary.totalTypes}</div>
                    <div class="stat-label">信息类型</div>
                </div>
                <div class="summary-stat consistent">
                    <div class="stat-number">${summary.consistent}</div>
                    <div class="stat-label">一致声明</div>
                </div>
                <div class="summary-stat privacy-only">
                    <div class="stat-number">${summary.privacyOnly}</div>
                    <div class="stat-label">仅隐私条款</div>
                </div>
                <div class="summary-stat config-only">
                    <div class="stat-number">${summary.configOnly}</div>
                    <div class="stat-label">仅配置文件</div>
                </div>
            </div>
        </div>
        
        <!-- 双源详细解析 -->
        <div class="dual-source-analysis">
            <h5><i class="fas fa-balance-scale"></i> 双源信息解析对比</h5>
            
            <!-- 隐私条款解析详情 -->
            <div class="source-section privacy-source">
                <div class="source-header">
                    <i class="fas fa-file-contract"></i>
                    <h6>隐私条款中披露的信息收集清单</h6>
                    <span class="source-count">${privacyDetails ? privacyDetails.length : 0} 项</span>
                </div>
                <div class="source-content">
                    ${generatePrivacySourceTable(privacyDetails || [])}
                </div>
            </div>
            
            <!-- 配置文件解析详情 -->
            <div class="source-section config-source">
                <div class="source-header">
                    <i class="fas fa-file-code"></i>
                    <h6>配置文件中声明的权限清单</h6>
                    <span class="source-count">${configDetails ? configDetails.length : 0} 项</span>
                </div>
                <div class="source-content">
                    ${generateConfigSourceTable(configDetails || [])}
                </div>
            </div>
        </div>
        
        <!-- 合并对比结果 -->
        <div class="collection-details">
            <h5><i class="fas fa-table"></i> 综合信息收集清单</h5>
            <div class="collection-table enhanced">
                <div class="table-header">
                    <div class="col-info-type">信息类型</div>
                    <div class="col-sources">来源对比</div>
                    <div class="col-scenario">功能场景</div>
                    <div class="col-purpose">收集目的</div>
                    <div class="col-method">收集方式</div>
                    <div class="col-status">一致性状态</div>
                </div>
                ${collections.map(collection => `
                    <div class="table-row enhanced ${collection.status}">
                        <div class="col-info-type">
                            <div class="info-type-name">
                                <i class="fas fa-${getInfoTypeIcon(collection.infoType)}"></i>
                                <strong>${collection.infoTypeName}</strong>
                            </div>
                            ${collection.permission ? `<div class="permission-tag">${collection.permission}</div>` : ''}
                        </div>
                        <div class="col-sources">
                            ${generateSourceIndicators(collection.sources || [collection.source])}
                        </div>
                        <div class="col-scenario">
                            ${collection.scenarios.map(s => `<span class="scenario-tag">${s}</span>`).join('')}
                        </div>
                        <div class="col-purpose">
                            ${collection.purposes.map(p => `<div class="purpose-item">${p}</div>`).join('')}
                        </div>
                        <div class="col-method">
                            ${collection.methods.map(m => `<span class="method-tag">${m}</span>`).join('')}
                        </div>
                        <div class="col-status">
                            <span class="status-indicator enhanced ${collection.status}">
                                <i class="fas fa-${getStatusIcon(collection.status)}"></i>
                                ${getCollectionStatusText(collection.status)}
                            </span>
                            <div class="confidence-bar">
                                <div class="confidence-fill" style="width: ${(collection.confidence * 100)}%"></div>
                                <span class="confidence-text">${Math.round(collection.confidence * 100)}%</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div class="collection-recommendations">
            <h5><i class="fas fa-lightbulb"></i> 信息收集建议</h5>
            <div class="recommendation-cards">
                ${recommendations.map(rec => `
                    <div class="recommendation-card ${rec.type} priority-${rec.priority}">
                        <div class="rec-header">
                            <i class="fas fa-${getRecommendationIcon(rec.type)}"></i>
                            <h6>${rec.title}</h6>
                            <span class="priority-badge ${rec.priority}">${getPriorityText(rec.priority)}</span>
                        </div>
                        <div class="rec-content">${rec.content}</div>
                        ${rec.items && rec.items.length > 0 ? `
                            <div class="rec-items">
                                ${rec.items.map(item => `<span class="item-tag">${item}</span>`).join('')}
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    // 添加增强的信息收集清单样式
    addEnhancedInfoCollectionStyles();
}

// 生成隐私条款来源表格
function generatePrivacySourceTable(privacyDetails) {
    if (!privacyDetails || privacyDetails.length === 0) {
        return '<div class="empty-source">未检测到隐私条款中的信息收集声明</div>';
    }
    
    return `
        <div class="source-table">
            <div class="source-table-header">
                <div class="col-type">信息类型</div>
                <div class="col-description">披露描述</div>
                <div class="col-purpose">声明目的</div>
                <div class="col-confidence">匹配度</div>
            </div>
            ${privacyDetails.map(item => `
                <div class="source-table-row">
                    <div class="col-type">
                        <div class="type-badge privacy">${item.infoTypeName}</div>
                    </div>
                    <div class="col-description">
                        <div class="description-text">${item.description || '从隐私条款文本中提取'}</div>
                        <div class="keywords-found">
                            关键词: ${(item.keywords || []).map(k => `<span class="keyword-tag">${k}</span>`).join('')}
                        </div>
                    </div>
                    <div class="col-purpose">
                        ${item.purposes.map(p => `<div class="purpose-item">${p}</div>`).join('')}
                    </div>
                    <div class="col-confidence">
                        <div class="confidence-bar">
                            <div class="confidence-fill" style="width: ${(item.confidence * 100)}%"></div>
                        </div>
                        <span class="confidence-text">${Math.round(item.confidence * 100)}%</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// 生成配置文件来源表格
function generateConfigSourceTable(configDetails) {
    if (!configDetails || configDetails.length === 0) {
        return '<div class="empty-source">未检测到配置文件中的权限声明</div>';
    }
    
    return `
        <div class="source-table">
            <div class="source-table-header">
                <div class="col-permission">权限标识</div>
                <div class="col-type">对应信息类型</div>
                <div class="col-description">权限描述</div>
                <div class="col-platform">平台</div>
            </div>
            ${configDetails.map(item => `
                <div class="source-table-row">
                    <div class="col-permission">
                        <div class="permission-badge">${item.permission}</div>
                    </div>
                    <div class="col-type">
                        <div class="type-badge config">${item.infoTypeName}</div>
                    </div>
                    <div class="col-description">
                        <div class="description-text">${item.description || '权限配置声明'}</div>
                        <div class="scenario-text">场景: ${item.scenarios.join(', ')}</div>
                    </div>
                    <div class="col-platform">
                        <span class="platform-badge">${item.platform || 'Unknown'}</span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// 生成来源指示器
function generateSourceIndicators(sources) {
    const indicators = [];
    
    if (sources.includes('privacy_policy') || sources.includes('privacy')) {
        indicators.push('<div class="source-indicator privacy"><i class="fas fa-file-contract"></i>隐私条款</div>');
    }
    
    if (sources.includes('config_file') || sources.includes('config')) {
        indicators.push('<div class="source-indicator config"><i class="fas fa-file-code"></i>配置文件</div>');
    }
    
    return indicators.join('');
}

// 获取信息类型图标
function getInfoTypeIcon(infoType) {
    const iconMap = {
        identity: 'id-card',
        contact: 'address-book',
        biometric: 'fingerprint',
        location: 'map-marker-alt',
        device: 'mobile-alt',
        network: 'network-wired',
        usage: 'chart-line',
        content: 'file-alt'
    };
    return iconMap[infoType] || 'info-circle';
}

// 获取状态图标
function getStatusIcon(status) {
    const iconMap = {
        consistent: 'check-circle',
        privacy_only: 'exclamation-triangle',
        config_only: 'cog'
    };
    return iconMap[status] || 'question-circle';
}

// 获取收集状态文本
function getCollectionStatusText(status) {
    const statusMap = {
        consistent: '一致',
        privacy_only: '仅隐私条款',
        config_only: '仅配置文件'
    };
    return statusMap[status] || status;
}

// 添加增强的信息收集清单样式
function addEnhancedInfoCollectionStyles() {
    if (document.getElementById('enhanced-info-collection-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'enhanced-info-collection-styles';
    style.textContent = `
        /* 双源解析样式 */
        .dual-source-analysis {
            margin-bottom: 30px;
            background: #f8f9fa;
            border-radius: 12px;
            padding: 20px;
            border: 1px solid #e9ecef;
        }
        
        .dual-source-analysis h5 {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
            color: #333;
            font-size: 1.2rem;
        }
        
        .source-section {
            margin-bottom: 25px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .source-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 15px 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            font-weight: 600;
        }
        
        .privacy-source .source-header {
            background: linear-gradient(135deg, #4CAF50, #45a049);
        }
        
        .config-source .source-header {
            background: linear-gradient(135deg, #2196F3, #1976D2);
        }
        
        .source-header h6 {
            margin: 0;
            flex: 1;
            font-size: 1.1rem;
        }
        
        .source-count {
            background: rgba(255,255,255,0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.9rem;
        }
        
        .source-content {
            padding: 20px;
        }
        
        .empty-source {
            text-align: center;
            color: #666;
            font-style: italic;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        
        /* 来源表格样式 */
        .source-table {
            width: 100%;
            border-radius: 8px;
            overflow: hidden;
            border: 1px solid #e9ecef;
        }
        
        .source-table-header {
            display: grid;
            grid-template-columns: 1fr 2fr 2fr 1fr;
            gap: 15px;
            padding: 12px 15px;
            background: #f8f9fa;
            font-weight: 600;
            font-size: 0.9rem;
            color: #555;
            border-bottom: 2px solid #e9ecef;
        }
        
        .source-table-row {
            display: grid;
            grid-template-columns: 1fr 2fr 2fr 1fr;
            gap: 15px;
            padding: 15px;
            border-bottom: 1px solid #f0f0f0;
            align-items: start;
        }
        
        .source-table-row:last-child {
            border-bottom: none;
        }
        
        .source-table-row:hover {
            background: #f8f9ff;
        }
        
        .type-badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .type-badge.privacy {
            background: #e8f5e8;
            color: #2e7d32;
            border: 1px solid #4caf50;
        }
        
        .type-badge.config {
            background: #e3f2fd;
            color: #1565c0;
            border: 1px solid #2196f3;
        }
        
        .permission-badge {
            background: #fff3e0;
            color: #e65100;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.8rem;
            border: 1px solid #ff9800;
        }
        
        .platform-badge {
            background: #f3e5f5;
            color: #7b1fa2;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }
        
        .description-text {
            margin-bottom: 8px;
            line-height: 1.4;
            color: #333;
        }
        
        .keywords-found {
            margin-top: 8px;
        }
        
        .keyword-tag {
            display: inline-block;
            background: #e1f5fe;
            color: #0277bd;
            padding: 2px 6px;
            border-radius: 10px;
            font-size: 0.75rem;
            margin-right: 4px;
            margin-bottom: 2px;
        }
        
        .scenario-text {
            color: #666;
            font-size: 0.85rem;
            margin-top: 4px;
        }
        
        /* 来源指示器 */
        .source-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
            margin-bottom: 4px;
        }
        
        .source-indicator.privacy {
            background: #e8f5e8;
            color: #2e7d32;
        }
        
        .source-indicator.config {
            background: #e3f2fd;
            color: #1565c0;
        }
        
        /* 增强的表格样式 */
        .collection-table.enhanced {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border: 1px solid #e9ecef;
        }
        
        .table-header {
            display: grid;
            grid-template-columns: 1.5fr 1fr 1.5fr 1.5fr 1fr 1.2fr;
            gap: 15px;
            padding: 15px 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            font-weight: 600;
            font-size: 0.9rem;
        }
        
        .table-row.enhanced {
            display: grid;
            grid-template-columns: 1.5fr 1fr 1.5fr 1.5fr 1fr 1.2fr;
            gap: 15px;
            padding: 20px;
            border-bottom: 1px solid #f0f0f0;
            align-items: start;
            transition: all 0.2s ease;
        }
        
        .table-row.enhanced:hover {
            background: #f8f9ff;
            transform: translateX(3px);
        }
        
        .info-type-name {
            display: flex;
            align-items: center;
            gap: 8px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
        }
        
        .info-type-name i {
            color: #667eea;
        }
        
        .permission-tag {
            background: #fff3e0;
            color: #e65100;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-family: monospace;
        }
        
        .status-indicator.enhanced {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .status-indicator.consistent {
            background: #e8f5e8;
            color: #2e7d32;
            border: 1px solid #4caf50;
        }
        
        .status-indicator.privacy_only {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffc107;
        }
        
        .status-indicator.config_only {
            background: #e3f2fd;
            color: #1565c0;
            border: 1px solid #2196f3;
        }
        
        .confidence-bar {
            position: relative;
            width: 100%;
            height: 6px;
            background: #e9ecef;
            border-radius: 3px;
            overflow: hidden;
        }
        
        .confidence-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            border-radius: 3px;
            transition: width 0.3s ease;
        }
        
        .confidence-text {
            position: absolute;
            top: -20px;
            right: 0;
            font-size: 0.75rem;
            color: #666;
            font-weight: 500;
        }
        
        .collection-summary {
            margin-bottom: 30px;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .summary-stat {
            text-align: center;
            padding: 15px;
            border-radius: 8px;
            background: #f8f9fa;
        }
        
        .summary-stat.consistent {
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
            color: #155724;
        }
        
        .summary-stat.privacy-only {
            background: linear-gradient(135deg, #e2e3e5, #d6d8db);
            color: #383d41;
        }
        
        .summary-stat.config-only {
            background: linear-gradient(135deg, #fff3cd, #ffeaa7);
            color: #856404;
        }
        
        .stat-number {
            font-size: 1.8rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .collection-table {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .table-header {
            display: grid;
            grid-template-columns: 2fr 2fr 2fr 1.5fr 1fr;
            gap: 15px;
            padding: 15px;
            background: #f8f9fa;
            font-weight: 600;
            border-bottom: 2px solid #e9ecef;
        }
        
        .table-row {
            display: grid;
            grid-template-columns: 2fr 2fr 2fr 1.5fr 1fr;
            gap: 15px;
            padding: 15px;
            border-bottom: 1px solid #e9ecef;
            align-items: start;
        }
        
        .table-row:last-child {
            border-bottom: none;
        }
        
        .table-row.consistent {
            background: rgba(212, 237, 218, 0.2);
        }
        
        .table-row.privacy-only {
            background: rgba(226, 227, 229, 0.2);
        }
        
        .table-row.config-only {
            background: rgba(255, 243, 205, 0.2);
        }
        
        .permission-tag {
            display: inline-block;
            padding: 2px 6px;
            background: #e9ecef;
            border-radius: 4px;
            font-size: 0.75rem;
            color: #6c757d;
            margin-top: 4px;
        }
        
        .scenario-tag, .method-tag, .item-tag {
            display: inline-block;
            padding: 4px 8px;
            background: #e3f2fd;
            color: #1976d2;
            border-radius: 12px;
            font-size: 0.8rem;
            margin: 2px;
        }
        
        .method-tag {
            background: #f3e5f5;
            color: #7b1fa2;
        }
        
        .item-tag {
            background: #e8f5e8;
            color: #2e7d32;
        }
        
        .purpose-item {
            margin-bottom: 4px;
            font-size: 0.9rem;
            line-height: 1.4;
        }
        
        .status-indicator {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .status-indicator.consistent {
            background: #d4edda;
            color: #155724;
        }
        
        .status-indicator.privacy-only {
            background: #e2e3e5;
            color: #383d41;
        }
        
        .status-indicator.config-only {
            background: #fff3cd;
            color: #856404;
        }
        
        .confidence-bar {
            width: 100%;
            height: 4px;
            background: #e9ecef;
            border-radius: 2px;
            overflow: hidden;
        }
        
        .confidence-fill {
            height: 100%;
            background: linear-gradient(90deg, #28a745, #20c997);
            transition: width 0.3s ease;
        }
        
        .rec-items {
            margin-top: 10px;
            padding-top: 10px;
            border-top: 1px solid rgba(0,0,0,0.1);
        }
        
        @media (max-width: 768px) {
            .table-header, .table-row {
                grid-template-columns: 1fr;
                gap: 10px;
            }
            
            .table-header > div, .table-row > div {
                padding: 5px 0;
            }
            
            .table-header > div {
                font-weight: bold;
                border-bottom: 1px solid #dee2e6;
            }
        }
    `;
    document.head.appendChild(style);
}

// 获取合规等级
function getComplianceLevel(rate) {
    if (rate >= 90) return '优秀';
    if (rate >= 80) return '良好';
    if (rate >= 70) return '一般';
    if (rate >= 60) return '较差';
    return '不合规';
}

// 获取权限描述
function getPermissionDescription(permissionName) {
    const descriptions = {
        'CAMERA': '访问设备摄像头，用于拍照、录像或扫描功能',
        'MICROPHONE': '访问设备麦克风，用于录音、语音通话或语音识别',
        'LOCATION': '获取设备位置信息，用于地图导航、位置服务或基于位置的功能',
        'CONTACTS': '访问通讯录信息，用于联系人管理或社交功能',
        'PHOTOS': '访问相册和图片，用于图片选择、编辑或分享功能',
        'STORAGE': '访问设备存储空间，用于文件读写或数据缓存',
        'PHONE': '访问电话功能，用于拨打电话或获取设备信息',
        'SMS': '访问短信功能，用于发送短信或验证码',
        'CALENDAR': '访问日历信息，用于日程管理或事件提醒',
        'BLUETOOTH': '访问蓝牙功能，用于设备连接或数据传输',
        'WIFI': '访问WiFi信息，用于网络连接或位置辅助定位',
        'BIOMETRIC': '访问生物识别功能，用于指纹或面部识别验证'
    };
    
    // 模糊匹配权限名称
    for (const [key, desc] of Object.entries(descriptions)) {
        if (permissionName.toUpperCase().includes(key)) {
            return desc;
        }
    }
    
    return '该权限用于应用的特定功能，请查看应用说明了解详细用途';
}

// 获取风险评估
function getRiskAssessment(permissionName, status) {
    const riskLevels = {
        'CAMERA': {
            config_only: '未告知用户摄像头使用情况，可能涉及隐私泄露风险，属于严重合规违规',
            privacy_only: '隐私条款提及摄像头权限但未实际申请，可能导致相关功能无法使用'
        },
        'MICROPHONE': {
            config_only: '未告知用户麦克风使用情况，存在录音隐私风险，属于严重合规违规',
            privacy_only: '隐私条款提及麦克风权限但未实际申请，语音功能可能受限'
        },
        'LOCATION': {
            config_only: '未告知用户位置信息收集，存在位置隐私泄露风险，属于高风险违规',
            privacy_only: '隐私条款提及位置权限但未实际申请，定位功能可能无法正常工作'
        },
        'CONTACTS': {
            config_only: '未告知用户通讯录访问，存在联系人信息泄露风险，属于严重违规',
            privacy_only: '隐私条款提及通讯录权限但未实际申请，联系人相关功能受限'
        }
    };
    
    // 模糊匹配并返回风险评估
    for (const [key, risks] of Object.entries(riskLevels)) {
        if (permissionName.toUpperCase().includes(key)) {
            return risks[status] || '需要进一步评估该权限的风险等级';
        }
    }
    
    if (status === 'config_only') {
        return '该权限未在隐私条款中说明，存在合规风险，建议及时补充说明';
    } else {
        return '该权限在隐私条款中提及但未实际使用，建议确认是否需要该权限';
    }
}

// 获取修复建议
function getFixSuggestion(permissionName, status) {
    if (status === 'config_only') {
        return `在隐私条款中添加关于"${permissionName}"权限的使用说明，包括使用目的、使用场景和数据处理方式`;
    } else {
        return `确认是否需要"${permissionName}"权限，如需要请在配置文件中声明，如不需要请从隐私条款中移除相关描述`;
    }
}

// 生成增强型建议
function generateEnhancedRecommendations(originalRecommendations, permissions) {
    const recommendations = [];
    
    // 分析权限状态
    const configOnlyPerms = permissions.filter(p => p.status === 'config_only');
    const privacyOnlyPerms = permissions.filter(p => p.status === 'privacy_only');
    const compliantPerms = permissions.filter(p => p.status === 'compliant');
    
    // 严重合规违规建议
    if (configOnlyPerms.length > 0) {
        recommendations.push({
            type: 'error',
            priority: 'high',
            title: '🚨 紧急：严重合规违规需立即修复',
            content: `发现 ${configOnlyPerms.length} 个权限存在严重合规违规问题。这些权限已在配置文件中声明但未在隐私条款中告知用户，违反了数据保护法规要求。`,
            items: configOnlyPerms.map(p => p.name),
            actionRequired: true,
            estimatedTime: '1-2个工作日',
            impact: '高风险 - 可能面临监管处罚'
        });
    }
    
    // 功能性问题建议
    if (privacyOnlyPerms.length > 0) {
        recommendations.push({
            type: 'warning',
            priority: 'medium',
            title: '⚠️ 功能性问题需要关注',
            content: `发现 ${privacyOnlyPerms.length} 个权限在隐私条款中提及但未在配置文件中声明，可能导致相关功能无法正常使用。`,
            items: privacyOnlyPerms.map(p => p.name),
            actionRequired: false,
            estimatedTime: '0.5-1个工作日',
            impact: '中风险 - 影响用户体验'
        });
    }
    
    // 合规表现良好
    if (compliantPerms.length > 0) {
        recommendations.push({
            type: 'success',
            priority: 'low',
            title: '✅ 合规表现良好',
            content: `${compliantPerms.length} 个权限完全合规，配置文件与隐私条款保持一致，符合数据保护要求。`,
            items: compliantPerms.slice(0, 5).map(p => p.name), // 只显示前5个
            actionRequired: false,
            estimatedTime: '无需处理',
            impact: '无风险 - 继续保持'
        });
    }
    
    // 整体改进建议
    const complianceRate = Math.round((compliantPerms.length / permissions.length) * 100);
    if (complianceRate < 80) {
        recommendations.push({
            type: 'info',
            priority: 'medium',
            title: '📋 整体改进建议',
            content: `当前合规率为 ${complianceRate}%，建议建立权限管理流程，确保配置文件与隐私条款的同步更新。`,
            items: [
                '建立权限审核流程',
                '定期进行合规检查',
                '完善隐私条款模板',
                '加强开发团队培训'
            ],
            actionRequired: true,
            estimatedTime: '1-2周',
            impact: '长期收益 - 提升合规管理'
        });
    }
    
    return recommendations.map(rec => `
        <div class="recommendation-card enhanced ${rec.type} priority-${rec.priority}">
            <div class="rec-header enhanced">
                <div class="rec-icon">
                    <i class="fas fa-${getRecommendationIcon(rec.type)}"></i>
                </div>
                <div class="rec-title-area">
                    <h6>${rec.title}</h6>
                    <div class="rec-meta">
                        <span class="priority-badge ${rec.priority}">${getPriorityText(rec.priority)}</span>
                        <span class="time-estimate">${rec.estimatedTime}</span>
                        <span class="impact-level ${rec.type}">${rec.impact}</span>
                    </div>
                </div>
                ${rec.actionRequired ? '<div class="action-required">需要行动</div>' : ''}
            </div>
            <div class="rec-content enhanced">${rec.content}</div>
            ${rec.items && rec.items.length > 0 ? `
                <div class="rec-items enhanced">
                    <div class="items-header">涉及权限/建议项目：</div>
                    <div class="items-list">
                        ${rec.items.map(item => `<span class="item-tag enhanced">${item}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            <div class="rec-actions">
                <button class="btn-action primary" onclick="handleRecommendationAction('${rec.type}', '${rec.priority}')">
                    <i class="fas fa-play"></i>
                    ${rec.actionRequired ? '立即处理' : '了解详情'}
                </button>
                <button class="btn-action secondary" onclick="dismissRecommendation(this)">
                    <i class="fas fa-times"></i>
                    忽略
                </button>
            </div>
        </div>
    `).join('');
}

// 处理建议操作
function handleRecommendationAction(type, priority) {
    const actions = {
        'error': '正在打开合规违规处理指南...',
        'warning': '正在显示功能性问题解决方案...',
        'success': '查看合规最佳实践...',
        'info': '正在加载改进建议详情...'
    };
    
    showNotification(actions[type] || '正在处理您的请求...', 'info');
    
    // 这里可以添加具体的处理逻辑
    setTimeout(() => {
        showNotification('功能正在开发中，敬请期待！', 'info');
    }, 1500);
}

// 忽略建议
function dismissRecommendation(button) {
    const card = button.closest('.recommendation-card');
    card.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
        card.remove();
        showNotification('建议已忽略', 'info');
    }, 300);
}

// 切换说明卡片展开/折叠状态
function toggleExplanation() {
    const content = document.getElementById('explanationContent');
    const icon = document.getElementById('explanationToggleIcon');
    
    if (content && icon) {
        const isCollapsed = content.classList.contains('collapsed');
        
        if (isCollapsed) {
            // 展开
            content.classList.remove('collapsed');
            icon.className = 'fas fa-chevron-up';
            showNotification('说明已展开', 'info');
        } else {
            // 折叠
            content.classList.add('collapsed');
            icon.className = 'fas fa-chevron-down';
            showNotification('说明已折叠，点击标题可重新展开', 'info');
        }
        
        // 旋转图标
        icon.style.transform = isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)';
    }
}

// 快速测试功能
function runQuickTest() {
    showNotification('正在运行快速测试，展示双向合规检查功能...', 'info');
    
    // 设置测试数据
    elements.appName.value = '微信';
    elements.privacyUrl.value = 'https://weixin.qq.com/cgi-bin/readtemplate?t=weixin_agreement&s=privacy';
    
    // 创建模拟配置文件
    const mockConfigContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.tencent.mm"
    android:versionCode="1"
    android:versionName="1.0">

    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.READ_CONTACTS" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_PHONE_STATE" />
    <uses-permission android:name="android.permission.BLUETOOTH" />

    <application
        android:allowBackup="true"
        android:label="微信"
        android:theme="@style/AppTheme">
        
        <activity
            android:name=".ui.LauncherUI"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
    </application>
</manifest>`;
    
    // 创建虚拟文件
    const blob = new Blob([mockConfigContent], { type: 'text/xml' });
    const file = new File([blob], 'AndroidManifest.xml', { type: 'text/xml' });
    
    // 清空现有文件并添加测试文件
    uploadedFiles = [];
    addFile(file);
    updateFileList();
    
    // 延迟执行分析
    setTimeout(() => {
        performTestAnalysis();
    }, 1000);
}

// 执行测试分析
async function performTestAnalysis() {
    showLoading(true);
    
    try {
        // 模拟分析结果 - 展示双向合规检查的各种情况
        const testResults = {
            appName: '微信',
            privacyUrl: 'https://weixin.qq.com/cgi-bin/readtemplate?t=weixin_agreement&s=privacy',
            files: ['AndroidManifest.xml'],
            configResults: [{
                type: 'AndroidManifest',
                platform: 'Android',
                permissions: ['CAMERA', 'RECORD_AUDIO', 'ACCESS_FINE_LOCATION', 'READ_CONTACTS', 'WRITE_EXTERNAL_STORAGE', 'READ_PHONE_STATE', 'BLUETOOTH']
            }],
            privacyText: '微信隐私政策摘要...',
            summary: {
                compliant: 4,      // 完全合规
                configOnly: 2,     // 超出项（严重违规）
                privacyOnly: 1,    // 缺失项（功能性问题）
                complianceRate: 67
            },
            permissions: [
                // 完全合规的权限
                { name: 'CAMERA', status: 'compliant' },
                { name: 'RECORD_AUDIO', status: 'compliant' },
                { name: 'ACCESS_FINE_LOCATION', status: 'compliant' },
                { name: 'READ_CONTACTS', status: 'compliant' },
                
                // 超出项 - 配置文件有但隐私条款没有（严重违规）
                { name: 'READ_PHONE_STATE', status: 'config_only' },
                { name: 'BLUETOOTH', status: 'config_only' },
                
                // 缺失项 - 隐私条款有但配置文件没有（功能性问题）
                { name: 'WRITE_CALENDAR', status: 'privacy_only' }
            ],
            recommendations: [
                {
                    type: 'error',
                    priority: 'high',
                    title: '严重合规违规',
                    content: '发现2个权限存在严重合规违规问题'
                },
                {
                    type: 'warning', 
                    priority: 'medium',
                    title: '功能性问题',
                    content: '发现1个权限可能导致功能问题'
                }
            ]
        };
        
        // 模拟信息收集清单分析结果
        const mockInfoCollectionReport = {
            summary: {
                totalTypes: 5,
                consistent: 2,
                privacyOnly: 2,
                configOnly: 1
            },
            collections: [
                {
                    infoType: 'contact',
                    infoTypeName: '联系方式',
                    scenarios: ['账户注册', '找回密码'],
                    purposes: ['账户验证', '服务通知'],
                    methods: ['用户主动提供'],
                    sources: ['privacy_policy', 'config_file'],
                    permission: 'android.permission.READ_CONTACTS',
                    status: 'consistent',
                    confidence: 0.9
                },
                {
                    infoType: 'location',
                    infoTypeName: '位置信息',
                    scenarios: ['地图导航', '附近服务'],
                    purposes: ['提供位置服务', '个性化推荐'],
                    methods: ['传感器获取'],
                    sources: ['privacy_policy', 'config_file'],
                    permission: 'android.permission.ACCESS_FINE_LOCATION',
                    status: 'consistent',
                    confidence: 0.95
                },
                {
                    infoType: 'biometric',
                    infoTypeName: '生物识别信息',
                    scenarios: ['身份认证', '支付验证'],
                    purposes: ['身份验证', '账户安全'],
                    methods: ['传感器获取'],
                    sources: ['privacy_policy'],
                    status: 'privacy_only',
                    confidence: 0.8
                },
                {
                    infoType: 'usage',
                    infoTypeName: '使用记录',
                    scenarios: ['功能使用', '内容浏览'],
                    purposes: ['服务改进', '个性化推荐'],
                    methods: ['自动收集'],
                    sources: ['privacy_policy'],
                    status: 'privacy_only',
                    confidence: 0.7
                },
                {
                    infoType: 'device',
                    infoTypeName: '设备信息',
                    scenarios: ['设备识别', '安全验证'],
                    purposes: ['设备管理', '安全防护'],
                    methods: ['自动收集'],
                    sources: ['config_file'],
                    permission: 'android.permission.READ_PHONE_STATE',
                    status: 'config_only',
                    confidence: 0.85
                }
            ],
            privacyDetails: [
                {
                    infoType: 'contact',
                    infoTypeName: '联系方式',
                    scenarios: ['账户注册', '找回密码'],
                    purposes: ['账户验证', '服务通知'],
                    methods: ['用户主动提供'],
                    source: 'privacy_policy',
                    confidence: 0.9,
                    keywords: ['手机号', '邮箱', '联系方式'],
                    description: '我们会收集您的手机号码和邮箱地址用于账户注册和服务通知'
                },
                {
                    infoType: 'location',
                    infoTypeName: '位置信息',
                    scenarios: ['地图导航', '附近服务'],
                    purposes: ['提供位置服务', '个性化推荐'],
                    methods: ['传感器获取'],
                    source: 'privacy_policy',
                    confidence: 0.95,
                    keywords: ['位置', '定位', 'GPS'],
                    description: '为了提供基于位置的服务，我们会获取您的地理位置信息'
                },
                {
                    infoType: 'biometric',
                    infoTypeName: '生物识别信息',
                    scenarios: ['身份认证', '支付验证'],
                    purposes: ['身份验证', '账户安全'],
                    methods: ['传感器获取'],
                    source: 'privacy_policy',
                    confidence: 0.8,
                    keywords: ['指纹', '面部识别'],
                    description: '我们可能收集您的生物识别信息用于身份验证'
                },
                {
                    infoType: 'usage',
                    infoTypeName: '使用记录',
                    scenarios: ['功能使用', '内容浏览'],
                    purposes: ['服务改进', '个性化推荐'],
                    methods: ['自动收集'],
                    source: 'privacy_policy',
                    confidence: 0.7,
                    keywords: ['使用记录', '操作日志'],
                    description: '我们会记录您的应用使用情况以改进服务质量'
                }
            ],
            configDetails: [
                {
                    infoType: 'contact',
                    infoTypeName: '联系方式',
                    scenarios: ['通讯录访问'],
                    purposes: ['联系人相关功能'],
                    methods: ['自动收集'],
                    source: 'config_file',
                    permission: 'android.permission.READ_CONTACTS',
                    description: '读取通讯录权限',
                    platform: 'Android',
                    confidence: 0.9
                },
                {
                    infoType: 'location',
                    infoTypeName: '位置信息',
                    scenarios: ['精确定位'],
                    purposes: ['位置相关服务'],
                    methods: ['传感器获取'],
                    source: 'config_file',
                    permission: 'android.permission.ACCESS_FINE_LOCATION',
                    description: '精确位置权限',
                    platform: 'Android',
                    confidence: 0.95
                },
                {
                    infoType: 'device',
                    infoTypeName: '设备信息',
                    scenarios: ['设备识别'],
                    purposes: ['设备管理'],
                    methods: ['自动收集'],
                    source: 'config_file',
                    permission: 'android.permission.READ_PHONE_STATE',
                    description: '读取手机状态权限',
                    platform: 'Android',
                    confidence: 0.85
                }
            ],
            recommendations: [
                {
                    type: 'warning',
                    title: '隐私条款信息未在配置中体现',
                    content: '发现 2 项信息收集在隐私条款中说明但未在配置文件中声明权限，建议检查是否需要相应权限。',
                    items: ['生物识别信息', '使用记录'],
                    priority: 'medium'
                },
                {
                    type: 'info',
                    title: '配置权限未在隐私条款中说明',
                    content: '发现 1 项权限已在配置文件中声明但未在隐私条款中详细说明，建议完善隐私条款。',
                    items: ['设备信息'],
                    priority: 'high'
                },
                {
                    type: 'success',
                    title: '信息收集声明一致',
                    content: '2 项信息收集在隐私条款和配置文件中保持一致，符合规范要求。',
                    items: ['联系方式', '位置信息'],
                    priority: 'low'
                }
            ]
        };
        
        showLoading(false);
        
        // 显示信息收集清单
        displayInfoCollectionResults(mockInfoCollectionReport);
        elements.infoCollectionSection.style.display = 'block';
        
        // 显示合规分析结果
        displayAnalysisResults(testResults);
        elements.resultsSection.style.display = 'block';
        
        // 滚动到信息收集清单区域
        elements.infoCollectionSection.scrollIntoView({ behavior: 'smooth' });
        
        showNotification('🎉 快速测试完成！展示了双源信息收集清单解析功能', 'success');
        
    } catch (error) {
        showLoading(false);
        console.error('测试分析失败:', error);
        showNotification('测试分析失败: ' + error.message, 'error');
    }
}

// 初始化文件列表显示
document.addEventListener('DOMContentLoaded', function() {
    updateFileList();
});