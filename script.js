let musics = [

"music/01 - A Real Boy!.mp3",

"music/02 - BIG SHOT.mp3",

"music/03 - Deal Gone Wrong.mp3",

"music/04 - Dialtone.mp3",

"music/05 - HEY EVERY    !.mp3",

"music/06 - NOW'S YOUR CHANCE TO BE A.mp3",

"music/07 - Spamton.mp3"

];



let currentMusic = 0;


let audio = document.getElementById("bgm");


let musicName =
document.getElementById("musicName");



let playMode="loop";





function loadMusic(){


audio.src = musics[currentMusic];


musicName.innerText =
musics[currentMusic]
.replace("music/","");


}





function toggleMusic(){

let btn=document.getElementById("playBtn");


if(audio.paused){

audio.play();

btn.innerHTML="⏸";

}

else{

audio.pause();

btn.innerHTML="▶";

}

}





function nextMusic(){


currentMusic++;


if(currentMusic >= musics.length)

{

currentMusic=0;

}


loadMusic();


audio.play();


}





function prevMusic(){


currentMusic--;


if(currentMusic < 0)

{

currentMusic =
musics.length-1;

}


loadMusic();


audio.play();


}





audio.onended=function(){


if(playMode=="single")

{


audio.currentTime=0;


audio.play();


}


else if(playMode=="random")

{


currentMusic =
Math.floor(
Math.random()*musics.length
);


loadMusic();


audio.play();


}


else

{

nextMusic();

}


}





function changeMode(){


playMode =
document.getElementById("mode").value;


}




async function sendComment(){


    let box = document.getElementById("message");


    if(!box){
        return;
    }



    let text = box.value.trim();



    if(text === ""){


        alert("请输入留言");

        return;

    }



    try{


        let response = await fetch(
            "/api/comment",
            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },


                body:JSON.stringify({

                    message:text

                })

            }
        );



        let result = await response.json();



        if(result.success){


            alert("留言发送成功");


            box.value="";


        }else{


            alert("留言发送失败");


        }



    }catch(e){


        alert("网络错误");


        console.log(e);


    }


}




loadMusic();
