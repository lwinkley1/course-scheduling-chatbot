import React, { useState } from 'react';
import './App.css';

const classSections = {
  Math: ['Geometry', 'Algebra II', 'Pre-Calculus', 'Calculus'],
  Science: ['Environmental Science', 'Biology', 'Chemistry', 'Physics'],
  History: ['European History I', 'American History I', 'European History II', 'American History II'],
  English: ['English I', 'English II', 'English Language', 'English Literature'],
  Language: ['Spanish I', 'Spanish II', 'Spanish III', 'Spanish IV'],
  Electives: [
    'Accounting', 'Business Management', 'Marketing Education', 'Child Development',
    'Food Science', 'Interior Design', 'Architecture', 'Graphic Design', 'Electronics',
    'Graphics', 'Applied Art', 'Fine Art', 'Music Theory'
  ]
};

function App() {
  const [messages, setMessages] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [questionType, setQuestionType] = useState('');

  const handleQuestionClick = (question) => {
    const botResponse = question === 'What classes should I take next year?' ?
      'What classes have you taken?' :
      `What ${question.toLowerCase()} classes have you taken?`;
  
    const userMessage = { text: question, type: 'user' };
    setMessages([...messages, userMessage, { text: botResponse, type: 'bot' }]);
    setQuestionType(question === 'What classes should I take next year?' ? botResponse : question);
  };

  const handleUserResponse = (response) => {
    if (questionType === 'What classes have you taken?' || questionType.startsWith('What class')) {
      const userResponse = `I have taken: ${response}`;
      const nextClass = generateClassTypeResponse(questionType);
      const botResponse = `You should take ${nextClass} next year.`;
      setMessages([...messages, { text: userResponse, type: 'user' }, { text: botResponse, type: 'bot' }]);
  
      setQuestionType('');
      setSelectedClasses([]);
    }
  };

  const handleClassSelection = (selectedClass) => {
    setSelectedClasses([...selectedClasses, selectedClass]);
  };

  const handleDoneClick = () => {
    if (questionType && !questionType.startsWith('What classes')) {
      const userResponse = `I have taken: ${selectedClasses.join(', ')}`;
      const nextClass = generateClassTypeResponse(questionType);
      const botResponse = `You should take ${nextClass} next year.`;
      setMessages([...messages, { text: userResponse, type: 'user' }, { text: botResponse, type: 'bot' }]);

      setQuestionType('');
      setSelectedClasses([]);
    } else {
      if (selectedClasses.length % 6 !== 0) {
        setMessages([...messages, { text: 'The amount of classes taken must be a multiple of 6', type: 'bot' }]);
        return;
      }

      if (selectedClasses.length >= 24) {
        setMessages([...messages, { text: 'You have taken 24 classes already, congratulations on graduating!', type: 'bot' }]);
        return;
      }

      const userResponse = `I have taken: ${selectedClasses.join(', ')}`;
      const botResponse = generateBotResponse(selectedClasses);
      setMessages([...messages, { text: userResponse, type: 'user' }, { text: botResponse, type: 'bot' }]);

      setQuestionType('');
      setSelectedClasses([]);
    }
  };

const generateBotResponse = (selectedClasses) => {
  const sequences = {
    Math: ['Geometry', 'Algebra II', 'Pre-Calculus', 'Calculus'],
    Science: ['Environmental Science', 'Biology', 'Chemistry', 'Physics'],
    History: ['European History I', 'American History I', 'European History II', 'American History II'],
    English: ['English I', 'English II', 'English Language', 'English Literature'],
    Language: ['Spanish I', 'Spanish II', 'Spanish III', 'Spanish IV'],
    Electives: [
      'Accounting', 'Business Management', 'Marketing Education', 'Child Development',
      'Food Science', 'Interior Design', 'Architecture', 'Graphic Design', 'Electronics',
      'Graphics', 'Applied Art', 'Fine Art', 'Music Theory'
    ]
  };
  
  const getNextClass = (sequenceName) => {
    const sequence = sequences[sequenceName];
    const takenClasses = selectedClasses.filter((className) => sequence.includes(className));

    console.log(`sequenceName: ${sequenceName}`);
    console.log(`sequence: ${sequence}`);
    console.log(`takenClasses: ${takenClasses}`);
    
    for (const className of sequence) {
      if (!takenClasses.includes(className)) {
        return className;
      }
    }

    return 'Additional Elective';
  };
  
  const botResponse = [
    "Here is your example schedule:",
    ...Object.keys(sequences).map((sequenceName, index) => (
      `${index + 1}. ${sequenceName}: ${getNextClass(sequenceName)}`
    ))
  ];
  
  return botResponse.join('\n');
};

const handleClassTypeQuestionClick = (classType) => {
  const userMessage = `What ${classType} class should I take next year?`; // Create the user message
  const botResponse = `What ${classType} classes have you taken?`;
  setMessages([...messages, { text: userMessage, type: 'user' }, { text: `What ${classType} classes have you taken?`, type: 'bot' }]);
  setQuestionType(classType);
};

const generateClassTypeResponse = (classType) => {
  if (!classSections.hasOwnProperty(classType)) {
    return 'Invalid class type';
  }

  const sequences = {
    Math: ['Geometry', 'Algebra II', 'Pre-Calculus', 'Calculus'],
    Science: ['Environmental Science', 'Biology', 'Chemistry', 'Physics'],
    History: ['European History I', 'American History I', 'European History II', 'American History II'],
    English: ['English I', 'English II', 'English Language', 'English Literature'],
    Language: ['Spanish I', 'Spanish II', 'Spanish III', 'Spanish IV'],
    Electives: [
      'Accounting', 'Business Management', 'Marketing Education', 'Child Development',
      'Food Science', 'Interior Design', 'Architecture', 'Graphic Design', 'Electronics',
      'Graphics', 'Applied Art', 'Fine Art', 'Music Theory'
    ]
  };

  const sequence = sequences[classType];
  const takenClasses = selectedClasses.filter((className) => sequence.includes(className));

  if (sequence && sequence.length > takenClasses.length) {
    for (const className of sequence) {
      if (!takenClasses.includes(className)) {
        return className;
      }
    }
  }

  return 'an Additional Elective';
};

const isClassSelected = (className) => selectedClasses.includes(className);

return (
  <div className="App">
    <div className="container">
      <div className="conversation-panel">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type === 'user' ? 'user' : 'bot'}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="right-panel">
        {questionType ? (
          <div className="right-panel-content">
            <p>{questionType === 'What classes should I take next year?' ? 'Here are the possible classes you can take:' : 'Select the classes you have taken.'}</p>
            {questionType !== 'What classes should I take next year?' && (
              <div className="class-buttons">
                {Object.entries(classSections).map(([section, classes]) => (
                  <div key={section} className="class-section">
                    <p>{section}</p>
                    <div className="class-buttons">
                      {classes.map((className) => (
                        <button
                          key={className}
                          className={isClassSelected(className) ? 'selected' : ''}
                          onClick={() => handleClassSelection(className)}
                        >
                          {className}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="done-button" onClick={handleDoneClick}>
              Done
            </button>
          </div>
        ) : (
          <div className="right-panel-content">
            <p>Build your schedule! Ask one of the following questions:</p>
            <button className="question" onClick={() => handleQuestionClick('What classes should I take next year?')}>
              What classes should I take next year?
            </button>
            <button className="question" onClick={() => handleClassTypeQuestionClick('Math')}>
              What Math class should I take next year?
            </button>
            <button className="question" onClick={() => handleClassTypeQuestionClick('Science')}>
              What Science class should I take next year?
            </button>
            <button className="question" onClick={() => handleClassTypeQuestionClick('History')}>
              What History class should I take next year?
            </button>
            <button className="question" onClick={() => handleClassTypeQuestionClick('English')}>
              What English class should I take next year?
            </button>
            <button className="question" onClick={() => handleClassTypeQuestionClick('Language')}>
              What Language class should I take next year?
            </button>
            <button className="question" onClick={() => handleClassTypeQuestionClick('Electives')}>
              What Elective class should I take next year?
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);

}

export default App;
