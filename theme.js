document.addEventListener(
"DOMContentLoaded",
()=>{


const btn=document.getElementById(
"theme-btn"
);



if(!btn){
    return;
}



let theme=
localStorage.getItem(
"theme"
);



// 读取保存主题

if(theme==="light"){

    document.body.classList.add(
        "light"
    );

}





function updateButton(){


    if(
        document.body.classList.contains("light")
    ){

        btn.innerHTML="🌙";

    }
    else{

        btn.innerHTML="☀️";

    }


}





updateButton();





btn.onclick=()=>{


    document.body.classList.toggle(
        "light"
    );



    let isLight=
    document.body.classList.contains(
        "light"
    );



    localStorage.setItem(

        "theme",

        isLight
        ?
        "light"
        :
        "dark"

    );



    updateButton();



};



});