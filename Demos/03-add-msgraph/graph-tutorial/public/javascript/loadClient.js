
$("#files10").click(function(){
    console.log("Sending req to load 10 files");
    $.post("/load10",
        {
            name: "Donald Duck",
            city: "Duckburg"
        },
        function(data, status){
            alert("Data: " + data + "\nStatus: " + status);
        });
});