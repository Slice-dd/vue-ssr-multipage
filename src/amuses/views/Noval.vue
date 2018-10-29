<template>
  <div class="signle-poetry">
    <h1>小说榜排行榜</h1>
    <div v-for="i in signleData" :key="i.bid" class="noval-item">
      <div class="item">
        <p>{{i.bookname}}</p>
      </div>

      <div class="item">
        <p>介绍：{{i.introduction}}</p>
      </div>

      <div class="item">
        <p>标签：<el-tag type="success" v-for="tag in i.tag" :key="tag">{{tag}}</el-tag>  </p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  asyncData({ store, router }) {
    return store.dispatch("FETCH_SINGLEPOETRY");
  },
  computed: {
    signleData() {
      console.log(this.$store.state.singlePoetry);
      return this.$store.state.singlePoetry;
    }
  },
  filters: {
    tagFormat(val) {
      return 
    }
  }
};
</script>

<style lang="stylus">
.signle-poetry {
  text-align: left;

  .describe {
    font-size: 12px;
    margin-bottom: 16px;
    color: #999;
  }

  h1 {
    margin-bottom: 16px
    text-align center
  }

  .noval-item {
    padding-bottom 16px
    margin-bottom 16px
    border-bottom 1px solid #ddd
  }

  .item {
    margin-bottom: 16px;
    position: relative;

    .el-tag {
      margin-right: 8px;
    }
  }
}
</style>