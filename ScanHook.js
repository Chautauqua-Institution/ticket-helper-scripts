const EVENT_SELECTOR = "#eventList";
const FORM_SELECTOR = "#scanForm";
const INPUT_SELECTOR = "#ticketInput";

let PageName = window.location.pathname;
switch (PageName) {
    case "/GateManagement/scan.asp":
        ScannerEntryPoint();
        break;
}

function ScannerEntryPoint() {
    const scanMode = document.querySelector("#eventList").previousElementSibling.innerText.split("\n")[1];
    if(scanMode == "OUT"){
        return;
    }
    if (sessionStorage.getItem("pendingUnscan")) {
        const scanStatus = document.querySelector("#eventList").previousElementSibling.innerText.split("\n")[0];
        if(scanStatus == "PASS"){
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
        }
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
                "events": events,
                "production": window.location.port == "8070" ? false : true
            })
        );
        e.target.submit();
    });
}