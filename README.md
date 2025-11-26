# 多平台应用隐私合规检查工具

> 🤖 **新功能**：现已支持大模型（LLM）智能分析！[查看LLM集成指南](./LLM_INTEGRATION_GUIDE.md)
> 
> 🚀 **快速开始**：[5分钟快速上手](./QUICKSTART.md)

一个用于检测应用收集信息是否与隐私条款一致的Web工具，支持iOS、macOS、Android、Windows、鸿蒙OS五大平台。

## 功能特性

- ✅ **多平台支持**: 支持iOS/iPadOS、macOS、Android、Windows四大平台
- ✅ **智能解析**: 自动解析Info.plist、AndroidManifest.xml、AppxManifest.xml配置文件
- ✅ **权限分析**: 智能识别应用权限声明并与隐私条款进行对比
- ✅ **合规检测**: 自动检测权限声明与隐私条款的一致性
- ✅ **详细报告**: 生成详细的合规分析报告和改进建议
- ✅ **现代界面**: 美观易用的现代化Web界面

## 使用方法

### 1. 打开工具
直接在浏览器中打开 `index.html` 文件即可使用。

### 2. 选择平台
- 选择要检测的目标平台（iOS、macOS、Android、Windows或全部平台）
- 系统会根据选择的平台调整应用列表和文件类型提示

### 3. 输入应用信息
- **应用名称**: 手动输入应用名称（如：微信、抖音、Safari等）
- **应用选择**: 或从预置的应用列表中选择
- **隐私条款URL**: 输入应用的隐私条款链接（可选）

### 4. 上传配置文件
根据平台上传对应的配置文件：
- **iOS/macOS**: Info.plist
- **Android**: AndroidManifest.xml  
- **Windows**: AppxManifest.xml

支持以下上传方式：
- 点击"选择文件"按钮
- 直接拖拽文件到上传区域
- 点击"自动获取"按钮（开发中）

### 5. 开始分析
点击"开始分析"按钮，系统将：
1. 解析上传的配置文件，提取权限声明
2. 获取并分析隐私条款内容
3. 对比权限声明与隐私条款的一致性
4. 生成详细的合规分析报告

### 6. 查看结果
分析完成后，系统会显示：
- **合规性概览**: 合规项目、违规项目、缺失项目统计
- **权限详情**: 每个权限的详细分析结果
- **改进建议**: 针对发现问题的具体改进建议

## 🤖 大模型集成功能

### 什么是LLM智能分析？

本工具已集成大模型（LLM）能力，可以更准确地：
- 📖 **理解复杂隐私条款**：深度语义理解，识别隐含信息
- 🎯 **精准识别收集行为**：自动提取信息类型、场景、目的
- 📊 **生成格式化清单**：结构化展示双源对比结果
- 💡 **智能建议**：提供合规改进建议

### 支持的LLM提供商

1. **OpenAI** (GPT-4, GPT-3.5-turbo)
2. **Azure OpenAI** (企业级)
3. **智谱AI** (GLM-4, 国产推荐)

### 快速开始

1. 点击页面顶部的 **"LLM配置"** 按钮
2. 选择LLM提供商并输入API密钥
3. 保存配置并测试连接
4. 返回主页面开始使用智能分析

**详细教程**：[查看LLM集成完整指南](./LLM_INTEGRATION_GUIDE.md)

### 无需LLM也能使用

即使不配置LLM，工具仍然使用增强的规则引擎提供准确分析！

---

## 支持的权限类型

### iOS/macOS权限
- 相机权限 (NSCameraUsageDescription)
- 麦克风权限 (NSMicrophoneUsageDescription)
- 位置权限 (NSLocationWhenInUseUsageDescription)
- 通讯录权限 (NSContactsUsageDescription)
- 相册权限 (NSPhotoLibraryUsageDescription)
- 日历权限 (NSCalendarsUsageDescription)
- 健康数据权限 (NSHealthShareUsageDescription)
- Face ID权限 (NSFaceIDUsageDescription)
- 语音识别权限 (NSSpeechRecognitionUsageDescription)
- 等更多...

