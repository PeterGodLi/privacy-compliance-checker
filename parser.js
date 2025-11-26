// 配置文件解析器（增强版）
class ConfigParser {
    constructor() {
        this.parsers = {
            plist: new PlistParser(),
            xml: new AndroidManifestParser(),
            appx: new AppxManifestParser(),
            json: new HarmonyOSConfigParser()
        };
        
        // 解析统计
        this.stats = {
            totalParsed: 0,
            successCount: 0,
            failureCount: 0,
            parseHistory: []
        };
    }

    // 解析文件（增强版）
    async parseFile(file) {
        const startTime = Date.now();
        const fileExtension = this.getFileExtension(file.name);
        
        try {
            // 读取文件内容
            const content = await this.readFileContent(file);
            
            // 验证文件内容
            if (!content || content.trim().length === 0) {
                throw new Error('文件内容为空');
            }
            
            // 自动识别平台类型
            const detectedPlatform = this.detectPlatform(file.name, content, fileExtension);
            console.log(`文件 ${file.name} 自动识别为: ${detectedPlatform} 平台`);
            
            // 根据文件类型选择解析器
            let result;
            switch (fileExtension) {
                case 'plist':
                    result = this.parsers.plist.parse(content, file.name);
                    break;
                case 'xml':
                    result = this.parseXMLFile(file.name, content);
                    break;
                case 'json':
                    result = this.parseJSONFile(file.name, content);
                    break;
                default:
                    throw new Error(`不支持的文件类型: ${fileExtension}`);
            }
            
            // 增强结果数据
            result = this.enrichResult(result, file, detectedPlatform, startTime);
            
            // 记录统计
            this.recordSuccess(file.name, Date.now() - startTime);
            
            return result;
            
        } catch (error) {
            this.recordFailure(file.name, error.message);
            console.error(`解析文件 ${file.name} 失败:`, error);
            throw new Error(`解析文件 ${file.name} 失败: ${error.message}`);
        }
    }
    
    // 智能平台检测
    detectPlatform(filename, content, extension) {
        const filenameLower = filename.toLowerCase();
        const contentLower = content.toLowerCase();
        
        // 通过文件名判断
        if (filenameLower.includes('info.plist')) {
            if (contentLower.includes('iphoneos') || contentLower.includes('ios')) {
                return 'iOS';
            } else if (contentLower.includes('macos') || contentLower.includes('macosx')) {
                return 'macOS';
            }
            return 'iOS/macOS';
        }
        
        if (filenameLower.includes('androidmanifest')) {
            return 'Android';
        }
        
        if (filenameLower.includes('appxmanifest')) {
            return 'Windows';
        }
        
        if (filenameLower.includes('config.json')) {
            return '鸿蒙OS';
        }
        
        // 通过内容特征判断
        if (extension === 'xml') {
            if (contentLower.includes('android:') || contentLower.includes('<manifest')) {
                return 'Android';
            }
            if (contentLower.includes('windows') || contentLower.includes('appx')) {
                return 'Windows';
            }
        }
        
        if (extension === 'json') {
            if (contentLower.includes('ohos.permission') || contentLower.includes('harmonyos')) {
                return '鸿蒙OS';
            }
        }
        
        return 'Unknown';
    }
    
    // 解析XML文件
    parseXMLFile(filename, content) {
        if (filename.toLowerCase().includes('androidmanifest')) {
            return this.parsers.xml.parse(content, filename);
        } else if (filename.toLowerCase().includes('appxmanifest')) {
            return this.parsers.appx.parse(content, filename);
        } else {
            // 自动检测XML类型
            return this.autoDetectXmlType(content, filename);
        }
    }
    
    // 解析JSON文件
    parseJSONFile(filename, content) {
        if (filename.toLowerCase().includes('config')) {
            return this.parsers.json.parse(content, filename);
        } else {
            throw new Error('不支持的JSON文件类型，请上传config.json');
        }
    }
    
    // 增强解析结果
    enrichResult(result, file, detectedPlatform, startTime) {
        const parseTime = Date.now() - startTime;
        
        return {
            ...result,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            detectedPlatform: detectedPlatform,
            parseTime: parseTime,
            parseTimestamp: new Date().toISOString(),
            qualityScore: this.calculateQualityScore(result)
        };
    }
    
