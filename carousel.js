let images = [

"images/cs1.png",

"images/cs2.png",

"images/cs3.png"

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
