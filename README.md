# 练了没

本项目是一个健身记录 Web App，并已接入 Capacitor Android 工程。当前应用支持训练记录、训练计时、肌肉负荷图、复盘日记、好友、头像、歌单、反馈、通知、赞助入口和版本检测。

## 本地运行

```powershell
npm.cmd install
npm.cmd run dev
```

打开：

```text
http://127.0.0.1:4173/
```

## 构建网页

```powershell
npm.cmd run build
```

生成结果在 `dist/`。`dist/` 是构建产物，不提交到仓库。

## Supabase

复制 `.env.example` 为 `.env`，只填写公开 anon key：

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

然后按顺序执行 `supabase/migrations/` 下的 SQL。

不要把 `service_role`、数据库密码、OAuth AppSecret、token、cookie、Android keystore 或私钥提交到仓库。

## 版本检测

支持多源版本清单。国内分发时建议把 `version-manifest.json` 和新版 APK 放到腾讯 COS、阿里 OSS、Gitee Pages 或自己的国内服务器，然后在 `.env` 配置：

```env
VITE_VERSION_MANIFEST_URLS=https://your-domain/version-manifest.json
```

如果未配置远程源，应用会使用包内 `assets/version-manifest.json` 作为兜底。

## Android 打包

同步 Web 资源到 Android 工程：

```powershell
npm.cmd run cap:sync:android
```

打 debug APK：

```powershell
cd android
$env:JAVA_HOME = "$env:LOCALAPPDATA\Programs\Java\jdk-21"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"
$env:ANDROID_SDK_ROOT = $env:ANDROID_HOME
$env:Path = "$env:JAVA_HOME\bin;$env:ANDROID_HOME\platform-tools;$env:Path"
.\gradlew.bat assembleDebug --console=plain
```

APK 输出位置：

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

debug APK 只适合测试。正式分发应使用 release 签名包，并妥善保管 keystore。
