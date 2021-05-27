const axios = require('axios')

const getFacebookData = async query => {
  const response = await axios.get(
    `https://graph.facebook.com/v10.0/act_502570590155794/insights?access_token=${process.env.FACEBOOK_API_ACCESS_TOKEN}&date_preset=last_90d&level=ad&fields=account_name,campaign_name,adset_name,ad_name,campaign_id,adset_id,ad_id,reach,impressions,spend,inline_link_clicks,inline_link_click_ctr,cost_per_inline_link_click,actions,cost_per_action_type&limit=300&filtering=[{field: "action_type",operator:"IN", value: ["lead"]}]&sort=['adset_id_descending']`
  )

  const { data } = await response.data

  return data
}

module.exports = getFacebookData
