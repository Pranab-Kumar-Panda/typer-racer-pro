document.addEventListener('DOMContentLoaded', () => {
    const leaderboardTableBody = document.querySelector('#leaderboardTable tbody');

    const loadLeaderboard = () => {
        const scores = JSON.parse(localStorage.getItem('typerProLeaderboard')) || [];
        leaderboardTableBody.innerHTML = '';

        if (scores.length === 0) {
            const noScoresRow = document.createElement('tr');
            noScoresRow.innerHTML = `<td colspan="7">No scores yet! Be the first to race.</td>`;
            leaderboardTableBody.appendChild(noScoresRow);
            return;
        }

        scores.forEach((score, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${score.name}</td>
                <td>${score.wpm}</td>
                <td>${score.accuracy}%</td>
                <td>${score.errors}</td>
                <td>${score.category}</td>
                <td>${score.date}</td>
            `;
            if (index < 3) {
                row.classList.add('top-rank');
            }
            leaderboardTableBody.appendChild(row);
        });
    };

    loadLeaderboard();
});