const axios = require('axios')
const { GoogleSpreadsheet } = require('google-spreadsheet')

module.exports = {
  async index(req, res, next) {
    try {
      const { date_preset = 'today', limit = 100 } = req.query
      const adsDoc = new GoogleSpreadsheet(`${process.env.GOOGLE_SPREADSHEET_ID}`)
      const leadsDoc = new GoogleSpreadsheet(`${process.env.GOOGLE_LEADS_SPREADSHEET_ID}`)

      await adsDoc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(new RegExp('\\\\n', 'g'), '\n')
      })

      await leadsDoc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(new RegExp('\\\\n', 'g'), '\n')
      })

      // loads document properties and worksheets
      await adsDoc.loadInfo()
      await leadsDoc.loadInfo()

      // // set new sheet
      // const newSheet = await adsDoc.addSheet({ title: 'Leads' })

      // set the spreadsheet title
      await adsDoc.updateProperties({ title: 'Swift - Facebook ADs Insights' })

      // get the general sheet by index
      const sheet = adsDoc.sheetsByIndex[0] // or use adsDoc.sheetsById[id] or adsDoc.sheetsByTitle[title]

      // get the leads sheet by index
      const leadSheet = adsDoc.sheetsByIndex[1]

      // get Zapier leads sheet
      const zapierLeadSheet = leadsDoc.sheetsByIndex[0]

      sheet.updateProperties({ title: 'General' })
      leadSheet.updateProperties({ title: 'Leads' })

      // get data from Facebook
      const response = await axios.get(
        `https://graph.facebook.com/v9.0/act_502570590155794/insights?access_token=${process.env.FACEBOOK_API_ACCESS_TOKEN}&date_preset=${date_preset}&level=ad&fields=account_name,campaign_name,adset_name,ad_name,campaign_id,adset_id,ad_id,reach,impressions,spend,inline_link_clicks,inline_link_click_ctr,cost_per_inline_link_click,actions,cost_per_action_type&limit=${limit}&filtering=[{field: "action_type",operator:"IN", value: ["lead"]}]`
      )

      const { data } = await response.data

      if (data) {
        await sheet.clear()

        let headers = [
          'CAMPAIGN NAME',
          'ADSET NAME',
          'AD NAME',
          'CAMPAIGN ID',
          'ADSET ID',
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

        let adsRows = []

        data.forEach(async (item, index) => {
          adsRows.push([
            item.campaign_name,
            item.adset_name,
            item.ad_name,
            item.campaign_id,
            item.adset_id,
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

        await sheet.loadCells('A1:P1')

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

        await sheet.updateDimensionProperties('rows', { pixelSize: 30 }, {})

        await sheet.saveUpdatedCells()

        // get all the rows from Zapier leads sheet
        const leadsData = await zapierLeadSheet.getRows()

        await leadSheet.clear()

        let leadsHeaders = [
          'FIRST NAME',
          'LAST NAME',
          'E-MAIL',
          'PHONE',
          'ADSET NAME',
          'ADSET ID',
          'COST PER RESULT'
        ]

        // set lead sheet headers
        await leadSheet.setHeaderRow(leadsHeaders)

        await leadSheet.loadCells('A1:G1')

        const la1 = await leadSheet.getCell(0, 0)
        const lb1 = await leadSheet.getCell(0, 1)
        const lc1 = await leadSheet.getCell(0, 2)
        const ld1 = await leadSheet.getCell(0, 3)
        const le1 = await leadSheet.getCell(0, 4)
        const lf1 = await leadSheet.getCell(0, 5)
        const lg1 = await leadSheet.getCell(0, 6)

        la1.textFormat = { bold: true }
        lb1.textFormat = { bold: true }
        lc1.textFormat = { bold: true }
        ld1.textFormat = { bold: true }
        le1.textFormat = { bold: true }
        lf1.textFormat = { bold: true }
        lg1.textFormat = { bold: true }

        await leadSheet.updateDimensionProperties('rows', { pixelSize: 30 }, {})

        await leadSheet.saveUpdatedCells()

        let leadsRows = []

        leadsData.forEach(item => {
          //get cost per lead
          const adSetIdRow = adsRows.filter(row => row[4] == item['adset_id'])
          let costPerLead = ''

          if (adSetIdRow[0] != undefined) {
            costPerLead = adSetIdRow[0][12]
          }

          leadsRows.push([
            item['First Name'],
            item['Last Name'],
            item['Email'],
            item['Phone'],
            item['Ad Set Name'],
            item['adset_id'],
            costPerLead
          ])
        })

        await leadSheet.addRows(leadsRows, { raw: true })

        res.json({ success: true })
      }
    } catch (error) {
      console.log(error)
      res.json({ success: false, error })
    }
  }
}
