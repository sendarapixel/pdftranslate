$(document).ready(function () {
      const downloadButton = $("#download-btn");
        const translateForm = $("#translate-form");
          const languageSelect = $("#language-select");

            translateForm.on("submit", async function (event) {
                event.preventDefault();

                    const fileInput = document.querySelector("#file-input");
                        const file = fileInput.files[0];
                            if (!file) {
                                  alert("Please select a PDF file to translate.");
                                        return;
                                            }

                                                const lang = languageSelect.val();

                                                    const api_key = await $.getScript("config.js", function () {
                                                          return API_KEY;
                                                              });

                                                                  const translate = new Translate({ api_key });

                                                                      const pdfReader = new FileReader();
                                                                          pdfReader.onload = async function (event) {
                                                                                const buffer = event.target.result;
                                                                                      const pdf = await PDFJS.getDocument({ data: buffer });
                                                                                            const totalPages = pdf.numPages;

                                                                                                  const translations = [];
                                                                                                        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                                                                                                                const page = await pdf.getPage(pageNum);
                                                                                                                        const textContent = await page.getTextContent();
                                                                                                                                const textItems = textContent.items.map(item => item.str);
                                                                                                                                        const text = textItems.join(" ");
                                                                                                                                                const translation = await translate.translateText(text, lang);
                                                                                                                                                        translations.push(translation);
                                                                                                                                                              }

                                                                                                                                                                    const mergedText = translations.join(" ");
                                                                                                                                                                          const blob = new Blob([mergedText], { type: "text/plain;charset=utf-8" });
                                                                                                                                                                                const blobUrl = URL.createObjectURL(blob);

                                                                                                                                                                                      try {
                                                                                                                                                                                              const doc = new jsPDF();
                                                                                                                                                                                                      const lineHeight = doc.getLineHeight();
                                                                                                                                                                                                              const lines = doc.splitTextToSize(mergedText, 210);
                                                                                                                                                                                                                      for (let i = 0; i < lines.length; i++) {
                                                                                                                                                                                                                                doc.text(10, (i + 1) * lineHeight, lines[i]);
                                                                                                                                                                                                                                        }
                                                                                                                                                                                                                                                doc.save("translated.pdf");
                                                                                                                                                                                                                                                      } catch (error) {
                                                                                                                                                                                                                                                              console.error("Failed to generate the translated PDF.", error);
                                                                                                                                                                                                                                                                      alert("Failed to generate the translated PDF. Please try again later.");
                                                                                                                                                                                                                                                                            } finally {
                                                                                                                                                                                                                                                                                    downloadButton.attr("disabled", false);
                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                              };
                                                                                                                                                                                                                                                                                                  pdfReader.readAsArrayBuffer(file);
                                                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                                                    });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                });
                                                                                                                                                                                                                                                                                                    
                                                                                                                                                                                                            });
                                                                                                                                                                                                                                                                                                    
})
})