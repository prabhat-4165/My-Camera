let video = document.querySelector("video");

let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let recordFlag = false;
let transparentColor = "transparent";

let recorder;
// media data in chunks
// as whole video come in small parts known as chunks so we need to store them
let chunks = [];

let constraints = {
    video: true,
    audio: true
}

navigator.mediaDevices.getUserMedia(constraints)
.then((stream)=>{
     video.srcObject = stream;
     recorder = new MediaRecorder(stream);

     recorder.addEventListener("start", (e)=>{
        // here we will make chunks every time empty otherwise it will be filled or overloaded
        chunks = [];
     })

     recorder.addEventListener("dataavailable",(e)=> {
        chunks.push(e.data);
     })

     recorder.addEventListener("stop", (e)=>{
        // now we will convert the media chunks into video
        let blob = new Blob(chunks, { type:"video/mp4"});

       let videoURL = URL.createObjectURL(blob);
       let a = document.createElement("a");
       a.href = videoURL;
       a.download = "stream.mp4";
       a.click();
     }) 
})

recordBtnCont.addEventListener("click", (e) => {
    if (!recorder) return;

    recordFlag = !recordFlag;

    if (recordFlag) { // start
        recorder.start();
        recordBtn.classList.add("scale-record");
       startTimer();
    }
    else { // stop
        recorder.stop();
        recordBtn.classList.remove("scale-record");
       stopTimer();
    }
})

captureBtnCont.addEventListener("click", (e) => {
   let canvas = document.createElement("canvas");
   canvas.width = video.videoWidth;
   canvas.height = video.videoHeight;

   let tool = canvas.getContext("2d");
   // first 0 is for top and second 0 is for left 
   // canvas.width and height means how much part you want to take in your image 
   // as we want to take its complete part so we have given its full height and width
   tool.drawImage(video, 0, 0, canvas.width, canvas.height);

  // for filtering 
   tool.fillStyle = transparentColor;  
   tool.fillRect(0, 0, canvas.width, canvas.height);
   
   
   // for accessing the url of your image
   let imageURL = canvas.toDataURL;

   // this is for downloading the image
   let a = document.createElement("a");
   a.href = imageURL;
   a.download = "image.jpg";
   a.click();
})


let timerID;
let counter = 0; // used to display seconds
let timer = document.querySelector(".timer");
function startTimer(){

  timer.style.display = "block";
   function displayTimer(){
      let totalSeconds = counter;      
      let hours = Number.parseInt(totalSeconds/3600);
      
      totalSeconds %= 3600;
      let minutes = Number.parseInt(totalSeconds/60);

      totalSeconds %= 60;
      let seconds = totalSeconds;

      hours = (hours < 10) ? `0${hours}` : hours;
      minutes = (minutes < 10) ? `0${minutes}` : minutes;
      seconds = (seconds < 10) ? `0${seconds}` : seconds;


      timer.innerText = `${hours}:${minutes}:${seconds}`;
 
     counter++;
   }

  timerID = setInterval(displayTimer,1000);
}

function stopTimer(){
    clearInterval(timerID);
    timer.innerText= "00:00:00";
    timer.style.display = "none";
}

// filtering part implementation
let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");
allFilters.forEach((filterElem) => {
   filterElem.addEventListener("click", (e)=> {
      // get 
      transparentColor = getComputedStyle(filterElem).getPropertyValue("background-color");
      filterLayer.style.backgroundColor = transparentColor;
   })

});