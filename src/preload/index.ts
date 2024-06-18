/*
 * @Author: JOY
 * @Date: 2024-06-18 09:43:20
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-18 10:21:13
 * @Description:
 */
import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

const api = {};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = electronAPI;
  window.api = api;
}
