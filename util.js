const doc = require("docx");

const FONT = "Calibri";
exports.HEADING_SIZE = TextSize().heading();
exports.CONTENT_SIZE = TextSize().content();

function TextSize(wordSize) {

    function get() {
        return wordSize * 2;
    }

    function content() {
        return TextSize(11);
    }

    function heading() {
        return TextSize(12);
    }

    return Object.freeze({
        get,
        content,
        heading
    })
}

exports.getTextRun = function (text, textSize, isBold) {
    let boldIt = isBold == null ? false : isBold;
    let textRun = new doc.TextRun(text).font(FONT);
    if (textSize != null) {
        textRun.size(textSize.get());
    }
    if (boldIt) {
        textRun.bold();
    }
    return textRun;
};