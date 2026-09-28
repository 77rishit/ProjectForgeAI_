import {
  IAIService,
  IdeaGenerationParams,
  GeneratedIdea,
  TeammateMatchResult,
  ArchitectureSynthesisRequest,
  ArchitectureBlueprint,
  ProjectHealthAssessment,
  RubricEvaluationSuggestion,
  ProjectIdeaMatch
} from './aiService.interface.js';

export class LocalEngineService implements IAIService {
  async generateProjectIdeas(params: IdeaGenerationParams): Promise<GeneratedIdea[]> {
    const domain = params.domain || 'AI / Machine Learning';
    const skills = params.skills || [];
    const difficulty = (params.difficulty as 'Beginner' | 'Intermediate' | 'Advanced') || 'Intermediate';

    const knowledgeBank: Record<string, GeneratedIdea[]> = {
      'AI / Education': [
        {
          title: 'ProjectForge AI',
          domain: 'AI / Education',
          difficulty: 'Advanced',
          problemStatement: 'Students often struggle to find relevant project ideas, complementary teammates, and structured tracking tools for their capstones.',
          solutionOverview: 'An AI-powered project lifecycle platform that helps students discover project ideas, find teammates, and manage their projects.',
          recommendedStack: ['React', 'Node.js', 'MongoDB', 'AI'],
          rolesNeeded: ['Lead Developer', 'UI/UX Designer', 'Backend Engineer'],
          estimatedDuration: '12-16 weeks',
          tags: ['React', 'Node.js', 'MongoDB', 'AI']
        },
        {
          title: 'Smart Campus Assistant',
          domain: 'AI / Education',
          difficulty: 'Intermediate',
          problemStatement: 'Navigating college schedules, exam routines, club notifications, and departmental resources across fragmented portals is overwhelming.',
          solutionOverview: 'An AI assistant that helps students find college information, events, departments, and campus resources with conversational search.',
          recommendedStack: ['React', 'Node.js', 'AI', 'MongoDB'],
          rolesNeeded: ['AI Engineer', 'Frontend Developer', 'API Developer'],
          estimatedDuration: '8-10 weeks',
          tags: ['React', 'Node.js', 'AI', 'Education']
        },
        {
          title: 'Peer Tutoring Network',
          domain: 'AI / Education',
          difficulty: 'Beginner',
          problemStatement: 'Juniors seeking coursework help struggle to find seniors who excelled in those specific subjects.',
          solutionOverview: 'A peer-to-peer tutoring board matching student mentors with learners for exam prep and lab guidance.',
          recommendedStack: ['React', 'Node.js', 'MongoDB'],
          rolesNeeded: ['Full-Stack Developer', 'UI/UX Designer'],
          estimatedDuration: '6-8 weeks',
          tags: ['React', 'Node.js', 'Education']
        }
      ],
      'Web Development': [
        {
          title: 'Hostel Complaint Management',
          domain: 'Web Development',
          difficulty: 'Intermediate',
          problemStatement: 'Hostel maintenance requests (plumbing, electrical, Wi-Fi) get lost in paper registers with zero status visibility.',
          solutionOverview: 'A web platform for students to submit, track, and resolve hostel maintenance complaints with real-time status updates.',
          recommendedStack: ['React', 'Express', 'MongoDB', 'Tailwind CSS'],
          rolesNeeded: ['Full-Stack Developer', 'UI Designer'],
          estimatedDuration: '6-8 weeks',
          tags: ['React', 'Express', 'MongoDB', 'Web Development']
        },
        {
          title: 'Campus Event Hub',
          domain: 'Web Development',
          difficulty: 'Beginner',
          problemStatement: 'College clubs struggle to publicize technical workshops, cultural fests, and hackathons effectively across campus.',
          solutionOverview: 'A centralized platform where students can discover, register for, and manage college events with calendar integration.',
          recommendedStack: ['React', 'Node.js', 'MongoDB'],
          rolesNeeded: ['Frontend Developer', 'Backend Developer'],
          estimatedDuration: '4-6 weeks',
          tags: ['React', 'Node.js', 'MongoDB', 'Events']
        },
        {
          title: 'Campus Lost and Found Portal',
          domain: 'Web Development',
          difficulty: 'Beginner',
          problemStatement: 'Lost student IDs, water bottles, and electronics clutter security desks with no easy way to claim them.',
          solutionOverview: 'A student portal with photo uploads and verification questions to quickly return lost items on campus.',
          recommendedStack: ['React', 'Express', 'MongoDB'],
          rolesNeeded: ['Frontend Developer'],
          estimatedDuration: '4-6 weeks',
          tags: ['React', 'Express', 'Campus']
        }
      ],
      'AI / Career': [
        {
          title: 'AI Resume Builder',
          domain: 'AI / Career',
          difficulty: 'Intermediate',
          problemStatement: 'College students struggle to format resumes according to industry standards and pass Automated Tracking Systems (ATS).',
          solutionOverview: 'An AI-powered resume builder that helps students create ATS-friendly resumes with tailored action-verb suggestions.',
          recommendedStack: ['React', 'Node.js', 'AI', 'Tailwind CSS'],
          rolesNeeded: ['Frontend Engineer', 'NLP / AI Developer'],
          estimatedDuration: '6-8 weeks',
          tags: ['React', 'Node.js', 'AI', 'Career']
        }
      ],
      'Finance / Productivity': [
        {
          title: 'Student Expense Tracker',
          domain: 'Finance / Productivity',
          difficulty: 'Beginner',
          problemStatement: 'College students on monthly allowances frequently run out of funds without understanding their spending breakdown.',
          solutionOverview: 'A simple application for students to track expenses, set budgets, and visualize monthly spending categories.',
          recommendedStack: ['React', 'Node.js', 'MongoDB'],
          rolesNeeded: ['Full-Stack Developer'],
          estimatedDuration: '4-6 weeks',
          tags: ['React', 'Node.js', 'MongoDB', 'Finance']
        }
      ]
    };

    const ideas = knowledgeBank[domain] || knowledgeBank['AI / Education'];
    
    // Customize tags or problem statement if specific student skills are provided
    return ideas.map(idea => ({
      ...idea,
      tags: Array.from(new Set([...idea.tags, ...skills.slice(0, 2)]))
    }));
  }

