const writeGeneralSpreadsheet = async (sheet, data, adsRows) => {
  await sheet.clear()

  let headers = [
    'CAMPAIGN NAME',
    'ADSET NAME',
    'AD NAME',
    'CAMPAIGN ID',
    'ADSET ID',
    'AD ID',
    'REACH',
    'IMPRESSIONS',
    'SPEND',
    'INLINE LINK CLICKS',
    'INLINE LINK CLICKS CTR',
    'COST PER INLINE LINK CLICK',
    'LEADS',
    'COST PER LEAD'
  ]

  await sheet.setHeaderRow(headers)

  data.forEach(async (item, index) => {
    adsRows.push([
      item.campaign_name,
      item.adset_name,
      item.ad_name,
      item.campaign_id,
      item.adset_id,
      item.ad_id,
      item.reach,
      item.impressions,
      item.spend,
      item.inline_link_clicks,
      item.inline_link_click_ctr,
      item.cost_per_inline_link_click,
      item.actions?.[0].value,
      item.cost_per_action_type?.[0].value
    ])
  })

  await sheet.addRows(adsRows, { raw: true })

  await sheet.loadCells('A1:Q1')

  const a1 = await sheet.getCell(0, 0)
  const b1 = await sheet.getCell(0, 1)
  const c1 = await sheet.getCell(0, 2)
  const d1 = await sheet.getCell(0, 3)
  const e1 = await sheet.getCell(0, 4)
  const f1 = await sheet.getCell(0, 5)
  const g1 = await sheet.getCell(0, 6)
  const h1 = await sheet.getCell(0, 7)
  const i1 = await sheet.getCell(0, 8)
  const j1 = await sheet.getCell(0, 9)
  const k1 = await sheet.getCell(0, 10)
  const l1 = await sheet.getCell(0, 11)
  const m1 = await sheet.getCell(0, 12)
  const n1 = await sheet.getCell(0, 13)
  const o1 = await sheet.getCell(0, 14)
  const p1 = await sheet.getCell(0, 15)
  const q1 = await sheet.getCell(0, 16)

  a1.textFormat = { bold: true }
  b1.textFormat = { bold: true }
  c1.textFormat = { bold: true }
  d1.textFormat = { bold: true }
  e1.textFormat = { bold: true }
  f1.textFormat = { bold: true }
  g1.textFormat = { bold: true }
  h1.textFormat = { bold: true }
  i1.textFormat = { bold: true }
  j1.textFormat = { bold: true }
  k1.textFormat = { bold: true }
  l1.textFormat = { bold: true }
  m1.textFormat = { bold: true }
  n1.textFormat = { bold: true }
  o1.textFormat = { bold: true }
  p1.textFormat = { bold: true }
  q1.textFormat = { bold: true }

  await sheet.updateDimensionProperties('rows', { pixelSize: 30 }, {})

  await sheet.saveUpdatedCells()
}

