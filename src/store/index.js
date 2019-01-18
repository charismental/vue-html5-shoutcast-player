import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        // volume
        previousVolume: '',
        volume: 75,
        volumeAdjust: false,
        // fetch intervals
        refreshInterval: 10000,
        interval: '',
        // timer
        currentTime: 0,
        timerInterval: null,
        timerRunning: false,
        // meta objects
        songInfo: '',
        songHistory: '',
        // toggles
        history: false,
        isPlaying: false
    },
    mutations: {
        volumeAdjustToggle(state) {
            state.volumeAdjust = !state.volumeAdjust
        },
        updateVolume(state, payload) {
            state.volume = payload
        },
        setPreviousVolume(state, payload) {
            state.previousVolume = payload
        },
        countupTimer(state) {
            if(state.timerRunning) {
                state.currentTime++
            }
        },
        setTimerRunning(state, payload) {
            state.timerRunning = payload
        },
        setTimerInterval(state, payload) {
            state.timerInterval = payload
        },
        setSongInfo(state, payload) {
            state.songInfo = payload.song_info
            state.songHistory = payload.song_history
        },
        historyToggle(state) {
            state.history = !state.history
        },
        isPlaying(state, payload) {
            state.isPlaying = payload
        },
        newInterval(state, payload) {
            state.interval = payload
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
        playPause({ commit, dispatch }) {
            // eslint-disable-next-line
            if (audio.paused) {
                // eslint-disable-next-line
                audio.play()
                commit('isPlaying', true)
                dispatch('timerRun')
            } else {
                dispatch('pause')
            }
        },
        pause({ commit, dispatch }) {
            // eslint-disable-next-line
            audio.pause()
            commit('isPlaying', false)
            dispatch('timerPause')
        },
        timerRun({ state, commit }) {
            commit('setTimerRunning', true)
            commit('setTimerInterval', setInterval(function(){
                if(state.timerRunning) {
                    state.currentTime++
                }}, 1000))
        },
        timerPause({ state, commit }) {
            commit('setTimerRunning', false)
            clearInterval(state.timerInterval)
        },
        muteToggle({ state, commit }){
            if (state.volume == 0) {
                commit('updateVolume', state.previousVolume)
            } else {
                commit('setPreviousVolume', state.volume)
                commit('updateVolume', 0)
            }
        }
    }
  })