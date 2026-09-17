let rootPath = "/";



let musics = [

rootPath + "music/01 - A Real Boy!.mp3",
rootPath + "music/02 - BIG SHOT.mp3",
rootPath + "music/03 - Deal Gone Wrong.mp3",
rootPath + "music/04 - Dialtone.mp3",
rootPath + "music/05 - HEY EVERY    !.mp3",
rootPath + "music/06 - NOW'S YOUR CHANCE TO BE A.mp3",
rootPath + "music/07 - Spamton.mp3",
rootPath + "music/08 - It's TV Time! WITH LYRICS.mp3",
rootPath + "music/09- TV WORLD (From Deltarune).mp3",
rootPath + "music/10 - DNS A Real Salesman！.mp3",
rootPath + "music/11 - DNS DIALTONS.mp3",
rootPath + "music/12 - DNS Hey, Every!！.mp3",
rootPath + "music/13 - DNS HOT SHOT.mp3",
rootPath + "music/14 - DNS KEYGEN.mp3",
rootPath + "music/15 - DNS Sales gonE down the DRAIN.mp3",
rootPath + "music/16 - DNS Selasman.mp3",
rootPath + "music/17 - DNT Tenna.mp3",
rootPath + "music/18 - DNT TV WORLD.mp3",
rootPath + "music/19 - DNS WHAT I GOT YOU WANT IT.mp3",
rootPath + "music/20 - ★【TV WORLD】★ (1).mp3",
rootPath + "music/21 - its tv time.mp3",

];




let currentMusic = 0;


let audio =
document.getElementById("bgm");


let musicName =
document.getElementById("musicName");


let songSelect =
document.getElementById("songSelect");




if(audio){



function saveMusicState(){


    localStorage.setItem(
        "musicIndex",
        currentMusic
    );


    localStorage.setItem(
        "musicTime",
        audio.currentTime
    );


}






function updateMusicUI(){


    if(musicName){

        musicName.innerText =
        musics[currentMusic]
        .split("/")
        .pop();

    }


    if(songSelect){

        songSelect.value =
        currentMusic;

    }


}







function setMusic(index){


    currentMusic = index;


    audio.src =
    musics[currentMusic];


    updateMusicUI();


}







function loadMusic(){



    let saved =
    localStorage.getItem(
        "musicIndex"
    );



    if(saved !== null){

        currentMusic =
        Number(saved);

    }



    setMusic(currentMusic);



    let time =
    localStorage.getItem(
        "musicTime"
    );



    audio.addEventListener(
        "loadedmetadata",
        ()=>{


            if(time){

                audio.currentTime =
                Number(time);

            }



        },
        {
            once:true
        }
    );



}








window.toggleMusic=function(){


    let btn =
    document.getElementById(
        "playBtn"
    );


    if(audio.paused){


        audio.play();


        if(btn){

            btn.innerHTML="⏸";

        }


        localStorage.setItem(
            "autoPlay",
            "true"
        );


    }

    else{


        audio.pause();


        if(btn){

            btn.innerHTML="▶";

        }

    }


}








window.nextMusic=function(){


    currentMusic++;


    if(
        currentMusic >= musics.length
    ){

        currentMusic=0;

    }



    setMusic(
        currentMusic
    );


    audio.play();


    saveMusicState();


}








window.prevMusic=function(){



    currentMusic--;



    if(currentMusic < 0){

        currentMusic =
        musics.length-1;

    }



    setMusic(
        currentMusic
    );



    audio.play();



    saveMusicState();



}









audio.onended=function(){


    nextMusic();


};









if(songSelect){



    musics.forEach(
        (music,index)=>{


            let option =
            document.createElement(
                "option"
            );


            option.value=index;


            option.innerText =
            music.split("/")
            .pop();


            songSelect.appendChild(
                option
            );


        }
    );




    songSelect.onchange=function(){



        setMusic(
            Number(this.value)
        );



        audio.play();



        saveMusicState();



    };



}







audio.addEventListener(
    "play",
    ()=>{


        let btn =
        document.getElementById(
            "playBtn"
        );


        if(btn){

            btn.innerHTML="⏸";

        }


    }
);






audio.addEventListener(
    "pause",
    ()=>{


        let btn =
        document.getElementById(
            "playBtn"
        );


        if(btn){

            btn.innerHTML="▶";

        }


    }
);







audio.addEventListener(
    "timeupdate",
    ()=>{


        if(!audio.paused){

            saveMusicState();

        }


    }
);








window.addEventListener(
    "beforeunload",
    ()=>{

        saveMusicState();

    }
);






loadMusic();





window.sendComment =
async function(){


let box =
document.getElementById(
"message"
);



if(!box){

return;

}



let text =
box.value.trim();



if(text===""){

alert("请输入留言");

return;

}




try{


let response =
await fetch(
"/api/comment",
{


method:"POST",


headers:{


"Content-Type":
"application/json"


},


body:JSON.stringify({

message:text

})


});



let result =
await response.json();



if(result.success){


alert("留言发送成功");

box.value="";


}

else{


alert("留言发送失败");


}



}

catch(e){


alert("网络错误");


console.log(e);


}


};



}