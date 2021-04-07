const { spreadsheetConnect, setSheets } = require('../modules/spreadsheetConnect')
const getFacebookData = require('../modules/getFacebookData')
const {
  writeGeneralSpreadsheet,
  writeLeadsSpreadsheet,
  deleteLeadsSpreadsheet,
  rebuildLeadsSpreadsheet
} = require('../modules/writeSpreadsheet')

module.exports = {
  async index(req, res) {
    let data = false
    let adsRows = []
    const adsDoc = await spreadsheetConnect() // connect to Google Spreadsheets
    const { sheet } = await setSheets(adsDoc) // get spreadsheets

    while (!data) {
      try {
        data = await getFacebookData(req.query) // get data from Facebook
      } catch (error) {
        console.log(error)
      }
    }

    if (data) {
      await writeGeneralSpreadsheet(sheet, data, adsRows)
      res.json({ success: true })
    }
  },

  async leads(req, res) {
    let data = false

    try {
      const adsDoc = await spreadsheetConnect()
      const { sheet, leadSheet, leadSheetData, leadSheetDataBkp } = await setSheets(adsDoc)

      while (!data) {
        data = await sheet.getRows()
      }

      let leadsRows = []

      if (data) {
        await writeLeadsSpreadsheet(leadSheet, leadSheetData, data, leadsRows)
        // await writeLeadsBackupSpreadsheet(leadSheetDataBkp, leadSheetData)

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
      const adsDoc = await spreadsheetConnect()
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
