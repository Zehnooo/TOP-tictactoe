
const gameboard = (function () {
    const board = Array(9).fill(null);

    const place = (tileNum, mark) => {
        if (board[tileNum] != null) return {ok: false, reason: "Space occupied"};
        board[tileNum] = mark;
        return { ok: true };
    }


    const boardView = () => board.slice();
    const clear = () => board.fill(null);

    return {place, boardView, clear};
})();

const gameController = (function() {
    const getPlayers = () => ([
        { name: "P1", mark: "X" },
        { name: "P2", mark: "O" },
    ]);

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
    const players = getPlayers();
    let activePlayer = players[Math.floor(Math.random() * 2)];

    const switchActivePlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const placeMarker = (tileNum) => {
        const check = gameboard.place(tileNum, activePlayer.mark);
        if (!check.ok) {
            console.warn(check.reason);
            return check
        }
        updateTile(tileNum, activePlayer.mark);
        checkWinner();
        switchActivePlayer();
        return {ok: true};
    }

    const updateTile = (tileNum, mark) => {
        const div = document.querySelector(`[data-tile-num="${tileNum}"]`);
        div.textContent = mark;
    }

    const resetTiles = () => {
        const divs = document.querySelectorAll('[data-tile-num]');
        divs.forEach(div => { div.textContent = '-'; });
    }

    const status = () => ({
        board: gameboard.boardView(),
            activePlayer
    });

    const checkWinner = () => {
        const board = gameboard.boardView();
        let winner = false;
        for (let winCon of winCons) {
            const [a, b, c] = winCon;
            if (board[a] && board[a] === board[b] && board[a] === board[c]){
                winner = true;
                alert(`"Winner!", ${activePlayer.name}`);
                resetGame();
                return;
            }
        }
        console.log(board);
        const tieCheck = [];
        for (const tile of board){
            if (tile !== null){
                tieCheck.push(tile);
            }
        }
        if (tieCheck.length === 9 && !winner){
            alert("tie");
            resetGame();
        }
    }

    const resetGame = () => {
        gameboard.clear();
        resetTiles();
        initDom.buildGrid();
    }

    return { switchActivePlayer, placeMarker, status, updateTile, resetTiles, getPlayers };
})();

const initDom = (function() {
    const players = gameController.getPlayers();
    const playerOne = players[0].name;
    const setPlayerData = (function() {
        const parent = document.querySelector('#player-data');
        const p1Div = parent.querySelector('#p1');
        const pName = document.createElement('p');
        const pMark = document.createElement('p');
        console.log(players);
        console.log("p1", playerOne);

        return {};
    })();

    const buildGrid = () => {
        const board = document.querySelector("#board");
        board.textContent = '';
        for (let i = 0; i < 9; i++){
            const div = document.createElement("div");
            const span = document.createElement("span");
            span.textContent = "-";
            div.appendChild(span);
            div.dataset.tileNum = i.toString();
            board.append(div);
            div.addEventListener("click", (e) => {
                gameController.placeMarker(Number(e.currentTarget.dataset.tileNum));

            });
        }
        return {};
    };

    buildGrid();
    return {buildGrid};
})();
