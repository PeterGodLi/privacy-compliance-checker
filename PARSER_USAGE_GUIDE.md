# 配置文件解析器使用指南

## 🎯 快速开始

### 1. 准备配置文件

在 `examples/` 目录中提供了示例文件：

- `Info-example.plist` - iOS示例（包含13个权限）
- `AndroidManifest-enhanced.xml` - Android示例（包含24个权限）
- `AppxManifest-sample.xml` - Windows示例
- `config-sample.json` - 鸿蒙OS示例

### 2. 上传配置文件

1. 打开应用主页面
2. 选择平台（或使用"全部平台"）
3. 输入应用名称
4. 点击"选择文件"或拖拽文件到上传区域
5. 支持同时上传多个平台的配置文件

### 3. 开始分析

点击"开始分析"按钮，系统将：

1. ✅ 自动识别每个文件的平台类型
2. ✅ 解析配置文件中的所有权限
3. ✅ 生成质量分数(0-100分)
4. ✅ 提取应用信息
5. ✅ 识别敏感权限
6. ✅ 推断使用场景

## 📊 解析结果说明

### 配置文件中声明的权限清单

显示在蓝色区域，包含以下信息：

| 列名 | 说明 | 示例 |
|------|------|------|
| 权限标识 | 完整的系统权限名称 | `android.permission.CAMERA` |
| 对应信息类型 | 易读的中文名称 | 相机权限 |
| 权限描述 | 开发者提供的说明文字 | 我们需要访问您的相机以拍照和录制视频 |
| 平台 | 所属平台 | Android / iOS / macOS / Windows |
| 使用场景 | 自动推断的典型使用场景 | 拍照录像、扫码、视频通话 |

### 解析质量分数

系统会为每个配置文件打分（满分100分）：

- **90-100分**: 优秀 - 权限完整、信息齐全
- **70-89分**: 良好 - 基本满足要求
- **50-69分**: 一般 - 部分信息缺失
- **0-49分**: 需改进 - 信息严重不足

评分维度：
- 权限数量 (0-40分): 检测到的权限越多得分越高
- 应用信息完整性 (0-30分): bundleId、version等字段
- 平台识别准确性 (0-30分): 是否准确识别平台

## 🔍 支持的权限类型

### iOS/macOS (40+ 种权限)

#### 基础权限
- ✅ Camera - 相机
- ✅ Microphone - 麦克风
- ✅ Location (WhenInUse/Always) - 位置
- ✅ Photos - 相册
- ✅ Contacts - 通讯录
- ✅ Calendar - 日历
- ✅ Reminders - 提醒事项
- ✅ Health - 健康数据
- ✅ Face ID - 面容识别
- ✅ Speech Recognition - 语音识别
- ✅ Media Library - 媒体库

#### iOS 14+ 新增权限
- ✅ User Tracking (ATT) - 用户追踪
- ✅ Local Network - 本地网络
- ✅ Nearby Interaction - 近场交互
- ✅ Focus Status - 专注状态

#### macOS 专属权限
- ✅ Desktop Folder - 桌面文件夹
- ✅ Documents Folder - 文档文件夹
- ✅ Downloads Folder - 下载文件夹
- ✅ Network Volumes - 网络卷
- ✅ Removable Volumes - 可移动存储
- ✅ System Administration - 系统管理

#### 后台模式
- ✅ Audio - 后台音频
- ✅ Location - 后台定位
- ✅ VoIP - 网络电话
- ✅ Fetch - 后台获取
- ✅ Remote Notification - 远程通知
- ✅ Processing - 后台处理

### Android (30+ 种权限)

#### 危险权限 (Dangerous Permissions)
- ✅ CAMERA - 相机
- ✅ RECORD_AUDIO - 麦克风
- ✅ ACCESS_FINE_LOCATION - 精确位置
- ✅ ACCESS_COARSE_LOCATION - 大致位置
- ✅ ACCESS_BACKGROUND_LOCATION - 后台位置
- ✅ READ_CONTACTS / WRITE_CONTACTS - 通讯录
- ✅ READ_EXTERNAL_STORAGE / WRITE_EXTERNAL_STORAGE - 存储
- ✅ READ_PHONE_STATE - 手机状态
- ✅ CALL_PHONE - 拨打电话
- ✅ READ_SMS / SEND_SMS - 短信
- ✅ READ_CALENDAR / WRITE_CALENDAR - 日历
- ✅ BODY_SENSORS - 传感器
- ✅ USE_BIOMETRIC - 生物识别