  async matchTeammates(currentStudent: any, candidates: any[], targetProjectOrDomain?: any): Promise<TeammateMatchResult[]> {
    const studentSkills = new Set((currentStudent.skills || []).map((s: string) => String(s).toLowerCase()));
    const studentInterests = new Set((currentStudent.interests || []).map((i: string) => String(i).toLowerCase()));
    const studentDept = currentStudent.department || '';

    // Functional skill classification domains
    const SKILL_DOMAINS: Record<string, string[]> = {
      'Frontend & UI/UX': ['react', 'vue', 'angular', 'svelte', 'tailwind', 'tailwind css', 'css', 'html', 'next.js', 'figma', 'ui/ux design', 'motion graphics', 'user research', 'frontend'],
      'Backend & Systems': ['node.js', 'express', 'go', 'golang', 'python', 'django', 'fastapi', 'spring', 'java', 'c++', 'rust', 'grpc', 'redis', 'microservices', 'backend'],
      'Databases & Storage': ['postgresql', 'mongodb', 'mysql', 'timescaledb', 'cassandra', 'sql', 'database'],
      'Cloud & DevOps': ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd', 'terraform', 'linux', 'devops'],
      'AI / ML & Data Science': ['pytorch', 'tensorflow', 'hugging face', 'nlp', 'transformers', 'scikit-learn', 'pandas', 'generative ai', 'computer vision', 'tinyml', 'machine learning', 'data science', 'ai'],
      'Embedded & IoT': ['embedded systems', 'iot', 'mqtt', 'freertos', 'circuit design', 'arduino', 'esp32', 'c++', 'hardware'],
      'Security & Cryptography': ['cryptography', 'snarkjs', 'solidity', 'network security', 'penetration testing', 'zero-knowledge', 'cybersecurity']
    };

    // Determine current student's primary domains
    const studentDomains = new Set<string>();
    for (const [domainName, domainKeywords] of Object.entries(SKILL_DOMAINS)) {
      if (domainKeywords.some((kw) => Array.from(studentSkills).some((sk) => sk.includes(kw) || kw.includes(sk)))) {
        studentDomains.add(domainName);
      }
    }

    // Extract project requirements if target project is provided
    const projectReqSkills: string[] = [];
    if (targetProjectOrDomain && typeof targetProjectOrDomain === 'object') {
      const pSkills = targetProjectOrDomain.requiredSkills || targetProjectOrDomain.technologies || [];
      projectReqSkills.push(...pSkills.map((s: string) => s.toLowerCase()));
    }

    const dismissedIds = new Set((currentStudent.dismissedRecommendations || []).map((id: any) => id.toString()));

    return candidates
      .filter((candidate) => candidate._id.toString() !== currentStudent._id.toString())
      .map((candidate) => {
        const candSkills = (candidate.skills || []).map((s: string) => String(s).toLowerCase());
        const candInterests = (candidate.interests || []).map((i: string) => String(i).toLowerCase());
        const candDept = candidate.department || '';
        const candAvail = Number(candidate.availabilityHours || candidate.availability || 15);

        // Separate skills into overlap vs complementary
        const overlapSkills: string[] = [];
        const complementarySkills: string[] = [];

        (candidate.skills || []).forEach((origSkill: string) => {
          const lower = origSkill.toLowerCase();
          if (Array.from(studentSkills).some((sk) => sk === lower || lower.includes(sk) || sk.includes(lower))) {
            overlapSkills.push(origSkill);
          } else {
            complementarySkills.push(origSkill);
          }
        });

        // Determine candidate's primary domains
        const candDomains = new Set<string>();
        for (const [domainName, domainKeywords] of Object.entries(SKILL_DOMAINS)) {
          if (domainKeywords.some((kw) => candSkills.some((sk) => sk.includes(kw) || kw.includes(sk)))) {
            candDomains.add(domainName);
          }
        }

        // 1. Complementary Skill Scoring & Explanations
        const whyMatches: string[] = [];
        let score = 52; // baseline

        // Distinct complementary domains that candidate brings
        const newDomains = Array.from(candDomains).filter((d) => !studentDomains.has(d));
        if (newDomains.length > 0) {
          score += Math.min(newDomains.length * 9, 25);
          if (studentDomains.has('Frontend & UI/UX') && (candDomains.has('Backend & Systems') || candDomains.has('Databases & Storage'))) {
            const specificTechs = candidate.skills.filter((s: string) =>
              SKILL_DOMAINS['Backend & Systems'].concat(SKILL_DOMAINS['Databases & Storage']).some((kw) => s.toLowerCase().includes(kw))
            );
            whyMatches.push(`Brings complementary Backend & Database (${specificTechs.slice(0, 3).join(', ')}) to balance your Frontend focus`);
          } else if (studentDomains.has('Backend & Systems') && candDomains.has('Frontend & UI/UX')) {
            const specificTechs = candidate.skills.filter((s: string) =>
              SKILL_DOMAINS['Frontend & UI/UX'].some((kw) => s.toLowerCase().includes(kw))
            );
            whyMatches.push(`Brings complementary UI/UX Design & Frontend (${specificTechs.slice(0, 3).join(', ')}) to deliver polished user interfaces`);
          } else if (candDomains.has('AI / ML & Data Science')) {
            const specificTechs = candidate.skills.filter((s: string) =>
              SKILL_DOMAINS['AI / ML & Data Science'].some((kw) => s.toLowerCase().includes(kw))
            );
            whyMatches.push(`Adds specialized Machine Learning & Data modeling expertise (${specificTechs.slice(0, 3).join(', ')})`);
          } else if (candDomains.has('Cloud & DevOps')) {
            const specificTechs = candidate.skills.filter((s: string) =>
              SKILL_DOMAINS['Cloud & DevOps'].some((kw) => s.toLowerCase().includes(kw))
            );
            whyMatches.push(`Provides containerization & Cloud infrastructure (${specificTechs.slice(0, 3).join(', ')}) for seamless deployment`);
          } else if (candDomains.has('Embedded & IoT')) {
            const specificTechs = candidate.skills.filter((s: string) =>
              SKILL_DOMAINS['Embedded & IoT'].some((kw) => s.toLowerCase().includes(kw))
            );
            whyMatches.push(`Brings hardware interfacing & Embedded IoT (${specificTechs.slice(0, 3).join(', ')}) to bridge digital and physical`);
          } else if (candDomains.has('Security & Cryptography')) {
            const specificTechs = candidate.skills.filter((s: string) =>
              SKILL_DOMAINS['Security & Cryptography'].some((kw) => s.toLowerCase().includes(kw))
            );
            whyMatches.push(`Hardens system resilience with Cryptography & Security expertise (${specificTechs.slice(0, 3).join(', ')})`);
          } else {
            whyMatches.push(`Complements your skillset with ${newDomains[0]} expertise (${complementarySkills.slice(0, 3).join(', ')})`);
          }
        } else if (complementarySkills.length > 0) {
          score += 14;
          whyMatches.push(`Expands squad coverage with complementary expertise in ${complementarySkills.slice(0, 3).join(', ')}`);
        }

        // Shared baseline toolchain overlap
        if (overlapSkills.length > 0) {
          score += 6;
        }

        // 2. Shared Interests
        const sharedInterests = (candidate.interests || []).filter((interest: string) =>
          studentInterests.has(interest.toLowerCase())
        );
        if (sharedInterests.length > 0) {
          score += Math.min(sharedInterests.length * 5, 12);
          whyMatches.push(`Shared passion for ${sharedInterests.slice(0, 2).join(' & ')}`);
        }

        // 3. Project Requirements (if provided)
        if (projectReqSkills.length > 0) {
          const filledReqs = candSkills.filter((sk: string) =>
            projectReqSkills.some((req) => req.includes(sk) || sk.includes(req)) &&
            !Array.from(studentSkills).some((mySk) => mySk.includes(sk) || sk.includes(mySk))
          );
          if (filledReqs.length > 0) {
            score += Math.min(filledReqs.length * 6, 14);
            const origFilled = candidate.skills.filter((s: string) => filledReqs.includes(s.toLowerCase()));
            whyMatches.push(`Fills critical project requirements: ${origFilled.slice(0, 3).join(', ')}`);
          }
        }

        // 4. Department Compatibility
        if (candDept !== studentDept && candDept) {
          score += 8;
          if (candDept.includes('Design') && studentDept.includes('Computer Science')) {
            whyMatches.push(`High-synergy cross-disciplinary pair: Technical Architecture + User Experience Design`);
          } else if (candDept.includes('Data Science') && studentDept.includes('Computer Science')) {
            whyMatches.push(`Interdisciplinary synergy: Distributed Systems + Data Science Intelligence`);
          } else if (candDept.includes('Electrical') && studentDept.includes('Computer Science')) {
            whyMatches.push(`Interdisciplinary synergy: Software engineering paired with Embedded hardware systems`);
          } else if (candDept.includes('Cybersecurity') && studentDept.includes('Computer Science')) {
            whyMatches.push(`Enterprise-grade pairing: Full-Stack development paired with zero-trust security`);
          } else {
            whyMatches.push(`Interdisciplinary synergy: ${candDept} + ${studentDept}`);
          }
        } else if (candDept === studentDept && candDept) {
          score += 5;
          whyMatches.push(`Curriculum alignment in ${studentDept} with synchronized academic timelines`);
        }

        // 5. Availability Alignment
        if (candAvail >= 15) {
          score += 6;
          whyMatches.push(`High weekly availability (${candAvail} hrs/week) committed to sprint deliverables`);
        } else if (candAvail >= 10) {
          score += 3;
          whyMatches.push(`Dedicated bandwidth (${candAvail} hrs/week) for steady milestone progress`);
        }

        // 6. Experience & Semester Alignment
        const candSemester = String(candidate.semester || 'Semester 6');
        score += 4;
        if (whyMatches.length < 3) {
          whyMatches.push(`Suitable for ${candSemester} project cycle with demonstrated ${candidate.experience || 'Intermediate'} proficiency`);
        }

        // Final score calibration (65% to 98%)
        const finalScore = Math.min(Math.max(score, 65), 98);

        return {
          userId: candidate._id.toString(),
          user: candidate,
          compatibilityScore: finalScore,
          matchPercentage: finalScore,
          matchHighlights: whyMatches,
          whyMatches,
          complementarySkills: complementarySkills.slice(0, 6),
          overlapSkills: overlapSkills.slice(0, 4),
          recommendedRole: candidate.preferredRole || 'Technical Collaborator',
          isDismissed: dismissedIds.has(candidate._id.toString())
        };
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }

  async synthesizeArchitecture(request: ArchitectureSynthesisRequest): Promise<ArchitectureBlueprint> {
    const title = request.title || 'Enterprise AI Application';
    const objective = request.objective || 'A production-grade scalable application system.';
    const model = request.model || 'Claude 3.7 Sonnet (Thinking)';
    const pattern = request.pattern || 'Plan-and-Execute + ReAct';
    const vectorDb = request.vectorDb || 'pgvector (Hybrid Search)';

    return {
      title,
      summary: `Production-ready blueprint for "${title}". Engineered around ${pattern} architecture with ${model} and ${vectorDb} persistence to fulfill the objective: ${objective.slice(0, 140)}...`,
      pattern,
      model,
      vectorDb,
      systemPrompt: `You are the core intelligence orchestrator for "${title}".
OPERATIONAL OBJECTIVES:
1. Deconstruct incoming user requests into deterministic task graphs.
2. Adhere to zero-trust privilege boundaries for all external tool executions.
3. Validate all intermediary outputs with schema conformity checks.
4. Provide structured, explainable rationales and execution traces for every lifecycle phase.`,
      databaseSchema: `-- Core Relational & Vector Persistence DDL
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  node_type VARCHAR(64) NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  vector vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);`,
      agentTopology: [
        {
          name: 'Task Orchestrator',
          role: 'Deconstructs high-level objectives into dependency DAGs and schedules agent sub-tasks',
          tools: ['GraphScheduler', 'ContextAggregator']
        },
        {
          name: 'Domain Synthesizer',
          role: 'Executes core technical logic, code generation, and domain-specific analysis',
          tools: ['CodeSandbox', 'QueryEngine']
        },
        {
          name: 'Quality Critic & Evaluator',
          role: 'Performs static analysis, schema validation, and security regression checks',
          tools: ['StaticLinter', 'SecurityScanner']
        }
      ],
      roadmap: [
        {
          phase: 'Phase 1: Architecture & Data Modeling',
          description: 'Define relational/vector schemas, set up CI/CD environment, and establish base API contracts.'
        },
        {
          phase: 'Phase 2: Core Engine & Agent Pipeline',
          description: 'Implement primary business logic, tool harnesses, and integrate vector retrieval pipeline.'
        },
        {
          phase: 'Phase 3: Security & Verification Loop',
          description: 'Deploy automated test suites, authentication fences, and rate-limiting safeguards.'
        },
        {
          phase: 'Phase 4: Telemetry & Production Hardening',
          description: 'Conduct stress testing, configure OpenTelemetry traces, and polish end-user interfaces.'
        }
      ],
      metrics: {
        estimatedTokens: '~3.8k tokens / execution',
        avgLatency: '1.2s end-to-end',
        complexityScore: 'Moderate-High',
        costEstimate: '$0.012 / query cycle'
      }
    };
  }

  async assessProjectHealth(project: any, tasks: any[], milestones: any[]): Promise<ProjectHealthAssessment> {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t: any) => t.status === 'done').length;
    const overdueTasks = tasks.filter((t: any) => {
      return t.status !== 'done' && t.dueDate && new Date(t.dueDate) < new Date();
    }).length;

    const totalMilestones = milestones.length;
    const completedMilestones = milestones.filter((m: any) => m.status === 'approved').length;

    let score = 90;
    const recommendations: string[] = [];

    // Deduct for overdue tasks
    if (overdueTasks > 0) {
      score -= Math.min(overdueTasks * 10, 30);
      recommendations.push(`${overdueTasks} task(s) are past their target deadline. Reassign or adjust sprint scope.`);
    }

    // Task completion velocity
    if (totalTasks > 0) {
      const taskRatio = completedTasks / totalTasks;
      if (taskRatio < 0.25 && totalTasks >= 4) {
        score -= 15;
        recommendations.push('Task completion velocity is low relative to active sprint items.');
      } else if (taskRatio >= 0.7) {
        score += 5;
      }
    } else {
      recommendations.push('No tasks have been logged yet. Create milestones and break them down into actionable tasks.');
    }

    // Milestone status check
    const pendingReviews = milestones.filter((m: any) => m.status === 'submitted').length;
    if (pendingReviews > 0) {
      recommendations.push(`${pendingReviews} milestone(s) awaiting faculty mentor review.`);
    }

    // Faculty mentor check
    if (!project.facultyMentor) {
      score -= 10;
      recommendations.push('Project does not have an assigned faculty mentor yet. Request a mentor to unlock formal evaluation.');
    }

    score = Math.max(Math.min(score, 100), 20);

    let status: 'healthy' | 'at-risk' | 'critical' = 'healthy';
    if (score < 60) {
      status = 'critical';
    } else if (score < 80) {
      status = 'at-risk';
    }

    const summary = status === 'healthy'
      ? `Project "${project.title}" is progressing smoothly with balanced velocity (${completedTasks}/${totalTasks} tasks complete).`
      : status === 'at-risk'
      ? `Project "${project.title}" has potential bottlenecks needing team coordination or deadline revisions.`
      : `Project "${project.title}" requires immediate faculty intervention due to overdue milestones and stalled progress.`;

    return {
      healthScore: score,
      status,
      summary,
      recommendations: recommendations.length > 0 ? recommendations : ['All sprint indicators are green. Maintain current delivery pace.'],
      velocityMetrics: {
        completedTasks,
        totalTasks,
        overdueTasks,
        completedMilestones,
        totalMilestones
      }
    };
  }

