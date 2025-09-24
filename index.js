
const gameboard = (function () {
    const board = Array(9).fill(null);

    const place = (index, mark) => {
        if (index < 0 || index > 8) return { ok: false, reason: "Out of Range"};
        if (board[index] != null) return {ok: false, reason: "Space occupied"};
        board[index] = mark;
        return { ok: true };
    }

    const cellCheck = (index) => board[index];
    const boardView = () => board.slice();
    const clear = () => board.fill(null);

    return {place, cellCheck, boardView, clear};
})();

const gameController = (function() {
    const players = [
        {
            name: "P1",
            mark: "X"
        },
        {
            name: "P2",
            mark: "O"
        },
    ]
    const winCons = [
        // Rows
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        // Columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        // Diagonal
        [0, 4, 8],
        [2, 4, 6]
    ]
    let activePlayer = players[0];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const placeMarker = (index) => {
        const check = gameboard.place(index, activePlayer.mark);
        if (!check.ok) return check;
        switchActivePlayer();
        return {ok: true};
    }

    const playRound = () => {
        const index = Number(window.prompt("index 0-8"));
        return placeMarker(index);
    };

    const status = () => ({
        board: gameboard.boardView(),
            activePlayer
    });

    const checkWinner = () => {
        const board = gameboard.boardView();
        console.log(board);
    }

    return { switchActivePlayer, playRound, placeMarker, status };
})();
console.log(gameController.status());