#### 普通权限 (Normal Permissions)
- ✅ INTERNET - 网络
- ✅ ACCESS_NETWORK_STATE - 网络状态
- ✅ ACCESS_WIFI_STATE - WiFi状态
- ✅ BLUETOOTH / BLUETOOTH_ADMIN - 蓝牙
- ✅ VIBRATE - 振动
- ✅ WAKE_LOCK - 唤醒锁

#### 硬件特性 (Features)
- ✅ android.hardware.camera - 相机硬件
- ✅ android.hardware.location.gps - GPS
- ✅ android.hardware.microphone - 麦克风硬件
- ✅ android.hardware.bluetooth - 蓝牙硬件
- ✅ android.hardware.touchscreen - 触摸屏

### Windows (15+ 种权限)

#### Capability
- ✅ internetClient - 网络客户端
- ✅ internetClientServer - 网络服务器
- ✅ privateNetworkClientServer - 私有网络
- ✅ documentsLibrary - 文档库
- ✅ picturesLibrary - 图片库
- ✅ videosLibrary - 视频库
- ✅ musicLibrary - 音乐库
- ✅ removableStorage - 可移动存储

#### DeviceCapability
- ✅ webcam - 摄像头
- ✅ microphone - 麦克风
- ✅ location - 位置
- ✅ bluetooth - 蓝牙
- ✅ proximity - 近距离通信

### 鸿蒙OS (20+ 种权限)

- ✅ ohos.permission.CAMERA - 相机
- ✅ ohos.permission.MICROPHONE - 麦克风
- ✅ ohos.permission.LOCATION - 位置
- ✅ ohos.permission.READ_MEDIA - 媒体读取
- ✅ ohos.permission.WRITE_MEDIA - 媒体写入
- ✅ ohos.permission.INTERNET - 网络
- ✅ ohos.permission.READ_CONTACTS - 通讯录读取
- ✅ ohos.permission.READ_CALENDAR - 日历读取
- ✅ ohos.permission.USE_BLUETOOTH - 蓝牙
- ✅ ohos.permission.READ_HEALTH_DATA - 健康数据

## 🎨 UI展示位置

### 1. 配置文件详情区域

位于"双源信息解析对比"部分的蓝色区域：

```
┌─────────────────────────────────────────────┐
│ 📄 配置文件中声明的权限清单 (X 项)         │
├─────────────────────────────────────────────┤
│ 权限标识 | 信息类型 | 描述 | 平台 | 场景     │
│─────────────────────────────────────────────│
│ android.permission.CAMERA                   │
│ 相机权限 | 访问相机 | Android              │
│ 拍照录像、扫码、视频通话                    │
└─────────────────────────────────────────────┘
```

### 2. 综合信息收集清单

位于下方，显示隐私条款与配置文件的对比：

```
┌─────────────────────────────────────────────┐
│ 📋 综合信息收集清单                         │
├─────────────────────────────────────────────┤
│ 信息类型 | 来源对比 | 场景 | 目的 | 状态    │
│─────────────────────────────────────────────│
│ 📷 相机 | 隐私条款✓ 配置文件✓ | 一致 ✅   │
│ 🎤 麦克风 | 隐私条款✓ 配置文件✓ | 一致 ✅  │
│ 📍 位置 | 仅配置文件 | 需补充说明 ⚠️       │
└─────────────────────────────────────────────┘
```

## ⚡ 高级功能

### 1. 批量解析

支持同时上传多个平台的配置文件：

```
✓ Info.plist (iOS) - 13个权限
✓ AndroidManifest.xml (Android) - 24个权限
✓ AppxManifest.xml (Windows) - 8个权限
```

系统会自动识别并分别解析。

### 2. 智能场景推断

根据权限类型自动推断典型使用场景：

