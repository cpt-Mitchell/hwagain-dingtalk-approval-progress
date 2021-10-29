<template>
  <div>
    <div style="display: flex; justify-content: space-between">
      <button class="search-btn" @click="$router.go(-1)">返回上级</button>
    </div>
    <div class="pdf" v-show="fileType === 'pdf'">
      <!-- <vue-element-loading
      :active="isLoading"
      color="#0099ff"
      is-full-screen
      :text-style="{fontSize:'.36rem'}"
      spinner="spinner"
      :text="loadingText"
    /> -->
      <p class="arrow" v-if="!$parent.pdfLoading">
        <span :class="{ select: idx == 0 }" @touchstart="idx = 0" @touchend="idx = -1" @click="scaleD">放大</span>
        <span
          :class="{ select: idx == 1, grey: scale === 100 }"
          @touchstart="idx = 1"
          @touchend="idx = -1"
          @click="scaleX"
          >缩小</span
        >
        <span
          :class="{ select: idx == 2, grey: scale === 100 }"
          @touchstart="idx = 2"
          @touchend="idx = -1"
          @click="scaleReset"
          >还原</span
        >
        <span
          @click="changePdfPage(0)"
          @touchstart="idx = 3"
          @touchend="idx = -1"
          :class="{ grey: currentPage == 1, select: idx == 3 }"
          >上一页</span
        >
        {{ currentPage }} / {{ pageCount }}
        <span
          @touchstart="idx = 4"
          @touchend="idx = -1"
          @click="changePdfPage(1)"
          :class="{ grey: currentPage == pageCount, select: idx == 4 }"
          >下一页</span
        >
      </p>
      <div style="-webkit-overflow-scrolling: touch;box-sizing:border-box;height:calc(100vh - 230px);overflow:auto;">
        <pdf
          ref="wrapper"
          :src="src"
          :page="currentPage"
          @progress="loadedRatio = $event"
          @num-pages="pageCount = $event"
          @page-loaded="pageLoaded($event)"
          @loaded="loadPdfHandler"
        ></pdf>
      </div>
    </div>
  </div>
</template>
<script>
import pdf from 'vue-pdf'
import { API2 } from '@/api'
import request from '@/utils/httpUtil'
// import * as DingTalkApi from 'dingtalk-jsapi'
export default {
  //   props: {
  //     url: {
  //       type: String,
  //       required: true
  //     }
  //   },
  components: { pdf },
  data() {
    return {
      //   isLoading: true,
      //   loadingText: '文件加载中',
      idx: -1,
      url: '',
      loadedRatio: 0,
      scale: 100, // 放大系数
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: 'pdf', // 文件类型
      src: '' // pdf文件地址
    }
  },
  mounted() {
    // this.getUrl()
  },
  created() {
    this.url = 'https://www.hwagain.cn/hwagain-doc-test/files/董事长提出的关于OA界面的问题反馈.pdf'
    this.$parent.pdfLoading = true
    // 有时PDF文件地址会出现跨域的情况,这里最好处理一下
    const headers = {
      'Authorization': 'Bearer ' + this.$store.state.loginUser.token
      // 'x-ipp-device-uuid': 'SOME_UUID',
      // 'x-ipp-client': 'SOME_ID',
      // 'x-ipp-client-version': 'SOME_VERSION'
    }
    this.src = pdf.createLoadingTask({
      httpHeaders: headers,
      // url: 'public/test.pdf'
      url: this.url
    })
    // this.src = pdf.createLoadingTask({
    //   httpHeaders: headers,
    //   // url: 'public/test.pdf'
    //   url: 'pdf/test.pdf'
    // })
    // this.src = pdf.createLoadingTask(this.url)
  },
  methods: {
    getUrl() {
      let params = {
        readId: this.$route.query.readId || ''
      }
      request.get(process.env.VUE_APP_BASE_API2 + API2.GET_PDF_INFO, { params }).then(res => {
        if (res.data.code === 1000) {
          this.src = res.data.data || ''
        } else {
          dAlert(res.data.message || '查询失败')
        }
      })
    },
    pageLoaded(e) {
      this.$parent.pdfLoading = false
      this.currentPage = e
    },
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage(val) {
      // console.log(val)
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
      }
    },
    // pdf加载时
    loadPdfHandler(e) {
      //   this.isLoading = false
      this.currentPage = 1 // 加载的时候先加载第一页
    },
    // 放大
    scaleD() {
      this.scale += 5
      // this.$refs.wrapper.$el.style.transform = "scale(" + this.scale + ")";
      this.$refs.wrapper.$el.style.width = parseInt(this.scale) + '%'
    },
    // 缩小
    scaleX() {
      if (this.scale === 100) {
        return
      }
      this.scale += -5
      this.$refs.wrapper.$el.style.width = parseInt(this.scale) + '%'
      // this.$refs.wrapper.$el.style.transform = "scale(" + this.scale + ")";
    },
    scaleReset() {
      this.scale = 100
      this.$refs.wrapper.$el.style.width = 100 + '%'
    }
  }
}
</script>
<style lang="less" scoped>
.arrow {
  text-align: center;
  margin: 0 auto;
  z-index: 1000;
  height: 40px;
  line-height: 40px;
  background: #fff;
  font-size: 14px;
}
span {
  padding: 0 5px;
  &.grey {
    color: grey;
  }
  &:not(.grey) {
    color: #333;
  }
}
.select {
  color: #fff;
  background-color: #c59c5a;
  p {
    border-right: 0 none;
  }
}
.search-btn {
  padding: 16px 60px;
  border: none;
  background: #0099ff;
  color: #fff;
  // margin-left: 25px;
  &:active {
    opacity: 0.8;
  }
}
</style>
