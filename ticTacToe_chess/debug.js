// Quick test to see what's happening with stalemate detection
const fs = require('fs');

// Read the file and check if there are any console logs we can add for debugging
const content = fs.readFileSync('/home/aal2015/Desktop/react_ticTacToe_chess/ticTacToe_chess/src/components/Chess.jsx', 'utf8');

// Check if stalemateState is being calculated correctly
console.log("Checking Chess.jsx for stalemate detection...");

// Look for the stalemate check section
const stalemateMatch = content.match(/const stalemateState = isStaleMate\([^)]+\);[\s\S]{0,500}/);
if (stalemateMatch) {
    console.log("Found stalemate calculation:");
    console.log(stalemateMatch[0].substring(0, 300));
}

// Check if hasAnyLegalMove is being called correctly in moveValidCheck.js
const moveContent = fs.readFileSync('/home/aal2015/Desktop/react_ticTacToe_chess/ticTacToe_chess/src/components/moveValidCheck.js', 'utf8');
const hasAnyMatch = moveContent.match(/export const hasAnyLegalMove[\s\S]{0,600}/);
if (hasAnyMatch) {
    console.log("\nFound hasAnyLegalMove function:");
    console.log(hasAnyMatch[0].substring(0, 400));
}
