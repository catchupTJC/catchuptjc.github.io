onload = function() {
  
            if ('speechSynthesis' in window)
                with (speechSynthesis) {

                    var playEle = document.querySelector('#play');
                    var pauseEle = document.querySelector('#pause');
                    var stopEle = document.querySelector('#stop');
                    var flag = false;

                    playEle.addEventListener('click', onClickPlay);
                    pauseEle.addEventListener('click', onClickPause);
                    stopEle.addEventListener('click', onClickStop);

                    function onClickPlay() {
                        if (!flag) {
                            flag = true;
                            utterance = new SpeechSynthesisUtterance(document.querySelector('#readFrom').innerHTML).textContent; 
                     
                            let sval = Number(speakerMenu.value);                            
                            utterance.voice = allVoices[sval];
                            utterance.lang = utterance.voice.lang;
                            utterance.rate = Number(rateFld.value);

                            utterance.onend = function () {
                                flag = false;
                                playEle.className = pauseEle.className = '';
                                stopEle.className = 'stopped';
                            };
                            playEle.className = 'played';
                            stopEle.className = '';
                            speak(utterance);
                        }
                        if (paused) {
                            playEle.className = 'played';
                            pauseEle.className = '';
                            resume();
                        }
                    }

                    function onClickPause() {
                        if (speaking && !paused) {
                            pauseEle.className = 'paused';
                            playEle.className = '';
                            pause();
                        }
                    }

                    function onClickStop() {
                        if (speaking) {
                            stopEle.className = 'stopped';
                            playEle.className = pauseEle.className = '';
                            flag = false;
                            cancel();

                        }
                    }

                }

            else { /* speech synthesis not supported */
                msg = document.createElement('h5');
                msg.textContent = "Detected no support for Speech Synthesis";
                msg.style.textAlign = 'center';
                msg.style.backgroundColor = 'red';
                msg.style.color = 'white';
                msg.style.marginTop = msg.style.marginBottom = 0;
                document.body.insertBefore(msg, document.querySelector('div'));
            }

        }

  let allVoices;
  let rateFld, speakerMenu;
  let voiceIndex = 0;

  function init(){
  speakerMenu = qs("#speakerMenu");
  speakerMenu.addEventListener("change",selectSpeaker,false);
  rateFld = qs("#rateFld");
  
   if (window.speechSynthesis) {
    if (speechSynthesis.onvoiceschanged !== undefined) {
      //Chrome gets the voices asynchronously so this is needed
      speechSynthesis.onvoiceschanged = setUpVoices;
    }
    setUpVoices(); //for all the other browsers
   }else{
    speakerMenu.disabled = true;
    qs("#warning").style.display = "block";
   }
  }
   function setUpVoices(){
   allVoices = getAllVoices();
    filterVoices();
   }

  function createSpeakerMenu(voices){
  let code = ``;
  voices.forEach(function(vobj,i){
    code += `<option value=${vobj.id}>${vobj.name} (${vobj.lang})`;
    code += vobj.voiceURI.includes(".premium") ? ' (premium)' : ``;
    code += `</option>`;
  });
  speakerMenu.innerHTML = code;
}

function selectSpeaker(){
  voiceIndex = speakerMenu.selectedIndex;
}

function filterVoices(){
  let langcode = "en";
  voices = allVoices.filter(function (voice) {
    return langcode === "all" ? true : voice.lang.indexOf(langcode + "-") >= 0;
  });
  createSpeakerMenu(voices);
  speakerMenu.selectedIndex = voiceIndex;
}

function getAllVoices() {
  let voicesall = speechSynthesis.getVoices();
  let vuris = [];
  let voices = [];
  //unfortunately we have to check for duplicates
  voicesall.forEach(function(obj,index){
    let uri = obj.voiceURI;
    if (!vuris.includes(uri)){
        vuris.push(uri);
        voices.push(obj);
     }
  });
  voices.forEach(function(obj,index){obj.id = index;});
  return voices;
}
function qs(selectorText){
  return document.querySelector(selectorText);
}
document.addEventListener('DOMContentLoaded', function (e) {
  try {init();} catch (error){
    console.log("Data didn't load", error);}

}); 
