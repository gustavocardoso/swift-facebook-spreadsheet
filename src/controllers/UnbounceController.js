const { spreadsheetConnect, setSheets } = require('../modules/spreadsheetConnect')
const getUnbounceData = require('../modules/getUnbounceData')
const {
  writeUnbounceSpreadsheet,
  writeUnbounceLeadsSpreadsheet,
  deleteUnbounceLeadsSpreadsheet
} = require('../modules/writeSpreadsheet')

module.exports = {
  async index(req, res) {
    let data = false
    let adsRows = []
    const adsDoc = await spreadsheetConnect()
    const { unbounceSheet } = await setSheets(adsDoc)

    while (!data) {
      try {
        data = await getUnbounceData(req.query) // get data from Facebook
      } catch (error) {
        console.log(error)
      }
    }

    if (data) {
      await writeUnbounceSpreadsheet(unbounceSheet, data, adsRows)
      res.json({ success: true })
    }
  },

  async leads(req, res) {
    let data = false
    let leadsRows = []
    const adsDoc = await spreadsheetConnect()
    const { unbounceSheet, leadSheet, unbounceSheetData } = await setSheets(adsDoc)

    while (!data) {
      data = await unbounceSheet.getRows()
    }

    if (data) {
      await writeUnbounceLeadsSpreadsheet(leadSheet, unbounceSheetData, data, leadsRows)
      await deleteUnbounceLeadsSpreadsheet(unbounceSheetData)
      res.json({ success: true })
    }
  }
}
