// 用户信息收集清单解析器
class InfoCollectionAnalyzer {
    constructor() {
        this.privacyPatterns = this.initializePrivacyPatterns();
        this.configPatterns = this.initializeConfigPatterns();
    }

    // 初始化隐私条款模式匹配
    initializePrivacyPatterns() {
        return {
            // 个人信息类型模式
            personalInfo: {
                identity: {
                    keywords: ['姓名', '身份证', '护照', '驾驶证', '真实姓名', '实名', 'name', 'identity', 'id card'],
                    scenarios: ['实名认证', '账户注册', '身份验证'],
                    purposes: ['用户身份验证', '法律合规要求', '账户安全保障']
                },
                contact: {
                    keywords: ['手机号', '电话', '邮箱', '地址', '联系方式', 'phone', 'email', 'address', 'contact'],
                    scenarios: ['账户注册', '找回密码', '消息通知', '物流配送'],
                    purposes: ['账户验证', '服务通知', '客户服务', '商品配送']
                },
                biometric: {
                    keywords: ['指纹', '面部', '声纹', '虹膜', '生物识别', 'fingerprint', 'face', 'biometric'],
                    scenarios: ['身份认证', '设备解锁', '支付验证'],
                    purposes: ['身份验证', '账户安全', '便捷登录']
                },
                location: {
                    keywords: ['位置', '地理', '定位', 'GPS', '经纬度', 'location', 'coordinate'],
                    scenarios: ['地图导航', '附近服务', '位置分享', '广告推送'],
                    purposes: ['提供位置服务', '个性化推荐', '安全防护']
                },
                device: {
                    keywords: ['设备信息', '硬件', 'IMEI', 'MAC', '设备ID', 'device', 'hardware'],
                    scenarios: ['设备识别', '安全验证', '统计分析'],
                    purposes: ['设备管理', '安全防护', '服务优化']
                },
                network: {
                    keywords: ['IP地址', '网络', '浏览器', '操作系统', 'IP', 'browser', 'OS'],
                    scenarios: ['网络连接', '服务访问', '安全检测'],
                    purposes: ['服务提供', '安全防护', '用户体验优化']
                },
                usage: {
                    keywords: ['使用记录', '操作日志', '浏览历史', '搜索记录', 'usage', 'log', 'history'],
                    scenarios: ['功能使用', '内容浏览', '搜索查询'],
                    purposes: ['服务改进', '个性化推荐', '用户体验优化']
                },
                content: {
                    keywords: ['照片', '视频', '音频', '文件', '聊天记录', 'photo', 'video', 'audio', 'file', 'message'],
                    scenarios: ['内容分享', '云端存储', '社交互动'],
                    purposes: ['内容服务', '数据备份', '社交功能']
                }
            },
            
            // 收集方式模式
            collectionMethods: {
                automatic: ['自动收集', '系统获取', '设备读取', 'automatically', 'system'],
                manual: ['用户输入', '手动填写', '主动提供', 'manually', 'input'],
                thirdParty: ['第三方', '合作伙伴', '外部服务', 'third party', 'partner'],
                sensor: ['传感器', '摄像头', '麦克风', 'sensor', 'camera', 'microphone'],
                cookie: ['Cookie', '本地存储', '缓存', 'cache', 'storage']
            }
        };
    }

