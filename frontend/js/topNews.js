function generateAnnouncementView(data) {
    const container = document.createElement("div");
    container.classList.add("announcement-container");

    data.forEach(announcement => {
        const announcementCard = document.createElement("div");
        announcementCard.classList.add("announcement-card");

        const titleElement = document.createElement("h2");
        titleElement.textContent = announcement.title;
        titleElement.classList.add("announcement-title");

        const descriptionElement = document.createElement("p");
        descriptionElement.textContent = announcement.description;
        descriptionElement.classList.add("announcement-description");

        const creatorInfo = document.createElement("p");
        creatorInfo.textContent = `Creator ID: ${announcement.creator_id}`;
        creatorInfo.classList.add("creator-info");

        const creationDate = new Date(announcement.creation_date);
        const formattedDate = creationDate.toLocaleString();
        const dateElement = document.createElement("p");
        dateElement.textContent = `Created at: ${formattedDate}`;
        dateElement.classList.add("creation-date");

        announcementCard.appendChild(titleElement);
        announcementCard.appendChild(descriptionElement);
        announcementCard.appendChild(creatorInfo);
        announcementCard.appendChild(dateElement);

        container.appendChild(announcementCard);
    });
    document.getElementById("content").appendChild(container);
    return container;
}

// Użycie funkcji do wygenerowania widoku ogłoszeń
const announcementsData = [
    {
        id: 1,
        title: "Sample Title 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        creation_date: "2024-02-14T12:00:00",
        creator_id: 1
    },
    {
        id: 2,
        title: "Sample Title 2",
        description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
        creation_date: "2024-02-15T10:30:00",
        creator_id: 2
    },
    {
        id: 3,
        title: "Sample Title 3",
        description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.",
        creation_date: "2024-02-16T15:45:00",
        creator_id: 3
    }
];
function displayNews(){
    var contentContainer = document.getElementById("content");
        contentContainer.innerHTML = '';

    headerTextChange("Zarządzanie ogłoszeniami");
    generateAnnouncementView(announcementsData);
}

