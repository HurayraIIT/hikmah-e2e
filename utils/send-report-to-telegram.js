import axios from "axios";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  try {
    console.log("Starting Telegram report process...");
    console.log("Environment check:", {
      hasToken: !!process.env.TELEGRAM_BOT_TOKEN,
      hasChannelId: !!process.env.TELEGRAM_CHANNEL_ID,
      isCI: !!process.env.CI,
    });

    // Read the JSON report
    const reportPath = "./test-results/summary.json"; // Use correct path
    console.log("Checking report path:", reportPath);

    if (!fs.existsSync(reportPath)) {
      throw new Error(`Report file not found at ${reportPath}`);
    }

    console.log("Reading report file...");
    const reportData = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
    console.log("Report data structure:", Object.keys(reportData));

    // Initialize test summary details
    let total = 0,
      passed = 0,
      failed = 0,
      flaky = 0,
      skipped = 0;

    // Extract stats directly from the report data
    if (!reportData.stats) {
      console.error("Full report data:", JSON.stringify(reportData, null, 2));
      throw new Error("Invalid JSON report structure: 'stats' is missing.");
    }

    total = reportData.stats.expected + reportData.stats.unexpected;
    passed = reportData.stats.expected;
    failed = reportData.stats.unexpected;
    flaky = reportData.stats.flaky;
    skipped = reportData.stats.skipped;

    // Determine if running in CI or locally
    const isCI = process.env.CI ? true : false;
    const environmentInfo = isCI ? "🏭 CI Environment" : "💻 Local Environment";

    // Format message
    console.log("Formatting message...");
    const message = `
📊 *Test Execution Report*
━━━━━━━━━━━━━━━━━━━━━

${environmentInfo}
🕰️ *Time*: ${new Date()
      .toLocaleString("en-US", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(/,/g, "")
      .replace(/ at /g, ", ")}

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
    console.log("Sending message to Telegram...");
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
      const response = await axios.post(url, {
        chat_id: process.env.TELEGRAM_CHANNEL_ID,
        text: message,
        parse_mode: "Markdown",
      });
      console.log("Message sent successfully:", response.data);
    } catch (error) {
      console.error("Telegram API error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  } catch (error) {
    console.error("Error in report process:", error);
    process.exit(1); // Ensure the GitHub Action fails if we encounter an error
  }
})();
