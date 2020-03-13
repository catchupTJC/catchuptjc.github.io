onload = function() {

let allVoices;
let rateFld, speakBtn, speakerMenu;
let voiceIndex = 0;

function init(){
  speakBtn = qs("#speakBtn");
  speakerMenu = qs("#speakerMenu");
  speakBtn.addEventListener("click",talk,false); speakerMenu.addEventListener("change",selectSpeaker,false);
  rateFld = qs("#rateFld");
  
   if (window.speechSynthesis) {
    if (speechSynthesis.onvoiceschanged !== undefined) {
      //Chrome gets the voices asynchronously so this is needed
      speechSynthesis.onvoiceschanged = setUpVoices;
    }
    setUpVoices(); //for all the other browsers
  }else{
    speakBtn.disabled = true;
    speakerMenu.disabled = true;
    qs("#warning").style.display = "block";
  }
}
function setUpVoices(){
  allVoices = getAllVoices();
  filterVoices();
}
function talk(){
  let sval = Number(speakerMenu.value);
  let u = new SpeechSynthesisUtterance(document.querySelector('#readFrom').innerHTML);
  u.voice = allVoices[sval];
  u.lang = u.voice.lang;
  u.rate = Number(rateFld.value);
  speechSynthesis.speak(u);
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

// Generic Utility Functions
function qs(selectorText){
  //saves lots of typing for those who eschew Jquery
  return document.querySelector(selectorText);
}

document.addEventListener('DOMContentLoaded', function (e) {
  try {init();} catch (error){
    console.log("Data didn't load", error);}

});

}
