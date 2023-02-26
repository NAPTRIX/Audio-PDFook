const fileInput = document.getElementById('fileInput');
const playButton = document.getElementById('playButton');
const outputArea = document.getElementById('outputArea');

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js';

playButton.addEventListener('click', () => {
  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.addEventListener('load', () => {
    const typedText = [];
    let currentPage = 1;

    pdfjsLib.getDocument(reader.result).promise.then(function(pdf) {
      const maxPages = pdf.numPages;
      
      function playPage(page) {
        page.getTextContent().then(function(textContent) {
          let item;

          for (item of textContent.items) {
            typedText.push(item.str);
          }

          const pageText = typedText.join(' ');

          outputArea.textContent = "";
          let i = 0;
          const typingInterval = setInterval(function() {
            if (i < pageText.length) {
              outputArea.textContent += pageText.charAt(i);
              i++;
            } else {
              clearInterval(typingInterval);
              const utterance = new SpeechSynthesisUtterance(pageText);
              utterance.rate = 0.8; // adjust the speed of speech if needed
              speechSynthesis.speak(utterance);
            }
          }, 50);

          if (page.number < maxPages) {
            currentPage += 1;
            pdf.getPage(currentPage).then(playPage).catch(console.error);
          }
        }).catch(console.error);
      }

      pdf.getPage(currentPage).then(playPage);
    });
  });

  reader.readAsArrayBuffer(file);
});
