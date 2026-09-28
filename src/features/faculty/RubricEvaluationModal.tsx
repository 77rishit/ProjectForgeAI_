import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { milestoneService } from '../../services/milestoneService';
import { Milestone, RubricScores } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { Award, Sparkles, Star, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';

interface RubricEvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: Milestone;
  onReviewed?: () => void;
}

export const RubricEvaluationModal: React.FC<RubricEvaluationModalProps> = ({
  isOpen,
  onClose,
  milestone,
  onReviewed
}) => {
  const toast = useToast();

  const [scores, setScores] = useState<RubricScores>({
    innovation: 4,
    technicalExecution: 4,
    documentation: 4,
    teamwork: 4,
    presentation: 4
  });
  const [feedback, setFeedback] = useState(
    'Strong execution on technical deliverables. Artifacts show clear architectural rigor.'
  );
  const [approved, setApproved] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState(false);

  const overall = Math.round(
    ((scores.innovation + scores.technicalExecution + scores.documentation + scores.teamwork + scores.presentation) / 25) * 100
  );

  const handleScoreChange = (field: keyof RubricScores, value: number) => {
    setScores((prev) => ({ ...prev, [field]: value }));
  };

  const handleAISuggest = async () => {
    setAiSuggesting(true);
    try {
      const res = await milestoneService.getRubricSuggestion(milestone._id);
      if (res.suggestion) {
        setScores(res.suggestion.suggestedScores);
        setFeedback(res.suggestion.feedback);
        toast.success('AI evaluated milestone and populated rubric recommendations!');
      }
    } catch (err: any) {
      toast.error(err.message || 'Error fetching AI rubric suggestion');
    } finally {
      setAiSuggesting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await milestoneService.reviewMilestone(milestone._id, {
        feedback,
        rubricScores: scores,
        approved
      });

      toast.success(approved ? 'Milestone approved and graded!' : 'Revision requested from team.');
      onClose();
      if (onReviewed) onReviewed();
    } catch (err: any) {
      toast.error(err.message || 'Error submitting review');
    } finally {
      setSubmitting(false);
    }
  };

  const rubricFields: { key: keyof RubricScores; label: string; desc: string }[] = [
    { key: 'innovation', label: '1. Innovation & Novelty', desc: 'Concept originality and creativity' },
    { key: 'technicalExecution', label: '2. Technical Execution', desc: 'Code architecture and robustness' },
    { key: 'documentation', label: '3. Documentation & Schemas', desc: 'SRS, comments, and API contracts' },
    { key: 'teamwork', label: '4. Teamwork & Velocity', desc: 'Sprint task distribution and progress' },
    { key: 'presentation', label: '5. Presentation & Demo', desc: 'Clarity of proof-of-concept' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-purple-400" />
          <span>Capstone Milestone Rubric Evaluation</span>
        </div>
      }
      description={`Grading submission for: ${milestone.title}`}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Student submission recap */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs flex flex-col gap-1.5">
          <div className="font-bold text-white">Student Submission Notes:</div>
          <p className="text-white/70 italic">
            "{milestone.submissionNotes || 'No notes provided by student.'}"
          </p>
          {milestone.submissionUrl && (
            <a
              href={milestone.submissionUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-mono mt-1"
            >
              <span>{milestone.submissionUrl}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>

        {/* AI Rubric Assist Button */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/30 border border-purple-500/30">
          <div>
            <div className="text-xs font-bold text-purple-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI Grading Assistant</span>
            </div>
            <div className="text-[11px] text-white/50">Auto-evaluates against capstone grading rubrics</div>
          </div>
          <Button
            type="button"
            onClick={handleAISuggest}
            variant="secondary"
            size="sm"
            loading={aiSuggesting}
          >
            Suggest Scores
          </Button>
        </div>

        {/* Rubric Score Sliders/Stars */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider">Evaluation Dimensions</span>
            <span className="font-mono font-bold text-purple-300 text-sm">
              Cumulative: {overall}%
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {rubricFields.map((field) => (
              <div
                key={field.key}
                className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 text-xs"
              >
                <div>
                  <div className="font-bold text-white">{field.label}</div>
                  <div className="text-[11px] text-white/40">{field.desc}</div>
                </div>

                {/* 1-5 Star Picker */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleScoreChange(field.key, star)}
                      className="p-1 text-white/30 hover:text-amber-400 transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          scores[field.key] >= star ? 'fill-amber-400 text-amber-400' : ''
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-mono text-white/60 ml-2 font-bold w-4 text-center">
                    {scores[field.key]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Written Feedback Textarea */}
        <div className="w-full flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-white/80 uppercase tracking-wider">
            Constructive Faculty Feedback
          </label>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#090c17]/80 p-3 text-sm text-white placeholder-white/30 outline-none focus:border-indigo-500"
            required
          />
        </div>

        {/* Approval Decision */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
              <input
                type="radio"
                name="decision"
                checked={approved}
                onChange={() => setApproved(true)}
                className="text-indigo-600"
              />
              <span className="font-bold text-emerald-400">Approve Milestone</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
              <input
                type="radio"
                name="decision"
                checked={!approved}
                onChange={() => setApproved(false)}
                className="text-indigo-600"
              />
              <span className="font-bold text-amber-400">Request Revisions</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" onClick={onClose} variant="ghost" size="md">
              Cancel
            </Button>
            <Button type="submit" variant="glow" size="md" loading={submitting}>
              Submit Evaluation
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
