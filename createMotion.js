const doc = require('docx');
const util = require("./util.js");

const pmNumber = new Date().getFullYear() - 1999;

exports.MotionGenerator = function (agendaDoc, isCongress, congressNumber) {
    let motionNum = 1;

    function newBusinessMotions(motions) {
        for (let motion of motions) {
            buildSubstantialMotion(motion);
        }
    }

    function proceduralMotion(title, birt) {
        let motionData = {};
        motionData["Title"] = title;
        motionData["Mover"] = "National Executive";
        motionData["Seconder"] = "N/A";
        motionData["Language"] = "English";
        motionData["BIRT"] = birt;
        buildSubstantialMotion(motionData, title);
    }

    function buildSubstantialMotion(motionData, text) {
        addMotionHeading(text);
        delete motionData.Timestamp;
        let numOfRows = text == null ? 10 : 7; //text is used only for procedural motions, which has different number of rows
        let table = agendaDoc.createTable({rows: numOfRows, columns: 2});
        let rowNum = 0;
        let metaData = new doc.Paragraph();
        for (let heading in motionData) {
            if (motionData.hasOwnProperty(heading)) {
                if (isMetadataHeading(heading)) {
                    let metaDataHeading = util.getTextRun(heading, util.HEADING_SIZE, true);
                    let metaDataContent = util.getTextRun(motionData[heading], util.CONTENT_SIZE);
                    metaData.addRun(metaDataHeading.break()).addRun(metaDataContent.break());
                } else {
                    addData(table, rowNum, heading, motionData);
                    rowNum++;
                }
            }
        }
        let metaDataTableHeading = util.getTextRun("More Information:", util.HEADING_SIZE, true);
        table.getCell(numOfRows - 3, 0).addParagraph(new doc.Paragraph().addRun(metaDataTableHeading)).setMargins({
            top: 100,
            bottom: 100,
            left: 100,
            right: 100,
        });
        table.getCell(numOfRows - 3, 1).addParagraph(metaData).setMargins({
            top: 100,
            bottom: 100,
            left: 100,
            right: 100,
        });
        addData(table, numOfRows - 2, "Result", motionData);
        addData(table, numOfRows - 1, "Discussion", motionData);
        agendaDoc.addParagraph(new doc.Paragraph("")); //for spacing
    }

    function addData(table, rowNum, heading, motion) {
        let left = util.getTextRun(heading + ":", util.HEADING_SIZE, true);
        let right = util.getTextRun(motion[heading], util.CONTENT_SIZE);

        table.getCell(rowNum, 0).addParagraph(new doc.Paragraph().addRun(left)).setMargins({
            top: 100,
            bottom: 100,
            left: 100,
            right: 100,
        });
        table.getCell(rowNum, 1).addParagraph(new doc.Paragraph().addRun(right)).setMargins({
            top: 100,
            bottom: 100,
            left: 100,
            right: 100,
        });
    }

    function addMotionHeading(motion) {
        let textRun = util.getTextRun(buildMotionHeading(motion));
        agendaDoc.addParagraph(new doc.Paragraph().addRun(textRun).heading2());
    }


    function buildMotionHeading(motion) {
        let str = isCongress ? congressNumber.toString() : pmNumber.toString();
        str += "-CFES-";
        str += isCongress ? "CongressAGM" : "PM";
        str += getMotionNumHeading();
        if (motion != null) {
            str += "-" + motion;
        }
        return str;
    }

    function getMotionNumHeading() {
        let str = "-";
        if (motionNum < 10) {
            str += "0";
        }
        str += motionNum.toString();
        motionNum++;
        return str;
    }

    return Object.freeze({
        newBusinessMotions,
        proceduralMotion
    });
};

function isMetadataHeading(heading) {
    return heading === "What Problem Does the Motion Solve?" ||
        heading === "Consultation" ||
        heading === "Alternative Actions Considered" ||
        heading === "Action Item(s)" ||
        heading === "Person(s) Responsible" ||
        heading === "Timeline" ||
        heading === "Time Implication" ||
        heading === "Financial Implication" ||
        heading === "Risks";
}