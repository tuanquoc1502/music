const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const listSong1 = JSON.parse(localStorage.getItem("listSong"));

const playlist = $(".playlist");
const firstSongImage = $('.thumb-img')
const firstSongInfo = $('.media__content')
const timeStartSong = $('.track-time')
const timeEndSong = $('.durationtime')
const audio = $('#audio');
const progress = $('.progress-track')
const volumeRange = $('.volume__range')
const playBtn = $('.controls__play-pause')
const nextBtn = $('.icon-next')
const prevBtn = $('.icon-prev')
const randomBtn = $('.icon-random')
const replaceSong = $('.icon-replace')
const volumeBtn = $('.player-controls__volume')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isReplace: false,
    isVolume: false,

    render() {
        const htmls = listSong1.map((song, index) => (
            `
                <div class="playlist__song-item ${this.currentIndex === index ? 'active' : ''}" data-index="${index}">
                    <div class="song-item__info">
                        <div class="song-item__wapper">
                            <div class="song-item__img"> 
                                <img src="${song.image}"> 
                            </div>

                            <div class="song__icon-play">
                                <i class="bi bi-play-fill"></i>
                            </div>
                            <div class="song__icon-tone ${this.currentIndex === index ? 'active' : ''}"> 
                                <img src="./assets/img/git/icon-playing.gif">
                             </div>
                          
                        </div>
                        <div class="info-title">
                            <h4>${song.name}</h4>
                            <span>${song.singer}</span>
                        </div>
                    </div>
                    <div class="song-item__time">
                        <span>${song.time}</span>
                    </div>
                    <div class="song-item__optinos">
                        <div class="favorite-icon">
                            <i class="bi bi-heart-fill favorite active"></i>
                        </div>
                        <div class="options-icon">
                            <i class="bi bi-three-dots icon-option"></i>
                        </div>
                    </div>
                </div>
            `
        ));
        playlist.innerHTML = htmls.join('')
    },

    hanldleEvents() {
        const _this = this

        const cdThumbAnimate = firstSongImage.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, // 10s
            iterations: Infinity
        })

        cdThumbAnimate.pause()

        

        // Play-Pause
        playBtn.onclick = () => {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        audio.onplay = () => {
            _this.isPlaying = true
            playBtn.classList.add('active')
            $('.wapper__thumb-node').classList.add('playing')
            $('.media__left').classList.add('active')
            cdThumbAnimate.play()
        }
        
        audio.onpause = () => {
            _this.isPlaying = false
            playBtn.classList.remove('active')
            $('.wapper__thumb-node').classList.remove('playing')
            $('.media__left').classList.remove('active')
            cdThumbAnimate.pause()
        }

        audio.ontimeupdate = () => {
            // time song
            let currentMin = Math.floor(audio.currentTime / 60)
            let currentSec = Math.floor(audio.currentTime % 60)
            // time value
            const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
           
            if (currentSec < 10 ) {
                currentSec = `0${currentSec}`;
            }
            timeStartSong.innerHTML = `0${currentMin}:${currentSec}`
            progress.value = progressPercent       
        }

        progress.onchange = function(e) {
            audio.currentTime = audio.duration / 100 * e.target.value
        }

        randomBtn.onclick = () => {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        replaceSong.onclick = () => {
            _this.isReplace = !_this.isReplace
            replaceSong.classList.toggle('active', _this.isReplace)
        }

        nextBtn.onclick = () => {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            _this.render()
            audio.play()
        }

        prevBtn.onclick = () => {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            _this.render()
            audio.play()
        }

        audio.onended = function() {
            if (_this.isReplace) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        playlist.onclick = e => {
            const songNode = e.target.closest('.playlist__song-item:not(.active)')
            const iconOptions = e.target.closest('.options-icon')
            const iconFavorite = e.target.closest('.favorite-icon')

            if( songNode || iconOptions || iconFavorite) {
                // Click vào Song
                if (songNode && !iconOptions && !iconFavorite) {
                    _this.currentIndex = Number(songNode.getAttribute('data-index'));
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }

                //Click vào Options
                if (iconOptions) {
                  
                }

                //Click vào Tim
                if(iconFavorite) {
                   
                }
            }
        }


        // Hanlde Volume
        volumeRange.onchange = e => {
            const totalVolume = e.target.value / 100
            volumeRange.setAttribute('value', totalVolume * 100 )
            audio.volume = totalVolume
            volumeBtn.innerHTML = audio.volume === 0 ? 
            `<i class="bi bi-volume-mute"></i>` 
            : `<i class="bi bi-volume-up"></i>`
            
        }

        volumeBtn.onclick = () => {
            _this.isVolume = !_this.isVolume
            if (_this.isVolume) {
                volumeBtn.innerHTML = `<i class="bi bi-volume-mute"></i>`
                audio.volume = 0
            } else {
                volumeBtn.innerHTML = `<i class="bi bi-volume-up"></i>`
                audio.volume = volumeRange.getAttribute('value') / 100
            }
        }

        

    },

    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return listSong1[this.currentIndex]
            }
        })
    },
    
    loadCurrentSong() {
        $('.thumb-img').innerHTML = `<img src="${this.currentSong.image}">`
        firstSongInfo.innerHTML = `<h4>${this.currentSong.name}</h4>
                                    <span>${this.currentSong.singer}</span>`
        timeEndSong.innerHTML = `${this.currentSong.time}`
        audio.src = this.currentSong.path
        
    },

    playRandomSong() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * listSong1.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    viewTop() {
        setTimeout(() => {
            $('.playlist__song-item.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            })
        }, 250)   
    },

    nextSong() {
        this.currentIndex++
        if(this.currentIndex >= listSong1.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
        this.viewTop()
    },

    prevSong() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = listSong1.length - 1
        }
        this.loadCurrentSong()
        this.viewTop()
    },

    start() {
        // Định nghĩa properties cho Object
        this.defineProperties()

        this.render()

        //Load bài đầu tiên
        this.loadCurrentSong()

        // Xử lý các DOM EVENT
        this.hanldleEvents()

    }

};

