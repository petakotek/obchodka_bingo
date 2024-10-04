let dict = [
    "člověčee!",
    "vypněte ty plácačky",
    "nohejbal",
    "to jste Vy mladí",
    "maturita",
    "Coca-Cola",
    "pivní kvíz",
    "přestávku?",
    "podtácek",
    "přezůvky",
    "pouze technický dotaz",
    "mládeži",
    "máte to v edookitu",
    "dáme si bingo",
    "zavři ty dveře",
    "paní ředitelka",
    "stránky školy",
    "Vy nic nevíte!",
    "Your sincerely",
];

const setLocalStorage = () => {
    const checked = Array(16).fill(false);
    localStorage.removeItem("checked");
    localStorage.removeItem("win");

    localStorage.setItem("checked", JSON.stringify(checked));
    localStorage.setItem("win", JSON.stringify(false));
};

const setCookie = (today) => {
    let device_unique_seed = "";
    const parts = document.cookie.split("; ");
    device_unique_seed = parts.find((row) => row.startsWith("obchodka_bingo_device_unique_seed="))?.split("=")[1];

    if (!device_unique_seed) {
        setLocalStorage();
        device_unique_seed = crypto.randomUUID();

        let midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
        let expires = "; expires=" + midnight.toGMTString();
        document.cookie = "obchodka_bingo_device_unique_seed=" + device_unique_seed + expires + "; path=/";

        const checked = JSON.parse(localStorage.getItem("checked"));
        return [device_unique_seed, checked];
    } else {
        const checked = JSON.parse(localStorage.getItem("checked"));
        return [device_unique_seed, checked];
    }
};

const shuffleArray = (device_unique_seed) => {
    // shuffle
    let random_gen = new Math.seedrandom(device_unique_seed);

    for (i = 0; i < dict.length; ++i){
        var swap_index = Math.floor(random_gen.quick() * dict.length);
        [dict[swap_index], dict[i]] = [dict[i], dict[swap_index]];
    }
};

const win = () => {
    localStorage.setItem("win", JSON.stringify(true));
    alert("Bingo!");

    localStorage.setItem("win", JSON.stringify(false));
};

const check_win = (checked) => {
    let won = JSON.parse(localStorage.getItem("win"));

    if (won){
        return;
    }

    //columns
    for (x = 0; x < 4; ++x){
        column_full = true;
        for (y = 0; y < 4; ++y){

            if (!checked[y * 4 + x]){
                column_full = false;
            }

        }
        if (column_full) {
            win();
            return;
        }
    }

    //rows
    for (y = 0; y < 4; ++y){
        row_full = true;
        for (x = 0; x < 4; ++x){

            if (!checked[y * 4 + x]){
                row_full = false;
            }

        }
        if (row_full) {
            win();
            return;
        }
    }

    // diagonal
    if (checked[0] && checked[5] && checked[10] &&  checked[15]){
        win();
        return;
    }
    if (checked[3] && checked[6] && checked[9] &&  checked[12]){
        win();
        return;
    }
};

const onClickCell = (cell, index, checked) => {
        cell.onclick = function () {
            checked[index] = !checked[index];
            if (checked[index]){
                this.classList.add("cell-active");
                this.classList.remove("cell-hover");
            }else {
                this.classList.remove("cell-active");
                this.classList.add("cell-hover");
            }
            localStorage.setItem("checked", JSON.stringify(checked));
            check_win(checked);
        };
};

document.addEventListener("DOMContentLoaded", () => {
    mainLoop();
    
    
    
});

const mainLoop = () => {
    let today = new Date();
    let shuffleButton = document.getElementById("shuffle");


    let [device_unique_seed, checked] = setCookie(today);


    const updateSquares = () => {
        let squares = document.getElementsByClassName("square");
        squares = [...squares];

        squares.forEach((cell, index) => {
            cell.children[0].innerText = dict[index];
            if (checked[index]) {
                cell.classList.add("cell-active");
                cell.classList.remove("cell-hover");
            } else {
                cell.classList.remove("cell-active");
                cell.classList.add("cell-hover");
            }

            onClickCell(cell, index, checked);
        });
    };

    shuffleArray(device_unique_seed);
    updateSquares();

    shuffleButton.onclick = () => {
        shuffleArray(device_unique_seed);
        checked.fill(false); // Resetování stavu aktivních buněk
        localStorage.setItem("checked", JSON.stringify(checked));
        updateSquares(); 
    };
};