const Test = require('../models/Test');

exports.createTest = async (req, res) => {
  const { title, description, questions } = req.body;

  try {
    if (!title || !description || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Title, description, and questions are required' });
    }

    questions.forEach((q, index) => {
      if (!q.questionText || !Array.isArray(q.options) || q.correctOption === undefined) {
        throw new Error(`Question ${index + 1} is missing required fields`);
      }
    });

    const newTest = new Test({ title, description, questions });
    await newTest.save();
    res.status(201).json(newTest);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




exports.submitTest = async (req, res) => {
  const { testId, answers } = req.body;
  try {
    if (!testId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    res.json({ message: 'Test submitted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getTestById = async (req, res) => {
  const { id } = req.params;
  try {
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    res.json(test);
  } catch (err) {
    console.error('Error fetching test:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getTests = async (req, res) => {
  try {
    const tests = await Test.find();
    res.json(tests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
