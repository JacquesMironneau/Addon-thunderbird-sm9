console.log('Hello, World! - from popup.js');
const transformData = (document,password = "saluti") => {
    // const data = document.querySelectorAll('p');
    // console.log("test", data)
    // data.forEach(x => x.innerHTML = "BING CHILLING")
    // return data;

    return document.split("").reverse().join("")
}

browser.tabs.query({
    active: true,
    currentWindow: true,
  }).then(async(tabs) => {
    let tabId = tabs[0].id;
    browser.messageDisplay.getDisplayedMessage(tabId).then(async(message) => {
      const msg = await browser.messages.getFull(message.id)

      // TODO: decode data
      const dataToDecode =  msg.parts[0].body
      
      console.log(dataToDecode)
      document.querySelector("#theDiv").innerHTML = transformData(dataToDecode)
    //   document.body.textContent = transformData(dataToDecode);

    });
  });