
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

    const updatePlayer = (name1, name2) => {
        players[0].name = name1;
        players[1].name = name2;
        if (activePlayer){
            initDom.showActivePlayer();
        }
        initDom.refreshPlayerBar(name1, name2);
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

    let activePlayer;

    const startGame = () => {
        activePlayer = players[Math.floor(Math.random() * 2)];
        gameboard.clear();
    }

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
        initDom.updateTile(tileNum, activePlayer.mark);
        checkWinner();
        switchActivePlayer();
        return {ok: true};
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
                initDom.alertGameOver(activePlayer.name);
                initDom.disableTiles();
                return;
            }
        }
        const tieCheck = [];
        for (const tile of board){
            if (tile !== null){
                tieCheck.push(tile);
            }
        }
        if (tieCheck.length === 9 && !winner){
            initDom.alertGameOver("tie");
        }
    }

    const resetGame = () => {
        gameboard.clear();
        initDom.resetTiles();
        initDom.buildGrid();
    }

    return { switchActivePlayer, placeMarker, status, resetGame, getPlayers, getActivePlayer, updatePlayer, startGame };
})();

const initDom = (function() {

    const placeholder = document.querySelector("#placeholder");

    const line1 = document.createElement("h2");
    line1.textContent = "WELCOME AND THANK YOU FOR YOUR TIME!";

    const line2 = document.createElement("h2");
    line2.textContent = "HOPE TO SEE YOU AGAIN <3";

    placeholder.appendChild(line1);
    placeholder.appendChild(line2);

    const buildPlayerBar = () => {

            const parent = document.querySelector('#player-data');
            const players = gameController.getPlayers();

                // set player 1
            const p1Div = parent.querySelector('#p1');
            const p1Name = document.createElement('h1');
                p1Name.textContent = players[0].name
                p1Name.id = "p1-name";
            const p1Mark = document.createElement('h1');
            p1Mark.textContent = players[0].mark;

            p1Div.appendChild(p1Name);
            p1Div.appendChild(p1Mark);
            parent.appendChild(p1Div);

                // set player 2
            const p2Div = parent.querySelector('#p2');
            const p2Name = document.createElement('h1');
            p2Name.textContent = players[1].name
            p2Name.id = "p2-name";
            const p2Mark = document.createElement('h1');
            p2Mark.textContent = players[1].mark;

            p2Div.appendChild(p2Name);
            p2Div.appendChild(p2Mark);
            parent.appendChild(p2Div);
    }

    const refreshPlayerBar = (name1, name2) => {
        document.getElementById("p1-name").textContent = name1;
        document.getElementById("p2-name").textContent = name2;
    }

    const buildGrid = () => {
        const board = document.querySelector("#board");
        board.textContent = '';
        board.style.display = 'grid';
        board.classList.remove('hide');
        for (let i = 0; i < 9; i++){
            const div = document.createElement("div");
            div.dataset.tileNum = i.toString();
            div.classList.add("empty");
            board.append(div);
            div.addEventListener("click", placeTile, {once: true});
        }
    };

    const showActivePlayer = () => {
        let activeP = gameController.getActivePlayer();

        const parent = document.querySelector("#active-player");
        parent.textContent = "";

        const div = document.createElement("div");

        const greeting = document.createElement("p");
        greeting.textContent = "Your turn, "

        const pName = document.createElement('h2');
        pName.textContent = activeP.name;

        div.appendChild(greeting);
        div.appendChild(pName);
        parent.appendChild(div);

        parent.classList.remove('hide');
        parent.style.display = 'flex';
    }

    const buildSettings = () => {

        const settings = document.querySelector("#settings");

        const div = document.createElement("div");

        const nameBtn = document.createElement("button");
        nameBtn.textContent = "Edit";
        nameBtn.id = "nameBtn";
        nameBtn.style.textTransform = "uppercase";

        const btnLabel = document.createElement("label");
        btnLabel.textContent = "Change Name";
        btnLabel.htmlFor = "nameBtn";

            nameBtn.addEventListener("click", (e) => {
                e.preventDefault();
                const players = gameController.getPlayers();

                const dialog = document.querySelector("dialog");

                const closeDialog = document.createElement("button");
                closeDialog.textContent = "X";
                closeDialog.className = "close";
                closeDialog.type = "button";

                dialog.textContent = "";
                dialog.id = "name-dialog"

                const form = document.createElement("form");

                const heading = document.createElement("h3");
                heading.textContent = "EDIT NAME(S)"
                heading.style.textTransform = "uppercase";

                const inputP1Label = document.createElement("label");
                inputP1Label.textContent = "Player 1";
                inputP1Label.htmlFor = "p1";

                const inputP1 = document.createElement("input");
                inputP1.type = "text";
                inputP1.value = players[0].name;
                inputP1.id = "p1";

                const inputP2Label = document.createElement("label");
                inputP2Label.textContent = "Player 2";
                inputP2Label.htmlFor = "p2";

                const inputP2 = document.createElement("input");
                inputP2.type = "text";
                inputP2.value = players[1].name;
                inputP2.id = "p2";

                const submit = document.createElement("button");
                submit.type = "submit";
                submit.textContent = "SAVE";
                submit.className = "save";

                form.appendChild(closeDialog);
                form.appendChild(heading);
                form.appendChild(inputP1Label);
                form.appendChild(inputP1);
                form.appendChild(inputP2Label);
                form.appendChild(inputP2);
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
                    const p1Name = inputP1.value.trim();
                    const p2Name = inputP2.value.trim();


                    dialog.close();
                    gameController.updatePlayer(p1Name, p2Name);
                    })

            });
        div.appendChild(btnLabel);
        div.appendChild(nameBtn);
        settings.appendChild(div);
    }

    const buildGameActions = () => {
        const div = document.querySelector("#game-actions");

        const playBtn = document.createElement("button");
        playBtn.textContent = "PLAY";
        playBtn.addEventListener("click", (e) => {
            e.preventDefault();
            placeholder.classList.add("hide");

            gameController.startGame();
            showActivePlayer();
            buildGrid();
            playBtn.classList.add("hide");
            resetBtn.classList.remove("hide");
        });

        const resetBtn = document.createElement("button");
        resetBtn.textContent = "RESET";
        resetBtn.classList.add("hide");
        resetBtn.addEventListener("click", (e) => {
            e.preventDefault();
            document.querySelector("#active-player").classList.add("hide");
            document.querySelector("#active-player").style.display = 'none';

            document.querySelector("#board").classList.add("hide");
            document.querySelector("#board").style.display = 'none';

            placeholder.classList.remove("hide");


            resetBtn.classList.add("hide");
            playBtn.classList.remove("hide");
        });
        div.appendChild(playBtn);
        div.appendChild(resetBtn);
    }

    const placeTile = (e) => {
        gameController.placeMarker(Number(e.currentTarget.dataset.tileNum));
        e.currentTarget.classList.remove("empty");
        e.currentTarget.style.cursor = "not-allowed";
    }

    const updateTile = (tileNum, mark) => {
        const div = document.querySelector(`[data-tile-num="${tileNum}"]`);
        div.textContent = mark;
    }

    const resetTiles = () => {
        const divs = document.querySelectorAll('[data-tile-num]');
        divs.forEach(div => { div.textContent = ''; });
    }

    const disableTiles = () =>  {
        const divs = document.querySelectorAll('[data-tile-num]');
        divs.forEach(div => {
            div.classList.remove('empty');
            div.style.cursor = "not-allowed";
            div.removeEventListener("click", placeTile);
        })
    }

    const alertGameOver = (winner) => {

        const gameOverDialog = document.querySelector("#game-over-dialog");
        gameOverDialog.style.display = 'flex';

        const container = document.createElement("div");

        const btn = document.createElement("button");
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            gameOverDialog.style.display = 'none';
            gameOverDialog.close();
            gameOverDialog.textContent = "";
        });
        btn.textContent = "X";
        btn.classList.add("close");
        container.appendChild(btn);

        if (winner !== "tie") {
            const heading = document.createElement("h1");
            heading.textContent = "CONGRATS"

            const player = document.createElement("h2");
            player.textContent = winner.toString();
            player.style.color = "rgb(0, 109, 111)";

            const ending = document.createElement("h3");
            ending.textContent = "You won!"

            const img = document.createElement("img");
            img.src = "./assets/award-svgrepo-com.svg"

            container.appendChild(heading);
            container.appendChild(player);
            container.appendChild(ending);
            container.appendChild(img);
        } else {
            const heading = document.createElement("h2");
            heading.textContent = "BUMMER"

            const ending = document.createElement("h3");
            ending.textContent = "No winner, cat's game!"

            const img = document.createElement("img");
            img.src = "./assets/cat-svgrepo-com.svg";

            container.appendChild(heading);
            container.appendChild(ending);
            container.appendChild(img);
        }

        gameOverDialog.appendChild(container);
        gameOverDialog.showModal();
    }

    buildPlayerBar();
    buildGameActions();
    buildSettings();

        return {buildGrid, showActivePlayer, refreshPlayerBar, updateTile, resetTiles, alertGameOver, disableTiles};
    })();




