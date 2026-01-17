document.getElementById("btn").addEventListener("click",() => {

});


if ('serviceworker' in navigator)  {
    window.addEventListener("load",()=>{
        navigator.serviceWorker
        .register("service-worker.js")
        .then(() => console.log("service worker registered"))
        .catch(err => console.log("service worker failled",err));
    })
    


    }


