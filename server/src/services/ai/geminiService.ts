import {
  IAIService,
  IdeaGenerationParams,
  GeneratedIdea,
  TeammateMatchResult,
  ArchitectureSynthesisRequest,
  ArchitectureBlueprint,
  ProjectHealthAssessment,
  RubricEvaluationSuggestion
} from './aiService.interface.js';
import { LocalEngineService } from './localEngineService.js';
import { ENV } from '../../config/env.js';

export class GeminiService implements IAIService {
  private fallback: LocalEngineService;

  constructor() {
    this.fallback = new LocalEngineService();
  }

  async generateProjectIdeas(params: IdeaGenerationParams): Promise<GeneratedIdea[]> {
    if (!ENV.GEMINI_API_KEY) {
      return this.fallback.generateProjectIdeas(params);
    }
    try {
      // In production, make actual call to Google Gemini endpoint
      // Using fallback if no custom prompt endpoint or network error
      return this.fallback.generateProjectIdeas(params);
    } catch {
      return this.fallback.generateProjectIdeas(params);
    }
  }

  async matchTeammates(currentStudent: any, candidates: any[], targetProjectOrDomain?: any): Promise<TeammateMatchResult[]> {
    return this.fallback.matchTeammates(currentStudent, candidates, targetProjectOrDomain);
  }

  async synthesizeArchitecture(request: ArchitectureSynthesisRequest): Promise<ArchitectureBlueprint> {
    return this.fallback.synthesizeArchitecture(request);
  }

  async assessProjectHealth(project: any, tasks: any[], milestones: any[]): Promise<ProjectHealthAssessment> {
    return this.fallback.assessProjectHealth(project, tasks, milestones);
  }

  async generateRubricFeedback(milestone: any, project: any): Promise<RubricEvaluationSuggestion> {
    return this.fallback.generateRubricFeedback(milestone, project);
  }

  calculateIdeaMatch(student: any, idea: any, previousProjects?: any[]) {
    return this.fallback.calculateIdeaMatch(student, idea, previousProjects);
  }

  async recommendProjectIdeas(student: any, ideas: any[], previousProjects?: any[]) {
    return this.fallback.recommendProjectIdeas(student, ideas, previousProjects);
  }
}
