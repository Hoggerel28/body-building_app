# APK 放置目录

可将签名后的 APK 放在此目录，并在上一级 `version.json` 的 `apkUrl` 中填写对应相对路径，
例如 `./downloads/lianleme-0.3.0.apk`。若沿用默认固定文件名
`./lianleme-latest.apk`，则把 APK 放在 `release-site/` 根目录。
不要把 Android keystore、签名密码、私钥或包含真实用户数据的测试文件放进来。