    // 计算解析质量分数
    calculateQualityScore(result) {
        let score = 0;
        
        // 权限数量得分 (0-40分)
        if (result.permissions && result.permissions.length > 0) {
            score += Math.min(40, result.permissions.length * 5);
        }
        
        // 应用信息完整性 (0-30分)
        if (result.appInfo) {
            const infoFields = Object.keys(result.appInfo);
            score += Math.min(30, infoFields.length * 5);
        }
        
        // 平台识别准确性 (0-30分)
        if (result.platform && result.platform !== 'Unknown') {
            score += 30;
        }
        
        return Math.min(100, score);
    }

    // 获取文件扩展名
    getFileExtension(filename) {
        return filename.split('.').pop().toLowerCase();
    }

    // 读取文件内容（增强版）
    readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    resolve(content);
                } catch (error) {
                    reject(new Error('文件内容读取错误'));
                }
            };
            
            reader.onerror = (e) => {
                reject(new Error('文件读取失败，请检查文件是否损坏'));
            };
            
            reader.onabort = (e) => {
                reject(new Error('文件读取被中断'));
            };
            
            // 尝试以UTF-8编码读取
            try {
                reader.readAsText(file, 'UTF-8');
            } catch (error) {
                reject(new Error('无法读取文件'));
            }
        });
    }

    // 自动检测XML类型（增强版）
    autoDetectXmlType(content, filename = '') {
        const contentLower = content.toLowerCase();
        
        // 检测Android Manifest
        if ((contentLower.includes('<manifest') || contentLower.includes('android:')) && 
            contentLower.includes('package=')) {
            console.log('自动识别为 Android Manifest');
            return this.parsers.xml.parse(content, filename);
        }
        
        // 检测Windows AppxManifest
        if (contentLower.includes('<package') && 
            (contentLower.includes('schemas.microsoft.com/appx/manifest') || 
             contentLower.includes('windows'))) {
            console.log('自动识别为 Windows AppxManifest');
            return this.parsers.appx.parse(content, filename);
        }
        
        throw new Error('无法识别的XML文件类型，请确保是 AndroidManifest.xml 或 AppxManifest.xml');
    }
    
    // 记录成功解析
    recordSuccess(filename, parseTime) {
        this.stats.totalParsed++;
        this.stats.successCount++;
        this.stats.parseHistory.push({
            filename,
            status: 'success',
            parseTime,
            timestamp: new Date().toISOString()
        });
    }
    
    // 记录解析失败
    recordFailure(filename, errorMessage) {
        this.stats.totalParsed++;
        this.stats.failureCount++;
        this.stats.parseHistory.push({
            filename,
            status: 'failure',
            error: errorMessage,
            timestamp: new Date().toISOString()
        });
    }
    
    // 获取解析统计
    getStats() {
        return {
            ...this.stats,
            successRate: this.stats.totalParsed > 0 ? 
                ((this.stats.successCount / this.stats.totalParsed) * 100).toFixed(2) + '%' : 
                '0%'
        };
    }
    
    // 重置统计
    resetStats() {
        this.stats = {
            totalParsed: 0,
            successCount: 0,
            failureCount: 0,
            parseHistory: []
        };
    }
}

// iOS/macOS Info.plist 解析器（增强版）
class PlistParser {
    parse(content, filename = '') {
        try {
            const permissions = this.extractPermissions(content);
            const appInfo = this.extractAppInfo(content);
            const capabilities = this.extractCapabilities(content);
            const backgroundModes = this.extractBackgroundModes(content);
            
            // 确定具体平台
            const platform = this.detectSpecificPlatform(content, filename);
            
            return {
                platform: platform,
                type: 'Info.plist',
                permissions: permissions,
                capabilities: capabilities,
                backgroundModes: backgroundModes,
                appInfo: appInfo,
                rawContent: content,
                summary: {
                    totalPermissions: permissions.length,
                    sensitivePermissions: permissions.filter(p => this.isSensitivePermission(p.type)).length
                }
            };
        } catch (error) {
            throw new Error(`Info.plist 解析失败: ${error.message}`);
        }
    }
    
    // 检测具体平台
    detectSpecificPlatform(content, filename) {
        const contentLower = content.toLowerCase();
        
        if (contentLower.includes('iphoneos') || contentLower.includes('iphone')) {
            return 'iOS';
        } else if (contentLower.includes('macosx') || contentLower.includes('macos')) {
            return 'macOS';
        } else if (contentLower.includes('appletvos')) {
            return 'tvOS';
        } else if (contentLower.includes('watchos')) {
            return 'watchOS';
        }
        
        // 通过文件名判断
        if (filename.toLowerCase().includes('ios')) return 'iOS';
        if (filename.toLowerCase().includes('macos')) return 'macOS';
        
        return 'iOS/macOS';
    }
    
