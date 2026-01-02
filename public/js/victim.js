// Handle modal open/close
const modal = document.getElementById('requestModal');
const btn = document.getElementById('openModalBtn');
const span = document.getElementsByClassName('close')[0];

btn.onclick = () => modal.style.display = 'block';
span.onclick = () => modal.style.display = 'none';
window.onclick = (event) => {
  if (event.target == modal) modal.style.display = 'none';
};

// Preview uploaded image
function previewImage(event) {
  const reader = new FileReader();
  reader.onload = () => {
    const preview = document.getElementById('preview');
    preview.src = reader.result;
    preview.style.display = 'block';
  };
  reader.readAsDataURL(event.target.files[0]);
}
