const fileInput = document.getElementById('fileInput');
const playButton = document.getElementById('playButton');
const outputArea = document.getElementById('outputArea');

function typeWriter(element, text, speed) {
  let i = 0;
  function write() {
    element.textContent += text.charAt(i);
    i++;
    if (i < text.length) {
      requestAnimationFrame(write);
    }
  }
  write();
}
/* This is experimental 
function typeWriter(element, text, speed) {
  let i = 0;
  const delay = speed / text.length;
  function write() {
    element.textContent += text.charAt(i);
    i++;
    if (i < text.length) {
      setTimeout(write, delay);
    }
  }
  write();
}*/


pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js';

speechSynthesis.onvoiceschanged = function() {
  const voices = speechSynthesis.getVoices();
  const voicePicker = document.getElementById('voicePicker');
  voicePicker.innerHTML = '';
  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement('option');
    option.textContent = voices[i].name;
    option.value = i;
    voicePicker.appendChild(option);
  }
  const pitchSlider = document.getElementById('pitchSlider');
  pitchSlider.value = pitch;
};

playButton.addEventListener("click", () => {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    pdfjsLib.getDocument(reader.result).promise.then(function (pdf) {
      const maxPages = pdf.numPages;
      let currentPage = 1;

      // recrusive function 
      function processPage(pageNum) {
        if (pageNum > maxPages) {
          return; // All pages have been processed
        }
        pdf.getPage(pageNum).then(function (page) {
          page.getTextContent().then(function (textContent) {
            let pageText = "";
            for (const item of textContent.items) {
              pageText += item.str;
            }
            const utterance = new SpeechSynthesisUtterance(pageText);
            utterance.voice = speechSynthesis.getVoices()[voicePicker.value];
            utterance.pitch = pitchSlider.value;
            window.speechSynthesis.speak(utterance);
            typeWriter(outputArea, pageText, 1);
            // typewriter effect after all text has been concatenated 
            utterance.onend = function () {
              
              // process the next page
              processPage(pageNum + 1);
            };
          }).catch(console.error);
        });
      }

      processPage(1); // start processing the first page
    });
  });
  reader.readAsArrayBuffer(file);
});
;

// Update the pitch when the user moves the pitch slider
const pitchSlider = document.getElementById('pitchSlider');
pitchSlider.addEventListener('input', () => {
  pitch = pitchSlider.value;
});
