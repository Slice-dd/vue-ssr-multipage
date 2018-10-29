<template>
  <div class='dynasty-poetry'>
    <el-alert title='由于接口原因，暂不支持根据朝代进行模糊查询，即只能选择一种查询方式' type='warning' show-icon>
    </el-alert>

    <el-alert title='由于接口原因，诗词总数暂无法确定，即暂时提供一个相对值' type='warning' show-icon>
    </el-alert>

    <el-form :inline='true' :model='form' class='demo-form-inline'>

      <el-form-item label='模糊搜索'>
        <el-input v-model='form.name' placeholder='可搜索诗词名、诗词内容、诗词作者' @keyup.enter.native='onSubmit(true)'></el-input>
      </el-form-item>

      <el-form-item label='唐诗、宋词'>
        <el-select v-model='form.dynasty' placeholder='可选择唐诗、宋词'>
          <el-option label='唐诗' value='Tang'></el-option>
          <el-option label='宋词' value='Song'></el-option>
          <el-option label='无' value=''></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type='primary' @click='onSubmit'>搜索</el-button>
        <el-button type='info' @click='onDownload'>下载</el-button>
      </el-form-item>

    </el-form>

    <el-table ref='multipleTable' :data='poetryData' tooltip-effect='dark' style='width: 100%' @selection-change='handleSelectionChange'>

      <el-table-column type='selection' align='center' width='55'>
      </el-table-column>

      <el-table-column label='诗词名' align='center' width='250'>
        <template slot-scope='scope'>{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column prop='authors' align='center' label='作者' width='120'>
        <template slot-scope='scope'>
          <el-button @click='authorsDetail(scope.row.authors)' type='text'>{{scope.row.authors}}</el-button>
        </template>
      </el-table-column>

      <el-table-column label='首句' align='center'>
        <template slot-scope='scope'>{{ scope.row.content.split('|')[0] }}</template>
      </el-table-column>

      <el-table-column label='操作' align='center' width='200'>
        <template slot-scope='scope'>
          <el-button @click='checkPoetryDetail(scope.row)' type='text' size='small'>查看</el-button>
          <el-button type='text' size='small'>下载</el-button>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination background style='margin-top: 24px' v-if='!!form.dynasty && poetryData.length' :current-page.sync='paginationParams.page' :page-size.sync='paginationParams.count' layout='total, sizes, prev, pager, next, jumper' :total='total'>
    </el-pagination>

  </div>
</template>

<script>
import request from "../api";

export default {
  data() {
    return {
      form: {
        name: "",
        dynasty: ""
      },
      poetryData: [], // table poetry data
      selectData: [], // checkbox data,
      poetryDetailVisable: false,
      paginationParams: {
        page: 1,
        count: 10
      },
      
    };
  },
  computed: {
    total() {
      return this.form.dynasty === "Tang" ? 600000 : 800000;
    }
  },
  watch: {
    paginationParams: {
      handler() {
        this.onSubmit();
      },
      deep: true
    }
  },
  methods: {
    onSubmit(args) {
      const { dynasty, name } = this.form;

      if (!dynasty && !name) {
        return;
      }

      let params = this.paginationParams;

      if (args === true) {
        this.form.dynasty = "";
      } else if (args !== undefined) {
        params = {
          page: 1,
          count: 10
        };
      }

      if (dynasty) {
        return request
          .get(`/get${dynasty}Poetry`, {
            params: params
          })
          .then(res => {
            if (res.data.code && res.data.code === 200) {
              this.poetryData = res.data.result;
            }
          });
      }

      return request
        .get("/likePoetry", {
          params: {
            name: name
          }
        })
        .then(res => {
          if (res.data.code && res.data.code === 200) {
            this.poetryData = res.data.result;
          }
        });
    },
    authorsDetail(authors) {
      if (authors) {
        request
          .get("/searchAuthors", {
            params: {
              name: authors
            }
          })
          .then(res => {
            if (res.data.code && res.data.code === 200) {
              const { result } = res.data;
              this.$alert(result[0].desc, result[0].name, {
                customClass: 'dynasty-poetry-message'
              });
            }
          });
      } else {
        this.$message.error("暂无数据");
      }
    },
    checkPoetryDetail(row) {

      let { content } = row;

      content = content.split('|').map(item => {
        return `<p>${item}</p>`
      })

      this.$alert(content.join(''), row.title, {
        customClass: 'dynasty-poetry-message',
        dangerouslyUseHTMLString: true
      })
    },
    onDownload() {},
    handleSelectionChange() {
      // table checkbox handle select
    }
  }
};
</script>

<style lang='stylus'>

.dynasty-poetry-message
  .el-message-box__title, p
    text-align center

.dynasty-poetry {
  .el-alert {
    margin-bottom: 24px;
  }
}
</style>