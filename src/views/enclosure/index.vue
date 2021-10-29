<template>
  <section class="container">
    <!-- v-if="user.name" -->
    <div class="approval-items">
      <scroller ref="listRef" :on-refresh="refresh">
        <div class="approval-item-box" v-for="(item, index) in list" :key="item.AppID">
          <div class="approval-item" @click="goPDF(item)">
            <div class="title dwwo-2">{{ index + 1 }}. {{ item.fileName || '' }}</div>
            <!-- <div class="sub-title">
              <div class="applier">发布人：{{ item.issuer || '' }}</div>
            </div> -->
          </div>
        </div>
      </scroller>
    </div>
  </section>
</template>

<script>
import { Encrypt, Decrypt } from '@/components/AES.js'
import { API2 } from '@/api'
import request from '@/utils/httpUtil'
// import { getLastDayOfMonthStr, getFirstDayOfMonthStr } from '@/utils/DateTimeUtil'
import { mapModules } from 'vuet'
export default {
  mixins: [mapModules({ home: 'home' })],
  data() {
    return {
      isLoading: false,
      list: [],
      userId: '',
      userCode: ''
    }
  },
  components: {
    Encrypt
  },
  mounted() {
    this.getUserInfo()
    dd.biz.navigation.setTitle({
      title: '附件查阅列表', // 控制标题文本，空字符串表示显示默认文本
      onSuccess: function(result) {},
      onFail: function(err) {}
    })
    console.log(this.$route.query)
  },
  methods: {
    getUserInfo() {
      this.userId = this.home._LOGINUSER_.userid || 'A011814'
      if (this.userId) {
        this.userCode = Encrypt(this.userId)
        this.doSearch()
      }
    },
    stateSelector() {
      dd.device.notification.actionSheet({
        title: '请选择发布时间', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.stateOptions,
        onSuccess: result => {
          if (result.buttonIndex !== -1) {
            this.dataStr = this.stateOptions[result.buttonIndex]
          }
          // onSuccess将在点击button之后回调
          /* {
            buttonIndex: 0 //被点击按钮的索引值，Number，从0开始, 取消按钮为-1
        } */
        },
        onFail: function(err) {}
      })
    },
    goPDF(item) {
      this.$router.push({
        path: '/enclosureDetailed',
        query: item
      })
    },
    doSearch() {
      this.$refs.listRef.triggerPullToRefresh()
    },
    refresh(done) {
      this.getApprovalList(data => {
        this.list = data
        done && done()
      }, done)
    },
    getApprovalList(successcb, errorCb) {
      let params = {
        userCode: this.userCode || '',
        readId: this.$route.query.readId || ''
      }
      request
        .get(process.env.VUE_APP_BASE_API2 + API2.GET_ENCLOSURE_INFO, { params })
        .then(res => {
          let data = res.data.data || {}
          if (res.data.code === 1000) {
            successcb && successcb(data || [])
          } else {
            errorCb && errorCb()
            dAlert(data.msg || '查询失败')
          }
        })
        .catch(err => {
          errorCb && errorCb()
          console.error('请求失败', err)
        })
    }
  }
}
</script>

<style lang="less" scope>
.container {
  margin: 0 auto;
  min-height: 100vh;
  overflow: hidden;
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue',
    Arial, sans-serif;
  // display: block;
  color: #35495e;
  letter-spacing: 1px;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // text-align: center;
  .search-box {
    padding: 20px 10px;
    background: #fff;
    .row-box {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      flex-direction: row;
      &:not(:last-child) {
        margin-bottom: 15px;
      }
      .form-item {
        display: flex;
        align-items: center;
      }
    }
    .date-s-label {
      width: 100px;
    }
    .input {
      width: 190px;
      font-size: 26px;
      height: 66px;
    }
    .state-input {
      width: 350px;
    }
    .keywords-label {
      width: 120px;
    }
    .keywords-input {
      width: 350px;
    }
    .search-btn {
      padding: 16px 60px;
      border: none;
      background: #0099ff;
      color: #fff;
      margin-left: 25px;
      &:active {
        opacity: 0.8;
      }
    }
    .label-text {
      padding: 5px 10px;
      // margin-right: 5px;
      display: inline-block;
      text-align: center;
    }
    .center-txt {
      padding: 0 15px;
      display: inline-block;
    }
  }
  .approval-items {
    margin-top: 20px;
    height: calc(100vh - 160px - 20px);
    background: #fff;
    position: relative;
    .approval-item-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid #e6e6e6;
      .approval-type {
        width: 60px;
        height: 60px;
        font-size: 20px;
        color: #fff;
        align-items: center;
        display: flex;
        justify-content: center;
        border-radius: 50%;
        margin-left: 10px;
        &.gw {
          background: #0099ff;
        }
        &.qt {
          background: #00cc88;
        }
      }
    }
    .approval-item {
      display: block;
      padding: 20px 20px 10px;
      flex-grow: 1;
      width: 0;
      .title {
        font-size: 28px;
        color: #333;
        margin-bottom: 10px;
      }
      .sub-title {
        display: flex;
        justify-items: center;
        justify-content: space-between;
        & > div {
          font-size: 24px;
          color: #666;
        }
        .applier {
          width: 200px;
        }
        .handle {
          width: 240px;
          text-align: right;
        }
        .task-name {
          text-align: center;
          width: 220px;
          padding: 0 5px;
        }
      }
    }
  }
}
</style>
