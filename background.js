chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "buttonClicked") {
    console.log("Button clicked in content script");
    // Perform any background tasks here
    sendResponse({status: "Button click received"});
  }
  return true;  // Indicates that the response will be sent asynchronously
});
