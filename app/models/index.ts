import Sqlite from "nativescript-sqlite";
import { InitBabyInfo, GetDisplayingBabyInfo, OpenData, CreateNewBaby, BabyInfoBaseModel, GetAllBabies, GetBaby, ChangeDisplayingBaby } from "./BabyInfo"
import { InitBabyEvent } from "./BabyEvent"
import { InitBabyEventHistory } from "./BabyEventHistory"

const debug = process.env.NODE_ENV !== 'production';
const DB_NAME = "MyCoolApp.sqlite"
var DB: Database | null = null

const initDB = async (): Promise<boolean> => {
  if (debug && Sqlite.exists(DB_NAME)) {
    console.log(`debug mode delete db ${DB_NAME}!`);
    Sqlite.deleteDatabase(DB_NAME);
  }
  if (Sqlite.exists(DB_NAME)) {
    console.log(`Load db ${DB_NAME} ok!`);
    DB = await Sqlite(DB_NAME);
    return false
  } else {
    DB = await Sqlite(DB_NAME);
    if (DB.isOpen()) {
      console.log(`we open db ${DB_NAME} yet (Promise based)`);
      return true
    } else {
      console.log(`we did not open db ${DB_NAME} yet (Promise based)`);
      return false
    }
  }

}
//Init 初始化数据库
const Init = async () => {
  let need_init = await initDB()
  if (need_init) {
    await InitBabyEvent(DB)
    await InitBabyInfo(DB)
    await InitBabyEventHistory(DB)
  }
}
//Close 关闭数据库
const Close = async () => {
  if (DB) {
    await DB.close()
  }
}

const GetOpenData = async (): Promise<OpenData> => {
  return await GetDisplayingBabyInfo(DB)
}
const GetBabyList = async (): Promise<Array<string>> => {
  return await GetAllBabies(DB)
}

const RegistBaby = async (data: BabyInfoBaseModel): Promise<Array<string>> => {
  await CreateNewBaby(DB, data)
  let babyList = await GetBabyList()
  return babyList
}

const ChangeToBaby = async (name: string): Promise<string> => {
  await ChangeDisplayingBaby(DB, name)
  return name
}

interface BabyInfo {
  name: string
  gender: string
  birthtime: string
  sleeping: boolean | Date
  eating: string
  eatingattime: boolean | Date
  diseased: boolean
}
const GetBabyInfo = async (name: string): Promise<BabyInfo> => {
  let res = await GetBaby(DB, name)
  let r: BabyInfo = {
    name: "",
    gender: "",
    birthtime: "",
    sleeping: false,
    eating: "",
    eatingattime: false,
    diseased: false
  }
  Object.assign(r, res)
  Object.assign(r, { eatingattime: false })
  return r
}

export { Init, Close, GetOpenData, OpenData, RegistBaby, BabyInfoBaseModel, BabyInfo, ChangeToBaby, GetBabyInfo }
