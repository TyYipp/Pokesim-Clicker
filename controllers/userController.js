exports.homePage = (req, res) => {
    const users = ["Ty", "Ricky"];
    try {
      res.json(users);
    } catch (error) {
      console.log(error);
    }
  };
  