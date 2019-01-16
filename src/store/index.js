import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        // volume etc
        previousVolume: '',
        volume: 75,
        volumeAdjust: false,
        muted: false,
        // timer
        refreshInterval: 10000,
        interval: '',
        count: '',
        currentTime: 0,
        timerInterval: null,
        timerRunning: false,
        timerPaused: false,
        // refactor to single object with current and history
        songInfo: '',
        songHistory: '',
        // toggles
        history: false,
        isPlaying: false,
        // refactor streams 8006 8004
        streamIp: 'http://136.0.16.57:',
        streamPort: 8000,
        streamSuffix: '/.stream',
        historyUrl: 'https://radiomv.org/samHTMweb/',
    },
    mutations: {
        historyToggle(state) {
            state.history = !state.history
        },
        setSongInfo(state, payload) {
            state.songInfo = payload.song_info
            state.songHistory = payload.song_history
        },
        isPlaying(state, value) {
            state.isPlaying = value
        }
    },
    actions: {
        getSongInfo({ commit }) {
            axios
              .get('https://radiomv.org/samHTMweb/info1.json')
              .then(res => res.data)
              .then(payload => {
                  commit('setSongInfo', payload)
              })
              .catch(err => {
                window.alert(err)
              })
          },
        setIsPlaying({ commit }, payload) {
            commit('isPlaying', payload)
        }
    },
    getters: {
        history(state) {
            return state.history
        }
    }
  })