- **相机**: 拍照录像、扫码、视频通话
- **麦克风**: 语音消息、语音通话、语音识别
- **位置**: 位置分享、地图导航、附近推荐
- **通讯录**: 添加好友、通讯录同步

### 3. 敏感权限标记

自动标记敏感权限，在结果中高亮显示：

- 🔴 Camera (相机)
- 🔴 Microphone (麦克风)
- 🔴 Location (位置)
- 🔴 Contacts (通讯录)
- 🔴 Health (健康数据)
- 🔴 Biometric (生物识别)
- 🔴 Tracking (用户追踪)

### 4. 平台特定建议

针对不同平台提供专业建议：

#### iOS平台
- 所有权限描述文字清晰易懂
- 避免使用技术术语
- 符合Apple审核指南
- ATT权限单独详细说明

#### Android平台
- 区分Normal和Dangerous权限
- Dangerous权限运行时申请
- 提供详细的权限用途说明

#### Windows平台
- Capability声明合理性
- DeviceCapability必要性说明

#### 鸿蒙OS平台
- reason字段填写完整
- 敏感权限审慎使用

## 🐛 常见问题

### Q1: 文件解析失败怎么办？

**可能原因：**
- 文件格式错误（XML格式不正确）
- 文件编码问题（非UTF-8编码）
- 文件内容不完整

**解决方法：**
1. 检查文件是否是有效的XML/JSON/plist
2. 使用文本编辑器打开检查编码
3. 确保文件内容完整

### Q2: 质量分数太低怎么办？

**提升方法：**
1. 添加更多必要权限声明
2. 完善应用信息字段（bundleId、version等）
3. 确保文件格式正确

### Q3: 权限没有被识别？

**可能原因：**
- 权限名称拼写错误
- 使用了自定义权限
- 权限类型暂不支持

**解决方法：**
1. 检查权限名称拼写
2. 参考官方文档使用标准权限
3. 查看控制台日志获取详细信息

### Q4: 如何查看解析统计？

打开浏览器开发者工具（F12），在Console中可以看到：

```javascript
{
    totalParsed: 3,
    successCount: 3,
    failureCount: 0,
    successRate: "100%",
    parseHistory: [...]
}
```

## 📚 最佳实践

### 1. 文件命名规范

建议使用标准文件名：
- ✅ `Info.plist` (iOS/macOS)
- ✅ `AndroidManifest.xml` (Android)
- ✅ `AppxManifest.xml` (Windows)
- ✅ `config.json` (鸿蒙OS)

### 2. 权限描述规范

iOS/macOS权限描述应：
- 使用用户友好的语言
- 说明为什么需要这个权限
- 说明如何使用这个权限
- 避免技术术语

示例：
```xml
❌ <string>Camera access required</string>
✅ <string>我们需要访问您的相机以拍照和扫描二维码</string>
```

### 3. 权限最小化原则

只申请必要的权限：
- 仔细评估每个权限的必要性
- 优先使用功能等价的低权限
- 避免申请未使用的权限

### 4. 定期检查

建议在以下时机重新检查：
- 应用新版本发布前
- 添加新功能时
- 隐私政策更新时
- 平台政策变更时

## 🔗 相关资源

### 官方文档

- [iOS权限官方文档](https://developer.apple.com/documentation/uikit/protecting_the_user_s_privacy)
- [Android权限官方文档](https://developer.android.com/guide/topics/permissions/overview)
- [Windows权限官方文档](https://docs.microsoft.com/en-us/windows/uwp/packaging/app-capability-declarations)
- [鸿蒙OS权限官方文档](https://developer.harmonyos.com/cn/docs/documentation/doc-guides/security-permissions-0000001333641113)

### 工具文档

- [parser.js](./parser.js) - 基础解析器
- [parser-enhanced.js](./parser-enhanced.js) - 增强解析器
- [PARSER_ENHANCEMENT.md](./PARSER_ENHANCEMENT.md) - 优化说明

## 📞 技术支持

如遇到问题，请：

1. 查看浏览器控制台日志
2. 检查文件格式是否正确
3. 参考示例文件格式
4. 查阅本文档FAQ部分

---

**版本**: 2.0.0
**更新时间**: 2025-11-26
**文档状态**: ✅ 最新