    // 判断是否为敏感权限
    isSensitivePermission(type) {
        const sensitiveTypes = ['camera', 'microphone', 'location', 'contacts', 'photos', 'health', 'biometric'];
        return sensitiveTypes.includes(type);
    }
    
    // 提取能力配置
    extractCapabilities(content) {
        const capabilities = [];
        const capabilityPatterns = [
            { key: 'com.apple.developer.applesignin', name: 'Sign in with Apple', type: 'authentication' },
            { key: 'com.apple.developer.in-app-payments', name: 'In-App Purchase', type: 'payment' },
            { key: 'com.apple.developer.healthkit', name: 'HealthKit', type: 'health' },
            { key: 'com.apple.developer.homekit', name: 'HomeKit', type: 'smart_home' },
            { key: 'com.apple.developer.sirikit', name: 'SiriKit', type: 'voice_assistant' },
            { key: 'com.apple.developer.icloud-container-identifiers', name: 'iCloud', type: 'cloud_storage' }
        ];
        
        for (const cap of capabilityPatterns) {
            if (content.includes(cap.key)) {
                capabilities.push({
                    key: cap.key,
                    name: cap.name,
                    type: cap.type
                });
            }
        }
        
        return capabilities;
    }
    
    // 提取后台模式
    extractBackgroundModes(content) {
        const modes = [];
        const modeMap = {
            'audio': { name: '音频播放', description: '应用在后台播放音频' },
            'location': { name: '位置更新', description: '应用在后台接收位置更新' },
            'voip': { name: 'VoIP', description: '应用支持网络电话' },
            'fetch': { name: '后台获取', description: '应用在后台获取内容' },
            'remote-notification': { name: '远程通知', description: '应用接收远程推送通知' },
            'processing': { name: '后台处理', description: '应用在后台处理任务' }
        };
        
        for (const [key, mode] of Object.entries(modeMap)) {
            if (content.includes(key) && content.includes('UIBackgroundModes')) {
                modes.push({
                    key: key,
                    name: mode.name,
                    description: mode.description
                });
            }
        }
        
        return modes;
    }

    extractPermissions(content) {
        const permissions = [];
        
        // iOS权限映射
        const permissionMap = {
            'NSCameraUsageDescription': {
                name: '相机权限',
                type: 'camera',
                description: '访问相机'
            },
            'NSMicrophoneUsageDescription': {
                name: '麦克风权限',
                type: 'microphone',
                description: '访问麦克风'
            },
            'NSLocationWhenInUseUsageDescription': {
                name: '位置权限（使用时）',
                type: 'location',
                description: '在使用应用时访问位置'
            },
            'NSLocationAlwaysAndWhenInUseUsageDescription': {
                name: '位置权限（始终）',
                type: 'location',
                description: '始终访问位置'
            },
            'NSContactsUsageDescription': {
                name: '通讯录权限',
                type: 'contacts',
                description: '访问通讯录'
            },
            'NSPhotoLibraryUsageDescription': {
                name: '相册权限',
                type: 'photos',
                description: '访问相册'
            },
            'NSCalendarsUsageDescription': {
                name: '日历权限',
                type: 'calendar',
                description: '访问日历'
            },
            'NSRemindersUsageDescription': {
                name: '提醒事项权限',
                type: 'reminders',
                description: '访问提醒事项'
            },
            'NSMotionUsageDescription': {
                name: '运动与健身权限',
                type: 'motion',
                description: '访问运动与健身数据'
            },
            'NSHealthShareUsageDescription': {
                name: '健康数据读取权限',
                type: 'health',
                description: '读取健康数据'
            },
            'NSHealthUpdateUsageDescription': {
                name: '健康数据写入权限',
                type: 'health',
                description: '写入健康数据'
            },
            'NSFaceIDUsageDescription': {
                name: 'Face ID权限',
                type: 'biometric',
                description: '使用Face ID'
            },
            'NSSpeechRecognitionUsageDescription': {
                name: '语音识别权限',
                type: 'speech',
                description: '使用语音识别'
            },
            'NSAppleMusicUsageDescription': {
                name: '媒体库权限',
                type: 'media',
                description: '访问媒体库'
            }
        };

        // 查找权限声明
        for (const [key, permission] of Object.entries(permissionMap)) {
            if (content.includes(key)) {
                // 尝试提取描述文本
                const descriptionMatch = content.match(new RegExp(`<key>${key}</key>\\s*<string>([^<]*)</string>`, 'i'));
                const description = descriptionMatch ? descriptionMatch[1] : permission.description;
                
                permissions.push({
                    key: key,
                    name: permission.name,
                    type: permission.type,
                    description: description,
                    declared: true
                });
            }
        }

        return permissions;
    }

