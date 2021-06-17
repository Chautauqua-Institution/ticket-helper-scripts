let PageName = window.location.pathname.replace('/Online/', '');

switch (PageName) {
    case "bundleSelect.asp":
        BundleSelectEntryPoint();
        break;
}

function convWordToNum(word) {
    // Yeah this is dumb but it's late
    switch (word.toLowerCase()) {
        case "one":
            return 1;
        case "two":
            return 2;
        case "three":
            return 3;
        case "four":
            return 4;
        case "five":
            return 5;
        case "six":
            return 6;
        case "seven":
            return 7;
        case "eight":
            return 8;
        case "nine":
            return 9;

        default:
            break;
    }
}


function findWeek(date) {
    const WEEKS = {
        1: { start: new Date(2021, 5, 26), end: new Date(2021, 6, 3) },
        2: { start: new Date(2021, 6, 3), end: new Date(2021, 6, 10) },
        3: { start: new Date(2021, 6, 10), end: new Date(2021, 6, 17) },
        4: { start: new Date(2021, 6, 17), end: new Date(2021, 6, 24) },
        5: { start: new Date(2021, 6, 24), end: new Date(2021, 6, 31) },
        6: { start: new Date(2021, 6, 31), end: new Date(2021, 7, 7) },
        7: { start: new Date(2021, 7, 7), end: new Date(2021, 7, 14) },
        8: { start: new Date(2021, 7, 14), end: new Date(2021, 7, 21) },
        9: { start: new Date(2021, 7, 21), end: new Date(2021, 7, 29) },
    };
    for (let weekNum = 1; weekNum < 10; weekNum++) {
        const range = WEEKS[weekNum];
        if (date >= range.start && date < range.end) {
            return weekNum;
        }
    }
    throw new Error("Date not found in week dataset");
}


function GroupDaysByWeeks() {
    let elmCont = document.querySelectorAll(".bundle-element-container")[1];
    // Inject Week Containers
    for (let i = 9; i > 0; i--) {
        elmCont.querySelector('.bundle-element-title').insertAdjacentHTML(
            'afterend',
            `<div class="mt-3 border-bottom">
                <a class="text-reset text-decoration-none" data-toggle="collapse" href="#collapse-week-${i}" role="button" aria-expanded="false" aria-controls="collapse-week-${i}">
                    <h5>Week ${i}</h5>
                </a>
            </div>
            <div id="collapse-week-${i}" class="collapse"></div>`
        );
    }

    let BundleElms = elmCont
        .querySelectorAll('.bundle-elements');
    BundleElms.forEach(elm => {
        let dateMatch = elm.querySelector("span.bundle-performance-date")
            .innerText.match(/(\d{4})-(\d{2})-(\d{2})/);
        let date = new Date(
            dateMatch[1],
            dateMatch[2] - 1,
            dateMatch[3]
        );
        elmCont.querySelector(`#collapse-week-${findWeek(date)}`).appendChild(elm);
    });

}

function BundleSelectEntryPoint() {
    // Check DOM if valid bundle for code injection
    let BundleTitle = document.querySelector('#bundle-item-title').innerText;
    if (!(BundleTitle.includes("Grounds Access Pass") || BundleTitle.includes("Traditional Gate Pass") || (BundleTitle.includes("Weekend") && BundleTitle.includes("Grounds Pass")))) {
        return;
    }

    // Code injection starts here
    if (BundleTitle.includes("Grounds Access Pass") && BundleTitle.includes("Days")) {
        GroupDaysByWeeks();
    }
}
