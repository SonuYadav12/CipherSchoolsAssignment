const Test = require('../models/Test');

exports.createTest = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const test = new Test({ title, questions });
    await test.save();
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.submitTest = async (req, res) => {
  const { testId, answers } = req.body;
  try {
    
    res.json({ message: 'Test submitted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTests = async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
