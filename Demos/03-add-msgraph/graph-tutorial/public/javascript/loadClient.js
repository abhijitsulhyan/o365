$(document).ready(function() {
    $('#files10').click(function(e) {
        console.log("Sending req to load 10 files");
        $.post("/load/load10",
            {
                name: "Donald Duck",
                city: "Duckburg"
            },
            function(data, status){
                alert("Data: " + data + "\nStatus: " + status);
            });

    });
});