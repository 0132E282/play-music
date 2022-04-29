const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const headingName =$('.dashboard__text h3');
const headingSinger = $('.dashboard__text h5');
const cdSongImg = $('.dashboard__cd--banner-song');
const audio = $('#dashboard__control--audio');
const listSong = $('.play-song__list');
const cd = $('.dashboard__cd');
const btnPlays = $$('.btn-toggle-play');
const player = $('.play-song');
const progress = $('.control--input-range');
const PLAYER_STORAGE_KEY ='phuc-coder';
// btn
const nextBtn = $('.btn--next');
const prevBtn = $('.btn--prive');
const randomBtn = $('.btn--random');
const repeatBtn = $('.btn--repeat');
const app ={
    currentIndex :0,
    isPlayIng : false,
    isRandom : false,
    isRepeat : false,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},
     songs : [
        {
            name : 'túy hoa',
            singer : 'Phương Anh ',
            song : './assets/img/song-audio/TuyHoa-KICMXesi-6317832.mp3',
            songBanner :'./assets/img/song-banner/tuyHoa.jpg'
        },
        {
            name : '10s để nói thật',
            singer : 'Phương Anh ',
            song : './assets/img/song-audio/10sNoiThat-PhuongAnhIdol-7146314.mp3',
            songBanner :'./assets/img/song-banner/10s-noi-that.jpg'
        },
        {
            name : 'hoa tàn tình tan',
            singer : 'Giang Jolee ',
            song : './assets/img/song-audio/HoaTanTinhTan-GiangJolee-7126977.mp3',
            songBanner :'./assets/img/song-banner/hoaNoHoaTang.jpg'
        },
        {
            name : 'ngày mưa',
            singer : 'DMYB Wack ',
            song : './assets/img/song-audio/NgayMua-DMYBWack-7131110.mp3',
            songBanner :'./assets/img/song-banner/ngayMua.jpg'
        },
        {
            name : 'từng Thương',
            singer : 'PhanDuyAnhACV',
            song : './assets/img/song-audio/TungThuong-PhanDuyAnhACV-7196634.mp3',
            songBanner :'./assets/img/song-banner/tungThuong.jpg'
        }
    ],
    setConFig : function(key,value){
        this.config[key] =value
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    defineProperties :function(){
        const _this = this
        Object.defineProperty(this,'currentSong',{
            get : function(){
                return _this.songs[_this.currentIndex]
            }
        });
    },
    loadCurrentSong : function(){
        headingName.innerHTML=this.currentSong.name;
        headingSinger.innerHTML=this.currentSong.singer;
        cdSongImg.style.background=`url("${this.currentSong.songBanner}")`;
        audio.src=this.currentSong.song;
    },
    loadConfig : function (){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    handleEvents : function(){
        const _this =this
        const cdWidth = cd.offsetWidth; 
        // handle event small or big of cd
        document.onscroll = function(){
           const crollTop =  window.scrollY || document.documentElement.scrollTop;
           const newCdWidth =cdWidth-crollTop;
           cd.style.width =newCdWidth > 0 ? newCdWidth+'px': 0; 
           cd.style.opacity = newCdWidth/cdWidth;
        }
        // handle event onclick of button play song
        btnPlays.forEach((playBtn) => {
            playBtn.onclick=function(){
               if(_this.isPlayIng){
                
                audio.pause();
                
               }else{
                 audio.play();
                  
               }
            }
            // when song receive(nhận) play(chạy)
            audio.onplay= function(){
                _this.isPlayIng = true;
                player.classList.add('play-ing');
            }
            // when song receive(nhận) pause(tậm dừng)
            audio.onpause = function(){
                _this.isPlayIng=false,
                player.classList.remove('play-ing');
                cdAnimate.pause()
            }
           
            
        });
         // when song time progress(phát triển,tiến độ) change(thây đổi)
         audio.ontimeupdate=function(){
            if(audio.duration){
                const timeSong = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value =timeSong
                $('.progress--bar').style.width = (timeSong + 2)+'%'
                cdAnimate.play()
            }
        }
        // handle when song on turn(xoay) or stop
       const cdAnimate=  cdSongImg.animate([
            {
                transform:'rotate(360deg)',
            }
        ],{
            duration : 10000, // thời gian chậy 
            iterations : Infinity, // số vòng lập : vô hạng
        })
        cdAnimate.pause()
        // handle when rewind(tua lại) song 
        progress.oninput=function(e){
            const timeSeek = audio.duration / 100 * e.target.value;
            audio.currentTime =timeSeek
            
        }
        //handle next song when onclick
        nextBtn.onclick = function(){
            // new this.isRandom it true 
            if(_this.isRandom){
                // handle when onclick on nextBtn enforcement (thực thi , sự bặc buột) 
                _this.playRandomSong();
            }else{
                _this.nextSong()
            }
            _this.render();
            audio.play();
            _this.scrollToActiveSong();
        }
        //handle prev song when onclick
        prevBtn.onclick = function(){
            // same logic handle nextBtn
           if(_this.isRandom){
            _this.playRandomSong();
           }else{
            _this.prevSong();
           }   
            _this.render();
            _this.scrollToActiveSong();
            audio.play();
        }
        //handle when event random
        randomBtn.onclick = function(){
            _this.setConFig("isRandom ",_this.isRandom)
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active',_this.isRandom) ;
        }
        //handle when event time song end 
        audio.onended=function(){
            if(_this.isRepeat){
                audio.play();
            }else{
                nextBtn.click();
            }
        }
        // handle when repeat one song 
        repeatBtn.onclick = function(){
            _this.setConFig("isRandom ",_this.isRandom)
            _this.isRepeat = !_this.isRepeat;
            
            repeatBtn.classList.toggle('active',_this.isRepeat) ;
            
        }
        // handle when click on list song
        listSong.onclick = function(e){
            const songElement = e.target.closest('.play-song__list--item:not(.active)')
            // nếu nó không có active và ko nhấn vào icon 3 chấm thì true
            if(songElement|| e.target.closest('.song__icon')){
                if(songElement){
                    _this.currentIndex =Number(songElement.getAttribute('data-index'))
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
    },
    scrollToActiveSong:function(){
         setTimeout(function(){
            $('.play-song__list--item.active').scrollIntoView({
                behavior :'smooth',
                block: 'start',
            });
         },4000)
       
    },
    playRandomSong :function(){
        let newIndex ;
        do{
            newIndex = Math.floor(Math.random()*this.songs.length);
        }while(newIndex === this.currentIndex);
        this.currentIndex= newIndex;
        this.loadCurrentSong()
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex > this.songs.length-1){
            this.currentIndex =0;
        }
        this.loadCurrentSong();
    },
    prevSong : function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrentSong();
    },
        render : function(){   
       htmls = this.songs.map((song,index)=>{
                return `
                <div class="play-song__list--item ${index === this.currentIndex?'active':''} " data-index="${index}">
                    <div class="list--item__song">
                        <div class="song__img">
                            <img src="${song.songBanner}" alt="">
                        </div>
                        <div class="song__text">
                            <div class="text--name">
                                ${song.name}
                            </div>
                            <div class="text--singer">
                                ${song.singer}
                            </div>
                        </div>
                    </div>
                    <div class="song__icon">
                        <i class="fas fa-ellipsis-v"></i>
                </div>
            </div>
                 `
       })

    listSong.innerHTML=htmls.join(' ');
    },
    //bắt đầu khởi đầu
    start : function(){
        this.loadConfig ();
        //xác định thuộc tính
        this.defineProperties();
        //  xử lý sự kiện
        this.handleEvents();
        // sử lý bài háng đầu tiên 
        this.loadCurrentSong();
        //kết xuất
        this.render();
        randomBtn.classList.toggle('active',this.isRandom) ;
        repeatBtn.classList.toggle('active',this.isRepeat) ;
    }
}
app.start();