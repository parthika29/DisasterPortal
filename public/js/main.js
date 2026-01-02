// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const input = toggle.previousElementSibling;
    if (input.type === 'password') {
      input.type = 'text';
      toggle.textContent = '🙈';
    } else {
      input.type = 'password';
      toggle.textContent = '👁️';
    }
  });
});

// Basic form validation
document.querySelectorAll('form.needs-validation').forEach(form => {
  form.addEventListener('submit', (e) => {
    const requiredFields = form.querySelectorAll('[required]');
    let valid = true;

    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        field.classList.add('input-error');
        valid = false;
      } else {
        field.classList.remove('input-error');
      }
    });

    if (!valid) {
      e.preventDefault();
      alert('Please fill out all required fields.');
    }
  });
});
