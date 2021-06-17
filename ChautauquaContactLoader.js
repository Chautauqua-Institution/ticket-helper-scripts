/**
 *  Chautauqua Contact Loader - v1.1
 *
 *  Chautauqua Institution Information Technology
 *
 *  The Chautauqua Contact Loader is designed to allow users of
 *  Chautauqua's ticketing site to select contacts for their bundles.
 *  The script makes a request to the accountInformation page and grabs
 *  the list of contacts and adds a dropdown to the passholder question.
 *
 */


 (function() {

    // Look for these strings to remove rows/entries
    // as we want to hide the question rows from cart/bundleResult etc.
    var QUESTION_NAMES_TO_REMOVE = [
        'Guest Information',
        'Parking Pass'
    ]

    // Look for these strings to remove the details associated with these
    // passes. We don't care abnout location/section/seat for these values
    var PASS_TYPES_TO_REMOVE_DETAILS = [
        'Grounds Access Pass',
        'Traditional Gate Pass',
        'Main Lot Parking'
    ]

    // Look for bundle elements with bundle-element-titles
    // that contain any of these strings and remove them
    var BUNDLE_ELEMENTS_TO_REMOVE = [
        'Question',
        'Weekend Pass'
    ]

    console.log('CHQ Contact Loader v0.2 Loaded');

    if (window.location.pathname == "/Online/shoppingCart.asp") {
        removeQuestionEntryFromCart(QUESTION_NAMES_TO_REMOVE);
        removePassDetailsFromCart(PASS_TYPES_TO_REMOVE_DETAILS);
    }

    if (window.location.pathname == "/Online/bundleResult.asp") {
        removeQuestionEntryFromBundleResult(QUESTION_NAMES_TO_REMOVE);
        removePassDetailsFromBundleResult(PASS_TYPES_TO_REMOVE_DETAILS);
    }

    if (window.location.pathname == "/Online/bundleSelect.asp") {
        console.log('tws')
        hideQuestionElementForBundles(BUNDLE_ELEMENTS_TO_REMOVE);
    }

    if(window.location.pathname == "/Online/orderQuestions.asp"){
        cleanPassQuestions();
    }

    if(window.location.pathname == "/Online/viewOrder.asp"){
        removeQuestionEntryFromViewOrder(QUESTION_NAMES_TO_REMOVE);
        removePassDetailsFromViewOrder(PASS_TYPES_TO_REMOVE_DETAILS);
    }

})();


/**
 *  Remove the question entries from a pass
 *  from the cart listing
 */
function removeQuestionEntryFromCart(NAMES) {
    itemsToRemove = document.querySelectorAll(".bundle-item.admission-row");
    for (var x = 0; x < itemsToRemove.length; x++) {
        console.log(itemsToRemove[x])
        bundleAdmissionNameElement = itemsToRemove[x].querySelector(".bundle-event-name");
        if (ifStringIn(bundleAdmissionNameElement.innerHTML, NAMES)) {
            itemsToRemove[x].style.display = "none";
        }
    }
}


/**
 *  Remove the question entries from a pass
 *  from the cart listing
 */
function removeQuestionEntryFromBundleResult(NAMES) {
    itemsToRemove = document.querySelectorAll(".bundle-result-item.section-box-item");
    for (var x = 0; x < itemsToRemove.length; x++) {
        console.log(itemsToRemove[x])
        bundleAdmissionNameElement = itemsToRemove[x].querySelector(".bundle-event-name");
        if (ifStringIn(bundleAdmissionNameElement.innerHTML, NAMES)) {
            itemsToRemove[x].style.display = "none";
        }
    }
}


/**
 *  Removes the details from passes that
 *  dont make sense for parking or gate
 *  passes.
 */
