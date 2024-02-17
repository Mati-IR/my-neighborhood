async function displayVotingSystem(){
    displayVoteData();
}
function displayVoteData() {
    // Assuming you have data available as JSON objects for both vote and voting tables
    const voteData = [
        { id: 1, timestamp: "2024-02-17 12:00:00", owned_spaces: 5, choice: 1, voter_id: 1 },
        { id: 2, timestamp: "2024-02-17 12:05:00", owned_spaces: 3, choice: 2, voter_id: 2 }
        // Add more data as needed
    ];

    const votingData = [
        { id: 1, date: "2024-02-17", title: "Sample Title", description: "Sample Description", votes: 1 },
        // Add more data as needed
    ];

    const contentDiv = document.getElementById('content');

    // Display data from vote table
    let voteList = document.createElement('div');
    voteList.classList.add('data-container');
    voteList.innerHTML += '<h2>Vote Table</h2>';
    voteData.forEach(vote => {
        voteList.innerHTML += `<p><strong>ID:</strong> ${vote.id}</p>`;
        voteList.innerHTML += `<p><strong>Timestamp:</strong> ${vote.timestamp}</p>`;
        voteList.innerHTML += `<p><strong>Owned Spaces:</strong> ${vote.owned_spaces}</p>`;
        voteList.innerHTML += `<p><strong>Choice:</strong> ${vote.choice}</p>`;
        voteList.innerHTML += `<p><strong>Voter ID:</strong> ${vote.voter_id}</p>`;
        voteList.innerHTML += '<hr>';
    });
    contentDiv.appendChild(voteList);

    // Display data from voting table
    let votingList = document.createElement('div');
    votingList.classList.add('data-container');
    votingList.innerHTML += '<h2>Voting Table</h2>';
    votingData.forEach(voting => {
        votingList.innerHTML += `<p><strong>ID:</strong> ${voting.id}</p>`;
        votingList.innerHTML += `<p><strong>Date:</strong> ${voting.date}</p>`;
        votingList.innerHTML += `<p><strong>Title:</strong> ${voting.title}</p>`;
        votingList.innerHTML += `<p><strong>Description:</strong> ${voting.description}</p>`;
        votingList.innerHTML += `<p><strong>Votes:</strong> ${voting.votes}</p>`;
        votingList.innerHTML += '<hr>';
    });
    contentDiv.appendChild(votingList);
}