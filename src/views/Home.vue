<template>
  <section class="container">
    <!-- v-if="user.name" -->
    <div class="search-box">
      <div class="row-box">
        <div class="form-item">
          <label class="label-text date-s-label">日期</label>
          <div style="display: flex;align-items: center;">
            <div @click="dateSelector('startDate')">
              <input disabled type="text" placeholder="请选择开始日期" class="input" v-model="startDate" />
            </div>
          </div>
          <div class="form-item">
            <span class="center-txt date-e-lable">至</span>
            <div @click="dateSelector('endDate')">
              <input disabled type="text" placeholder="请选择结束日期" class="input" v-model="endDate" />
            </div>
          </div>
          <div class="form-item">
            <label class="label-text state-lable">状态</label>
            <div style="display: flex;align-items: center;" @click="stateSelector">
              <input disabled type="text" placeholder="请选择状态" class="input state-input" v-model="currState" />
            </div>
          </div>
        </div>
      </div>
      <div class="row-box">
        <div class="form-item">
          <label class="label-text keywords-label">状态</label>
          <div style="display: flex;align-items: center;">
            <input type="text" placeholder="关键字搜索" class="input keywords-input" v-model="keywords" />
          </div>
        </div>
        <button class="search-btn" @click="doSearch">查询</button>
      </div>
    </div>
    <div class="approval-items">
      <scroller ref="listRef" :on-refresh="refresh" :on-infinite="infinite">
        <div class="approval-item-box" v-for="(item, index) in list" :key="item.AppID">
          <div
            class="approval-type"
            :class="{ gw: item.TEM_Name.indexOf('公文') !== -1, qt: item.TEM_Name.indexOf('公文') === -1 }"
          >
            {{ item.TEM_Name.indexOf('公文') !== -1 ? '公文' : '其他' }}
          </div>
          <div class="approval-item">
            <div class="title dwwo-2">{{ index + 1 }}. {{ item.AppO_Title }}</div>
            <div class="sub-title">
              <div class="applier">发起人：{{ getApplyName(item) }}</div>
              <div class="task-name dwote">节点：{{ item.AppD_Name }}</div>
              <div class="handle">当前处理人：{{ item.regNames }}</div>
            </div>
          </div>
        </div>
      </scroller>
    </div>
  </section>
</template>

<script>
import { API } from '@/api'
import request from '@/utils/httpUtil'
import { getLastDayOfMonthStr, getFirstDayOfMonthStr } from '@/utils/DateTimeUtil'
import { mapModules } from 'vuet'

export default {
  mixins: [mapModules({ home: 'home' })],
  data() {
    return {
      isLoading: false,
      currPage: 0,
      pageSize: 20,
      stateOptions: ['全部', '办理中', '已结束', '暂停'],
      list: [],
      currState: '办理中',
      keywords: '',
      startDate: '2020-10-01' || getFirstDayOfMonthStr(),
      endDate: getLastDayOfMonthStr()
    }
  },
  mounted() {
    dd.biz.navigation.setTitle({
      title: 'OA公文审批进度查询', // 控制标题文本，空字符串表示显示默认文本
      onSuccess: function(result) {},
      onFail: function(err) {}
    })
  },
  methods: {
    getApplyName(item) {
      return [
        'gzszfkyzrhsd_a8290550-f2ba-42e4-bc21-10a8d77c4561',
        'wgfkyzrhsd_f81a50c5-6c98-4f65-b35d-22ff248bc69b'
      ].includes(item.Form_ID)
        ? '保密'
        : item.UserName
    },
    dateSelector(key) {
      dd.biz.util.datepicker({
        format: 'yyyy-MM-dd', // 注意：format只支持android系统规范，即2015-03-31格式为yyyy-MM-dd
        value: this[key], // 默认显示日期
        onSuccess: result => {
          if (result.value) {
            if (
              key === 'startDate' &&
              this.endDate &&
              new Date(result.value).getTime() > new Date(this.endDate).getTime()
            ) {
              dAlert('开始日期不能大于结束日期')
            } else if (
              key === 'endDate' &&
              this.startDate &&
              new Date(this.startDate).getTime() > new Date(result.value).getTime()
            ) {
              dAlert('结束日期不能小于开始日期')
            } else {
              this[key] = result.value
            }
          }
        },
        onFail: function(err) {}
      })
    },
    stateSelector() {
      dd.device.notification.actionSheet({
        title: '请选择流程状态', // 标题
        cancelButton: '取消', // 取消按钮文本
        otherButtons: this.stateOptions,
        onSuccess: result => {
          if (result.buttonIndex !== -1) {
            this.currState = this.stateOptions[result.buttonIndex]
          }
          // onSuccess将在点击button之后回调
          /* {
            buttonIndex: 0 //被点击按钮的索引值，Number，从0开始, 取消按钮为-1
        } */
        },
        onFail: function(err) {}
      })
    },
    doSearch() {
      this.$refs.listRef.triggerPullToRefresh()
    },
    refresh(done) {
      this.getApprovalList(
        1,
        data => {
          this.currPage = 1
          this.list = data
          done && done()
        },
        done
      )
    },
    infinite(done) {
      this.getApprovalList(
        this.currPage + 1,
        data => {
          if (data.length === 0) {
            done(true)
          } else {
            this.currPage += 1
            this.list = this.list.concat(data)
            done()
          }
        },
        done
      )
    },
    getApprovalList(pageNo, successcb, errorCb) {
      let params = {
        formid: '_',
        apvResult: '同意',
        module: 'OA查看审核审批进度',
        task: '查询经办审核审批进度',
        payload: {
          strWFStatus: this.stateOptions.indexOf(this.currState) - 1,
          strTitle: this.keywords || '',
          strBginTimeL: this.startDate,
          strBginTimeR: this.endDate,
          intPageNo: pageNo,
          intPageSize: 20,
          strFlowType: '',
          strPrivacy: '',
          strGwspStatus: '',
          strIsSec: ''
        }
      }
      request
        .post(API.DINGTALK_GET_APPROVAL_PROGRESS, params)
        .then(res => {
          console.log(res)
          let data = res.data || {}
          if (data.errorCode === 0) {
            // this.list = data.data || []
            console.log(data.data.data)
            successcb && successcb(data.data.data || [])
          } else {
            errorCb && errorCb()
            dAlert(data.msg || '查询失败')
          }
        })
        .catch(err => {
          errorCb && errorCb()
          console.error(`请求${API.DINGTALK_MICROAPP_USER}失败`, err)
        })
    }
  }
}
</script>

<style lang="less">
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
      width: 80px;
    }
    .input {
      width: 190px;
      font-size: 26px;
      height: 66px;
    }
    .state-input {
      width: 120px;
    }
    .keywords-label {
      width: 80px;
    }
    .keywords-input {
      width: 435px;
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
