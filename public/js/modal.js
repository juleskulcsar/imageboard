(function() {
    Vue.component("modal", {
        template: "#modal-template",
        data: function() {
            return {
                imageData: {
                    image_id: location.hash.slice(1),
                    url: "",
                    username: "",
                    title: "",
                    description: "",
                    created_at: ""
                },
                commentSection: {
                    commenter: "",
                    comment: ""
                },
                comments: []
            }; //ends object returned by function
        }, //ends data
        props: ["id"],
        mounted: function() {
            // console.log("mounted!!");
            // console.log("id is: ", this.id);
            const that = this;
            axios
                .get("/singleImage", {
                    params: {
                        id: that.id
                    }
                })
                .then(resp => {
                    that.imageData = resp.data[0];
                    console.log("wtf is this? ", resp.data[0]);
                    that.url = resp.data.rows[0].url;
                    that.username = resp.data.rows[0].username;
                    that.title = resp.data.rows[0].title;
                    that.description = resp.data.rows[0].description;
                    that.created_at = resp.data.rows[0].created_at;
                })
                .catch(err => {
                    console.log("error in component mounted: ", err);
                });
            axios
                .get("/comments", {
                    params: {
                        id: that.id
                    }
                })
                .then(resp => {
                    that.comments = resp.data.comments;
                    // console.log("this is data: ", resp.data);
                })
                .catch(err => {
                    console.log("err in GET /comments mounted: ", err);
                });
        },
        //encounter with Pete modal part4
        watch: {
            id: function() {
                // console.log("mounted!!");
                // console.log("id is: ", this.id);
                const that = this;
                axios
                    .get("/singleImage", {
                        params: {
                            id: that.id
                        }
                    })
                    .then(resp => {
                        // that.id = resp.data.rows[0];
                        that.imageData = resp.data[0];
                        console.log("wtf is this? ", resp.data[0]);
                        that.url = resp.data.rows[0].url;
                        that.username = resp.data.rows[0].username;
                        that.title = resp.data.rows[0].title;
                        that.description = resp.data.rows[0].description;
                        that.created_at = resp.data.rows[0].created_at;
                    })
                    .catch(err => {
                        console.log("error in component mounted: ", err);
                    });
                axios
                    .get("/comments", {
                        params: {
                            id: that.id
                        }
                    })
                    .then(resp => {
                        that.comments = resp.data.comments;
                    })
                    .catch(err => {
                        console.log("err in GET /comments mounted: ", err);
                    });
            }
        },
        methods: {
            addComment: function(e) {
                e.preventDefault();
                const that = this;
                axios
                    .post("/comments", {
                        image_id: that.id,
                        commenter: that.commentSection.commenter,
                        comment: that.commentSection.comment
                    })
                    .then(results => {
                        // console.log(
                        //     "does this even work? ",
                        //     results.data.newComment
                        // );
                        // console.log("comments: ", that.comments);
                        that.comments.unshift(results.data.recentComment);
                        // that.comments.pop();
                        that.recentComment = "";
                        that.commentSection.commenter = "";
                        that.commentSection.comment = "";
                    })
                    .catch(err => {
                        console.log("err in addComment method modal.js: ", err);
                    });
            }, //closes addComment
            removeImage: function(id) {
                axios.post(/deleteImage/ + id).then(resp => {
                    resp.images.splice(id, 1);
                });
            }
        }
    });
})(); //ends iife
