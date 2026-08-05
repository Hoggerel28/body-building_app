# 练了没静态分发页

这个目录用于早期 Android APK 分发和 App 内版本检测。

## 部署方式

把 `release-site/` 整个目录上传到任意静态托管服务，例如腾讯 COS、阿里 OSS、又拍云、Gitee Pages、GitHub Pages 或自己的服务器。

部署后需要有两个固定地址：

- 下载页：`https://你的域名/index.html`
- 版本清单：`https://你的域名/version.json`

然后在 App 构建用的 `.env` 里配置：

```env
VITE_VERSION_MANIFEST_URL=https://你的域名/version.json
```

## 每次发布新版

1. 把新 APK 复制到这个目录，并命名为 `lianleme-latest.apk`；也可以放入
   `downloads/` 并在 `apkUrl` 中填写对应路径。
2. 修改 `version.json`：
   - `latestVersion`：展示版本号，例如 `0.2.1`
   - `latestVersionCode`：Android 版本码，必须比旧版更大
   - `releaseDate`：发布日期
   - `releaseNotes`：更新说明
   - `downloadPageUrl`：下载页面地址，可用 `./index.html`
   - `apkUrl`：APK 地址，可用 `./lianleme-latest.apk`
   - `apkSize`：可选，安装包大小，例如 `18.6 MB`
   - `sha256`：可选，APK 文件的 SHA-256
3. 同步修改 `android/app/build.gradle` 的 `versionCode/versionName`、`app.js` 的
   `APP_VERSION_CODE/APP_VERSION` 和包内 `assets/version-manifest.json`。
4. 先上传 APK，再上传 `version.json`，避免出现下载地址已更新但 APK 尚不存在。

`index.html` 会自动读取同目录 `version.json`，不需要重复修改页面里的版本文案。

App 会优先读取 `.env` 配置的 `VITE_VERSION_MANIFEST_URL`。如果线上 `latestVersionCode` 大于本地版本码，就会在通知/版本检测中提示用户下载新版。

若下载站与 App 不同源，静态服务需允许 `version.json` 跨域读取，建议设置
`Access-Control-Allow-Origin: *`，并避免长时间缓存 `version.json`。

不要把签名私钥、token、Supabase service_role 或数据库密码放进这个目录。
