<template>
  <div id="app">
    <el-container style="height: 100%">
      <el-header class="page-header">
        <Headers></Headers>
      </el-header>

      <el-container class="page-content">
        <el-aside width="200px" class="sider">
          <el-menu :router="true" default-active="/amuses" class="el-menu-vertical-demo" background-color="#dae0ea" text-color="#7480a0" active-text-color="#3a8be6" :collapse="false">
            
            <el-menu-item index="/amuses">
              <i class="el-icon-document"></i>
              <span>热门小说</span>
            </el-menu-item>

            <el-menu-item index="/amuses/recommendPoetry">
              <i class="el-icon-edit"></i>
              <span>个性网名</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main>
          <transition name="fade" mode="out-in">
            <router-view class="view"></router-view>
          </transition>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
import Headers from "./components/Headers.vue"


export default {
  components: {
    Headers
  }
};
</script>

<style lang="stylus">
html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, font, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, table, caption, tbody, tfoot, thead, tr, th, td {
  margin: 0;
  padding: 0;
  border: 0;
  outline: 0;
  vertical-align: baseline;
  background: transparent;
}

*, *:before, *:after {
  box-sizing: border-box;
}

div:focus {
  outline: none;
}

a:focus, a:active {
  outline: none;
}

a, a:focus, a:hover {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}

.clearfix {
  &:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: ' ';
    clear: both;
    height: 0;
  }
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 15px;
  background-color: lighten(#eceef1, 30%);
  margin: 0;
  color: #34495e;
}

html, body, #app {
  height: 100%;
}

.page-content {
  height: calc(100% - 60px);
}

.page-content .sider {
  height: 100%;
}

.page-header {
  background: linear-gradient(10deg, #6c84b3, #bbd2ff);
}

.view {
  text-align: center;
}

.page-content .sider .el-menu-vertical-demo {
  height: 100%;
}

.fade-enter-active, .fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter, .fade-leave-active {
  opacity: 0;
}

@media (max-width: 860px) {
  .header .inner {
    padding: 15px 30px;
  }
}

@media (max-width: 600px) {
  .header {
    .inner {
      padding: 15px;
    }

    a {
      margin-right: 1em;
    }

    .github {
      display: none;
    }
  }
}
</style>
