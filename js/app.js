document.addEventListener('DOMContentLoaded', async () => {
  const uptimeElement = document.getElementById('uptime');

  try {
    const unresolvedIncidentsResponse = await fetch('https://www.githubstatus.com/api/v2/incidents/unresolved.json');

    if (!unresolvedIncidentsResponse.ok) {
      throw new Error(`Unable to retrieve unresolved GitHub incidents: ${unresolvedIncidentsResponse.status}`);
    }

    const unresolvedIncidentsResult = await unresolvedIncidentsResponse.json();

    let incident = null;
    if (unresolvedIncidentsResult.incidents.length === 0) {
      const incidentsResponse = await fetch('https://www.githubstatus.com/api/v2/incidents.json');

      if (!incidentsResponse.ok) {
        throw new Error(`Unable to retrieve GitHub incidents: ${incidentsResponse.status}`);
      }

      const incidentsResult = await incidentsResponse.json();

      if (incidentsResult.incidents.length === 0) {
        throw new Error('No incident data in GitHub status API response.');
      }

      incident = incidentsResult.incidents[0];
    } else {
      incident = unresolvedIncidentsResult.incidents[0];
    }

    let outage = null;
    if (incident['resolved_at']) {
      outage = new Date(incident['resolved_at']);
    } else if (incident['started_at']) {
      outage = new Date(incident['started_at']);
    } else {
      outage = new Date(incident['created_at']);
    }

    const days = Math.floor((Date.now() - outage) / (1000 * 60 * 60 * 24));

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
