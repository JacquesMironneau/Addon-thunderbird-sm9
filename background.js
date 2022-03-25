const transformData = (document,password = "saluti") => {
    // const data = document.querySelectorAll('p');
    // console.log("test", data)
    // data.forEach(x => x.innerHTML = "BING CHILLING")
    // return data;

    console.log(document.replace(/[<>]/g, ''))

    return document.replace(/<\/?[^>]+(>|$)/g, '')
                    .split("")
                    .reverse()
                    .join("")
}

const parseData = (document, password = "saluti") => {

    return transformData(document);
}


browser.composeAction.onClicked.addListener(async (tab) => {
    // Get the existing message.
    let details = await browser.compose.getComposeDetails(tab.id);
    console.log(details);

    if (details.isPlainText) {
        // The message is being composed in plain text mode.
        let body = details.plainTextBody;
        console.log(body);

        // Make direct modifications to the message text, and send it back to the editor.
        //   body += "\n\nSent from my Thunderbird";

        body = "BING CHILLING"
        console.log(body);
        browser.compose.setComposeDetails(tab.id, { plainTextBody: body });
    } else {
        // The message is being composed in HTML mode. Parse the message into an HTML document.
        let document = new DOMParser().parseFromString(details.body, "text/html");
        console.log(document);

        document = transformData(document)

        // Use normal DOM manipulation to modify the message.
        //   let para = document.createElement("p");
        //   para.textContent = "Sent from my Thunderbird";
        //   document.body.appendChild(para);

        // Serialize the document back to HTML, and send it back to the editor.
        let html = new XMLSerializer().serializeToString(document);
        console.log(html);
        browser.compose.setComposeDetails(tab.id, { body: html });
    }
});

browser.compose.onBeforeSend.addListener(async (tab) => {
    let details = await browser.compose.getComposeDetails(tab.id);
    console.log("before sending yay", details);
    // details.body = "BING CHILL";
    let document = new DOMParser().parseFromString(details.body, "text/html");

    const data = document.querySelectorAll('p');

    data.forEach(x => x.innerHTML = transformData(x.innerHTML))
    // document = transformData(document)
    console.log("data transformed", document)

    let html = new XMLSerializer().serializeToString(document);

    console.log(data, html)
    details.plainTextBody = "BING CHILL TEXT"
    browser.compose.setComposeDetails(tab.id, { body: html })
})


// read the text
browser.messageDisplay.onMessageDisplayed.addListener(async (tab, message) => {
    console.log(message)
    console.log(`Message displayed in tab ${tab.id}: ${JSON.stringify(message)}`);
    const msg = await browser.messages.getFull(message.id)

    // TODO: decode data
    const dataToDecode =  msg.parts[0].body

    console.log("Message content", parseData(dataToDecode))
});