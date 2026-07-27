# 男性肌肉图资产说明

## 风格定稿

正式主界面当前按用户资料性别切换底图：

- `muscle-map-user-generated.jpg`：男性肌肉图，用户自己生成并指定使用。
- `muscle-map-female-user-generated.jpg`：女性肌肉图，用户自己生成并指定使用。

目标不是“彩色分区”，而是：前后双视图、训练身材比例、肌肉块面清楚、整体克制专业。

`muscle-map-male.svg` 保留为可编辑备用图；主界面通过图片底图 + SVG 覆盖层实现点击、点亮和换色。

覆盖层分为两层：

- 透明点击层：范围可以稍大，方便用户点中。
- 可见上色层：必须贴合肌肉块面，不能用大矩形、大椭圆或整块轮廓罩住人体。

## 交互结构

SVG 保留稳定肌群结构：

| 中文部位 | class | data-muscle | data-part |
| --- | --- | --- | --- |
| 胸部 | `.muscle.chest` | `chest` | `胸部` |
| 背部 | `.muscle.back` | `back` | `背部` |
| 肩部 | `.muscle.shoulders` | `shoulders` | `肩部` |
| 手臂 | `.muscle.arms` | `arms` | `手臂` |
| 核心 | `.muscle.core` | `core` | `核心` |
| 腿部 | `.muscle.legs` | `legs` | `腿部` |
| 有氧 | `.muscle.cardio` | `cardio` | `有氧` |

主界面坐标系为 `1280x1100`，与 `muscle-map-user-generated.jpg` 原始尺寸一致。

## 模式点亮

内联 SVG 后可通过变量切换模式：

```js
const map = document.querySelector(".muscle-map");

map.style.setProperty("--cut-active", "1");
map.style.setProperty("--bulk-active", "0");

map.style.setProperty("--cut-active", "0");
map.style.setProperty("--bulk-active", "1");
```

默认色彩是中性灰阶解剖底图。

- 减脂点亮：只在命中的部位叠加青绿 / 蓝绿，强化核心、腿部、心肺。
- 增肌点亮：只在命中的部位叠加橙红 / 琥珀，强化胸、背、肩、手臂、腿。

正式 App 如果只需要展示：

```html
<img src="./assets/muscle-map-male.svg" alt="男性正背面肌群分布图">
```

正式 App 如果需要点击肌群和动态点亮，应把 SVG 内联到页面，然后用事件委托读取 `.muscle` 上的 `data-part` 或 `data-muscle`。
