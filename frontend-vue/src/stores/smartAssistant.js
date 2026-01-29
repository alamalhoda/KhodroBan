import { defineStore } from 'pinia';
import { ref } from 'vue';
import { aiService } from '../services';

// Simple unique ID generator for messages
let nextId = 0;

export const useSmartAssistantStore = defineStore('smartAssistant', () => {
  // State
  const messages = ref([
    {
      id: nextId++,
      role: 'ai',
      text: 'سلام! 👋 من آماده‌ام تا در مورد خودروی شما کمک کنم. می‌تونید درباره زمان سرویس‌ها، صداهای غیرعادی موتور یا هزینه‌های احتمالی از من بپرسید.',
      timestamp: new Date(),
    }
  ]);
  const isLoading = ref(false);
  const error = ref(null);

  // Actions
  async function sendMessage(prompt) {
    if (!prompt || prompt.trim() === '') return;

    // 1. Add user message to state
    const userMessage = {
      id: nextId++,
      role: 'user',
      text: prompt,
      timestamp: new Date(),
    };
    messages.value.push(userMessage);

    // 2. Set loading state and clear previous errors
    isLoading.value = true;
    error.value = null;

    // Add a temporary "typing" message for the AI
    const typingMessage = {
      id: nextId++,
      role: 'ai',
      typing: true,
      timestamp: new Date(),
    };
    messages.value.push(typingMessage);

    try {
      // 3. Call the AI service
      const aiResponse = await aiService.analyzeCarIssue({ prompt });

      // 4. Replace the typing message with the actual AI response
      const aiMessage = {
        id: typingMessage.id, // Use the same ID to replace
        role: 'ai',
        text: aiResponse.text,
        timestamp: new Date(),
        groundingChunks: aiResponse.groundingChunks,
        typing: false,
      };

      const typingIndex = messages.value.findIndex(m => m.id === typingMessage.id);
      if (typingIndex !== -1) {
        messages.value.splice(typingIndex, 1, aiMessage);
      } else {
        // Fallback in case the typing message wasn't found (should not happen)
        messages.value.push(aiMessage);
      }

    } catch (err) {
      // 5. Handle errors
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      error.value = errorMessage;

      // Replace the typing message with an error message
      const aiErrorMessage = {
        id: typingMessage.id,
        role: 'ai',
        text: 'متاسفانه مشکلی در ارتباط با هوش مصنوعی رخ داده است. لطفاً دوباره تلاش کنید.',
        isError: true,
        timestamp: new Date(),
        typing: false,
      };
      const typingIndex = messages.value.findIndex(m => m.id === typingMessage.id);
      if (typingIndex !== -1) {
        messages.value.splice(typingIndex, 1, aiErrorMessage);
      }

      throw err; // Re-throw for the component to handle if needed
    } finally {
      // 6. Reset loading state
      isLoading.value = false;
    }
  }

  return {
    // State
    messages,
    isLoading,
    error,
    // Actions
    sendMessage,
  };
});