    extractAppInfo(content) {
        const appInfo = {};
        
        // 提取应用信息
        const infoMap = {
            'CFBundleDisplayName': 'displayName',
            'CFBundleName': 'bundleName',
            'CFBundleIdentifier': 'bundleId',
            'CFBundleVersion': 'version',
            'CFBundleShortVersionString': 'shortVersion',
            'LSMinimumSystemVersion': 'minSystemVersion',
            'UIRequiredDeviceCapabilities': 'requiredCapabilities'
        };

        for (const [key, prop] of Object.entries(infoMap)) {
            const match = content.match(new RegExp(`<key>${key}</key>\\s*<string>([^<]*)</string>`, 'i'));
            if (match) {
                appInfo[prop] = match[1];
            }
        }

        return appInfo;
    }
}

// Android AndroidManifest.xml 解析器
class AndroidManifestParser {
    parse(content) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(content, 'text/xml');
            
            if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
                throw new Error('XML格式错误');
            }

            const permissions = this.extractPermissions(xmlDoc);
            const appInfo = this.extractAppInfo(xmlDoc);
            
            return {
                platform: 'Android',
                type: 'AndroidManifest.xml',
                permissions: permissions,
                appInfo: appInfo,
                rawContent: content
            };
        } catch (error) {
            throw new Error(`AndroidManifest.xml 解析失败: ${error.message}`);
        }
    }

    extractPermissions(xmlDoc) {
        const permissions = [];
        const permissionElements = xmlDoc.getElementsByTagName('uses-permission');
        
        // Android权限映射
        const permissionMap = {
            'android.permission.CAMERA': {
                name: '相机权限',
                type: 'camera',
                description: '访问相机'
            },
            'android.permission.RECORD_AUDIO': {
                name: '麦克风权限',
                type: 'microphone',
                description: '录制音频'
            },
            'android.permission.ACCESS_FINE_LOCATION': {
                name: '精确位置权限',
                type: 'location',
                description: '访问精确位置'
            },
            'android.permission.ACCESS_COARSE_LOCATION': {
                name: '大致位置权限',
                type: 'location',
                description: '访问大致位置'
            },
            'android.permission.READ_CONTACTS': {
                name: '读取通讯录权限',
                type: 'contacts',
                description: '读取通讯录'
            },
            'android.permission.WRITE_CONTACTS': {
                name: '写入通讯录权限',
                type: 'contacts',
                description: '修改通讯录'
            },
            'android.permission.READ_EXTERNAL_STORAGE': {
                name: '读取存储权限',
                type: 'storage',
                description: '读取外部存储'
            },
            'android.permission.WRITE_EXTERNAL_STORAGE': {
                name: '写入存储权限',
                type: 'storage',
                description: '写入外部存储'
            },
            'android.permission.READ_PHONE_STATE': {
                name: '读取手机状态权限',
                type: 'phone',
                description: '读取手机状态'
            },
            'android.permission.CALL_PHONE': {
                name: '拨打电话权限',
                type: 'phone',
                description: '拨打电话'
            },
            'android.permission.READ_SMS': {
                name: '读取短信权限',
                type: 'sms',
                description: '读取短信'
            },
            'android.permission.SEND_SMS': {
                name: '发送短信权限',
                type: 'sms',
                description: '发送短信'
            },
            'android.permission.READ_CALENDAR': {
                name: '读取日历权限',
                type: 'calendar',
                description: '读取日历'
            },
            'android.permission.WRITE_CALENDAR': {
                name: '写入日历权限',
                type: 'calendar',
                description: '修改日历'
            },
            'android.permission.USE_FINGERPRINT': {
                name: '指纹权限',
                type: 'biometric',
                description: '使用指纹'
            },
            'android.permission.USE_BIOMETRIC': {
                name: '生物识别权限',
                type: 'biometric',
                description: '使用生物识别'
            },
            'android.permission.INTERNET': {
                name: '网络权限',
                type: 'network',
                description: '访问网络'
            },
            'android.permission.ACCESS_NETWORK_STATE': {
                name: '网络状态权限',
                type: 'network',
                description: '访问网络状态'
            },
            'android.permission.ACCESS_WIFI_STATE': {
                name: 'WiFi状态权限',
                type: 'network',
                description: '访问WiFi状态'
            },
            'android.permission.BLUETOOTH': {
                name: '蓝牙权限',
                type: 'bluetooth',
                description: '使用蓝牙'
            },
            'android.permission.BLUETOOTH_ADMIN': {
                name: '蓝牙管理权限',
                type: 'bluetooth',
                description: '管理蓝牙'
            }
        };

        for (let i = 0; i < permissionElements.length; i++) {
            const element = permissionElements[i];
            const permissionName = element.getAttribute('android:name');
            
            if (permissionName && permissionMap[permissionName]) {
                const permission = permissionMap[permissionName];
                permissions.push({
                    key: permissionName,
                    name: permission.name,
                    type: permission.type,
                    description: permission.description,
                    declared: true
                });
            } else if (permissionName) {
                // 未知权限
                permissions.push({
                    key: permissionName,
                    name: permissionName,
                    type: 'unknown',
                    description: '未知权限',
                    declared: true
                });
            }
        }

        return permissions;
    }

    extractAppInfo(xmlDoc) {
        const appInfo = {};
        const manifestElement = xmlDoc.getElementsByTagName('manifest')[0];
        const applicationElement = xmlDoc.getElementsByTagName('application')[0];
        
        if (manifestElement) {
            appInfo.packageName = manifestElement.getAttribute('package');
            appInfo.versionCode = manifestElement.getAttribute('android:versionCode');
            appInfo.versionName = manifestElement.getAttribute('android:versionName');
        }
        
        if (applicationElement) {
            appInfo.label = applicationElement.getAttribute('android:label');
            appInfo.icon = applicationElement.getAttribute('android:icon');
            appInfo.theme = applicationElement.getAttribute('android:theme');
        }

        return appInfo;
    }
}

