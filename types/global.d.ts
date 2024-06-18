/*
 * @Author: JOY
 * @Date: 2024-06-18 09:54:43
 * @LastEditors: JOY
 * @LastEditTime: 2024-06-18 10:19:10
 * @Description:
 */
import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {};
  }
}

export {};
