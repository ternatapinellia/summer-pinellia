
document.addEventListener(
"DOMContentLoaded",
()=>{


let input=document.querySelector(
"#site-search"
);


if(!input)return;



fetch(
input.dataset.json
)

.then(r=>r.json())

.then(data=>{


input.addEventListener(
"input",
()=>{


let old=document.querySelector(
"#search-result"
);


if(old)
old.remove();



let key=input.value.trim();



if(!key)
return;



let box=document.createElement(
"div"
);


box.id="search-result";


box.style.position="fixed";
box.style.right="80px";
box.style.top="70px";
box.style.background="#111";
box.style.color="white";
box.style.padding="10px";
box.style.borderRadius="15px";
box.style.zIndex="99999";



data.filter(
x=>

x.title.includes(key)
||
x.content.includes(key)

)
.slice(0,10)
.forEach(
x=>{


let a=document.createElement(
"a"
);


a.href=x.url;

a.innerText=x.title;


a.style.display="block";

a.style.color="white";

a.style.padding="8px";



box.appendChild(a);



}
);



document.body.appendChild(
box
);



});


});


});