// Windows AppxManifest.xml 解析器
class AppxManifestParser {
    parse(content) {
        try {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(content, 'text/xml');
            
            if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
                throw new Error('XML格式错误');
            }

            const permissions = this.extractPermissions(xmlDoc);
            const appInfo = this.extractAppInfo(xmlDoc);
            
            return {
                platform: 'Windows',
                type: 'AppxManifest.xml',
                permissions: permissions,
                appInfo: appInfo,
                rawContent: content
            };
        } catch (error) {
            throw new Error(`AppxManifest.xml 解析失败: ${error.message}`);
        }
    }

    extractPermissions(xmlDoc) {
        const permissions = [];
        const capabilityElements = xmlDoc.getElementsByTagName('Capability');
        const deviceCapabilityElements = xmlDoc.getElementsByTagName('DeviceCapability');
        
        // Windows权限映射
        const capabilityMap = {
            'internetClient': {
                name: '网络客户端权限',
                type: 'network',
                description: '访问网络（客户端）'
            },
            'internetClientServer': {
                name: '网络服务器权限',
                type: 'network',
                description: '访问网络（服务器）'
            },
            'privateNetworkClientServer': {
                name: '私有网络权限',
                type: 'network',
                description: '访问私有网络'
            },
            'documentsLibrary': {
                name: '文档库权限',
                type: 'storage',
                description: '访问文档库'
            },
            'picturesLibrary': {
                name: '图片库权限',
                type: 'storage',
                description: '访问图片库'
            },
            'videosLibrary': {
                name: '视频库权限',
                type: 'storage',
                description: '访问视频库'
            },
            'musicLibrary': {
                name: '音乐库权限',
                type: 'storage',
                description: '访问音乐库'
            },
            'removableStorage': {
                name: '可移动存储权限',
                type: 'storage',
                description: '访问可移动存储'
            }
        };

        const deviceCapabilityMap = {
            'webcam': {
                name: '摄像头权限',
                type: 'camera',
                description: '访问摄像头'
            },
            'microphone': {
                name: '麦克风权限',
                type: 'microphone',
                description: '访问麦克风'
            },
            'location': {
                name: '位置权限',
                type: 'location',
                description: '访问位置服务'
            },
            'bluetooth': {
                name: '蓝牙权限',
                type: 'bluetooth',
                description: '使用蓝牙'
            },
            'proximity': {
                name: '近距离通信权限',
                type: 'nfc',
                description: '使用近距离通信'
            }
        };

        // 处理Capability
        for (let i = 0; i < capabilityElements.length; i++) {
            const element = capabilityElements[i];
            const capabilityName = element.getAttribute('Name');
            
            if (capabilityName && capabilityMap[capabilityName]) {
                const capability = capabilityMap[capabilityName];
                permissions.push({
                    key: capabilityName,
                    name: capability.name,
                    type: capability.type,
                    description: capability.description,
                    declared: true
                });
            }
        }

        // 处理DeviceCapability
        for (let i = 0; i < deviceCapabilityElements.length; i++) {
            const element = deviceCapabilityElements[i];
            const capabilityName = element.getAttribute('Name');
            
            if (capabilityName && deviceCapabilityMap[capabilityName]) {
                const capability = deviceCapabilityMap[capabilityName];
                permissions.push({
                    key: capabilityName,
                    name: capability.name,
                    type: capability.type,
                    description: capability.description,
                    declared: true
                });
            }
        }

        return permissions;
    }

    extractAppInfo(xmlDoc) {
        const appInfo = {};
        const identityElement = xmlDoc.getElementsByTagName('Identity')[0];
        const propertiesElement = xmlDoc.getElementsByTagName('Properties')[0];
        
        if (identityElement) {
            appInfo.name = identityElement.getAttribute('Name');
            appInfo.version = identityElement.getAttribute('Version');
            appInfo.publisher = identityElement.getAttribute('Publisher');
        }
        
        if (propertiesElement) {
            const displayNameElement = propertiesElement.getElementsByTagName('DisplayName')[0];
            const publisherDisplayNameElement = propertiesElement.getElementsByTagName('PublisherDisplayName')[0];
            
            if (displayNameElement) {
                appInfo.displayName = displayNameElement.textContent;
            }
            if (publisherDisplayNameElement) {
                appInfo.publisherDisplayName = publisherDisplayNameElement.textContent;
            }
        }

        return appInfo;
    }
}

