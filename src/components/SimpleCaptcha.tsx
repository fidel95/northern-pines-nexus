
import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface SimpleCaptchaProps {
  onVerify: (isValid: boolean) => void;
  className?: string;
}

export const SimpleCaptcha = ({ onVerify, className = "" }: SimpleCaptchaProps) => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isValid, setIsValid] = useState(false);

  const generateNumbers = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setUserAnswer('');
    setIsValid(false);
    onVerify(false);
  };

  useEffect(() => {
    generateNumbers();
  }, []);

  useEffect(() => {
    const answer = parseInt(userAnswer);
    const correctAnswer = num1 + num2;
    const valid = answer === correctAnswer;
    setIsValid(valid);
    onVerify(valid);
  }, [userAnswer, num1, num2, onVerify]);

  return (
    <div className={`${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Security Question *
      </label>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded border">
          <span className="font-mono text-lg">{num1} + {num2} = ?</span>
          <button
            type="button"
            onClick={generateNumbers}
            className="text-blue-600 hover:text-blue-700 ml-2"
            title="Generate new question"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
        <input
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Answer"
          className="w-24 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        />
        {userAnswer && (
          <span className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
            {isValid ? '✓' : '✗'}
          </span>
        )}
      </div>
    </div>
  );
};
