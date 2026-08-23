const USDA_SOURCE_URL = "https://fdc.nal.usda.gov/";
const USDA_DOWNLOAD_URL = "https://fdc.nal.usda.gov/download-datasets/";

export const foodCalorieReferenceMeta = Object.freeze({
  version: "2.0.0",
  locale: "zh-CN",
  lastReviewed: "2026-08-05",
  disclaimer:
    "以下均为 estimated/reference 参考值，实际营养会因品牌、食材部位、含水量、用油和调味变化；不作为医疗或个性化营养建议。",
  imageNote: "本数据模块不依赖图片；展示层可按需使用文字、图标或自行管理的图片资源。",
  nutritionSource: "USDA FoodData Central（Foundation、SR Legacy 与 FNDDS）",
  nutritionSourceUrl: USDA_DOWNLOAD_URL,
  calculation:
    "reference 表示按 USDA 相近食物每 100g 或标准份量换算；estimated 表示以 USDA 食材为基准，对中式烹饪、用油、酱汁或外食份量做保守估算。",
  nutrientUnits: Object.freeze({
    kcal: "kcal",
    protein: "g",
    carbs: "g",
    fat: "g",
  }),
});

export const foodReferenceSources = Object.freeze([
  Object.freeze({
    name: "USDA FoodData Central",
    url: USDA_SOURCE_URL,
    usage: "基础食材和常见成品的热量及宏量营养估算基准",
  }),
  Object.freeze({
    name: "USDA FoodData Central Download Datasets",
    url: USDA_DOWNLOAD_URL,
    usage: "Foundation Foods、SR Legacy 与 FNDDS 数据说明及下载入口",
  }),
]);

function variant(
  id,
  name,
  serving,
  amount,
  unit,
  kcal,
  protein,
  carbs,
  fat,
  status = "estimated",
  note = "",
) {
  return Object.freeze({
    id,
    name,
    serving,
    amount,
    unit,
    nutrients: Object.freeze({ kcal, protein, carbs, fat }),
    status,
    estimated: status === "estimated",
    reference: status === "reference",
    basis:
      status === "reference"
        ? "USDA 相近食物数据按当前份量换算"
        : "USDA 基础食材数据叠加常见烹饪、配料或份量的保守估算",
    note,
  });
}

function food(id, name, aliases, sourceQuery, variants) {
  return Object.freeze({
    id,
    name,
    aliases: Object.freeze(aliases),
    source: Object.freeze({
      provider: "USDA FoodData Central",
      url: USDA_SOURCE_URL,
      query: sourceQuery,
    }),
    variants: Object.freeze(variants),
  });
}

function category(id, name, foods) {
  return Object.freeze({ id, name, foods: Object.freeze(foods) });
}

