
  document.addEventListener("DOMContentLoaded", function() {
    // Your code here

    function loadCallToAction() {
        fetch('call-to-action.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('call-to-action-container').innerHTML = data;
            })
            .catch(error => console.error('Error loading the call to action:', error));
    }

    // Call the function to load the HTML
    loadCallToAction();
});  // Function to load the call-to-action HTML
