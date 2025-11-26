// 增强版配置文件解析器
// 支持更强大的跨平台配置文件解析能力

class ConfigParserEnhanced extends ConfigParser {
    constructor() {
        super();
        console.log('✨ 配置文件解析器已增强');
    }
    
    // 批量解析文件
    async parseFiles(files) {
        const results = [];
        const errors = [];
        
        for (const file of files) {
            try {
                const result = await this.parseFile(file);
                results.push(result);
            } catch (error) {
                errors.push({
                    file: file.name,
                    error: error.message
                });
            }
        }
        
        return {
            success: results,
            errors: errors,
            summary: {
                total: files.length,
                successCount: results.length,
                errorCount: errors.length,
                platforms: [...new Set(results.map(r => r.platform))]
            }
        };
    }
    
    // 统一结构化输出
    normalizePermissions(parseResults) {
        const normalized = [];
        
        for (const result of parseResults) {
            for (const permission of result.permissions || []) {
                normalized.push({
                    permission: permission.key,
                    infoTypeName: permission.name,
                    infoType: permission.type,
                    description: permission.description || permission.userDescription || '',
                    scenarios: this.inferScenarios(permission.type, permission.name),
                    platform: result.platform,
                    fileName: result.fileName,
                    sensitive: permission.sensitive || false,
                    dangerous: permission.dangerous || false
                });
            }
        }
        
        return normalized;
    }
    
    // 推断使用场景
    inferScenarios(permissionType, permissionName) {
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
            tracking: ['广告追踪', '数据分析']
        };
        
        return scenarioMap[permissionType] || ['功能使用'];
    }
    
    // 生成配置文件详情展示数据
    generateConfigDetails(parseResults) {
        const details = [];
        
        for (const result of parseResults) {
            for (const permission of result.permissions || []) {
                details.push({
                    permission: permission.key,
                    infoTypeName: permission.name,
                    description: permission.description || permission.userDescription || '权限配置声明',
                    scenarios: this.inferScenarios(permission.type, permission.name),
                    platform: result.platform,
                    fileType: result.type,
                    sensitive: permission.sensitive || false
                });
            }
        }
        
        return details;
    }
}

// 增强的权限分析器
class PermissionAnalyzerEnhanced extends PermissionAnalyzer {
    constructor() {
        super();
        console.log('✨ 权限分析器已增强');
    }
    
    // 增强的合规性分析
    analyzeComplianceEnhanced(configDetails, privacyText) {
        const results = [];
        const privacyLower = privacyText ? privacyText.toLowerCase() : '';
        
        // 分析配置文件中的权限
        for (const detail of configDetails) {
            const inPrivacy = privacyText ? this.checkPermissionInPrivacy(detail, privacyLower) : false;
            
            results.push({
                name: detail.infoTypeName,
                type: detail.infoType || this.inferType(detail.infoTypeName),
                key: detail.permission,
                declared: true,
                inPrivacy: inPrivacy,
                status: inPrivacy ? 'compliant' : 'config_only',
                description: detail.description,
                category: inPrivacy ? '合规权限' : '仅配置文件声明',
                platform: detail.platform,
                scenarios: detail.scenarios || [],
                confidence: inPrivacy ? 0.95 : 0.8
            });
        }
        
        return results;
    }
    
    // 推断权限类型
    inferType(permissionName) {
        const typemap = {
            '相机': 'camera',
            '摄像': 'camera',
            '麦克风': 'microphone',
            '录音': 'microphone',
            '位置': 'location',
            '定位': 'location',
            '通讯录': 'contacts',
            '联系人': 'contacts',
            '相册': 'photos',
            '照片': 'photos',
            '存储': 'storage',
            '文件': 'storage',
            '电话': 'phone',
            '短信': 'sms',
            '日历': 'calendar',
            '蓝牙': 'bluetooth',
            '网络': 'network',
            '健康': 'health',
            '生物识别': 'biometric',
            '指纹': 'biometric',
            '面容': 'biometric',
            '追踪': 'tracking'
        };
        
        for (const [keyword, type] of Object.entries(typeMap)) {
            if (permissionName.includes(keyword)) {
                return type;
            }
        }
        
        return 'unknown';
    }
    
    // 生成增强的分析报告
    generateEnhancedReport(configDetails, privacyText) {
        const analysisResults = this.analyzeComplianceEnhanced(configDetails, privacyText);
        
        const summary = {
            totalPermissions: analysisResults.length,
            compliant: analysisResults.filter(r => r.status === 'compliant').length,
            configOnly: analysisResults.filter(r => r.status === 'config_only').length,
            platforms: [...new Set(configDetails.map(d => d.platform))],
            sensitiveCount: configDetails.filter(d => d.sensitive).length
        };
        
        summary.complianceRate = summary.totalPermissions > 0 ? 
            Math.round((summary.compliant / summary.totalPermissions) * 100) : 0;
        
        const recommendations = this.generateDetailedRecommendations(analysisResults);
        
        return {
            summary,
            permissions: analysisResults,
            configDetails: configDetails,
            recommendations
        };
    }
    
    // 生成详细建议
    generateDetailedRecommendations(analysisResults) {
        const recommendations = [];
        
        const configOnly = analysisResults.filter(r => r.status === 'config_only');
        const compliant = analysisResults.filter(r => r.status === 'compliant');
        const sensitive = analysisResults.filter(r => r.type === 'camera' || r.type === 'microphone' || r.type === 'location');
        
        if (configOnly.length > 0) {
            const platforms = [...new Set(configOnly.map(r => r.platform))];
            recommendations.push({
                type: 'warning',
                title: `发现${configOnly.length}个权限需要在隐私条款中说明`,
                content: `以下权限已在配置文件中声明但未在隐私条款中明确说明，建议补充说明以确保合规：`,
                items: configOnly.map(r => `${r.name} (${r.platform})`),
                priority: 'high',
                platforms: platforms
            });
        }
        
        if (sensitive.length > 0) {
            recommendations.push({
                type: 'info',
                title: '敏感权限提示',
                content: `检测到${sensitive.length}个敏感权限，请确保在隐私条款中详细说明使用目的和场景：`,
                items: sensitive.map(r => `${r.name} - ${r.scenarios.join('、')}`),
                priority: 'high'
            });
        }
        
        if (compliant.length === analysisResults.length && analysisResults.length > 0) {
            recommendations.push({
                type: 'success',
                title: '完全合规 ✅',
                content: `恭喜！所有${compliant.length}个权限都在隐私条款中得到了说明，符合合规要求。`,
                items: [],
                priority: 'low'
            });
        }
        
        // 平台特定建议
        const platforms = [...new Set(analysisResults.map(r => r.platform))];
        if (platforms.includes('iOS') || platforms.includes('iOS/macOS')) {
            recommendations.push({
                type: 'info',
                title: 'iOS平台合规建议',
                content: '请确保所有权限描述文字清晰易懂，避免使用技术术语，符合Apple审核指南要求。',
                items: [],
                priority: 'medium'
            });
        }
        
        if (platforms.includes('Android')) {
            recommendations.push({
                type: 'info',
                title: 'Android平台合规建议',
                content: '建议区分Normal权限和Dangerous权限，并为Dangerous权限提供详细说明。',
                items: [],
                priority: 'medium'
            });
        }
        
        return recommendations;
    }
}

// 导出增强版解析器
window.ConfigParserEnhanced = ConfigParserEnhanced;
window.PermissionAnalyzerEnhanced = PermissionAnalyzerEnhanced;

console.log('✅ 增强版配置文件解析器加载完成');
