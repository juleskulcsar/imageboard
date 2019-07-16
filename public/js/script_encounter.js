(function() {
    new Vue({
        el: ".main",
        data: {
            name: "Jules",
            userInfo: {
                favoritefood: "pizza",
                nationality: "none",
                color: "green"
            },
            cities: [] //closes cities
        }, //closes data
        mounted: function() {
            //we're gonna make the 1st ajax request to the server using axios library
            //this makes a GET /cities request
            //axios is our client noq. it makes requests to our server, which means it receives the response
            // console.log("this: ", this);
            // this.name = "angelica dakic";
            //this represents the object in which we curently are. here this will refer to Vue
            //"this" gives us access to data object, outside of data
            var self = this;
            axios
                .get("/cities")
                .then(function(resp) {
                    //this loses its meaning in nested scopes
                    //we need to tell "this" to always refer to Vue$3
                    // NOT Window
                    //we do this by storing the value of this in a variable
                    // console.log("this: ", self);
                    //this function will run when we get a response from the server
                    // console.log("response: ", resp.data);

                    //self.cities = cities array in FormData//resp.data = cities array we got from server
                    self.cities = resp.data;
                    console.log("self: ", self);
                })
                .catch(function(err) {
                    console.log("error in GET /cities: ", err);
                });
        } //close mounted
    }); //closes Vue

    //mounted --- runs after HTML is loaded. It is a lifecycle method
    //in mounted we make ajax requests to get data the user wants to see the initial moment the page is loaded
    //if you want to render information the moment the page is rendered,
    //you need to want to fetch that data in the "mounted" function
})();
