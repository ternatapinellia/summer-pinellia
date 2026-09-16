let images = [

"images/tv.png",

"images/tv1.png",

"images/tv2.png",

"images/tv3.png",

"images/tv4.png"

];


let index = 0;


let banner = document.getElementById("banner");



setInterval(()=>{


index++;


if(index >= images.length)
{

    index = 0;

}



banner.style.opacity = 0;



setTimeout(()=>{


    banner.src = images[index];


    banner.style.opacity = 1;


},500);



},3000);