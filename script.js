const musicList = [

"01 - A Real Boy!.mp3",

"02 - BIG SHOT.mp3",

"03 - Deal Gone Wrong.mp3",

"04 - Dialtone.mp3",

"05 - HEY EVERY    !.mp3",

"06 - NOW'S YOUR CHANCE TO BE A.mp3",

"07 - Spamton.mp3"

];


let index = 0;


const audio = document.getElementById("bgm");
const nameBox = document.getElementById("music-name");



function playMusic(){

    let file = musicList[index];

    audio.src =
    "music/" + encodeURI(file);

    nameBox.innerText=file;

    audio.play();

}



function nextMusic(){

    index++;

    if(index>=musicList.length)
        index=0;


    playMusic();

}



function toggleMusic(){

    if(audio.paused){

        playMusic();

    }
    else{

        audio.pause();

    }

}



// 页面打开自动第一首

window.onload=function(){

    playMusic();

}