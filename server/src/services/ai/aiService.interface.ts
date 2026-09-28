export interface IdeaGenerationParams {
  domain?: string;
  skills?: string[];
  interests?: string[];
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | string;
  count?: number;
}

export interface GeneratedIdea {
  title: string;
  domain: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  problemStatement: string;
  solutionOverview: string;
  recommendedStack: string[];
  rolesNeeded: string[];
  estimatedDuration: string;
  tags: string[];
}

export interface TeammateMatchResult {
  userId: string;
  user: any;
  compatibilityScore: number;
  matchPercentage: number;
  matchHighlights: string[];
  whyMatches: string[];
  complementarySkills: string[];
  overlapSkills: string[];
  recommendedRole: string;
  isDismissed?: boolean;
}

export interface ArchitectureSynthesisRequest {
  title: string;
  objective: string;
  pattern?: string;
  model?: string;
  vectorDb?: string;
  capabilities?: string[];
}

export interface ArchitectureBlueprint {
  title: string;
  summary: string;
  pattern: string;
  model: string;
  vectorDb: string;
  systemPrompt: string;
  databaseSchema: string;
  agentTopology: {
    name: string;
    role: string;
    tools: string[];
  }[];
  roadmap: {
    phase: string;
    description: string;
  }[];
  metrics: {
    estimatedTokens: string;
    avgLatency: string;
    complexityScore: string;
    costEstimate: string;
  };
}

export interface ProjectHealthAssessment {
  healthScore: number;
  status: 'healthy' | 'at-risk' | 'critical';
  summary: string;
  recommendations: string[];
  velocityMetrics: {
    completedTasks: number;
    totalTasks: number;
    overdueTasks: number;
    completedMilestones: number;
    totalMilestones: number;
  };
}

export interface RubricEvaluationSuggestion {
  feedback: string;
  suggestedScores: {
    innovation: number;
    technicalExecution: number;
    documentation: number;
    teamwork: number;
    presentation: number;
  };
}

export interface ProjectIdeaMatch {
  ideaId: string;
  matchPercentage: number;
  matchReasons: string[];
  skillMatches: string[];
  interestMatches: string[];
}

export interface IAIService {
  generateProjectIdeas(params: IdeaGenerationParams): Promise<GeneratedIdea[]>;
  matchTeammates(currentStudent: any, candidates: any[], targetProjectOrDomain?: any): Promise<TeammateMatchResult[]>;
  synthesizeArchitecture(request: ArchitectureSynthesisRequest): Promise<ArchitectureBlueprint>;
  assessProjectHealth(project: any, tasks: any[], milestones: any[]): Promise<ProjectHealthAssessment>;
  generateRubricFeedback(milestone: any, project: any): Promise<RubricEvaluationSuggestion>;
  calculateIdeaMatch(student: any, idea: any, previousProjects?: any[]): ProjectIdeaMatch;
  recommendProjectIdeas(student: any, ideas: any[], previousProjects?: any[]): Promise<(any & { matchData: ProjectIdeaMatch })[]>;
}
