
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
    const players = [
        { name: "P1", mark: "X" },
        { name: "P2", mark: "O" }
    ]

    const getPlayers = () => { return players; }

    const updatePlayer = (name) => {
        players[0].name = name;
        if (activePlayer === players[0]){
            initDom.showActivePlayer();
        }
        initDom.refreshPlayerBar(name);
    }

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
        initDom.showActivePlayer(activePlayer);
    }
    const getActivePlayer = () => {
        return activePlayer;
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

    return { switchActivePlayer, placeMarker, status, updateTile, resetTiles, getPlayers, getActivePlayer, updatePlayer };
})();

const initDom = (function() {

    const buildPlayerBar = () => {

            const parent = document.querySelector('#player-data');
            const players = gameController.getPlayers();

                // set player 1
            const p1Div = parent.querySelector('#p1');
            const p1Name = document.createElement('h1');
                p1Name.textContent = players[0].name
                p1Name.id = "player-name";
            const p1Mark = document.createElement('h1');
            p1Mark.textContent = players[0].mark;

            p1Div.appendChild(p1Name);
            p1Div.appendChild(p1Mark);
            parent.appendChild(p1Div);

                // set player 2
            const p2Div = parent.querySelector('#p2');
            const p2Name = document.createElement('h1');
            p2Name.textContent = players[1].name
            const p2Mark = document.createElement('h1');
            p2Mark.textContent = players[1].mark;

            p2Div.appendChild(p2Name);
            p2Div.appendChild(p2Mark);
            parent.appendChild(p2Div);
    }

    const refreshPlayerBar = (name) => {
        document.getElementById("player-name").textContent = name;
    }

    const buildGrid = () => {
        const board = document.querySelector("#board");
        board.textContent = '';
        for (let i = 0; i < 9; i++){
            const div = document.createElement("div");
            div.dataset.tileNum = i.toString();
            div.classList.add("empty");
            board.append(div);
            div.addEventListener("click", (e) => {
                gameController.placeMarker(Number(e.currentTarget.dataset.tileNum));
                div.classList.remove("empty");
                div.style.cursor = "not-allowed";
            });
        }
    };

    const showActivePlayer = () => {
        let activeP = gameController.getActivePlayer();
        const parent = document.querySelector("#active-player");
        parent.textContent = "";
        const div = document.createElement("div");
        const greeting = document.createElement("p");
        const pName = document.createElement('h2');
        greeting.textContent = "Your turn, "
        pName.textContent = activeP.name;
        div.appendChild(greeting);
        div.appendChild(pName);
        parent.appendChild(div);
    }

    const buildSettings = () => {

        const settings = document.querySelector("#settings");

        const div = document.createElement("div");

        const nameBtn = document.createElement("button");
        nameBtn.textContent = "Edit";
        nameBtn.id = "nameBtn";
        nameBtn.style.textTransform = "uppercase";

        const btnLabel = document.createElement("label");
        btnLabel.textContent = "Player Name";
        btnLabel.htmlFor = "nameBtn";

            nameBtn.addEventListener("click", (e) => {

                const dialog = document.querySelector("dialog");

                const closeDialog = document.createElement("button");
                closeDialog.textContent = "X";
                closeDialog.className = "close";
                closeDialog.type = "button";
                dialog.textContent = "";

                const form = document.createElement("form");

                const input = document.createElement("input");
                input.type = "text";
                input.placeholder = "Steven Bills"

                const heading = document.createElement("h3");
                heading.textContent = "Enter Your Name"
                heading.style.textTransform = "uppercase";
                const submit = document.createElement("button");
                submit.type = "submit";
                submit.textContent = "SAVE";
                submit.className = "save";

                form.appendChild(closeDialog);
                form.appendChild(heading);
                form.appendChild(input);
                form.appendChild(submit);

                dialog.appendChild(form);
                dialog.showModal();

                closeDialog.addEventListener("click", e => {
                    e.preventDefault();
                    dialog.close();
                });

                dialog.addEventListener("cancel", (e) => {
                    e.preventDefault();
                    dialog.close();
                });

                form.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const value = input.value.trim();
                    if (!value) {
                            alert("Name cannot be empty");
                            return false;
                        }

                    dialog.close();
                    gameController.updatePlayer(value);
                    })

            });
        div.appendChild(btnLabel);
        div.appendChild(nameBtn);
        settings.appendChild(div);
    }


    showActivePlayer();
    buildPlayerBar();
    buildGrid();
    buildSettings();

        return {buildGrid, buildPlayerBar, buildSettings, showActivePlayer, refreshPlayerBar};
    })();




