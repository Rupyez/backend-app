// const port = require("../config/config.js");

const { port, baseUrl } = require("../config/config.js");

const createFile = (req, res) => {
  if (req.file) {
    let fileName = req.file.filename;
    let path = { path: `${baseUrl}/${fileName}` };
    console.log(port);
    // let path = {
    //  path: `https://learning-management-system-kx6y.onrender.com/${fileName}`,
    // };

    let successJson = {
      status: "success",
      message: "File uploaded successfully.",
      path: path,
    };
    res.json(successJson);
  } else {
    let paths = req.files.map((file) => {
      let fileName = file.filename;
      let path = `http://localhost:${port}/${fileName}`;
      return { path: path };
    });
    let successJson = {
      status: "success",
      message: "Files uploaded successfully.",
      paths: paths,
    };
    res.json(successJson);
  }
};

module.exports = createFile;