    // 初始化配置文件模式匹配
    initializeConfigPatterns() {
        return {
            ios: {
                camera: {
                    permission: 'NSCameraUsageDescription',
                    infoType: 'biometric',
                    scenario: '拍照录像',
                    method: 'sensor'
                },
                microphone: {
                    permission: 'NSMicrophoneUsageDescription',
                    infoType: 'content',
                    scenario: '录音通话',
                    method: 'sensor'
                },
                location: {
                    permission: 'NSLocationWhenInUseUsageDescription',
                    infoType: 'location',
                    scenario: '位置服务',
                    method: 'sensor'
                },
                contacts: {
                    permission: 'NSContactsUsageDescription',
                    infoType: 'contact',
                    scenario: '通讯录访问',
                    method: 'automatic'
                },
                photos: {
                    permission: 'NSPhotoLibraryUsageDescription',
                    infoType: 'content',
                    scenario: '相册访问',
                    method: 'manual'
                }
            },
            android: {
                camera: {
                    permission: 'android.permission.CAMERA',
                    infoType: 'biometric',
                    scenario: '拍照录像',
                    method: 'sensor'
                },
                microphone: {
                    permission: 'android.permission.RECORD_AUDIO',
                    infoType: 'content',
                    scenario: '录音通话',
                    method: 'sensor'
                },
                location: {
                    permission: 'android.permission.ACCESS_FINE_LOCATION',
                    infoType: 'location',
                    scenario: '精确定位',
                    method: 'sensor'
                },
                contacts: {
                    permission: 'android.permission.READ_CONTACTS',
                    infoType: 'contact',
                    scenario: '通讯录读取',
                    method: 'automatic'
                },
                storage: {
                    permission: 'android.permission.READ_EXTERNAL_STORAGE',
                    infoType: 'content',
                    scenario: '存储访问',
                    method: 'automatic'
                }
            },
            harmonyos: {
                camera: {
                    permission: 'ohos.permission.CAMERA',
                    infoType: 'biometric',
                    scenario: '拍照录像',
                    method: 'sensor'
                },
                microphone: {
                    permission: 'ohos.permission.MICROPHONE',
                    infoType: 'content',
                    scenario: '录音通话',
                    method: 'sensor'
                },
                location: {
                    permission: 'ohos.permission.LOCATION',
                    infoType: 'location',
                    scenario: '位置服务',
                    method: 'sensor'
                },
                media: {
                    permission: 'ohos.permission.READ_MEDIA',
                    infoType: 'content',
                    scenario: '媒体访问',
                    method: 'automatic'
                }
            }
        };
    }

    // 分析隐私条款中的信息收集清单
    analyzePrivacyPolicy(privacyText) {
        const collections = [];
        const textLower = privacyText.toLowerCase();
        
        // 分析每种个人信息类型
        for (const [infoType, config] of Object.entries(this.privacyPatterns.personalInfo)) {
            const matches = this.findInfoTypeInText(textLower, config);
            if (matches.found) {
                collections.push({
                    infoType: infoType,
                    infoTypeName: this.getInfoTypeName(infoType),
                    scenarios: matches.scenarios,
                    purposes: matches.purposes,
                    methods: this.extractCollectionMethods(textLower, matches.context),
                    source: 'privacy_policy',
                    confidence: matches.confidence
                });
            }
        }
        
        return collections;
    }

    // 分析配置文件中的信息收集清单
    analyzeConfigFile(configData, platform) {
        const collections = [];
        const patterns = this.configPatterns[platform] || {};
        
        if (configData.permissions) {
            for (const permission of configData.permissions) {
                const pattern = this.findPatternByPermission(patterns, permission.key);
                if (pattern) {
                    collections.push({
                        infoType: pattern.infoType,
                        infoTypeName: this.getInfoTypeName(pattern.infoType),
                        scenarios: [pattern.scenario],
                        purposes: [this.inferPurposeFromPermission(permission)],
                        methods: [pattern.method],
                        source: 'config_file',
                        permission: permission.key,
                        description: permission.description,
                        confidence: 0.9
                    });
                }
            }
        }
        
        return collections;
    }

    // 在文本中查找信息类型
    findInfoTypeInText(text, config) {
        let found = false;
        let confidence = 0;
        let scenarios = [];
        let purposes = [];
        let context = '';
        
        // 检查关键词
        for (const keyword of config.keywords) {
            if (text.includes(keyword.toLowerCase())) {
                found = true;
                confidence += 0.1;
                
                // 提取上下文
                const index = text.indexOf(keyword.toLowerCase());
                const start = Math.max(0, index - 50);
                const end = Math.min(text.length, index + keyword.length + 50);
                context += text.substring(start, end) + ' ';
            }
        }
        
        if (found) {
            // 匹配场景
            scenarios = config.scenarios.filter(scenario => 
                text.includes(scenario) || context.includes(scenario.toLowerCase())
            );
            
            // 匹配目的
            purposes = config.purposes.filter(purpose => 
                text.includes(purpose) || context.includes(purpose.toLowerCase())
            );
            
            // 如果没有找到具体场景和目的，使用默认值
            if (scenarios.length === 0) scenarios = config.scenarios.slice(0, 2);
            if (purposes.length === 0) purposes = config.purposes.slice(0, 2);
            
            confidence = Math.min(1.0, confidence);
        }
        
        return { found, confidence, scenarios, purposes, context };
    }

