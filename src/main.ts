const app = document.createElement('div');
app.style.display = 'flex';
app.style.flexDirection = 'column';
app.style.alignItems = 'center';
app.style.justifyContent = 'center';
app.style.height = '100vh';
app.style.fontFamily = 'Segoe UI, sans-serif';
app.style.background = '#f2f2f2';
app.style.color = '#333';
app.style.margin = '0';

const heading = document.createElement('h1');
heading.textContent = '🚧 Waya Waya';
heading.style.fontSize = '3rem';

const paragraph = document.createElement('p');
paragraph.textContent = 'Something amazing is coming soon...';
paragraph.style.fontSize = '1.2rem';
paragraph.style.color = '#777';

app.appendChild(heading);
app.appendChild(paragraph);
document.body.style.margin = '0';
document.body.appendChild(app);

