# Supabase 配置说明

## 安全提醒

当前前端代码只需要 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`。只使用 Supabase 的公开 `anon` key，不要在 `.env`、前端代码、聊天、截图或仓库中放入 `service_role`、数据库密码、OAuth AppSecret、token、cookie、Android keystore 或私钥。

## 1. 配置环境变量

复制 `.env.example` 为 `.env`，填入项目 URL 和 anon key：

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

`anon key` 可以被前端读取，不等于后端密钥；它必须配合 RLS 使用。不要为了“调通”而临时关闭 RLS 或改用 `service_role`。

## 2. 执行数据库迁移

在 Supabase SQL Editor 中按顺序执行：

```text
supabase/migrations/001_schema.sql
supabase/migrations/002_rls.sql
supabase/migrations/003_friend_rpc.sql
supabase/migrations/004_workout_records_grants.sql
supabase/migrations/005_wellness_data_grants.sql
supabase/migrations/006_review_posts_grants.sql
supabase/migrations/007_friend_system_grants.sql
supabase/migrations/008_friend_management_rpc.sql
supabase/migrations/009_friend_code.sql
supabase/migrations/010_avatar_storage.sql
supabase/migrations/011_playlist_links_grants.sql
supabase/migrations/012_friend_request_idempotency.sql
supabase/migrations/013_feedback_reports.sql
```

迁移包含公开资料、私有身体指标、训练记录、体重、饮食、复盘、好友请求、好友关系、头像存储和歌单链接等表，以及对应 RLS 策略和好友请求 / 取消申请 / 拒绝申请 / 删除好友 / UID 搜索 RPC。身高、体重、目标体重、体脂等健康字段放在私有表中，不能作为公开 profile 字段读取。

## 3. 开启邮箱认证

在 Supabase 控制台确认 Auth 的 Email provider 已启用。登录 / 注册入口在 App 的“我的”页面。

## 4. 当前边界

- 前端已接入 Supabase Auth 客户端。
- 业务数据当前仍以浏览器本地保存为主，尚未完成训练、饮食、体重、复盘、好友关系和歌单链接的完整云同步。
- 好友圈和复盘可见性目前是本地原型加数据库地基；上线云同步时必须依赖数据库 RLS 校验，不能只靠前端隐藏。
- 微信 / QQ 登录尚未接入；后续如接入，需要后端安全回调，不能把 AppSecret 放进前端。
