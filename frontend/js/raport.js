async function displayRaportSystem(){

  var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';
        headerTextChange("Tworzenie raportów");

  const container = document.createElement("div");
    container.classList.add("container", "mt-4");
    
  let row;
  const isAdmin = localStorage.getItem('admin');
  var buttonData = buttonDataAdmin;
  for (let i = 0; i < buttonData.length; i++) {
    if (i % 3 === 0) {
      row = document.createElement("div");
      row.classList.add("row", "row-cols-1", "row-cols-md-3", "g-3");
      container.appendChild(row);
    }

    const buttonText = buttonData[i][0];
    const buttonClickHandler = buttonData[i][1];

    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-primary";
    button.textContent = buttonText;
    button.onclick = buttonClickHandler;

    const column = document.createElement("div");
    column.classList.add("col");
    column.appendChild(button);

    row.appendChild(column);
  }
  contentContainer.appendChild(container);
  
}
function handleButtonClick(buttonName) {
  console.log(`Clicked ${buttonName}`);
}
async function generateUtilitiesPDF() {
  var products = await getAllUtilities();
  console.log(products);
  const { PDFDocument } = PDFLib;

  // Pobierz fontkit i zarejestruj go
  const fontkitScript = await fetch('https://unpkg.com/@pdf-lib/fontkit/dist/fontkit.umd.js');
  const fontkitCode = await fontkitScript.text();
  eval(fontkitCode); // Wykonaj kod fontkit

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit); // Zarejestruj fontkit

  const page = pdfDoc.addPage();

  const tableTopY = page.getHeight() - 50;
  const columnWidths = [50, 150, 150, 100];
  const rowHeight = 20;
  const tableHeader = ['ID', 'Nazwa', 'Cena za jednostkę', 'Podstawa rozliczenia'];

  // Pobierz czcionkę zawierającą polskie znaki
  const fontBytes = await fetch('resources/font/Roboto-Regular.ttf').then((res) => res.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);

  // Dodaj tytuł "Wykaz opłat" z odpowiednią czcionką
  page.drawText("Wykaz opłat", { x: 50, y: tableTopY + rowHeight, font: font });

  drawTableRow(page, tableTopY, tableHeader, columnWidths, true, font);

  products.forEach((product, index) => {
    const rowY = tableTopY - (index + 1) * rowHeight;
    drawTableRow(page, rowY, [product.id, product.name, `${product.price_per_unit.toFixed(2)}`, product.unit], columnWidths, false, font);
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "Utilities list.pdf";
  link.click();
  function drawTableRow(page, y, rowData, columnWidths, isHeader, font) {
    const rowHeight = 20;
    const startX = 50;
    let currentX = startX;
  
    rowData.forEach((cellData, index) => {
      page.drawText(cellData.toString(), {
        x: currentX,
        y: y - (rowHeight / 2),
        size: isHeader ? 12 : 10, // Rozmiar czcionki dla nagłówka i danych
        font: font // Ustawienie odpowiedniej czcionki
      });
      currentX += columnWidths[index];
    });
  
    if (isHeader) {
      page.drawLine({
        start: { x: startX, y: y - rowHeight },
        end: { x: startX + columnWidths.reduce((acc, width) => acc + width), y: y - rowHeight },
        thickness: 1
      });
    }
  }
}
async function generateOwnersPDF() {
  var messages = await getAllOwners();
  console.log(messages);
  const { PDFDocument } = PDFLib;

  // Fetch and evaluate fontkit
  const fontkitScript = await fetch('https://unpkg.com/@pdf-lib/fontkit/dist/fontkit.umd.js');
  const fontkitCode = await fontkitScript.text();
  eval(fontkitCode);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage();

  const tableTopY = page.getHeight() - 50;
  const columnWidths = [20, 100, 90, 150, 150];
  const rowHeight = 20;
  const tableHeader = ['ID', 'Imię nazwisko', 'Nr. tele.', 'Adres', 'Email'];

  // Embed font containing Polish characters
  const fontBytes = await fetch('resources/font/Roboto-Regular.ttf').then((res) => res.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);

  // Add title "Message Report" with appropriate font
  page.drawText("Wykaz właścicieli", { x: 50, y: tableTopY + rowHeight, font: font });

  drawTableRow(page, tableTopY, tableHeader, columnWidths, true, font);

  messages.forEach((message, index) => {
    const rowY = tableTopY - (index + 1) * rowHeight;
    drawTableRow(page, rowY, [message.id, message.full_name, message.phone_number, message.full_address, message.email], columnWidths, false, font);
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "owner list.pdf";
  link.click();
  function drawTableRow(page, y, rowData, columnWidths, isHeader, font) {
    const rowHeight = 20;
    const startX = 50;
    let currentX = startX;
  
    rowData.forEach((cellData, index) => {
      page.drawText(cellData.toString(), {
        x: currentX,
        y: y - (rowHeight / 2),
        size: isHeader ? 12 : 10,
        font: font
      });
      currentX += columnWidths[index];
    });
  
    if (isHeader) {
      page.drawLine({
        start: { x: startX, y: y - rowHeight },
        end: { x: startX + columnWidths.reduce((acc, width) => acc + width), y: y - rowHeight },
        thickness: 1
      });
    }
  }
}
async function generateServicemenPDF(){
  var messages = await getServicemen();
  const { PDFDocument } = PDFLib;

  // Fetch and evaluate fontkit
  const fontkitScript = await fetch('https://unpkg.com/@pdf-lib/fontkit/dist/fontkit.umd.js');
  const fontkitCode = await fontkitScript.text();
  eval(fontkitCode);

  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  const page = pdfDoc.addPage();

  const startY = page.getHeight() - 50;
  const lineHeight = 20;
  const margin = 50;

  // Embed font containing Polish characters
  const fontBytes = await fetch('resources/font/Roboto-Regular.ttf').then((res) => res.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);

  const tableHeader = ['ID', 'Imię nazwisko', 'Specjalizacja'];
  const columnWidths = [50, 150, 300];

  // Add header "Wykaz serwisantów"
  page.drawText("Wykaz serwisantów", { x: margin, y: startY + margin / 2, font: font, size: 16 });

  // Add table header
  drawTableRow(page, startY - margin, tableHeader, columnWidths, true, font);

  // Draw table content
  messages.forEach((message, index) => {
    const rowY = startY - (index + 2) * lineHeight - margin;
    drawTableRow(page, rowY, [message.id, message.full_name, message.specialties], columnWidths, false, font);
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "message_report.pdf";
  link.click();
  function drawTableRow(page, y, rowData, columnWidths, isHeader, font) {
    const rowHeight = 20;
    const startX = 50;
    let currentX = startX;
  
    rowData.forEach((cellData, index) => {
      page.drawText(cellData.toString(), {
        x: currentX,
        y: y - (rowHeight / 2),
        size: isHeader ? 12 : 10,
        font: font
      });
      currentX += columnWidths[index];
    });
  
    if (isHeader) {
      page.drawLine({
        start: { x: startX, y: y - rowHeight },
        end: { x: startX + columnWidths.reduce((acc, width) => acc + width), y: y - rowHeight },
        thickness: 1
      });
    }
  }
}









