const csv = require('csv-parser');
const fs = require('fs');
const doc = require('docx');
const util = require("./util.js");

//set variables passed in as arguments
const csvSubmittedMotions = process.argv.slice(2)[0];
const isCongress = strToBool(process.argv.slice(2)[1]);

let agendaDoc = new doc.Document();
const congressNumber = new Date().getFullYear() - 1967;

const motionGenerator = require("./createMotion.js").MotionGenerator(agendaDoc, isCongress, congressNumber);
generateAgenda();

function generateAgenda() {
    generateTitlePage();
    generateCallToOrder();
    generateAdoptionOfAgenda();
    generateApprovalOfMinutes();
    generateChairRemarks();
    generateBusinessArisingFromMinutes();
    generateNewBusiness().then(function () {
        generateNotice();
        generateAdjournment();
        generateNextMeeting();
        outputWordFile();
    }).catch(function (err) {
        console.error(err);
    });
}

function generateTitlePage() {
    let text = "";
    if (isCongress) {
        text = getNumberAndPronunciation(congressNumber) + " General Assembly at the Annual General Meeting of the " +
            "Canadian Federation of Engineering Students";
    } else {
        text = "President's Meeting " + date.getFullYear() + " General Assembly";
    }
    let titleRun = util.getTextRun(text);
    agendaDoc.addParagraph(new doc.Paragraph().title().addRun(titleRun).spacing({after: 400}));
}

function generateCallToOrder() {
    addHeading("1. Call to Order");
}

function generateAdoptionOfAgenda() {
    addHeading("2. Adoption of the Agenda");
    motionGenerator.proceduralMotion("Adoption of the Agenda", "The agenda be adopted.");
}

function generateApprovalOfMinutes() {
    addHeading("3. Approval of Minutes");
    let year = isCongress ? new Date().getFullYear() - 1 : new Date().getFullYear();
    let birt = isCongress ? "The President's Meeting " : "The Congress ";
    birt += year + " General Assembly minutes ";
    if (isCongress) {
        birt += "(Session 1 and Session 2) ";
    }
    birt += "be received for information";
    motionGenerator.proceduralMotion("Approval of the Minutes", birt);
}

function generateChairRemarks() {
    addHeading("4. Chair's Remarks");
}

function generateBusinessArisingFromMinutes() {
    addHeading("5. Business Arising from the Minutes");
}

function generateNewBusiness() {
    return new Promise(function (res) {
        let bodMotions = [];
        let execMotions = [];
        let memberMotions = [];
        fs.createReadStream(csvSubmittedMotions)
            .pipe(csv())
            .on('data', (row) => {
                categorizeMotion(row, bodMotions, execMotions, memberMotions);
            })
            .on('end', () => {
                generateBodMotions(bodMotions);
                generateExecMotions(execMotions);
                generateMemberMotions(memberMotions);
                res();
            });
    });
}

function categorizeMotion(data, bodMotions, execMotions, memberMotions) {
    let movingBody = data["Moving Body"].toLowerCase();
    if (movingBody.includes("board")) {
        data["Moving School"] = "N/A";
        bodMotions.push(data);
    } else if (movingBody.includes("exec")) {
        data["Moving School"] = "N/A";
        execMotions.push(data);
    } else {
        memberMotions.push(data);
    }
}

function generateBodMotions(motions) {
    addHeading("6. Business from the Board of Directors");
    motionGenerator.newBusinessMotions(motions);
}

function generateExecMotions(motions) {
    addHeading("7. Business from the National Executive");
    motionGenerator.newBusinessMotions(motions);
}

function generateMemberMotions(motions) {
    addHeading("8. Business from the Membership");
    motionGenerator.newBusinessMotions(motions);
}

function generateNotice() {
    addHeading("9. Other Business");
}

function generateAdjournment() {
    addHeading("10. Adjournment");
}

function generateNextMeeting() {
    addHeading("11. Next Meeting");
}

function outputWordFile() {
    let packer = new doc.Packer();
    packer.toBuffer(agendaDoc).then((buffer) => {
        fs.writeFileSync("GA Agenda.docx", buffer);
    });
}

function addHeading(text) {
    let textRun = util.getTextRun(text);
    agendaDoc.addParagraph(new doc.Paragraph().addRun(textRun).heading1().spacing({after: 200}));
}

function strToBool(str) {
    str = str.toLowerCase();
    return str.includes("t");
}

function getNumberAndPronunciation(num) {
    let ones = num % 10;
    if (ones >= 4 || ones === 0) {
        return num + "th";
    } else if (ones === 1) {
        return num + "st";
    } else if (ones === 2) {
        return num + "nd";
    } else if (ones === 3) {
        return num + "rd";
    }
    return num;
}