function removePassDetailsFromCart(NAMES) {
    bundleItems = document.querySelectorAll(".bundle-item.admission-row");
    for (var x = 0; x < bundleItems.length; x++){
        var bundleName = bundleItems[x].querySelector(".bundle-event-name");
        var bundleNameText = bundleName.innerHTML;
        if (ifStringIn(bundleNameText, NAMES)){
            bundleItems[x].querySelector('.bundle-event-table').style.display = "none";
        }
    }
}


/**
 *  Removes the details from passes that
 *  dont make sense for parking or gate
 *  passes.
 */
 function removePassDetailsFromBundleResult(NAMES) {
    itemsToRemove = document.querySelectorAll(".bundle-result-item.section-box-item");
    for (var x = 0; x < itemsToRemove.length; x++) {
        console.log(itemsToRemove[x])
        bundleAdmissionNameElement = itemsToRemove[x].querySelector(".bundle-event-name");
        if (ifStringIn(bundleAdmissionNameElement.innerHTML, NAMES)) {
            itemsToRemove[x].querySelector('.seat-location').style.display = "none";
        }
    }
}


/**
 *  A helper function to determine if a given string
 *  is in an array of strings
 * @param {*} value
 * @param {*} valueArray
 * @returns
 */
function ifStringIn(value, valueArray){

    console.log(value)

    if (value === null){
        return false;
    }

    for(var x = 0; x < valueArray.length; x++){
        if(value.includes(valueArray[x])){
            return true;
        }
    }

    return false;
}


/**
 *  Hide the question element for the bundle
 *  select page
 */
function hideQuestionElementForBundles(NAMES){
    elements = document.querySelectorAll('div.bundle-element-container');
    console.log(elements)
    for(var x = 0; x < elements.length; x++){
        if(ifStringIn(elements[x].querySelector('.bundle-element-title').innerHTML, NAMES)){
            elements[x].style.display = "none";
        }
    }
}


/**
 *  Remove the question entries from a pass
 *  from the view order page
 */
 function removeQuestionEntryFromViewOrder(NAMES) {
    itemsToRemove = document.querySelectorAll(".bundle-admission.section-box-item");
    for (var x = 0; x < itemsToRemove.length; x++) {
        console.log(itemsToRemove[x])
        bundleAdmissionNameElement = itemsToRemove[x].querySelector(".section-box-item-details");
        if (ifStringIn(bundleAdmissionNameElement.innerHTML, NAMES)) {
            itemsToRemove[x].style.display = "none";
        }
    }
}


/**
 *  Removes the details from passes that
 *  dont make sense for parking or gate
 *  passes.
 */
function removePassDetailsFromViewOrder(NAMES) {
    bundleItems = document.querySelectorAll(".bundle-admission.section-box-item");
    for (var x = 0; x < bundleItems.length; x++){
        var bundleName = bundleItems[x].querySelector(".section-box-item-details");
        var bundleNameText = bundleName.innerHTML;
        if (ifStringIn(bundleNameText, NAMES)){
            bundleItems[x].querySelector('.section-box-item-details.last-column').style.display = "none";
        }
    }
}


/**
 *  Clean and format the pass questions
 */
function cleanPassQuestions(){

    var passCard = document.querySelectorAll("div.ticket-question");

    for(var i = 0; i < passCard.length; i++){

        // Hide the Guest Information Question Bundle Item
        var guestInfoBundleItems = passCard[i].querySelectorAll("li.question > div");
        for(var gi = 0; gi < guestInfoBundleItems.length; gi++){
            if(guestInfoBundleItems[gi].innerText == 'Guest Information'){
                guestInfoBundleItems[gi].style.display = 'none';
            }

        }

        var button = passCard[i].querySelector('div.btn-group');
        var new_button = button.cloneNode(true);
        button.style.display = 'none';

        var select = passCard[i].querySelector("select[title='Guest First & Last Name']");
        select.parentNode.parentNode.insertBefore(new_button, select.parentNode.nextSibling);

        new_button.style.textAlign = "center";
        new_button.style.marginTop = "10px";
        new_button.style.display = "block";

    }

}
