# 练了没

练了没是一款健身记录 Web/App 项目，当前已支持网页端预览和 Capacitor Android 打包。项目定位是个人训练记录、复盘、好友互动和早期 APK 分发，当前版本采用邮箱注册登录，暂不接入微信 / QQ 快捷登录。

应用标语：藏器于身，伺时而动。

## 正式下载

- 下载页：https://hoggerel28.github.io/body-building_app/docs/
- Android APK：https://hoggerel28.github.io/body-building_app/docs/lianleme-latest.apk
- 版本清单：https://hoggerel28.github.io/body-building_app/docs/version.json
- iOS：暂无 iOS 版本

当前正式版本：

- 版本号：`0.2.2`
- Android `versionCode`：`3`
- APK 大小：`38.49 MB`
- APK SHA256：`6EE72BE8C9993F76579608B1560C67FE3095C6C086056A051DA4150E79D6605C`

## 主要功能

- 邮箱注册登录，基于 Supabase Auth。
- 用户资料、头像上传、跨设备头像同步。
- 训练记录、训练计时、训练日记和历史复盘。
- 男性 / 女性肌肉图展示，按当前选择部位点亮。
- 增肌 / 减脂目标模式，主题色和训练提示随模式切换。
- 好友添加、申请处理、删除好友、好友动态筛选。
- 训练复盘可设置可见性，好友可查看开放的历史复盘。
- 音乐歌单链接管理，支持重复检测、删除和外部 App 打开。
- 饮食与体重模块，提供食物分类、热量和蛋白质参考。
- 动作库按训练部位分类，每个部位扩展了主流训练动作。
- 反馈、通知、支持赞助和版本检测入口。
- GitHub Pages 静态下载页与 App 内版本检测机制。

## 技术栈

- 前端：Vite + 原生 JavaScript / CSS
- 后端服务：Supabase Auth / Postgres / Storage / RLS
- Android：Capacitor Android
- 分发：GitHub Pages 静态网页 + `version.json`

## 本地运行

安装依赖：

```powershell
npm.cmd install
```

启动开发服务器：

```powershell
npm.cmd run dev
```

默认访问地址：

```text
http://127.0.0.1:4173/
```

## 环境变量

复制 `.env.example` 为 `.env`，然后填写自己的 Supabase 项目信息：

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_VERSION_MANIFEST_URL=https://hoggerel28.github.io/body-building_app/docs/version.json
VITE_DOWNLOAD_PAGE_URL=https://hoggerel28.github.io/body-building_app/docs/
```

注意事项：

- `anon key` 可以放在前端，但数据库权限必须依赖 RLS 保护。
- 不要提交 `service_role`、数据库密码、OAuth AppSecret、token、cookie、Android keystore 或任何私钥。
- `.env`、`android/keystore.properties`、`android/app/release-key.jks` 必须只保留在本地。

## Supabase 初始化

在 Supabase SQL Editor 中按顺序执行：

```text
supabase/migrations/001_schema.sql
...
supabase/migrations/015_app_notices.sql
```

迁移内容包含用户资料、好友关系、训练日志、动态可见性、头像、反馈、通知、赞助展示、歌单去重等基础结构和 RLS 策略。

## Web 构建

```powershell
npm.cmd run build
```

构建产物位于：

```text
dist/
```

`dist/` 是本地构建产物，不提交到仓库。

## Android 打包

同步 Web 资源到 Android 工程：

```powershell
npm.cmd run cap:sync:android
```

构建 debug APK：

```powershell
cd android
.\gradlew.bat assembleDebug --console=plain
```

debug APK 输出位置：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

构建正式 release APK 前，需要先创建本地签名配置：

```text
android/keystore.properties
```

可参考模板：

```text
android/keystore.properties.example
```

正式包构建命令：

```powershell
cd android
.\gradlew.bat assembleRelease --console=plain
```

release APK 输出位置：

```text
android/app/build/outputs/apk/release/app-release.apk
```

签名文件必须妥善保存。后续版本如果使用不同 keystore，用户手机上的旧版本将无法直接覆盖升级。

## 版本检测与发布流程

当前采用“静态网页分发 + App 内版本检测”机制：

1. 构建正式 APK。
2. 将 APK 放到 `docs/lianleme-latest.apk`。
3. 更新 `docs/version.json` 中的 `latestVersion`、`latestVersionCode`、更新说明、发布日期、APK 大小和 SHA256。
4. 提交并推送到 GitHub。
5. GitHub Pages 更新后，App 读取固定地址的 `version.json`。
6. 如果线上 `latestVersionCode` 大于本地版本，App 提示用户打开下载页下载安装包。

当前阶段不做应用商店式自动更新，也不在 App 内静默下载安装包。

## 目录说明

```text
.
├─ app.js                    # 主应用逻辑
├─ index.html                # Web 入口
├─ styles.css                # 全局样式
├─ src/data/                 # 动作库、食物热量等本地数据
├─ public/                   # 静态资源和本地兜底 version.json
├─ supabase/migrations/      # Supabase 数据库迁移
├─ android/                  # Capacitor Android 工程
├─ docs/                     # GitHub Pages 正式下载页
└─ capacitor.config.json     # Capacitor 配置
```

## 安全说明

仓库中只应保存公开代码和公开资源。以下内容不要提交：

- `.env`
- Supabase `service_role` key
- 数据库密码
- OAuth AppSecret
- Android keystore
- 签名密码
- 私人 token、cookie 或账号凭据

如果需要更换 Supabase 项目、APK 签名或下载域名，请先确认对应环境变量、数据库迁移和 `docs/version.json` 是否同步更新。
