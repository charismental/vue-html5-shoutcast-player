<template>
  <div id="radio-player">
    <div id="history" v-show="history">
      <simplebar id="history-container" data-simplebar-auto-hide="true">
        <div class="history-item" v-for="(song, i) in songHistory" :key="i">
          <div class="history-album">
            <a :href="itemUrl(song)" target="_blank"><img :src="itemImg(song)" alt="song.title" class="history-img"></a>
          </div>
          <a :href="itemUrl(song)" target="_blank">
            <div class="history-meta">
              <span class="song-name">{{ song.title | uppercase | truncate(24) }}</span>
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
      <div class="item item-history" id="history-volume">
        <i class="material-icons md-36" title="Adjust volume">volume_up</i>
      </div>
    </div>
    <div id="player" v-show="!history">
      <div class="item item-pic">
        <div class="album">
            <a :href="itemUrl(songInfo)" target="_blank"><img :src="itemImg(songInfo)" :alt="songInfo.title" /></a>
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
          <span class="song-name">{{ songInfo.title | uppercase | truncate(22) }}</span>
        </a>
        <span class="artist">{{ songInfo.artist }}</span>
        <span class="album-name">{{ songInfo.album | truncate(36) }}</span>
      </div>
      <div class="item item-history" @click="history = !history">
          <i class="material-icons md-36" title="Click to view recent history">history</i>
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
import simplebar from 'simplebar-vue'
import 'simplebar/dist/simplebar.min.css'
import axios from 'axios'

export default {
  name: 'RadioPlayer',
  data() {
    return {
      count: '',
      history: false,
      currentTime: 0,
      timerInterval: null,
      timerRunning: false,
      timerPaused: false,
      currentStream: 'http://136.0.16.57:8000/.stream',
      isPlaying: false,
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

#radio-player {
  margin-top: 50px;
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
  margin: auto;
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
#player {
  margin: auto;
  background-color: #202136;
  border-radius: 10px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  max-width: 540px;
  display: grid;
  grid-template-columns: 120px 60px auto 80px 40px;
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
  margin-top: 10px;
}
.radios label {
  color: white;
}

/* mobile only */
@media only screen and (max-width: 600px) {
  .radios {display: none;}
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
  .album img {
    max-height: 100px;
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
</style>
