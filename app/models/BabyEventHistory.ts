import { EventEnum } from "./BabyEvent"
const TABLE_NAME = "BabyEventHistory"
const CREATE_SQL = `CREATE TABLE "BabyEventHistory" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "eventtime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "info" JSON NOT NULL,
    "event_type" TEXT  NOT NULL,
    "baby_info" TEXT NOT NULL REFERENCES "BabyInfo" ("name") ON DELETE CASCADE,
  );`
const INDEX_SQL = `CREATE INDEX "idx_babyeventhistory__baby_info" ON "BabyEventHistory" ("baby_info");`

const InitBabyEventHistory = async (db: Database | null) => {
    if (db === null) {
        console.error(`InitBabyEventHistory db not init`);
    } else {
        if (!db.isOpen()) {
            console.log(`db not open`);
        } else {
            try {
                await db.execSQL(CREATE_SQL);
                await db.execSQL(INDEX_SQL);
                console.info(`create table ${TABLE_NAME} ok`);
            } catch (err) {
                console.error(`create table ${TABLE_NAME} get error ${err}`);
            }
        }
    }
}

const AddEvent = async (db: Database | null, event: EventEnum) => {
    if (db === null) {
        console.error(`AddEvent db not init`);
    } else {
        if (!db.isOpen()) {
            console.log(`db not open`);
        } else {
            const Insert_SQL = ``
            try {
                await db.execSQL(INDEX_SQL);
                console.info(`add event ${TABLE_NAME} ok`);
            } catch (err) {
                console.error(`create table ${TABLE_NAME} get error ${err}`);
            }
        }
    }
}

export { InitBabyEventHistory }