const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'N_QUYEN'
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next"); // Đổi tên biến "nextSong" thành "nextBtn"
const prevBtn = $(".btn-prev");
const ramdomBtn = $(".btn-random");
const repeatBtn=$(".btn-repeat")
const playlist=$('.playlist')
const speedBtn = $(".btn-speed");
const speedOptions = $(".speed-options");
const speedButtons = $$(".speed-option");
const volumeToggleBtn = document.getElementById("volume-toggle");
const volumeSlider = document.querySelector(".volume-slider");
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom:false,
    isRepeat:false,
    isDarkMode:false,
    config:JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY))||{},

    songs: [
        {
            name: "HIEUTHUHAI - Exit Sign (prod. by Kewtiie) ft. marzuz",
            singer: "HIEUTHUHAI",
            path: "./assets/music/HIEUTHUHAI - Exit Sign (prod. by Kewtiie) ft. marzuz [Official Lyric Video].mp3",
            image: "./assets/img/a1.jpg",
        },
        {
            name: "Không Thể Say (prod. by Kewtiie)",
            singer: "HIEUTHUHAI",
            path: "./assets/music/HIEUTHUHAI - Không Thể Say (prod. by Kewtiie) l Official Video.mp3",
            image: "./assets/img/a2.webp",
        },
        {
            name: "Xoay Một Vòng (prod. by Kewtiie)",
            singer: "HIEUTHUHAI x PHƯƠNG LY",
            path: "./assets/music/HIEUTHUHAI x PHƯƠNG LY - Xoay Một Vòng (prod. by Kewtiie) l Official Music Video.mp3",
            image: "./assets/img/a3.jpg",
        },
        {
            name: "NEGAV - MÌNH ANH THÔI I OFFICIAL MUSIC",
            singer: "NEGAV",
            path: "./assets/music/NEGAV - MÌNH ANH THÔI I OFFICIAL MUSIC VIDEO.mp3",
            image: "./assets/img/nagiv1.jpg",
        },
        {
            name: "Mamma Mia (prod. by Kewtiie) [Official Video]",
            singer: "HURRYKNG, REX, HIEUTHUHAI, Negav, MANBO",
            path: "./assets/music/HURRYKNG, REX, HIEUTHUHAI, Negav, MANBO - Mamma Mia (prod. by Kewtiie) [Official Video].mp3",
            image: "./assets/img/maxresdefault.jpg",
        },
        
    ],
    setConfig:function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song,index) => {
            return `
        <div class="song ${index===this.currentIndex?"active":''}" data-index=${index}>
          <div class="thumb" style="background-image: url('${song.image}')"></div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
</div>

        </div>
      `;
        });
        $(".playlist").innerHTML = htmls.join("");
    },

    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    handleEvents: function () {
        
        const _this = this;
        const cdWidth = cd.offsetWidth;

        

        // Tạo animation quay CD
        const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
            duration: 10000, // 10 seconds
            iterations: Infinity,
        });
        cdThumbAnimate.pause();

        // Xử lý phóng to/thu nhỏ CD khi cuộn
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        // Xử lý khi nhấn nút Play
        playBtn.addEventListener('click', function () {
            if (audio.paused) {
                audio.play();  // Start playing the audio
                playBtn.classList.add('active');  // Add active class to the button
                playBtn.querySelector("i").classList.replace("fa-play", "fa-pause");  // Change the icon to pause
            } else {
                audio.pause();  // Pause the audio
                playBtn.classList.remove('active');  // Remove active class when paused
                playBtn.querySelector("i").classList.replace("fa-pause", "fa-play");  // Change the icon back to play
            }
        });
        audio.onplay = function () {
            _this.isPlaying = true;
            player.classList.add("playing");  // Add the playing class to the player
            cdThumbAnimate.play();  // Start the CD thumb animation
        };
        
        // Song pause
        audio.onpause = function () {
            _this.isPlaying = false;
            player.classList.remove("playing");  // Remove the playing class from the player
            cdThumbAnimate.pause();  // Pause the CD thumb animation
        };
      
        // When the song changes
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
                progress.value = progressPercent;
        
                // Cập nhật thời gian hiện tại
                const currentMinutes = Math.floor(audio.currentTime / 60);
                const currentSeconds = Math.floor(audio.currentTime % 60);
                $("#current-time").textContent = `${currentMinutes}:${currentSeconds < 10 ? "0" : ""}${currentSeconds}`;
        
                // Cập nhật tổng thời gian
                const totalMinutes = Math.floor(audio.duration / 60);
                const totalSeconds = Math.floor(audio.duration % 60);
                $("#total-time").textContent = `${totalMinutes}:${totalSeconds < 10 ? "0" : ""}${totalSeconds}`;
            }
        };
        // Handle rewinding songs
        progress.oninput = function (e) {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // next song
        nextBtn.onclick = function () {
            if (_this.isRandom) { 
                _this.playRandomSong(); 
            } else {
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        //prev song
        prevBtn.onclick = function () {
            if (_this.isRandom) { 
                _this.playRandomSong(); 
            } else {
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        };
        //Xu ly random bai hat
        ramdomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom; 
            _this.setConfig('isRandom', _this.isRandom);
            ramdomBtn.classList.toggle("active", _this.isRandom); 
            
        };
        //Xu ly lap lai song
        repeatBtn.onclick=function(){
            _this.isRepeat = !_this.isRepeat; 
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle("active", _this.isRepeat); 

        }
        //Xy ly next song khi audio ended
        audio.onended = function(){
          if(_this.isRepeat){
            audio.play();
          }
          else{
            
            _this.nextSong();
            audio.play();
          }
        }
        speedBtn.onclick = function () {
            speedOptions.classList.toggle("show"); // Hiển thị/ẩn các tùy chọn tốc độ
          };
          speedButtons.forEach(button => {
            button.onclick = function () {
              const speed = parseFloat(button.dataset.speed); // Lấy giá trị tốc độ
              audio.playbackRate = speed; // Thiết lập tốc độ phát\
              audio.play();
              speedOptions.classList.remove("show"); // Ẩn các tùy chọn tốc độ
            };
          });
          volumeSlider.oninput = function () {
            const volume = volumeSlider.value; // Lấy giá trị của thanh điều chỉnh
            audio.volume = volume; // Thay đổi âm lượng
          };
        //Bam vao playlist
        playlist.onclick = function(e){
            const songElement=e.target.closest('.song:not(.active)')
            const deleteBtn = e.target.closest(".fa-trash-alt");
            if(songElement||e.target.closest('.option')){
                if(songElement){
                   _this.currentIndex= Number(songElement.dataset.index)//convert sang
                   _this.loadCurrentSong();
                   _this.render();
                   audio.play();
                
                }
                
                if (deleteBtn) {
                    const index = Number(deleteBtn.closest(".song").dataset.index);
                    _this.songs.splice(index, 1);
                    _this.render();
                } else if (songElement) {
                    _this.currentIndex = Number(songElement.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }
    },
    
    scrollToActiveSong:function(){ 
        setTimeout(function(){
            $('.song-active').scrollIntoView({
                behavior:'smooth',
                block:'start'
            })
        },500)
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name; // Tên bài hát
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`; // Hình ảnh CD
        audio.src = this.currentSong.path; // Đường dẫn nhạc
    },
    loadConfig:function(){
        this.isRandom=this.config.isRandom;
        this.isRepeat=this.config.isRepeat;
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0; // Return to the first post
        }
        this.loadCurrentSong();
    },
    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex <0) {
            this.currentIndex = this.songs.length-1; // Return to the last post
        }
        this.loadCurrentSong();
    },
    playRandomSong:function(){
        let newIndex
        do{
            newIndex=Math.floor(Math.random()*this.songs.length);
        }
        while(newIndex===this.currentIndex)
            this.currentIndex=newIndex;
        this.loadCurrentSong();
      
    },
    

    start: function () {
        this.loadConfig();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
        ramdomBtn.classList.toggle("active", this.isRandom); 
        repeatBtn.classList.toggle("active", this.isRepeat); 
    },
};

app.start();
