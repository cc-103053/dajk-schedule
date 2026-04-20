// Vercel Serverless Function (Node.js runtime)
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { shopName, date, startTime, endTime, gmv, remark } = req.body || {};
  if (!shopName || !date || !startTime || !endTime) {
    return res.status(400).json({ error: '请填写完整信息' });
  }

  try {
    // 1. 获取飞书 tenant_access_token
    const authRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: process.env.FEISHU_APP_ID,
        app_secret: process.env.FEISHU_APP_SECRET
      })
    });
    const authData = await authRes.json();
    const token = authData.tenant_access_token;
    if (!token) throw new Error('飞书鉴权失败');

    // 2. 写入多维表格
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const submitTime = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    // 手动解析日期避免时区偏移，用UTC noon
    const [dy, dm, dd] = date.split('-').map(Number);
    const dateTs = Date.UTC(dy, dm - 1, dd, 12, 0, 0);

    const record = {
      fields: {
        "\u6587\u672c": shopName,
        "\u76f4\u64ad\u65e5\u671f": dateTs,
        "\u5f00\u64ad\u65f6\u95f4": startTime,
        "\u7ed3\u675f\u65f6\u95f4": endTime,
        "\u9884\u4f30GMV\uff08\u5143\uff09": Number(gmv) || 0,
        "\u5907\u6ce8": remark || "",
        "\u63d0\u4ea4\u65f6\u95f4": submitTime
      }
    };

    const writeRes = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${process.env.FEISHU_APP_TOKEN}/tables/${process.env.FEISHU_TABLE_ID}/records`,
      {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      }
    );
    const writeData = await writeRes.json();
    if (writeData.code !== 0) throw new Error(writeData.msg || '写入失败');

    return res.status(200).json({ success: true, message: '提交成功' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message || '服务器错误，请稍后重试' });
  }
};
