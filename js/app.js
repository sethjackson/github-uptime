document.addEventListener('DOMContentLoaded', async () => {
  const uptimeElement = document.getElementById('uptime');

  try {
    const response = await fetch('https://ghu-function.azurewebsites.net/api/uptime');

    if (!response.ok) {
      throw new Error('Unable to retrieve GitHub status: ${response.status}');
    }

    const result = await response.json();

    const days = result['days'];

    if (days > 0) {
      uptimeElement.className = 'up';
    } else {
      uptimeElement.className = 'down';
    }

    uptimeElement.textContent = days;
  } catch (error) {
    uptimeElement.textContent = 'Unable to retrieve GitHub status';
  }
});
