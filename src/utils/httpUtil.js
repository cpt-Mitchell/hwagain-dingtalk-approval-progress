import axios from 'axios'
import * as DingTalkApi from 'dingtalk-jsapi'
import { API } from '@/api'
import vuet from '@/vuet'

/* eslint-disable no-undef */
const fetch = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '',
  timeOut: 5000
})

// const userStorage = function() {
//   return DingTalkApi.util.domainStorage.getItem({ name: 'loginuser' }).then(res => {
//     window.localStorage.setItem('ding_user_id', res.userid || '')
//     return res.userid || ''
//   })
// }

fetch.interceptors.request.use(
  config => {
    if (config.url !== API.DINGTALK_USERID) {
      config.headers.common['Authorization'] = 'eyJhbGciOiJSUzI1NiJ9.eyJ1c2VySWQiOiJBMjAyMjUwIiwidXNlcm5hbWUiOiLpu47mmIznm5siLCJleHAiOjE2NDk5MTc0OTd9.Zm7v94KWBUgiXsAsKo6mS2TU0R6MoS-a9wBz8_fFsMBQXcwozesPOvvTgPSqXO7uC8hwAgZy_FR5NvpQDcAMdXwYI1xUmYET5Ijfa3WWmMqs17oq9FC2JAtFaQWvfn7HWJjw6Mwm6dlbJXKzscmBDJyXWO4o4qph_Be56kOFD78' || vuet.modules.home._LOGINUSER_.token
    }
    return config
  },
  error => {
    console.error(error)
  }
)

fetch.interceptors.response.use(
  res => {
    return res
  },
  error => {
    if (error.response) {
      let errMsg = (error.response && error.response.data && error.response.data.msg) || ''
      switch (error.response.status) {
        case 500:
          errMsg = errMsg || '系统异常: errorCode = 500'
          break
        case 503:
          errMsg = errMsg || '系统异常: 503,后台服务未启动'
          break
        case 400:
          errMsg = errMsg || '提交参数异常'
          break
        case 401:
          errMsg = '登录失效，将重新获取用户信息'
          DingTalkApi.util.domainStorage.removeItem({ name: 'loginuser' })
          break
        case 404:
          errMsg = errMsg || '访问接口不存在'
          break
      }
      if (error.response.status === 401) {
        // window.location.reload()
      } else if (errMsg) {
        dd.device.notification.alert({
          message: errMsg || error.response.msg || '',
          title: '系统提示',
          buttonName: '确定',
          onSuccess: function() {}
        })
      }
    }
    return Promise.reject(error.response)
  }
)
export default fetch