export const foodCalorieReference = Object.freeze([
  category("meat-seafood", "肉类水产", [
    food("chicken-breast", "鸡胸肉", ["鸡胸", "去皮鸡胸"], "chicken breast cooked roasted", [
      variant("roasted", "去皮清烤", "150g", 150, "g", 248, 46.5, 0, 5.4, "reference", "不计额外刷油和含糖腌料。"),
      variant("pan-fried", "少油煎", "150g", 150, "g", 285, 45, 1, 9.5, "estimated", "按约 5g 烹调油估算。"),
      variant("kung-pao", "宫保鸡丁", "1 盘约 250g", 250, "g", 430, 32, 28, 23, "estimated", "花生、糖和用油会明显影响结果。"),
    ]),
    food("chicken-thigh", "鸡腿肉", ["鸡腿", "去骨鸡腿"], "chicken thigh cooked", [
      variant("skinless-roasted", "去皮烤制", "150g", 150, "g", 314, 39, 0, 17, "reference", "按熟制去皮可食部分估算。"),
      variant("skin-on-roasted", "带皮烤制", "150g", 150, "g", 345, 36, 0, 22, "estimated", "鸡皮和刷油会提高脂肪。"),
      variant("soy-braised", "酱烧鸡腿", "1 份约 200g", 200, "g", 420, 32, 18, 24, "estimated", "含酱汁和少量糖，不含配菜。"),
    ]),
    food("lean-beef", "瘦牛肉", ["牛里脊", "牛后腿肉"], "beef lean cooked", [
      variant("grilled", "干热煎烤", "150g", 150, "g", 326, 39, 0, 18, "reference", "按熟制瘦牛肉估算。"),
      variant("stir-fried", "小炒牛肉", "1 份约 200g", 200, "g", 390, 34, 12, 24, "estimated", "含约 10g 油和少量配菜。"),
      variant("braised", "炖牛肉", "1 碗约 250g", 250, "g", 365, 33, 15, 20, "estimated", "不含土豆和主食，含少量汤汁。"),
    ]),
    food("pork-loin", "猪里脊", ["里脊肉", "瘦猪肉"], "pork loin cooked roasted", [
      variant("roasted", "去可见脂肪烤制", "150g", 150, "g", 260, 41, 0, 9.5, "reference", "不同切段的脂肪含量会有差异。"),
      variant("stir-fried", "青椒肉丝", "1 份约 220g", 220, "g", 350, 34, 13, 19, "estimated", "含青椒、调味汁和约 10g 油。"),
      variant("sweet-sour", "糖醋里脊", "1 份约 220g", 220, "g", 500, 28, 48, 22, "estimated", "挂糊、油炸和糖醋汁会显著增热量。"),
    ]),
    food("salmon", "三文鱼", ["鲑鱼"], "salmon Atlantic cooked dry heat", [
      variant("roasted", "烤制", "150g", 150, "g", 309, 33.2, 0, 18.5, "reference", "不计额外刷油。"),
      variant("pan-fried", "少油煎", "150g", 150, "g", 350, 33, 0, 23, "estimated", "按约 5g 烹调油估算。"),
      variant("sashimi", "生食刺身", "100g", 100, "g", 208, 20, 0, 13, "reference", "仅用于营养记录，生食安全需遵循当地规范。"),
    ]),
    food("shrimp", "虾仁", ["鲜虾", "对虾"], "shrimp cooked", [
      variant("boiled", "白灼或水煮", "150g", 150, "g", 149, 36, 0.3, 0.5, "reference", "不计蘸料。"),
      variant("stir-fried", "清炒虾仁", "1 份约 200g", 200, "g", 265, 34, 8, 11, "estimated", "含少量淀粉和约 8g 油。"),
      variant("breaded-fried", "裹粉油炸", "150g", 150, "g", 360, 25, 30, 16, "estimated", "裹粉厚度与吸油量差异较大。"),
    ]),
    food("cod", "鳕鱼", ["白身鱼"], "cod Pacific cooked dry heat", [
      variant("steamed", "清蒸", "150g", 150, "g", 158, 35, 0, 1.4, "reference", "不计蒸鱼豉油和热油。"),
      variant("pan-fried", "少油煎", "150g", 150, "g", 220, 34, 2, 8, "estimated", "按薄裹粉和约 5g 油估算。"),
      variant("tomato-stew", "番茄炖鳕鱼", "1 碗约 280g", 280, "g", 285, 32, 18, 10, "estimated", "含番茄、汤汁和少量烹调油。"),
    ]),
  ]),
  category("eggs-dairy-soy", "蛋奶豆", [
    food("egg", "鸡蛋", ["全蛋"], "egg whole cooked", [
      variant("boiled-one", "水煮", "1 个约 50g 可食部", 50, "g", 78, 6.3, 0.6, 5.3, "reference", "鸡蛋大小会影响实际份量。"),
      variant("boiled-two", "水煮", "2 个约 100g 可食部", 100, "g", 155, 12.6, 1.1, 10.6, "reference", "按两个中等鸡蛋估算。"),
      variant("fried-two", "煎蛋", "2 个", 100, "g", 230, 12.6, 1.2, 18.5, "estimated", "按约 8g 烹调油估算。"),
    ]),
    food("milk", "牛奶", ["鲜奶"], "milk fluid", [
      variant("whole", "全脂", "250ml", 250, "ml", 153, 7.9, 12, 8.1, "reference", "品牌配方会有差异。"),
      variant("low-fat", "低脂", "250ml", 250, "ml", 110, 8.5, 12.5, 3.8, "reference", "按约 1.5% 脂肪产品估算。"),
      variant("skim", "脱脂", "250ml", 250, "ml", 85, 8.5, 12.5, 0.3, "reference", "优先以包装营养标签为准。"),
    ]),
    food("plain-yogurt", "原味酸奶", ["无糖酸奶"], "yogurt plain", [
      variant("whole-unsweetened", "全脂无糖", "150g", 150, "g", 92, 5.2, 7, 5, "reference", "不含水果和糖浆。"),
      variant("low-fat-unsweetened", "低脂无糖", "150g", 150, "g", 85, 7.5, 10, 1.8, "reference", "不同菌种和浓度会影响数据。"),
      variant("sweetened", "市售加糖", "150g", 150, "g", 145, 5, 23, 3.5, "estimated", "添加糖差异较大，以标签为准。"),
    ]),
    food("greek-yogurt", "希腊酸奶", ["浓缩酸奶"], "Greek yogurt plain", [
      variant("nonfat", "脱脂无糖", "150g", 150, "g", 89, 15.5, 5.4, 0.6, "reference", "不含蜂蜜和坚果。"),
      variant("whole", "全脂无糖", "150g", 150, "g", 146, 13.5, 5.8, 7.5, "reference", "不同品牌浓缩程度不同。"),
      variant("fruit-cup", "水果风味杯", "150g", 150, "g", 170, 10, 25, 3.5, "estimated", "含果酱或添加糖。"),
    ]),
    food("firm-tofu", "北豆腐", ["硬豆腐", "老豆腐"], "tofu firm prepared with calcium", [
      variant("plain", "原味", "150g", 150, "g", 216, 25.9, 4.2, 13.1, "reference", "品牌和含水量差异较大。"),
      variant("pan-fried", "少油煎", "150g", 150, "g", 285, 25, 5, 20, "estimated", "按约 8g 烹调油估算。"),
      variant("mapo", "麻婆豆腐", "1 份约 250g", 250, "g", 380, 22, 16, 27, "estimated", "肉末、豆瓣酱和用油会明显影响结果。"),
    ]),
    food("soy-milk", "豆浆", ["大豆饮品"], "soy milk", [
      variant("unsweetened", "无糖", "300ml", 300, "ml", 99, 9, 5, 4.8, "reference", "按原味无糖产品估算。"),
      variant("light-sugar", "微糖", "300ml", 300, "ml", 145, 9, 17, 4.8, "estimated", "按添加约 12g 糖估算。"),
      variant("sweetened", "加糖", "500ml", 500, "ml", 260, 15, 39, 8, "estimated", "早餐店产品浓度和糖量差异较大。"),
    ]),
    food("edamame", "毛豆", ["青豆荚"], "edamame cooked boiled", [
      variant("boiled", "水煮去壳", "100g 可食部", 100, "g", 121, 11.9, 8.9, 5.2, "reference", "不计豆荚重量。"),
      variant("salted", "盐水煮", "150g 可食部", 150, "g", 182, 17.9, 13.4, 7.8, "reference", "热量与水煮相近，钠含量更高。"),
      variant("stir-fried", "五香炒毛豆", "150g 可食部", 150, "g", 245, 18, 15, 14, "estimated", "含约 7g 烹调油。"),
    ]),
  ]),
  category("vegetables", "蔬菜", [
    food("broccoli", "西兰花", ["青花菜"], "broccoli cooked and raw", [
      variant("raw", "生食", "100g", 100, "g", 34, 2.8, 6.6, 0.4, "reference", "按可食部分估算。"),
      variant("steamed", "清蒸或水煮", "150g", 150, "g", 53, 3.6, 10.8, 0.6, "reference", "不计酱汁。"),
      variant("stir-fried", "蒜蓉清炒", "1 份约 200g", 200, "g", 155, 5, 14, 10, "estimated", "按约 10g 烹调油估算。"),
    ]),
    food("spinach", "菠菜", ["叶菠菜"], "spinach cooked and raw", [
      variant("raw", "生食", "100g", 100, "g", 23, 2.9, 3.6, 0.4, "reference", "按可食部分估算。"),
      variant("boiled", "焯水", "150g", 150, "g", 35, 4.5, 5.6, 0.4, "reference", "不计调味汁。"),
      variant("stir-fried", "蒜蓉炒", "1 份约 200g", 200, "g", 145, 6, 8, 10, "estimated", "按约 10g 烹调油估算。"),
    ]),
    food("lettuce", "生菜", ["叶生菜"], "lettuce raw", [
      variant("raw-small", "生食", "100g", 100, "g", 15, 1.4, 2.9, 0.2, "reference", "不含沙拉酱。"),
      variant("raw-large", "生食", "200g", 200, "g", 30, 2.8, 5.8, 0.4, "reference", "适合按净重记录。"),
      variant("oyster-sauce", "蚝油生菜", "1 份约 250g", 250, "g", 170, 5, 18, 9, "estimated", "含蚝油、淀粉和约 8g 油。"),
    ]),
    food("tomato", "番茄", ["西红柿"], "tomatoes red ripe raw", [
      variant("raw", "生食", "200g", 200, "g", 36, 1.8, 7.8, 0.4, "reference", "约一个较大番茄。"),
      variant("egg-stir-fry", "番茄炒蛋", "1 份约 300g", 300, "g", 360, 20, 18, 23, "estimated", "按两个鸡蛋、番茄和约 12g 油估算。"),
      variant("soup", "番茄蛋花汤", "1 碗约 350g", 350, "g", 145, 9, 9, 8, "estimated", "按一个鸡蛋和少量油估算。"),
    ]),
    food("cucumber", "黄瓜", ["青瓜"], "cucumber with peel raw", [
      variant("raw", "生食", "200g", 200, "g", 30, 1.3, 7.3, 0.2, "reference", "不含蘸酱。"),
      variant("salad", "拍黄瓜", "1 份约 250g", 250, "g", 135, 3, 14, 8, "estimated", "含醋、糖和约 7g 香油。"),
      variant("egg-stir-fry", "黄瓜炒蛋", "1 份约 300g", 300, "g", 330, 19, 10, 23, "estimated", "按两个鸡蛋和约 10g 油估算。"),
    ]),
    food("carrot", "胡萝卜", ["红萝卜"], "carrots raw and cooked", [
      variant("raw", "生食", "100g", 100, "g", 41, 0.9, 9.6, 0.2, "reference", "按可食部分估算。"),
      variant("steamed", "蒸熟", "150g", 150, "g", 53, 1.2, 12.3, 0.3, "reference", "不计调味和用油。"),
      variant("stir-fried", "清炒胡萝卜", "1 份约 200g", 200, "g", 175, 2, 20, 10, "estimated", "按约 10g 烹调油估算。"),
    ]),
    food("mushroom", "鲜香菇", ["香菇", "冬菇"], "mushrooms shiitake cooked", [
      variant("raw", "鲜品生重", "100g", 100, "g", 34, 2.2, 6.8, 0.5, "reference", "鲜品与干品不可直接按同重量换算。"),
      variant("steamed", "清蒸", "150g", 150, "g", 63, 3.3, 12.6, 0.7, "reference", "不计酱汁。"),
      variant("stir-fried", "蚝油香菇", "1 份约 220g", 220, "g", 190, 5, 20, 11, "estimated", "含蚝油、淀粉和约 9g 油。"),
    ]),
    food("bok-choy", "小白菜", ["青菜", "油菜"], "bok choy raw and cooked", [
      variant("raw", "生食", "100g", 100, "g", 13, 1.5, 2.2, 0.2, "reference", "按可食部分估算。"),
      variant("boiled", "白灼或水煮", "200g", 200, "g", 30, 3, 5, 0.4, "reference", "不计酱油和热油。"),
      variant("stir-fried", "蒜蓉清炒", "1 份约 250g", 250, "g", 150, 4, 10, 10, "estimated", "按约 10g 烹调油估算。"),
    ]),
    food("cauliflower", "菜花", ["花椰菜"], "cauliflower cooked and raw", [
      variant("raw", "生食", "100g", 100, "g", 25, 1.9, 5, 0.3, "reference", "按可食部分估算。"),
      variant("steamed", "蒸或水煮", "200g", 200, "g", 50, 3.8, 10, 0.6, "reference", "不计调味汁。"),
      variant("dry-pot", "干锅菜花", "1 份约 250g", 250, "g", 220, 6, 20, 13, "estimated", "含少量腊肉、辣椒和烹调油。"),
    ]),
    food("eggplant", "茄子", ["长茄子"], "eggplant cooked", [
      variant("steamed", "清蒸", "200g", 200, "g", 50, 2, 12, 0.6, "reference", "不计蒜蓉和酱汁。"),
      variant("garlic", "蒜泥茄子", "1 份约 250g", 250, "g", 150, 3, 18, 7, "estimated", "按少量芝麻油和调味汁估算。"),
      variant("fish-flavor", "鱼香茄子", "1 份约 300g", 300, "g", 360, 5, 42, 19, "estimated", "煎炸吸油和糖量差异较大。"),
    ]),
    food("celery", "芹菜", ["西芹"], "celery raw and cooked", [
      variant("raw", "生食", "100g", 100, "g", 16, 0.7, 3, 0.2, "reference", "按可食部分估算。"),
      variant("stir-fried", "清炒芹菜", "200g", 200, "g", 105, 2.5, 7, 7, "estimated", "按约 7g 烹调油估算。"),
      variant("beef", "芹菜炒牛肉", "1 份约 280g", 280, "g", 330, 28, 14, 18, "estimated", "牛肉部位和用油量会影响结果。"),
    ]),
    food("zucchini", "西葫芦", ["嫩瓜"], "zucchini cooked", [
      variant("raw", "生食", "150g", 150, "g", 26, 1.8, 4.8, 0.5, "reference", "按可食部分估算。"),
      variant("stir-fried", "清炒西葫芦", "1 份约 250g", 250, "g", 120, 3, 12, 7, "estimated", "按约 7g 烹调油估算。"),
      variant("egg", "西葫芦炒蛋", "1 份约 300g", 300, "g", 290, 17, 12, 20, "estimated", "按两个鸡蛋和少量油估算。"),
    ]),
    food("winter-melon", "冬瓜", ["白瓜"], "winter melon cooked", [
      variant("boiled", "清煮", "250g", 250, "g", 30, 0.8, 7, 0.2, "reference", "不计汤底。"),
      variant("soup", "冬瓜排骨汤", "1 碗约 400g", 400, "g", 260, 18, 10, 16, "estimated", "排骨肥瘦和汤面油脂会影响结果。"),
      variant("stir-fried", "虾皮炒冬瓜", "1 份约 300g", 300, "g", 115, 5, 11, 5, "estimated", "按少量虾皮和约 5g 油估算。"),
    ]),
    food("radish", "白萝卜", ["萝卜"], "daikon radish raw and cooked", [
      variant("raw", "生食", "150g", 150, "g", 27, 0.9, 6, 0.2, "reference", "按可食部分估算。"),
      variant("boiled", "清炖", "250g", 250, "g", 45, 1.5, 10, 0.3, "reference", "不计肉汤和酱汁。"),
      variant("beef-stew", "萝卜炖牛腩", "1 份约 350g", 350, "g", 430, 28, 19, 26, "estimated", "牛腩肥瘦和汤汁用油差异较大。"),
    ]),
  ]),
  category("staples", "主食", [
    food("white-rice", "白米饭", ["米饭", "熟米饭"], "rice white cooked", [
      variant("small", "熟饭小碗", "100g", 100, "g", 130, 2.7, 28.2, 0.3, "reference", "熟饭含水量会影响重量。"),
      variant("medium", "熟饭中碗", "150g", 150, "g", 195, 4, 42.3, 0.4, "reference", "按普通蒸煮白米饭估算。"),
      variant("large", "熟饭大碗", "250g", 250, "g", 325, 6.7, 70.4, 0.7, "reference", "不含配菜和汤汁。"),
    ]),
    food("brown-rice", "糙米饭", ["熟糙米"], "rice brown long grain cooked", [
      variant("small", "熟饭小碗", "100g", 100, "g", 123, 2.7, 25.6, 1, "reference", "熟饭软硬度会影响重量。"),
      variant("medium", "熟饭中碗", "150g", 150, "g", 185, 4, 38.4, 1.5, "reference", "按普通蒸煮糙米估算。"),
      variant("mixed-rice", "杂粮混合饭", "200g", 200, "g", 270, 7, 54, 3, "estimated", "按糙米、燕麦米和豆类混合估算。"),
    ]),
    food("oats", "燕麦", ["燕麦片"], "oats cooked and dry", [
      variant("dry", "干燕麦片", "40g", 40, "g", 152, 5.1, 27.1, 2.8, "reference", "未计牛奶、糖和坚果。"),
      variant("water-porridge", "清水燕麦粥", "1 碗约 250g", 250, "g", 160, 5.5, 28, 3, "estimated", "按 40g 干燕麦加水煮制。"),
      variant("milk-porridge", "牛奶燕麦粥", "1 碗约 300g", 300, "g", 275, 13, 40, 7.5, "estimated", "按 40g 燕麦和 250ml 低脂牛奶估算。"),
    ]),
    food("wheat-noodles", "面条", ["小麦面", "熟面"], "noodles egg cooked", [
      variant("plain-small", "清水煮熟", "150g", 150, "g", 207, 7.5, 41, 2, "reference", "不含汤底和浇头。"),
      variant("plain-large", "清水煮熟", "250g", 250, "g", 345, 12.5, 68, 3.3, "reference", "熟面含水量会影响重量。"),
      variant("scallion-oil", "葱油拌面", "1 碗约 300g", 300, "g", 620, 15, 88, 23, "estimated", "酱油、糖和葱油用量差异较大。"),
    ]),
    food("whole-wheat-bread", "全麦面包", ["全麦吐司"], "bread whole wheat", [
      variant("one-slice", "原味", "1 片约 32g", 32, "g", 81, 4, 13.7, 1.1, "reference", "品牌配方差异明显。"),
      variant("two-slices", "原味", "2 片约 64g", 64, "g", 161, 8, 27.3, 2.2, "reference", "优先以包装营养标签为准。"),
      variant("toast-egg", "鸡蛋吐司", "1 份", 140, "g", 330, 17, 31, 15, "estimated", "按两片面包、一个鸡蛋和少量油估算。"),
    ]),
    food("sweet-potato", "红薯", ["地瓜", "甘薯"], "sweet potato cooked baked", [
      variant("small", "蒸或烤", "100g 可食部", 100, "g", 90, 2, 20.7, 0.2, "reference", "不计糖浆和黄油。"),
      variant("medium", "蒸或烤", "200g 可食部", 200, "g", 180, 4, 41.4, 0.3, "reference", "品种和含水量会影响数据。"),
      variant("candied", "拔丝红薯", "1 份约 250g", 250, "g", 620, 5, 96, 24, "estimated", "油炸和糖浆会显著提高热量。"),
    ]),
    food("potato", "土豆", ["马铃薯"], "potatoes cooked", [
      variant("boiled", "水煮", "200g", 200, "g", 174, 3.8, 40.2, 0.2, "reference", "不计酱料和黄油。"),
      variant("baked", "带皮烤", "250g", 250, "g", 233, 6.3, 52.9, 0.3, "reference", "不含芝士和奶油。"),
      variant("fries", "炸薯条", "中份约 120g", 120, "g", 375, 4, 49, 18, "estimated", "品牌、裹粉和吸油量差异较大。"),
    ]),
  ]),
  category("fruits", "水果", [
    food("banana", "香蕉", ["蕉"], "bananas raw", [
      variant("small", "生食小份", "80g 可食部", 80, "g", 71, 0.9, 18.3, 0.3, "reference", "约一根小香蕉。"),
      variant("medium", "生食中份", "120g 可食部", 120, "g", 107, 1.3, 27.4, 0.4, "reference", "约一根中等香蕉。"),
      variant("large", "生食大份", "160g 可食部", 160, "g", 142, 1.7, 36.5, 0.5, "reference", "按去皮可食部分估算。"),
    ]),
    food("apple", "苹果", ["鲜苹果"], "apples with skin raw", [
      variant("small", "带皮生食", "150g 可食部", 150, "g", 78, 0.4, 20.7, 0.3, "reference", "约一个小苹果。"),
      variant("medium", "带皮生食", "200g 可食部", 200, "g", 104, 0.5, 27.6, 0.3, "reference", "约一个中等苹果。"),
      variant("stewed", "无糖煮苹果", "200g", 200, "g", 106, 0.5, 28, 0.3, "estimated", "不计糖、蜂蜜和黄油。"),
    ]),
    food("orange", "橙子", ["甜橙"], "oranges raw", [
      variant("small", "生食", "130g 可食部", 130, "g", 61, 1.2, 15.3, 0.2, "reference", "约一个小橙子。"),
      variant("medium", "生食", "180g 可食部", 180, "g", 85, 1.7, 21.2, 0.2, "reference", "按去皮可食部分估算。"),
      variant("juice", "鲜榨橙汁", "250ml", 250, "ml", 112, 1.7, 26, 0.5, "reference", "榨汁会减少完整果肉纤维。"),
    ]),
    food("strawberry", "草莓", ["鲜草莓"], "strawberries raw", [
      variant("small", "生食", "100g", 100, "g", 32, 0.7, 7.7, 0.3, "reference", "按去蒂可食部分估算。"),
      variant("large", "生食", "250g", 250, "g", 80, 1.7, 19.2, 0.8, "reference", "不含糖和奶油。"),
      variant("yogurt-cup", "草莓酸奶杯", "1 杯约 250g", 250, "g", 220, 11, 34, 5, "estimated", "按无糖酸奶、草莓和少量蜂蜜估算。"),
    ]),
    food("blueberry", "蓝莓", ["鲜蓝莓"], "blueberries raw", [
      variant("small", "生食", "50g", 50, "g", 29, 0.4, 7.3, 0.2, "reference", "约一小把。"),
      variant("cup", "生食", "150g", 150, "g", 86, 1.1, 21.8, 0.5, "reference", "不含酸奶和糖。"),
      variant("smoothie", "牛奶蓝莓昔", "300ml", 300, "ml", 240, 10, 36, 7, "estimated", "按低脂牛奶、蓝莓和少量香蕉估算。"),
    ]),
    food("grapes", "葡萄", ["鲜葡萄"], "grapes raw", [
      variant("small", "生食", "100g", 100, "g", 69, 0.7, 18.1, 0.2, "reference", "按可食部分估算。"),
      variant("large", "生食", "250g", 250, "g", 173, 1.8, 45.3, 0.4, "reference", "葡萄品种糖度会有差异。"),
      variant("raisins", "葡萄干", "30g", 30, "g", 90, 0.9, 23.7, 0.1, "reference", "脱水后热量密度较高。"),
    ]),
    food("kiwi", "猕猴桃", ["奇异果"], "kiwifruit green raw", [
      variant("one", "生食", "1 个约 80g 可食部", 80, "g", 49, 0.9, 11.8, 0.4, "reference", "按去皮可食部分估算。"),
      variant("two", "生食", "2 个约 160g 可食部", 160, "g", 98, 1.8, 23.6, 0.8, "reference", "成熟度会影响甜度。"),
      variant("smoothie", "酸奶猕猴桃昔", "300ml", 300, "ml", 235, 11, 39, 4.5, "estimated", "按无糖酸奶、猕猴桃和少量蜂蜜估算。"),
    ]),
    food("pear", "梨", ["雪梨"], "pears raw", [
      variant("small", "带皮生食", "150g 可食部", 150, "g", 86, 0.6, 23, 0.2, "reference", "约一个小梨。"),
      variant("medium", "带皮生食", "220g 可食部", 220, "g", 126, 0.8, 33.7, 0.3, "reference", "品种和成熟度会影响甜度。"),
      variant("stewed", "冰糖炖梨", "1 碗约 300g", 300, "g", 190, 0.8, 48, 0.3, "estimated", "含冰糖，糖量按常见家用配方估算。"),
    ]),
    food("peach", "桃", ["水蜜桃"], "peaches raw", [
      variant("small", "生食", "150g 可食部", 150, "g", 59, 1.4, 14.3, 0.4, "reference", "按去核可食部分估算。"),
      variant("medium", "生食", "220g 可食部", 220, "g", 86, 2, 21, 0.6, "reference", "成熟度会影响含糖量。"),
      variant("canned", "糖水黄桃", "150g", 150, "g", 120, 0.8, 30, 0.2, "estimated", "糖水浸泡产品以包装标签为准。"),
    ]),
    food("watermelon", "西瓜", ["无籽西瓜"], "watermelon raw", [
      variant("small", "生食", "300g 可食部", 300, "g", 90, 1.8, 22.7, 0.5, "reference", "按去皮去籽可食部估算。"),
      variant("large", "生食", "500g 可食部", 500, "g", 150, 3, 38, 0.8, "reference", "含水量高，建议按实际重量记录。"),
      variant("juice", "鲜榨西瓜汁", "300ml", 300, "ml", 95, 1.8, 23, 0.5, "estimated", "榨汁后纤维减少，不含额外糖。"),
    ]),
    food("mango", "芒果", ["台农芒"], "mango raw", [
      variant("small", "生食", "150g 可食部", 150, "g", 90, 1.2, 22.5, 0.6, "reference", "按去皮去核可食部估算。"),
      variant("medium", "生食", "250g 可食部", 250, "g", 150, 2, 37.5, 1, "reference", "品种和成熟度会影响甜度。"),
      variant("sticky-rice", "芒果糯米饭", "1 份约 300g", 300, "g", 480, 7, 79, 15, "estimated", "椰浆和糯米会显著提高热量。"),
    ]),
    food("pineapple", "菠萝", ["凤梨"], "pineapple raw", [
      variant("small", "生食", "150g 可食部", 150, "g", 75, 0.8, 19.7, 0.2, "reference", "按去皮可食部分估算。"),
      variant("large", "生食", "250g 可食部", 250, "g", 125, 1.4, 32.8, 0.3, "reference", "成熟度和品种会影响糖度。"),
      variant("fried-rice", "菠萝炒饭", "1 份约 400g", 400, "g", 650, 18, 94, 22, "estimated", "米饭、坚果和用油量差异较大。"),
    ]),
    food("pomelo", "柚子", ["蜜柚"], "pomelo raw", [
      variant("small", "生食", "200g 可食部", 200, "g", 76, 1.4, 19, 0.2, "reference", "按去皮去籽可食部估算。"),
      variant("large", "生食", "350g 可食部", 350, "g", 133, 2.5, 33, 0.4, "reference", "不同品种甜度差异较大。"),
      variant("salad", "柚子虾仁沙拉", "1 份约 300g", 300, "g", 240, 22, 24, 7, "estimated", "酱汁和坚果会改变总热量。"),
    ]),
  ]),
  category("nuts-seeds", "坚果种子", [
    food("almonds", "巴旦木", ["杏仁"], "almonds roasted", [
      variant("small", "无盐原味", "15g", 15, "g", 90, 3.1, 3.2, 7.9, "reference", "约一小撮。"),
      variant("standard", "无盐干烤", "30g", 30, "g", 179, 6.3, 6.3, 15.8, "reference", "建议按重量记录。"),
      variant("salted", "盐焗", "30g", 30, "g", 183, 6.2, 6.5, 16.1, "estimated", "热量接近干烤，钠含量更高。"),
    ]),
    food("walnuts", "核桃仁", ["核桃"], "walnuts English", [
      variant("small", "原味", "15g", 15, "g", 98, 2.3, 2.1, 9.8, "reference", "约三到四个整仁。"),
      variant("standard", "原味", "30g", 30, "g", 196, 4.6, 4.1, 19.6, "reference", "热量密度较高，建议称重。"),
      variant("candied", "琥珀核桃", "30g", 30, "g", 210, 3.5, 14, 16, "estimated", "含糖浆和油，配方差异较大。"),
    ]),
    food("peanuts", "花生", ["花生仁"], "peanuts roasted", [
      variant("small", "原味", "15g", 15, "g", 88, 3.7, 3.2, 7.5, "reference", "按去壳花生仁估算。"),
      variant("standard", "干烤", "30g", 30, "g", 176, 7.4, 6.4, 15, "reference", "不含裹粉和糖衣。"),
      variant("fried", "油炸花生", "30g", 30, "g", 190, 7, 6, 17, "estimated", "吸油量和盐分会有差异。"),
    ]),
    food("cashews", "腰果", ["腰果仁"], "cashew nuts roasted", [
      variant("small", "原味", "15g", 15, "g", 86, 2.3, 4.9, 6.9, "reference", "约一小撮。"),
      variant("standard", "干烤", "30g", 30, "g", 172, 4.6, 9.8, 13.8, "reference", "品牌烘烤用油会有差异。"),
      variant("honey", "蜂蜜烤腰果", "30g", 30, "g", 188, 4.2, 15, 13, "estimated", "含糖衣，优先以包装标签为准。"),
    ]),
    food("pumpkin-seeds", "南瓜籽仁", ["南瓜子"], "pumpkin seed kernels roasted", [
      variant("small", "原味", "15g", 15, "g", 86, 4.5, 2.2, 7.4, "reference", "按去壳籽仁估算。"),
      variant("standard", "干烤", "30g", 30, "g", 172, 9, 4.5, 14.8, "reference", "不计外壳重量。"),
      variant("salted", "盐焗", "30g", 30, "g", 175, 8.8, 4.8, 15, "estimated", "热量接近干烤，钠含量更高。"),
    ]),
    food("chia-seeds", "奇亚籽", ["芡欧鼠尾草籽"], "chia seeds dried", [
      variant("spoon", "干籽", "10g", 10, "g", 49, 1.7, 4.2, 3.1, "reference", "约一平汤匙。"),
      variant("standard", "干籽", "25g", 25, "g", 122, 4.1, 10.5, 7.7, "reference", "吸水后重量增加但总热量不变。"),
      variant("pudding", "牛奶奇亚籽布丁", "1 杯约 250g", 250, "g", 245, 10, 26, 12, "estimated", "按 25g 奇亚籽、牛奶和少量蜂蜜估算。"),
    ]),
    food("pistachios", "开心果", ["开心果仁"], "pistachios roasted", [
      variant("small", "无盐原味", "15g", 15, "g", 84, 3, 4.2, 6.7, "reference", "按去壳果仁估算。"),
      variant("standard", "干烤", "30g", 30, "g", 168, 6, 8.4, 13.4, "reference", "建议按去壳重量记录。"),
      variant("salted", "盐焗", "30g", 30, "g", 172, 6, 8, 13.8, "estimated", "钠含量取决于裹盐量。"),
    ]),
    food("macadamia", "夏威夷果", ["澳洲坚果"], "macadamia nuts roasted", [
      variant("small", "原味", "15g", 15, "g", 108, 1.2, 2.1, 11.4, "reference", "热量密度较高，建议称重。"),
      variant("standard", "干烤", "30g", 30, "g", 216, 2.4, 4.2, 22.8, "reference", "不含糖衣。"),
      variant("honey", "蜂蜜烤", "30g", 30, "g", 235, 2.2, 10, 22, "estimated", "含糖衣和少量油。"),
    ]),
    food("sunflower-seeds", "葵花籽仁", ["瓜子仁"], "sunflower seed kernels roasted", [
      variant("small", "原味", "15g", 15, "g", 88, 3.1, 3, 7.7, "reference", "按去壳籽仁估算。"),
      variant("standard", "干烤", "30g", 30, "g", 176, 6.2, 6, 15.4, "reference", "不计瓜子壳重量。"),
      variant("salted", "盐焗", "30g", 30, "g", 180, 6, 6, 15.8, "estimated", "钠含量取决于裹盐量。"),
    ]),
    food("sesame-seeds", "芝麻", ["白芝麻", "黑芝麻"], "sesame seeds dried", [
      variant("small", "熟芝麻", "10g", 10, "g", 57, 1.7, 2.3, 5, "reference", "适合撒在菜肴或粥中记录。"),
      variant("standard", "熟芝麻", "20g", 20, "g", 115, 3.4, 4.6, 10, "reference", "不含额外糖和油。"),
      variant("paste", "芝麻酱", "20g", 20, "g", 120, 3.5, 3.5, 10.5, "estimated", "不同品牌含油量差异较大。"),
    ]),
  ]),
  category("drinks", "饮品", [
    food("coffee", "咖啡", ["美式咖啡", "黑咖啡"], "coffee brewed", [
      variant("black", "黑咖啡", "300ml", 300, "ml", 6, 0.7, 0, 0.1, "reference", "不加糖、奶或糖浆。"),
      variant("sugar", "加糖咖啡", "300ml", 300, "ml", 86, 0.7, 20, 0.1, "estimated", "按添加 20g 糖估算。"),
      variant("latte", "全脂拿铁", "350ml", 350, "ml", 210, 11, 17, 11, "estimated", "不含额外糖浆和奶油。"),
    ]),
    food("tea", "茶饮", ["茶", "红茶", "绿茶"], "tea brewed", [
      variant("plain", "无糖茶", "500ml", 500, "ml", 5, 0, 1, 0, "reference", "不加糖和奶。"),
      variant("sweet", "加糖茶", "500ml", 500, "ml", 165, 0, 41, 0, "estimated", "按添加约 40g 糖估算。"),
      variant("milk-tea", "常规奶茶", "500ml", 500, "ml", 420, 6, 68, 14, "estimated", "不含珍珠，门店配方差异很大。"),
    ]),
    food("cola", "可乐", ["碳酸饮料"], "carbonated cola", [
      variant("zero", "无糖", "330ml", 330, "ml", 1, 0, 0, 0, "reference", "不同甜味剂产品略有差异。"),
      variant("can", "含糖罐装", "330ml", 330, "ml", 139, 0, 35, 0, "reference", "以常见含糖可乐估算。"),
      variant("bottle", "含糖瓶装", "500ml", 500, "ml", 210, 0, 53, 0, "reference", "优先以瓶身标签为准。"),
    ]),
    food("coconut-water", "椰子水", ["天然椰子水"], "coconut water", [
      variant("small", "原味", "250ml", 250, "ml", 48, 1.8, 9.3, 0.5, "reference", "不含添加糖。"),
      variant("large", "原味", "500ml", 500, "ml", 95, 3.5, 18.5, 1, "reference", "天然糖含量会有波动。"),
      variant("sweetened", "加糖风味", "500ml", 500, "ml", 175, 2, 38, 0.5, "estimated", "按添加约 20g 糖估算。"),
    ]),
    food("sports-drink", "运动饮料", ["电解质饮料"], "sports drink", [
      variant("small", "常规含糖", "300ml", 300, "ml", 72, 0, 18, 0, "reference", "不同品牌糖量不同。"),
      variant("bottle", "常规含糖", "600ml", 600, "ml", 144, 0, 36, 0, "reference", "优先以包装标签为准。"),
      variant("zero", "无糖电解质饮料", "600ml", 600, "ml", 10, 0, 2, 0, "estimated", "少数产品仍含少量碳水。"),
    ]),
    food("orange-juice", "橙汁", ["果汁"], "orange juice", [
      variant("small", "100% 橙汁", "200ml", 200, "ml", 90, 1.4, 20.8, 0.4, "reference", "不含额外添加糖。"),
      variant("standard", "100% 橙汁", "300ml", 300, "ml", 135, 2.1, 31.2, 0.6, "reference", "果汁不能等同于完整水果。"),
      variant("juice-drink", "橙味果汁饮料", "500ml", 500, "ml", 225, 0, 55, 0, "estimated", "果汁含量与添加糖因品牌而异。"),
    ]),
  ]),
  category("common-dining", "常见外食", [
    food("beef-noodle-soup", "牛肉面", ["牛肉汤面"], "beef noodle soup restaurant", [
      variant("small", "清汤小碗", "1 碗约 500g", 500, "g", 520, 28, 75, 12, "estimated", "含熟面、少量牛肉和汤底。"),
      variant("standard", "清汤标准碗", "1 碗约 650g", 650, "g", 680, 35, 96, 18, "estimated", "面量和牛肉量因门店而异。"),
      variant("rich-broth", "红烧浓汤大碗", "1 碗约 750g", 750, "g", 880, 42, 108, 31, "estimated", "浓汤、辣油和肥肉会提高脂肪。"),
    ]),
    food("dumplings", "水饺", ["饺子"], "dumplings meat filled cooked", [
      variant("six", "猪肉蔬菜馅", "6 个约 150g", 150, "g", 315, 15, 38, 11, "estimated", "不计蘸料。"),
      variant("ten", "猪肉蔬菜馅", "10 个约 250g", 250, "g", 525, 25, 63, 18, "estimated", "皮馅比例会影响结果。"),
      variant("fried", "煎饺", "10 个约 260g", 260, "g", 690, 26, 67, 34, "estimated", "按额外吸收约 15g 油估算。"),
    ]),
    food("baozi", "包子", ["蒸包"], "steamed filled bun", [
      variant("vegetable", "素菜包", "1 个约 100g", 100, "g", 190, 6, 34, 4, "estimated", "馅料和面皮比例因门店而异。"),
      variant("pork", "鲜肉包", "1 个约 100g", 100, "g", 245, 10, 32, 9, "estimated", "肥瘦肉比例会影响脂肪。"),
      variant("two-pork", "鲜肉包", "2 个约 200g", 200, "g", 490, 20, 64, 18, "estimated", "按两个标准大小肉包估算。"),
    ]),
    food("fried-rice", "炒饭", ["蛋炒饭"], "fried rice restaurant", [
      variant("small", "蛋炒饭小份", "1 份约 300g", 300, "g", 540, 14, 79, 18, "estimated", "按一个鸡蛋和约 12g 油估算。"),
      variant("standard", "蛋炒饭标准份", "1 份约 450g", 450, "g", 810, 21, 118, 27, "estimated", "餐馆用油量差异较大。"),
      variant("yangzhou", "扬州炒饭", "1 份约 450g", 450, "g", 890, 29, 115, 34, "estimated", "含鸡蛋、火腿或虾仁及较多用油。"),
    ]),
    food("malatang", "麻辣烫", ["冒菜"], "hot pot mixed ingredients", [
      variant("vegetable", "蔬菜豆制品为主", "1 碗约 600g", 600, "g", 520, 25, 45, 26, "estimated", "不喝汤、少油版本。"),
      variant("mixed", "荤素混合", "1 碗约 700g", 700, "g", 780, 38, 62, 42, "estimated", "含丸类、豆制品和常规底料。"),
      variant("rich", "浓油麻酱", "1 碗约 750g", 750, "g", 1080, 42, 78, 66, "estimated", "麻酱、红油和加工丸类会明显增热量。"),
    ]),
    food("hamburger", "汉堡", ["牛肉汉堡"], "hamburger restaurant", [
      variant("single", "单层基础款", "1 个约 180g", 180, "g", 470, 24, 42, 23, "estimated", "不含薯条和饮料。"),
      variant("cheese", "单层芝士款", "1 个约 210g", 210, "g", 560, 29, 45, 30, "estimated", "酱料和芝士用量因品牌而异。"),
      variant("double", "双层牛肉款", "1 个约 300g", 300, "g", 850, 48, 48, 52, "estimated", "不含套餐配餐。"),
    ]),
    food("pizza", "披萨", ["比萨"], "pizza restaurant", [
      variant("one-slice", "芝士披萨", "1 片约 110g", 110, "g", 285, 12, 36, 10, "estimated", "按常见手拍饼底估算。"),
      variant("two-slices", "芝士披萨", "2 片约 220g", 220, "g", 570, 24, 72, 20, "estimated", "饼底厚度会影响碳水。"),
      variant("meat", "肉类厚底披萨", "2 片约 260g", 260, "g", 760, 32, 78, 36, "estimated", "加工肉、芝士和厚底会提高热量。"),
    ]),
    food("boxed-meal", "中式盒饭", ["快餐盒饭"], "mixed Chinese meal takeout", [
      variant("light", "一荤两素少饭", "1 盒约 500g", 500, "g", 650, 35, 78, 22, "estimated", "按少油菜、约 150g 米饭估算。"),
      variant("standard", "两荤一素米饭", "1 盒约 650g", 650, "g", 920, 45, 105, 35, "estimated", "菜品选择和汤汁会影响结果。"),
      variant("fried", "炸物红烧类盒饭", "1 盒约 700g", 700, "g", 1250, 42, 130, 55, "estimated", "含炸物、浓汁和约 250g 米饭。"),
    ]),
  ]),
]);

