import React, { useState, useEffect } from 'react';
import { Lesson, Question, DataTypeCard, DragDropItem } from '../types';
import { NeonButton } from './ui/NeonButton';
import { GlassCard } from './ui/GlassCard';
import { AiTutorModal } from './AiTutorModal';

interface LessonViewProps {
  userName: string;
  lesson: Lesson;
  onComplete: (xp: number) => void;
  onExit: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({ userName, lesson, onComplete, onExit }) => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Quiz Stats
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  // Simulation State
  const [userCode, setUserCode] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<{ isError: boolean; message: string } | null>(null);

  // Checklist State
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  // Interactive Cards State
  const [revealedCards, setRevealedCards] = useState<string[]>([]);

  // True/False Game State
  const [tfState, setTfState] = useState({
    idx: 0,
    score: 0,
    hasAnswered: false,
    answeredCorrectly: false,
    isFinished: false
  });

  // Drag Drop Game State
  const [dragItems, setDragItems] = useState<DragDropItem[]>([]);
  const [droppedItems, setDroppedItems] = useState<Record<string, DragDropItem[]>>({});
  const [dragFeedback, setDragFeedback] = useState<string | null>(null); // 'correct' | 'wrong'
  const [selectedDragItem, setSelectedDragItem] = useState<string | null>(null); // For Click-to-Move fallback

  // Identifier Validation Game State
  const [identState, setIdentState] = useState({
    idx: 0,
    score: 0,
    hasAnswered: false,
    answeredCorrectly: false,
    isFinished: false,
    isShaking: false
  });

  // Variable Simulation Game State
  const [varSimState, setVarSimState] = useState({
    selectedType: 'int',
    inputValue: '',
    status: 'idle' as 'idle' | 'valid' | 'invalid',
    successCount: 0,
    completedTypes: [] as string[]
  });

  // Code Puzzle Game State
  const [puzzleState, setPuzzleState] = useState({
    idx: 0,
    currentSlots: [] as (string | null)[],
    availableFragments: [] as string[], // ids or strings
    score: 0,
    isFinished: false,
    feedback: null as 'success' | 'error' | null
  });

  const question = lesson.questions[currentQuestionIdx];
  const progress = ((currentQuestionIdx) / lesson.questions.length) * 100;
  