    // 提取收集方式
    extractCollectionMethods(text, context) {
        const methods = [];
        const combinedText = (text + ' ' + context).toLowerCase();
        
        for (const [method, keywords] of Object.entries(this.privacyPatterns.collectionMethods)) {
            for (const keyword of keywords) {
                if (combinedText.includes(keyword.toLowerCase())) {
                    methods.push(this.getMethodName(method));
                    break;
                }
            }
        }
        
        return methods.length > 0 ? methods : ['系统获取'];
    }

    // 根据权限查找模式
    findPatternByPermission(patterns, permissionKey) {
        for (const [key, pattern] of Object.entries(patterns)) {
            if (pattern.permission === permissionKey) {
                return pattern;
            }
        }
        return null;
    }

    // 从权限推断目的
    inferPurposeFromPermission(permission) {
        const purposeMap = {
            camera: '拍照录像功能',
            microphone: '录音通话功能',
            location: '位置相关服务',
            contacts: '联系人相关功能',
            storage: '文件存储功能',
            phone: '电话相关功能',
            sms: '短信相关功能'
        };
        
        return purposeMap[permission.type] || permission.description || '应用功能需要';
    }

    // 获取信息类型名称
    getInfoTypeName(infoType) {
        const nameMap = {
            identity: '身份信息',
            contact: '联系方式',
            biometric: '生物识别信息',
            location: '位置信息',
            device: '设备信息',
            network: '网络信息',
            usage: '使用记录',
            content: '内容信息'
        };
        return nameMap[infoType] || infoType;
    }

    // 获取收集方式名称
    getMethodName(method) {
        const nameMap = {
            automatic: '自动收集',
            manual: '用户主动提供',
            thirdParty: '第三方获取',
            sensor: '传感器获取',
            cookie: 'Cookie/本地存储'
        };
        return nameMap[method] || method;
    }

    // 合并分析结果
    mergeAnalysisResults(privacyCollections, configCollections) {
        const merged = [];
        const processedTypes = new Set();
        
        // 处理隐私条款中的信息
        for (const privacyItem of privacyCollections) {
            const configItem = configCollections.find(c => c.infoType === privacyItem.infoType);
            
            if (configItem) {
                // 合并信息
                merged.push({
                    ...privacyItem,
                    scenarios: [...new Set([...privacyItem.scenarios, ...configItem.scenarios])],
                    purposes: [...new Set([...privacyItem.purposes, ...configItem.purposes])],
                    methods: [...new Set([...privacyItem.methods, ...configItem.methods])],
                    sources: ['privacy_policy', 'config_file'],
                    permission: configItem.permission,
                    status: 'consistent',
                    confidence: (privacyItem.confidence + configItem.confidence) / 2
                });
            } else {
                // 只在隐私条款中提及
                merged.push({
                    ...privacyItem,
                    sources: ['privacy_policy'],
                    status: 'privacy_only',
                    permission: null
                });
            }
            
            processedTypes.add(privacyItem.infoType);
        }
        
        // 处理只在配置文件中的信息
        for (const configItem of configCollections) {
            if (!processedTypes.has(configItem.infoType)) {
                merged.push({
                    ...configItem,
                    sources: ['config_file'],
                    status: 'config_only'
                });
            }
        }
        
        return merged.sort((a, b) => b.confidence - a.confidence);
    }

