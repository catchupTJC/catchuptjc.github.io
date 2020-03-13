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
                            utterance = new SpeechSynthesisUtterance(document.querySelector('#readFrom').innerHTML);

                            utterance.lang = 'en';
                            utterance.rate = 0.7;
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
