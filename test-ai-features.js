/**
 * AI Features Test Suite
 * Tests all AI features to ensure they're working correctly
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Test configuration
const TEST_CONFIG = {
  contentGeneration: {
    prompt: "Create a beginner-level training module for solar panel installation safety procedures",
    language: "hi",
    domain: "solar",
    difficulty: "beginner",
    contentType: "text",
    includeImages: false,
    includeVideo: false,
    includeQuiz: true
  },
  chat: {
    messages: [
      {
        role: "user",
        content: "Hello! Can you help me understand solar panel safety?",
        timestamp: new Date()
      }
    ]
  },
  translation: {
    text: "Solar panels convert sunlight into electricity using photovoltaic cells.",
    targetLanguage: "hi",
    sourceLanguage: "en"
  },
  quiz: {
    content: "Solar panels are devices that convert sunlight into electricity. They consist of photovoltaic cells that generate direct current when exposed to light. Proper installation requires understanding electrical safety, structural requirements, and local building codes.",
    difficulty: "beginner",
    language: "en"
  },
  summarize: {
    content: "Solar energy is a renewable energy source that harnesses the power of the sun to generate electricity. Solar panels, made up of photovoltaic cells, convert sunlight into direct current electricity. This clean energy source helps reduce carbon emissions and provides a sustainable alternative to fossil fuels. Installation requires proper planning, safety measures, and compliance with local regulations.",
    language: "en",
    maxLength: 50
  }
};

// Test results tracking
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

// Utility function to make API calls
async function makeAPICall(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data: data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Test function wrapper
async function runTest(testName, testFunction) {
  console.log(`\n🧪 Running test: ${testName}`);
  testResults.total++;
  
  try {
    const result = await testFunction();
    if (result.success) {
      console.log(`✅ ${testName} - PASSED`);
      testResults.passed++;
      testResults.details.push({
        test: testName,
        status: 'PASSED',
        details: result.details || 'Test completed successfully'
      });
    } else {
      console.log(`❌ ${testName} - FAILED`);
      console.log(`   Error: ${result.error || 'Unknown error'}`);
      testResults.failed++;
      testResults.details.push({
        test: testName,
        status: 'FAILED',
        error: result.error || 'Unknown error'
      });
    }
  } catch (error) {
    console.log(`❌ ${testName} - FAILED`);
    console.log(`   Error: ${error.message}`);
    testResults.failed++;
    testResults.details.push({
      test: testName,
      status: 'FAILED',
      error: error.message
    });
  }
}

// Test 1: Server Health Check
async function testServerHealth() {
  const result = await makeAPICall('/ping');
  return {
    success: result.success && result.data?.message,
    details: result.data?.message || 'Server not responding'
  };
}

// Test 2: Content Generation
async function testContentGeneration() {
  const result = await makeAPICall('/ai/generate-content', 'POST', TEST_CONFIG.contentGeneration);
  
  if (result.success && result.data?.content) {
    return {
      success: true,
      details: `Generated content length: ${result.data.content.length} characters`
    };
  }
  
  return {
    success: false,
    error: result.data?.error || 'Content generation failed'
  };
}

// Test 3: Chat Functionality
async function testChatFunctionality() {
  const result = await makeAPICall('/ai/chat', 'POST', TEST_CONFIG.chat);
  
  if (result.success && result.data?.message?.content) {
    return {
      success: true,
      details: `Chat response length: ${result.data.message.content.length} characters`
    };
  }
  
  return {
    success: false,
    error: result.data?.error || 'Chat functionality failed'
  };
}

// Test 4: Translation
async function testTranslation() {
  const result = await makeAPICall('/ai/translate', 'POST', TEST_CONFIG.translation);
  
  if (result.success && result.data?.translatedText) {
    return {
      success: true,
      details: `Translated text: "${result.data.translatedText.substring(0, 50)}..."`
    };
  }
  
  return {
    success: false,
    error: result.data?.error || 'Translation failed'
  };
}

// Test 5: Quiz Generation
async function testQuizGeneration() {
  const result = await makeAPICall('/ai/generate-quiz', 'POST', TEST_CONFIG.quiz);
  
  if (result.success && result.data?.quiz) {
    return {
      success: true,
      details: `Quiz generated: ${result.data.quiz.length} characters`
    };
  }
  
  return {
    success: false,
    error: result.data?.error || 'Quiz generation failed'
  };
}

// Test 6: Content Summarization
async function testContentSummarization() {
  const result = await makeAPICall('/ai/summarize', 'POST', TEST_CONFIG.summarize);
  
  if (result.success && result.data?.summary) {
    return {
      success: true,
      details: `Summary: "${result.data.summary}"`
    };
  }
  
  return {
    success: false,
    error: result.data?.error || 'Summarization failed'
  };
}

// Test 7: API Error Handling
async function testAPIErrorHandling() {
  // Test with invalid data
  const result = await makeAPICall('/ai/generate-content', 'POST', {
    // Missing required fields
    language: "en"
  });
  
  // Should return error for invalid request
  return {
    success: !result.success, // We expect this to fail
    details: result.success ? 'Error handling not working' : 'Error handling working correctly'
  };
}

// Test 8: Frontend API Service (if running in browser)
async function testFrontendAPIService() {
  if (typeof window === 'undefined') {
    return {
      success: true,
      details: 'Skipped - Running in Node.js environment'
    };
  }
  
  try {
    // Test if API service is available
    if (typeof apiService !== 'undefined') {
      return {
        success: true,
        details: 'Frontend API service is available'
      };
    } else {
      return {
        success: false,
        error: 'Frontend API service not found'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting AI Features Test Suite');
  console.log('=====================================');
  
  // Check if server is running
  console.log('\n📡 Checking server status...');
  const serverCheck = await makeAPICall('/ping');
  if (!serverCheck.success) {
    console.log('❌ Server is not running. Please start the server first:');
    console.log('   npm run dev');
    return;
  }
  console.log('✅ Server is running');
  
  // Run all tests
  await runTest('Server Health Check', testServerHealth);
  await runTest('Content Generation', testContentGeneration);
  await runTest('Chat Functionality', testChatFunctionality);
  await runTest('Translation Service', testTranslation);
  await runTest('Quiz Generation', testQuizGeneration);
  await runTest('Content Summarization', testContentSummarization);
  await runTest('API Error Handling', testAPIErrorHandling);
  await runTest('Frontend API Service', testFrontendAPIService);
  
  // Print summary
  console.log('\n📊 Test Results Summary');
  console.log('========================');
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed}`);
  console.log(`Failed: ${testResults.failed}`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  // Print detailed results
  console.log('\n📋 Detailed Results');
  console.log('===================');
  testResults.details.forEach(test => {
    const status = test.status === 'PASSED' ? '✅' : '❌';
    console.log(`${status} ${test.test}`);
    if (test.details) console.log(`   ${test.details}`);
    if (test.error) console.log(`   Error: ${test.error}`);
  });
  
  // Recommendations
  console.log('\n💡 Recommendations');
  console.log('==================');
  if (testResults.failed > 0) {
    console.log('• Check your Gemini API key in the .env file');
    console.log('• Ensure the server is running on port 3000');
    console.log('• Verify all dependencies are installed');
    console.log('• Check server logs for detailed error messages');
  } else {
    console.log('• All AI features are working correctly! 🎉');
    console.log('• You can now use the application with full AI functionality');
  }
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runAllTests().catch(console.error);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAllTests,
    runTest,
    makeAPICall,
    TEST_CONFIG
  };
}
