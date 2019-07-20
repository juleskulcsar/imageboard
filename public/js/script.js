(function() {
    new Vue({
        el: ".main",
        data: {
            image_id: location.hash.slice(1),
            hideButton: false,
            name: "Latest Images",
            images: [],
            title: "",
            description: "",
            username: "",
            file: null
        }, //closes data
        mounted: function() {
            var that = this;
            axios
                .get("/images")
                .then(function(resp) {
                    that.images = resp.data.rows;
                })
                .catch(function(err) {
                    console.log("err in GET /images: ", err);
                });
            //encounter with Pete, imageboard part4
            addEventListener("hashchange", function() {
                that.image_id = location.hash.slice(1);
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
                let that = this;
                axios
                    .post("/upload", formData)
                    .then(function(resp) {
                        console.log("resp from POST /upload", resp);
                        that.images.unshift(resp.data);
                        that.title = "";
                        that.username = "";
                        that.description = "";
                    })
                    .catch(function(err) {
                        console.log("error in POST /upload ", err);
                    });
            },
            handleChange: function(e) {
                // console.log("handleChange running");
                // console.log(
                //     "e.target.file[0] in handleChange: ",
                //     e.target.files[0]
                // );
                this.file = e.target.files[0];
            },
            clicked: function(id) {
                this.image_id = id;
            },
            //encounter with pete, modal part4
            closeModal: function() {
                this.image_id = null;
                location.hash = "";
                history.replaceState(null, null, " ");
            },

            moreImages: function() {
                var that = this;
                const lowestIdOnscreen = that.images[that.images.length - 1].id;
                // console.log("this.images: ", that.images.length - 1);
                axios
                    .get("/moreimages/" + lowestIdOnscreen)
                    .then(resp => {
                        // console.log("resp.data: ", resp.data);
                        // console.log("testing testing", resp.data.images.length);
                        if (resp.data.images.length < 12) {
                            //set button to invisible when no more images exist
                            that.hideButton = true;
                        }
                        that.images = [...that.images, ...resp.data.images];
                    })
                    .catch(err => {
                        console.log("Error in GET /moreimages axios: ", err);
                    });
            }

            // clickedImage: function(e) {
            //     console.log("sclickedImage id: ", this.id);
            //     this.id = e.target.id;
            // }
        } //closes methods
    }); //closes new Vue
})();
