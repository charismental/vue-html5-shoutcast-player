<template>
  <div id="app">
    <div id="player">
      <div class="item item-pic">
        <div class="album">
            <img :src="picSrc" :alt="songInfo.title" />
        </div>
      </div>
      <div class="item item-play">
        <div class="play-button-div"><div class="play-button paused"  @click="playPause" @keyup.space="playPause" :class="[isPlaying ? 'playing' : 'paused']">
          <audio id="audio" :src="currentStream">
                Your browser does not support the audio element.
          </audio>
        </div>
        </div>
      </div>
      <div class="item item-meta">
          <span class="song-name">{{ songInfo.title | uppercase | truncate(22) }}</span>
          <span class="artist">{{ songInfo.artist }}</span>
          <span class="album-name">{{ songInfo.album | truncate(36) }}</span>
      </div>
      <div class="item item-history">
          <i class="material-icons md-36">history</i>
      </div>
      <div class="item"></div>
      <div class="item item-volume">
        <div class="volume"><i class="material-icons md-36">volume_up</i></div>
      </div>
      <div class="item radios">
        <input @change="pause" type="radio" id="hq" value="http://136.0.16.57:8000/.stream" v-model="currentStream">
        <label for="hq">HQ</label>
        <input @change="pause" type="radio" id="mq" value="http://136.0.16.57:8006/.stream" v-model="currentStream">
        <label for="mq">MQ</label>
        <input @change="pause" type="radio" id="lq" value="http://136.0.16.57:8004/.stream" v-model="currentStream">
        <label for="lq">LQ</label>
      </div>
      <div class="item item-timer">
        <div class="timer">{{ time || "00:00" }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'app',
  data() {
    return {
      count: '',
      currentTime: 0,
      timerInterval: null,
      timerRunning: false,
      timerPaused: false,
      currentStream: 'http://136.0.16.57:8000/.stream',
      isPlaying: false,
      songInfo: '',
      refreshInterval: 10000,
      interval: '',
      url: 'https://radiomv.org/samHTMweb/info.json',
    }
  },
  filters: {
    uppercase: function(value) {
      return value.toUpperCase()
    },
    truncate: function(value, limit) {
      if (value.length > limit) {
        value = value.substring(0, (limit - 3)) + '...'
      }
      return value
    }
  },
  methods: {
    timerRun() {
      this.timerRunning = true
      this.timerInterval = setInterval(this.countupTimer, 1000)
    },
    timerPause() {
      this.timerRunning = false
      clearInterval(this.timerInterval)
    },
    timerReset() {
      this.timerRunning = false
      clearInterval(() => { this.interval })
      this.currentTime = 0
    },
    countupTimer() {
      if(this.timerRunning == true) {
        this.currentTime++
      }
    },
    pause() {
      // eslint-disable-next-line
      audio.pause()
      this.isPlaying = false
      this.timerPause()
    },
    playPause() {
      // eslint-disable-next-line
      if (audio.paused) {
        // eslint-disable-next-line
        audio.play()
        this.isPlaying = true
        this.timerRun()
      } else {
        this.pause()
      }
    },
    getSongInfo() {
      axios
        .get(this.url)
        .then(response => {
          this.songInfo = response.data.song_info
        })
        .catch(error => {
          window.alert(error)
        })
    }
  },
  computed: {
    picSrc() {
      const url = 'https://radiomv.org/samHTMweb/'
      if (this.songInfo.picture) {
        return `${url}${this.songInfo.picture}`
      }else {
        return `${url}customMissing.jpg`
      }
    },
    time: function() {
      return this.minutes + ":" + this.seconds
    },
    minutes: function() {
      var min = Math.floor(this.currentTime / 60)
      return min >= 10 ? min : '0' + min
    },
    seconds: function() {
      var sec = this.currentTime - (this.minutes * 60)
      return sec >= 10 ? sec : '0' + sec
    }
  },
  created() {
    this.getSongInfo()
    this.interval = setInterval(this.getSongInfo, this.refreshInterval)
    window.addEventListener('keydown', (e) => {
      if (e.key == ' ') {
        this.playPause()
      }
    })
  }
}
</script>

<style>
#player {
  margin: auto;
  background-color: #202136;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  margin-top: 50px;
  max-width: 540px;
  display: grid;
  grid-template-columns: 120px 60px auto 80px 40px;
  grid-template-rows: repeat(3, 50px);
}
.album {
  padding: 8px;
  height: 100%;
  vertical-align: middle;
}
.item-pic {
  grid-row: span 3;
}
.album img {
  display: inline-block;
  margin-left: auto;
  margin-right: auto;
  max-height: 134px;
  max-width: 104px;
  border: 2px solid white;
  border-radius: 15px;
}
.item-play {
  grid-row: span 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.play-button {
  width: 50px;
  height: 50px;
  cursor: pointer;
  margin-left: auto;
  margin-right: auto;
}
.play-button.paused {
  background: url("./assets/play.svg");
  background-size: cover; }
.play-button.playing {
  background: url("./assets/pause.svg");
  background-size: cover; }
.item-meta {
  grid-row: span 2;
  grid-column: span 2;
}
.item-meta span {
  padding-left: 6px;
}
.item-meta span.song-name {
  font-family: "Open Sans", sans-serif;
  font-weight: 400;
  font-size: 24px;
  color: #fff;
  display: block; }
.item-meta span.artist {
  font-family: "Open Sans", sans-serif;
  font-weight: 100;
  font-size: 14px;
  color: #fff;
  display: block; }
.item-meta span.album-name {
    font-family: "Open Sans", sans-serif;
    font-weight: 200;
    font-size: 16px;
    color: #fff;
    display: block; }
.item-history {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}
.material-icons.md-36 { font-size: 36px; }

.item-volume {
  grid-row: span 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.volume {
  margin-left: auto;
  margin-right: auto;
  color: white;
  cursor: pointer;
}
.item-timer {
  grid-column: span 2;
  font-size: 36px;
  font-family: 'Yantramanav', sans-serif;
  font-weight: 100;
  text-align: center;
  color: white;
}
.timer {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.radios {
  margin-top: 10px;
}
.radios label {
  color: white;
}
</style>
