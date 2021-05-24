let PageName = window.location.pathname.replace('/Online/', '');

switch (PageName) {
    case "bundleSelect.asp":
        BundleSelectEntryPoint();
        break;
    case "bundleResult.asp":
        BundleResultEntryPoint();
        break;
    case "orderQuestions.asp":
        OrderQuestionsEntryPoint();
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


function SaveBundleInfo() {
    // Grab checkboxes and pull selected
    let ChkBoxes = document.querySelectorAll(".bundle-element-container")[1]
        .querySelectorAll("input[type=checkbox]");

    let weeks = []
    ChkBoxes.forEach((box) => {
        if (box.checked == true) {
            let weekLbl = document.querySelector(`label[for="${box.value}"] > span.bundle-performance-description`)
                .innerText.match(/Week ([A-z]+)/)[1];
            let weekNum = convWordToNum(weekLbl);
            weeks.push(weekNum);
        }
    });
    weeks.sort();

    // Create Bundle Object
    let bundle = {
        'name': document.querySelector("#bundle-item-title").innerText,
        'weeks': weeks
    };
    // Save
    sessionStorage.setItem('unprocessedBundle', JSON.stringify(bundle));
}

function BundleSelectEntryPoint() {
    // Check DOM if valid bundle for code injection
    let BundleTitle = document.querySelector('#bundle-item-title').innerText;
    if (!(BundleTitle.includes("Grounds Access Pass") || BundleTitle.includes("Traditional Gate Pass"))) {
        return;
    }
    // Check if logged in, redirect if not
    if (document.querySelector("#utility-menu-item-logout") === null) {
        window.location = "/Online/login.asp?targetPage=bundleSelect.asp";
        return;
    }

    // Hide Question Div
    document.querySelectorAll(".bundle-element-container")[0].style.display = 'none';

    // Code injection starts here
    document.querySelector("form[name=bundlesForm]")
        .addEventListener("submit", SaveBundleInfo);
    document.querySelectorAll(".bundle-element-container")[1]
        .querySelectorAll("input[type=checkbox]").forEach(box => {
            box.addEventListener("change", SaveBundleInfo);
        });
}

function BundleResultEntryPoint() {
    // Check for an unprocessed bundle. Exit if not found.
    const bundle = JSON.parse(sessionStorage.getItem('unprocessedBundle'));
    if (bundle === null) {
        return;
    }

    // Grab page
    fetch('/Online/orderQuestions.asp')
        .then(response => response.text())
        .then(data => {
            // Scrape orderQuestions ahead of time, and pull a list of bundles
            let parser = new DOMParser();
            const qDoc = parser.parseFromString(data, "text/html");
            const elms = qDoc.documentElement.querySelectorAll('input[type=text][name^="BOset::WSorder::Bundle"]');
            const qBundleIds = Array.from(elms).map(elm => {
                return elm.name.match(/Bundles::([A-z0-9\-]+)/)[1];
            });

            // Compare to bundles in storage
            let processedBundles = JSON.parse(sessionStorage.getItem('processedBundles') || '{}');
            const pBundleIds = Object.keys(processedBundles);
            let difference = qBundleIds.filter(x => !pBundleIds.includes(x));

            difference.forEach(id => {
                processedBundles[id] = bundle;
            });

            // Save back to storage
            sessionStorage.setItem('processedBundles', JSON.stringify(processedBundles));
        });
}

function replaceOrderQuestions() {
    // Check for bundles
    const processedBundles = JSON.parse(sessionStorage.getItem('processedBundles') || '{}');
    for (const [id, bundle] of Object.entries(processedBundles)) {
        let formsetInput = document.querySelector(`input[type=hidden][name^="BOset::WSorder::Bundles::${id}"]`);
        if (formsetInput === null) {
            continue;
        }
        formsetInput.closest(".admission-section").firstElementChild
            .innerHTML = `${bundle.name}<br/><small class="unstyled">Weeks ${bundle.weeks.join(', ')}</small>`;
    }
}

function OrderQuestionsEntryPoint() {
    document.addEventListener('DOMContentLoaded', replaceOrderQuestions);
}