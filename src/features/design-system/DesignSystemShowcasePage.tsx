import React, { useState } from 'react';
import {
  PageHeader,
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Avatar,
  AvatarGroup,
  ProgressBar,
  ProgressRing,
  AreaChart,
  BarChart,
  DonutChart,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Tabs,
  Dialog,
  DialogContent,
  DialogFooter,
  Drawer,
  Dropdown,
  ConfirmationDialog,
  EmptyState,
  Skeleton,
  SkeletonCard,
  SkeletonTable,
  SkeletonAvatar
} from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import {
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Info,
  Trash2,
  Search,
  Code2,
  FolderKanban,
  Edit,
  Eye
} from 'lucide-react';

export const DesignSystemShowcasePage: React.FC = () => {
  const toast = useToast();

  // Interactive states
  const [btnLoading, setBtnLoading] = useState(false);
  const [progressVal, setProgressVal] = useState(72);
  const [activeTab, setActiveTab] = useState('components');
  const [activeTabStyle, setActiveTabStyle] = useState<'pill' | 'segmented' | 'underline'>('pill');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerPosition, setDrawerPosition] = useState<'right' | 'left' | 'bottom'>('right');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Sample data for charts
  const areaData = [
    { label: 'Mon', value: 24 },
    { label: 'Tue', value: 40 },
    { label: 'Wed', value: 35 },
    { label: 'Thu', value: 65 },
    { label: 'Fri', value: 58 },
    { label: 'Sat', value: 85 },
    { label: 'Sun', value: 92 }
  ];

  const barData = [
    { label: 'AI/ML', value: 84, color: '#6366f1' },
    { label: 'Web3', value: 42, color: '#a855f7' },
    { label: 'Cloud', value: 68, color: '#06b6d4' },
    { label: 'IoT', value: 52, color: '#10b981' },
    { label: 'Cyber', value: 76, color: '#f59e0b' }
  ];

  const donutData = [
    { label: 'Completed', value: 45, color: '#10b981' },
    { label: 'In Progress', value: 35, color: '#6366f1' },
    { label: 'Under Review', value: 20, color: '#06b6d4' }
  ];

  const tableData = [
    { id: 'PRJ-101', name: 'Neuromorphic Edge Vision', lead: 'Sarah Chen', status: 'Active', progress: 85, badge: 'success' as const },
    { id: 'PRJ-102', name: 'Zero-Knowledge Credential Hub', lead: 'Alex Vance', status: 'In Review', progress: 62, badge: 'cyan' as const },
    { id: 'PRJ-103', name: 'Autonomous Rover Telemetry', lead: 'Elena Rostova', status: 'Planning', progress: 34, badge: 'warning' as const },
    { id: 'PRJ-104', name: 'Quantum Key Distribution Sim', lead: 'Marcus Brody', status: 'Completed', progress: 100, badge: 'purple' as const }
  ];

  const dummyUsers = [
    { name: 'Sarah Chen' },
    { name: 'Alex Vance' },
    { name: 'Marcus Brody' },
    { name: 'Elena Rostova' },
    { name: 'Devin Thorne' },
    { name: 'Chloe Price' }
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      {/* Page Header Component */}
      <PageHeader
        title="Design System & UI Component Library"
        subtitle="Standardized design tokens, accessible components, and responsive primitives for ProjectForge AI."
        badge={<Badge variant="indigo">v2.4 Production Standard</Badge>}
        breadcrumbs={[
          { label: 'Platform', href: '/dashboard' },
          { label: 'Design System' }
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon={<Code2 className="w-4 h-4" />}
              onClick={() => toast.info('Design tokens synchronized', { title: 'Tokens Exported' })}
            >
              Export Tokens
            </Button>
            <Button
              variant="glow"
              size="sm"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => {
                setBtnLoading(true);
                setTimeout(() => {
                  setBtnLoading(false);
                  toast.success('Interactive preview reloaded', { title: 'Refreshed' });
                }, 800);
              }}
              loading={btnLoading}
            >
              Simulate Interaction
            </Button>
          </div>
        }
      />

      {/* Tabs Component Demo */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <span>Interactive Navigation Tabs</span>
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/50">Style:</span>
            <Button
              size="sm"
              variant={activeTabStyle === 'pill' ? 'primary' : 'ghost'}
              onClick={() => setActiveTabStyle('pill')}
            >
              Pill
            </Button>
            <Button
              size="sm"
              variant={activeTabStyle === 'segmented' ? 'primary' : 'ghost'}
              onClick={() => setActiveTabStyle('segmented')}
            >
              Segmented
            </Button>
            <Button
              size="sm"
              variant={activeTabStyle === 'underline' ? 'primary' : 'ghost'}
              onClick={() => setActiveTabStyle('underline')}
            >
              Underline
            </Button>
          </div>
        </div>

        <Tabs
          variant={activeTabStyle}
          activeTab={activeTab}
          onChange={setActiveTab}
          tabs={[
            { id: 'components', label: 'All Components', count: 22 },
            { id: 'tokens', label: 'Design Tokens', count: 16 },
            { id: 'visuals', label: 'Visual Hierarchy', count: 5 },
            { id: 'responsive', label: 'Breakpoints & Layout' }
          ]}
        />
      </div>

      {/* SECTION 1: Buttons & Actions */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Buttons & Interaction States</span>
          <Badge variant="cyan" size="sm">Framer Motion + Spring</Badge>
        </h3>

        <Card variant="glass">
          <CardContent className="space-y-6 pt-6">
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Variants</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="glow" icon={<Sparkles className="w-4 h-4" />}>Glow Accent</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="danger" icon={<Trash2 className="w-4 h-4" />}>Danger</Button>
                <Button variant="primary" loading>Loading</Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Sizes</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm" variant="secondary">Small (sm)</Button>
                <Button size="md" variant="primary">Medium (md)</Button>
                <Button size="lg" variant="glow">Large (lg)</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 2: Badges, Avatars & Groups */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Badges & Avatars</span>
          <Badge variant="purple" size="sm">Identicon & Hash Gradients</Badge>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Badge Palette</CardTitle>
              <CardDescription>Status tags with curated subtle tints and border contrasts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2.5">
                <Badge variant="default">Default</Badge>
                <Badge variant="indigo">Indigo Active</Badge>
                <Badge variant="cyan">Cyan AI</Badge>
                <Badge variant="purple">Purple Studio</Badge>
                <Badge variant="success">Completed</Badge>
                <Badge variant="warning">In Review</Badge>
                <Badge variant="danger">Blocked</Badge>
                <Badge variant="outline">Outline</Badge>
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Avatars & Teammate Stacks</CardTitle>
              <CardDescription>Deterministic multi-color avatars with AvatarGroup overflow counter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar name="Sarah Chen" size="xs" />
                <Avatar name="Alex Vance" size="sm" />
                <Avatar name="Marcus Brody" size="md" />
                <Avatar name="Elena Rostova" size="lg" />
              </div>
              <div>
                <p className="text-xs text-white/40 mb-1.5 font-medium">AvatarGroup (max 4 displayed):</p>
                <AvatarGroup users={dummyUsers} max={4} size="md" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 3: Form Controls (Input & Select) */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Form Inputs & Selectors</span>
          <Badge variant="indigo" size="sm">Accessible + Keyboard Nav</Badge>
        </h3>

        <Card variant="default">
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <Input
              label="Search Projects"
              placeholder="e.g. Autonomous Drones, LLM Agents"
              icon={<Search className="w-4 h-4" />}
              helperText="Press Enter to execute global filter"
            />
            <Select
              label="Academic Department"
              options={[
                { value: 'cs', label: 'Computer Science & Engineering' },
                { value: 'ai', label: 'Artificial Intelligence & Robotics' },
                { value: 'ece', label: 'Electronics & Communication' },
                { value: 'mech', label: 'Mechanical Engineering' }
              ]}
            />
            <Input
              label="Repository URL"
              placeholder="https://github.com/..."
              error="Must be a valid GitHub or GitLab repository link"
              defaultValue="invalid-link"
            />
          </CardContent>
        </Card>
      </section>

      {/* SECTION 4: Cards & Glassmorphism Variants */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Card Variants</span>
          <Badge variant="cyan" size="sm">5 Specialized Visual Styles</Badge>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default Surface</CardTitle>
              <CardDescription>Deep dark `#0c0e17` with subtle white border</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-white/60">Standard container for dense dashboards and listings.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="ghost">Learn More</Button>
            </CardFooter>
          </Card>

          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glassmorphism</CardTitle>
              <CardDescription>Backdrop blur-xl with translucent tint</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-white/60">Elevated surface for modal overlays and prominent widgets.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="secondary">Inspect</Button>
            </CardFooter>
          </Card>

          <Card variant="gradient">
            <CardHeader>
              <CardTitle>Gradient Accent</CardTitle>
              <CardDescription>Indigo to purple subtle background glow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-white/60">Highlighted AI insights, milestones, and high-priority cards.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="glow">Action</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* SECTION 5: Progress Bars & Rings */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Progress Bars & Rings</span>
            <Badge variant="purple" size="sm">SVG + Real-time Animation</Badge>
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50">Simulate Value:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={progressVal}
              onChange={(e) => setProgressVal(Number(e.target.value))}
              className="accent-indigo-500 w-32 cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-indigo-400 w-8">{progressVal}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Progress Bars</CardTitle>
              <CardDescription>Linear bars with multiple color channels</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ProgressBar value={progressVal} label="Sprint Completion" color="gradient" />
              <ProgressBar value={Math.min(progressVal + 15, 100)} label="Milestones Approved" color="emerald" />
              <ProgressBar value={Math.max(progressVal - 20, 0)} label="Review Bandwidth" color="cyan" />
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Progress Rings</CardTitle>
              <CardDescription>Circular SVG indicators with custom radii</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-around py-2">
              <ProgressRing progress={progressVal} label="Velocity" variant="brand" size={100} />
              <ProgressRing progress={Math.min(progressVal + 10, 100)} label="Quality" variant="emerald" size={100} />
              <ProgressRing progress={Math.max(progressVal - 15, 0)} label="Review" variant="cyan" size={100} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 6: Pure Responsive SVG Charts */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Data Visualizations (Charts)</span>
          <Badge variant="cyan" size="sm">Zero Dependency Responsive SVGs</Badge>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card variant="bordered" className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly Commit & Contribution Velocity</CardTitle>
              <CardDescription>Area chart with gradient fill and data hover points</CardDescription>
            </CardHeader>
            <CardContent>
              <AreaChart data={areaData} height={200} color="#6366f1" />
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Domain Distribution</CardTitle>
              <CardDescription>Donut chart with interactive legends</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <DonutChart data={donutData} size={180} strokeWidth={24} />
            </CardContent>
          </Card>

          <Card variant="bordered" className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Skills & Project Categories</CardTitle>
              <CardDescription>Bar chart with rounded caps and scale markers</CardDescription>
            </CardHeader>
            <CardContent>
              <BarChart data={barData} height={180} />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 7: Data Table Component */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Responsive Data Table</span>
          <Badge variant="indigo" size="sm">Horizontal Scroll + High Contrast</Badge>
        </h3>

        <Card variant="bordered">
          <CardContent className="p-0 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project ID</TableHead>
                  <TableHead>Project Title</TableHead>
                  <TableHead>Team Lead</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs text-white/50">{row.id}</TableCell>
                    <TableCell className="font-semibold text-white">{row.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar name={row.lead} size="xs" />
                        <span className="text-white/80 text-xs">{row.lead}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.badge} size="sm">{row.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-28">
                        <ProgressBar value={row.progress} showValue={false} color={row.progress === 100 ? 'emerald' : 'indigo'} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dropdown
                        trigger={
                          <Button size="sm" variant="ghost" className="px-2">•••</Button>
                        }
                        items={[
                          { label: 'View Details', icon: <Eye className="w-4 h-4" />, onClick: () => toast.info(`Opening ${row.id}`, { title: 'Project Opened' }) },
                          { label: 'Edit Project', icon: <Edit className="w-4 h-4" />, onClick: () => toast.info(`Edit mode for ${row.id}`) },
                          { label: 'Archive', icon: <Trash2 className="w-4 h-4 text-rose-400" />, danger: true, onClick: () => toast.warning(`Archived ${row.id}`) }
                        ]}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 8: Dialogs, Drawers, Dropdowns & Toasts */}
      <section className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <span>Modals, Drawers, Dropdowns & Toasts</span>
          <Badge variant="purple" size="sm">Overlay System</Badge>
        </h3>

        <Card variant="glass">
          <CardContent className="space-y-6 pt-6">
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Modals & Drawers</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" onClick={() => setDialogOpen(true)}>
                  Open Standard Dialog
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDrawerPosition('right');
                    setDrawerOpen(true);
                  }}
                >
                  Open Right Drawer
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setDrawerPosition('bottom');
                    setDrawerOpen(true);
                  }}
                >
                  Open Bottom Sheet (Mobile)
                </Button>
                <Button variant="danger" onClick={() => setConfirmOpen(true)}>
                  Trigger Confirmation Dialog
                </Button>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Toast Notification Triggers</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-emerald-400 border-emerald-500/30"
                  icon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={() => toast.success('Changes successfully deployed to production', { title: 'Deployment Complete' })}
                >
                  Success Toast
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-rose-400 border-rose-500/30"
                  icon={<AlertTriangle className="w-4 h-4" />}
                  onClick={() => toast.error('Failed to authenticate token session', { title: 'Authorization Error' })}
                >
                  Error Toast
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-amber-400 border-amber-500/30"
                  icon={<AlertTriangle className="w-4 h-4" />}
                  onClick={() => toast.warning('Project milestone is due within 24 hours', { title: 'Deadline Approaching' })}
                >
                  Warning Toast
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="text-cyan-400 border-cyan-500/30"
                  icon={<Info className="w-4 h-4" />}
                  onClick={() => toast.info('AI model generated 4 new milestone recommendations', { title: 'AI Recommendation' })}
                >
                  Info Toast
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* SECTION 9: Empty States & Loading Skeletons */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Empty States & Shimmer Skeletons</span>
            <Badge variant="cyan" size="sm">Zero Layout Shift</Badge>
          </h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowSkeleton(!showSkeleton)}
          >
            {showSkeleton ? 'Show Content' : 'Simulate Loading Skeleton'}
          </Button>
        </div>

        {showSkeleton ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonTable rows={4} columns={3} />
          </div>
        ) : (
          <EmptyState
            icon={<FolderKanban className="w-7 h-7" />}
            title="No Architecture Blueprints Found"
            description="You haven't generated or saved any system design blueprints yet. Use the Architecture Studio to synthesize your tech stack."
            actionText="Launch Architecture Lab"
            actionIcon={<Sparkles className="w-4 h-4" />}
            onAction={() => toast.info('Redirecting to Architecture Studio...')}
          />
        )}
      </section>

      {/* Interactive Overlays */}
      <Dialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title="Project Milestone Configuration"
        description="Configure evaluation criteria and deliverables for the mid-term faculty review."
      >
        <DialogContent className="space-y-4">
          <Input label="Deliverable Name" defaultValue="System Architecture & Database Schema" />
          <Select
            label="Evaluation Weight"
            options={[
              { value: '20', label: '20% of Course Grade' },
              { value: '35', label: '35% of Course Grade' },
              { value: '50', label: '50% of Course Grade' }
            ]}
          />
        </DialogContent>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="primary"
            onClick={() => {
              setDialogOpen(false);
              toast.success('Milestone criteria updated', { title: 'Saved' });
            }}
          >
            Save Configuration
          </Button>
        </DialogFooter>
      </Dialog>

      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Teammate Skill Matrix"
        description="Real-time neural skill match analysis"
        position={drawerPosition}
        footer={
          <Button variant="glow" className="w-full" onClick={() => setDrawerOpen(false)}>
            Close Drawer
          </Button>
        }
      >
        <div className="space-y-4 py-2 text-sm text-white/70">
          <p>
            This drawer slides dynamically from the <strong className="text-white">{drawerPosition}</strong> viewport edge with smooth spring damping and escape key listeners.
          </p>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex justify-between text-xs">
              <span>Fullstack Architecture</span>
              <span className="font-bold text-indigo-400">94% Match</span>
            </div>
            <ProgressBar value={94} showValue={false} color="indigo" />
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex justify-between text-xs">
              <span>Deep Learning Heuristics</span>
              <span className="font-bold text-cyan-400">88% Match</span>
            </div>
            <ProgressBar value={88} showValue={false} color="cyan" />
          </div>
        </div>
      </Drawer>

      <ConfirmationDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          await new Promise((r) => setTimeout(r, 600));
          toast.success('Project permanently removed', { title: 'Deleted' });
        }}
        title="Delete Project Repository?"
        description="This action cannot be undone. All milestones, tasks, and telemetry data associated with this project will be deleted from the database."
        confirmText="Yes, Delete Project"
        variant="danger"
      />
    </div>
  );
};
