import VueScroller from 'vue-scroller'
import '@/registerServiceWorker'
import '@/utils/errorLog'
// import 'lib-flexible/flexible'
import 'lib-flexible'
import '@/assets/main.less'

// eslint-disable-next-line
/* eslint-disable  no-undef */
export const initPlugins = _vue => {
  _vue.use(VueScroller)
  const FastClick = require('fastclick')
  FastClick.attach(document.body)

  window.dAlert = function(msg, cb1, cb2) {
    dd.device.notification.alert({
      message: msg,
      title: '提示', // 可传空
      buttonName: '确定',
      onSuccess: function() {
        cb1 && cb1()
      },
      onFail: function(err) {
        cb2 && cb2(err)
      }
    })
  }

  window.dConfirm = function(msg, cb1, cb2) {
    dd.device.notification.confirm({
      message: msg,
      title: '提示',
      buttonLabels: ['取消', '确定'],
      onSuccess: data => {
        if (data.buttonIndex === 1) {
          cb1 && cb1()
        } else {
          cb2 && cb2()
        }
      },
      onFail: data => {
        dAlert(data.message)
      }
    })
  }
}
