const { GoogleSpreadsheet } = require('google-spreadsheet')

const spreadsheetConnect = async () => {
  const adsDoc = new GoogleSpreadsheet(`${process.env.GOOGLE_SPREADSHEET_ID}`)

  await adsDoc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY.replace(new RegExp('\\\\n', 'g'), '\n')
  })

  // set the spreadsheet title
  await adsDoc.updateProperties({ title: 'Swift - Facebook ADs Insights' })

  return adsDoc
}

const setSheets = async adsDoc => {
  // get the general sheet by index
  const sheet = adsDoc.sheetsByIndex[0] // or use adsDoc.sheetsById[id] or adsDoc.sheetsByTitle[title]

  // get the leads sheet by index
  const leadSheet = adsDoc.sheetsByIndex[1]

  // get the leads data sheet by index
  const leadSheetData = adsDoc.sheetsByIndex[2]

  // get the leads data backup sheet by index
  // const leadSheetDataBkp = adsDoc.sheetsByIndex[3]

  // get the Unbounce data sheet by index
  const unbounceSheetData = adsDoc.sheetsByIndex[3]

  // get the Unbounce sheet by index
  const unbounceSheet = adsDoc.sheetsByIndex[4]

  return {
    sheet,
    leadSheet,
    leadSheetData,
    // leadSheetDataBkp,
    unbounceSheet,
    unbounceSheetData
  }
}

module.exports = { spreadsheetConnect, setSheets }
