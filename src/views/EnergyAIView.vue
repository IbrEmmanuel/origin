<template>
  <div class="energy-ai-page">
    <!-- Sidebar: Chat History -->
    <aside class="ai-sidebar" :class="{ 'sidebar-open': isSidebarOpen }">
      <div class="sidebar-header">
        <button @click="startNewChat" class="new-chat-btn">
          <PlusIcon class="icon-sm" />
          <span>New Chat</span>
        </button>
      </div>
      
      <div class="history-list">
        <div v-if="loadingHistory" class="loading-state">
          <div class="spinner"></div>
        </div>
        <div v-else-if="history.length === 0" class="empty-history">
          No past conversations
        </div>
        <div 
          v-for="chat in history" 
          :key="chat.id" 
          class="history-item"
          :class="{ active: currentConversationId === chat.id }"
          @click="loadConversation(chat.id)"
        >
          <MessageSquareIcon class="icon-xs" />
          <span class="chat-title">{{ chat.title || 'Untitled Chat' }}</span>
          <button @click.stop="confirmDelete(chat.id)" class="delete-chat-btn">
            <TrashIcon class="icon-xs" />
          </button>
        </div>
      </div>

      <div class="sidebar-footer">
        <router-link to="/account/dashboard" class="back-link">
          <ArrowLeftIcon class="icon-sm" />
          <span>Back to Dashboard</span>
        </router-link>
      </div>
    </aside>

    <!-- Overlay for mobile sidebar -->
    <div v-if="isSidebarOpen" class="sidebar-overlay" @click="isSidebarOpen = false"></div>

    <!-- Main Chat Area -->
    <main class="chat-container">
      <header class="chat-header">
        <div class="header-left">
          <button @click="isSidebarOpen = true" class="mobile-menu-btn">
            <MenuIcon class="icon-md" />
          </button>
          <router-link to="/" class="logo-link">
            <img src="../assets/logo.png" alt="Logo" class="logo-img" />
            <div class="brand-info">
              <span class="brand-text">ORIGIN ELECTRIC</span>
              <span class="brand-tagline">Power you can trust</span>
            </div>
          </router-link>
        </div>

        <div class="header-center">
          <div class="ai-badge">
            <SparklesIcon class="ai-icon-glow" />
            <span>Energy AI</span>
          </div>
        </div>

        <div class="header-right">
          <router-link to="/account" class="account-btn">
            <UserIcon class="icon-sm" />
            <span class="desktop-only">Account</span>
          </router-link>
        </div>
      </header>

      <!-- Messages Area -->
      <div class="messages-area" ref="messagesRef">
        <!-- Welcome Screen -->
        <div v-if="messages.length === 0" class="welcome-screen">
          <div class="welcome-icon">
            <SparklesIcon class="icon-xl" />
          </div>
          <h2>How can I help you?</h2>
          <p>Describe your issue or select a common problem below:</p>
          
          <div class="suggested-prompts">
            <button 
              v-for="prompt in suggestions" 
              :key="prompt" 
              @click="usePrompt(prompt)"
              class="prompt-card"
            >
              {{ prompt }}
            </button>
          </div>
        </div>

        <!-- Chat Messages -->
        <div 
          v-for="(msg, index) in messages" 
          :key="index" 
          class="message-wrapper"
          :class="msg.role"
        >
          <div class="message-bubble">
            <div class="message-content" v-html="formatMessage(msg.content)"></div>
            <div class="message-meta">
              {{ formatTime(msg.created_at) }}
            </div>
          </div>
        </div>

        <!-- AI Typing Indicator -->
        <div v-if="isTyping" class="message-wrapper assistant">
          <div class="message-bubble typing">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <footer class="chat-input-wrapper">
        <div class="chat-input-container">
          <form @submit.prevent="handleSend" class="input-form">
            <textarea 
              v-model="userInput" 
              placeholder="Start typing..."
              @keydown.enter.prevent="handleSend"
              rows="1"
              ref="inputRef"
              class="app-input"
            ></textarea>
            <button type="submit" :disabled="!userInput.trim() || isTyping" class="send-btn">
              <SendIcon v-if="!isTyping" class="icon-sm" />
              <div v-else class="spinner-sm"></div>
            </button>
          </form>
          <p class="input-disclaimer">
            Always consult a certified electrician for physical repairs.
          </p>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import { 
  Sparkles as SparklesIcon,
  MessageSquare as MessageSquareIcon,
  Plus as PlusIcon,
  Send as SendIcon,
  Trash2 as TrashIcon,
  Menu as MenuIcon,
  ArrowLeft as ArrowLeftIcon,
  User as UserIcon
} from 'lucide-vue-next';
import aiService from '@/services/ai.service';
import { marked } from 'marked';