// 权限分析器
class PermissionAnalyzer {
    constructor() {
        this.privacyKeywords = {
            camera: ['相机', '摄像', '拍照', '录像', 'camera', 'photo', 'video'],
            microphone: ['麦克风', '录音', '语音', 'microphone', 'audio', 'record'],
            location: ['位置', '定位', '地理', 'location', 'gps', 'coordinate'],
            contacts: ['通讯录', '联系人', 'contacts', 'address book'],
            storage: ['存储', '文件', '相册', 'storage', 'file', 'photo', 'gallery'],
            phone: ['电话', '通话', 'phone', 'call'],
            sms: ['短信', '消息', 'sms', 'message'],
            calendar: ['日历', '日程', 'calendar', 'event'],
            biometric: ['指纹', '面容', '生物识别', 'fingerprint', 'face id', 'biometric'],
            network: ['网络', '联网', 'network', 'internet'],
            bluetooth: ['蓝牙', 'bluetooth'],
            health: ['健康', '运动', 'health', 'fitness'],
            media: ['媒体', '音乐', 'media', 'music']
        };
    }

    // 分析权限合规性（双向对比）
    analyzeCompliance(configPermissions, privacyText) {
        const results = [];
        const privacyLower = privacyText.toLowerCase();
        
        // 1. 检查配置文件中声明的权限是否在隐私条款中提及
        for (const permission of configPermissions) {
            const inPrivacy = this.checkPermissionInPrivacy(permission, privacyLower);
            
            results.push({
                name: permission.name,
                type: permission.type,
                key: permission.key,
                declared: true,
                inPrivacy: inPrivacy,
                status: inPrivacy ? 'compliant' : 'config_only',
                description: permission.description,
                category: inPrivacy ? '合规权限' : '仅配置文件声明'
            });
        }

        // 2. 检查隐私条款中提及但未在配置文件中声明的权限
        const mentionedPermissions = this.findMentionedPermissions(privacyLower);
        const declaredTypes = new Set(configPermissions.map(p => p.type));
        
        for (const mentioned of mentionedPermissions) {
            if (!declaredTypes.has(mentioned.type)) {
                results.push({
                    name: mentioned.name,
                    type: mentioned.type,
                    key: '',
                    declared: false,
                    inPrivacy: true,
                    status: 'privacy_only',
                    description: mentioned.description,
                    category: '仅隐私条款提及'
                });
            }
        }

        return results;
    }

