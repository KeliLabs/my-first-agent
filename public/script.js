document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chatForm');
    const messageInput = document.getElementById('message');
    const providerSelect = document.getElementById('provider');
    const responseDiv = document.getElementById('response');
    const submitButton = chatForm.querySelector('button[type="submit"]');

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const message = messageInput.value.trim();
        if (!message) {
            showError('Please enter a message');
            return;
        }

        const provider = providerSelect.value;
        
        // Show loading state
        showLoading(provider);
        submitButton.disabled = true;
        
        try {
            console.log(`Sending message: "${message}" to provider: ${provider}`);
            
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message, provider })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'An error occurred');
            }
            
            const providerName = getProviderDisplayName(provider);
            showResponse(providerName, data.response);
            
        } catch (error) {
            showError(error.message);
        } finally {
            submitButton.disabled = false;
        }
    });

    function showLoading(provider) {
        const providerName = getProviderDisplayName(provider);
        responseDiv.style.display = 'block';
        responseDiv.className = 'response loading';
        responseDiv.innerHTML = `🤖 Thinking... (using ${providerName})`;
    }

    function showResponse(providerName, responseText) {
        responseDiv.style.display = 'block';
        responseDiv.className = 'response';
        // const htmlContent = marked.parse(responseText);
        // Parse markdown to HTML
        let htmlContent;
        try {
            htmlContent = marked.parse(responseText);
        } catch (error) {
            // Fallback to plain text if markdown parsing fails
            htmlContent = responseText.replace(/\n/g, '<br>');
        }
        responseDiv.innerHTML = `<strong>🤖 ${providerName}:</strong><div class="markdown-content">${htmlContent}</div>`;
        // responseDiv.innerHTML = `<strong>🤖 ${providerName}:</strong> ${responseText}`;
    }

    function showError(errorMessage) {
        responseDiv.style.display = 'block';
        responseDiv.className = 'response error';
        responseDiv.innerHTML = `<strong>❌ Error:</strong> ${errorMessage}`;
    }

    function getProviderDisplayName(provider) {
        switch (provider) {
            case 'openai':
                return 'OpenAI GPT';
            case 'gemini':
                return 'Google Gemini';
            default:
                return 'AI Assistant';
        }
    }

    // Auto-focus on message input
    messageInput.focus();

    // Allow Ctrl+Enter to submit form
    messageInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });
});
