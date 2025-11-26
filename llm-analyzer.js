// LLM驱动的隐私合规分析器
class LLMPrivacyAnalyzer {
    constructor(config = {}) {
        this.config = {
            provider: config.provider || 'none', // 'openai', 'azure', 'zhipu', 'local', 'none'
            apiKey: config.apiKey || '',
            apiEndpoint: config.apiEndpoint || '',
            model: config.model || 'gpt-4',
            temperature: config.temperature || 0.3,
            maxTokens: config.maxTokens || 2000,
            timeout: config.timeout || 30000
        };
        
        this.fallbackAnalyzer = new InfoCollectionAnalyzer();
    }
    
    // 分析隐私条款中的信息收集清单
    async analyzePrivacyPolicy(privacyText) {
        if (this.config.provider === 'none' || !this.config.apiKey) {
            console.log('未配置LLM，使用增强规则引擎分析隐私条款');
            return this.enhancedRuleBasedPrivacyAnalysis(privacyText);
        }
        
        try {
            const prompt = this.buildPrivacyPolicyPrompt(privacyText);
            const response = await this.callLLM(prompt);
            return this.parsePrivacyPolicyResponse(response);
        } catch (error) {
            console.warn('LLM分析失败，回退到规则引擎:', error);
            return this.enhancedRuleBasedPrivacyAnalysis(privacyText);
        }
    }
    
    // 分析配置文件中的权限清单
    async analyzeConfigFile(configData, platform) {
        if (this.config.provider === 'none' || !this.config.apiKey) {
            console.log('未配置LLM，使用增强规则引擎分析配置文件');
            return this.enhancedRuleBasedConfigAnalysis(configData, platform);
        }
        
        try {
            const prompt = this.buildConfigFilePrompt(configData, platform);
            const response = await this.callLLM(prompt);
            return this.parseConfigFileResponse(response);
        } catch (error) {
            console.warn('LLM分析失败，回退到规则引擎:', error);
            return this.enhancedRuleBasedConfigAnalysis(configData, platform);
        }
    }
    
    // 构建隐私条款分析提示词
    buildPrivacyPolicyPrompt(privacyText) {
        return {
            system: `你是一个专业的隐私合规分析专家。你的任务是分析隐私条款文本，识别其中提到的所有个人信息收集行为，并以结构化的JSON格式输出。

请识别以下信息类型：
- identity（身份信息）: 姓名、身份证、护照等
- contact（联系方式）: 手机号、邮箱、地址等
- biometric（生物识别）: 指纹、面部、声纹等
- location（位置信息）: GPS、地理位置等
- device（设备信息）: IMEI、MAC、设备ID等
- network（网络信息）: IP地址、网络类型等
- usage（使用记录）: 操作日志、浏览历史等
- content（内容信息）: 照片、视频、文件等

对每个信息类型，请提取：
1. infoType: 信息类型标识
2. infoTypeName: 中文名称
3. scenarios: 使用场景（数组）
4. purposes: 收集目的（数组）
5. methods: 收集方式（数组）
6. description: 描述性文字（从原文提取）
7. context: 相关上下文（原文片段）
8. confidence: 置信度（0-1）

请以JSON数组格式输出结果。`,
            user: `请分析以下隐私条款，识别所有信息收集行为：

${privacyText.substring(0, 8000)}

请输出JSON格式的分析结果。`
        };
    }
    
    // 构建配置文件分析提示词
    buildConfigFilePrompt(configData, platform) {
        return {
            system: `你是一个专业的移动应用权限分析专家。你的任务是分析应用配置文件中声明的权限，识别这些权限对应的信息收集行为。

平台信息：${platform}

对每个权限，请分析：
1. infoType: 信息类型标识
2. infoTypeName: 中文名称
3. scenarios: 使用场景
4. purposes: 使用目的
5. methods: 收集方式
6. permission: 权限名称
7. description: 权限描述
8. platform: 平台标识
9. confidence: 置信度（0-1）

请以JSON数组格式输出结果。`,
            user: `请分析以下配置文件的权限声明：

平台: ${configData.platform}
权限列表:
${JSON.stringify(configData.permissions, null, 2)}

请输出JSON格式的分析结果。`
        };
    }
    
