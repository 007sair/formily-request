import { GlobalXRequest, LoggerLevel } from "./type";
import { stringify } from "./utils";

export class Logger {
  private debug: boolean;
  private prefix: string;
  private onLog?: GlobalXRequest["onLog"];

  constructor(
    debug: boolean,
    prefix: string = "FormilyRequest",
    onLog?: GlobalXRequest["onLog"]
  ) {
    this.debug = debug;
    this.prefix = prefix;
    this.onLog = onLog;
  }

  private formatMessage(level: LoggerLevel, message: string, data?: any) {
    const timestamp = new Date().toLocaleString();
    let msg = `[${timestamp}][${this.prefix}][${level}]:${message} `;
    if (data !== undefined) {
      msg += stringify(data);
    }
    return msg;
  }

  info(message: string, data?: any) {
    const msg = this.formatMessage("INFO", message, data);
    this.onLog?.("INFO", msg);
    if (!this.debug) return;
    console.info(msg);
  }

  warn(message: string, data?: any) {
    const msg = this.formatMessage("WARN", message, data);
    this.onLog?.("WARN", msg);
    if (!this.debug) return;
    console.warn(msg);
  }

  error(message: string, data?: any) {
    const msg = this.formatMessage("ERROR", message);
    this.onLog?.("ERROR", msg, data);
    if (!this.debug) return;
    console.error(msg, data); // 错误信息也输出到控制台
  }

  group(label: string) {
    if (!this.debug) return;
    console.group(this.formatMessage("GROUP", label));
  }

  groupEnd() {
    if (!this.debug) return;
    console.groupEnd();
  }
}
