const axios = require('axios')

const getUnbounceData = async query => {
  const response = await axios.get(
    `https://graph.facebook.com/v9.0/act_502570590155794/insights?access_token=${process.env.FACEBOOK_API_ACCESS_TOKEN}&date_preset=lifetime&level=ad&fields=account_name,campaign_name,adset_name,ad_name,campaign_id,adset_id,ad_id,reach,impressions,spend,inline_link_clicks,inline_link_click_ctr,cost_per_inline_link_click,actions,cost_per_action_type&limit=900&filtering=[{field: "action_type",operator:"IN", value: ["offsite_conversion.custom.361426947869119"]}]&sort=['adset_id_descending']`
  )

  const { data } = await response.data

  return data
}

module.exports = getUnbounceData