### Android权限
- 相机权限 (android.permission.CAMERA)
- 麦克风权限 (android.permission.RECORD_AUDIO)
- 位置权限 (android.permission.ACCESS_FINE_LOCATION)
- 通讯录权限 (android.permission.READ_CONTACTS)
- 存储权限 (android.permission.READ_EXTERNAL_STORAGE)
- 电话权限 (android.permission.READ_PHONE_STATE)
- 短信权限 (android.permission.READ_SMS)
- 生物识别权限 (android.permission.USE_BIOMETRIC)
- 等更多...

### Windows权限
- 摄像头权限 (webcam)
- 麦克风权限 (microphone)
- 位置权限 (location)
- 文档库权限 (documentsLibrary)
- 图片库权限 (picturesLibrary)
- 网络权限 (internetClient)
- 蓝牙权限 (bluetooth)
- 等更多...

## 技术架构

### 前端技术
- **HTML5**: 现代化的页面结构
- **CSS3**: 响应式设计和现代化样式
- **JavaScript ES6+**: 模块化的前端逻辑
- **Font Awesome**: 图标库

### 核心模块
- **ConfigParser**: 配置文件解析器
  - PlistParser: iOS/macOS Info.plist解析
  - AndroidManifestParser: Android清单文件解析
  - AppxManifestParser: Windows应用清单解析
  - HarmonyOSConfigParser: 鸿蒙OS config.json解析
- **PermissionAnalyzer**: 权限分析器
  - 权限对比分析
  - 合规性检测
  - 报告生成
- **InfoCollectionAnalyzer**: 信息收集分析器
  - 隐私条款解析
  - 配置文件权限映射
  - 双源对比清单生成
- **LLMPrivacyAnalyzer**: LLM智能分析器 ⭐ 新增
  - 大模型驱动的语义理解
  - 智能信息提取
  - 自动fallback到规则引擎

## 文件结构

```
20251125个保隐私/
├── index.html              # 主页面
├── llm-config-ui.html      # LLM配置页面 ⭐ 新增
├── styles.css              # 样式文件
├── script.js               # 主要JavaScript逻辑
├── parser.js               # 配置文件解析器
├── app-detector.js         # 应用检测器
├── info-collector.js       # 信息收集分析器
├── llm-analyzer.js         # LLM智能分析器 ⭐ 新增
├── README.md               # 项目说明
└── LLM_INTEGRATION_GUIDE.md # LLM集成指南 ⭐ 新增
```

## 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 注意事项

1. **文件格式**: 确保上传的配置文件格式正确且未损坏
2. **隐私条款**: 由于浏览器CORS限制，目前使用模拟数据进行分析
3. **权限识别**: 工具会尽可能识别常见权限，但可能无法覆盖所有自定义权限
4. **分析结果**: 分析结果仅供参考，最终合规性判断请咨询法律专业人士

## 开发计划

### 已完成 ✅
- ✅ 集成大模型（LLM）智能分析
- ✅ 双源信息收集清单对比
- ✅ 支持鸿蒙OS平台
- ✅ 增强UI交互体验
- ✅ 完整的LLM配置界面

### 进行中 🔄
- 🔄 集成真实的隐私条款获取API
- 🔄 本地LLM支持（基于WebGPU）

### 计划中 📋
- 📋 支持更多LLM提供商（Claude、文心一言等）
- 📋 批量文件分析功能
- 📋 分析历史记录
- 📋 报告导出功能（JSON、Excel、PDF）
- 📋 自定义权限规则配置
- 📋 权限风险等级评估

## 许可证

本项目仅供学习和研究使用。

## 联系方式

如有问题或建议，请通过以下方式联系：
- 邮箱: support@example.com
- 项目地址: https://github.com/example/privacy-compliance-checker# privacy-compliance-checker
