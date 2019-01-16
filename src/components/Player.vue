<template>
    <div id="player">
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
      <div class="item item-history" @click="historyToggle">
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
</template>

<script>
import { mapMutations } from 'vuex'
import { mapActions } from 'vuex'
import { mapState } from 'vuex'

export default {
  name: 'Player',
  data() {
    return {
      previousVolume: 75,
      volume: 75,
      volumeAdjust: false,
      count: '',
      currentTime: 0,
      timerInterval: null,
      timerRunning: false,
      timerPaused: false,
      currentStream: 'http://136.0.16.57:8000/.stream',
      muted: false,
      refreshInterval: 10000,
      interval: '',
      url: 'https://radiomv.org/samHTMweb/info1.json',
    }
  },
  methods: {
    ...mapMutations([
        'historyToggle',
    ]),
    ...mapActions([
        'getSongInfo',
        'setIsPlaying'
    ]),
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
        this.setIsPlaying(false)
        //   this.isPlaying = false
        this.timerPause()
    },
    playPause() {
      // eslint-disable-next-line
      if (audio.paused) {
        // eslint-disable-next-line
        audio.play()
        // this.isPlaying = true
        this.setIsPlaying(true)
        this.timerRun()
      } else {
        this.pause()
      }
    },
    muteToggle(){
      // eslint-disable-next-line
      if (this.volume == 0) {
        this.volume = this.previousVolume
      } else {
        this.previousVolume = this.volume
        return this.volume = 0
      }
    }
  },
  watch: {
    volume() {
      // eslint-disable-next-line
      audio.volume = this.volume / 100
    }
  },
  computed: {
      ...mapState([
          'songInfo',
          'isPlaying'
      ]),
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
#volume-slider {
  -webkit-appearance: slider-vertical;
  height: 60px;
  margin-top: -15px;
  width: 60px;
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
  .item-meta {
    max-width: 210px;
  }
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
    max-height: 90px;
    max-width: 76px;
    border: 1px solid white;
    border-radius: 10px;
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
@media only screen and (max-width: 360px) {
  .item-meta {
    max-width: 170px;
  }
}
</style>
