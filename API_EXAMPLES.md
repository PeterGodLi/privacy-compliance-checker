# LLM API 使用示例

## 📚 目录

1. [OpenAI API](#openai-api)
2. [Azure OpenAI API](#azure-openai-api)
3. [智谱AI API](#智谱ai-api)
4. [测试代码](#测试代码)
5. [错误处理](#错误处理)

---

## OpenAI API

### 获取API密钥

1. 访问 [OpenAI Platform](https://platform.openai.com/)
2. 注册/登录账号
3. 进入 API Keys 页面
4. 点击 "Create new secret key"
5. 复制生成的密钥（格式：`sk-...`）

### 配置示例

```javascript
const config = {
  provider: 'openai',
  apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  model: 'gpt-4',
  temperature: 0.3,
  maxTokens: 2000
};
```

### 直接调用示例

```javascript
// 使用 fetch 调用 OpenAI API
async function callOpenAI(prompt) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '你是一个隐私合规分析专家'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}
```

### Prompt示例

```javascript
const privacyPolicyPrompt = `
请分析以下隐私条款，识别所有信息收集行为：

${privacyText}

请以JSON格式输出：
{
  "collections": [
    {
      "infoType": "location",
      "infoTypeName": "位置信息",
      "scenarios": ["地图导航", "附近服务"],
      "purposes": ["提供位置服务"],
      "methods": ["GPS定位"],
      "confidence": 0.95
    }
  ]
}
`;
```

### 定价参考（2024年）

| 模型 | 输入价格 | 输出价格 |
|------|---------|---------|
| GPT-4 | $30/1M tokens | $60/1M tokens |
| GPT-4 Turbo | $10/1M tokens | $30/1M tokens |
| GPT-3.5-turbo | $0.5/1M tokens | $1.5/1M tokens |

---

## Azure OpenAI API

### 获取API密钥

1. 登录 [Azure Portal](https://portal.azure.com/)
2. 创建 Azure OpenAI 资源
3. 进入"密钥和终结点"页面
4. 复制密钥和端点URL
5. 部署模型（如 gpt-4）

### 配置示例

```javascript
const config = {
  provider: 'azure',
  apiKey: 'your-azure-api-key-here',
  apiEndpoint: 'https://your-resource-name.openai.azure.com/openai/deployments/your-deployment-name/chat/completions?api-version=2024-02-15-preview',
  model: 'gpt-4',
  temperature: 0.3,
  maxTokens: 2000
};
```

### 直接调用示例

```javascript
async function callAzureOpenAI(prompt) {
  const response = await fetch(apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey  // 注意：Azure 使用 'api-key' 而非 'Authorization'
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: '你是一个隐私合规分析专家'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}
```

### API版本

- 最新版本：`2024-02-15-preview`
- 稳定版本：`2023-05-15`

### 定价参考

- 与OpenAI类似，具体价格见Azure定价页面
- 支持预付费和按量付费

---

## 智谱AI API

### 获取API密钥

1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册/登录账号
3. 进入"API密钥"页面
4. 创建新的API Key
5. 复制密钥

### 配置示例

```javascript
const config = {
  provider: 'zhipu',
  apiKey: 'your-zhipu-api-key.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  model: 'glm-4',
  temperature: 0.3,
  maxTokens: 2000
};
```

### 直接调用示例

```javascript
async function callZhipuAI(prompt) {
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'glm-4',
      messages: [
        {
          role: 'system',
          content: '你是一个隐私合规分析专家'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })
  });
  
  const data = await response.json();
  return data.choices[0].message.content;
}
```

### 模型选择

| 模型 | 说明 | 适用场景 |
|------|------|---------|
| glm-4 | 最新旗舰模型 | 复杂分析、高精度需求 |
| glm-3-turbo | 快速版本 | 快速分析、大批量处理 |

### 定价参考（2024年）

| 模型 | 价格 |
|------|------|
| GLM-4 | ¥0.1/千tokens |
| GLM-3-turbo | ¥0.005/千tokens |

---

## 测试代码

### 完整测试示例

```javascript
// 测试OpenAI连接
async function testOpenAI() {
  const analyzer = new LLMPrivacyAnalyzer({
    provider: 'openai',
    apiKey: 'sk-your-api-key',
    model: 'gpt-3.5-turbo'
  });
  
  const result = await analyzer.testConnection();
  console.log('OpenAI测试结果:', result);
}

// 测试智谱AI连接
async function testZhipuAI() {
  const analyzer = new LLMPrivacyAnalyzer({
    provider: 'zhipu',
    apiKey: 'your-zhipu-api-key',
    model: 'glm-4'
  });
  
  const result = await analyzer.testConnection();
  console.log('智谱AI测试结果:', result);
}

// 分析隐私条款
async function analyzePrivacyPolicy() {
  const analyzer = new LLMPrivacyAnalyzer({
    provider: 'openai',
    apiKey: 'sk-your-api-key',
    model: 'gpt-4'
  });
  
  const privacyText = `
    我们会收集您的位置信息用于提供基于位置的服务，
    包括地图导航、附近的人等功能。同时，我们也会
    收集您的联系方式（手机号、邮箱）用于账户注册和验证。
  `;
  
  const collections = await analyzer.analyzePrivacyPolicy(privacyText);
  console.log('分析结果:', collections);
}

// 分析配置文件
async function analyzeConfigFile() {
  const analyzer = new LLMPrivacyAnalyzer({
    provider: 'zhipu',
    apiKey: 'your-zhipu-api-key',
    model: 'glm-4'
  });
  
  const configData = {
    platform: 'Android',
    permissions: [
      {
        key: 'android.permission.CAMERA',
        name: '相机权限',
        type: 'camera',
        description: '访问相机'
      },
      {
        key: 'android.permission.ACCESS_FINE_LOCATION',
        name: '位置权限',
        type: 'location',
        description: '访问精确位置'
      }
    ]
  };
  
  const collections = await analyzer.analyzeConfigFile(configData, 'android');
  console.log('分析结果:', collections);
}
```

### 浏览器控制台测试

```javascript
// 在浏览器控制台中运行

// 1. 测试连接
const analyzer = new LLMPrivacyAnalyzer({
  provider: 'zhipu',
  apiKey: 'your-api-key',
  model: 'glm-4'
});

await analyzer.testConnection();

// 2. 分析简单文本
const result = await analyzer.analyzePrivacyPolicy('我们会收集您的位置信息');
console.log(result);
```

---

## 错误处理

### 常见错误

#### 1. 认证错误

```javascript
// 错误信息
{
  error: {
    message: "Incorrect API key provided",
    type: "invalid_request_error",
    code: "invalid_api_key"
  }
}

// 解决方案
- 检查API密钥是否正确
- 确认密钥未过期
- 检查密钥是否有足够的配额
```

#### 2. CORS错误

```javascript
// 错误信息
Access to fetch at 'https://api.openai.com/...' from origin 'http://localhost' 
has been blocked by CORS policy

// 解决方案
1. 使用浏览器扩展（如CORS Unblock）
2. 设置API服务的CORS白名单
3. 使用代理服务器
```

#### 3. 速率限制

```javascript
// 错误信息
{
  error: {
    message: "Rate limit exceeded",
    type: "rate_limit_error"
  }
}

// 解决方案
- 降低请求频率
- 升级API套餐
- 添加请求重试逻辑
```

#### 4. 超时错误

```javascript
// 错误信息
TimeoutError: Request timeout after 30000ms

// 解决方案
- 增加超时时间配置
- 检查网络连接
- 尝试使用更快的模型
```

### 错误处理最佳实践

```javascript
async function safeAnalyze(analyzer, text) {
  try {
    const result = await analyzer.analyzePrivacyPolicy(text);
    return { success: true, data: result };
  } catch (error) {
    console.error('分析失败:', error);
    
    // 根据错误类型返回不同的fallback
    if (error.message.includes('API key')) {
      return { 
        success: false, 
        error: 'API密钥错误，请检查配置',
        fallback: '使用规则引擎'
      };
    } else if (error.message.includes('Rate limit')) {
      return {
        success: false,
        error: '请求过于频繁，请稍后重试',
        fallback: '等待1分钟后重试'
      };
    } else {
      return {
        success: false,
        error: `未知错误: ${error.message}`,
        fallback: '使用规则引擎'
      };
    }
  }
}
```

### 重试逻辑

```javascript
async function analyzeWithRetry(analyzer, text, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await analyzer.analyzePrivacyPolicy(text);
    } catch (error) {
      console.warn(`尝试 ${i + 1}/${maxRetries} 失败:`, error);
      
      if (i === maxRetries - 1) {
        throw error;
      }
      
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

---

## 💡 使用建议

### 1. 选择合适的模型

| 需求 | 推荐模型 | 理由 |
|------|---------|------|
| 高精度 | GPT-4 / GLM-4 | 理解能力强 |
| 快速测试 | GPT-3.5-turbo / GLM-3-turbo | 速度快，成本低 |
| 大批量 | GLM-3-turbo | 性价比高 |

### 2. Prompt优化

```javascript
// 好的Prompt
const goodPrompt = `
请分析以下隐私条款，识别信息收集行为。
要求：
1. 提取信息类型（如：位置、联系方式）
2. 识别使用场景（如：导航、注册）
3. 说明收集目的
4. 以JSON格式输出

隐私条款：
${text}
`;

// 差的Prompt
const badPrompt = `分析这个: ${text}`;
```

### 3. 成本控制

```javascript
// 使用缓存避免重复分析
const cache = new Map();

async function cachedAnalyze(text) {
  const hash = hashCode(text);
  
  if (cache.has(hash)) {
    console.log('使用缓存结果');
    return cache.get(hash);
  }
  
  const result = await analyzer.analyzePrivacyPolicy(text);
  cache.set(hash, result);
  return result;
}
```

---

## 📞 获取帮助

- **OpenAI文档**: https://platform.openai.com/docs
- **Azure文档**: https://learn.microsoft.com/azure/ai-services/openai/
- **智谱AI文档**: https://open.bigmodel.cn/dev/api

---

**最后更新**: 2025-11-26
