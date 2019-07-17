(function() {
    Vue.component("modal", {
        template: "#modal-template",
        data: function() {
            return {
                image: {
                    url: "",
                    username: "",
                    title: "",
                    description: "",
                    created_at: ""
                }
            }; //ends object returned by function
        }, //ends data
        props: ["id"],
        mounted: function() {
            console.log("mounted!!");
            const that = this;
            axios
                .get("/images", {
                    params: {
                        id: that.id
                    }
                })
                .then(resp => {
                    // that.id = resp.data.rows[0];
                    that.image = resp.data.rows[0];
                    console.log("wtf is this? ", resp.data.rows);
                    that.url = resp.data.rows[0].url;
                    that.username = resp.data.rows[0].username;
                    that.title = resp.data.rows[0].title;
                    that.description = resp.data.rows[0].description;
                    that.created_at = resp.data.rows[0].created_at;
                })
                .catch(err => {
                    console.log("error in component mounted: ", err);
                });
        },
        methods: {
            // clicked: function() {
            //     this.something = this.whatever;
            // }
            // clicked2: function() {
            //     this.$emit("change", "disco duck");
            // }
        }
    });
})(); //ends iife
