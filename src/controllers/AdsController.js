const { spreadsheetConnect, setSheets } = require('../modules/spreadsheetConnect')
const getFacebookData = require('../modules/getFacebookData')
const {
  writeGeneralSpreadsheet,
  writeLeadsSpreadsheet,
  writeLeadsBackupSpreadsheet,
  deleteLeadsSpreadsheet
} = require('../modules/writeSpreadsheet')

module.exports = {
  async index(req, res, next) {
    try {
      // connect to Google Spreadsheets
      const adsDoc = await spreadsheetConnect()
      // get spreadsheets
      const { sheet, leadSheet, leadSheetData, leadSheetDataBkp } = await setSheets(adsDoc)
      // get data from Facebook
      const data = await getFacebookData(req.query)
      let adsRows = []
      let leadsRows = []

      if (data) {
        await writeGeneralSpreadsheet(sheet, data, adsRows)
        await writeLeadsSpreadsheet(leadSheet, leadSheetData, adsRows, leadsRows)
        await writeLeadsBackupSpreadsheet(leadSheetDataBkp, leadSheetData)

        await deleteLeadsSpreadsheet(leadSheetData)

        res.json({ success: true })
      }
    } catch (error) {
      console.log(error)
      res.json({ success: false, error })
    }
  }
}
