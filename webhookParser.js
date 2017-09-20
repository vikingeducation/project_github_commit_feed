const wrapper = require('./wrapper.js');


const webhookParser = (req, res) => {
  let payload = "";
  req.on("data", data => {
    payload += data;
  });
  req.on("end", () => {
    payload = payload.slice(8);
    // let pName = payload.webhookData.pusher.name; 
    // let pRep = payload.webhookData.repository.name;
    console.log(payload);
    // console.log(pName);
    // console.log(pRep);
  //  wrapper.getCommits(username, repo); 
  });
}






module.exports = webhookParser
