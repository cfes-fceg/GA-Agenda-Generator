# GA-Agenda-Generator
This is a tool that will generate a General Assembly agenda. It must be run in a directory containing `util.js` and `createMotion.js`.

This script is run via `node ./assemblyAgendaGenerator.js path_to_csv {T or F}`.

`path_to_csv` is the path on your file system to the CSV file that contains the Google Form submissions for the motions.
The name of the form fields are important, it must follow the field names here: https://drive.google.com/open?id=1GIK7oZqzGGFQ9f4Llf7-5vj-ZfgQ9zno-c5MZWjUFz8.

`{T or F}` means you write `T` if the agenda being generated will be used for Congress, or `F` if used for President's Meeting.

Example command: `node ./assemblyAgendaGenerator.js "../GA Agenda CSV.csv" T`, to create an agenda for a Congress.

You will need `node` and `npm` installed. Run `npm install` in the directory of `assemblyAgendaGenerator.js`.