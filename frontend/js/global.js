const apiBaseUrl = 'http://localhost:8000';
const messageLevelClassArray = ['levelSucces','levelWarning','d-none','levelACHTUNG'];
const homepageUrl = "http://localhost:7999";
const headersBuildings = ["ID", "Nazwa budynku", "Miasto", "Ulica", "Nr. budynku", "Kod pocztowy", "Liczba pięter", "", "", ""];
const announcementsPerPage = 3;
let currentPage = 1;

const buttonData = [
    ["Stawki opłat", () => generatePDF()],
    ["Button 2", () => handleButtonClick("Button 2")],
    ["Button 3", () => handleButtonClick("Button 3")],
    ["Button 4", () => handleButtonClick("Button 4")],
    ["Button 5", () => handleButtonClick("Button 5")],
    ["Button 6", () => handleButtonClick("Button 6")],
    ["Button 7", () => handleButtonClick("Button 7")],
    ["Button 8", () => handleButtonClick("Button 8")],
    ["Button 9", () => handleButtonClick("Button 9")],
    ["Button 10", () => handleButtonClick("Button 10")],
    ["Button 11", () => handleButtonClick("Button 11")],
    ["Button 12", () => handleButtonClick("Button 12")],
    ["Button 13", () => handleButtonClick("Button 13")],
    ["Button 14", () => handleButtonClick("Button 14")],
    ["Button 15", () => handleButtonClick("Button 15")],
    ["Button 16", () => handleButtonClick("Button 16")]
];
//const fontBytes = await fetch('resources/font/Roboto-Regular.ttf').then((res) => res.arrayBuffer());