const API_KEY = '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';
const suggestions = [
    { text: "I need a review of the 'setPermissions' function", code: "function setPermissions(address user, uint256 permissions) public {...}" },
    { text: "Explain what the 'pause' function in my contract does", code: "function pause() public..." },
    { text: "I'm concerned about the 'grantAccess' function", code: "function grantAccess(address user)" },
    { text: "What does the following code line mean: uint256 public totalSupply;", code: "uint256 public totalSupply;" }
];
document.addEventListener('DOMContentLoaded', () => {
    const suggestionsDiv = document.getElementById('suggestions');
    const inputValue = document.getElementById('inputValue');
    const submitButton = document.getElementById('submit');
    const outputDiv = document.getElementById('output');
    const loadingDiv = document.getElementById('loading');

    // Render suggestions
    suggestions.forEach(suggestion => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.classList.add('button'); // Adding class "button" to div

        // Add main suggestion text
        const textParagraph = document.createElement('p');
        textParagraph.textContent = suggestion.text;

        // Add small tag with code
        const codeSmall = document.createElement('small');
        codeSmall.textContent = suggestion.code;

        // Append text and code to the div
        suggestionDiv.appendChild(textParagraph);
        suggestionDiv.appendChild(codeSmall);

        // On click, set input value to the suggestion code
        suggestionDiv.onclick = () => {
            inputValue.value = suggestion.text;
        };

        // Append the div to the suggestions section
        suggestionsDiv.appendChild(suggestionDiv);
    });

    // Function to generate text
    const generateText = async (input) => {
        // Show loading animation
        loadingDiv.style.display = 'block';

        const formattedInput = `Explain this from a Solidity smart contract: ${input}`;

        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: formattedInput }],
            })
        };

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', options);
            if (!response.ok) throw new Error('Failed to fetch response');

            const data = await response.json();
            const messageContent = data.choices[0].message.content;

            // Hide loading animation
            loadingDiv.style.display = 'none';

            // Create a new styled div for the response
            const responseDiv = document.createElement('div');
            responseDiv.textContent = messageContent;
            responseDiv.style.backgroundColor = '#002b45';  // Set background color
            responseDiv.style.padding = '15px';              // Add padding
            responseDiv.style.margin = '10px 0';             // Add margin to separate responses
            responseDiv.style.borderRadius = '10px';         // Rounded corners

            // Append the new response
            outputDiv.appendChild(responseDiv);

            // Remove suggestions after generating response
            suggestionsDiv.innerHTML = '';

        } catch (error) {
            console.error(error);
            loadingDiv.style.display = 'none'; // Hide loading animation
            outputDiv.textContent = 'An error occurred. Please try again.';
        }
    };

    // Handle submit
    submitButton.onclick = () => {
        const userInput = inputValue.value.trim();
        if (userInput) {
            generateText(userInput); // Generate text based on user input
        }
    };
});
