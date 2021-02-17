const axios = require('axios')
const { GoogleSpreadsheet } = require('google-spreadsheet')

module.exports = {
  async index(req, res, next) {
    try {
      const { date_preset = 'today', limit = 10 } = req.query
      const doc = new GoogleSpreadsheet('1T04AHrX1jMQo-f4LDNwiVg7JUq1SeVLA16s8eDoL1P0')

      await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(new RegExp('\\\\n', 'g'), '\n')
      })

      await doc.loadInfo() // loads document properties and worksheets

      await doc.updateProperties({ title: 'Swift - Facebook ADs Insights' })

      const sheet = doc.sheetsByIndex[0] // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

      sheet.updateProperties({ title: 'General' })

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

        let rows = []

        data.forEach(async (item, index) => {
          rows.push([
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

        await sheet.addRows(rows, { raw: true })

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

        res.json({ success: true })
      }
    } catch (error) {
      console.log(error)
      res.json({ success: false, error })
    }
  }
}
