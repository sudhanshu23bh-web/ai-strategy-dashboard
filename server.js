const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;
const VOTES_FILE = path.join(__dirname, 'votes.json');

// ===== LOAD/SAVE VOTES =====
function loadVotes() {
  try {
    if (fs.existsSync(VOTES_FILE)) {
      return JSON.parse(fs.readFileSync(VOTES_FILE, 'utf-8'));
    }
  } catch (e) { console.error('Error loading votes:', e); }
  return {};
}

function saveVotes(votes) {
  try {
    fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2), 'utf-8');
  } catch (e) { console.error('Error saving votes:', e); }
}

let votes = loadVotes();
let onlineUsers = new Map(); // ws -> username

// ===== SERVE STATIC FILES =====
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'AI_Strategy_Document_SHAREABLE.html'));
});

// REST API for votes (fallback if WebSocket fails)
app.get('/api/votes', (req, res) => {
  res.json({ votes, onlineCount: onlineUsers.size, onlineUsers: [...onlineUsers.values()] });
});

// ===== WEBSOCKET HANDLING =====
wss.on('connection', (ws) => {
  console.log(`✅ New client connected (Total: ${wss.clients.size})`);

  // Send current state to new client
  ws.send(JSON.stringify({
    type: 'init',
    votes: votes,
    onlineCount: wss.clients.size,
    onlineUsers: [...onlineUsers.values()]
  }));

  // Broadcast online count to all
  broadcastOnlineCount();

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());

      switch (msg.type) {
        case 'join': {
          // User identifies themselves
          onlineUsers.set(ws, msg.name);
          console.log(`👤 ${msg.name} joined`);
          broadcastOnlineCount();
          broadcast({ type: 'user_joined', name: msg.name, onlineCount: wss.clients.size, onlineUsers: [...onlineUsers.values()] });
          break;
        }

        case 'vote': {
          // User casts a vote
          const toolKey = '_voters_' + msg.tool;
          if (!votes[toolKey]) votes[toolKey] = [];

          const existingIdx = votes[toolKey].findIndex(v => v.name === msg.name);

          if (existingIdx > -1) {
            // Remove vote
            votes[toolKey].splice(existingIdx, 1);
            console.log(`❌ ${msg.name} removed vote from ${msg.tool}`);
          } else {
            // Add vote
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) +
              ' ' + now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
            votes[toolKey].push({ name: msg.name, time: timeStr });
            console.log(`✅ ${msg.name} voted for ${msg.tool}`);
          }

          votes[msg.tool] = votes[toolKey].length;
          saveVotes(votes);

          // Broadcast updated votes to ALL clients
          broadcast({
            type: 'vote_update',
            votes: votes,
            voter: msg.name,
            tool: msg.tool,
            action: existingIdx > -1 ? 'removed' : 'added'
          });
          break;
        }

        case 'remove_vote': {
          // Remove a specific person's vote
          const rKey = '_voters_' + msg.tool;
          if (votes[rKey]) {
            votes[rKey] = votes[rKey].filter(v => v.name !== msg.targetName);
            votes[msg.tool] = votes[rKey].length;
            saveVotes(votes);
            broadcast({
              type: 'vote_update',
              votes: votes,
              voter: msg.targetName,
              tool: msg.tool,
              action: 'removed'
            });
            console.log(`🗑 ${msg.targetName}'s vote removed from ${msg.tool} by ${msg.name}`);
          }
          break;
        }
      }
    } catch (e) {
      console.error('WebSocket message error:', e);
    }
  });

  ws.on('close', () => {
    const name = onlineUsers.get(ws) || 'Unknown';
    onlineUsers.delete(ws);
    console.log(`👋 ${name} disconnected (Total: ${wss.clients.size})`);
    broadcastOnlineCount();
    broadcast({ type: 'user_left', name, onlineCount: wss.clients.size, onlineUsers: [...onlineUsers.values()] });
  });
});

function broadcast(data) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

function broadcastOnlineCount() {
  broadcast({
    type: 'online_count',
    count: wss.clients.size,
    users: [...onlineUsers.values()]
  });
}

// ===== START SERVER =====
server.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║   🚀 AI Strategy Dashboard - Live Server        ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║   🌐 URL: http://localhost:${PORT}                  ║`);
  console.log('║   📊 Real-time voting is ACTIVE                 ║');
  console.log('║   🔗 Share this URL with your team!             ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
});
