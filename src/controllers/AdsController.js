const { spreadsheetConnect, setSheets } = require('../modules/spreadsheetConnect')
const getFacebookData = require('../modules/getFacebookData')
const {
  writeGeneralSpreadsheet,
  writeLeadsSpreadsheet,
  writeLeadsBackupSpreadsheet,
  deleteLeadsSpreadsheet,
  rebuildLeadsSpreadsheet
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
  },

  async clean(req, res) {
    try {
      // connect to Google Spreadsheets
      const adsDoc = await spreadsheetConnect()
      // get spreadsheets
      const { leadSheet } = await setSheets(adsDoc)

      const leadsDeleteData = await leadSheet.getRows()

      let date = new Date()

      date.setDate(date.getDate() - 7)

      const dateLimitYear = date.getFullYear()
      const dateLimitDay = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`
      const dateLimitMonth =
        date.getUTCMonth() + 1 > 9 ? date.getUTCMonth() + 1 : `0${date.getUTCMonth() + 1}`
      const dateLimit = `${dateLimitYear}-${dateLimitMonth}-${dateLimitDay}`
      const dateLimitMiliSeconds = Date.parse(dateLimit)

      const leadsToKeep = leadsDeleteData.filter(
        item => Date.parse(item['CREATED AT']) > dateLimitMiliSeconds
      )

      await rebuildLeadsSpreadsheet(leadSheet, leadsToKeep)

      res.json({ success: true })
    } catch (error) {
      console.log(error)
      res.json({ success: false, error })
    }
  }
}