    // 检查权限是否在隐私条款中提及
    checkPermissionInPrivacy(permission, privacyText) {
        const keywords = this.privacyKeywords[permission.type] || [];
        
        for (const keyword of keywords) {
            if (privacyText.includes(keyword.toLowerCase())) {
                return true;
            }
        }
        
        return false;
    }

    // 查找隐私条款中提及的权限
    findMentionedPermissions(privacyText) {
        const mentioned = [];
        
        for (const [type, keywords] of Object.entries(this.privacyKeywords)) {
            for (const keyword of keywords) {
                if (privacyText.includes(keyword.toLowerCase())) {
                    mentioned.push({
                        type: type,
                        name: this.getPermissionName(type),
                        description: `隐私条款中提及的${this.getPermissionName(type)}`
                    });
                    break; // 找到一个关键词就够了
                }
            }
        }
        
        return mentioned;
    }

    // 获取权限名称
    getPermissionName(type) {
        const names = {
            camera: '相机权限',
            microphone: '麦克风权限',
            location: '位置权限',
            contacts: '通讯录权限',
            storage: '存储权限',
            phone: '电话权限',
            sms: '短信权限',
            calendar: '日历权限',
            biometric: '生物识别权限',
            network: '网络权限',
            bluetooth: '蓝牙权限',
            health: '健康权限',
            media: '媒体权限'
        };
        return names[type] || `${type}权限`;
    }

    // 生成合规性报告
    generateComplianceReport(analysisResults) {
        const summary = {
            totalPermissions: analysisResults.length,
            compliant: analysisResults.filter(r => r.status === 'compliant').length,
            configOnly: analysisResults.filter(r => r.status === 'config_only').length,
            privacyOnly: analysisResults.filter(r => r.status === 'privacy_only').length
        };
        
        summary.complianceRate = summary.totalPermissions > 0 ? 
            Math.round((summary.compliant / summary.totalPermissions) * 100) : 0;
        
        const recommendations = this.generateRecommendations(analysisResults);
        
        return {
            summary,
            permissions: analysisResults,
            recommendations
        };
    }

    // 生成改进建议
    generateRecommendations(analysisResults) {
        const recommendations = [];
        
        const configOnly = analysisResults.filter(r => r.status === 'config_only');
        const privacyOnly = analysisResults.filter(r => r.status === 'privacy_only');
        const compliant = analysisResults.filter(r => r.status === 'compliant');
        
        // 配置文件中有但隐私条款中没有的权限
        if (configOnly.length > 0) {
            recommendations.push({
                type: 'warning',
                title: '配置文件权限缺失隐私说明',
                content: `发现 ${configOnly.length} 个权限已在配置文件中声明但未在隐私条款中说明，建议在隐私条款中添加相关说明：${configOnly.map(v => v.name).join('、')}`,
                priority: 'high'
            });
        }
        
        // 隐私条款中有但配置文件中没有的权限
        if (privacyOnly.length > 0) {
            recommendations.push({
                type: 'info',
                title: '隐私条款权限未实际使用',
                content: `发现 ${privacyOnly.length} 个权限在隐私条款中提及但未在配置文件中声明，建议检查是否需要这些权限或从隐私条款中移除：${privacyOnly.map(m => m.name).join('、')}`,
                priority: 'medium'
            });
        }
        
        // 完全合规的情况
        if (configOnly.length === 0 && privacyOnly.length === 0 && compliant.length > 0) {
            recommendations.push({
                type: 'success',
                title: '完全合规',
                content: '恭喜！您的应用权限声明与隐私条款完全一致，符合合规要求。',
                priority: 'low'
            });
        }
        
        // 通用建议
        recommendations.push({
            type: 'info',
            title: '持续合规建议',
            content: '建议定期更新隐私条款，确保与应用实际收集的信息保持一致。',
            priority: 'low'
        });
        
        recommendations.push({
            type: 'info',
            title: '版本更新检查',
            content: '建议在应用更新时重新进行隐私合规检查，确保新功能的权限声明合规。',
            priority: 'low'
        });
        
        return recommendations;
    }
}

