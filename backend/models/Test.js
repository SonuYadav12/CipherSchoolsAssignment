const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required']
  },
  options: {
    type: [String],
    required: [true, 'Options are required'],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one option is required'
    }
  },
  correctOption: {
    type: Number,
    required: [true, 'Correct option index is required'],
    min: [0, 'Correct option index must be greater than or equal to 0'],
    validate: {
      validator: function(v) {
        return v < this.options.length;
      },
      message: 'Correct option index is out of range'
    }
  }
});

const TestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  questions: [QuestionSchema]
});

module.exports = mongoose.model('Test', TestSchema);
