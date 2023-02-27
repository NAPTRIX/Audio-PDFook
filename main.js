const fileInput = document.getElementById('fileInput');
const playButton = document.getElementById('playButton');
const outputArea = document.getElementById('outputArea');
const voicePicker = document.getElementById('voicePicker');
const pitchSlider = document.getElementById('pitchSlider');
const speedSlider = document.getElementById('speedSlider')
let voices = [];

voicePicker.addEventListener('change',()=> console.log(voicePicker.value))

pitchSlider.addEventListener("change", ()=> document.getElementById('pitch').textContent = `Pitch: ${pitchSlider.value}` )


speedSlider.addEventListener("change", function(){
  document.getElementById("speed").textContent= `Speed: ${speedSlider.value}`
})

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

function populateVoices() {
  return new Promise((resolve, reject) => {
    voices = speechSynthesis.getVoices();
    if (voices.length !== 0) {
       speechSynthesis.onvoiceschanged = () => {
  populateVoices();
};

      resolve();
    } else {
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices();
        resolve();
      };
    }
  });
}

function playPDF() {
  const file = fileInput.files[0];
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    pdfjsLib.getDocument(reader.result).promise.then(function (pdf) {
      const maxPages = pdf.numPages;
      let currentPage = parseInt(document.getElementById('currentPage').value);

      function processPage() {
        if (currentPage > maxPages) {
          return;
        }
        pdf.getPage(currentPage).then(function (page) {
          page.getTextContent().then(function (textContent) {
            let pageText = "";
            for (const item of textContent.items) {
              pageText += item.str;
            }
            const utterance = new SpeechSynthesisUtterance(pageText);
            utterance.rate = speedSlider.value;
            utterance.voice = voices[voicePicker.value];
            utterance.pitch = pitchSlider.value;
            window.speechSynthesis.speak(utterance);
            typeWriter(outputArea, pageText, 1);
            utterance.onend = function () {
              currentPage++;
              processPage();
            };
          }).catch(console.error);
        });
      }

      processPage();
    });
  });
  reader.readAsArrayBuffer(file);
}


populateVoices().then(() => {
  voicePicker.innerHTML = '';
  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement('option');
    option.textContent = voices[i].name;
    option.value = i;
    voicePicker.appendChild(option);
  }
});

playButton.addEventListener("click", () => {
  playPDF();
});

// Update the pitch when the user moves the pitch slider
pitchSlider.addEventListener('input', () => {
  pitch = pitchSlider.value;
});
