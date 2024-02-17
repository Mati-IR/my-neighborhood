function generateSidebar(accountType) {
    const sidebar = document.getElementById("sidebar");

    const ul = document.createElement("ul");
    var items;
    if(accountType==="true"){
        items = [
            { text: "Utwórz konto", onclick: "generateNewUserRadio()" },
            { text: "Kreator osiedla", onclick: "generateBuildingPanel()" },
            { text: "Dane użytkownika", onclick: "displayUserData()" },
            { text: "Zmiana stawek", onclick: "displayUtilities()" },
            { text: "Ogłoszenia", onclick: "displayNews()" },
            { text: "Głosowania", onclick: "displayUtilities()" },
            { text: "Obsługa usterek", onclick: "displayUtilities()" },
            { text: "Raporty", onclick: "displayUtilities()" }
        ];
    }
    else{
        items = [
            { text: "Dane użytkownika", onclick: "displayUserData()" },
            { text: "Ogłoszenia", onclick: "displayNews()" },
            { text: "Aktualne stawki opłat", onclick: "displayUtilities()" }
        ];
    }
    items.forEach(item => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = item.text;
        a.onclick = () => eval(item.onclick);
        li.appendChild(a);
        ul.appendChild(li);
    });

    sidebar.appendChild(ul);
}