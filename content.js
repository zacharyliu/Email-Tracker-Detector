/**
 * Map of tracker name to embedded tracker image URL.
 */
var trackingImages = {
    "Streak": "https://mailfoogae.appspot.com/t",
    "MixMax": "https://app.mixmax.com/api/track/"
};

/**
 * Checks if the email has an embedded image from a source containing the specified string.
 * Ensures that the embedded image is not contained within a previously quoted email.
 * @param {Element} elem DOM element of the email message body.
 * @param {String} string Source search substring.
 * @returns {boolean} True if the email contains an image with the given source substring.
 */
function hasImage(elem, string) {
    var images = elem.querySelectorAll(`img[src*='${string}']`);
    for (var i = 0; i < images.length; i++) {
        var current = images[i];
        var isNotWithinQuote = true;
        while (current != null) {
            if (current.classList.contains("gmail_quote")) {
                isNotWithinQuote = false;
                break;
            }
            current = current.parentElement;
        }
        if (isNotWithinQuote) return true;
    }
    return false;
}

InboxSDK.load('1', 'sdk_trackerdetect_1fb8437935').then(function (sdk) {

    /**
     * Add an icon above the message if any read-trackers are detected.
     */
	sdk.Conversations.registerMessageViewHandler(function (messageView) {
        var elem = messageView.getBodyElement();
        var detectedTrackers = [];

        for (var name in trackingImages) {
            if (hasImage(elem, trackingImages[name])) {
                detectedTrackers.push(name);
            }
        }

        var count = detectedTrackers.length;
        if (count > 0) {
            messageView.addAttachmentIcon({
                iconUrl: `chrome-extension://${chrome.runtime.id}/icon.png`,
                iconClass: "background-contain-and-center",
                tooltip: `${count} ${count > 1 ? "trackers" : "tracker"} detected: ${detectedTrackers.join(", ")}`,
                onClick: function () {}
            });
        }
    });

});
