const apiBaseUrl = 'http://localhost:8000';
const messageLevelClassArray = ['levelSucces','levelWarning','d-none','levelACHTUNG'];
const homepageUrl = "http://localhost:7999";
const headersBuildings = ["ID", "Nazwa budynku", "Miasto", "Ulica", "Nr. budynku", "Kod pocztowy", "Liczba pięter", "", "", ""];
const announcementsPerPage = 3;
let currentPage = 1;
const billBase = [
    {
        "id": 1,
        "opis": "Opłata za m2"
    },
    {
        "id": 2,
        "opis": "Opłata za osobę"
    }
];
const buttonDataAdmin = [
    ["Stawki opłat", () => generateUtilitiesPDF()],
    ["Wykaz właścicieli", () => generateOwnersPDF()],
    ["Wykaz serwisantów", () => generateServicemenPDF()],
];