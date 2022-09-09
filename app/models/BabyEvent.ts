
// const TABLE_NAME = "BabyEvent"
// const CREATE_SQL = `CREATE TABLE "BabyEvent" (
//     "id" INTEGER PRIMARY KEY AUTOINCREMENT,
//     "name" TEXT NOT NULL,
//     "description" TEXT NOT NULL
//   );`

enum EventEnum {
    StartBreastFeeding = "StartBreastFeeding",
    ENDBreastFeeding = "ENDBreastFeeding",
    StartMilkFeeding = "StartMilkFeeding",
    ENDMilkFeeding = "ENDMilkFeeding",
    StartComplementaryFeeding = "StartComplementaryFeeding",
    ENDComplementaryFeeding = "ENDComplementaryFeeding",
    PooPoo = "PooPoo",
    StartSleep = "StartSleep",
    ENDSleep = "ENDSleep",
    StartDiseased = "StartDiseased",
    EndDiseased = "EndDiseased"
}
// const INSERT_SQL = `INSERT INTO "BabyEvent" (name,description)
// VALUES
// 	('${EventEnum.StartBreastFeeding}','开始喂母乳'),
// 	('${EventEnum.ENDBreastFeeding}','喂母乳结束'),
//     ('${EventEnum.StartMilkFeeding}','开始喂牛奶'),
// 	('${EventEnum.ENDMilkFeeding}','喂牛奶结束'),
//     ('${EventEnum.StartComplementaryFeeding}','开始喂辅食'),
// 	('${EventEnum.ENDComplementaryFeeding}','喂辅食结束'),
//     ('${EventEnum.PooPoo}','排便'),
//     ('${EventEnum.StartSleep}','开始睡觉'),
//     ('${EventEnum.ENDSleep}','结束睡觉'),
//     ('${EventEnum.StartDiseased}','开始生病'),
//     ('${EventEnum.EndDiseased}','结束生病');`

// const InitBabyEvent = async (db: Database | null) => {
//     if (db === null) {
//         console.error(`InitBabyEvent db not init`);
//     } else {
//         if (!db.isOpen()) {
//             console.log(`db not open`);
//         } else {
//             try {
//                 await db.execSQL(CREATE_SQL);
//                 await db.execSQL(INSERT_SQL);
//                 console.info(`create table ${TABLE_NAME} ok`);
//             } catch (err) {
//                 console.error(`create table ${TABLE_NAME} get error ${err}`);
//             }
//         }
//     }
// }

export { EventEnum }