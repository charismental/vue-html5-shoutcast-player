<template>
  <div id="radio-player">
    <div id="history" v-show="history">
      <simplebar id="history-container" data-simplebar-auto-hide="true">
        <div class="history-item" v-for="(song, i) in songHistory" :key="i">
          <div class="history-album">
            <a :href="itemUrl(song)" target="_blank"><img :src="itemImg(song)" onerror="this.src='https://radiomv.org/samHTMweb/customMissing.jpg'" alt="song.title" class="history-img"></a>
          </div>
          <a :href="itemUrl(song)" target="_blank">
            <div class="history-meta marquee-container">
              <span class="song-name" :class="[song.title.length >= 26 ? 'marquee' : 'normal']">{{ song.title | uppercase }}</span>
              <span class="artist">{{ song.artist }}</span>
              <hr>
            </div>
          </a>
        </div>
      </simplebar>
      <div class="item item-history" id="clear" @click="history = !history">
        <i class="material-icons md-36" title="Click to return to Radio Player">clear</i>
      </div>
      <div class="item item-history paused" id="history-play" title="Play/Pause the Radio" @click="playPause" @keyup.space="playPause" :class="[isPlaying ? 'playing' : 'paused']">
        <!-- <i class="material-icons md-36" title="Play/Pause the Radio">play_circle_outline</i> -->
      </div>
      <div class="item item-history" id="history-volume" @click="muteToggle">
        
        <i class="material-icons md-36" v-if="volume > 0" title="Mute audio">volume_up</i>
        <i class="material-icons md-36" v-else title="Unmute audio">volume_off</i>

        <!-- <div class="volume" v-if="!volumeAdjust" @mouseenter="volumeAdjust = !volumeAdjust">
          <i class="material-icons md-36" v-if="volume > 0" title="Adjust volume">volume_up</i>
          <i class="material-icons md-36" v-else title="Adjust volume">volume_off</i>
        </div>
        <div class="volume volume-slider" v-else @mouseleave="volumeAdjust = !volumeAdjust">
          <input type="range" id="volume-slider" name="volume-slider" min="0" max="100" step="1" v-model="volume">
        </div> -->
      </div>
    </div>
    <div id="player" v-show="!history">
      <div class="item item-pic">
        <div class="album">
            <a :href="itemUrl(songInfo)" target="_blank"><img :src="itemImg(songInfo)" onerror="this.src='https://radiomv.org/samHTMweb/customMissing.jpg'" :alt="songInfo.title" /></a>
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
        <a :href="itemUrl(songInfo)" target="_blank">
          <div class="marquee-container"><span class="song-name" :class="[songInfo.title.length >= 22 ? 'marquee' : 'normal']">{{ songInfo.title | uppercase }}</span></div>
        </a>
        <span class="artist">{{ songInfo.artist }}</span>
        <div class="marquee-container"><span class="album-name" :class="[songInfo.album.length >= 36 ? 'marquee' : 'normal']">{{ songInfo.album }}</span></div>
        <br>
        <hr>
      </div>
      <div class="item item-history" @click="history = !history">
          <i class="material-icons md-36" title="Click to view recent history">history</i>
      </div>
      <div class="item"></div>
      <div class="item item-volume">
        <div class="volume" @click="muteToggle" v-if="!volumeAdjust" @mouseenter="volumeAdjust = !volumeAdjust">
          <i class="material-icons md-36" v-if="volume > 0" title="Adjust volume">volume_up</i>
          <i class="material-icons md-36" v-else title="Adjust volume">volume_off</i>
        </div>
        <div class="volume" v-else @touchend="volumeAdjust = !volumeAdjust" @mouseleave="volumeAdjust = !volumeAdjust">
          <input type="range" id="volume-slider" name="volume-slider" min="0" max="100" step="1" v-model="volume">
        </div>
      </div>
      <div class="item radios">
        <span>Stream Quality:</span>
        <br>
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
import simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'
import axios from 'axios'

export default {
  name: 'RadioPlayer',
  data() {
    return {
      previousVolume: 75,
      volume: 75,
      volumeAdjust: false,
      count: '',
      history: false,
      currentTime: 0,
      timerInterval: null,
      timerRunning: false,
      timerPaused: false,
      currentStream: 'http://136.0.16.57:8000/.stream',
      isPlaying: false,
      muted: false,
      songInfo: '',
      songHistory: '',
      refreshInterval: 10000,
      interval: '',
      url: 'https://radiomv.org/samHTMweb/info1.json',
      historyUrl: 'https://radiomv.org/samHTMweb/',
    }
  },
  components: {
    simplebar
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
    itemImg(item) {
      const url = 'https://radiomv.org/samHTMweb/'
      if (item.picture) {
        return url + item.picture
      } else {
        return url + 'customMissing.jpg'
      }
    },
    itemUrl(item) {
      if (item.buycd) {
        return item.buycd
      } else {
        return 'https://www.radiomv.org'
      }
    },
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
    muteToggle(){
      // eslint-disable-next-line
      // audio.muted = !audio.muted
      // this.muted = !this.muted
      if (this.volume == 0) {
        this.volume = this.previousVolume
      } else {
        this.previousVolume = this.volume
        return this.volume = 0
      }
    },
    getSongInfo() {
      axios
        .get(this.url)
        .then(response => {
          this.songInfo = response.data.song_info
          this.songHistory = response.data.song_history
        })
        .catch(error => {
          window.alert(error)
        })
    }
  },
  watch: {
    volume() {
      // eslint-disable-next-line
      audio.volume = this.volume / 100
    }
  },
  computed: {
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
a { text-decoration: none; }

#volume-slider {
  -webkit-appearance: slider-vertical;
    height: 60px;
    margin-top: -15px;
    width: 60px;
}
#clear {
  grid-area: e;
}
#history-play {
  grid-area: b;
  width: 38px;
  height: 38px;
  cursor: pointer;
  /* dont like this solution... */
  margin-top: 5px;
}
#history-volume {
  grid-area: c;
}
#history-play.paused {
  background: url("../assets/play.svg");
  background-size: cover; 
}
#history-play.playing {
  background: url("../assets/pause.svg");
  background-size: cover;
}
#history-container {
  grid-area: a;
  overflow: auto;
  padding-left: 5px;
  padding-top: 5px;
  color: white;
  display: inline-flex;
}
.history-item {
  height: 50px;
}
.history-img {
  max-height: 42px;
  border: 1px solid white;
  border-radius: 10px;
}
.history-album {
  float: left;
  padding-right: 15px;
  width: 50px;
  text-align: center;
}
.history-meta span.song-name {
  font-family: "Open Sans", sans-serif;
  font-weight: 250;
  font-size: 16px;
  color: #fff;
  display: block; }