const messages = ref([]);
const history = ref([]);
const userInput = ref('');
const currentConversationId = ref(null);
const isTyping = ref(false);
const loadingHistory = ref(false);
const isSidebarOpen = ref(false);
const messagesRef = ref(null);
const inputRef = ref(null);

const suggestions = [
  "Inverter beeping issue",
  "Batteries not charging",
  "System trips with AC",
  "Reduced backup time"
];

const fetchHistory = async () => {
  loadingHistory.value = true;
  try {
    history.value = await aiService.getHistory();
  } catch (error) {
    console.error('History Error:', error);
  } finally {
    loadingHistory.value = false;
  }
};

const startNewChat = () => {
  messages.value = [];
  currentConversationId.value = null;
  isSidebarOpen.value = false;
};

const loadConversation = async (id) => {
  if (currentConversationId.value === id) return;
  
  isTyping.value = false;
  try {
    const data = await aiService.getConversation(id);
    messages.value = data.messages;
    currentConversationId.value = id;
    scrollToBottom();
  } catch (error) {
    console.error('Load Conversation Error:', error);
  } finally {
    isSidebarOpen.value = false;
  }
};

const handleSend = async () => {
  if (!userInput.value.trim() || isTyping.value) return;

  const userMsg = userInput.value;
  userInput.value = '';
  
  messages.value.push({
    role: 'user',
    content: userMsg,
    created_at: new Date()
  });

  scrollToBottom();
  isTyping.value = true;

  try {
    const response = await aiService.sendMessage(userMsg, currentConversationId.value);
    
    if (!currentConversationId.value) {
      currentConversationId.value = response.conversation_id;
      fetchHistory(); 
    }

    messages.value.push({
      role: 'assistant',
      content: response.content,
      created_at: new Date()
    });
  } catch (error) {
    console.error('Send Error:', error);
    messages.value.push({
      role: 'assistant',
      content: "I apologize, but I encountered an error. Please try again.",
      created_at: new Date()
    });
  } finally {
    isTyping.value = false;
    scrollToBottom();
  }
};

const usePrompt = (prompt) => {
  userInput.value = prompt;
  handleSend();
};

const confirmDelete = async (id) => {
  if (confirm('Delete this conversation?')) {
    try {
      await aiService.deleteConversation(id);
      if (currentConversationId.value === id) {
        startNewChat();
      }
      fetchHistory();
    } catch (error) {
      alert('Failed to delete');
    }
  }
};

const formatMessage = (content) => {
  return marked(content);
};

const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight;
    }
  });
};

onMounted(() => {
  fetchHistory();
});

watch(userInput, () => {
  if (inputRef.value) {
    inputRef.value.style.height = 'auto';
    inputRef.value.style.height = (inputRef.value.scrollHeight) + 'px';
  }
});
</script>

<style scoped>
.energy-ai-page {
  display: flex;
  height: 100vh;
  background: var(--bg-primary);
  color: var(--text-primary);
  overflow: hidden;
}

/* Sidebar */
.ai-sidebar {
  width: 280px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  z-index: 100;
}

.sidebar-header {
  padding: 1.5rem;
}

.new-chat-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
  background: var(--bg-primary);
  color: var(--color-blue-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.new-chat-btn:hover {
  border-color: var(--color-blue-primary);
  background: var(--color-blue-light);
}

.history-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2px;
  color: var(--text-secondary);
}

.history-item:hover {
  background: var(--bg-primary);
  color: var(--text-primary);
}

.history-item.active {
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
  font-weight: 600;
}

