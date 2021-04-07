const { spreadsheetConnect, setSheets } = require('../modules/spreadsheetConnect')
const {
  writeUnbounceLeadsSpreadsheet,
  deleteUnbounceLeadsSpreadsheet
} = require('../modules/writeSpreadsheet')

module.exports = {
  async index(req, res) {
    let data = false
    let leadsRows = []
    const adsDoc = await spreadsheetConnect()
    const { sheet, leadSheet, unbounceSheetData } = await setSheets(adsDoc)

    while (!data) {
      data = await sheet.getRows()
    }

    if (data) {
      await writeUnbounceLeadsSpreadsheet(leadSheet, unbounceSheetData, data, leadsRows)
      await deleteUnbounceLeadsSpreadsheet(unbounceSheetData)
      res.json({ success: true })
    }
  }
}