  const isSimulation = question.type === 'simulation';
  const isChecklist = question.type === 'checklist';
  const isInteractiveCards = question.type === 'interactive_cards';
  const isTFGame = question.type === 'true_false_game';
  const isDragGame = question.type === 'drag_drop_game';
  const isIdentGame = question.type === 'identifier_validation_game';
  const isVarSimGame = question.type === 'variable_simulation';
  const isCodePuzzleGame = question.type === 'code_puzzle';

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setConsoleOutput(null);
    if (isSimulation && question.simulationConfig) {
      setUserCode(question.simulationConfig.defaultCode);
    }
    if (isChecklist && question.checklistItems) {
      setCheckedItems(new Array(question.checklistItems.length).fill(false));
    }
    if (isInteractiveCards) {
      setRevealedCards([]);
    }
    if (isTFGame) {
      setTfState({
        idx: 0,
        score: 0,
        hasAnswered: false,
        answeredCorrectly: false,
        isFinished: false
      });
    }
    if (isDragGame && question.dragDropConfig) {
      setDragItems([...question.dragDropConfig.items]);
      setDroppedItems({});
      setSelectedDragItem(null);
      setDragFeedback(null);
    }
    if (isIdentGame) {
      setIdentState({
        idx: 0,
        score: 0,
        hasAnswered: false,
        answeredCorrectly: false,
        isFinished: false,
        isShaking: false
      });
    }
    if (isVarSimGame) {
      setVarSimState({
        selectedType: 'int',
        inputValue: '',
        status: 'idle',
        successCount: 0,
        completedTypes: []
      });
    }
    if (isCodePuzzleGame && question.codePuzzleConfig) {
      const firstPuzzle = question.codePuzzleConfig.puzzles[0];
      setPuzzleState({
        idx: 0,
        currentSlots: new Array(firstPuzzle.correctSequence.length).fill(null),
        availableFragments: [...firstPuzzle.fragments],
        score: 0,
        isFinished: false,
        feedback: null
      });
    }
  }, [currentQuestionIdx, question, isSimulation, isChecklist, isInteractiveCards, isTFGame, isDragGame, isIdentGame, isVarSimGame, isCodePuzzleGame]);


  const handleCheck = () => {
    if (isSimulation || isChecklist || isInteractiveCards || isTFGame || isDragGame || isIdentGame || isVarSimGame || isCodePuzzleGame) return;
    
    if (selectedOption === null) return;
    
    const correct = selectedOption === question.correctAnswerIndex;
    setIsCorrect(correct);
    if (correct) {
        setCorrectAnswersCount(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const handleToggleCheck = (index: number) => {
    if (showExplanation) return; // Locked after completion
    
    const newChecked = [...checkedItems];
    newChecked[index] = !newChecked[index];
    setCheckedItems(newChecked);

    // Auto-check correctness
    if (newChecked.every(Boolean)) {
      setIsCorrect(true);
      setShowExplanation(true);
    }
  };

  const handleRevealCard = (cardId: string) => {
    if (!revealedCards.includes(cardId)) {
        const newRevealed = [...revealedCards, cardId];
        setRevealedCards(newRevealed);
        
        // Auto check if all cards revealed
        if (question.interactiveCards && newRevealed.length === question.interactiveCards.length) {
            setIsCorrect(true);
            setShowExplanation(true);
        }
    }
  };

  const handleRunSimulation = () => {
    if (!question.simulationConfig) return;
    
    setConsoleOutput(null);

    // Simulate compilation delay
    setTimeout(() => {
      const { validation } = question.simulationConfig!;
      const codeToValidate = userCode.trim();

      let matchedError = null;
      let isSuccess = false;

      // Logic: If requiredMatches array exists, check ALL. Else check single correctRegex.
      if (validation.requiredMatches && validation.requiredMatches.length > 0) {
        // Check if ALL patterns are present
        const allMatchesPassed = validation.requiredMatches.every(pattern => new RegExp(pattern).test(codeToValidate));
        isSuccess = allMatchesPassed;
      } else if (validation.correctRegex) {
        // Fallback to single regex
        const correctRegex = new RegExp(validation.correctRegex);
        isSuccess = correctRegex.test(codeToValidate);
      }

      if (isSuccess) {
        // Success Logic
        setConsoleOutput({ isError: false, message: validation.successMessage });
        setIsCorrect(true);
        setShowExplanation(true);
      } else {
        // Check specific error matchers for helpful feedback
        if (validation.errorMatchers) {
          matchedError = validation.errorMatchers.find(matcher => new RegExp(matcher.regex).test(codeToValidate));
        }

        if (matchedError) {
          setConsoleOutput({ isError: true, message: matchedError.message });
        } else {
          // General Syntax Error
          setConsoleOutput({ isError: true, message: validation.errorMessage });
        }
        
        setIsCorrect(false);
      }
    }, 600);
  };

  // True/False Game Handlers
  const handleTFAnswer = (userAnswer: boolean) => {
    if (!question.trueFalseGameConfig || tfState.hasAnswered) return;

    const currentStatement = question.trueFalseGameConfig.statements[tfState.idx];
    const isAnswerCorrect = userAnswer === currentStatement.isCorrect;

    setTfState(prev => ({
      ...prev,
      hasAnswered: true,
      answeredCorrectly: isAnswerCorrect,
      score: isAnswerCorrect ? prev.score + 1 : prev.score
    }));
  };

  const handleTFNext = () => {
    if (!question.trueFalseGameConfig) return;
    
    if (tfState.idx < question.trueFalseGameConfig.statements.length - 1) {
      setTfState(prev => ({
        ...prev,
        idx: prev.idx + 1,
        hasAnswered: false,
        answeredCorrectly: false
      }));
    } else {
      setTfState(prev => ({ ...prev, isFinished: true }));
      // Check pass condition
      if (tfState.score >= question.trueFalseGameConfig!.minScoreToPass) {
        setIsCorrect(true);
        setShowExplanation(true); // Shows the generic explanation to exit
      }
    }
  };

  const handleTFRetry = () => {
    setTfState({
      idx: 0,
      score: 0,
      hasAnswered: false,
      answeredCorrectly: false,
      isFinished: false
    });
  };

  // Drag & Drop Logic
  const onDragStart = (e: React.DragEvent, item: DragDropItem) => {
    e.dataTransfer.setData('itemId', item.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const onDrop = (e: React.DragEvent, zoneId: string, requiredType: string) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('itemId');
    processDrop(itemId, zoneId, requiredType);
  };

  const processDrop = (itemId: string, zoneId: string, requiredType: string) => {
    const item = dragItems.find(i => i.id === itemId);
    
    if (item) {
        if (item.type === requiredType) {
            // Correct Drop
            setDragItems(prev => prev.filter(i => i.id !== itemId));
            setDroppedItems(prev => ({
                ...prev,
                [zoneId]: [...(prev[zoneId] || []), item]
            }));
            setDragFeedback('correct');
            setSelectedDragItem(null); // Clear selection

            // Check completion
            if (dragItems.length === 1) { // 1 because we are about to remove it
                setIsCorrect(true);
                setShowExplanation(true);
            }
            
            setTimeout(() => setDragFeedback(null), 1000);
        } else {
            // Wrong Drop
            setDragFeedback('wrong');
            setTimeout(() => setDragFeedback(null), 1000);
        }
    }
  };

  // Click-to-Move Fallback (Accessibility/Mobile)
  const handleItemClick = (item: DragDropItem) => {
    if (selectedDragItem === item.id) {
        setSelectedDragItem(null);
    } else {
        setSelectedDragItem(item.id);
    }
  };

  const handleZoneClick = (zoneId: string, requiredType: string) => {
    if (selectedDragItem) {
        processDrop(selectedDragItem, zoneId, requiredType);
    }
  };

  // Identifier Validation Game Handlers
  const handleIdentAnswer = (isValidSelection: boolean) => {
    if (!question.identifierGameConfig || identState.hasAnswered) return;

    const currentItem = question.identifierGameConfig.items[identState.idx];
    const isAnswerCorrect = isValidSelection === currentItem.isValid;

    if (!isAnswerCorrect) {
      setIdentState(prev => ({ ...prev, isShaking: true }));
      setTimeout(() => setIdentState(prev => ({ ...prev, isShaking: false })), 500);
    }

    setIdentState(prev => ({
      ...prev,
      hasAnswered: true,
      answeredCorrectly: isAnswerCorrect,
      score: isAnswerCorrect ? prev.score + 1 : prev.score
    }));
  };

  const handleIdentNext = () => {
    if (!question.identifierGameConfig) return;
    
    if (identState.idx < question.identifierGameConfig.items.length - 1) {
      setIdentState(prev => ({
        ...prev,
        idx: prev.idx + 1,
        hasAnswered: false,
        answeredCorrectly: false
      }));
    } else {
      setIdentState(prev => ({ ...prev, isFinished: true }));
      if (identState.score >= question.identifierGameConfig.minScoreToPass) {
        setIsCorrect(true);
        setShowExplanation(true);
      }
    }
  };

  const handleIdentRetry = () => {
    setIdentState({
      idx: 0,
      score: 0,
      hasAnswered: false,
      answeredCorrectly: false,
      isFinished: false,
      isShaking: false
    });
  };

  // Game 4: Variable Simulation Logic
  const handleVarSimInject = () => {
    const val = varSimState.inputValue.trim();
    if (!val) return;

    let isValid = false;
    // Regex Checks
    switch (varSimState.selectedType) {
      case 'int':
        isValid = /^-?\d+$/.test(val);
        break;
      case 'String':
        isValid = /^".*"$/.test(val);
        break;
      case 'boolean':
        isValid = /^(true|false)$/.test(val);
        break;
      case 'char':
        isValid = /^'.{1}'$/.test(val);
        break;
    }

    if (isValid) {
      setVarSimState(prev => {
        const newSuccessCount = prev.successCount + 1;
        const newCompleted = !prev.completedTypes.includes(prev.selectedType) 
          ? [...prev.completedTypes, prev.selectedType] 
          : prev.completedTypes;
          
        const isComplete = newSuccessCount >= (question.variableSimConfig?.targetSuccesses || 3);
        
        if (isComplete) {
            setIsCorrect(true);
            setShowExplanation(true);
        }

        return { 
          ...prev, 
          status: 'valid', 
          successCount: newSuccessCount,
          completedTypes: newCompleted
        };
      });
    } else {
      setVarSimState(prev => ({ ...prev, status: 'invalid' }));
    }

    // Reset status after animation
    setTimeout(() => {
        setVarSimState(prev => ({ ...prev, status: 'idle' }));
        if(isValid) setVarSimState(prev => ({ ...prev, inputValue: '' }));
    }, 1500);
  };

  // Game 5: Code Puzzle Logic
  const handlePuzzleFragmentClick = (fragment: string, fromPool: boolean, slotIndex: number = -1) => {
    if (puzzleState.isFinished || puzzleState.feedback) return;

    if (fromPool) {
        // Move from pool to first empty slot
        const emptySlotIdx = puzzleState.currentSlots.indexOf(null);
        if (emptySlotIdx !== -1) {
            const newSlots = [...puzzleState.currentSlots];
            newSlots[emptySlotIdx] = fragment;
            const newPool = puzzleState.availableFragments.filter(f => f !== fragment); // Remove FIRST instance only if duplicates exist? Assume unique for now or careful filter.
            // Actually, handle by index if fragments can be identical.
            // For now, assume unique strings or handle logic carefully.
            // Let's use index-based filtering for safety if duplicates exist.
            const fragIndexInPool = puzzleState.availableFragments.indexOf(fragment);
            const newPoolSafe = [...puzzleState.availableFragments];
            newPoolSafe.splice(fragIndexInPool, 1);

            setPuzzleState(prev => ({
                ...prev,
                currentSlots: newSlots,
                availableFragments: newPoolSafe
            }));
        }
    } else {
        // Move from slot back to pool
        const newSlots = [...puzzleState.currentSlots];
        newSlots[slotIndex] = null;
        setPuzzleState(prev => ({
            ...prev,
            currentSlots: newSlots,
            availableFragments: [...prev.availableFragments, fragment]
        }));
    }
  };

  const handlePuzzleCheck = () => {
      if (!question.codePuzzleConfig) return;
      const currentPuzzle = question.codePuzzleConfig.puzzles[puzzleState.idx];
      
      // Check if all slots filled
      if (puzzleState.currentSlots.includes(null)) return;

      const isCorrectOrder = puzzleState.currentSlots.join('') === currentPuzzle.correctSequence.join('');
      
      if (isCorrectOrder) {
          setPuzzleState(prev => ({ ...prev, feedback: 'success', score: prev.score + 1 }));
          
          setTimeout(() => {
              // Next Puzzle
              if (puzzleState.idx < question.codePuzzleConfig!.puzzles.length - 1) {
                  const nextPuzzle = question.codePuzzleConfig!.puzzles[puzzleState.idx + 1];
                  setPuzzleState(prev => ({
                      ...prev,
                      idx: prev.idx + 1,
                      currentSlots: new Array(nextPuzzle.correctSequence.length).fill(null),
                      availableFragments: [...nextPuzzle.fragments],
                      feedback: null
                  }));
              } else {
                  // Finish
                  setPuzzleState(prev => ({ ...prev, isFinished: true, feedback: null }));
                  if (puzzleState.score + 1 >= question.codePuzzleConfig!.minScoreToPass) {
                      setIsCorrect(true);
                      setShowExplanation(true);
                  }
              }
          }, 1500);
      } else {
          setPuzzleState(prev => ({ ...prev, feedback: 'error' }));
          setTimeout(() => setPuzzleState(prev => ({ ...prev, feedback: null })), 1000);
      }
  };

  const handlePuzzleRetry = () => {
    if (!question.codePuzzleConfig) return;
    const firstPuzzle = question.codePuzzleConfig.puzzles[0];
    setPuzzleState({
        idx: 0,
        currentSlots: new Array(firstPuzzle.correctSequence.length).fill(null),
        availableFragments: [...firstPuzzle.fragments],
        score: 0,
        isFinished: false,
        feedback: null
    });
  };


  const handleNext = () => {
    if (currentQuestionIdx < lesson.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      // Check if this is the final quiz of section 8
      if (lesson.id === 'java-quiz-8') {
          setShowSummary(true);
      } else {
          onComplete(lesson.xpReward);
      }
    }
  };

  // Helper to render text with newlines/markdown-ish
  const renderText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.startsWith('**') ? 
            <strong className="text-cyan-400 block mt-4 mb-2 text-lg">{line.replace(/\*\*/g, '')}</strong> :
            line.startsWith('```') ? null : // Skip code block markers
            line.startsWith('-') ?
            <span className="block ml-4 text-slate-300 mb-1">• {line.substring(1)}</span> :
            <span className="block mb-2 text-slate-200">{line}</span>
        }
      </React.Fragment>
    ));
  };

  // Render Custom UI Cards
  const renderCustomContent = (custom: NonNullable<Question['customContent']>) => {
    if (custom.type === 'dataTypeCards') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {custom.data.map((card, idx) => (
            <div 
              key={idx} 
              className={`p-4 rounded-xl border bg-slate-800/50 backdrop-blur-sm ${
                card.color === 'cyan' 
                  ? 'border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                  : 'border-fuchsia-500/30 shadow-[0_0_15px_rgba(217,70,239,0.1)]'
              }`}
            >
              <h4 className={`font-bold mb-3 ${card.color === 'cyan' ? 'text-cyan-400' : 'text-fuchsia-400'}`}>
                {card.title}
              </h4>
              <ul className="space-y-2">
                {card.items.map((item, i) => (
                  <li key={i} className="text-sm">
                    <span className="font-mono bg-slate-900 px-1 py-0.5 rounded text-slate-200 mr-2">{item.label}</span>
                    <span className="text-slate-400 text-xs">{item.desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // RENDER SUMMARY SCREEN
  if (showSummary) {
      const score = correctAnswersCount * 10;
      let message = "";
      if (score === 100) message = "Perfect! You are a Java Master!";
      else if (score >= 80) message = "Great job! Almost perfect.";
      else if (score >= 50) message = "Good effort. Keep practicing.";
      else message = "Don't give up! Review the material and try again.";

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
             <GlassCard className="max-w-md w-full text-center p-8 border-cyan-500/50 relative overflow-hidden">
                {/* Decorative BG */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-500 to-fuchsia-500"></div>
                
                <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-widest mt-4">
                    Mission Report
                </h2>
                
                <div className="mb-8 relative">
                   <div className="w-20 h-20 bg-slate-800 rounded-full mx-auto flex items-center justify-center border-2 border-cyan-500 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                      <span className="text-3xl">📝</span>
                   </div>
                    <p className="text-slate-400 text-sm uppercase tracking-wide mb-1">Cadet</p>
                    <p className="text-2xl font-mono text-cyan-400 font-bold">{userName}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <p className="text-slate-400 text-xs uppercase mb-1">Score</p>
                        <p className="text-4xl font-bold text-emerald-400">{score}</p>
                    </div>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                        <p className="text-slate-400 text-xs uppercase mb-1">Correct</p>
                        <p className="text-4xl font-bold text-white">{correctAnswersCount}<span className="text-lg text-slate-500">/{lesson.questions.length}</span></p>
                    </div>
                </div>

                <div className="mb-8 p-4 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 rounded-xl border border-indigo-500/30">
                    <p className="text-indigo-200 italic">"{message}"</p>
                </div>

                <NeonButton 
                    variant="green" 
                    fullWidth 
                    onClick={() => onComplete(score)} 
                    className="animate-pulse-slow"
                >
                    Lanjut ke Refleksi
                </NeonButton>
             </GlassCard>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex flex-col pt-20 pb-10 px-4 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onExit} className="text-slate-400 hover:text-white transition-colors">
          ✕ Exit Mission
        </button>
        <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
           <div className="h-full bg-cyan-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <GlassCard className="flex-1 flex flex-col relative overflow-hidden">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          
          <div className="mb-6">
            {!isTFGame && !isDragGame && !isIdentGame && !isVarSimGame && !isCodePuzzleGame && renderText(question.text)}
          </div>

          {question.customContent && renderCustomContent(question.customContent)}
          
          {/* Static Code Snippet (Quiz & Checklist) */}
          {(question.codeSnippet && !isSimulation && !isTFGame && !isDragGame && !isIdentGame && !isVarSimGame && !isCodePuzzleGame) && (
            <div className="bg-slate-950 rounded-lg overflow-hidden border border-slate-800 mb-6 shadow-inner">
                <div className="bg-slate-900/50 px-4 py-2 border-b border-slate-800 flex items-center space-x-2">
                   <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                   </div>
                   <span className="text-xs text-slate-500 ml-2 font-mono">Example.java</span>
                </div>
                <div className="p-4 font-mono text-sm overflow-x-auto">
                    <pre><code className="text-green-400">{question.codeSnippet}</code></pre>
                </div>
            </div>
          )}

          {/* Drag & Drop Game UI */}
          {isDragGame && question.dragDropConfig && (
            <div className="flex flex-col h-full">
               <div className="flex justify-between items-center mb-4">
                  <h3 className="text-cyan-400 font-bold uppercase tracking-wider">
                     <span className="mr-2">⚡</span> Sort the Data
                  </h3>
                  <div className="text-xs text-slate-500">
                    {dragItems.length === 0 ? "All Sorted" : `${dragItems.length} items remaining`}
                  </div>
               </div>

               {/* Feedback Message */}
               {dragFeedback && (
                  <div className={`text-center mb-4 font-bold animate-pulse ${dragFeedback === 'correct' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {dragFeedback === 'correct' ? '✅ System Accepted' : '❌ Invalid Data Type'}
                  </div>
               )}

               {/* Drag Items Container */}
               <div className="flex flex-wrap gap-3 mb-8 min-h-[80px] p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                  {dragItems.map(item => (
                      <div 
                        key={item.id}
                        draggable
                        onDragStart={(e) => onDragStart(e, item)}
                        onClick={() => handleItemClick(item)}
                        className={`
                          px-4 py-2 bg-slate-800 rounded-lg border shadow-lg cursor-grab active:cursor-grabbing hover:bg-slate-700 transition-all font-mono text-white select-none
                          ${selectedDragItem === item.id ? 'border-cyan-400 ring-2 ring-cyan-500/50 shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'border-cyan-500/50'}
                          ${dragFeedback === 'wrong' && selectedDragItem === item.id ? 'animate-shake border-rose-500' : ''}
                        `}
                      >
                        {item.content}
                      </div>
                  ))}
                  {dragItems.length === 0 && (
                      <div className="w-full text-center text-slate-500 italic">No incoming data.</div>
                  )}
               </div>

               {/* Drop Zones */}
               <div className="grid grid-cols-2 gap-4">
                  {question.dragDropConfig.zones.map(zone => (
                      <div
                        key={zone.id}
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, zone.id, zone.type)}
                        onClick={() => handleZoneClick(zone.id, zone.type)}
                        className={`
                          relative min-h-[120px] rounded-xl border-2 border-dashed transition-all flex flex-col p-3
                          ${selectedDragItem ? 'border-yellow-500/50 bg-yellow-900/10 cursor-pointer hover:bg-yellow-900/20' : 'border-slate-600 bg-slate-800/20'}
                        `}
                      >
                          <div className="text-xs uppercase font-bold text-slate-400 mb-2 pointer-events-none">{zone.label}</div>
                          
                          <div className="flex flex-wrap gap-2 pointer-events-none">
                              {droppedItems[zone.id]?.map(item => (
                                  <span key={item.id} className="text-xs bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded">
                                      {item.content}
                                  </span>
                              ))}
                          </div>

                          {/* Glow effect on correct drop */}
                          {dragFeedback === 'correct' && Object.keys(droppedItems).length > 0 && ( // rudimentary check, ideally track last dropped zone
                             <div className="absolute inset-0 bg-emerald-500/10 rounded-xl animate-pulse pointer-events-none"></div>
                          )}
                      </div>
                  ))}
               </div>
            </div>
          )}

          {/* Identifier Validation Game UI */}
          {isIdentGame && question.identifierGameConfig && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              {!identState.isFinished ? (
                 <>
                   {/* Game Progress */}
                   <div className="w-full flex justify-between text-xs text-slate-500 mb-8 uppercase tracking-widest font-mono">
                      <span>Subject {identState.idx + 1} / {question.identifierGameConfig.items.length}</span>
                      <span>Score: {identState.score}</span>
                   </div>

                   {/* Identifier Display */}
                   <div className="relative w-full mb-12">
                      <div className={`absolute inset-0 blur-xl transition-colors duration-500 ${identState.hasAnswered ? (identState.answeredCorrectly ? 'bg-emerald-500/20' : 'bg-rose-500/20') : 'bg-fuchsia-500/10'}`}></div>
                      <div className={`relative bg-slate-900/80 border p-12 rounded-2xl text-center shadow-2xl transition-all duration-300 
                         ${identState.hasAnswered ? (identState.answeredCorrectly ? 'border-emerald-500' : 'border-rose-500') : 'border-slate-700'}
                         ${identState.isShaking ? 'animate-shake border-rose-600 bg-rose-900/20' : ''}
                      `}>
                          <h3 className="text-4xl md:text-5xl font-mono font-bold text-white tracking-tight break-all">
                            {question.identifierGameConfig.items[identState.idx].text}
                          </h3>
                      </div>
                   </div>

                   {/* Controls */}
                   {!identState.hasAnswered ? (
                     <div className="flex gap-4 w-full max-w-md">
                        <button 
                          onClick={() => handleIdentAnswer(true)}
                          className="flex-1 bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold py-6 rounded-xl border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-105 active:scale-95 text-xl uppercase tracking-wider"
                        >
                          ✔ Valid
                        </button>
                        <button 
                          onClick={() => handleIdentAnswer(false)}
                          className="flex-1 bg-gradient-to-br from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-bold py-6 rounded-xl border border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all transform hover:scale-105 active:scale-95 text-xl uppercase tracking-wider"
                        >
                          ❌ Invalid
                        </button>
                     </div>
                   ) : (
                     <div className="text-center animate-in slide-in-from-bottom-5 fade-in">
                        <div className={`text-lg font-bold mb-2 uppercase tracking-widest ${identState.answeredCorrectly ? 'text-emerald-400' : 'text-rose-400'}`}>
                           {identState.answeredCorrectly ? 'Access Granted' : 'Syntax Error Detected'}
                        </div>
                        <p className="text-slate-300 mb-6 max-w-lg mx-auto">
                          {question.identifierGameConfig.items[identState.idx].explanation}
                        </p>
                        <NeonButton onClick={handleIdentNext} className="min-w-[200px]">
                           NEXT SUBJECT ➔
                        </NeonButton>
                     </div>
                   )}
                 </>
              ) : (
                /* Game Finished Screen */
                <div className="text-center animate-in zoom-in-95 fade-in duration-500">
                    <div className="text-6xl mb-4">
                        {identState.score >= question.identifierGameConfig.minScoreToPass ? '🛡️' : '💥'}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                       {identState.score >= question.identifierGameConfig.minScoreToPass ? 'PERIMETER SECURE' : 'BREACH DETECTED'}
                    </h2>
                    <p className="text-xl text-cyan-400 font-mono mb-6">
                       Final Efficiency: {identState.score} / {question.identifierGameConfig.items.length}
                    </p>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 mb-8 max-w-md mx-auto">
                        <p className="text-slate-300">
                           {identState.score >= question.identifierGameConfig.minScoreToPass 
                             ? question.identifierGameConfig.successMessage 
                             : question.identifierGameConfig.failMessage}
                        </p>
                    </div>
                    
                    {identState.score < question.identifierGameConfig.minScoreToPass && (
                       <NeonButton variant="red" onClick={handleIdentRetry}>
                          RETRY PROTOCOL
                       </NeonButton>
                    )}
                </div>
              )}
            </div>
          )}

          {/* Game 4: Variable Simulation UI */}
          {isVarSimGame && question.variableSimConfig && (
             <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="text-center mb-6">
                   <h3 className="text-2xl font-bold text-white mb-2">Memory Allocator</h3>
                   <div className="text-xs text-slate-400 uppercase tracking-widest">
                      Target: {varSimState.successCount} / {question.variableSimConfig.targetSuccesses} Correct Allocations
                   </div>
                </div>

                <div className="flex gap-2 mb-8">
                   {['int', 'String', 'boolean', 'char'].map(type => (
                      <button 
                         key={type}
                         onClick={() => setVarSimState(prev => ({ ...prev, selectedType: type }))}
                         className={`px-3 py-1 rounded text-sm font-mono border transition-all ${varSimState.selectedType === type ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                      >
                         {type}
                      </button>
                   ))}
                </div>

                {/* Variable Container Box */}
                <div className={`
                    w-48 h-48 border-2 rounded-2xl flex flex-col items-center justify-center transition-all duration-500 mb-8 relative
                    ${varSimState.status === 'valid' ? 'border-emerald-500 bg-emerald-900/20 shadow-[0_0_50px_rgba(16,185,129,0.3)]' : 
                      varSimState.status === 'invalid' ? 'border-rose-500 bg-rose-900/20 shadow-[0_0_50px_rgba(244,63,94,0.3)] animate-shake' : 
                      'border-white/20 bg-slate-800/50'}
                `}>
                    <div className="absolute top-[-12px] bg-slate-900 px-3 text-sm text-slate-400 font-mono">
                        {varSimState.selectedType} container
                    </div>
                    <div className="text-3xl font-bold text-white font-mono break-all px-4 text-center">
                        {varSimState.inputValue || <span className="text-white/10">...</span>}
                    </div>
                    
                    {varSimState.status === 'valid' && (
                        <div className="absolute -right-4 -top-4 text-2xl animate-bounce">✅</div>
                    )}
                </div>

                <div className="flex w-full max-w-sm gap-2">
                    <input 
                      type="text" 
                      placeholder={`Enter ${varSimState.selectedType} value...`}
                      value={varSimState.inputValue}
                      onChange={(e) => setVarSimState(prev => ({ ...prev, inputValue: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleVarSimInject()}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 font-mono text-white focus:border-cyan-500 focus:outline-none"
                    />
                    <NeonButton onClick={handleVarSimInject} disabled={!varSimState.inputValue}>
                       INJECT
                    </NeonButton>
                </div>
             </div>
          )}

          {/* Game 5: Code Puzzle UI */}
          {isCodePuzzleGame && question.codePuzzleConfig && (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
                  {!puzzleState.isFinished ? (
                      <>
                        <div className="w-full flex justify-between text-xs text-slate-500 mb-8 uppercase tracking-widest font-mono">
                           <span>Puzzle {puzzleState.idx + 1} / {question.codePuzzleConfig.puzzles.length}</span>
                           <span>Score: {puzzleState.score}</span>
                        </div>

                        {/* Slots */}
                        <div className="flex flex-wrap justify-center gap-2 mb-8 bg-slate-900/50 p-4 rounded-xl border border-slate-700">
                           {puzzleState.currentSlots.map((slot, idx) => (
                               <div 
                                 key={idx}
                                 onClick={() => slot && handlePuzzleFragmentClick(slot, false, idx)}
                                 className={`
                                    min-w-[60px] h-14 border-b-2 flex items-center justify-center px-3 font-mono text-lg transition-all cursor-pointer
                                    ${slot ? 'border-cyan-400 bg-cyan-900/20 text-cyan-300' : 'border-slate-600 bg-slate-800/30 text-slate-600'}
                                    ${puzzleState.feedback === 'error' ? 'border-rose-500 text-rose-400 animate-shake' : ''}
                                    ${puzzleState.feedback === 'success' ? 'border-emerald-500 text-emerald-400' : ''}
                                 `}
                               >
                                  {slot || '_'}
                               </div>
                           ))}
                        </div>

                        {/* Fragment Pool */}
                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                           {puzzleState.availableFragments.map((frag, idx) => (
                               <button
                                 key={`${frag}-${idx}`}
                                 onClick={() => handlePuzzleFragmentClick(frag, true)}
                                 className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg font-mono text-white shadow-lg hover:bg-slate-700 hover:border-cyan-500/50 transition-all active:scale-95"
                               >
                                  {frag}
                               </button>
                           ))}
                        </div>

                        <NeonButton 
                           onClick={handlePuzzleCheck} 
                           disabled={puzzleState.currentSlots.includes(null)}
                           className="w-full max-w-xs"
                        >
                           COMPILE SEQUENCE
                        </NeonButton>
                      </>
                  ) : (
                      /* Puzzle Finished Screen */
                      <div className="text-center animate-in zoom-in-95 fade-in duration-500">
                          <div className="text-6xl mb-4">
                              {puzzleState.score >= question.codePuzzleConfig.minScoreToPass ? '🧩' : '⚠️'}
                          </div>
                          <h2 className="text-3xl font-bold text-white mb-2">
                             {puzzleState.score >= question.codePuzzleConfig.minScoreToPass ? 'SYNTAX CONSTRUCTED' : 'COMPILATION FAILED'}
                          </h2>
                          <p className="text-xl text-cyan-400 font-mono mb-6">
                             Efficiency: {puzzleState.score} / {question.codePuzzleConfig.puzzles.length}
                          </p>
                          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 mb-8 max-w-md mx-auto">
                              <p className="text-slate-300">
                                 {puzzleState.score >= question.codePuzzleConfig.minScoreToPass 
                                   ? question.codePuzzleConfig.successMessage 
                                   : question.codePuzzleConfig.failMessage}
                              </p>
                          </div>
                          
                          {puzzleState.score < question.codePuzzleConfig.minScoreToPass && (
                             <NeonButton variant="red" onClick={handlePuzzleRetry}>
                                REBUILD SOURCE
                             </NeonButton>
                          )}
                      </div>
                  )}
              </div>
          )}

          {/* True/False Game UI */}
          {isTFGame && question.trueFalseGameConfig && (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              
              {!tfState.isFinished ? (
                 <>
                   {/* Game Progress */}
                   <div className="w-full flex justify-between text-xs text-slate-500 mb-8 uppercase tracking-widest font-mono">
                      <span>Statement {tfState.idx + 1} / {question.trueFalseGameConfig.statements.length}</span>
                      <span>Score: {tfState.score}</span>
                   </div>

                   {/* Statement Card */}
                   <div className="relative w-full mb-10">
                      <div className={`absolute inset-0 blur-xl transition-colors duration-500 ${tfState.hasAnswered ? (tfState.answeredCorrectly ? 'bg-emerald-500/20' : 'bg-rose-500/20') : 'bg-cyan-500/10'}`}></div>
                      <div className={`relative bg-slate-900/80 border p-8 rounded-2xl text-center shadow-2xl transition-colors duration-300 ${tfState.hasAnswered ? (tfState.answeredCorrectly ? 'border-emerald-500' : 'border-rose-500') : 'border-slate-700'}`}>
                          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                            {question.trueFalseGameConfig.statements[tfState.idx].text}
                          </h3>
                      </div>
                   </div>

                   {/* Controls */}
                   {!tfState.hasAnswered ? (
                     <div className="flex gap-4 w-full max-w-md">
                        <button 
                          onClick={() => handleTFAnswer(true)}
                          className="flex-1 bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 text-white font-bold py-6 rounded-xl border border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all transform hover:scale-105 active:scale-95 text-xl"
                        >
                          ✔ BENAR
                        </button>
                        <button 
                          onClick={() => handleTFAnswer(false)}
                          className="flex-1 bg-gradient-to-br from-rose-600 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white font-bold py-6 rounded-xl border border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all transform hover:scale-105 active:scale-95 text-xl"
                        >
                          ❌ SALAH
                        </button>
                     </div>
                   ) : (
                     <div className="text-center animate-in slide-in-from-bottom-5 fade-in">
                        <div className={`text-lg font-bold mb-2 ${tfState.answeredCorrectly ? 'text-emerald-400' : 'text-rose-400'}`}>
                           {tfState.answeredCorrectly ? 'CORRECT ANALYSIS' : 'LOGIC ERROR'}
                        </div>
                        <p className="text-slate-300 mb-6 max-w-lg mx-auto">
                          {question.trueFalseGameConfig.statements[tfState.idx].explanation}
                        </p>
                        <NeonButton onClick={handleTFNext} className="min-w-[200px]">
                           NEXT DATA POINT ➔
                        </NeonButton>
                     </div>
                   )}
                 </>
              ) : (
                /* Game Finished Screen */
                <div className="text-center animate-in zoom-in-95 fade-in duration-500">
                    <div className="text-6xl mb-4">
                        {tfState.score >= question.trueFalseGameConfig.minScoreToPass ? '🏆' : '💀'}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">
                       {tfState.score >= question.trueFalseGameConfig.minScoreToPass ? 'MISSION ACCOMPLISHED' : 'MISSION FAILED'}
                    </h2>
                    <p className="text-xl text-cyan-400 font-mono mb-6">
                       Final Score: {tfState.score} / {question.trueFalseGameConfig.statements.length}
                    </p>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 mb-8 max-w-md mx-auto">
                        <p className="text-slate-300">
                           {tfState.score >= question.trueFalseGameConfig.minScoreToPass 
                             ? question.trueFalseGameConfig.successMessage 
                             : question.trueFalseGameConfig.failMessage}
                        </p>
                    </div>
                    
                    {tfState.score < question.trueFalseGameConfig.minScoreToPass && (
                       <NeonButton variant="red" onClick={handleTFRetry}>
                          RETRY MISSION
                       </NeonButton>
                    )}
                </div>
              )}
            </div>
          )}

          {/* Interactive Code Editor (Simulation) */}
          {isSimulation && (
             <div className="relative mb-6 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg opacity-20 blur transition duration-1000 group-hover:opacity-40"></div>
                <div className="relative bg-slate-950 rounded-lg overflow-hidden border border-slate-700 shadow-2xl">
                    <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="text-xs text-cyan-300 font-mono">⚡ Interactive Editor</span>
                            <span className="text-xs text-slate-500 font-mono">Main.java</span>
                        </div>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Editable</span>
                    </div>
                    <textarea 
                        value={userCode}
                        onChange={(e) => !isCorrect && setUserCode(e.target.value)}
                        className={`w-full h-48 bg-slate-950 p-4 font-mono text-sm focus:outline-none resize-none ${isCorrect ? 'text-emerald-400 opacity-80 cursor-not-allowed' : 'text-slate-200'}`}
                        spellCheck="false"
                        disabled={!!isCorrect}
                    />
                </div>
             </div>
          )}

          {/* Console Output Area for Simulation */}
          {isSimulation && consoleOutput && (
            <div className={`mt-2 mb-6 p-4 rounded-lg font-mono text-sm border-l-4 animate-in slide-in-from-top-2 fade-in ${consoleOutput.isError ? 'bg-red-950/30 border-red-500 text-red-200' : 'bg-emerald-950/30 border-green-500 text-green-400'}`}>
                <div className="flex items-center gap-2 mb-1 font-bold">
                    <span>{consoleOutput.isError ? '⚠️ BUILD FAILED' : '✓ BUILD SUCCESS'}</span>
                </div>
                <p className="whitespace-pre-wrap">{consoleOutput.message}</p>
            </div>
          )}

          {/* Checklist Interaction */}
          {isChecklist && question.checklistItems && (
            <div className="space-y-3 mb-6">
                <h4 className="text-cyan-400 font-bold mb-2 uppercase tracking-wider text-xs">Mission Requirements</h4>
                {question.checklistItems.map((item, idx) => (
                <div 
                    key={idx}
                    onClick={() => handleToggleCheck(idx)}
                    className={`
                    flex items-center p-4 rounded-xl border cursor-pointer transition-all duration-300
                    ${checkedItems[idx] 
                        ? 'bg-emerald-900/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                        : 'bg-slate-800/30 border-slate-700 hover:border-slate-500 hover:bg-slate-800/50'}
                    `}
                >
                    <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-all duration-300
                    ${checkedItems[idx] 
                        ? 'border-emerald-500 bg-emerald-500 text-black scale-110' 
                        : 'border-slate-500'}
                    `}>
                    {checkedItems[idx] && <span className="font-bold text-xs">✓</span>}
                    </div>
                    <span className={`${checkedItems[idx] ? 'text-emerald-100' : 'text-slate-300'}`}>{item}</span>
                </div>
                ))}
            </div>
          )}

          {/* Interactive Cards (Warning/Mistakes) */}
          {isInteractiveCards && question.interactiveCards && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
               {question.interactiveCards.map((card) => {
                 const isRevealed = revealedCards.includes(card.id);
                 return (
                   <div 
                     key={card.id}
                     onClick={() => handleRevealCard(card.id)}
                     className={`
                       relative p-5 rounded-xl border transition-all duration-500 cursor-pointer overflow-hidden group
                       ${isRevealed 
                         ? 'bg-slate-900 border-slate-700' 
                         : 'bg-red-950/20 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:border-red-400 hover:shadow-[0_0_25px_rgba(239,68,68,0.3)]'}
                     `}
                   >
                     {/* Unrevealed State */}
                     <div className={`flex items-center space-x-3 transition-opacity duration-300 ${isRevealed ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'}`}>
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                            <span className="text-xl">⚠️</span>
                        </div>
                        <div>
                            <h4 className="font-bold text-red-200 tracking-wider">DETECTED ERROR</h4>
                            <p className="text-xs text-red-400/70 uppercase">Tap to Analyze</p>
                        </div>
                     </div>

                     {/* Revealed State */}
                     <div className={`transition-all duration-500 ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 h-0 overflow-hidden'}`}>
                         <div className="flex justify-between items-start mb-2">
                             <h4 className="font-bold text-cyan-400">{card.title}</h4>
                             <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30">Resolved</span>
                         </div>
                         
                         <div className="bg-red-900/20 p-2 rounded mb-1 border-l-2 border-red-500">
                             <span className="text-[10px] text-red-400 block mb-1">❌ Salah:</span>
                             <code className="text-sm font-mono text-red-200">{card.badCode}</code>
                         </div>
                         
                         <div className="bg-emerald-900/20 p-2 rounded mb-3 border-l-2 border-emerald-500">
                             <span className="text-[10px] text-emerald-400 block mb-1">✅ Benar:</span>
                             <code className="text-sm font-mono text-emerald-200">{card.goodCode}</code>
                         </div>

                         <p className="text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-2">
                            {card.explanation}
                         </p>
                     </div>
                   </div>
                 );
               })}
            </div>
          )}
          
          {/* Quiz Options */}
          {!isSimulation && !isChecklist && !isInteractiveCards && !isTFGame && !isDragGame && !isIdentGame && !isVarSimGame && !isCodePuzzleGame && question.options && (
            <div className="space-y-3">
                {question.options.map((option, idx) => {
                let btnClass = "w-full text-left p-4 rounded-xl border transition-all ";
                if (showExplanation) {
                    if (idx === question.correctAnswerIndex) btnClass += "bg-emerald-500/20 border-emerald-500 text-emerald-200";
                    else if (idx === selectedOption) btnClass += "bg-rose-500/20 border-rose-500 text-rose-200";
                    else btnClass += "bg-slate-800/50 border-slate-700 opacity-50";
                } else {
                    if (idx === selectedOption) btnClass += "bg-cyan-500/20 border-cyan-500 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.2)]";
                    else btnClass += "bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-500";
                }

                return (
                    <button
                    key={idx}
                    onClick={() => !showExplanation && setSelectedOption(idx)}
                    className={btnClass}
                    disabled={showExplanation}
                    >
                    <span className="inline-block w-6 font-mono opacity-50">{String.fromCharCode(65 + idx)}.</span> {option}
                    </button>
                );
                })}
            </div>
          )}
        </div>

        {/* Action Bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between shrink-0">
            <button 
                onClick={() => setIsAiOpen(true)}
                className="text-fuchsia-400 text-sm hover:text-fuchsia-300 flex items-center gap-2"
            >
                <span className="bg-fuchsia-500/20 p-2 rounded-lg">🤖</span> Ask AI Help
            </button>

            {/* Logic for Buttons */}
            {isSimulation ? (
                !showExplanation ? (
                    <NeonButton 
                        onClick={handleRunSimulation} 
                        className="min-w-[140px]"
                    >
                        {question.simulationConfig?.runButtonLabel || 'Run'} ▶
                    </NeonButton>
                ) : (
                    <NeonButton 
                        variant="green"
                        onClick={handleNext}
                    >
                         Lanjut ➔
                    </NeonButton>
                )
            ) : isChecklist ? (
                <NeonButton 
                    variant={showExplanation ? "green" : "disabled"}
                    onClick={handleNext}
                    disabled={!showExplanation}
                >
                    {showExplanation ? "Continue ➔" : "Complete List"}
                </NeonButton>
            ) : isInteractiveCards ? (
                <NeonButton
                    variant={showExplanation ? "green" : "disabled"}
                    onClick={handleNext}
                    disabled={!showExplanation}
                >
                    {showExplanation ? "Analyze Complete ➔" : "Open All Alerts"}
                </NeonButton>
            ) : isTFGame ? (
                // True/False Game Button Logic
                tfState.isFinished && tfState.score >= (question.trueFalseGameConfig?.minScoreToPass || 0) ? (
                    <NeonButton 
                        variant="green"
                        onClick={handleNext}
                    >
                        {currentQuestionIdx === lesson.questions.length - 1 ? 'Finish Lesson' : 'Next Challenge'}
                    </NeonButton>
                ) : (
                    <div className="text-slate-500 text-xs uppercase tracking-widest self-center">
                        {tfState.isFinished ? "Retry to proceed" : "Awaiting Input..."}
                    </div>
                )
            ) : isDragGame ? (
                // Drag Drop Button
                showExplanation ? (
                    <NeonButton variant="green" onClick={handleNext}>
                         Complete Mission ➔
                    </NeonButton>
                ) : (
                    <div className="text-slate-500 text-xs uppercase tracking-widest self-center animate-pulse">
                         Sorting Data...
                    </div>
                )
            ) : isIdentGame ? (
                // Identifier Game Button
                identState.isFinished && identState.score >= (question.identifierGameConfig?.minScoreToPass || 0) ? (
                    <NeonButton variant="green" onClick={handleNext}>
                        System Secure ➔
                    </NeonButton>
                ) : (
                    <div className="text-slate-500 text-xs uppercase tracking-widest self-center">
                        {identState.isFinished ? "Retry Protocol" : "Scanning..."}
                    </div>
                )
            ) : isVarSimGame ? (
                // Variable Simulation Button
                showExplanation ? (
                    <NeonButton variant="green" onClick={handleNext}>
                        Concepts Assimilated ➔
                    </NeonButton>
                ) : (
                    <div className="text-slate-500 text-xs uppercase tracking-widest self-center">
                        Initializing Storage...
                    </div>
                )
            ) : isCodePuzzleGame ? (
                // Code Puzzle Button
                puzzleState.isFinished && puzzleState.score >= (question.codePuzzleConfig?.minScoreToPass || 0) ? (
                    <NeonButton variant="green" onClick={handleNext}>
                        Code Operational ➔
                    </NeonButton>
                ) : (
                    <div className="text-slate-500 text-xs uppercase tracking-widest self-center">
                         Awaiting Syntax Assembly...
                    </div>
                )
            ) : (
                // Quiz Logic
                !showExplanation ? (
                    <NeonButton 
                        onClick={handleCheck} 
                        disabled={selectedOption === null}
                    >
                        Check
                    </NeonButton>
                ) : (
                    <NeonButton 
                        variant={isCorrect ? "green" : "cyan"}
                        onClick={handleNext}
                    >
                        {currentQuestionIdx === lesson.questions.length - 1 && lesson.id !== 'java-quiz-8' ? 'Finish' : 'Continue'}
                    </NeonButton>
                )
            )}
        </div>

        {/* Explanation Toast (Hide for Games while playing, show on finish) */}
        {(showExplanation && (!isTFGame || tfState.isFinished) && (!isIdentGame || identState.isFinished) && (!isCodePuzzleGame || puzzleState.isFinished)) && (
            <div className={`mt-4 p-4 rounded-lg border animate-in slide-in-from-bottom-5 fade-in duration-300 ${isSimulation ? 'bg-slate-800/80 border-cyan-500/30' : (isCorrect ? 'bg-emerald-900/30 border-emerald-500/50' : 'bg-rose-900/30 border-rose-500/50')}`}>
                <h4 className={`font-bold mb-1 ${isSimulation ? 'text-cyan-400' : (isCorrect ? 'text-emerald-400' : 'text-rose-400')}`}>
                    {isSimulation ? 'System Message:' : (isCorrect ? 'Correct! System updated.' : 'Incorrect. Logic flaw detected.')}
                </h4>
                <p className="text-sm text-slate-300">
                    {question.explanation}
                </p>
            </div>
        )}
      </GlassCard>

      <AiTutorModal 
        isOpen={isAiOpen} 
        onClose={() => setIsAiOpen(false)} 
        context={`Context: ${isTFGame ? 'True/False Logic Game' : isDragGame ? 'Data Sorting Game' : isIdentGame ? 'Identifier Validation Game' : isVarSimGame ? 'Variable Simulation' : isCodePuzzleGame ? 'Code Puzzle' : question.type === 'simulation' ? 'Simulation Step' : isChecklist ? 'Checklist Task' : 'Quiz Question'}\nContent: ${question.text}\nCode: ${isSimulation ? userCode : question.codeSnippet}`}
      />
    </div>
  );
};