
let dict = [
    "člověčee!",
    "vypněte ty plácačky",
    "nohejbal",
    "Vy mladí",
    "maturita",
    "Coca-Cola",
    "pivní kvíz",
    "přestávku?",
    "podtácek",
    "přezůvky",
    "technický dotaz",
    "mládeži",
    "máte to v edookitu",
    "dáme si bingo",
    "zavři ty dveře",
    "paní ředitelka",
    "stránky školy",
    "Vy nic nevíte!",
    "Your sincerely",
    "ženský mozek",
    "děláte si kozy?",
    "chewing gum into the basket",
];
const setToday = (today) => {
    let date_text =
                    String(today.getDate()) +
                    ". " +
                    String(today.getMonth() + 1) +
                    ". " +
                    String(today.getFullYear());

    // document.getElementById("header_date").innerText = date_text;
};

const setLocalStorage = () => {
    const checked = Array(16).fill(false);
    localStorage.setItem("checked", JSON.stringify(checked));
    localStorage.setItem("win", JSON.stringify(false));
};

const setCookie = (today, shuffledOrder) => {
    let device_unique_seed = "";
    const parts = document.cookie.split("; ");
    device_unique_seed = parts.find((row) => row.startsWith("obchodka_bingo_device_unique_seed="))?.split("=")[1];

    if (!device_unique_seed) {
        setLocalStorage();
        device_unique_seed = crypto.randomUUID();

        let midnight = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 0, 0, 0);
        let expires = "; expires=" + midnight.toGMTString();
        document.cookie = "obchodka_bingo_device_unique_seed=" + device_unique_seed + expires + "; path=/";
    }

    if (shuffledOrder) {
        document.cookie = "shuffledOrder=" + shuffledOrder + "; path=/";
    }

    const checked = JSON.parse(localStorage.getItem("checked"));
    return [device_unique_seed, checked];
};

const shuffleArray = (device_unique_seed) => {
    let random_gen = new Math.seedrandom(device_unique_seed);
    for (let i = 0; i < dict.length; ++i) {
        let swap_index = Math.floor(random_gen.quick() * dict.length);
        [dict[i], dict[swap_index]] = [dict[swap_index], dict[i]];
    }
};

const win = () => {
    localStorage.setItem("win", JSON.stringify(true));
    document.getElementById("win_pico").innerText = "Bingo!";
    document.getElementById("pepe_gif").src = "pepe.gif";
    document.getElementById("pepe_gif").classList.replace("d-none", "d-block");

    localStorage.setItem("win", JSON.stringify(false));
};

const check_win = (checked) => {
    let won = JSON.parse(localStorage.getItem("win"));
    if (won) return;

    for (let x = 0; x < 4; ++x) {
        if (checked[x] && checked[x + 4] && checked[x + 8] && checked[x + 12]) {
            win();
            return;
        }
    }

    for (let y = 0; y < 4; ++y) {
        if (checked[y * 4] && checked[y * 4 + 1] && checked[y * 4 + 2] && checked[y * 4 + 3]) {
            win();
            return;
        }
    }

    if (checked[0] && checked[5] && checked[10] && checked[15]) {
        win();
        return;
    }
    if (checked[3] && checked[6] && checked[9] && checked[12]) {
        win();
        return true;
    }
};

const onClickCell = (cell, index, checked) => {
    cell.onclick = function () {
        checked[index] = !checked[index];
        if (checked[index]) {
            this.classList.add("cell-active");
            this.classList.add("text-white");
            this.classList.remove("cell-hover");
        } else {
            document.getElementById("win_pico").innerText = "";
            document.getElementById("pepe_gif").classList.replace("d-block", "d-none");
            this.classList.remove("cell-active");
            this.classList.add("cell-hover");
            this.classList.remove("text-white");
        }
        localStorage.setItem("checked", JSON.stringify(checked));
        check_win(checked);
    };
};

const updateSquares = (squares, checked) => {
    squares.forEach((cell, index) => {
        document.getElementById("win_pico").innerText = "";
        document.getElementById("pepe_gif").classList.add("d-none");
        cell.children[0].innerText = dict[index];
        if (checked[index]) {
            cell.classList.add("cell-active");
            cell.classList.add("text-white");
            cell.classList.remove("cell-hover");
        }else{
            cell.classList.replace("cell-active", "cell-hover");
            cell.classList.remove("text-white");
        }
        onClickCell(cell, index, checked);
    });
};

const mainLoop = () => {
    let today = new Date();
    let shuffleButton = document.getElementById("shuffle");

    setToday(today);

    let [device_unique_seed, checked] = setCookie(today);
    let shuffledOrder = getCookie("shuffledOrder");
    
    if (shuffledOrder) {
        dict = JSON.parse(shuffledOrder);
    } else {
        shuffleArray(device_unique_seed);
    }

    let squares = document.getElementsByClassName("square");
    squares = [...squares];
    updateSquares(squares, checked);

    shuffleButton.onclick = () => {
        shuffleArray(device_unique_seed);
        checked.fill(false);
        localStorage.setItem("checked", JSON.stringify(checked));
        setCookie(today, JSON.stringify(dict));
        updateSquares(squares, checked);
    };
};

const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

document.addEventListener("DOMContentLoaded", () => {
    mainLoop();
});