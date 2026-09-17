let musics = [

"/music/01 - A Real Boy!.mp3",

"/music/02 - BIG SHOT.mp3",

"/music/03 - Deal Gone Wrong.mp3",

"/music/04 - Dialtone.mp3",

"/music/05 - HEY EVERY    !.mp3",

"/music/06 - NOW'S YOUR CHANCE TO BE A.mp3",

"/music/07 - Spamton.mp3"

];


let currentMusic =
Number(localStorage.getItem("musicIndex")) || 0;


let audio =
document.getElementById("bgm");


let playMode =
localStorage.getItem("playMode") || "loop";



function loadMusic(){

audio.src =
musics[currentMusic];


document.getElementById("musicName").innerText =
decodeURIComponent(
    musics[currentMusic]
    .split("/")
    .pop()
)
.replace(".mp3","");


audio.volume =
localStorage.getItem("volume") || 1;


}





function toggleMusic(){


let btn =
document.getElementById("playBtn");


if(audio.paused){

audio.play();

btn.innerHTML="⏸";

localStorage.setItem(
"playing",
"true"
);


}

else{

audio.pause();

btn.innerHTML="▶";

localStorage.setItem(
"playing",
"false"
);


}

}





function nextMusic(){

currentMusic++;


if(currentMusic>=musics.length)

currentMusic=0;


localStorage.setItem(
"musicIndex",
currentMusic
);


loadMusic();

audio.play();

}




function prevMusic(){

currentMusic--;


if(currentMusic<0)

currentMusic=musics.length-1;


localStorage.setItem(
"musicIndex",
currentMusic
);


loadMusic();

audio.play();

}





audio.onended=function(){


if(playMode=="single"){

audio.currentTime=0;

audio.play();

}

else{

nextMusic();

}


}





function changeMode(){

playMode =
document.getElementById("mode").value;


localStorage.setItem(
"playMode",
playMode
);


}




loadMusic();


if(
localStorage.getItem("playing")
=="true"
){

audio.play();

}