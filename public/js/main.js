document.addEventListener('DOMContentLoaded', function() {
    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
      const alerts = document.querySelectorAll('.alert');
      alerts.forEach(function(alert) {
        const alertInstance = new bootstrap.Alert(alert);
        alertInstance.close();
      });
    }, 5000);
    
    // Form validation for student marks
    const studentMarksInputs = document.querySelectorAll('input[id^="marks_"]');
    studentMarksInputs.forEach(function(input) {
      input.addEventListener('input', function() {
        const maxMarks = parseInt(this.getAttribute('max'));
        if (parseInt(this.value) > maxMarks) {
          this.value = maxMarks;
        }
        if (parseInt(this.value) < 0) {
          this.value = 0;
        }
      });
    });
  });
  