<template>
    <div id="player">
      <div class="item-pic">
        <div class="album">
            <a :href="itemUrl(songInfo)" target="_blank"><img :src="itemImg(songInfo)" onerror="this.src='https://radiomv.org/samHTMweb/customMissing.jpg'" :alt="songInfo.title" /></a>
        </div>
      </div>
      <div class="item-play">
        <div class="play-button-div"><div class="play-button paused"  @click="playPause" @keyup.space="playPause" :class="[isPlaying ? 'playing' : 'paused']">
          <audio id="audio" :src="currentStream">
                Your browser does not support the audio element.
          </audio>
        </div>
        </div>
      </div>
      <div class="item-meta">
        <a :href="itemUrl(songInfo)" target="_blank">
          <div class="marquee-container"><span class="song-name" :class="[songInfo.title.length >= 22 ? 'marquee' : 'normal']">{{ songInfo.title | uppercase }}</span></div>
        </a>
        <span class="artist">{{ songInfo.artist }}</span>
        <div class="marquee-container"><span class="album-name" :class="[songInfo.album.length >= 36 ? 'marquee' : 'normal']">{{ songInfo.album }}</span></div>
        <br>
        <hr>
      </div>
      <div class="item-history" @click="historyToggle">
          <i class="material-icons md-36" title="Click to view recent history">history</i>
      </div>
      <volume class="item-volume" />
      <div class="radios">
        <span>Stream Quality:</span>
        <br>
        <input @change="pause" type="radio" id="hq" value="http://136.0.16.57:8000/.stream" v-model="currentStream">
        <label for="hq">HQ</label>
        <input @change="pause" type="radio" id="mq" value="http://136.0.16.57:8006/.stream" v-model="currentStream">
        <label for="mq">MQ</label>
        <input @change="pause" type="radio" id="lq" value="http://136.0.16.57:8004/.stream" v-model="currentStream">
        <label for="lq">LQ</label>
      </div>
      <timer />
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { mapActions } from 'vuex'
import { mapState } from 'vuex'
import Timer from './Timer.vue'
import Volume from './Volume.vue'

export default {
  name: 'Player',
  components: {
    Timer,
    Volume
  },
  data() {
    return {
      currentStream: 'http://136.0.16.57:8000/.stream'
    }
  },
  methods: {
    ...mapMutations([
        'historyToggle',
        'volumeAdjustToggle'
    ]),
    ...mapActions([
        'playPause',
        'pause',
        'muteToggle'
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
      'isPlaying',
      'volumeAdjust'
    ]),
    volume: {
      get () {
        return this.$store.state.volume
      },
      set (val) {
        this.$store.commit('updateVolume', val)
      }
    }
  },
  created() {
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
  margin: 0 auto;
}
.item-volume #volume-slider-input {
  height: 60px;
  margin-top: -15px;
  width: 60px;
}
.volume {
  margin-left: auto;
  margin-right: auto;
  color: white;
  cursor: pointer;
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
  .item-volume #volume-slider-input {
  height: 40px;
  margin-top: -20px;
  width: 10px;
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
    grid-template-columns: 92px auto 40px;
    grid-template-rows: repeat(3, 50px);
    grid-template-areas: "aa cc dd"
                         "aa cc bb"
                         "hh gg ff";
  }
  .play-button {
    margin: 0;
    width: 36px;
    height: 36px;
  }
  .item-volume {
    margin: unset;
  }
}
  @media only screen and (max-width: 480px) {
  .item-meta {
    max-width: 210px;
  }
  #player {
    max-width: 440px;
  }
}
@media only screen and (max-width: 360px) {
  .item-meta {
    max-width: 170px;
  }
}
</style>
