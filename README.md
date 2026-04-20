# 大健康四组 · 直播排期收集系统

商家填报页（公网可访问）+ 飞书多维表格汇总（AM查看）

## 部署步骤

### 1. 上传到 GitHub

```bash
cd schedule-public
git init
git add .
git commit -m "init"
git remote add origin https://github.com/cc-103053/dajk-schedule.git
git push -u origin main
```

### 2. 部署到 Vercel

1. 打开 https://vercel.com/new
2. 选择刚创建的 `dajk-schedule` 仓库
3. 点 **Deploy** 后进入项目设置
4. 左侧 **Settings → Environment Variables** 添加以下4个变量：

| Key | Value |
|---|---|
| `FEISHU_APP_ID` | cli_a96f52f007fddcc5 |
| `FEISHU_APP_SECRET` | jsl3A4ePo3PhySmyjlhYTfM3P0ThNr8V |
| `FEISHU_APP_TOKEN` | F7lDbrp5Ca8SjvsmroHceftpnid |
| `FEISHU_TABLE_ID` | tblXZ5oCSiI2VxLI |

5. 添加完后点 **Redeploy** 重新部署

### 3. 开启 GitHub Pages（可选备用）

仓库设置 → Pages → Source 选 main 分支

## 文件说明

- `index.html` — 商家填报页
- `shops.json` — 1522家商家名单（下拉搜索用）
- `api/submit.js` — Vercel中转函数（保护飞书Token）
- `vercel.json` — Vercel配置

## 飞书多维表格

AM查看汇总：打开飞书 → 知识库 → 大健康直播排期收集
