<script src="https://cdnjs.cloudflare.com/ajax/libs/annyang/1.1.0/annyang.min.js"></script>

<script>
window.onload = function(){
    if (annyang) {
        var commands = {
            'Hello': function() {
                alert('Hi! I can hear you.');
            }
        };
        annyang.addCommands(commands);
        annyang.start({ autoRestart: false, continuous: true }); 
    }
}
</script>