# 大模型（LLM）集成使用指南

## 📋 概述

本工具已集成大模型（LLM）能力，可以更准确、智能地识别隐私条款和配置文件中的信息收集清单。

## ✨ 功能特性

### 1. 智能识别隐私条款
- **深度语义理解**：理解复杂的隐私条款表述
- **隐含信息提取**：识别未明确说明的收集行为
- **上下文分析**：提取相关的使用场景和目的
- **置信度评估**：为每项识别结果提供可信度评分

### 2. 精准解析配置文件
- **跨平台支持**：iOS、Android、Windows、鸿蒙OS
- **权限映射**：将系统权限映射到具体信息类型
- **场景推断**：根据权限推断可能的使用场景
- **风险评估**：识别高风险权限声明

### 3. 格式化清单输出
- **结构化展示**：双源对比清单（隐私条款 vs 配置文件）
- **详细信息**：包含场景、目的、方式等多维度信息
- **可视化标识**：清晰的图标和颜色编码
- **可导出**：支持导出为JSON、Excel等格式

## 🚀 快速开始

### 第一步：配置LLM API

1. **访问配置页面**
   - 点击页面顶部的 "LLM配置" 按钮
   - 或直接访问 `llm-config-ui.html`

2. **选择提供商**
   - OpenAI（推荐GPT-4）
   - Azure OpenAI（企业级）
   - 智谱AI（国产，性价比高）

3. **输入API密钥**
   - 从对应平台获取API密钥
   - 输入到配置界面
   - 点击"保存配置"

4. **测试连接**
   - 点击"测试连接"按钮
   - 确认API配置正确

### 第二步：使用LLM分析

配置完成后，返回主页面，正常使用分析功能：

1. 输入应用信息
2. 上传配置文件
3. 点击"开始分析"

系统会自动使用LLM进行深度分析，生成详细清单。

## 🔧 支持的LLM提供商

### OpenAI

**优势：**
- 强大的自然语言理解能力
- 优秀的中文支持
- 丰富的API功能

**配置信息：**
- 注册地址：https://platform.openai.com/
- 推荐模型：`gpt-4`, `gpt-3.5-turbo`
- API文档：https://platform.openai.com/docs

**示例配置：**
```json
{
  "provider": "openai",
  "apiKey": "sk-xxxxxxxxxxxxxxxx",
  "model": "gpt-4",
  "temperature": 0.3,
  "maxTokens": 2000
}
```

### Azure OpenAI

**优势：**
- 企业级SLA保障
- 数据隐私保护
- 中国区可用

**配置信息：**
- 服务地址：https://azure.microsoft.com/zh-cn/products/ai-services/openai-service
- 推荐模型：`gpt-4`, `gpt-35-turbo`
- 需要Azure订阅

**示例配置：**
```json
{
  "provider": "azure",
  "apiKey": "your-azure-api-key",
  "apiEndpoint": "https://your-resource.openai.azure.com/openai/deployments/your-deployment/chat/completions?api-version=2024-02-15-preview",
  "model": "gpt-4"
}
```

### 智谱AI（GLM）

**优势：**
- 国产大模型，中文理解出色
- 价格实惠
- 国内访问稳定，无需代理

**配置信息：**
- 注册地址：https://open.bigmodel.cn/
- 推荐模型：`glm-4`, `glm-3-turbo`
- API文档：https://open.bigmodel.cn/dev/api

**示例配置：**
```json
{
  "provider": "zhipu",
  "apiKey": "your-zhipu-api-key",
  "model": "glm-4",
  "temperature": 0.3,
  "maxTokens": 2000
}
```

## 📊 分析结果说明

### 隐私条款解析结果

```json
{
  "infoType": "location",
  "infoTypeName": "位置信息",
  "scenarios": ["地图导航", "附近服务", "位置分享"],
  "purposes": ["提供位置服务", "个性化推荐"],
  "methods": ["传感器获取", "GPS定位"],
  "description": "我们会收集您的地理位置信息用于提供基于位置的服务",
  "context": "...原文相关段落...",
  "confidence": 0.95
}
```

### 配置文件解析结果

```json
{
  "infoType": "location",
  "infoTypeName": "位置信息",
  "scenarios": ["精确定位"],
  "purposes": ["位置相关服务"],
  "methods": ["传感器获取"],
  "permission": "android.permission.ACCESS_FINE_LOCATION",
  "description": "精确位置权限",
  "platform": "Android",
  "confidence": 0.9
}
```

### 字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `infoType` | 信息类型标识 | `location`, `contact`, `biometric` |
| `infoTypeName` | 中文名称 | "位置信息", "联系方式" |
| `scenarios` | 使用场景 | ["地图导航", "附近服务"] |
| `purposes` | 收集目的 | ["提供位置服务"] |
| `methods` | 收集方式 | ["传感器获取", "用户主动提供"] |
| `description` | 详细描述 | 从原文提取的描述性文字 |
| `context` | 上下文 | 相关的原文片段 |
| `permission` | 权限名称 | `android.permission.CAMERA` |
| `platform` | 平台标识 | `Android`, `iOS`, `Windows` |
| `confidence` | 置信度 | 0.0 - 1.0 |