.history-meta span.artist {
  font-family: "Open Sans", sans-serif;
  font-weight: 100;
  font-size: 12px;
  color: #fff;
  display: block; }
.history-meta hr  {
  border: 0;
  height: 1px;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
}
#history {
  margin: inherit;
  background-color: #202136;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  max-width: 540px;
  max-height: 150px;
  display: grid;
  grid-template-rows: repeat(3, 50px);
  grid-template-columns: 50px auto 40px;
  grid-template-areas:  "a a e"
                        "a a b"
                        "a a c";
}
#radio-player {
    margin: 50px auto;
}
#player {
  margin: inherit;
  background-color: #202136;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  max-width: 540px;
  display: grid;
  grid-template-columns: 120px 60px 240px 80px 40px;
  grid-template-rows: repeat(3, 50px);
  grid-template-areas:"aa bb cc cc dd"
                      "aa bb cc cc ee"
                      "aa ff gg hh hh";
}
.album {
  padding: 8px;
  height: 100%;
  vertical-align: middle;
}
.item-pic {
  grid-area: aa;
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
  grid-area: bb;
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
  background: url("../assets/play.svg");
  background-size: cover; }
.play-button.playing {
  background: url("../assets/pause.svg");
  background-size: cover; }
.item-meta {
  grid-area: cc;
  margin-top: 5px;
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
.item-meta hr  {
  border: 0;
  height: 1px;
  margin: 0;
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.75), rgba(255, 255, 255, 0)); }
.item-meta span.album-name {
  font-family: "Open Sans", sans-serif;
  font-weight: 200;
  font-size: 16px;
  color: #fff;
  display: block; }
.item-history {
  grid-area: dd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
  cursor: pointer;
}
.material-icons.md-36 { font-size: 36px; }

.item-volume {
  grid-area: ff;
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
  grid-area: hh;
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
  grid-area: gg;
  margin-left: 8px;
}
.radios label {
  color: white;
}
.radios span {
  font-family: "Open Sans", sans-serif;
  font-weight: 100;
  font-size: 14px;
  color: #fff; 
  }

/* mobile only */
@media only screen and (max-width: 600px) {
  .item-meta span.song-name {
    font-weight: 250;
    font-size: 16px;
  }
  .item-meta span.artist {
    font-weight: 100;
    font-size: 12px;
  }
  .item-meta span.album-name {
    font-weight: 200;
    font-size: 12px;
  }
  .history-meta span.song-name {
    font-weight: 200;
    font-size: 14px;
  }
  .album img {
    max-height: 90px;
    max-width: 76px;
    border: 1px solid white;
    border-radius: 10px;
  }
  #player {
    grid-template-columns: 92px auto 40px;
    grid-template-rows: repeat(3, 50px);
    grid-template-areas: "aa cc dd"
                         "aa cc bb"
                         "hh gg ff";
  }
  .play-button {
    width: 38px;
    height: 38px;
  }
}

@media only screen and (max-width: 480px) {
  .item-meta span.song-name {
    font-weight: 250;
    font-size: 16px;
  }
  .item-meta span.artist {
    font-weight: 100;
    font-size: 12px;
  }
  .item-meta span.album-name {
    font-weight: 200;
    font-size: 12px;
  }
  .history-meta span.song-name {
    font-weight: 150;
    font-size: 12px;
  }
  .album img {
    max-height: 90px;
    max-width: 76px;
    border: 1px solid white;
    border-radius: 10px;
  }
  #history {
    max-width: 440px;
  }
  #player {
    max-width: 440px;
    grid-template-columns: 92px auto 40px;
    grid-template-rows: repeat(3, 50px);
    grid-template-areas: "aa cc dd"
                         "aa cc bb"
                         "hh gg ff";
  }
  .play-button {
    width: 38px;
    height: 38px;
  }
}

@keyframes marquee {
  0% { transform: translateX(100%) }
  100% { transform: translateX(-115%) }
}

@-webkit-keyframes marquee {
  0% { transform: translateX(100%) }
  100% { transform: translateX(-115%) }
}

.marquee-container {
  overflow: hidden;
}
.marquee {
  white-space: nowrap;
  animation: marquee 8s linear infinite;
  -webkit-animation: marquee 8s linear infinite;
}
.marquee:hover {
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
}

</style>