    // 调用LLM API
    async callLLM(prompt) {
        switch (this.config.provider) {
            case 'openai':
                return await this.callOpenAI(prompt);
            case 'azure':
                return await this.callAzureOpenAI(prompt);
            case 'zhipu':
                return await this.callZhipuAI(prompt);
            default:
                throw new Error(`不支持的LLM提供商: ${this.config.provider}`);
        }
    }
    
    // 调用OpenAI API
    async callOpenAI(prompt) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model,
                messages: [
                    { role: 'system', content: prompt.system },
                    { role: 'user', content: prompt.user }
                ],
                temperature: this.config.temperature,
                max_tokens: this.config.maxTokens,
                response_format: { type: 'json_object' }
            }),
            signal: AbortSignal.timeout(this.config.timeout)
        });
        
        if (!response.ok) {
            throw new Error(`OpenAI API请求失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    // 调用Azure OpenAI API
    async callAzureOpenAI(prompt) {
        const endpoint = this.config.apiEndpoint || 
            'https://YOUR_RESOURCE_NAME.openai.azure.com/openai/deployments/YOUR_DEPLOYMENT_NAME/chat/completions?api-version=2024-02-15-preview';
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': this.config.apiKey
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: prompt.system },
                    { role: 'user', content: prompt.user }
                ],
                temperature: this.config.temperature,
                max_tokens: this.config.maxTokens
            }),
            signal: AbortSignal.timeout(this.config.timeout)
        });
        
        if (!response.ok) {
            throw new Error(`Azure OpenAI API请求失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    // 调用智谱AI API
    async callZhipuAI(prompt) {
        const endpoint = this.config.apiEndpoint || 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`
            },
            body: JSON.stringify({
                model: this.config.model || 'glm-4',
                messages: [
                    { role: 'system', content: prompt.system },
                    { role: 'user', content: prompt.user }
                ],
                temperature: this.config.temperature,
                max_tokens: this.config.maxTokens
            }),
            signal: AbortSignal.timeout(this.config.timeout)
        });
        
        if (!response.ok) {
            throw new Error(`智谱AI API请求失败: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.choices[0].message.content;
    }
    
    // 解析隐私条款分析结果
    parsePrivacyPolicyResponse(response) {
        try {
            const result = typeof response === 'string' ? JSON.parse(response) : response;
            
            // 如果返回的是对象包含collections字段
            if (result.collections && Array.isArray(result.collections)) {
                return result.collections.map(item => ({
                    infoType: item.infoType || 'unknown',
                    infoTypeName: item.infoTypeName || '未知',
                    scenarios: Array.isArray(item.scenarios) ? item.scenarios : [item.scenarios || '未指定'],
                    purposes: Array.isArray(item.purposes) ? item.purposes : [item.purposes || '未指定'],
                    methods: Array.isArray(item.methods) ? item.methods : [item.methods || '系统获取'],
                    source: 'privacy_policy',
                    description: item.description || '',
                    context: item.context || '',
                    confidence: item.confidence || 0.8
                }));
            }
            
            // 如果直接返回数组
            if (Array.isArray(result)) {
                return result.map(item => ({
                    infoType: item.infoType || 'unknown',
                    infoTypeName: item.infoTypeName || '未知',
                    scenarios: Array.isArray(item.scenarios) ? item.scenarios : [item.scenarios || '未指定'],
                    purposes: Array.isArray(item.purposes) ? item.purposes : [item.purposes || '未指定'],
                    methods: Array.isArray(item.methods) ? item.methods : [item.methods || '系统获取'],
                    source: 'privacy_policy',
                    description: item.description || '',
                    context: item.context || '',
                    confidence: item.confidence || 0.8
                }));
            }
            
            throw new Error('无法解析LLM返回的隐私条款分析结果');
        } catch (error) {
            console.error('解析隐私条款分析结果失败:', error, response);
            throw error;
        }
    }
    
    // 解析配置文件分析结果
    parseConfigFileResponse(response) {
        try {
            const result = typeof response === 'string' ? JSON.parse(response) : response;
            
            // 如果返回的是对象包含permissions字段
            if (result.permissions && Array.isArray(result.permissions)) {
                return result.permissions.map(item => ({
                    infoType: item.infoType || 'unknown',
                    infoTypeName: item.infoTypeName || '未知',
                    scenarios: Array.isArray(item.scenarios) ? item.scenarios : [item.scenarios || '未指定'],
                    purposes: Array.isArray(item.purposes) ? item.purposes : [item.purposes || '未指定'],
                    methods: Array.isArray(item.methods) ? item.methods : [item.methods || '系统获取'],
                    source: 'config_file',
                    permission: item.permission || '',
                    description: item.description || '',
                    platform: item.platform || 'Unknown',
                    confidence: item.confidence || 0.85
                }));
            }
            
            // 如果直接返回数组
            if (Array.isArray(result)) {
                return result.map(item => ({
                    infoType: item.infoType || 'unknown',
                    infoTypeName: item.infoTypeName || '未知',
                    scenarios: Array.isArray(item.scenarios) ? item.scenarios : [item.scenarios || '未指定'],
                    purposes: Array.isArray(item.purposes) ? item.purposes : [item.purposes || '未指定'],
                    methods: Array.isArray(item.methods) ? item.methods : [item.methods || '系统获取'],
                    source: 'config_file',
                    permission: item.permission || '',
                    description: item.description || '',
                    platform: item.platform || 'Unknown',
                    confidence: item.confidence || 0.85
                }));
            }
            
            throw new Error('无法解析LLM返回的配置文件分析结果');
        } catch (error) {
            console.error('解析配置文件分析结果失败:', error, response);
            throw error;
        }
    }
    
    // 增强的基于规则的隐私条款分析（fallback）
    enhancedRuleBasedPrivacyAnalysis(privacyText) {
        console.log('使用增强规则引擎分析隐私条款');
        return this.fallbackAnalyzer.analyzePrivacyPolicy(privacyText);
    }
    
    // 增强的基于规则的配置文件分析（fallback）
    enhancedRuleBasedConfigAnalysis(configData, platform) {
        console.log('使用增强规则引擎分析配置文件');
        return this.fallbackAnalyzer.analyzeConfigFile(configData, platform);
    }
    
    // 配置LLM
    configure(config) {
        this.config = { ...this.config, ...config };
        console.log('LLM配置已更新:', {
            provider: this.config.provider,
            model: this.config.model,
            hasApiKey: !!this.config.apiKey
        });
    }
    
    // 测试LLM连接
    async testConnection() {
        if (this.config.provider === 'none' || !this.config.apiKey) {
            return {
                success: false,
                message: '未配置LLM API密钥'
            };
        }
        
        try {
            const testPrompt = {
                system: '你是一个测试助手。',
                user: '请回复"连接成功"'
            };
            
            const response = await this.callLLM(testPrompt);
            
            return {
                success: true,
                message: 'LLM连接测试成功',
                response: response
            };
        } catch (error) {
            return {
                success: false,
                message: `LLM连接测试失败: ${error.message}`,
                error: error
            };
        }
    }
}

// LLM配置管理器
class LLMConfigManager {
    constructor() {
        this.storageKey = 'privacy_analyzer_llm_config';
        this.config = this.loadConfig();
    }
    
    // 加载配置
    loadConfig() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('加载LLM配置失败:', error);
        }
        
        return {
            provider: 'none',
            apiKey: '',
            apiEndpoint: '',
            model: 'gpt-4',
            temperature: 0.3,
            maxTokens: 2000
        };
    }
    
    // 保存配置
    saveConfig(config) {
        try {
            this.config = { ...this.config, ...config };
            localStorage.setItem(this.storageKey, JSON.stringify(this.config));
            return true;
        } catch (error) {
            console.error('保存LLM配置失败:', error);
            return false;
        }
    }
    
    // 获取配置
    getConfig() {
        return { ...this.config };
    }
    
    // 清除配置
    clearConfig() {
        try {
            localStorage.removeItem(this.storageKey);
            this.config = {
                provider: 'none',
                apiKey: '',
                apiEndpoint: '',
                model: 'gpt-4',
                temperature: 0.3,
                maxTokens: 2000
            };
            return true;
        } catch (error) {
            console.error('清除LLM配置失败:', error);
            return false;
        }
    }
}

// 导出
window.LLMPrivacyAnalyzer = LLMPrivacyAnalyzer;
window.LLMConfigManager = LLMConfigManager;