## 🔐 隐私与安全

### 数据存储

- **API密钥**：仅存储在浏览器的 `localStorage` 中
- **分析数据**：不会被保存或上传到任何服务器
- **请求路径**：浏览器 → LLM服务商（直连）

### 安全建议

1. **定期更换密钥**：建议每月更换一次API密钥
2. **使用子账号**：为本工具创建专用的API子账号
3. **设置配额限制**：在API提供商处设置使用额度
4. **清除本地配置**：使用完毕后可清除本地配置

### CORS说明

由于浏览器的同源策略限制，部分API可能需要配置CORS：

- **OpenAI**：默认支持跨域请求
- **Azure OpenAI**：需要在Azure门户配置CORS
- **智谱AI**：默认支持跨域请求

如遇到CORS错误，请：
1. 使用浏览器扩展（如CORS Unblock）
2. 配置API服务的CORS白名单
3. 使用代理服务器

## 💰 成本估算

### OpenAI定价（2024年参考）

| 模型 | 输入价格 | 输出价格 | 单次分析成本 |
|------|---------|---------|-------------|
| GPT-4 | $30/1M tokens | $60/1M tokens | ~$0.05-0.15 |
| GPT-3.5-turbo | $0.5/1M tokens | $1.5/1M tokens | ~$0.001-0.005 |

### Azure OpenAI定价

与OpenAI类似，具体价格参考Azure定价页面。

### 智谱AI定价（2024年参考）

| 模型 | 价格 | 单次分析成本 |
|------|------|-------------|
| GLM-4 | ¥0.1/1K tokens | ~¥0.02-0.05 |
| GLM-3-turbo | ¥0.005/1K tokens | ~¥0.001-0.003 |

**注意**：以上价格仅供参考，请以各平台实际价格为准。

## 🎯 最佳实践

### 1. 模型选择

- **高精度需求**：选择 GPT-4 或 GLM-4
- **快速测试**：选择 GPT-3.5-turbo 或 GLM-3-turbo
- **成本敏感**：选择智谱AI的模型

### 2. 参数调优

```javascript
{
  "temperature": 0.3,    // 较低值 = 更确定的输出
  "maxTokens": 2000,     // 根据文本长度调整
  "timeout": 30000       // 超时时间（毫秒）
}
```

### 3. Fallback机制

当LLM不可用时，系统会自动回退到基于规则的引擎：

```
LLM分析（优先） → 规则引擎（Fallback） → 基础解析（保底）
```

### 4. 批量分析

如需分析多个应用，建议：

1. 先使用快速测试验证配置
2. 设置合理的API配额
3. 错峰使用以避免速率限制

## ❓ 常见问题

### Q1: 为什么LLM分析比规则引擎慢？

**A:** LLM需要进行网络请求和复杂的推理计算，通常需要5-15秒。相比之下，规则引擎是本地计算，响应更快。

### Q2: LLM分析失败怎么办？

**A:** 系统会自动回退到规则引擎。您可以：
1. 检查API密钥是否正确
2. 测试网络连接
3. 查看浏览器控制台的错误信息

### Q3: 如何提高分析准确度？

**A:** 
1. 使用更高级的模型（如GPT-4）
2. 提供完整的隐私条款文本
3. 上传准确的配置文件

### Q4: 数据会被LLM服务商保存吗？

**A:** 
- **OpenAI**：默认情况下API请求数据会被保留30天用于监控
- **Azure OpenAI**：不会保存请求数据（企业SLA）
- **智谱AI**：请参考其隐私政策

建议使用企业版或专业版服务以获得更好的数据保护。

### Q5: 可以在没有LLM的情况下使用吗？

**A:** 完全可以！不配置LLM时，系统使用增强的规则引擎，仍然能提供准确的分析结果。

## 🔄 版本更新

### v1.0.0 (2025-11-26)
- ✅ 集成OpenAI、Azure OpenAI、智谱AI
- ✅ 隐私条款智能解析
- ✅ 配置文件精准识别
- ✅ 双源对比清单生成
- ✅ 可视化配置界面

### 未来计划
- 🔜 支持更多LLM提供商（Claude、文心一言等）
- 🔜 本地模型支持（基于WebGPU）
- 🔜 批量分析功能
- 🔜 分析历史记录
- 🔜 导出功能增强

## 📞 技术支持

如遇到问题或有建议，请：

1. 查看浏览器控制台的详细错误信息
2. 检查API配置是否正确
3. 尝试使用"快速测试"功能验证

---

**最后更新**：2025-11-26  
**维护者**：Privacy Compliance Team
