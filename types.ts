export type QuestionType = 'quiz' | 'simulation' | 'checklist' | 'interactive_cards' | 'true_false_game' | 'drag_drop_game' | 'identifier_validation_game' | 'variable_simulation' | 'code_puzzle';

export interface DataTypeCard {
  title: string;
  color: 'cyan' | 'fuchsia'; // for neon styling
  items: { label: string; desc: string }[];
}

export interface InteractiveCardData {
  id: string;
  title: string;
  badCode: string;
  goodCode: string;
  explanation: string;
}

export interface TrueFalseStatement {
  id: string;
  text: string;
  isCorrect: boolean; // Factually true or false
  explanation: string; // Shown after answering
}

export interface DragDropItem {
  id: string;
  content: string;
  type: string; // The correct type key (e.g., 'int')
}

export interface DragDropZone {
  id: string;
  type: string; // The type key this zone accepts
  label: string;
}

export interface IdentifierValidationItem {
  id: string;
  text: string;
  isValid: boolean;
  explanation: string;
}

export interface CodePuzzleItem {
  id: string;
  fragments: string[]; // The shuffled parts
  correctSequence: string[]; // The correct order strings
}

export interface Question {
  id: string;
  type?: QuestionType;
  text: string;
  codeSnippet?: string;
  xpReward?: number;
  
  // New: For rendering rich UI like cards/tables
  customContent?: {
    type: 'dataTypeCards';
    data: DataTypeCard[];
  };

  // For Checklist Type
  checklistItems?: string[];

  // For Interactive Cards (Common Mistakes)
  interactiveCards?: InteractiveCardData[];

  // For True/False Game
  trueFalseGameConfig?: {
    statements: TrueFalseStatement[];
    minScoreToPass: number;
    successMessage: string;
    failMessage: string;
  };

  // For Drag Drop Game
  dragDropConfig?: {
    items: DragDropItem[];
    zones: DragDropZone[];
    successMessage: string;
  };

  // For Identifier Validation Game
  identifierGameConfig?: {
    items: IdentifierValidationItem[];
    minScoreToPass: number;
    successMessage: string;
    failMessage: string;
  };

  // For Variable Simulation Game
  variableSimConfig?: {
    targetSuccesses: number;
    successMessage: string;
  };

  // For Code Puzzle Game
  codePuzzleConfig?: {
    puzzles: CodePuzzleItem[];
    minScoreToPass: number;
    successMessage: string;
    failMessage: string;
  };

  // Quiz specific
  options?: string[];
  correctAnswerIndex?: number;
  
  // Simulation specific
  simulationConfig?: {
    runButtonLabel: string;
    defaultCode: string; // The starting code
    // Logic for validating user input
    validation: {
      correctRegex?: string; // Optional if using requiredMatches
      requiredMatches?: string[]; // ALL patterns must be present
      successMessage: string;
      errorMessage: string; // Generic error
      
      // New: Array of specific error cases for better feedback
      errorMatchers?: {
        regex: string;
        message: string;
      }[];
    };
  };
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  questions: Question[];
}

export interface UserState {
  name: string;
  completedLessonIds: string[];
  xp: number;
  currentLessonIndex: number; // For map unlocking logic
  hasSeenIntro: boolean;
  hasSeenOutro?: boolean; // Track if they've seen the closing sequence
}

export interface AiChatMessage {
  role: 'user' | 'model';
  text: string;
}