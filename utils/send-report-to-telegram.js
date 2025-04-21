import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  try {
    // Read the JSON report
    const reportPath = "./test-results/summary.json"; // Use correct path
    const reportData = JSON.parse(fs.readFileSync(reportPath, "utf-8"));

    // Initialize test summary details
    let total = 0,
      passed = 0,
      failed = 0,
      flaky = 0,
      skipped = 0;

    // Extract stats directly from the report data
    if (reportData.stats) {
      total = reportData.stats.expected + reportData.stats.unexpected;
      passed = reportData.stats.expected;
      failed = reportData.stats.unexpected;
      flaky = reportData.stats.flaky;
      skipped = reportData.stats.skipped;
    } else {
      throw new Error("Invalid JSON report structure: 'stats' is missing.");
    }

    // Determine if running in CI or locally
    const isCI = process.env.CI ? true : false;
    const environmentInfo = isCI ? "🏭 CI Environment" : "💻 Local Environment";

    // Format message
    const message = `
📊 *Test Execution Report*
━━━━━━━━━━━━━━━━━━━━━

${environmentInfo}
🕰️ *Time*: ${new Date().toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(/,/g, '').replace(/ at /g, ', ')}

📈 *Test Results*
• Total Tests: ${total} 🧪
• Passed: ${passed} ✅
• Failed: ${failed} ❌
• Flaky: ${flaky} 🫨
• Skipped: ${skipped} ⏭️

🔗 *Detailed Report*
${isCI ? "🌐 CI Report" : "📋 Local Report"}: https://hikmah-e2e.hurayraiit.com
━━━━━━━━━━━━━━━━━━━━━`;

    // Send message to Telegram
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: process.env.TELEGRAM_CHANNEL_ID,
      text: message,
      parse_mode: "Markdown"
    });

    console.log("Message sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending report to Telegram:", error.message);
  }
})();
