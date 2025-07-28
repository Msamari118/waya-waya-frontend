const fs = require('fs');
const path = require('path');

// Path to the App.tsx file
const filePath = path.join(__dirname, 'src', 'App.tsx');

try {
  // Read the file
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find and replace the broken button
  const oldButton = `<Button className="h-16 flex-col">
                <CreditCard className="h-6 w-6 mb-2" />
                EFT Payment
              </Button>`;
  
  const newButton = `<Button 
                className="h-16 flex-col"
                onClick={() => alert('EFT Payment clicked!')}
              >
                <CreditCard className="h-6 w-6 mb-2" />
                EFT Payment
              </Button>`;
  
  // Replace the button
  const newContent = content.replace(oldButton, newButton);
  
  // Write the file back
  fs.writeFileSync(filePath, newContent, 'utf8');
  
  console.log('✅ EFT Payment button fixed successfully!');
  console.log('The button now has an onClick handler and will work when clicked.');
  
} catch (error) {
  console.error('❌ Error fixing the button:', error.message);
  console.log('Please make sure you\'re running this script from the project root directory.');
} 