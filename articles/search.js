document.addEventListener(
"DOMContentLoaded",
()=>{


let input =
document.querySelector("#search-input");


if(!input)
return;



input.addEventListener(
"input",
()=>{


let key =
input.value.toLowerCase();



let cards =
document.querySelectorAll(
".article-card,.project-card,.product-card,.projects a"
);



cards.forEach(card=>{


let text =
card.innerText.toLowerCase();



if(
text.includes(key)
||
key==""
){


card.style.display="";


}

else{


card.style.display="none";


}



});


});



});