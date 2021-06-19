const EVENT_SELECTOR = "body > center > form:nth-child(1) > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td.tab";
const FORM_SELECTOR = "body > center > form:nth-child(1)";
const INPUT_SELECTOR = "input[type=text]";

let PageName = window.location.pathname;
switch (PageName) {
    case "/GateManagement/scan.asp":
        ScannerEntryPoint();
        break;
}

function ScannerEntryPoint() {
    if (sessionStorage.getItem("pendingUnscan")) {
        const data = JSON.parse(sessionStorage.getItem("pendingUnscan"));
        fetch(
            "https://tickets-helper.chq.org/scan/out/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }
        );
        sessionStorage.removeItem("pendingUnscan");
    }

    const events = document.querySelector(EVENT_SELECTOR).innerText.split("\n");
    const form = document.querySelector(FORM_SELECTOR);
    let haveSaved = false;
    form.addEventListener("submit", e => {
        if (haveSaved) {
            return
        }
        e.preventDefault();
        sessionStorage.setItem(
            "pendingUnscan",
            JSON.stringify({
                "ticketNumber": document.querySelector(INPUT_SELECTOR).value,
                "events": events
            })
        );
        e.target.submit();
    });
}