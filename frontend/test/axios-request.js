import axios from "axios";
axios({
  method: "post",
  url: "https://7jtrlo7xv8.execute-api.ap-southeast-1.amazonaws.com/dev/api",
  data: {
    question: "my new question",
    email: "lehai2909@gmail.com",
  },
});