app.start()




// Toast
function toast({ 
    title = '', 
    message = '', 
    type = 'info', 
    duration = ''
}) {
    const main = document.getElementById('toast__wapper')
    if (main) {
        const toast = document.createElement('div')
        
        const autoRemoveId = setTimeout(() => {
            main.removeChild(toast)
        }, 3000)

        toast.onclick = e => {
            if(e.target.closest('.toast__close')) {
                main.removeChild(toast)
                clearTimeout(autoRemoveId)
            }
        }

        const icons = {
            success: 'fas fa-info',
        }
        const icon = icons[type];

        toast.classList.add('toast', `toast--${type}`);
        toast.style.animation = `slideInLeft ease 0.4s, fadeOut linear 0.8s ${duration}s forwards`
        toast.innerHTML = `
                <div class="toast__icon">
                    <i class="${icon}"></i>
                </div>
                <div> 
                </div>
                <div class="toast__body">
                    <h3>${title}</h3>
                    <p>${message}</p>
                </div>
                <div class="toast__close">
                    <i class="fas fa-times"></i>
                </div>
        `
        main.appendChild(toast)
    }
}

const items = $$('.sidebar__nav-item')
const itemsActive = $('.sidebar__nav-item.active')


const toastDefault = () => {
    toast({
        title: 'Thông báo',
        message: 'Chức năng hiện đang được cập nhật, bạn vui lòng thông cảm!',
        type: 'success',
        duration: 2.1
    })
}

items.forEach(item => {
    item.onclick = () => {
        if (item !== itemsActive) {
            toastDefault()
        }
    }
})

$$('.header__nav-item').forEach(item => {
    item.onclick = () => {
        toastDefault()
    }
})

const acctives = $('.content__navbar-item.active')

$$('.content__navbar-item').forEach(item => {
    item.onclick = () => {
        if( item !== acctives ) {
            toastDefault()
        }
    }
})

$('.download-song').onclick = () => {
    toastDefault()
}

$('.play-all').onclick = () => {
    toastDefault()
}

$('.buy-vip-btn').onclick = () => {
    toastDefault()
}

$('.import-code-btn').onclick = () => {
    toastDefault()
}

//Slide show 



let index = 2;
function slideShow() {

    const allSongImg = $$('.song__animate-item') // 6 img
    const slideFirst = $('.song__animate-item.first')
    const slideSecond = $('.song__animate-item.second')

    const slideThird = allSongImg[index]
    const slideFourth = allSongImg[index === allSongImg.length - 1 ? '0' : index + 1]

    slideFourth.classList.replace('fourth','third')
    slideThird.classList.replace('third','second')
    slideSecond.classList.replace('second','first')
    slideFirst.classList.replace('first', 'fourth')

    index++
    if (index >= allSongImg.length) {
        index = 0
    }

    setTimeout(slideShow, 3000)

}

slideShow()