// 鸿蒙OS config.json 解析器
class HarmonyOSConfigParser {
    parse(content) {
        try {
            const config = JSON.parse(content);
            
            const permissions = this.extractPermissions(config);
            const appInfo = this.extractAppInfo(config);
            
            return {
                platform: '鸿蒙OS',
                type: 'config.json',
                permissions: permissions,
                appInfo: appInfo,
                rawContent: content
            };
        } catch (error) {
            throw new Error(`config.json 解析失败: ${error.message}`);
        }
    }

    extractPermissions(config) {
        const permissions = [];
        
        // 鸿蒙OS权限映射
        const permissionMap = {
            'ohos.permission.CAMERA': {
                name: '相机权限',
                type: 'camera',
                description: '访问相机'
            },
            'ohos.permission.MICROPHONE': {
                name: '麦克风权限',
                type: 'microphone',
                description: '访问麦克风'
            },
            'ohos.permission.LOCATION': {
                name: '位置权限',
                type: 'location',
                description: '访问位置信息'
            },
            'ohos.permission.LOCATION_IN_BACKGROUND': {
                name: '后台位置权限',
                type: 'location',
                description: '后台访问位置信息'
            },
            'ohos.permission.READ_MEDIA': {
                name: '媒体读取权限',
                type: 'storage',
                description: '读取媒体文件'
            },
            'ohos.permission.WRITE_MEDIA': {
                name: '媒体写入权限',
                type: 'storage',
                description: '写入媒体文件'
            },
            'ohos.permission.INTERNET': {
                name: '网络权限',
                type: 'network',
                description: '访问网络'
            },
            'ohos.permission.GET_NETWORK_INFO': {
                name: '网络信息权限',
                type: 'network',
                description: '获取网络信息'
            },
            'ohos.permission.READ_CONTACTS': {
                name: '通讯录读取权限',
                type: 'contacts',
                description: '读取通讯录'
            },
            'ohos.permission.WRITE_CONTACTS': {
                name: '通讯录写入权限',
                type: 'contacts',
                description: '修改通讯录'
            },
            'ohos.permission.READ_CALENDAR': {
                name: '日历读取权限',
                type: 'calendar',
                description: '读取日历'
            },
            'ohos.permission.WRITE_CALENDAR': {
                name: '日历写入权限',
                type: 'calendar',
                description: '修改日历'
            },
            'ohos.permission.USE_BLUETOOTH': {
                name: '蓝牙权限',
                type: 'bluetooth',
                description: '使用蓝牙'
            },
            'ohos.permission.DISCOVER_BLUETOOTH': {
                name: '蓝牙发现权限',
                type: 'bluetooth',
                description: '发现蓝牙设备'
            },
            'ohos.permission.MANAGE_BLUETOOTH': {
                name: '蓝牙管理权限',
                type: 'bluetooth',
                description: '管理蓝牙'
            },
            'ohos.permission.ACTIVITY_MOTION': {
                name: '运动传感器权限',
                type: 'motion',
                description: '访问运动传感器'
            },
            'ohos.permission.READ_HEALTH_DATA': {
                name: '健康数据读取权限',
                type: 'health',
                description: '读取健康数据'
            }
        };

        // 查找权限声明
        const reqPermissions = config.module?.reqPermissions || [];
        
        for (const reqPermission of reqPermissions) {
            const permissionName = reqPermission.name;
            const reason = reqPermission.reason || '';
            
            if (permissionMap[permissionName]) {
                const permission = permissionMap[permissionName];
                permissions.push({
                    key: permissionName,
                    name: permission.name,
                    type: permission.type,
                    description: reason || permission.description,
                    declared: true
                });
            } else {
                // 未知权限
                permissions.push({
                    key: permissionName,
                    name: permissionName,
                    type: 'unknown',
                    description: reason || '未知权限',
                    declared: true
                });
            }
        }

        return permissions;
    }

    extractAppInfo(config) {
        const appInfo = {};
        
        // 提取应用信息
        if (config.app) {
            appInfo.bundleName = config.app.bundleName;
            appInfo.vendor = config.app.vendor;
            appInfo.version = config.app.version;
            appInfo.apiVersion = config.app.apiVersion;
        }
        
        if (config.module) {
            appInfo.package = config.module.package;
            appInfo.name = config.module.name;
            appInfo.mainAbility = config.module.mainAbility;
            appInfo.deviceType = config.module.deviceType;
            appInfo.distro = config.module.distro;
        }

        return appInfo;
    }
}

// 导出解析器
window.ConfigParser = ConfigParser;
window.PermissionAnalyzer = PermissionAnalyzer;