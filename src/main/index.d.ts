/*
 * @Author: JOY
 * @Date: 2024-06-18 15:53:02
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-18 15:55:44
 * @Description:
 */
import { BrowserWindow } from "electron";

declare global {
  interface globalThis {
    mainWin?: BrowserWindow;
  }
}