.chat-title {
  font-size: 0.85rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.delete-chat-btn {
  opacity: 0;
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  padding: 4px;
}

.history-item:hover .delete-chat-btn {
  opacity: 1;
}

.sidebar-footer {
  padding: 1.25rem;
  border-top: 1px solid var(--border-color);
}

.back-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
}

/* Main Chat Container */
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100vh;
}

.chat-header {
  height: 70px;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
  background: var(--bg-primary);
  z-index: 10;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.logo-img {
  height: 32px;
  width: auto;
}

.brand-info {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-text {
  font-weight: 800;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.brand-tagline {
  font-size: 0.6rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.ai-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.ai-icon-glow {
  width: 14px;
  height: 14px;
  color: var(--color-blue-primary);
}

.account-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-weight: 700;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.account-btn:hover {
  background: var(--color-blue-primary);
  color: white;
  border-color: var(--color-blue-primary);
}

/* Messages Area */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 15% 100px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background: var(--bg-primary);
}

.welcome-screen {
  text-align: center;
  padding: 4rem 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.welcome-icon {
  width: 60px;
  height: 60px;
  background: var(--color-blue-light);
  color: var(--color-blue-primary);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.welcome-screen h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.welcome-screen p {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 2.5rem;
}

.suggested-prompts {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.prompt-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  font-size: 0.85rem;
  font-family: var(--font-main);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.prompt-card:hover {
  border-color: var(--color-blue-primary);
  background: var(--color-blue-light);
  transform: translateY(-2px);
}

.message-wrapper {
  display: flex;
}

.message-wrapper.user {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 80%;
  padding: 0.85rem 1.25rem;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.6;
}

.user .message-bubble {
  background: var(--color-blue-primary);
  color: white;
  border-bottom-right-radius: 4px;
}

.assistant .message-bubble {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  border-bottom-left-radius: 4px;
}

.message-meta {
  font-size: 0.7rem;
  margin-top: 5px;
  opacity: 0.6;
}

/* Form Styles */
.message-content :deep(p) { margin-bottom: 1rem; }
.message-content :deep(ul), .message-content :deep(ol) { margin-bottom: 1rem; padding-left: 1.5rem; }

/* Typing indicator */
.typing { display: flex; gap: 4px; padding: 10px 0; }
.typing .dot { width: 6px; height: 6px; background: var(--text-secondary); border-radius: 50%; animation: bounce 1.4s infinite; }
.typing .dot:nth-child(2) { animation-delay: 0.2s; }
.typing .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}

/* Input Area */
.chat-input-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem 0 2rem;
  background: linear-gradient(to top, var(--bg-primary) 80%, transparent);
}

.chat-input-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.input-form {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 6px;
  display: flex;
  align-items: flex-end;
  box-shadow: var(--shadow-sm);
}

.app-input {
  flex: 1;
  background: transparent;
  border: none;
  resize: none;
  padding: 10px 12px;
  color: var(--text-primary);
  font-family: var(--font-main);
  font-size: 0.95rem;
  max-height: 120px;
  min-height: 40px;
}

.app-input:focus {
  outline: none;
}

.send-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: var(--color-blue-primary);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 2px;
}

.send-btn:disabled {
  background: var(--border-color);
  cursor: not-allowed;
}

.input-disclaimer {
  font-size: 0.65rem;
  color: var(--text-secondary);
  text-align: center;
  margin-top: 10px;
}

/* Mobile Responsiveness */
.mobile-menu-btn {
  display: none;
  background: transparent;
  border: none;
  color: var(--text-primary);
}

@media (max-width: 850px) {
  .messages-area {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .ai-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    transform: translateX(-100%);
  }

  .ai-sidebar.sidebar-open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 95;
    backdrop-filter: blur(2px);
  }

  .mobile-menu-btn {
    display: block;
  }

  .header-center {
    display: none;
  }

  .suggested-prompts {
    grid-template-columns: 1fr;
  }

  .desktop-only {
    display: none;
  }

  .account-btn {
    width: 40px;
    height: 40px;
    padding: 0;
    justify-content: center;
    border-radius: 50%;
  }

  .header-left {
    gap: 10px;
  }

  .brand-text {
    font-size: 0.85rem;
  }
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-top-color: var(--color-blue-primary);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin: 1rem auto;
}

.spinner-sm {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
