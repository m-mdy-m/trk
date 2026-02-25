import path from "path";
import os from 'os';
export const TRK_DIR = path.join(os.homedir(), ".trk");
export const LOG_FILE = path.join(TRK_DIR, 'trk.log');
export const DB_PATH = path.join(TRK_DIR, 'trk.db');