export const foodCalorieCategories = Object.freeze(
  foodCalorieReference.map(({ id, name, foods }) =>
    Object.freeze({ id, name, foodCount: foods.length }),
  ),
);

export const foodReferenceCategories = Object.freeze(
  foodCalorieReference.map(({ name }) => name),
);

export const foodCalorieReferences = Object.freeze(
  foodCalorieReference.flatMap((categoryItem) =>
    categoryItem.foods.flatMap((foodItem) =>
      foodItem.variants.map((variantItem) => {
        const { kcal, protein, carbs, fat } = variantItem.nutrients;
        return Object.freeze({
          id: `${foodItem.id}-${variantItem.id}`,
          category: categoryItem.name,
          categoryId: categoryItem.id,
          foodId: foodItem.id,
          variantId: variantItem.id,
          name: foodItem.name,
          aliases: foodItem.aliases,
          portion: variantItem.serving,
          serving: variantItem.serving,
          servingAmount: variantItem.amount,
          servingUnit: variantItem.unit,
          method: variantItem.name,
          cooking: variantItem.name,
          kcal,
          protein,
          carbs,
          fat,
          nutrients: variantItem.nutrients,
          note: variantItem.note,
          status: variantItem.status,
          dataQuality: variantItem.status,
          estimated: variantItem.estimated,
          reference: variantItem.reference,
          basis: variantItem.basis,
          source: foodItem.source,
        });
      }),
    ),
  ),
);

// Backward-compatible flat export used by the current calorie reference modal.
export const foodReferences = foodCalorieReferences;

export function getFoodCategory(categoryId) {
  return foodCalorieReference.find((item) => item.id === categoryId) || null;
}

export function getFoodById(foodId) {
  for (const categoryItem of foodCalorieReference) {
    const matched = categoryItem.foods.find((item) => item.id === foodId);
    if (matched) return matched;
  }
  return null;
}