    // 生成信息收集清单报告
    generateCollectionReport(mergedResults, privacyCollections = [], configCollections = []) {
        const summary = {
            totalTypes: mergedResults.length,
            consistent: mergedResults.filter(r => r.status === 'consistent').length,
            privacyOnly: mergedResults.filter(r => r.status === 'privacy_only').length,
            configOnly: mergedResults.filter(r => r.status === 'config_only').length
        };
        
        const recommendations = this.generateCollectionRecommendations(mergedResults);
        
        // 增强隐私条款详情
        const enhancedPrivacyDetails = privacyCollections.map(item => ({
            ...item,
            keywords: this.extractKeywordsFromText(item.context || ''),
            description: this.generateDescriptionFromContext(item.context || '', item.infoType)
        }));
        
        // 增强配置文件详情
        const enhancedConfigDetails = configCollections.map(item => ({
            ...item,
            platform: this.inferPlatformFromPermission(item.permission)
        }));
        
        return {
            summary,
            collections: mergedResults,
            recommendations,
            privacyDetails: enhancedPrivacyDetails,
            configDetails: enhancedConfigDetails
        };
    }
    
    // 从文本中提取关键词
    extractKeywordsFromText(text) {
        const keywords = [];
        const textLower = text.toLowerCase();
        
        // 遍历所有信息类型的关键词
        for (const [infoType, config] of Object.entries(this.privacyPatterns.personalInfo)) {
            for (const keyword of config.keywords) {
                if (textLower.includes(keyword.toLowerCase())) {
                    keywords.push(keyword);
                }
            }
        }
        
        return keywords.slice(0, 5); // 最多返回5个关键词
    }
    
    // 从上下文生成描述
    generateDescriptionFromContext(context, infoType) {
        if (!context) return `检测到${this.getInfoTypeName(infoType)}相关信息收集`;
        
        // 提取有意义的句子片段
        const sentences = context.split(/[。！？.!?]/).filter(s => s.trim().length > 10);
        const relevantSentence = sentences.find(s => 
            s.includes(this.getInfoTypeName(infoType)) || 
            this.privacyPatterns.personalInfo[infoType]?.keywords.some(k => 
                s.toLowerCase().includes(k.toLowerCase())
            )
        );
        
        return relevantSentence ? relevantSentence.trim() : `从隐私条款中识别出${this.getInfoTypeName(infoType)}收集声明`;
    }
    
    // 从权限推断平台
    inferPlatformFromPermission(permission) {
        if (!permission) return 'Unknown';
        
        if (permission.startsWith('NS')) return 'iOS/macOS';
        if (permission.startsWith('android.permission')) return 'Android';
        if (permission.startsWith('ohos.permission')) return 'HarmonyOS';
        if (permission.includes('Capability')) return 'Windows';
        
        return 'Unknown';
    }

    // 生成收集清单建议
    generateCollectionRecommendations(collections) {
        const recommendations = [];
        
        const privacyOnly = collections.filter(c => c.status === 'privacy_only');
        const configOnly = collections.filter(c => c.status === 'config_only');
        
        if (privacyOnly.length > 0) {
            recommendations.push({
                type: 'warning',
                title: '隐私条款信息未在配置中体现',
                content: `发现 ${privacyOnly.length} 项信息收集在隐私条款中说明但未在配置文件中声明权限，建议检查是否需要相应权限。`,
                items: privacyOnly.map(p => p.infoTypeName),
                priority: 'medium'
            });
        }
        
        if (configOnly.length > 0) {
            recommendations.push({
                type: 'info',
                title: '配置权限未在隐私条款中说明',
                content: `发现 ${configOnly.length} 项权限已在配置文件中声明但未在隐私条款中详细说明，建议完善隐私条款。`,
                items: configOnly.map(c => c.infoTypeName),
                priority: 'high'
            });
        }
        
        const consistent = collections.filter(c => c.status === 'consistent');
        if (consistent.length > 0) {
            recommendations.push({
                type: 'success',
                title: '信息收集声明一致',
                content: `${consistent.length} 项信息收集在隐私条款和配置文件中保持一致，符合规范要求。`,
                items: consistent.map(c => c.infoTypeName),
                priority: 'low'
            });
        }
        
        return recommendations;
    }
}

// 导出信息收集分析器
window.InfoCollectionAnalyzer = InfoCollectionAnalyzer;