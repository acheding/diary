import md5 from 'js-md5'
import axios from 'axios'

const state = () => ({
  info: '',
})

const actions = {
  async login({ commit, state, dispatch }, form) {
    // console.log(md5(md5("123456") + md5(md5("1424834523"))));
    if (form) {
      let data = {
        user: form.user,
        pwd: md5(md5(form.pwd) + md5(md5('1424834523'))),
      }
      const rst = await axios.post('/ache/login', data)
      if (rst.data) {
        commit('setUser', rst.data)
        commit('setCookie', data)
        axios.interceptors.request.use((config) => {
          config.headers['Authorization'] = data.user + '=' + data.pwd
          return config
        })
        return rst
      } else {
        return false
      }
    } else {
      if (document.cookie) {
        let strcookie = document.cookie //获取cookie字符串
        let arrcookie = strcookie.split('; ') //分割
        for (let i = 0; i < arrcookie.length; i++) {
          //遍历匹配
          let arr = arrcookie[i].split('=')
          if (arr[0] === 'user') {
            let data = {
              user: arr[1],
              pwd: arr[2],
            }
            const rst = await axios.post('/ache/login', data)
            if (rst.data) {
              commit('setUser', rst.data)
              axios.interceptors.request.use((config) => {
                config.headers['Authorization'] = data.user + '=' + data.pwd
                return config
              })
              return rst
            }
          }
        }
      }
    }
  },
}

const mutations = {
  setUser(state, info) {
    state.info = info
  },
  setCookie(state, userInfo) {
    let expTime = new Date()
    expTime.setTime(expTime.getTime() + 2 * 60 * 60 * 1000)
    document.cookie = 'user=' + userInfo.user + '=' + userInfo.pwd + ';expires=' + expTime.toUTCString()
  },
}

export default {
  namespaced: true,
  state,
  actions,
  mutations,
}
