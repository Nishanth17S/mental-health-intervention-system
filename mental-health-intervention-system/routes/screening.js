const express = require('express');
const { ScreeningResult, PHQ9Question, GAD7Question, GHQ12Question } = require('../models/Screening');
const router = express.Router();

// PHQ-9 Questions
const phq9Questions = [
  {
    question: "Little interest or pleasure in doing things",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Feeling down, depressed, or hopeless",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Trouble falling or staying asleep, or sleeping too much",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Feeling tired or having little energy",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Poor appetite or overeating",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Trouble concentrating on things, such as reading the newspaper or watching television",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Moving or speaking so slowly that other people could have noticed, or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Thoughts that you would be better off dead, or of hurting yourself",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  }
];

// GAD-7 Questions
const gad7Questions = [
  {
    question: "Feeling nervous, anxious, or on edge",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Not being able to stop or control worrying",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Worrying too much about different things",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Trouble relaxing",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Being so restless that it's hard to sit still",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Becoming easily annoyed or irritable",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  },
  {
    question: "Feeling afraid as if something awful might happen",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ]
  }
];

// Get screening questions
router.get('/questions/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    let questions = [];
    
    switch (type.toLowerCase()) {
      case 'phq-9':
        questions = phq9Questions;
        break;
      case 'gad-7':
        questions = gad7Questions;
        break;
      default:
        return res.status(400).json({ message: 'Invalid screening type' });
    }
    
    res.json({
      type: type.toUpperCase(),
      questions: questions.map((q, index) => ({
        questionId: `${type.toLowerCase()}_${index + 1}`,
        question: q.question,
        options: q.options
      }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch questions', error: error.message });
  }
});

// Submit screening results
router.post('/submit', async (req, res) => {
  try {
    const { userId, screeningType, responses } = req.body;
    
    // Calculate total score
    const totalScore = responses.reduce((sum, response) => sum + response.response, 0);
    
    // Determine severity based on screening type and score
    let severity, interpretation, recommendations;
    
    if (screeningType === 'PHQ-9') {
      if (totalScore <= 4) {
        severity = 'minimal';
        interpretation = 'Minimal depression symptoms';
        recommendations = ['Continue self-care practices', 'Monitor mood regularly'];
      } else if (totalScore <= 9) {
        severity = 'mild';
        interpretation = 'Mild depression symptoms';
        recommendations = ['Practice stress management techniques', 'Consider lifestyle changes', 'Monitor symptoms'];
      } else if (totalScore <= 14) {
        severity = 'moderate';
        interpretation = 'Moderate depression symptoms';
        recommendations = ['Consider counseling or therapy', 'Practice self-care', 'Seek support from friends/family'];
      } else if (totalScore <= 19) {
        severity = 'moderately-severe';
        interpretation = 'Moderately severe depression symptoms';
        recommendations = ['Strongly recommend professional help', 'Consider medication evaluation', 'Increase support network'];
      } else {
        severity = 'severe';
        interpretation = 'Severe depression symptoms';
        recommendations = ['Immediate professional intervention recommended', 'Consider crisis support', 'Safety planning'];
      }
    } else if (screeningType === 'GAD-7') {
      if (totalScore <= 4) {
        severity = 'minimal';
        interpretation = 'Minimal anxiety symptoms';
        recommendations = ['Continue current coping strategies', 'Practice relaxation techniques'];
      } else if (totalScore <= 9) {
        severity = 'mild';
        interpretation = 'Mild anxiety symptoms';
        recommendations = ['Practice mindfulness and relaxation', 'Consider stress management techniques'];
      } else if (totalScore <= 14) {
        severity = 'moderate';
        interpretation = 'Moderate anxiety symptoms';
        recommendations = ['Consider counseling or therapy', 'Practice anxiety management techniques'];
      } else {
        severity = 'severe';
        interpretation = 'Severe anxiety symptoms';
        recommendations = ['Strongly recommend professional help', 'Consider medication evaluation', 'Practice immediate coping strategies'];
      }
    }
    
    // Check if follow-up is required
    const followUpRequired = ['moderate', 'moderately-severe', 'severe'].includes(severity);
    
    // Create screening result
    const screeningResult = new ScreeningResult({
      userId,
      screeningType,
      responses,
      totalScore,
      severity,
      interpretation,
      recommendations,
      followUpRequired,
      followUpDate: followUpRequired ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null
    });
    
    await screeningResult.save();
    
    res.json({
      message: 'Screening completed successfully',
      result: {
        totalScore,
        severity,
        interpretation,
        recommendations,
        followUpRequired,
        followUpDate: screeningResult.followUpDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit screening', error: error.message });
  }
});

// Get user's screening history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const results = await ScreeningResult.find({ userId })
      .sort({ completedAt: -1 })
      .select('screeningType totalScore severity interpretation followUpRequired completedAt');
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch screening history', error: error.message });
  }
});

// Get screening statistics for admin
router.get('/stats', async (req, res) => {
  try {
    const stats = await ScreeningResult.aggregate([
      {
        $group: {
          _id: {
            screeningType: '$screeningType',
            severity: '$severity'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.screeningType',
          severityBreakdown: {
            $push: {
              severity: '$_id.severity',
              count: '$count'
            }
          },
          totalCount: { $sum: '$count' }
        }
      }
    ]);
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch screening statistics', error: error.message });
  }
});

module.exports = router;



