
const TABLE_NAME = "BabyInfo"
const CREATE_SQL = `CREATE TABLE "BabyInfo" (
  "name" TEXT NOT NULL PRIMARY KEY,
  "gender" TEXT NOT NULL,
  "birthtime" DATETIME NOT NULL,
  "sleeping" BOOLEAN DEFAULT false,
  "eating" TEXT NOT NULL DEFAULT 'NotEating',
  "diseased" BOOLEAN NOT NULL DEFAULT false,
  "displaying" BOOLEAN NOT NULL DEFAULT false,
  "freezed" BOOLEAN NOT NULL DEFAULT false
);`

const InitBabyInfo = async (db: Database | null) => {
  if (db === null) {
    console.error(`InitBabyInfo db not init`);
  } else {
    if (!db.isOpen()) {
      console.log(`db not open`);
    } else {
      try {
        await db.execSQL(CREATE_SQL);
        console.info(`create table ${TABLE_NAME} ok`);
      } catch (err) {
        console.error(`create table ${TABLE_NAME} get error ${err}`);
      }
    }
  }
}

const GetAllBabies = async (db: Database | null): Promise<Array<string>> => {
  if (db === null) {
    throw "GetAllBabys db not init"
  } else {
    const SQL = `
  SELECT name
  FROM ${TABLE_NAME}
  `
    let rows = await db.all(SQL)
    let res: string[] = []
    for (let row of rows) {
      res.push(row[0])
    }
    return res
  }
}


interface BabyInfoModel {
  name: string
  gender: string
  birthtime: string
  sleeping: boolean
  eating: string
  diseased: boolean
}
interface OpenData {
  isFirstUse: boolean;
  babyName?: string;
  babyList?: Array<string>;
}
const GetDisplayingBabyInfo = async (db: Database | null): Promise<OpenData> => {
  if (db === null) {
    throw "GetDisplayingBabyInfo db not init"
  } else {
    let SQL = `
    SELECT name
    FROM BabyInfo
    WHERE freezed=false 
    AND displaying=true
    `
    let row = await db.get(SQL)
    console.log("&&&&&&&")
    console.log(row)
    if (row === null || row.length === 0) {
      return { isFirstUse: true }
    } else {
      let isFirstUse = false
      console.log(row)
      let babyName: string = row[0]
      let babyList = await GetAllBabies(db)
      return { isFirstUse, babyName, babyList }
    }
  }
}

interface BabyInfoBaseModel {
  name: string
  gender: string
  birthtime: string
}
const CreateNewBaby = async (db: Database | null, data: BabyInfoBaseModel) => {
  if (db === null) {
    throw "CreateNewBaby db not init"
  } else {
    let InsertSQL = `
    INSERT INTO BabyInfo(name,gender,birthtime,displaying)
    VALUES ('${data.name}','${data.gender}','${data.birthtime}',false);
    `
    // let ResetSQL = `UPDATE BabyInfo SET displaying = false WHERE displaying = true and name <> '${data.name}'`
    try {
      await db.execSQL(InsertSQL)
    } catch (e) {
      console.error(`insert babyinfo get error: ${e}`)
      console.error(`insert babyinfo sql: ${InsertSQL}`)
      throw e
    }
    // try {
    //   await db.execSQL(ResetSQL)
    // } catch (e) {
    //   console.error(`insert babyinfo reset display get error: ${e}`)
    //   throw e
    // }
  }
}

const GetBaby = async (db: Database | null, name: string): Promise<BabyInfoModel> => {
  if (db === null) {
    throw "GetBaby db not init"
  } else {
    const GetSQL = `
      SELECT name,
      gender,
      birthtime,
      sleeping,
      eating,
      diseased
      FROM ${TABLE_NAME}
      WHERE name='${name}' AND freezed=false 
    `
    let row = await db.get(GetSQL)
    if (row === null || row.length === 0) {
      throw "Baby Not Exist"
    }
    let babyStatus: BabyInfoModel = {
      name: row[0],
      gender: row[1],
      birthtime: row[2],
      sleeping: row[3] === "1" ? true : false,
      eating: row[4],
      diseased: row[5] === "1" ? true : false
    }

    return babyStatus
  }
}
const ChangeDisplayingBaby = async (db: Database | null, name: string) => {
  if (db === null) {
    throw "ChangeDisplayingBaby db not init"
  } else {
    const GetSQL = `
    SELECT name
    FROM ${TABLE_NAME}
    WHERE name='${name}' AND freezed=false 
  `
    let row = await db.get(GetSQL)
    if (row === null || row.length === 0) {
      throw "Baby Not Exist"
    }
    const ResetSQL = `UPDATE BabyInfo SET displaying = false WHERE displaying = true and name <> '${name}'`
    const SetSQL = `UPDATE BabyInfo SET displaying = true WHERE name = '${name}'`
    try {
      await db.execSQL(ResetSQL)
    } catch (e) {
      console.error(`Resetc display get error: ${e}`)
      console.error(`Reset sql: ${ResetSQL}`)
      throw e
    }
    try {
      await db.execSQL(SetSQL)
    } catch (e) {
      console.error(`Set display get error: ${e}`)
      console.error(`Set sql: ${ResetSQL}`)
      throw e
    }
  }
}


export { InitBabyInfo, GetDisplayingBabyInfo, OpenData, CreateNewBaby, BabyInfoBaseModel, GetAllBabies, GetBaby, BabyInfoModel, ChangeDisplayingBaby }