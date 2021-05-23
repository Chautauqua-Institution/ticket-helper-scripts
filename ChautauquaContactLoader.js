/**
 *  Chautauqua Contact Loader - v0.1
 *
 *  Chautauqua Institution Information Technology
 *
 *  The Chautauqua Contact Loader is designed to allow users of
 *  Chautauqua's ticketing site to select contacts for their bundles.
 *  The script makes a request to the accountInformation page and grabs
 *  the list of contacts and adds a dropdown to the passholder question.
 *
 */


 (function (){

    console.log('CHQ Contact Loader v0.1 Loaded');

    // Check if we are on the right page
    questionHeader = document.querySelector("h1#questions-title");
    if(questionHeader !== undefined){
        executeContactSelectOverride();
    }

})();


/**
 *  Add a contact select for the specified input
 */
function executeContactSelectOverride(){
    getContacts().then( contacts => {
        valid_questions = document.querySelectorAll("input[title='Guest First &amp; Last Name']")

        for(q = 0; q < valid_questions.length; q++){

            var contactSelect = buildContactsDropdown(contacts, q, valid_questions[q].id);

            valid_questions[q].parentNode.insertBefore(contactSelect, valid_questions[q]);
            valid_questions[q].setAttribute('type', 'hidden');

            contactSelect.addEventListener('change', function(){
                var targetInputId = this.id.split('%%%chqcl-')[0];
                var targetInput = document.getElementById(targetInputId);
                targetInput.value = this.value;
                console.log('worked')
            });

        }

    });
}


/**
 *  Get the Contacts of the Customer by making
 *  a request to the account information page
 *  and parsing the data
 *
 * @returns object[] - Array of Contact objects including id, name, email
 */
async function getContacts(){
    contacts = await fetch('/Online/accountInformation.asp')
        .then(response => response.text())
        .then(data => {

            // TODO: Implement check to see if signed in or out

            var parser = new DOMParser();
            var accountDocument = parser.parseFromString(data, "text/html");

            var contacts = [];
            var contact_divs = accountDocument.documentElement.querySelectorAll("div#contacts-box > div.contact");

            for(c = 0; c < contact_divs.length; c++){

                var contact = {
                    "id": contact_divs[c].querySelector("input[name='BOset::WScustomer::Customer::default_contact_id']").value,
                    "name": contact_divs[c].querySelector("span.contact-name > label > span").innerHTML.trim(),
                    "email": contact_divs[c].querySelector("span.contact-email > a.search").innerHTML
                }

                var nameSegments = contact['name'].split(',');
                contact['name_formatted'] = nameSegments[1].trim() + ' ' + nameSegments[0].trim();

                contacts[c] = contact;
            }

            console.log(contacts);
            return contacts
    });
    return contacts
}


/**
 *  Build the Select Element with Contact
 *  options for the user to choose
 *
 * @param {object[]} contacts
 * @param {number} count
 * @param {string} inputId
 * @returns Element
 */
function buildContactsDropdown(contacts, count, inputId){

    // Build the ID of the Select Element to match the original
    // text input ID
    var contactSelectId = inputId + "%%%chqcl-" + count.toString();

    // Create the Select Element
    var contactSelect = document.createElement("select");
    contactSelect.setAttribute('id', contactSelectId);
    contactSelect.setAttribute('class', "chqcl-contact-select form-control");

    // Create the default option
    var option = document.createElement("option");
    option.text = "Select a Contact";
    option.setAttribute('selected', true);
    option.setAttribute('disabled', true);
    option.setAttribute('hidden', true);
    contactSelect.appendChild(option);

    // Create an option for each contact
    for (var i = 0; i < contacts.length; i++) {
        console.log('test2')
        var option = document.createElement("option");
        option.value = contacts[i]['id'] + ' ' + contacts[i]['name_formatted'];
        option.text = contacts[i]['name_formatted'] + ' - ' + contacts[i]['email'];
        contactSelect.appendChild(option);
        console.log('test');
    }

    return contactSelect
}
