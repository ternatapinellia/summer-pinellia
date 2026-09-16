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


if(audio.paused)

{

audio.play();

}

else

{

audio.pause();

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




function sendComment(){


let text =
document.getElementById("message").value;



if(!text)

{

alert("请输入留言");

return;

}



alert(
"留言功能已准备，后续接入邮箱接口"
);



}




loadMusic();
