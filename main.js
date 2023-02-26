const fileInput = document.getElementById('fileInput');
const playButton = document.getElementById('playButton');
const outputArea = document.getElementById('outputArea');

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js';

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
          window.speechSynthesis.speak(utterance);

          outputArea.textContent = pageText;
        }).catch(console.error);
      }

      pdf.getPage(currentPage).then(playPage);
    });
  });

  reader.readAsArrayBuffer(file);
  console.log(page.getTextContent())
});

var i = 0;
var speed = 50;
function typeWriter(pageText) {
  if (i < pageText.length) {
   outputArea.textContent += pageText.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }}
