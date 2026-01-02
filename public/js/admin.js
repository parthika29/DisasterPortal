// // admin.js

// document.addEventListener("DOMContentLoaded", () => {
//   // Approve/Deny Volunteer
//   document.querySelectorAll(".approve-btn, .deny-btn").forEach((btn) => {
//     btn.addEventListener("click", async () => {
//       const volunteerId = btn.dataset.id;
//       const action = btn.classList.contains("approve-btn") ? "approve" : "deny";

//       try {
//         const res = await fetch(`/admin/volunteer/${action}/${volunteerId}`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" }
//         });

//         const data = await res.json();
//         if (data.success) {
//           alert(`Volunteer ${action}d successfully`);
//           location.reload(); // Refresh to reflect change
//         } else {
//           alert("Action failed. Please try again.");
//         }
//       } catch (err) {
//         console.error(err);
//         alert("Server error");
//       }
//     });
//   });

//   // Assign Volunteer
//   document.querySelectorAll(".assign-form").forEach((form) => {
//     form.addEventListener("submit", async (e) => {
//       e.preventDefault();
//       const requestId = form.dataset.id;
//       const volunteerId = form.querySelector("select").value;

//       try {
//         const res = await fetch("/admin/assign", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ requestId, volunteerId })
//         });

//         const data = await res.json();
//         if (data.success) {
//           alert("Volunteer assigned successfully");
//           location.reload();
//         } else {
//           alert("Assignment failed");
//         }
//       } catch (err) {
//         console.error(err);
//         alert("Server error");
//       }
//     });
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  // ✅ Approve/Reject Volunteer
  document.querySelectorAll(".approve-btn, .reject-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      const volunteerId = btn.dataset.id;
      const action = btn.classList.contains("approve-btn") ? "approve-volunteer" : "reject-volunteer";
      const method = action === "reject-volunteer" ? "DELETE" : "POST";

      try {
        const res = await fetch(`/admin/${action}/${volunteerId}`, { method });
        const data = await res.json();

        if (data.success) {
          alert(data.message);
          location.reload();
        } else {
          alert(data.message || "Action failed");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    });
  });

  // 👨‍💼 Assign Volunteer
  document.querySelectorAll(".assign-form").forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const requestId = form.dataset.id;
      const volunteerId = form.querySelector("select").value;

      try {
        const res = await fetch(`/admin/assign/${requestId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ volunteerId })
        });

        const data = await res.json();
        if (data.success) {
          alert("Volunteer assigned successfully");
          location.reload();
        } else {
          alert(data.message || "Assignment failed");
        }
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    });
  });
});
