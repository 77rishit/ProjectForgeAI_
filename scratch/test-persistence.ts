// Comprehensive persistence verification test
const API_URL = 'http://localhost:5001/api';

async function runTests() {
  console.log('--- STARTING PERSISTENCE VERIFICATION SUITE ---');

  // 1. Authenticate as demo student
  console.log('\n[1/8] Authenticating demo student...');
  const loginRes = await fetch(`${API_URL}/auth/demo/student`);
  const loginData = await loginRes.json();
  if (!loginData.success && !loginData.token) {
    throw new Error('Failed to login as student: ' + JSON.stringify(loginData));
  }
  const token = loginData.data?.token || loginData.token;
  const user = loginData.data?.user || loginData.user;
  console.log(`✓ Authenticated as: ${user.name} (${user.email}) - ID: ${user._id}`);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // 2. Profile Persistence Test
  console.log('\n[2/8] Testing Profile Persistence (update -> get profile)...');
  const profileUpdates = {
    name: 'Rishit Patel',
    bio: 'Just Coding - AI & Distributed Systems Engineer',
    department: 'Computer Science & Engineering',
    semester: '5th Semester',
    skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'System Design'],
    programmingLanguages: ['TypeScript', 'Python', 'Go', 'Rust'],
    interests: ['Autonomous Agents', 'Distributed Consensus', 'Developer Tooling']
  };

  const updateProfileRes = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(profileUpdates)
  });
  const updateProfileData = await updateProfileRes.json();
  console.log('Update profile response success:', updateProfileData.success);

  // Verify fetch profile (simulating page refresh)
  const getProfileRes = await fetch(`${API_URL}/auth/me`, { headers });
  const getProfileData = await getProfileRes.json();
  const savedUser = getProfileData.data?.user || getProfileData.user;

  console.log(`Saved Name: "${savedUser.name}"`);
  console.log(`Saved Bio: "${savedUser.bio}"`);
  console.log(`Saved Languages: ${JSON.stringify(savedUser.programmingLanguages)}`);
  console.log(`Saved Skills: ${JSON.stringify(savedUser.skills)}`);

  if (savedUser.name !== 'Rishit Patel' || savedUser.bio !== 'Just Coding - AI & Distributed Systems Engineer') {
    throw new Error('Profile did not persist in MongoDB!');
  }
  console.log('✓ Profile successfully persisted in MongoDB');

  // 3. Project Creation & Persistence Test
  console.log('\n[3/8] Testing Project Creation & Persistence...');
  const newProject = {
    title: 'AI Resume Builder ' + Date.now().toString().slice(-4),
    description: 'AI-powered resume builder and ATS analyzer for university students.',
    category: 'AI / Career',
    technologies: ['React', 'Node.js', 'Python', 'FastAPI', 'MongoDB'],
    progress: 72,
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString()
  };

  const createProjRes = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newProject)
  });
  const createProjData = await createProjRes.json();
  const createdProject = createProjData.data?.project || createProjData.project;
  console.log(`✓ Project created with ID: ${createdProject._id}`);

  // Fetch all user projects (simulating dashboard reload)
  const getProjectsRes = await fetch(`${API_URL}/projects/my`, { headers });
  const getProjectsData = await getProjectsRes.json();
  const myProjects = getProjectsData.data?.projects || getProjectsData.projects || [];
  const foundProj = myProjects.find((p: any) => p._id === createdProject._id);

  if (!foundProj) {
    throw new Error('Created project not found in /projects/my!');
  }
  console.log(`✓ Project "${foundProj.title}" verified in database (Total user projects: ${myProjects.length})`);

  // 4. Project Edit & Persistence Test
  console.log('\n[4/8] Testing Project Edit & Persistence...');
  const editUpdates = {
    description: 'Updated description: Advanced generative AI career tool with real-time feedback.',
    progress: 88,
    status: 'in-progress',
    technologies: ['React', 'TypeScript', 'Node.js', 'PyTorch']
  };

  const updateProjRes = await fetch(`${API_URL}/projects/${createdProject._id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(editUpdates)
  });
  const updateProjData = await updateProjRes.json();
  console.log('Update project response success:', updateProjData.success);

  // Fetch single project to verify
  const getOneProjRes = await fetch(`${API_URL}/projects/${createdProject._id}`, { headers });
  const getOneProjData = await getOneProjRes.json();
  const verifiedProj = getOneProjData.data?.project || getOneProjData.project;

  console.log(`Updated Progress: ${verifiedProj.progress}% (Expected: 88%)`);
  console.log(`Updated Description: "${verifiedProj.description}"`);
  if (verifiedProj.progress !== 88 || !verifiedProj.description.includes('Advanced generative AI')) {
    throw new Error('Project edit was not persisted to MongoDB!');
  }
  console.log('✓ Project update successfully persisted in MongoDB');

  // 5. Task Creation & Status Persistence
  console.log('\n[5/8] Testing Task Creation & Status Persistence...');
  const newTask = {
    projectId: createdProject._id,
    title: 'Implement ATS Resume Parser',
    description: 'Create Python FastAPI service with pdfplumber and semantic matching.',
    priority: 'high',
    status: 'todo',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };

  const createTaskRes = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newTask)
  });
  const createTaskData = await createTaskRes.json();
  const createdTask = createTaskData.data?.task || createTaskData.task;
  console.log(`✓ Task created with ID: ${createdTask._id}`);

  // Update task status (e.g. dragging across Kanban)
  const updateTaskRes = await fetch(`${API_URL}/tasks/${createdTask._id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ status: 'in_progress' })
  });
  const updateTaskData = await updateTaskRes.json();

  // Verify fetch tasks
  const getTasksRes = await fetch(`${API_URL}/tasks/my-tasks`, { headers });
  const getTasksData = await getTasksRes.json();
  const tasksList = getTasksData.data?.tasks || getTasksData.tasks || [];
  const foundTask = tasksList.find((t: any) => t._id === createdTask._id);

  if (!foundTask || foundTask.status !== 'in_progress') {
    throw new Error('Task status update did not persist to MongoDB!');
  }
  console.log(`✓ Task "${foundTask.title}" verified in database with status: ${foundTask.status}`);

  // 6. Messages Persistence Test
  console.log('\n[6/8] Testing Messages Persistence...');
  const testChannel = 'project-general';
  const messageContent = 'Hello team, the new MongoDB persistence layer is active! Timestamp: ' + Date.now();

  const sendMsgRes = await fetch(`${API_URL}/messages/${testChannel}`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ content: messageContent })
  });
  const sendMsgData = await sendMsgRes.json();
  const sentMessage = sendMsgData.data?.message || sendMsgData.message;
  console.log(`✓ Message sent to channel "${testChannel}"`);

  // Fetch messages from database to verify persistence
  const getMsgsRes = await fetch(`${API_URL}/messages/${testChannel}`, { headers });
  const getMsgsData = await getMsgsRes.json();
  const channelMessages = getMsgsData.data?.messages || getMsgsData.messages || [];
  const foundMsg = channelMessages.find((m: any) => m.content === messageContent);

  if (!foundMsg) {
    throw new Error('Sent message not found in channel messages from MongoDB!');
  }
  console.log(`✓ Message verified in MongoDB channel: "${foundMsg.content.slice(0, 50)}..."`);

  // 7. Calendar Event Persistence Test
  console.log('\n[7/8] Testing Calendar Event Persistence...');
  const newEvent = {
    title: 'Sprint 4 Architecture Sync with Advisor',
    description: 'Review microservice schemas and data persistence rubrics.',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    time: '2:30 PM',
    location: 'Lab 402 / Zoom',
    type: 'checkpoint'
  };

  const createEventRes = await fetch(`${API_URL}/calendar`, {
    method: 'POST',
    headers,
    body: JSON.stringify(newEvent)
  });
  const createEventData = await createEventRes.json();
  console.log('createEventData status:', createEventRes.status, 'body:', JSON.stringify(createEventData));
  const createdEvent = createEventData.data?.event || createEventData.event;
  console.log(`✓ Calendar event created with ID: ${createdEvent?._id}`);

  // Fetch calendar events
  const getEventsRes = await fetch(`${API_URL}/calendar`, { headers });
  const getEventsData = await getEventsRes.json();
  const eventsList = getEventsData.data?.events || getEventsData.events || [];
  const foundEvent = eventsList.find((e: any) => e._id === createdEvent._id);

  if (!foundEvent) {
    throw new Error('Created calendar event not found in database!');
  }
  console.log(`✓ Calendar event "${foundEvent.title}" verified in MongoDB`);

  // 8. Settings & Preferences Persistence Test
  console.log('\n[8/8] Testing User Preferences & Settings Persistence...');
  const prefsUpdate = {
    preferences: {
      theme: 'dark',
      emailDigest: false,
      sprintAlerts: true,
      teammateInvites: true,
      profileVisible: true,
      aiSuggestions: true
    },
    lookingForTeam: true
  };

  const updatePrefsRes = await fetch(`${API_URL}/auth/profile`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(prefsUpdate)
  });
  const updatePrefsData = await updatePrefsRes.json();

  // Re-fetch user profile
  const verifyUserRes = await fetch(`${API_URL}/auth/me`, { headers });
  const verifyUserData = await verifyUserRes.json();
  const finalUser = verifyUserData.data?.user || verifyUserData.user;

  console.log(`Preferences: emailDigest=${finalUser.preferences?.emailDigest} (Expected: false)`);
  if (finalUser.preferences?.emailDigest !== false) {
    throw new Error('User preferences did not persist in MongoDB!');
  }
  console.log('✓ Preferences successfully verified in MongoDB');

  console.log('\n==================================================');
  console.log('🎉 ALL PERSISTENCE TESTS PASSED SUCCESSFULLY! 🎉');
  console.log('==================================================');
}

runTests().catch((err) => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