const writeLeadsSpreadsheet = async (leadSheet, leadSheetData, adsRows, leadsRows) => {
  // get all the rows from Zapier leads sheet
  const leadsData = await leadSheetData.getRows()

  let leadsHeaders = [
    'FIRST NAME',
    'LAST NAME',
    'E-MAIL',
    'PHONE',
    'ADSET NAME',
    'ADSET ID',
    'AD ID',
    'COST PER RESULT AD SET',
    'COST PER RESULT AD',
    'CREATED AT'
  ]

  // set lead sheet headers
  await leadSheet.setHeaderRow(leadsHeaders)

  await leadSheet.loadCells('A1:J1')

  const la1 = await leadSheet.getCell(0, 0)
  const lb1 = await leadSheet.getCell(0, 1)
  const lc1 = await leadSheet.getCell(0, 2)
  const ld1 = await leadSheet.getCell(0, 3)
  const le1 = await leadSheet.getCell(0, 4)
  const lf1 = await leadSheet.getCell(0, 5)
  const lg1 = await leadSheet.getCell(0, 6)
  const lh1 = await leadSheet.getCell(0, 7)
  const li1 = await leadSheet.getCell(0, 8)
  const lj1 = await leadSheet.getCell(0, 9)

  la1.textFormat = { bold: true }
  lb1.textFormat = { bold: true }
  lc1.textFormat = { bold: true }
  ld1.textFormat = { bold: true }
  le1.textFormat = { bold: true }
  lf1.textFormat = { bold: true }
  lg1.textFormat = { bold: true }
  lh1.textFormat = { bold: true }
  li1.textFormat = { bold: true }
  lj1.textFormat = { bold: true }

  await leadSheet.updateDimensionProperties('rows', { pixelSize: 30 }, {})

  await leadSheet.saveUpdatedCells()

  leadsData.forEach((item, index) => {
    //get cost per lead
    const adSetIdRow = adsRows.filter(row => row[4] == item['adset_id'])
    const adIdRow = adsRows.filter(row => row[5] == item['ad_id'])
    let costPerLead = ''
    let costPerLeadAd = adIdRow[0]?.[13]

    if (adSetIdRow.length === 1) {
      costPerLead = adIdRow[0]?.[13]
    }

    if (adSetIdRow.length > 1) {
      let numberOfLeads = 0
      let totalCostSpent = 0

      adSetIdRow.forEach(adSet => {
        numberOfLeads = numberOfLeads + (adSet[12] === undefined ? 0 : parseInt(adSet[12], 10))
        totalCostSpent = totalCostSpent + (adSet[8] === undefined ? 0 : parseFloat(adSet[8]))
        costPerLead = parseFloat(totalCostSpent / numberOfLeads)
      })
    }

    leadsRows.push([
      item['First Name'],
      item['Last Name'],
      item['Email'],
      item['Phone'],
      item['Ad Set Name'],
      item['adset_id'],
      item['ad_id'],
      costPerLead,
      costPerLeadAd,
      new Date().toISOString().slice(0, 10)
    ])
  })

  await leadSheet.addRows(leadsRows, { raw: true })
}

const writeLeadsBackupSpreadsheet = async (leadSheetDataBkp, leadSheetData) => {
  // get all the rows from Zapier leads sheet
  const leadsData = await leadSheetData.getRows()
  let leadsBackupRows = []

  let leadsBackupHeaders = [
    'FIRST NAME',
    'LAST NAME',
    'E-MAIL',
    'PHONE',
    'ADSET NAME',
    'ADSET ID',
    'AD ID',
    'CREATED AT'
  ]

  // set lead sheet headers
  await leadSheetDataBkp.setHeaderRow(leadsBackupHeaders)

  await leadSheetDataBkp.loadCells('A1:H1')

  const la1 = await leadSheetDataBkp.getCell(0, 0)
  const lb1 = await leadSheetDataBkp.getCell(0, 1)
  const lc1 = await leadSheetDataBkp.getCell(0, 2)
  const ld1 = await leadSheetDataBkp.getCell(0, 3)
  const le1 = await leadSheetDataBkp.getCell(0, 4)
  const lf1 = await leadSheetDataBkp.getCell(0, 5)
  const lg1 = await leadSheetDataBkp.getCell(0, 6)
  const lh1 = await leadSheetDataBkp.getCell(0, 7)

  la1.textFormat = { bold: true }
  lb1.textFormat = { bold: true }
  lc1.textFormat = { bold: true }
  ld1.textFormat = { bold: true }
  le1.textFormat = { bold: true }
  lf1.textFormat = { bold: true }
  lg1.textFormat = { bold: true }
  lh1.textFormat = { bold: true }

  await leadSheetDataBkp.updateDimensionProperties('rows', { pixelSize: 30 }, {})

  await leadSheetDataBkp.saveUpdatedCells()

  leadsData.forEach((item, index) => {
    leadsBackupRows.push([
      item['First Name'],
      item['Last Name'],
      item['Email'],
      item['Phone'],
      item['Ad Set Name'],
      item['adset_id'],
      item['ad_id'],
      new Date().toISOString().slice(0, 10)
    ])
  })

  await leadSheetDataBkp.addRows(leadsBackupRows, { raw: true })
}

const deleteLeadsSpreadsheet = async leadSheetData => {
  await leadSheetData.clear()

  let leadsHeaders = [
    'First Name',
    'Last Name',
    'Email',
    'Phone',
    'Ad Set Name',
    'adset_id',
    'ad_id',
    'created time',
    'cost per result - ad set',
    'cost per result - ad'
  ]

  // set lead sheet headers
  await leadSheetData.setHeaderRow(leadsHeaders)
}

module.exports = {
  writeGeneralSpreadsheet,
  writeLeadsSpreadsheet,
  writeLeadsBackupSpreadsheet,
  deleteLeadsSpreadsheet
}
