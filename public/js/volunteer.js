function filterRequests() {
  const pincode = document.getElementById('pincodeFilter').value.trim();
  const cards = document.querySelectorAll('#helpRequests .card');
  cards.forEach(card => {
    const cardPin = card.getAttribute('data-pincode');
    card.style.display = (cardPin === pincode || pincode === '') ? 'block' : 'none';
  });
}

async function acceptRequest(requestId) {
  try {
    const res = await fetch(`/volunteer/accept/${requestId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      location.reload();
    } else {
      alert('Failed to accept task: ' + (data.error || 'Unknown error'));
    }
  } catch (err) {
    alert('Failed to accept task: ' + err.message);
  }
}
