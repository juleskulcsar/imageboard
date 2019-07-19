(function() {
    new Vue({
        el: ".main",
        data: {
            image_id: location.hash.slice(1),
            name: "Latest Images",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
            showModal: false
        }, //closes data
        mounted: function() {
            var self = this;
            axios
                .get("/images")
                .then(function(resp) {
                    self.images = resp.data.rows;
                    // console.log("self:", self);
                })
                .catch(function(err) {
                    console.log("err in GET /images: ", err);
                });
            //encounter with Pete, imageboard part4
            addEventListener("hashchange", function() {
                self.image_id = location.hash.slice(1);
            });
        }, //closes mounted function
        methods: {
            handleClick: function() {
                // e.preventDefault();
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                // console.log("form data: ", formData.entries);
                let that = this;
                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        console.log("resp from POST /upload", resp);
                        that.images.unshift(resp.data);
                    })
                    .catch(function(err) {
                        console.log("error in POST /upload ", err);
                    });
            },
            handleChange: function(e) {
                console.log("handleChange running");
                console.log(
                    "e.target.file[0] in handleChange: ",
                    e.target.files[0]
                );
                this.file = e.target.files[0];
            },
            clicked: function(id) {
                // this.showModal = id;
                this.image_id = id;
            },
            //encounter with pete, modal part4
            closeModal: function() {
                this.image_id = null;
                location.hash = "";
                history.replaceState(null, null, " ");
            }
            // clickedImage: function(e) {
            //     console.log("sclickedImage id: ", this.id);
            //     this.id = e.target.id;
            // }
        } //closes methods
    }); //closes new Vue
})();
