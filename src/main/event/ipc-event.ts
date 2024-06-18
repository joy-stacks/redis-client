import { BrowserWindow, ipcMain } from "electron";

export default function initIpcEvent() {
  ipcMain.on("app:close", (_, type: string) => {
    let win: BrowserWindow | null = null;
    switch (type) {
      case "main":
        win = global.mainWin;
        break;
    }
    win?.close();
  });

  ipcMain.on("app:min", (_, type: string) => {
    let win: BrowserWindow | null = null;
    switch (type) {
      case "main":
        win = global.mainWin;
        break;
    }
    win?.minimize();
  });

  ipcMain.on("app:max", (_, type: string) => {
    let win: BrowserWindow | null = null;
    switch (type) {
      case "main":
        win = global.mainWin;
        break;
    }
    const ismax = win?.isMaximized();
    if (ismax) {
      win?.restore();
    } else {
      win?.maximize();
    }
    win?.webContents.send("app:is:max", !ismax);
  });
}
