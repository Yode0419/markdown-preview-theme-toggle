# Markdown Preview Theme Toggle

個人使用的 VS Code 外掛，替 [Markdown Preview Github Styling](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles) 加上快速選擇預覽主題的入口。

開啟 VS Code **內建 Markdown 預覽**時，狀態列會出現 `MD Preview`。滑鼠停在上面即可看到主題清單，點選名稱套用。選單包含 Auto、System、Light、Light high contrast、Dark、Dark high contrast 和 Dark dimmed。目前選取的項目會顯示 VS Code 內建勾選圖示。狀態列按鈕本身沒有點擊動作。

外掛只修改 `markdown-preview-github-styles` 的 `colorTheme`、`lightTheme` 和 `darkTheme` 設定；不修改編輯器主題、Markdown CSS 或 Mermaid 設定。

## 在另一台電腦安裝

1. 安裝 [Markdown Preview Github Styling](https://marketplace.visualstudio.com/items?itemName=bierner.markdown-preview-github-styles)。
2. 從此 repo 的 **Releases** 下載最新版 `.vsix`。也可以自己依下節打包。
3. 在 VS Code 執行 **Extensions: Install from VSIX...**，選取下載的檔案。
4. 執行 **Developer: Reload Window**。

VSIX 安裝屬於當前 VS Code Profile，對這個 Profile 的所有工作區可用。VSIX 安裝的版本不會從 Marketplace 自動更新；升級時請下載並安裝新版 VSIX。

## 自行打包

需要 Node.js 與 npm。在 repo 根目錄執行：

```sh
npm ci
npm run package
```

輸出的 `markdown-preview-theme-toggle-<version>.vsix` 位於 repo 根目錄。也可以在 Windows、macOS 或 Linux 執行：

```sh
code --install-extension markdown-preview-theme-toggle-<version>.vsix
```

推送至 `main` 時，GitHub Actions 會打包並上傳建置成品。發布新版本時，先更新 `package.json` 的版本並推送，再推送同版本標籤（例如 `v0.9.0`）；工作流程會檢查版本一致並將 VSIX 附加到 GitHub Release。

## 開發

主要程式在 [`extension.js`](./extension.js)。修改後可執行 `node --check extension.js` 檢查語法，再重新打包與安裝。選單是 VS Code 原生 Markdown tooltip，連結外觀由 VS Code 控制，無法自訂整列的 hover 背景。
