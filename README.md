# 网易云歌单分类器

一个优雅的网易云音乐歌单分类工具，帮助你更好地管理和筛选歌单中的歌曲。支持按照曲风、标签、语种和 BPM 进行智能分类和筛选。

## 体验地址
yysp.jrenc.com

## 项目截图
<img width="1680" alt="22a9b58eb06f41b75c3ce605b3c9c86b" src="https://github.com/user-attachments/assets/91784cb6-dbb1-48cc-88c0-8c7e0afedc21" />
<img width="1680" alt="8388c4130ce5ca94b5a8bdbd01e9952d" src="https://github.com/user-attachments/assets/12b513e6-ad59-4ea8-8922-faa93ba714fe" />

## 🌟 特性

- 🎵 支持网易云音乐歌单链接/ID导入
- 🏷️ 智能识别歌曲曲风、标签和语种
- 🎨 美观的用户界面
- 🔍 强大的筛选功能
- 📋 支持筛选结果导出
- 💻 响应式设计，支持各种设备

## 🚀 部署指南

### 后端部署

本项目后端使用 [NeteaseCloudMusicApi](https://gitlab.com/Binaryify/neteasecloudmusicapi)，你可以选择以下方式部署：

1. 使用 Vercel 一键部署（推荐）：
   - 访问 [NeteaseCloudMusicApi](https://gitlab.com/Binaryify/neteasecloudmusicapi)
   - 点击仓库中的 "Deploy with Vercel" 按钮
   - 按照提示完成部署

2. 本地部署：
   ```bash
   # 克隆仓库
   git clone https://gitlab.com/Binaryify/neteasecloudmusicapi.git
   
   # 安装依赖
   npm install
   
   # 启动服务
   npm start
   ```

### 前端配置

1. 找到 `src/view/HomeView.tsx` 文件
2. 修改 `apiUrl` 变量为你的后端服务地址：
   ```typescript
   const apiUrl = 'https://你的后端服务地址'  // 例如：https://your-netease-api.vercel.app
   ```

## 📖 使用说明

1. 输入歌单
   - 复制网易云音乐歌单链接或 ID
   - 粘贴到输入框中
   - 点击"获取歌单"按钮

2. 分析歌曲
   - 歌单加载完成后，点击"分析曲风"按钮
   - 等待分析完成（分析时间取决于歌单大小）

3. 筛选功能
   - 曲风筛选：选择一个或多个曲风标签
   - 标签筛选：选择一个或多个音乐标签
   - 语种筛选：选择特定语种
   - BPM范围：通过滑块选择速度范围
   - 点击"重置筛选"可清除所有筛选条件

4. 导出结果
   - 筛选完成后，点击"复制歌曲列表"
   - 筛选后的歌曲列表将被复制到剪贴板


## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📝 许可证

[MIT License](LICENSE)
