let rootPath = location.origin + "/";


let depth = location.pathname
.split("/")
.filter(x=>x)
.length;


if(depth > 1){

    rootPath = "../".repeat(depth-1);

}



let musics = [

rootPath + "music/01 - A Real Boy!.mp3",

rootPath + "music/02 - BIG SHOT.mp3",

rootPath + "music/03 - Deal Gone Wrong.mp3",

rootPath + "music/04 - Dialtone.mp3",

rootPath + "music/05 - HEY EVERY    !.mp3",

rootPath + "music/06 - NOW'S YOUR CHANCE TO BE A.mp3",

rootPath + "music/07 - Spamton.mp3"

];



let currentMusic = 0;

let audio = document.getElementById("bgm");

let musicName = document.getElementById("musicName");

let playMode = "loop";





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







function loadMusic(){


    let savedIndex =
    localStorage.getItem("musicIndex");



    if(savedIndex !== null){

        currentMusic =
        Number(savedIndex);

    }




    audio.src =
    musics[currentMusic];




    if(musicName){

        musicName.innerText =
        musics[currentMusic]
        .split("/")
        .pop();

    }




    let savedTime =
    localStorage.getItem("musicTime");



    audio.addEventListener(
        "loadedmetadata",
        ()=>{


            if(savedTime){

                audio.currentTime =
                Number(savedTime);

            }



            let autoPlay =
            localStorage.getItem("autoPlay");



            if(autoPlay === "true"){


    audio.play()
    .then(()=>{


        let btn =
        document.getElementById("playBtn");


        if(btn){

            btn.innerHTML="⏸";

        }


    })
    .catch(()=>{

        console.log(
        "浏览器阻止自动播放"
        );

    });


}



        },
        {
            once:true
        }
    );



}









window.toggleMusic=function(){



    let btn =
    document.getElementById("playBtn");



    if(audio.paused){



        audio.play();



        localStorage.setItem(
            "autoPlay",
            "true"
        );



        if(btn){

            btn.innerHTML="⏸";

        }


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



    if(currentMusic >= musics.length){

        currentMusic=0;

    }



    loadMusic();



    audio.play();



    saveMusicState();



}










window.prevMusic=function(){



    currentMusic--;



    if(currentMusic < 0){

        currentMusic =
        musics.length-1;

    }



    loadMusic();



    audio.play();



    saveMusicState();



}









audio.onended=function(){



    if(playMode=="single"){


        audio.currentTime=0;

        audio.play();


    }


    else if(playMode=="random"){



        currentMusic =
        Math.floor(
            Math.random()*musics.length
        );



        loadMusic();


        audio.play();



    }


    else{


        nextMusic();


    }



};









window.changeMode=function(){



    let mode =
    document.getElementById("mode");



    if(mode){


        playMode =
        mode.value;



        localStorage.setItem(
            "playMode",
            playMode
        );


    }



};









window.sendComment=async function(){



    let box =
    document.getElementById("message");



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







audio.addEventListener(
    "play",
    ()=>{

        let btn =
        document.getElementById("playBtn");


        if(btn){

            btn.innerHTML="⏸";

        }

    }
);



audio.addEventListener(
    "pause",
    ()=>{

        let btn =
        document.getElementById("playBtn");


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






let savedMode =
localStorage.getItem("playMode");



if(savedMode){


    playMode=savedMode;


}




}