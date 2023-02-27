const fileInput = document.getElementById('fileInput');
const playButton = document.getElementById('playButton');
const outputArea = document.getElementById('outputArea');
let i = 0;
let speed = 50;
let pitch = 1;

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

playButton.addEventListener('click', () => {

  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    pdfjsLib.getDocument(reader.result).promise.then(function(pdf) {
      const maxPages = pdf.numPages;
      let currentPage = 1;
      let pageText = '';

      function playPage(page) {
        page.getTextContent().then(function(textContent) {
          let item;

          for (item of textContent.items) {
            pageText += item.str;
          }

          const utterance = new SpeechSynthesisUtterance(pageText);
          utterance.voice = speechSynthesis.getVoices()[voicePicker.value];
          utterance.pitch = pitchSlider.value;
          window.speechSynthesis.speak(utterance);

          //outputArea.textContent = pageText;
          console.log(pageText.length);
         if (pageText.length){
           typeWriter(outputArea,pageText,350)
          }
        }).catch(console.error);
      }

      pdf.getPage(currentPage).then(playPage);
    });
  });

  reader.readAsArrayBuffer(file);
});

// Update the pitch when the user moves the pitch slider
const pitchSlider = document.getElementById('pitchSlider');
pitchSlider.addEventListener('input', () => {
  pitch = pitchSlider.value;
});

