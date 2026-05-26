# MIMS API 測試工具 (MIMS Test App)

這是一個用於測試 MIMS FastTrack API 的情境模擬 **Prototype**

## 🚀 Quick Start

啟動此專案需要同時運行 **後端 (Python)** 與 **前端 (React)** 服務。

### 1. 準備工作 (Prerequisites)

在使用之前，請確保電腦已安裝以下工具：

- 安裝 **`uv`**（ Python 套件管理工具 ）：
    - **Mac/Linux**: 開啟終端機並輸入：
      `curl -LsSf https://astral.sh/uv/install.sh | sh`
    - **Windows**: 開啟 PowerShell 並輸入：
      `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`

- **安裝 Node.js** (前端運行環境)：
- 請至 [nodejs.org](https://nodejs.org/en/download/) 下載並安裝 **LTS 版本**。

---

### 2. 啟動後端服務 (Backend)

請在 `MIMS Test app` 根目錄下開啟終端機，執行以下指令：

```bash
# uv 會自動安裝 Python 環境、依賴套件並啟動伺服器
uv run uvicorn main:app --reload

```

> **確認狀態：** 當看到 `Uvicorn running on http://127.0.0.1:8000` 字樣，代表後端已成功啟動。

---

### 3. 啟動前端介面 (Frontend)

請開啟**另一個**新的終端機視窗，進到 `MIMS Test App/frontend` 資料夾：

```bash
# 第一次執行請先安裝套件 (只需執行一次)
npm install

# 啟動開發者模式
npm run dev

```

> **確認狀態：** 當看到 `Local: http://localhost:5173/`，代表介面已準備就緒。

---

### 4. 開始測試

打開瀏覽器並前往：**[http://localhost:5173](https://www.google.com/search?q=http://localhost:5173)**
