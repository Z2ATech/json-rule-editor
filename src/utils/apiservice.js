// import axios from 'axios'
import axios from 'axios'
export async function getAuthTokens(URL, payload, redirect_uri) {
  if (payload.code) {
    const data = new FormData()
    data.append('grant_type', 'authorization_code')
    data.append('client_id', '5dncsjfvgeuu9qmot7rgg9o202')
    data.append('code', payload.code)
    data.append('redirect_uri', redirect_uri)

    var details = {
      grant_type: 'authorization_code',
      client_id: '5dncsjfvgeuu9qmot7rgg9o202',
      code: payload.code,
      redirect_uri: redirect_uri,
    }

    var formBody = []
    for (var property in details) {
      var encodedKey = encodeURIComponent(property)
      var encodedValue = encodeURIComponent(details[property])
      formBody.push(encodedKey + '=' + encodedValue)
    }
    formBody = formBody.join('&')

    const res = await axios({
      method: 'POST',
      url: URL,
      data: formBody,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    return res
  }
}

export async function readRule(URL, id_token) {
  const res = await axios({
    method: 'POST',
    url: URL,
    data: {
      operation: 'read',
    },
    headers: {
      'Content-Type': 'application/json',
      Authorization: id_token,
    },
  })
  return res
}

export async function createRule(URL, id_token, rule) {
  const ruleJson = {...rule, rule_name: rule.name}
  delete ruleJson.name
  const data = {
    operation: 'create',
    ruleJson
  }
  const res = await axios({
    method: 'POST',
    url: URL,
    data,
    headers: {
      'Content-Type': 'application/json',
      Authorization: id_token,
    },
  })
  return res
}

export async function updateRule(URL, id_token, rule) {
  const data = {
    operation: 'update',
    ruleJson: { ...rule },
  }
  const res = await axios({
    method: 'POST',
    url: URL,
    data,
    headers: {
      'Content-Type': 'application/json',
      Authorization: id_token,
    },
  })
  return res
}