  async generateRubricFeedback(milestone: any, _project: any): Promise<RubricEvaluationSuggestion> {
    const title = milestone.title || 'Sprint Deliverable';
    return {
      feedback: `The submission for "${title}" demonstrates solid engineering rigor and clear architectural decomposition. Deliverables are documented with working demo artifacts. To achieve full marks in technical execution, recommend expanding edge-case unit test coverage and documenting API error fallback states.`,
      suggestedScores: {
        innovation: 4,
        technicalExecution: 4,
        documentation: 5,
        teamwork: 4,
        presentation: 4
      }
    };
  }

  calculateIdeaMatch(student: any, idea: any, previousProjects: any[] = []): ProjectIdeaMatch {
    const studentSkills: string[] = (student?.skills || []).map((s: string) => String(s).toLowerCase());
    const studentInterests: string[] = (student?.interests || []).map((i: string) => String(i).toLowerCase());
    const studentDept = student?.department || '';
    const studentSemester = String(student?.semester || '');

    const ideaSkills: string[] = (idea.requiredSkills || []).map((s: string) => String(s).toLowerCase());
    const ideaTechs: string[] = (idea.technologies || []).map((t: string) => String(t).toLowerCase());
    const ideaCategory = String(idea.category || idea.domain || '').toLowerCase();
    const ideaTags: string[] = (idea.tags || []).map((t: string) => String(t).toLowerCase());

    const reasons: string[] = [];
    const skillMatches: string[] = [];
    const interestMatches: string[] = [];

    // 1. Skill analysis (Matches your React skill, Matches your Python skill, etc.)
    const allIdeaSkillsAndTechs = Array.from(new Set([...ideaSkills, ...ideaTechs]));
    (student?.skills || []).forEach((sk: string) => {
      const lower = String(sk).toLowerCase();
      if (allIdeaSkillsAndTechs.some((req) => req.includes(lower) || lower.includes(req))) {
        skillMatches.push(sk);
        reasons.push(`Matches your ${sk} skill`);
      }
    });

    // 2. Interest analysis (Matches your AI interest, etc.)
    (student?.interests || []).forEach((interest: string) => {
      const lower = String(interest).toLowerCase();
      if (
        ideaCategory.includes(lower) ||
        lower.includes(ideaCategory) ||
        ideaTags.some((tag) => tag.includes(lower) || lower.includes(tag)) ||
        String(idea.title || '').toLowerCase().includes(lower) ||
        String(idea.description || '').toLowerCase().includes(lower)
      ) {
        interestMatches.push(interest);
        reasons.push(`Matches your ${interest} interest`);
      }
    });

    // 3. Department alignment
    let deptScore = 0;
    if (idea.department && studentDept) {
      if (
        idea.department.toLowerCase().includes(studentDept.toLowerCase()) ||
        studentDept.toLowerCase().includes(idea.department.toLowerCase())
      ) {
        deptScore = 15;
        reasons.push(`Aligns with your ${studentDept} department`);
      } else {
        deptScore = 8;
      }
    } else {
      deptScore = 10;
    }

    // 4. Semester fit & difficulty calibration (Suitable for your semester)
    let semesterScore = 0;
    const diff = idea.difficulty || 'Intermediate';
    const isSenior =
      studentSemester.includes('7') ||
      studentSemester.includes('8') ||
      studentSemester.toLowerCase().includes('senior') ||
      studentSemester.toLowerCase().includes('graduate');
    const isJunior =
      studentSemester.includes('5') ||
      studentSemester.includes('6') ||
      studentSemester.toLowerCase().includes('junior');

    if (isSenior) {
      if (diff === 'Advanced') {
        semesterScore = 15;
        reasons.push(`Suitable for your senior capstone level (${studentSemester})`);
      } else if (diff === 'Intermediate') {
        semesterScore = 12;
        reasons.push(`Suitable for your ${studentSemester}`);
      } else {
        semesterScore = 8;
      }
    } else if (isJunior) {
      if (diff === 'Intermediate' || diff === 'Advanced') {
        semesterScore = 15;
        reasons.push(`Suitable for your ${studentSemester}`);
      } else {
        semesterScore = 10;
      }
    } else {
      // Freshman / Sophomore
      if (diff === 'Beginner' || diff === 'Intermediate') {
        semesterScore = 15;
        reasons.push(`Suitable for your ${studentSemester || 'semester'}`);
      } else {
        semesterScore = 8;
      }
    }

    // 5. Previous project experience continuity
    let prevProjectScore = 0;
    if (previousProjects && previousProjects.length > 0) {
      const prevTechs = previousProjects
        .flatMap((p: any) => p.technologies || [])
        .map((t: string) => String(t).toLowerCase());
      const overlappingPrevTech = (idea.technologies || []).filter((t: string) =>
        prevTechs.includes(String(t).toLowerCase())
      );
      if (overlappingPrevTech.length > 0) {
        prevProjectScore = 10;
        reasons.push(`Builds on your previous project experience with ${overlappingPrevTech[0]}`);
      } else {
        prevProjectScore = 6;
        reasons.push(`Expands your portfolio into ${idea.category || 'new specialized tech'}`);
      }
    } else {
      prevProjectScore = 8;
    }

    // Weighted calculations
    const skillRatio =
      allIdeaSkillsAndTechs.length > 0
        ? skillMatches.length / Math.min(allIdeaSkillsAndTechs.length, 3)
        : 0.5;
    const skillScore = Math.min(skillRatio * 35, 35);

    const interestRatio =
      (student?.interests || []).length > 0
        ? interestMatches.length / Math.min((student.interests || []).length, 2)
        : 0.5;
    const interestScore = Math.min(interestRatio * 25, 25);

    const rawScore = Math.round(skillScore + interestScore + deptScore + semesterScore + prevProjectScore);
    const matchPercentage = Math.min(Math.max(rawScore, 45), 98);

    // Fallback explanations if sparse
    if (reasons.length === 0) {
      if (skillMatches.length > 0) reasons.push(`Matches your ${skillMatches[0]} skill`);
      if (studentDept) reasons.push(`Relevant to ${studentDept}`);
      reasons.push(`Suitable for your semester`);
    }

    return {
      ideaId: idea._id ? idea._id.toString() : '',
      matchPercentage,
      matchReasons: Array.from(new Set(reasons)),
      skillMatches,
      interestMatches
    };
  }

  async recommendProjectIdeas(
    student: any,
    ideas: any[],
    previousProjects: any[] = []
  ): Promise<(any & { matchData: ProjectIdeaMatch })[]> {
    const results = ideas.map((idea) => {
      const matchData = this.calculateIdeaMatch(student, idea, previousProjects);
      const ideaObj = idea.toObject ? idea.toObject() : { ...idea };
      return {
        ...ideaObj,
        matchPercentage: matchData.matchPercentage,
        matchReasons: matchData.matchReasons,
        matchData
      };
    });

    // Rank descending by matchPercentage
    return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
}
