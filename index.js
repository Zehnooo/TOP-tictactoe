
const gameboard = (function () {
    const board = Array(9).fill(null);

    const place = (index, mark) => {
        if (index < 0 || index > 8) return { ok: false, reason: "Out of Range"};
        if (board[index] != null) return {ok: false, reason: "Space occupied"};
        board[index] = mark;
        return { ok: true };
    }


    const boardView = () => board.slice();
    const clear = () => board.fill(null);

    return {place, boardView, clear};
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

    let activePlayer = players[Math.floor(Math.random() * 2)];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const placeMarker = () => {
        const index = Number(window.prompt("index 0-8"));
        const check = gameboard.place(index, activePlayer.mark);
        if (!check.ok) return check;
        checkWinner();
        switchActivePlayer();
        return {ok: true};
    }
    /*
    const playRound = () => {
        const index = Number(window.prompt("index 0-8"));
        return placeMarker(index);
    };
    */
    const status = () => ({
        board: gameboard.boardView(),
            activePlayer
    });

    const checkWinner = () => {
        const board = gameboard.boardView();
        for (let winCon of winCons) {
            const [a, b, c] = winCon;
            if (board[a] && board[a] === board[b] && board[a] === board[c]){
                console.log("Winner!", activePlayer, board);
            }
        }
        console.log(board);
    }

    const resetGame = () => {
        gameboard.clear();
    }

    return { switchActivePlayer, /* playRound, */ placeMarker, status };
})();

const initDom = (function() {

    const buildGrid = () => {
        const board = document.querySelector("#board");
        for (let i = 0; i < 9; i++){
            const div = document.createElement("div");
            div.textContent = "-";
            board.append(div);
        }
    }
    buildGrid();
    return {buildGrid};
})();
console.log(gameController.status());