const Test = require('../models/Test');

exports.createTest = async (req, res) => {
  const { title, description, questions } = req.body;

  try {
    if (!title || !description || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Title, description, and questions are required' });
    }

    questions.forEach((q, index) => {
      if (
        typeof q.questionText !== 'string' ||
        !Array.isArray(q.options) ||
        typeof q.correctOption !== 'number' ||
        q.correctOption < 0 ||
        q.correctOption >= q.options.length
      ) {
        throw new Error(`Question ${index + 1} is missing required fields or has invalid data`);
      }
    });

    const newTest = new Test({ title, description, questions });
    await newTest.save();
    res.status(201).json(newTest);
  } catch (err) {
    console.error('Error creating test:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.submitTest = async (req, res) => {
  const { testId, answers } = req.body;
  
  try {
    if (!testId || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }

    let score = 0;
    test.questions.forEach((q, index) => {
      if (answers[index] === q.correctOption) {
        score += 10; 
      }
    });

    res.json({ message: 'Test submitted', score });
  } catch (err) {
    console.error('Error submitting test:', err);
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
    console.error('Error fetching tests:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateTest = async (req, res) => {
  const { id } = req.params;
  const { title, description, questions } = req.body;

  try {
    if (!title || !description || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'Title, description, and questions are required' });
    }

    questions.forEach((q, index) => {
      if (
        typeof q.questionText !== 'string' ||
        !Array.isArray(q.options) ||
        typeof q.correctOption !== 'number' ||
        q.correctOption < 0 ||
        q.correctOption >= q.options.length
      ) {
        throw new Error(`Question ${index + 1} is missing required fields or has invalid data`);
      }
    });

    const updatedTest = await Test.findByIdAndUpdate(id, { title, description, questions }, { new: true });
    if (!updatedTest) {
      return res.status(404).json({ error: 'Test not found' });
    }
    res.json(updatedTest);
  } catch (err) {
    console.error('Error updating test:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTest = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTest = await Test.findByIdAndDelete(id);
    if (!deletedTest) {
      return res.status(404).json({ error: 'Test not found' });
    }
    res.json({ message: 'Test deleted successfully' });
  } catch (err) {
    console.error('Error deleting test:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
